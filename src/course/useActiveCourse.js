// ============================================================================
//  Which course is the learner actually in the middle of?
//
//  The platform nav has course-scoped destinations (Prompt Vault, Resources,
//  Achievements) but the homepage has no course context. Rather than storing a
//  "current course" — more state to keep in sync, and it would drift the moment
//  someone switched courses from the sidebar — this derives it:
//
//    the course owning the last lesson they opened
//      → else the first active course they've made progress in
//      → else the featured course
//
//  Lesson ids are globally unique and course-prefixed, so the lookup is exact.
// ============================================================================
import { useStore } from '../store/useStore'
import { courseOfLesson, activeCourses, featuredCourse } from '../data/courses'

export function useActiveCourse() {
  const lastLessonId = useStore((s) => s.lastLessonId)
  const completed = useStore((s) => s.completed)

  const fromLast = courseOfLesson(lastLessonId)
  if (fromLast?.isActive) return fromLast

  const started = activeCourses.find((c) => completed.some((id) => c.lessonIds.has(id)))
  return started || featuredCourse
}

// A course's "Resources" destination depends on which bonus areas it enables —
// Job Hunter has a Download Center, Side Hustle has a Resource Vault. Pick the
// first one that exists so the nav link can never 404 into a disabled feature.
export function resourceRoute(course) {
  const f = course?.features || {}
  if (f.downloads) return 'downloads'
  if (f.vault) return 'vault'
  if (f.checklists) return 'checklists'
  return 'modules'
}
