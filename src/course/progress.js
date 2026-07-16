// Course-aware progress helpers (pure functions over a hydrated course + the
// global `completed` lesson-id list from the store). Because lesson ids are
// globally unique, the flat `completed` array works across every course.

export function moduleProgress(course, moduleId, completed) {
  const m = course?.getModule(moduleId)
  if (!m) return { done: 0, total: 0, pct: 0, complete: false }
  const total = m.lessons.length
  const done = m.lessons.filter((l) => completed.includes(l.id)).length
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0, complete: total > 0 && done === total }
}

// Whole-course percentage (only this course's lessons count toward it).
export function courseProgress(course, completed) {
  const total = course?.totalLessons || 0
  if (!total) return 0
  const done = course.allLessons.filter((l) => completed.includes(l.id)).length
  return Math.round((done / total) * 100)
}

// XP is DERIVED, never stored: it's the sum of `xp` on this course's completed
// lessons. Deriving it means it can't drift out of sync with progress, needs no
// migration for existing users, and stays course-scoped for free. Courses that
// don't award XP simply omit `xp` and get 0.
export function courseXp(course, completed) {
  return (course?.allLessons || []).reduce(
    (sum, l) => (completed.includes(l.id) ? sum + (l.xp || 0) : sum),
    0
  )
}

// Total XP available in the course — the denominator for "1,250 / 4,000 XP".
export function totalCourseXp(course) {
  return (course?.allLessons || []).reduce((sum, l) => sum + (l.xp || 0), 0)
}

// One place that decides what a course's button says and where it goes, so the
// hero, the cards and the rows can never disagree with each other.
// Returns { pct, started, done, label, to } — `to` is the lesson to resume.
export function courseCta(course, completed, lastLessonId) {
  const pct = courseProgress(course, completed)
  const started = pct > 0
  const done = pct === 100
  const next = nextLesson(course, completed, lastLessonId)
  const base = `/launchpad/${course.slug}`
  return {
    pct,
    started,
    done,
    label: done ? 'Review course' : started ? 'Continue Learning' : 'Start Course',
    to: next ? `${base}/module/${next.moduleId}/lesson/${next.id}` : base,
    next,
  }
}

// First incomplete lesson after the last visited one, else first incomplete.
export function nextLesson(course, completed, lastLessonId) {
  const lessons = course?.allLessons || []
  const firstIncomplete = lessons.find((l) => !completed.includes(l.id))
  if (!lastLessonId) return firstIncomplete || lessons[0]
  const idx = lessons.findIndex((l) => l.id === lastLessonId)
  for (let i = Math.max(idx, 0); i < lessons.length; i++) {
    if (!completed.includes(lessons[i].id)) return lessons[i]
  }
  return firstIncomplete || lessons[lessons.length - 1]
}
