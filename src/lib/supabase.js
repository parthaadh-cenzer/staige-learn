// Browser Supabase client.
//
// Only the ANON key belongs here. It is designed to be public: every table it
// can reach is protected by Row Level Security (see supabase/migrations/), so
// what it can actually read is decided by the database, not by this file. The
// service-role key must never appear in src/ — Vite inlines any VITE_-prefixed
// variable straight into the bundle, which is why the service key is not one.
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The site is public and mostly browsable signed-out. If Supabase isn't wired up
// yet, the marketing pages should still render — the auth UI reports that
// accounts are unavailable rather than the whole app failing to boot.
export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[staige] Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local — see .env.example.'
  )
}

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        // This is what makes a login survive a refresh and a closed tab:
        // the session is written to localStorage and the access token is
        // refreshed in the background before it expires.
        persistSession: true,
        autoRefreshToken: true,
        // Needed for the /reset-password link, which arrives as a URL fragment.
        detectSessionInUrl: true,
        storageKey: 'staige-auth',
      },
    })
  : null

// The access token to send to our own API routes. Reading it through getSession()
// (rather than caching it) means we always send a fresh, unexpired token.
export async function accessToken() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || null
}

// Thin wrapper for calling our serverless functions as the signed-in user.
export async function apiPost(path, body) {
  const token = await accessToken()
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    // Carry the server's safe error code + request id so the UI can show a
    // useful hint and a support report can be tied to a Vercel log line. These
    // are non-secret by construction (see api/checkout.mjs).
    const err = new Error(data.error || 'Something went wrong. Please try again.')
    err.code = data.code || null
    err.requestId = data.requestId || null
    err.status = res.status
    throw err
  }
  return data
}
