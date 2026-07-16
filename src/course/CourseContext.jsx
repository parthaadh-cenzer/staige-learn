// Active-course context. Every page reads the course it belongs to from here,
// instead of importing a single hardcoded course. The provider is mounted per
// course route (see CourseShell), so `useCourse()` always has the right course.
import { createContext, useContext, useMemo } from 'react'
import { courseBase } from '../data/courses'

const CourseContext = createContext(null)

export function CourseProvider({ course, children }) {
  const value = useMemo(
    () => ({ course, base: courseBase(course.slug) }),
    [course]
  )
  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
}

// Returns { course, base }. `base` is the URL prefix for this course's pages,
// e.g. `/launchpad/ai-side-hustle-os` — build links as `${base}/modules`.
export function useCourse() {
  const ctx = useContext(CourseContext)
  if (!ctx) throw new Error('useCourse must be used inside a <CourseProvider>')
  return ctx
}
