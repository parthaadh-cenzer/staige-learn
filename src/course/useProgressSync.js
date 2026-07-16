// Wires the zustand store to Supabase. Mounted once, inside <AuthProvider>.
//
// Signed out, this does nothing at all and the app behaves exactly as it did
// before accounts existed — localStorage only. Signed in, the local store stays
// the working copy and Supabase becomes the durable one.
import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { useAuth } from '../auth/AuthProvider'
import { syncProgress, pushAnswers } from './progressSync'

const PUSH_DEBOUNCE_MS = 1500

export default function useProgressSync() {
  const { user } = useAuth()
  const userId = user?.id || null
  const synced = useRef(null)
  const timer = useRef(null)

  // ── Pull + merge on sign-in ──────────────────────────────────────────────
  useEffect(() => {
    if (!userId || synced.current === userId) return
    let cancelled = false

    ;(async () => {
      const local = useStore.getState()
      // Merge only when this local copy is ours to merge: either it was built
      // signed-out (the migration case) or it already belongs to this account.
      const merge = local.syncedUserId === null || local.syncedUserId === userId
      const next = await syncProgress(userId, local, { merge })
      if (cancelled || !next) return // failed pull → local data stands
      // setState merges at the top level, so actions and untouched fields survive.
      useStore.setState(next)
      synced.current = userId
    })()

    return () => { cancelled = true }
  }, [userId])

  // ── Push on change ───────────────────────────────────────────────────────
  // One debounced writer for everything: pushAnswers carries the answer blob and
  // syncProgress's union rules handle the per-course rows. Typing in a worksheet
  // shouldn't fire a request per keystroke.
  useEffect(() => {
    if (!userId) return
    const unsub = useStore.subscribe((state) => {
      if (synced.current !== userId) return // don't push before the merge lands
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        syncProgress(userId, state).catch(() => {})
        pushAnswers(userId, state).catch(() => {})
      }, PUSH_DEBOUNCE_MS)
    })
    return () => { clearTimeout(timer.current); unsub() }
  }, [userId])

  // Sign-out resets the guard so the next account pulls its own progress rather
  // than inheriting the previous one's merge.
  useEffect(() => { if (!userId) synced.current = null }, [userId])
}
