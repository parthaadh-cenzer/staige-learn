// ============================================================================
//  Home — the STAIGE homepage, and the platform's landing page.
//
//  This replaces the old Launchpad grid. Every section is derived from the
//  shared course registry (src/data/courses/index.js): the hero and Featured
//  This Week read `featured`, Recently Updated reads `lastUpdated`, the goal
//  cards read `goal`, the rows read `collections` + `status`, and progress
//  comes from the same store the courses use. No course is named in this file.
//
//  Browsing feel is borrowed from streaming platforms; the look is entirely
//  STAIGE — white surfaces, sage lines, one green accent, existing cards.
// ============================================================================
import { Link } from 'react-router-dom'
import {
  ArrowRight, Play, Star, Sparkles, BookOpen, Signal, Clock, Lock, Trophy,
  Library, FolderOpen, Download, Bot, LineChart, Layers, Target,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import {
  courses, activeCourses, comingSoonCourses, featuredCourse, recentlyUpdated,
  goalCourses, coursesInCollection, courseBase,
} from '../data/courses'
import { courseCta } from '../course/progress'
import { useActiveCourse, resourceRoute } from '../course/useActiveCourse'
import { ProgressBar, Reveal } from '../components/ui'
import CourseArt from '../components/CourseArt'
import CourseRow from '../components/CourseRow'
import CourseCard from '../components/CourseCard'
import MascotAdvisor from '../components/MascotAdvisor'
import { Byte } from '../components/mascots'
import { tone as toneOf } from '../lib/tones'

// `new Date('2026-07-15')` is parsed as UTC midnight, which then renders as the
// 14th for anyone west of Greenwich. Build the date from its parts so a
// date-only string means that calendar day everywhere.
const fmtDate = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''))
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  if (isNaN(d)) return null
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Hero ────────────────────────────────────────────────────────────────────
function Hero({ course, cta }) {
  const t = toneOf(course.art?.tone || 'brand')
  return (
    <Reveal>
      <section aria-labelledby="hero-title" className="card relative overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-brand-100/50 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr,1fr]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`pill ${t.border} ${t.text}`}><Star className="h-3.5 w-3.5 fill-current" /> Featured</span>
              {course.skillLevel && <span className="pill border-line text-muted"><Signal className="h-3.5 w-3.5" /> {course.skillLevel}</span>}
              <span className="pill border-line text-muted"><BookOpen className="h-3.5 w-3.5" /> {course.moduleCount} modules</span>
            </div>

            <h1 id="hero-title" className="mt-4 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
              {course.title}
            </h1>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted">{course.subtitle}</p>

            {cta.started && !cta.done && (
              <div className="mt-5 max-w-xs">
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-muted">Your progress</span>
                  <span className={`font-bold ${t.text}`}>{cta.pct}%</span>
                </div>
                <ProgressBar value={cta.pct} tone={course.art?.tone || 'brand'} />
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to={cta.to} className="btn-primary !px-5 !py-3">
                <Play className="h-4 w-4" /> {cta.label}
              </Link>
              <Link to={courseBase(course.slug)} className="btn-ghost !px-5 !py-3">
                View Details <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <CourseArt course={course} size="hero" className="h-64" mascot />
          </div>
        </div>
      </section>
    </Reveal>
  )
}

// ── Continue Learning ───────────────────────────────────────────────────────
function ContinueLearning({ inProgress, completed, lastLessonId }) {
  // Nothing started yet → the onboarding path.
  if (!inProgress.length) {
    const recommended = [...activeCourses].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return (
      <Reveal>
        <section aria-labelledby="start-title" className="card border-brand-200 bg-gradient-to-br from-sage-50 to-brand-50 p-6 sm:p-8">
          <div className="grid items-center gap-6 lg:grid-cols-[1.3fr,1fr]">
            <div>
              <h2 id="start-title" className="font-display text-2xl font-extrabold text-ink-900">
                Start Your First Operating System
              </h2>
              <p className="mt-2 max-w-lg text-muted">
                Not a tool tour — a system you keep using. Pick the outcome you want and Capy &amp; Byte
                will take it one real problem at a time.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {recommended.map((c) => (
                  <Link key={c.slug} to={courseBase(c.slug)} className="btn-ghost !py-2 !text-xs">
                    {c.art?.emoji} {c.title} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
            <MascotAdvisor mode="empty" className="w-full" />
          </div>
        </section>
      </Reveal>
    )
  }

  const current = inProgress[0]
  const cta = courseCta(current, completed, lastLessonId)
  const t = toneOf(current.art?.tone || 'brand')

  return (
    <Reveal>
      <section aria-labelledby="continue-title" className="space-y-3">
        <h2 id="continue-title" className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <Play className="h-5 w-5 text-brand-600" /> Continue Learning
        </h2>
        <div className={`card card-hover border ${t.border} p-5 sm:p-6`}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <CourseArt course={current} size="row" className="h-24 w-full shrink-0 sm:w-44" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-faint">{current.title}</p>
              <h3 className="mt-1 font-display text-xl font-bold text-ink-900">
                {cta.next ? cta.next.title : 'Course complete'}
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
                  <span className="text-faint">{current.totalLessons} lessons</span>
                </div>
                <ProgressBar value={cta.pct} tone={current.art?.tone || 'brand'} />
              </div>
            </div>
            <Link to={cta.to} className="btn-primary shrink-0">
              <Play className="h-4 w-4" /> {cta.label}
            </Link>
          </div>
        </div>
      </section>
    </Reveal>
  )
}

// ── ⭐ Featured This Week ───────────────────────────────────────────────────
function FeaturedThisWeek({ course, cta }) {
  const t = toneOf(course.art?.tone || 'brand')
  return (
    <Reveal>
      <section aria-labelledby="featured-title" className="space-y-3">
        <h2 id="featured-title" className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <Star className="h-5 w-5 text-gold-500 fill-gold-400" /> Featured This Week
        </h2>
        <div className={`card border ${t.border} overflow-hidden p-0`}>
          <div className="grid gap-0 md:grid-cols-[minmax(0,20rem),1fr]">
            <CourseArt course={course} size="card" className="!rounded-none h-40 border-0 md:h-full" />
            <div className="p-5 sm:p-6">
              <h3 className="font-display text-2xl font-bold text-ink-900">{course.title}</h3>
              <p className="mt-1.5 text-muted">{course.subtitle}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.skillLevel && <span className="pill border-line text-muted"><Signal className="h-3.5 w-3.5" /> {course.skillLevel}</span>}
                <span className="pill border-line text-muted"><BookOpen className="h-3.5 w-3.5" /> {course.moduleCount} modules</span>
                <span className="pill border-line text-muted"><Clock className="h-3.5 w-3.5" /> {course.totalLessons} lessons</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to={cta.to} className="btn-primary"><Play className="h-4 w-4" /> {cta.label}</Link>
                <Link to={courseBase(course.slug)} className="btn-ghost">View Details <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  )
}

// ── 🆕 Recently Updated ─────────────────────────────────────────────────────
function RecentlyUpdated({ items, completed, lastLessonId }) {
  if (!items.length) return null
  return (
    <Reveal>
      <section aria-labelledby="recent-title" className="space-y-3">
        <h2 id="recent-title" className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <Sparkles className="h-5 w-5 text-brand-600" /> Recently Updated
        </h2>
        <ul className="card divide-y divide-line p-0">
          {items.map((c) => {
            const cta = courseCta(c, completed, lastLessonId)
            const t = toneOf(c.art?.tone || 'brand')
            return (
              <li key={c.slug} className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${t.bgSoft} text-xl`} aria-hidden="true">
                  {c.art?.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold text-ink-900">{c.title}</p>
                  <p className="text-xs text-faint">
                    Last updated {fmtDate(c.lastUpdated) || '—'}
                    {cta.started && ` · ${cta.pct}% complete`}
                  </p>
                </div>
                <Link to={cta.to} className="btn-ghost shrink-0 !py-2 !text-xs">
                  {cta.label} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </Reveal>
  )
}

// ── Choose Your Goal ────────────────────────────────────────────────────────
function ChooseYourGoal() {
  return (
    <Reveal>
      <section aria-labelledby="goal-title" className="space-y-3">
        <h2 id="goal-title" className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <Target className="h-5 w-5 text-brand-600" /> Choose Your Goal
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {goalCourses.map((c) => {
            const t = toneOf(c.art?.tone || 'brand')
            const inner = (
              <>
                <span className="text-3xl" aria-hidden="true">{c.goal.emoji}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-ink-900">{c.goal.label}</h3>
                <p className={`mt-1 text-sm font-semibold ${c.isActive ? t.text : 'text-faint'}`}>{c.title}</p>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{c.subtitle}</p>
                <span className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${c.isActive ? t.text : 'text-faint'}`}>
                  {c.isActive
                    ? <>Explore <ArrowRight className="h-3.5 w-3.5" /></>
                    : <><Lock className="h-3.5 w-3.5" /> Coming soon</>}
                </span>
              </>
            )
            const shell = 'card flex h-full flex-col p-5'
            return c.isActive ? (
              <Link
                key={c.slug} to={courseBase(c.slug)}
                className={`${shell} card-hover border ${t.border} focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40`}
              >
                {inner}
              </Link>
            ) : (
              <div key={c.slug} className={`${shell} border-line opacity-80`} aria-label={`${c.goal.label} — ${c.title}, coming soon`}>
                {inner}
              </div>
            )
          })}
        </div>
      </section>
    </Reveal>
  )
}

// ── Why STAIGE ──────────────────────────────────────────────────────────────
const WHY = [
  { icon: Layers, title: 'Operating Systems, not courses', text: 'Every course builds a system you keep using — not a playlist you finish and forget.' },
  { icon: Bot, title: 'Capy & Byte', text: 'Capy brings the real problem. Byte brings the workflow that solves it. Every single lesson.' },
  { icon: Sparkles, title: 'Interactive, not passive', text: 'Missions you actually type into. Byte scores your work and tells you what to fix.' },
  { icon: Library, title: 'Prompt Vault & AI Templates', text: 'Reusable prompts and ready-to-use templates, filed by outcome and yours forever.' },
  { icon: LineChart, title: 'Progress, XP & achievements', text: 'Every lesson, answer and badge saves as you go — and syncs across your devices once you sign in.' },
  { icon: Target, title: 'Practical learning', text: 'If a lesson doesn’t survive “would this change your Monday?”, it isn’t in the course.' },
]

function WhyStaige() {
  return (
    <Reveal>
      <section aria-labelledby="why-title" className="space-y-3">
        <h2 id="why-title" className="font-display text-xl font-bold text-ink-900">Why STAIGE</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w) => (
            <div key={w.title} className="card p-5">
              <span className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <w.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display font-bold text-ink-900">{w.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{w.text}</p>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

// ── Platform Features ───────────────────────────────────────────────────────
function PlatformFeatures({ course }) {
  const base = course ? courseBase(course.slug) : '/courses'
  const f = course?.features || {}
  // Each card links to the page it describes, in the learner's current course.
  const items = [
    { icon: Library, title: 'Prompt Vault', text: 'Searchable prompts, filed by outcome.', to: f.prompts ? `${base}/prompts` : '/courses' },
    { icon: Bot, title: 'AI Templates', text: 'Ready-to-use templates in every module.', to: f.downloads ? `${base}/downloads` : '/courses' },
    { icon: Download, title: 'Downloads', text: 'Worksheets and planners you can fill in.', to: f.downloads ? `${base}/downloads` : `${base}/${resourceRoute(course)}` },
    { icon: FolderOpen, title: 'Resources', text: 'Curated tools, stacks and checklists.', to: course ? `${base}/${resourceRoute(course)}` : '/courses' },
    { icon: Trophy, title: 'Achievements', text: 'Badges for what you built, not watched.', to: f.badges ? `${base}/badges` : '/courses' },
    { icon: LineChart, title: 'Progress Tracking', text: 'Per-course progress and XP, saved locally.', to: base },
    { icon: Sparkles, title: 'AI Guidance', text: 'Byte reviews your work inside the lesson.', to: `${base}/modules` },
  ]
  return (
    <Reveal>
      <section aria-labelledby="features-title" className="space-y-3">
        <h2 id="features-title" className="font-display text-xl font-bold text-ink-900">Platform Features</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <Link
              key={i.title} to={i.to}
              className="card card-hover flex flex-col p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
            >
              <span className="mb-2.5 grid h-9 w-9 place-items-center rounded-xl bg-sage-50 text-brand-600">
                <i.icon className="h-4.5 w-4.5" />
              </span>
              <p className="font-display text-sm font-bold text-ink-900">{i.title}</p>
              <p className="mt-0.5 text-xs text-muted">{i.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

// ── Coming Soon ─────────────────────────────────────────────────────────────
function ComingSoon() {
  if (!comingSoonCourses.length) return null
  return (
    <Reveal>
      <section aria-labelledby="soon-title" className="space-y-3">
        <h2 id="soon-title" className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <Lock className="h-5 w-5 text-faint" /> Coming Soon
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comingSoonCourses.map((c) => <CourseCard key={c.slug} course={c} />)}
        </div>
      </section>
    </Reveal>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function Home() {
  const completed = useStore((s) => s.completed)
  const lastLessonId = useStore((s) => s.lastLessonId)
  const activeCourse = useActiveCourse()

  const hero = featuredCourse
  const heroCta = courseCta(hero, completed, lastLessonId)

  // Courses with real progress, most-progressed first. Drives both the
  // Continue Learning section and its row.
  const inProgress = activeCourses
    .map((c) => ({ c, pct: courseCta(c, completed, lastLessonId).pct }))
    .filter((x) => x.pct > 0)
    .sort((a, b) => b.pct - a.pct)
    .map((x) => x.c)

  // Put the course they last touched first — that's the one they meant.
  const ordered = activeCourse && inProgress.includes(activeCourse)
    ? [activeCourse, ...inProgress.filter((c) => c !== activeCourse)]
    : inProgress

  return (
    <div className="space-y-12 lg:space-y-16">
      <Hero course={hero} cta={heroCta} />
      <ContinueLearning inProgress={ordered} completed={completed} lastLessonId={lastLessonId} />
      <FeaturedThisWeek course={hero} cta={heroCta} />
      <RecentlyUpdated items={recentlyUpdated} completed={completed} lastLessonId={lastLessonId} />
      <ChooseYourGoal />

      <div className="space-y-10">
        <h2 className="font-display text-2xl font-extrabold text-ink-900">Available Courses</h2>
        <CourseRow id="available" title="Available Now" icon={Play} courses={activeCourses}
          blurb="Every course you can start today." />
        <CourseRow id="career" title="Career Growth" icon={Trophy} courses={coursesInCollection('career')}
          blurb="Get hired, get promoted, get paid what you're worth." />
        <CourseRow id="business" title="Business & Income" icon={LineChart} courses={coursesInCollection('business')}
          blurb="Build something of your own — or grow what you have." />
        {/* Only worth a rail once there's more than one to browse; the section
            above already covers a single in-progress course. */}
        {ordered.length > 1 && (
          <CourseRow id="continue" title="Continue Learning" icon={Play} courses={ordered}
            blurb="Pick up where you left off." />
        )}
        <CourseRow id="soon" title="Coming Soon" icon={Lock} courses={comingSoonCourses}
          blurb="In the works. You'll see them here first." />
      </div>

      <WhyStaige />
      <PlatformFeatures course={activeCourse} />
      <ComingSoon />

      {/* Closing note — keeps Byte present without being childish. */}
      <Reveal>
        <div className="card flex flex-col items-center gap-4 border-brand-200 bg-brand-50 p-6 text-center sm:flex-row sm:text-left">
          <Byte size={56} className="shrink-0" />
          <div className="flex-1">
            <h2 className="font-display font-bold text-ink-900">Your progress follows you</h2>
            <p className="mt-1 text-sm text-muted">
              Start reading straight away — no account needed. Sign in and your progress, XP and saved
              answers sync to every device you learn on.
            </p>
          </div>
          <Link to="/courses" className="btn-primary shrink-0">Browse all courses <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </Reveal>
    </div>
  )
}
