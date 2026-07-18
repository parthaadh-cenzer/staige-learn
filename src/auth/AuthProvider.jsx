// ============================================================================
//  AUTH + ENTITLEMENTS · one provider, mounted above the router.
//
//  Holds the Supabase session, the learner's profile, and the set of course
//  slugs they own. Entitlements are read from `course_access` through RLS — the
//  browser asks "what do I own?" and the database answers only with rows that
//  belong to the caller. A tampered client can lie to itself about this; it
//  cannot make the server agree, which is why the paywall does not depend on it.
// ============================================================================
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  // `loading` is true until we know whether there IS a session. Gating on it is
  // what stops a signed-in learner seeing a flash of "Sign in" on every refresh.
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [owned, setOwned] = useState(null) // Set<courseSlug> | null while unknown
  const [admin, setAdmin] = useState(false)
  const mounted = useRef(true)

  // Setting this back to true on mount is load-bearing, not belt-and-braces.
  // StrictMode mounts, unmounts and remounts every effect in development; a ref
  // survives that, so a cleanup-only version of this leaves `mounted.current`
  // stuck at false after the first remount. Every async setState below then
  // bails out, `loading` never clears, and the whole app sits on a spinner.
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    if (!supabase) return

    // The .catch is load-bearing. If Supabase is unreachable — an outage, a
    // wrong URL, a learner on a plane — this promise rejects, and without a
    // catch `loading` would stay true forever and every gated page would spin
    // for good. Failing here means "we don't know who you are", which is just
    // signed-out: the public site keeps working and sign-in reports the error.
    supabase.auth.getSession()
      .then(({ data }) => {
        if (!mounted.current) return
        setSession(data.session ?? null)
      })
      .catch((err) => console.warn('[staige] could not read auth session:', err?.message))
      .finally(() => { if (mounted.current) setLoading(false) })

    // Fires on sign-in, sign-out, token refresh, and password-recovery links.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!mounted.current) return
      setSession(next)
      setLoading(false)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const user = session?.user ?? null
  const userId = user?.id ?? null

  // ── Profile ──────────────────────────────────────────────────────────────
  const loadProfile = useCallback(async () => {
    if (!supabase || !userId) return setProfile(null)
    const { data } = await supabase
      .from('profiles').select('id, display_name, email, avatar_url')
      .eq('user_id', userId).maybeSingle()
    if (mounted.current) setProfile(data ?? null)
  }, [userId])

  // ── Entitlements ─────────────────────────────────────────────────────────
  const loadEntitlements = useCallback(async () => {
    if (!supabase || !userId) return setOwned(null)
    const { data, error } = await supabase
      .from('course_access')
      .select('courses(slug)')
      .is('revoked_at', null)

    if (!mounted.current) return
    // On error, own nothing rather than everything. Failing closed matters more
    // than a friendly degradation here.
    setOwned(new Set(error ? [] : (data || []).map((r) => r.courses?.slug).filter(Boolean)))
  }, [userId])

  // ── Admin ──────────────────────────────────────────────────────────────────
  // Read-only: RLS lets a user see their OWN admin row and nothing else, and
  // there's no write policy, so this reflects a server-set fact — it can't be
  // spoofed from the client. It gates UI affordances only; any real admin
  // action must re-check on the server (api/_lib/clients.mjs#requireAdmin).
  const loadAdmin = useCallback(async () => {
    if (!supabase || !userId) return setAdmin(false)
    const { data } = await supabase.from('admins').select('user_id').eq('user_id', userId).maybeSingle()
    if (mounted.current) setAdmin(Boolean(data))
  }, [userId])

  useEffect(() => {
    if (!userId) { setProfile(null); setOwned(null); setAdmin(false); return }
    loadProfile()
    loadEntitlements()
    loadAdmin()
  }, [userId, loadProfile, loadEntitlements, loadAdmin])

  const value = useMemo(
    () => ({
      configured: isSupabaseConfigured,
      loading,
      session,
      user,
      profile,
      // null → not known yet (signed out, or still loading).
      ownedSlugs: owned,
      ownsCourse: (slug) => Boolean(owned?.has(slug)),
      isAdmin: admin,
      refreshProfile: loadProfile,
      refreshEntitlements: loadEntitlements,
      signOut: () => supabase?.auth.signOut(),
    }),
    [loading, session, user, profile, owned, admin, loadProfile, loadEntitlements]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
