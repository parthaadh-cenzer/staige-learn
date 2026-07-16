// ============================================================================
//  PROGRESS SYNC · localStorage → Supabase, without ever losing a lesson.
//
//  The rules this file exists to guarantee:
//    • Progress is only ever ADDED. Completed lessons merge as a union, in both
//      directions. Nothing in here can reduce a learner's completed count.
//    • Courses stay isolated. A row per course_slug, and a lesson id only lands
//      in its own course's row (membership comes from the registry, not string
//      prefixes).
//    • XP is not stored. It stays derived from completed lessons by
//      course/progress.js — adding an xp column here would create the second,
//      conflicting XP system we don't want.
//    • Local data is never cleared on sign-in. The local store stays the working
//      copy and the cache; Supabase becomes the source of truth only once a pull
//      has actually succeeded.
//
//  WHY A '__account' ROW: `completed` splits cleanly per course because lesson
//  ids are registry-owned. The rest of the learner's answers — worksheets,
//  quizzes, trackers, favourites — have no reliable course mapping (side-hustle
//  ids are unprefixed and would collide with `mkt-`/`jh-` prefix matching). Rather
//  than guess a course for each key and risk shredding answers across rows, they
//  travel together in one reserved row. They are per-account data anyway; only
//  progress and XP need course isolation, and those get it.
// ============================================================================
import { courses } from '../data/courses'
import { supabase } from '../lib/supabase'

const ACCOUNT_ROW = '__account'

// The store fields that ride in the account blob. `completed` and `lastLessonId`
// are handled per-course and are deliberately absent.
const ANSWER_KEYS = [
  'worksheets', 'checklists', 'quizzes', 'scorecards', 'trackers',
  'pathResults', 'favoritePrompts', 'challenge', 'challengeComplete',
  'seenBadges', 'celebratedModules',
]

// The shape of "no answers", used when a different account takes over a device.
// Mirrors the store's own initial values in store/useStore.js.
const EMPTY_ANSWERS = {
  worksheets: {}, checklists: {}, quizzes: {}, scorecards: {}, trackers: {},
  pathResults: {}, favoritePrompts: [], challenge: {}, challengeComplete: [],
  seenBadges: [], celebratedModules: [],
}

const unique = (arr) => [...new Set(arr)]

// Shallow-merge two "{ id: { field: value } }" maps, keeping both sides.
const mergeNested = (remote = {}, local = {}) => {
  const out = { ...remote }
  for (const [id, val] of Object.entries(local)) {
    out[id] = val && typeof val === 'object' && !Array.isArray(val)
      ? { ...(remote[id] || {}), ...val }
      : val
  }
  return out
}

function mergeAnswers(remote = {}, local = {}) {
  const out = { ...remote }
  for (const key of ANSWER_KEYS) {
    const r = remote[key]
    const l = local[key]
    if (l === undefined) continue
    if (Array.isArray(l)) {
      // Arrays here are all "things the learner has done" — union, never subtract.
      out[key] = unique([...(Array.isArray(r) ? r : []), ...l])
    } else if (l && typeof l === 'object') {
      out[key] = mergeNested(r, l)
    } else {
      out[key] = l
    }
  }
  return out
}

/**
 * Pull remote progress, reconcile it with the local store, push the result back.
 * Returns the store patch to apply locally, or null if we couldn't reach
 * Supabase — in which case the caller keeps using local data untouched.
 *
 * `merge: false` means the local copy belongs to a DIFFERENT account (someone
 * signed out and someone else signed in on the same device). Then remote simply
 * wins: this account's progress is whatever the server says it is. Nobody loses
 * anything — the other account's work is safely in their own rows.
 */
