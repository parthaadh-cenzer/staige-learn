// ============================================================================
//  ACCESS RULES · one function, asked by every gated surface.
//
//  Lessons, the Prompt Vault, Downloads / AI Templates, checklists, the
//  challenge and badges all call canAccessCourse() rather than each inventing
//  their own idea of "is this unlocked". One place to read, one place to change.
//
//  This decides what the UI SHOWS. It is not the security boundary — hiding a
//  button protects nobody. The real boundary is Row Level Security on
//  `course_access`, which the browser cannot write, plus the webhook being the
//  only writer. This file is what makes the locked state honest and pleasant.
// ============================================================================

export const ACCESS = {
  FREE: 'free',         // nothing to buy
  OWNED: 'owned',       // paid for, verified
  PREVIEW: 'preview',   // the free sample lesson
  SIGN_IN: 'sign-in',   // would own it, but we don't know who they are yet
  PURCHASE: 'purchase', // signed in, hasn't bought it
  UNKNOWN: 'unknown',   // entitlements still loading — show a skeleton, not a lock
}

// `auth` is the object from useAuth(): { loading, user, ownedSlugs, ownsCourse }.
export function canAccessCourse(course, auth, { lessonId } = {}) {
  if (!course) return { allowed: false, reason: ACCESS.PURCHASE }

  // Not sellable → not gated. Coming Soon courses fall here and keep their own
  // ComingSoon screen; they must never render a price or a buy button.
  if (!course.requiresPurchase) return { allowed: true, reason: ACCESS.FREE }

  // Supabase not configured (local dev without keys): don't pretend to sell
  // anything. Locking a course we can't verify a purchase for would be theatre.
  if (!auth?.configured) return { allowed: true, reason: ACCESS.FREE }

  if (auth.loading) return { allowed: false, reason: ACCESS.UNKNOWN }

  if (auth.user && auth.ownsCourse(course.slug)) return { allowed: true, reason: ACCESS.OWNED }

  // Signed in, entitlements not back yet.
  if (auth.user && auth.ownedSlugs === null) return { allowed: false, reason: ACCESS.UNKNOWN }

  // The free sample — open to everyone, including signed-out visitors.
  if (lessonId && course.isPreviewLesson?.(lessonId)) return { allowed: true, reason: ACCESS.PREVIEW }

  return { allowed: false, reason: auth.user ? ACCESS.PURCHASE : ACCESS.SIGN_IN }
}

// The course overview, module list and pricing are public by design — that's the
// sales page. Only the contents of a module are gated.
export const canBrowseCourse = () => true

export const isLocked = (reason) => reason === ACCESS.SIGN_IN || reason === ACCESS.PURCHASE
