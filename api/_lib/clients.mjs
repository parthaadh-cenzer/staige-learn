// Stripe + Supabase server clients. Server-only — see _lib/env.mjs.
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { requireEnv } from './env.mjs'

let _stripe
export function stripe() {
  if (!_stripe) {
    _stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-10-29.clover',
      // Vercel functions are short-lived and Stripe's default agent keeps
      // sockets around longer than the container lives.
      maxNetworkRetries: 2,
    })
  }
  return _stripe
}

// The service-role client bypasses RLS. It exists so the webhook can write
// entitlements that no user is allowed to write themselves. It must never be
// constructed with a request-supplied value, and its key must never be sent to
// the browser.
let _admin
export function supabaseAdmin() {
  if (!_admin) {
    _admin = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return _admin
}

// Verifies a caller's Supabase access token and returns the user it belongs to,
// or null. This is how an API route learns WHO is calling: from a signed JWT
// Supabase issued, never from a user id in the request body.
export async function userFromAuthHeader(req) {
  const header = req.headers.authorization || req.headers.Authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return null

  const { data, error } = await supabaseAdmin().auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}

// Server-enforced admin check. Reads the `admins` table with the service-role
// key — a table the browser can only READ its own row of and can never write
// (see migration 0003). Admin authority therefore lives in the database, not in
// client state, an email string, or a hidden UI element.
export async function isAdminUser(userId) {
  if (!userId) return false
  const { data } = await supabaseAdmin()
    .from('admins').select('user_id').eq('user_id', userId).maybeSingle()
  return Boolean(data)
}

// Guard for future admin-only endpoints: returns the authenticated admin user,
// or null. An endpoint calls this and 403s on null — no admin route exists yet,
// but every one that does must gate on the database, and this is how.
export async function requireAdmin(req) {
  const user = await userFromAuthHeader(req)
  if (!user) return null
  return (await isAdminUser(user.id)) ? user : null
}
