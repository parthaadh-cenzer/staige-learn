// ============================================================================
//  LearnerDashboard — /dashboard, the signed-in learner's home.
//  (pages/Dashboard.jsx is the per-COURSE dashboard inside CourseShell — this
//  is the platform-level one. Hence the longer name.)
//
//  This is where the personalised half of the old homepage moved: Continue
//  Building, per-OS progress, XP, achievements, favourites and the "what
//  next" recommendation. The public landing page keeps none of it.
//
//  Every access state on this page is entitlement-driven via useAuth():
//  ownership is checked per course slug against course_access rows — never a
//  global "paid" flag. An operating system the learner hasn't bought renders
//  with a price and Buy for $5, no matter what local progress says. (Local
//  progress CAN exist for unowned courses — free previews, or the pre-paywall
//  era — which is exactly why owned and unowned are split before rendering.)
// ============================================================================
import { Link } from 'react-router-dom'
import {
  Play, ArrowRight, Zap, Trophy, Star, Library, FolderOpen, Lock, Sparkles,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { useAuth } from '../auth/AuthProvider'
import { activeCourses, comingSoonCourses, courseBase } from '../data/courses'
import { courseCta, courseXp } from '../course/progress'
import { useActiveCourse, resourceRoute } from '../course/useActiveCourse'
import { ProgressBar, Reveal } from '../components/ui'
import CourseArt from '../components/CourseArt'
import MascotAdvisor from '../components/MascotAdvisor'
import { PriceTag, PriceNote, BuyButton } from '../components/Pricing'
import { Capy } from '../components/mascots'
import { tone as toneOf } from '../lib/tones'

// The OS-flavoured button label. Same states the course cards use.
const osLabel = (cta) => (cta.done ? 'OS Completed' : cta.started ? 'Continue Building' : 'Start OS')

// ── Continue Building — the single most useful thing on this page ──────────
function ContinueBuilding({ course, completed, lastLessonId }) {
  const cta = courseCta(course, completed, lastLessonId)
  const t = toneOf(course.art?.tone || 'brand')
  return (
    <Reveal>
      <section aria-labelledby="continue-title" className="space-y-3">
        <h2 id="continue-title" className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <Play className="h-5 w-5 text-brand-600" /> Continue Building
        </h2>
        <div className={`card card-hover border ${t.border} p-5 sm:p-6`}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <CourseArt course={course} size="row" className="h-24 w-full shrink-0 sm:w-44" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-faint">{course.title}</p>
              <h3 className="mt-1 font-display text-xl font-bold text-ink-900">
                {cta.next ? cta.next.title : 'System complete'}
              </h3>
              {cta.next && (
                <p className="mt-0.5 text-sm text-muted">
                  Module {cta.next.moduleNum} · {cta.next.moduleTitle}
                  {cta.next.minutes ? ` · ~${cta.next.minutes} min` : ''}
                </p>
              )}
              <div className="mt-3 max-w-sm">
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-muted">{cta.pct}% complete</span>
                  <span className="text-faint">{course.totalLessons} lessons</span>
                </div>
                <ProgressBar value={cta.pct} tone={course.art?.tone || 'brand'} />
              </div>
            </div>
            <Link to={cta.to} className="btn-primary shrink-0">
              <Play className="h-4 w-4" /> {osLabel(cta)}
            </Link>
          </div>
        </div>
      </section>
    </Reveal>
  )
}

// ── An owned operating system ───────────────────────────────────────────────
function OwnedOsCard({ course, completed, lastLessonId }) {
  const cta = courseCta(course, completed, lastLessonId)
  const t = toneOf(course.art?.tone || 'brand')
  return (
    <Link
      to={cta.started ? cta.to : courseBase(course.slug)}
      className={`card card-hover flex h-full flex-col border ${t.border} p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl" aria-hidden="true">{course.art?.emoji}</span>
        <span className="pill border-brand-200 bg-brand-50 text-brand-600">✓ Owned</span>
      </div>
      <h3 className="mt-3 font-display font-bold text-ink-900">{course.title}</h3>
      <div className="mt-3 flex-1">
        {cta.started ? (
          <>
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-muted">{cta.done ? 'Complete' : `${cta.pct}% complete`}</span>
              <span className={`font-bold ${t.text}`}>{cta.pct}%</span>
            </div>
            <ProgressBar value={cta.pct} tone={course.art?.tone || 'brand'} />
          </>
        ) : (
          <p className="text-xs font-semibold text-faint">{course.totalLessons} lessons · not started</p>
        )}
      </div>
      <span className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${t.text}`}>
        {osLabel(cta)} <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  )
}

// ── A locked (unowned) operating system ─────────────────────────────────────
function LockedOsCard({ course }) {
  return (
    <div className="card flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl" aria-hidden="true">{course.art?.emoji}</span>
        <Lock className="mt-1 h-4 w-4 text-faint" aria-label="Locked" />
      </div>
      <h3 className="mt-3 font-display font-bold text-ink-900">{course.title}</h3>
      <p className="mt-1 flex-1 text-sm text-muted">{course.subtitle}</p>
      <div className="mt-4">
        <PriceTag course={course} />
        <PriceNote course={course} className="mt-1.5" />
        <BuyButton course={course} className="mt-3" label="Buy for $5" />
        <Link
          to={courseBase(course.slug)}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink-900"
        >
          View Details <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function LearnerDashboard() {
  const { profile, user, ownedSlugs, ownsCourse } = useAuth()
  const completed = useStore((s) => s.completed)
  const lastLessonId = useStore((s) => s.lastLessonId)
  const favoritePrompts = useStore((s) => s.favoritePrompts)
  const seenBadges = useStore((s) => s.seenBadges)
  const storeName = useStore((s) => s.name)
  const activeCourse = useActiveCourse()

  const name = profile?.display_name || storeName || user?.email?.split('@')[0] || 'there'

  // Entitlements still loading → skeleton, never a guess. Rendering "Buy for
  // $5" at an owner (or an unlocked card at a non-owner) for a second on every
  // visit is the thing this early return prevents.
  if (ownedSlugs === null) {
    return (
      <div className="grid min-h-[40vh] place-items-center" aria-busy="true">
        <p className="text-sm text-faint">Loading your operating systems…</p>
      </div>
    )
  }

  const owned = activeCourses.filter((c) => ownsCourse(c.slug))
  const locked = activeCourses.filter((c) => !ownsCourse(c.slug))

  // Continue Building only ever surfaces an OWNED system. Local progress on an
  // unowned one (free preview, pre-paywall) must not produce a resume button
  // into content the learner can't open.
  const inProgress = owned
    .map((c) => ({ c, pct: courseCta(c, completed, lastLessonId).pct }))
    .filter((x) => x.pct > 0 && x.pct < 100)
    .sort((a, b) => b.pct - a.pct)
    .map((x) => x.c)
  const current =
    activeCourse && inProgress.includes(activeCourse) ? activeCourse : inProgress[0]

  // Stats are derived, never stored — same rule as everywhere else.
  const totalXp = activeCourses.reduce((sum, c) => sum + courseXp(c, completed), 0)
  const lessonsDone = activeCourses.reduce(
    (sum, c) => sum + c.allLessons.filter((l) => completed.includes(l.id)).length, 0
  )

  const recommended = locked.length
    ? [...locked].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))[0]
    : null
  // Shortcuts deep-link into a course's bonus areas, so they must target a
  // course the learner OWNS — the last-touched one if it qualifies, else any.
  const shortcutCourse =
    activeCourse && ownsCourse(activeCourse.slug) ? activeCourse : owned[0] || null
  const base = shortcutCourse ? courseBase(shortcutCourse.slug) : null

  return (
    <div className="space-y-10 lg:space-y-12">
      {/* Welcome */}
      <Reveal>
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Capy size={64} className="shrink-0" />
            <div>
              <h1 className="font-display text-3xl font-extrabold text-ink-900">Welcome back, {name} 👋</h1>
              <p className="mt-1 text-muted">
                {current ? 'Your system is waiting where you left it.' : owned.length ? 'Pick a system and start building.' : 'Choose your first operating system below.'}
              </p>
            </div>
          </div>
          {/* Derived stats — quiet, honest, no streak theatrics. */}
          <div className="flex gap-3">
            {[
              { icon: Zap, label: 'XP', value: totalXp.toLocaleString() },
              { icon: Star, label: 'Lessons', value: lessonsDone },
              { icon: Trophy, label: 'Badges', value: seenBadges.length },
            ].map((s) => (
              <div key={s.label} className="card flex items-center gap-2.5 px-4 py-2.5">
                <s.icon className="h-4 w-4 text-brand-600" />
                <div>
                  <p className="font-display text-sm font-extrabold leading-none text-ink-900">{s.value}</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-faint">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {current && <ContinueBuilding course={current} completed={completed} lastLessonId={lastLessonId} />}

      {/* Owned systems */}
      {owned.length > 0 && (
        <Reveal>
          <section aria-labelledby="owned-title" className="space-y-3">
            <h2 id="owned-title" className="font-display text-xl font-bold text-ink-900">Your operating systems</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {owned.map((c) => (
                <OwnedOsCard key={c.slug} course={c} completed={completed} lastLessonId={lastLessonId} />
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Nothing owned yet → the empty-state path, with Capy & Byte. */}
      {owned.length === 0 && (
        <Reveal>
          <section className="card border-brand-200 bg-sage-50/60 p-6 sm:p-8">
            <div className="grid items-center gap-6 lg:grid-cols-[1.3fr,1fr]">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-ink-900">Start your first operating system</h2>
                <p className="mt-2 max-w-lg text-muted">
                  Every system solves one real problem, one guided mission at a time — and each one has a
                  free preview lesson so you can try before you buy.
                </p>
              </div>
              <MascotAdvisor mode="empty" className="w-full" />
            </div>
          </section>
        </Reveal>
      )}

      {/* Locked systems — available to add, each unlocking only itself. */}
      {locked.length > 0 && (
        <Reveal>
          <section aria-labelledby="locked-title" className="space-y-3">
            <h2 id="locked-title" className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
              <Sparkles className="h-5 w-5 text-brand-600" />
              {owned.length ? 'Add another operating system' : 'Available operating systems'}
            </h2>
            {recommended && owned.length > 0 && (
              <p className="text-sm text-muted">
                Recommended next: <strong className="text-ink-900">{recommended.title}</strong> — {recommended.subtitle}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {locked.map((c) => <LockedOsCard key={c.slug} course={c} />)}
            </div>
          </section>
        </Reveal>
      )}

      {/* Quick links into the learner's current course context — only when
          they own it; deep links into an unowned OS would just hit the lock. */}
      {base && shortcutCourse && (
        <Reveal>
          <section aria-labelledby="shortcuts-title" className="space-y-3">
            <h2 id="shortcuts-title" className="font-display text-xl font-bold text-ink-900">Jump back in</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Library, title: 'Prompt Vault', text: favoritePrompts.length ? `${favoritePrompts.length} favourite${favoritePrompts.length === 1 ? '' : 's'} saved` : 'Prompts filed by outcome', to: `${base}/prompts` },
                { icon: FolderOpen, title: 'Resources', text: 'Templates, downloads and checklists', to: `${base}/${resourceRoute(shortcutCourse)}` },
                { icon: Trophy, title: 'Achievements', text: seenBadges.length ? `${seenBadges.length} badge${seenBadges.length === 1 ? '' : 's'} earned` : 'Badges for what you build', to: `${base}/badges` },
              ].map((i) => (
                <Link key={i.title} to={i.to} className="card card-hover flex items-center gap-3.5 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sage-50 text-brand-600">
                    <i.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-sm font-bold text-ink-900">{i.title}</span>
                    <span className="block truncate text-xs text-muted">{i.text}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Coming Soon — visible, inert, unpriced. */}
      {comingSoonCourses.length > 0 && (
        <Reveal>
          <section aria-labelledby="soon-title" className="space-y-3">
            <h2 id="soon-title" className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
              <Lock className="h-5 w-5 text-faint" /> Coming Soon
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {comingSoonCourses.map((c) => (
                <div key={c.slug} className="card flex items-center gap-3.5 p-4 opacity-80" aria-label={`${c.title} — coming soon`}>
                  <span className="text-2xl" aria-hidden="true">{c.art?.emoji}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-sm font-bold text-ink-900">{c.title}</span>
                    <span className="block text-xs text-faint">Coming Soon</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}
    </div>
  )
}
