// ============================================================================
//  COURSE REGISTRY  ·  the one place that lists every course.
//  To add a course: create its data file, import it, and add it to `courses`.
//  Order here = order shown in the course switcher and the Courses page.
//
//  THIS IS THE SINGLE SOURCE OF TRUTH. The homepage (src/pages/Home.jsx) reads
//  everything from here — the hero, Featured This Week, Recently Updated, the
//  goal cards and every browsing row are derived from course metadata, never
//  hardcoded. To feature a different course, set `featured: true` on it. To
//  re-order Recently Updated, change `lastUpdated`. Nothing in the homepage
//  needs editing.
//
//  Homepage-facing fields a course supplies:
//    featured     · boolean — the one course in the hero + Featured This Week
//    lastUpdated  · 'YYYY-MM-DD' — drives Recently Updated ordering
//    skillLevel   · 'Beginner' | 'Beginner → Intermediate' | …
//    art          · { emoji, tone } — the derived cover art (see CourseArt.jsx)
//    goal         · { emoji, label, order } — its "Choose Your Goal" card
//    collections  · ['career' | 'business'] — which browsing rows it appears in
//  `subtitle` doubles as the one-line promise — it is not duplicated anywhere.
// ============================================================================
import { productForCourse } from '../../../shared/catalog.mjs'
import aiSideHustleOS from './ai-side-hustle-os'
import aiMarketingOS from './ai-marketing-os'
import aiJobHunterOS from './ai-job-hunter-os'
import aiEmployeeOS from './ai-employee-os'
import aiAgentsBusiness from './ai-agents-business'
import smallBusinessOS from './small-business-os'

// Derive the helper fields every course needs (flattened lessons, lookups,
// module badges) so the individual course files stay simple to author.
function hydrate(course) {
  const modules = course.modules || []
  const allLessons = modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleNum: m.num, moduleTitle: m.title, moduleColor: m.color }))
  )
  const lessonIds = new Set(allLessons.map((l) => l.id))

  // Module badges are derived from the modules. A module can override the
  // derived emoji/title/desc via `badge: { … }` — that's how a course gives its
  // achievements real names ("🏅 Resume Master") instead of "Resume OS ✓",
  // without needing a second badge system alongside this one.
  const moduleBadges = modules.map((m) => ({
    id: `badge-${m.id}`,
    type: 'module',
    moduleId: m.id,
    emoji: m.badge?.emoji || m.emoji,
    title: m.badge?.title || `${m.title} ✓`,
    desc: m.badge?.desc || `Completed Module ${m.num}`,
    tone: m.badge?.tone || m.color,
  }))

  // ── Commerce ──────────────────────────────────────────────────────────────
  // A course is sellable if shared/catalog.mjs lists a product for its slug.
  // Coming Soon courses have no product, so they can never be bought — and the
  // three that are for sale need no per-course pricing fields, which keeps
  // pricing in exactly one file.
  const product = productForCourse(course.slug) || null

  // The free sample. Every active paid course opens its first lesson to anyone,
  // signed in or not — that's what makes the overview worth reading. A course can
  // override the choice with `preview: { lessonIds: [...] }`; the default is
  // derived so a new course gets a sensible preview for free.
  const previewLessonIds = new Set(
    course.preview?.lessonIds ?? (allLessons[0] ? [allLessons[0].id] : [])
  )

  return {
    ...course,
    allLessons,
    totalLessons: allLessons.length,
    moduleCount: modules.length,
    isActive: course.status === 'active',
    lessonIds,
    product,
    productKey: product?.key || null,
    // Only an active course with a product is behind the paywall. Everything
    // else is either free or not launched.
    requiresPurchase: course.status === 'active' && Boolean(product),
    previewLessonIds,
    isPreviewLesson: (id) => previewLessonIds.has(id),
    getModule: (id) => modules.find((m) => m.id === id),
    getLesson: (moduleId, lessonId) =>
      modules.find((m) => m.id === moduleId)?.lessons.find((l) => l.id === lessonId),
    lessonIndex: (moduleId, lessonId) =>
      allLessons.findIndex((l) => l.moduleId === moduleId && l.id === lessonId),
    badges: {
      module: moduleBadges,
      milestone: course.badges?.milestone || [],
    },
  }
}

// All courses, hydrated. Add new courses to this list.
export const courses = [
  aiSideHustleOS,
  aiMarketingOS,
  aiJobHunterOS,
  aiEmployeeOS,
  aiAgentsBusiness,
  smallBusinessOS,
].map(hydrate)

// The course legacy links fall back to.
export const DEFAULT_COURSE_SLUG = 'ai-side-hustle-os'

export const getCourseBySlug = (slug) => courses.find((c) => c.slug === slug)
export const defaultCourse = getCourseBySlug(DEFAULT_COURSE_SLUG)

// URL helper — base path for a course's pages.
export const courseBase = (slug) => `/launchpad/${slug}`

// ── Sales-page URLs ───────────────────────────────────────────────────────────
// Every OS gets a public sales page at /os/<short-slug> (e.g. /os/job-hunter).
// The short slug drops the "ai-" prefix and "-os" suffix so the marketing URL
// reads cleanly; the resolver below also accepts the full slug. Both are
// derived, never a hardcoded map, so a new OS gets its sales URL for free.
export const osShortSlug = (slug) => slug.replace(/^ai-/, '').replace(/-os$/, '')
export const osPath = (course) => `/os/${osShortSlug(course.slug)}`

// Resolve an /os/:slug param to a course — accepts the short slug OR the full
// slug, so /os/job-hunter and /os/ai-job-hunter-os both land on the same page.
export const getCourseByOsParam = (param) => {
  const p = String(param || '').toLowerCase()
  return getCourseBySlug(p) || courses.find((c) => osShortSlug(c.slug) === p)
}

// ── Homepage selectors ──────────────────────────────────────────────────────
// Every one of these is derived. The homepage never names a course.

export const activeCourses = courses.filter((c) => c.isActive)
export const comingSoonCourses = courses.filter((c) => c.status !== 'active')

// The hero + ⭐ Featured This Week. Falls back to the first active course so the
// homepage can never render empty if nobody set the flag.
export const featuredCourse = activeCourses.find((c) => c.featured) || activeCourses[0]

// 🆕 Recently Updated — newest first, no manual ordering anywhere.
export const recentlyUpdated = [...activeCourses].sort(
  (a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)
)

// The "Choose Your Goal" cards — any course that declares a goal gets one.
export const goalCourses = courses
  .filter((c) => c.goal)
  .sort((a, b) => (a.goal.order ?? 99) - (b.goal.order ?? 99))

export const coursesInCollection = (id) => courses.filter((c) => c.collections?.includes(id))

// Which course is the learner actually in the middle of? Derived from the last
// lesson they opened (lesson ids are globally unique and course-prefixed), so
// it needs no extra stored state and can't drift.
export const courseOfLesson = (lessonId) =>
  lessonId ? courses.find((c) => c.lessonIds.has(lessonId)) : undefined