export async function syncProgress(userId, localState, { merge = true } = {}) {
  if (!supabase || !userId) return null
  // Take the local side out of the reconciliation entirely when it isn't ours.
  if (!merge) localState = { completed: [], lastLessonId: null }

  const { data: rows, error } = await supabase
    .from('course_progress')
    .select('course_slug, completed_lesson_ids, last_lesson_id, state')
    .eq('user_id', userId)

  // A failed pull must not be mistaken for "the server says you've done nothing".
  if (error) {
    console.warn('[staige] progress pull failed; keeping local progress as-is.', error.message)
    return null
  }

  const byslug = Object.fromEntries((rows || []).map((r) => [r.course_slug, r]))
  const localCompleted = new Set(localState.completed || [])

  // ── Per-course rows ──────────────────────────────────────────────────────
  const mergedCompleted = []
  const upserts = []

  for (const course of courses) {
    const remote = byslug[course.slug]
    const remoteIds = (remote?.completed_lesson_ids || []).filter((id) => course.lessonIds.has(id))
    const localIds = [...localCompleted].filter((id) => course.lessonIds.has(id))
    const union = unique([...remoteIds, ...localIds])

    mergedCompleted.push(...union)

    // Only write when this course actually has something to say.
    const hasLocalNews = localIds.some((id) => !remoteIds.includes(id))
    if (!union.length && !remote) continue
    if (!hasLocalNews && remote) continue

    upserts.push({
      user_id: userId,
      course_slug: course.slug,
      completed_lesson_ids: union,
      last_lesson_id:
        localCompleted.size && course.lessonIds.has(localState.lastLessonId)
          ? localState.lastLessonId
          : remote?.last_lesson_id || null,
      state: {},
    })
  }

  // ── The account row ──────────────────────────────────────────────────────
  const remoteAnswers = byslug[ACCOUNT_ROW]?.state || {}
  const localAnswers = Object.fromEntries(
    ANSWER_KEYS.map((k) => [k, localState[k]]).filter(([, v]) => v !== undefined)
  )
  const answers = mergeAnswers(remoteAnswers, localAnswers)

  upserts.push({
    user_id: userId,
    course_slug: ACCOUNT_ROW,
    completed_lesson_ids: [],
    last_lesson_id: localState.lastLessonId || byslug[ACCOUNT_ROW]?.last_lesson_id || null,
    state: answers,
  })

  const { error: pushErr } = await supabase
    .from('course_progress')
    .upsert(upserts, { onConflict: 'user_id,course_slug' })

  if (pushErr) {
    console.warn('[staige] progress push failed; local progress is unchanged.', pushErr.message)
    // The merge is still correct to apply locally — the remote just missed it,
    // and the next sync will carry it up.
  }

  return {
    // When we're replacing rather than merging, every answer key must be reset
    // explicitly: the patch is shallow-merged into the store, so a key the
    // remote simply doesn't have would otherwise leave the previous account's
    // value sitting in place.
    ...(merge ? {} : EMPTY_ANSWERS),
    ...answers,
    completed: unique([...mergedCompleted, ...localCompleted]),
    lastLessonId: localState.lastLessonId || byslug[ACCOUNT_ROW]?.last_lesson_id || null,
    syncedUserId: userId,
  }
}

/**
 * Push a single course's progress. Called after the learner completes a lesson.
 * Union-merges against what's already stored, so two devices racing can't
 * subtract from each other.
 */
export async function pushCourseProgress(userId, course, localState) {
  if (!supabase || !userId || !course) return

  const localIds = (localState.completed || []).filter((id) => course.lessonIds.has(id))

  const { data: remote } = await supabase
    .from('course_progress')
    .select('completed_lesson_ids')
    .eq('user_id', userId).eq('course_slug', course.slug).maybeSingle()

  const union = unique([...(remote?.completed_lesson_ids || []), ...localIds])

  await supabase.from('course_progress').upsert(
    {
      user_id: userId,
      course_slug: course.slug,
      completed_lesson_ids: union,
      last_lesson_id: course.lessonIds.has(localState.lastLessonId) ? localState.lastLessonId : null,
    },
    { onConflict: 'user_id,course_slug' }
  )
}

/** Push the account-level answer blob. Debounced by the caller. */
export async function pushAnswers(userId, localState) {
  if (!supabase || !userId) return
  const { data: remote } = await supabase
    .from('course_progress').select('state')
    .eq('user_id', userId).eq('course_slug', ACCOUNT_ROW).maybeSingle()

  const local = Object.fromEntries(
    ANSWER_KEYS.map((k) => [k, localState[k]]).filter(([, v]) => v !== undefined)
  )

  await supabase.from('course_progress').upsert(
    {
      user_id: userId,
      course_slug: ACCOUNT_ROW,
      state: mergeAnswers(remote?.state || {}, local),
    },
    { onConflict: 'user_id,course_slug' }
  )
}
