// ============================================================================
//  POST /api/checkout   →  { url }
//
//  Body: { productKey: 'side-hustle' | 'marketing' | 'job-hunter' }
//  Auth: Authorization: Bearer <supabase access token>
//
//  The body carries a product key and nothing else. No amount, no Price ID, no
//  user id — the amount comes from the server's price table, and the identity
//  comes from the signed JWT. Creating a session grants nothing on its own;
//  access is written later by the webhook, after Stripe confirms payment.
// ============================================================================
import { stripe, supabaseAdmin, userFromAuthHeader } from './_lib/clients.mjs'
import { resolveActivePrice } from './_lib/pricing.mjs'
import { appUrl } from './_lib/env.mjs'

const json = (res, status, body) => res.status(status).json(body)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }

  try {
    // ── Who is asking? Only a valid Supabase JWT answers this. ──────────────
    const user = await userFromAuthHeader(req)
    if (!user) return json(res, 401, { error: 'You need to be signed in to buy a course.' })

    // ── What are they asking for? A key from our own list, or nothing. ──────
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const productKey = typeof body.productKey === 'string' ? body.productKey : null
    if (!productKey) return json(res, 400, { error: 'Missing productKey.' })

    let product, tier, priceId
    try {
      ;({ product, tier, priceId } = resolveActivePrice(productKey))
    } catch {
      // Unknown key, or the Price ID for this product isn't configured yet. Both
      // are our problem, not something to explain to the buyer in detail.
      return json(res, 400, { error: 'That course is not available for purchase right now.' })
    }

    const db = supabaseAdmin()

    const { data: course, error: courseErr } = await db
      .from('courses').select('id, slug, title, status')
      .eq('slug', product.courseSlug).maybeSingle()

    if (courseErr) throw courseErr
    if (!course) return json(res, 400, { error: 'That course is not available for purchase right now.' })
    if (course.status !== 'active') {
      // Coming Soon courses have no products and must never be sellable.
      return json(res, 400, { error: 'That course has not launched yet.' })
    }

    // ── Already owns it? Don't take their money twice. ──────────────────────
    const { data: existing } = await db
      .from('course_access').select('id')
      .eq('user_id', user.id).eq('course_id', course.id).is('revoked_at', null)
      .maybeSingle()

    if (existing) return json(res, 200, { alreadyOwned: true, courseSlug: course.slug })

    // ── Reuse this learner's Stripe customer if we've seen them before. ─────
    const { data: profile } = await db
      .from('profiles').select('id, stripe_customer_id, display_name')
      .eq('user_id', user.id).maybeSingle()

    let customerId = profile?.stripe_customer_id || null
    if (!customerId) {
      const customer = await stripe().customers.create({
        email: user.email,
        name: profile?.display_name || undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await db.from('profiles').update({ stripe_customer_id: customerId }).eq('user_id', user.id)
    }

    // ── The session. Metadata is written on BOTH the session and the payment
    //    intent: refund events arrive against the payment intent and would
    //    otherwise have no idea which user or course they belong to.
    const metadata = {
      supabase_user_id: user.id,
      product_key: product.key,
      course_slug: course.slug,
      course_id: course.id,
      price_tier: tier,
    }

    const session = await stripe().checkout.sessions.create(
      {
        mode: 'payment',
        customer: customerId,
        client_reference_id: user.id,
        line_items: [{ price: priceId, quantity: 1 }],
        metadata,
        payment_intent_data: { metadata },
        // Both URLs are built from APP_URL, never from the request. `course` is
        // there so the success page knows which entitlement to wait for — it is
        // a display hint that the page re-verifies against the database, never a
        // grant.
        success_url: `${appUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}&course=${encodeURIComponent(course.slug)}`,
        cancel_url: `${appUrl()}/checkout/cancel?course=${encodeURIComponent(course.slug)}`,
        allow_promotion_codes: false,
      },
      // A double-clicked buy button shouldn't create two sessions.
      { idempotencyKey: `checkout:${user.id}:${product.key}:${tier}` }
    )

    return json(res, 200, { url: session.url })
  } catch (err) {
    // Never leak Stripe/Postgres internals to the browser.
    console.error('[checkout] failed:', err)
    return json(res, 500, { error: 'We could not start checkout. Please try again.' })
  }
}
