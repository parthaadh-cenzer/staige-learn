// Server-only environment access.
//
// Files under api/ run exclusively on Vercel's Node runtime. Nothing here is
// reachable from the browser bundle: Vite only inlines variables prefixed
// VITE_, and none of these are. Do not import this module from src/.
//
// Everything is read lazily through requireEnv() so that a missing variable
// fails as a clean, identifiable error on the one request that needed it,
// rather than crashing every function at cold start.

// Thrown when a required variable is absent. Carries the variable NAME (never a
// value) so callers can log exactly what's misconfigured and map it to a safe
// HTTP response — see api/checkout.mjs.
export class MissingEnvError extends Error {
  constructor(name) {
    super(`Missing required environment variable: ${name}`)
    this.name = 'MissingEnvError'
    this.code = 'ENV_MISSING'
    this.envVar = name
  }
}

export function requireEnv(name) {
  const value = process.env[name]
  if (!value) throw new MissingEnvError(name)
  return value
}

export const optionalEnv = (name) => process.env[name] || null

// The Supabase project URL is PUBLIC (it's in the browser bundle as
// VITE_SUPABASE_URL). Requiring it a second time under SUPABASE_URL is a
// footgun — set one, forget the other, and every server call 500s. So the
// server accepts either name for the URL. The service-role KEY has no such
// fallback: it is a secret and must never be a VITE_ var.
export function supabaseUrl() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  if (!url) throw new MissingEnvError('SUPABASE_URL')
  return url
}

// Presence-only report for a diagnostics endpoint: { NAME: boolean }. Returns
// whether each var is set, NEVER its value.
export function presentEnv(names) {
  return Object.fromEntries(names.map((n) => [n, Boolean(process.env[n])]))
}

// The only host we will ever hand to Stripe as a redirect target. Taking this
// from configuration rather than from the request means a forged Host header
// can't turn our Checkout Session into an open redirect.
export function appUrl() {
  return requireEnv('APP_URL').replace(/\/+$/, '')
}
