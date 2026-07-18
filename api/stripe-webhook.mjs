// ============================================================================
//  POST /api/stripe-webhook
//
//  The single authority for granting and revoking course access. Nothing else in
//  the codebase writes `course_access` — not the success page, not the client,
//  not /api/checkout. If Stripe didn't say it happened, it didn't happen.
//
//  Three defences, in order:
//    1. SIGNATURE — the raw body is verified against STRIPE_WEBHOOK_SECRET, so
//       an attacker who knows this URL still cannot forge a payment.
//    2. IDEMPOTENCY — every event id is claimed in `webhook_events` before it is
//       processed. Stripe retries aggressively; a replay is a no-op.
//    3. PRICE VALIDATION — access is granted based on the Price that was
//       ACTUALLY PAID, looked up against the server's approved price list. The
//       course is derived from that Price, not from session metadata, so
//       tampered metadata cannot unlock a course nobody paid for.
// ============================================================================
import { stripe, supabaseAdmin } from './_lib/clients.mjs'
import { fulfillPaidSession } from './_lib/fulfillment.mjs'
import { requireEnv } from './_lib/env.mjs'

// Stripe signs the exact bytes it sent. Any reserialisation — which is what
// Vercel's default JSON body parser does — invalidates the signature.
export const config = { api: { bodyParser: false } }

function rawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // ── 1 · Signature ────────────────────────────────────────────────────────
  let event
  try {
    const body = await rawBody(req)
    event = stripe().webhooks.constructEvent(
      body,
      req.headers['stripe-signature'],
      requireEnv('STRIPE_WEBHOOK_SECRET')
    )
  } catch (err) {
    console.error('[webhook] signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook signature verification failed` })
  }

  const db = supabaseAdmin()

  // ── 2 · Idempotency ──────────────────────────────────────────────────────
  // Claim the event id first. The unique constraint on stripe_event_id means two
  // concurrent deliveries race here and exactly one wins.
  const { error: claimErr } = await db
    .from('webhook_events')
    .insert({ stripe_event_id: event.id, type: event.type, status: 'processing' })

  if (claimErr) {
    if (claimErr.code === '23505') {
      // Already seen. Ack so Stripe stops retrying.
      return res.status(200).json({ received: true, duplicate: true })
    }
    console.error('[webhook] could not record event:', claimErr)
    // Fail loudly: without the ledger we cannot promise idempotency, and a 500
    // makes Stripe retry rather than silently drop a real payment.
    return res.status(500).json({ error: 'Could not record event' })
  }

  // ── 3 · Handle ───────────────────────────────────────────────────────────
  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const result = await fulfillPaidSession(db, event.data.object)
        if (result.granted) console.log(`[webhook] granted ${result.courseSlug} (session ${event.data.object.id})`)
        break
      }

      case 'checkout.session.async_payment_failed':
        await markFailed(db, { sessionId: event.data.object.id })
        break

      case 'payment_intent.payment_failed':
        await markFailed(db, { paymentIntentId: event.data.object.id })
        break

      case 'charge.refunded':
        await handleRefund(db, event.data.object)
        break

      default:
        // Acknowledged and ignored — we only subscribe to what we act on.
        break
    }

    await db.from('webhook_events')
      .update({ status: 'processed', processed_at: new Date().toISOString() })
      .eq('stripe_event_id', event.id)

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error(`[webhook] ${event.type} (${event.id}) failed:`, err)
    await db.from('webhook_events')
      .update({ status: 'failed', error: String(err?.message || err).slice(0, 500) })
      .eq('stripe_event_id', event.id)

    // 500 → Stripe retries. The row above is already marked failed, and the
    // retry will collide on stripe_event_id and be treated as a duplicate, so a
    // genuinely broken event needs manual replay from the dashboard. That is the
    // intended trade: never grant access twice, never grant it by accident.
    return res.status(500).json({ error: 'Handler failed' })
  }
}

async function markFailed(db, { sessionId, paymentIntentId }) {
  const q = db.from('purchases').update({ status: 'failed' })
  const { error } = sessionId
    ? await q.eq('stripe_checkout_session_id', sessionId).neq('status', 'paid')
    : await q.eq('stripe_payment_intent_id', paymentIntentId).neq('status', 'paid')
  if (error) throw error
}

// ── Refunded ────────────────────────────────────────────────────────────────
async function handleRefund(db, charge) {
  // Partial refunds don't end access.
  if (!charge.refunded) return

  const pi = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id
  if (!pi) return

  const { data: purchase, error } = await db
    .from('purchases').select('id, user_id, course_id')
    .eq('stripe_payment_intent_id', pi).maybeSingle()
  if (error) throw error
  if (!purchase) return

  await db.from('purchases').update({ status: 'refunded' }).eq('id', purchase.id)

  // Only revoke if this was their ONLY route to the course. Someone who bought
  // it twice, or was granted it manually, keeps their access.
  const { data: stillPaid } = await db
    .from('purchases').select('id')
    .eq('user_id', purchase.user_id).eq('course_id', purchase.course_id)
    .eq('status', 'paid').limit(1)

  if (stillPaid?.length) return

  const { data: access } = await db
    .from('course_access').select('id, source')
    .eq('user_id', purchase.user_id).eq('course_id', purchase.course_id).maybeSingle()

  if (!access || access.source !== 'purchase') return

  await db.from('course_access')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', access.id)

  console.log(`[webhook] revoked course ${purchase.course_id} for ${purchase.user_id} after refund`)
}
