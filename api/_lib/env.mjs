// Server-only environment access.
//
// Files under api/ run exclusively on Vercel's Node runtime. Nothing here is
// reachable from the browser bundle: Vite only inlines variables prefixed
// VITE_, and none of these are. Do not import this module from src/.
//
// Everything is read lazily through requireEnv() so that a missing variable
// fails as a clean 500 on the one request that needed it, rather than crashing
// every function at cold start.

export function requireEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export const optionalEnv = (name) => process.env[name] || null

// The only host we will ever hand to Stripe as a redirect target. Taking this
// from configuration rather than from the request means a forged Host header
// can't turn our Checkout Session into an open redirect.
export function appUrl() {
  return requireEnv('APP_URL').replace(/\/+$/, '')
}
