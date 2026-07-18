// ============================================================================
//  POST /api/verify-checkout   →  { entitled, courseSlug?, status }
//
//  Body: { sessionId: 'cs_...' }
//  Auth: Authorization: Bearer <supabase access token>
//
//  A SECURE, server-side reconciliation fallback. The Stripe webhook is the
//  primary granter; this exists for the case where the success page is open but
//  the webhook is delayed (or, in a misconfigured deploy, hasn't fired). It
//  grants access on exactly the same terms as the webhook — a real, paid Stripe
//  session — never on the strength of the redirect.
//
//  Why it can't be abused:
//    · Requires a valid Supabase JWT (the caller's identity).
//    · Fetches the session FROM STRIPE, then refuses it unless the session's
//      own client_reference_id / metadata says it belongs to THIS user. So
//      submitting someone else's session id grants nothing.
//    · Grants only when Stripe reports payment_status = 'paid', and only for a
//      Price on the server's approved list (via fulfillPaidSession).
//    · Idempotent — the same upserts the webhook uses, so a poll racing the
//      webhook produces one purchase and one entitlement, not two.
// ============================================================================
import { stripe, supabaseAdmin, userFromAuthHeader } from './_lib/clients.mjs'
import { fulfillPaidSession } from './_lib/fulfillment.mjs'

const json = (res, status, body) => res.status(status).json(body)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }

  try {
    const user = await userFromAuthHeader(req)
    if (!user) return json(res, 401, { error: 'You need to be signed in.' })

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId : null
    if (!sessionId || !sessionId.startsWith('cs_')) return json(res, 400, { error: 'Missing session id.' })

    // Ask Stripe what this session actually is. Never trust the client's word.
    let session
    try {
      session = await stripe().checkout.sessions.retrieve(sessionId)
    } catch {
      return json(res, 404, { error: 'Checkout session not found.' })
    }

    // OWNERSHIP: the session must belong to the caller. A stranger's session id
    // is rejected here, before anything is granted.
    const sessionUser = session.metadata?.supabase_user_id || session.client_reference_id
    if (sessionUser !== user.id) return json(res, 403, { error: 'This checkout session isn’t yours.' })

    // Grant iff paid + approved price. fulfillPaidSession is idempotent and is
    // the same code the webhook runs.
    const result = await fulfillPaidSession(supabaseAdmin(), session)
    if (result.granted) return json(res, 200, { entitled: true, courseSlug: result.courseSlug })

    // Paid via a delayed method, still settling — tell the page to keep waiting.
    return json(res, 200, { entitled: false, status: session.payment_status || 'pending' })
  } catch (err) {
    console.error('[verify-checkout] failed:', err?.message)
    // A paid-but-unapproved price throws inside fulfillPaidSession; that's our
    // configuration problem, not something to explain to the buyer.
    return json(res, 500, { error: 'We could not confirm this payment yet. Please try again shortly.' })
  }
}
