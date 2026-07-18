// ============================================================================
//  FULFILLMENT · the one place a paid Stripe session becomes access.
//
//  Both the webhook (event-driven, primary) and /api/verify-checkout (poll
//  fallback for a delayed webhook) call fulfillPaidSession. Having a single
//  granter means the two paths can never diverge: the same price-authority
//  check, the same purchase record, the same idempotent upserts.
//
//  Idempotent by construction:
//    · purchases      upsert on stripe_checkout_session_id
//    · course_access  upsert on (user_id, course_id)
//  A retried webhook, a poll racing the webhook, and the reconcile endpoint all
//  converge on exactly one purchase row and one entitlement row.
//
//  Access is granted from the price ACTUALLY PAID (looked up against the
//  server's approved list), never from session metadata — so tampered metadata
//  cannot unlock a course nobody paid for.
// ============================================================================
import { stripe } from './clients.mjs'
import { productForPriceId } from './pricing.mjs'

// Upsert the purchase row. Returns the row id (or null when we can't yet tie the
// session to a user+course, e.g. a still-pending delayed payment).
async function recordPurchase(db, session, { status, priceId, productId, courseId, productKey, userId }) {
  const uid = userId || session.metadata?.supabase_user_id || session.client_reference_id
  const cid = courseId || session.metadata?.course_id
  if (!uid || !cid) return null

  const { data, error } = await db.from('purchases').upsert(
    {
      user_id: uid,
      course_id: cid,
      product_key: productKey || session.metadata?.product_key || null,
      stripe_customer_id:
        typeof session.customer === 'string' ? session.customer : session.customer?.id || null,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || null,
      stripe_product_id: productId || null,
      stripe_price_id: priceId || null,
      amount_paid_cents: session.amount_total ?? null,
      currency: session.currency || 'usd',
      status,
    },
    { onConflict: 'stripe_checkout_session_id' }
  ).select('id').maybeSingle()

  if (error) throw error
  return data
}

/**
 * Record + grant for a checkout session. Returns:
 *   { granted: true, courseSlug }             — access is now in place
 *   { granted: false, reason: 'not_paid' }    — delayed payment still pending
 * Throws for genuinely broken cases (no line item, a paid Price we don't sell,
 * a session with no user) so the webhook marks the event failed and the
 * reconcile endpoint surfaces a clean error.
 */
export async function fulfillPaidSession(db, session) {
  // Not paid yet (e.g. a delayed payment method). Record the intent so it isn't
  // invisible and wait for the async_payment_succeeded event / a later poll.
  if (session.payment_status !== 'paid') {
    await recordPurchase(db, session, { status: 'pending' })
    return { granted: false, reason: 'not_paid' }
  }

  // What did they ACTUALLY pay for? Ask Stripe, not the request body.
  const items = await stripe().checkout.sessions.listLineItems(session.id, {
    limit: 5,
    expand: ['data.price.product'],
  })
  const price = items.data[0]?.price
  const priceId = price?.id
  const productId = typeof price?.product === 'string' ? price.product : price?.product?.id || null
  if (!priceId) throw new Error(`Session ${session.id} has no line item price`)

  const approved = productForPriceId(priceId)
  if (!approved) {
    // A Price we do not sell. Record the payment so finance can see it, but grant
    // nothing — this is exactly the case where blind trust would be the bug.
    await recordPurchase(db, session, { status: 'paid', priceId, productId })
    throw new Error(`Price ${priceId} is not an approved price — access NOT granted for session ${session.id}`)
  }

  // The course is derived from the paid Price. Metadata is never consulted here.
  const { data: course, error: courseErr } = await db
    .from('courses').select('id, slug').eq('slug', approved.product.courseSlug).maybeSingle()
  if (courseErr) throw courseErr
  if (!course) throw new Error(`No course row for slug ${approved.product.courseSlug}`)

  const userId = session.metadata?.supabase_user_id || session.client_reference_id
  if (!userId) throw new Error(`Session ${session.id} has no supabase user id`)

  const purchase = await recordPurchase(db, session, {
    status: 'paid',
    priceId,
    productId,
    courseId: course.id,
    productKey: approved.product.key,
    userId,
  })

  // The entitlement. `revoked_at: null` un-revokes a previously refunded course
  // if the same learner buys it again. `source: 'purchase'` is the established
  // paid source (0002); it's distinct from owner_access/admin_grant/manual/gift,
  // so a paid grant is always distinguishable from an administrative one.
  const { error: accessErr } = await db.from('course_access').upsert(
    {
      user_id: userId,
      course_id: course.id,
      source: 'purchase',
      purchase_id: purchase?.id || null,
      granted_at: new Date().toISOString(),
      revoked_at: null,
    },
    { onConflict: 'user_id,course_id' }
  )
  if (accessErr) throw accessErr

  return { granted: true, courseSlug: course.slug }
}
