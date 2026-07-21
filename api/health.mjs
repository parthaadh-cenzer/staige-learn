// ============================================================================
//  GET /api/health            → env presence (booleans only)
//  GET /api/health?deep=1     → also verifies each Stripe Price resolves under
//                               the configured key, and reports the key's mode
//
//  A safe production diagnostic. It reports WHETHER each required variable is
//  set and WHETHER each Price ID resolves — it never returns a secret value, a
//  full Price ID, a key, or a token. The keys in the response are ENV VAR NAMES
//  (public knowledge), not their contents.
//
//  This is how you confirm, from the browser, that the deployed function can see
//  every variable it needs — without anyone printing the values. Remove or gate
//  this endpoint once launch is settled if you'd rather not expose the shape of
//  your configuration.
// ============================================================================
import { presentEnv, hasAppUrl } from './_lib/env.mjs'
import { stripe } from './_lib/clients.mjs'
import { PRODUCTS } from '../shared/catalog.mjs'

// The vars the paid flow needs. SUPABASE_URL and APP_URL are handled specially
// below (each accepts a fallback), so they aren't in this plain list.
const REQUIRED = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_JOB_HUNTER_INTRO',
  'STRIPE_PRICE_JOB_HUNTER_REGULAR',
  'STRIPE_PRICE_MARKETING_INTRO',
  'STRIPE_PRICE_MARKETING_REGULAR',
  'STRIPE_PRICE_SIDE_HUSTLE_INTRO',
  'STRIPE_PRICE_SIDE_HUSTLE_REGULAR',
  'SUPABASE_SERVICE_ROLE_KEY',
]

export default async function handler(req, res) {
  const env = presentEnv(REQUIRED)
  // The URL is public and accepted under either name.
  env.SUPABASE_URL = Boolean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL)
  // APP_URL resolves via the Vercel-provided production domain if unset. Also
  // report whether APP_URL itself is set explicitly, for transparency.
  env.APP_URL = hasAppUrl()
  env.APP_URL_explicit = Boolean(process.env.APP_URL)

  // Keys ending in _explicit are informational, not requirements.
  const missing = Object.entries(env)
    .filter(([name, present]) => !present && !name.endsWith('_explicit'))
    .map(([name]) => name)
  const out = { ok: missing.length === 0, missing, env, checkedAt: new Date().toISOString() }

  // Deep check: prove the Price IDs are valid for THIS key (i.e. same account
  // and same mode). A test-mode key with a live Price ID — the classic cause of
  // a checkout 500 — shows up here as ok:false on those prices.
  if (req.query?.deep && !missing.includes('STRIPE_SECRET_KEY')) {
    const keyMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')
      ? 'live'
      : process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')
        ? 'test'
        : 'unknown'
    const prices = {}
    for (const product of Object.values(PRODUCTS)) {
      for (const tier of ['intro', 'regular']) {
        const name = product.priceEnv[tier]
        const id = process.env[name]
        if (!id) { prices[name] = { configured: false }; continue }
        try {
          const p = await stripe().prices.retrieve(id)
          // Report shape, never the id value or amount specifics beyond cents.
          prices[name] = {
            configured: true,
            resolves: true,
            livemode: p.livemode,
            active: p.active,
            unitAmount: p.unit_amount,
            currency: p.currency,
          }
        } catch (err) {
          prices[name] = { configured: true, resolves: false, error: err?.code || err?.type || 'error' }
        }
      }
    }
    out.stripe = { keyMode, prices }
  }

  // Never cache a health probe.
  res.setHeader('Cache-Control', 'no-store')
  return res.status(out.ok ? 200 : 503).json(out)
}
