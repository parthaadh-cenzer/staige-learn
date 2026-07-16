import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Single source of truth, persisted to localStorage. -------------------------
// NOTE: this store holds only runtime progress and is intentionally decoupled
// from course content. Course-derived helpers (progress %, next lesson, …) live
// in src/course/progress.js and take a hydrated course as input, so the same
// store works across every course in the Launchpad.
export const useStore = create(
  persist(
    (set, get) => ({
      name: '',
      onboarded: false,
      completed: [], // lesson ids
      lastLessonId: null,
      worksheets: {}, // { worksheetId: { fieldId: value } }
      checklists: {}, // { checklistId: [bool,...] }
      quizzes: {}, // { quizId: selectedIndex }
      scorecards: {}, // { id: { source: number } }
      trackers: {}, // { id: [values] }
      pathResults: {}, // { id: 'A'|'B'|'C' }
      // Starred prompts. Keyed `"<courseSlug>:<promptId>"` because prompt ids
      // restart at 1 in every course — a bare id would collide across them.
      favoritePrompts: [],
      challenge: {}, // { day: { fieldId: value } }
      challengeComplete: [], // [dayNumbers]
      seenBadges: [], // ids of badges already celebrated
      celebratedModules: [], // moduleIds whose completion modal was shown

      // Which account this local copy last belonged to. `null` means it was
      // built signed-out, so the first sign-in MERGES it upward (that's the
      // migration). If a *different* account signs in on this device, the local
      // copy is theirs, not the newcomer's, and is replaced rather than merged —
      // otherwise two people sharing a laptop would inherit each other's
      // progress. See course/progressSync.js.
      syncedUserId: null,
      setSyncedUserId: (id) => set({ syncedUserId: id }),

      setName: (name) => set({ name }),
      finishOnboarding: (name) => set({ name, onboarded: true }),

      isLessonDone: (id) => get().completed.includes(id),
      completeLesson: (id) =>
        set((s) => ({
          completed: s.completed.includes(id) ? s.completed : [...s.completed, id],
          lastLessonId: id,
        })),
      uncompleteLesson: (id) =>
        set((s) => ({ completed: s.completed.filter((x) => x !== id) })),
      setLastLesson: (id) => set({ lastLessonId: id }),

      setWorksheetField: (wid, fid, value) =>
        set((s) => ({ worksheets: { ...s.worksheets, [wid]: { ...(s.worksheets[wid] || {}), [fid]: value } } })),

      toggleChecklistItem: (cid, index, count) =>
        set((s) => {
          const arr = s.checklists[cid] ? [...s.checklists[cid]] : Array(count).fill(false)
          arr[index] = !arr[index]
          return { checklists: { ...s.checklists, [cid]: arr } }
        }),

      resetChecklist: (cid) =>
        set((s) => {
          const { [cid]: _drop, ...rest } = s.checklists
          return { checklists: rest }
        }),

      setQuizAnswer: (qid, index) =>
        set((s) => ({ quizzes: { ...s.quizzes, [qid]: index } })),

      setScore: (id, source, value) =>
        set((s) => ({ scorecards: { ...s.scorecards, [id]: { ...(s.scorecards[id] || {}), [source]: value } } })),

      setTrackerDay: (id, dayIndex, value, days) =>
        set((s) => {
          const arr = s.trackers[id] ? [...s.trackers[id]] : Array(days).fill('')
          arr[dayIndex] = value
          return { trackers: { ...s.trackers, [id]: arr } }
        }),

      setPathResult: (id, result) =>
        set((s) => ({ pathResults: { ...s.pathResults, [id]: result } })),

      togglePromptFavorite: (key) =>
        set((s) => ({
          favoritePrompts: s.favoritePrompts.includes(key)
            ? s.favoritePrompts.filter((k) => k !== key)
            : [...s.favoritePrompts, key],
        })),

      setChallengeField: (day, fid, value) =>
        set((s) => ({ challenge: { ...s.challenge, [day]: { ...(s.challenge[day] || {}), [fid]: value } } })),
      toggleChallengeDay: (day) =>
        set((s) => ({
          challengeComplete: s.challengeComplete.includes(day)
            ? s.challengeComplete.filter((d) => d !== day)
            : [...s.challengeComplete, day],
        })),

      markBadgeSeen: (id) =>
        set((s) => (s.seenBadges.includes(id) ? s : { seenBadges: [...s.seenBadges, id] })),
      markModuleCelebrated: (mid) =>
        set((s) => (s.celebratedModules.includes(mid) ? s : { celebratedModules: [...s.celebratedModules, mid] })),

      resetAll: () =>
        set({
          completed: [], lastLessonId: null, worksheets: {}, checklists: {}, quizzes: {},
          scorecards: {}, trackers: {}, pathResults: {}, favoritePrompts: [], challenge: {},
          challengeComplete: [], seenBadges: [], celebratedModules: [],
        }),
    }),
    { name: 'ai-side-hustle-os' }
  )
)
