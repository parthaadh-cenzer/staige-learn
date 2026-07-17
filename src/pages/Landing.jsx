// ============================================================================
//  Landing — the public STAIGE homepage at "/".
//
//  Positioning: "Learn less. Build more." STAIGE sells practical AI Operating
//  Systems, not a course catalog — so this page explains STAIGE first and
//  lists the systems once. The old homepage's personalised sections (Continue
//  Learning, progress, featured rows) now live in /dashboard; nothing here is
//  personalised beyond ownership-aware buttons.
//
//  Every price on this page comes from shared/catalog.mjs via the Pricing
//  components; every course fact comes from the registry. Nothing is typed
//  twice. Coming Soon systems render inert — no link, no price, no CTA.
// ============================================================================
import { Link } from 'react-router-dom'
import {
  ArrowRight, BookOpen, Signal, Lock, Hammer, Rocket, CheckCircle2, XCircle,
  Library, Bot, Download, ListChecks, LayoutDashboard, Workflow, Flag, CloudUpload,
} from 'lucide-react'
import { activeCourses, getCourseBySlug, courseBase, osPath } from '../data/courses'
import { useAuth } from '../auth/AuthProvider'
import { PriceTag, PriceNote, BuyButton } from '../components/Pricing'
import HeroStory, { STORIES } from '../components/HeroStory'
import { Reveal } from '../components/ui'
import { Capy, Byte } from '../components/mascots'
import { tone as toneOf } from '../lib/tones'

// The one primary CTA. Signed out it starts an account; signed in it goes to
// the dashboard. It never grants anything — it's a navigation button.
export function StartBuilding({ className = '', children }) {
  const { user } = useAuth()
  return (
    <Link to={user ? '/dashboard' : '/signup'} className={`btn-primary ${className}`}>
      {children || <>Start Building <ArrowRight className="h-4 w-4" /></>}
    </Link>
  )
}

// ── 2 + 3 · Hero with the Capy & Byte story ────────────────────────────────
function Hero() {
  return (
    <section aria-labelledby="hero-title" className="card relative overflow-hidden p-6 sm:p-10">
      <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-brand-100/50 blur-3xl" />
      <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr,1fr]">
        <div className="min-w-0">
          <h1 id="hero-title" className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-6xl">
            Learn less.
            <br />
            <span className="text-brand-600">Build more.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Practical AI operating systems that help you solve real problems, build useful
            workflows, and leave with something you can use immediately.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <StartBuilding className="!px-6 !py-3" />
            <a href="#systems" className="btn-ghost !px-6 !py-3">
              Explore Operating Systems
            </a>
          </div>
          <p className="mt-4 text-xs text-faint">
            Capy brings the problem. Byte helps solve it. You build the outcome.
          </p>
        </div>
        <HeroStory story={STORIES.job} />
      </div>
    </section>
  )
}

// ── 4 · What is STAIGE ──────────────────────────────────────────────────────
const WHAT = [
  { icon: BookOpen, title: 'Learn', text: 'Learn only what you need to solve the problem.' },
  { icon: Hammer, title: 'Build', text: 'Use prompts, templates, workflows and guided missions.' },
  { icon: Rocket, title: 'Use', text: 'Leave with something practical you can use immediately.' },
]

function WhatIsStaige() {
  return (
    <Reveal>
      <section aria-labelledby="what-title" className="text-center">
        <h2 id="what-title" className="font-display text-3xl font-extrabold text-ink-900">What is STAIGE?</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted">
          Not another library of lessons — a system you build once and keep using.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {WHAT.map((w, i) => (
            <div key={w.title} className="card relative p-6">
              {i < WHAT.length - 1 && (
                <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-faint sm:block" aria-hidden="true" />
              )}
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <w.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{w.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{w.text}</p>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

// ── 5 · Choose your goal ────────────────────────────────────────────────────
// Landing-specific labels ("Earn More", "Work Smarter") over registry courses.
const GOALS = [
  { label: 'Get Hired', emoji: '💼', slug: 'ai-job-hunter-os' },
  { label: 'Earn More', emoji: '💰', slug: 'ai-side-hustle-os' },
  { label: 'Grow Your Business', emoji: '📈', slug: 'ai-marketing-os' },
  { label: 'Work Smarter', emoji: '🤖', slug: 'ai-employee-os' },
]

function ChooseYourGoal() {
  return (
    <Reveal>
      <section aria-labelledby="goal-title">
        <h2 id="goal-title" className="text-center font-display text-3xl font-extrabold text-ink-900">
          What do you want to solve?
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GOALS.map((g) => {
            const course = getCourseBySlug(g.slug)
            if (!course) return null
            const t = toneOf(course.art?.tone || 'brand')
            const inner = (
              <>
                <span className="text-3xl" aria-hidden="true">{g.emoji}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-ink-900">{g.label}</h3>
                <p className={`mt-1 flex-1 text-sm font-semibold ${course.isActive ? t.text : 'text-faint'}`}>
                  {course.title}
                </p>
                <span className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${course.isActive ? t.text : 'text-faint'}`}>
                  {course.isActive
                    ? <>Explore <ArrowRight className="h-3.5 w-3.5" /></>
                    : <><Lock className="h-3.5 w-3.5" /> Coming Soon</>}
                </span>
              </>
            )
            const shell = 'card flex h-full flex-col p-5'
            return course.isActive ? (
              <Link
                key={g.slug} to={courseBase(g.slug)}
                className={`${shell} card-hover border ${t.border} focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40`}
              >
                {inner}
              </Link>
            ) : (
              <div key={g.slug} className={`${shell} border-line opacity-80`} aria-label={`${g.label} — ${course.title}, coming soon`}>
                {inner}
              </div>
            )
          })}
        </div>
      </section>
    </Reveal>
  )
}

// ── 6 · Operating systems — the one and only catalog on this page ──────────
const OS_GROUPS = [
  { title: 'Career', slugs: ['ai-job-hunter-os', 'ai-employee-os'] },
  { title: 'Business', slugs: ['ai-marketing-os', 'ai-agents-business', 'small-business-os'] },
  { title: 'Creator', slugs: ['ai-side-hustle-os'] },
]

function OsCard({ course }) {
  const { ownsCourse } = useAuth()
  const t = toneOf(course.art?.tone || 'brand')

  if (!course.isActive) {
    return (
      <div className="card flex h-full flex-col border-line p-5 opacity-80" aria-label={`${course.title} — coming soon`}>
        <div className="flex items-start justify-between gap-2">
          <span className="text-2xl" aria-hidden="true">{course.art?.emoji}</span>
          <span className="pill border-line text-faint"><Lock className="h-3 w-3" /> Coming Soon</span>
        </div>
        <h3 className="mt-3 font-display text-lg font-bold text-ink-900">{course.title}</h3>
        <p className="mt-1 flex-1 text-sm text-muted">{course.subtitle}</p>
      </div>
    )
  }

  const owned = ownsCourse(course.slug)
  return (
    <div className={`card flex h-full flex-col border ${t.border} p-5`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl" aria-hidden="true">{course.art?.emoji}</span>
        {owned && <span className="pill border-brand-200 bg-brand-50 text-brand-600">✓ Owned</span>}
      </div>
      <h3 className="mt-3 font-display text-lg font-bold text-ink-900">{course.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{course.subtitle}</p>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted">
        {course.skillLevel && <span className="flex items-center gap-1"><Signal className="h-3.5 w-3.5 text-faint" /> {course.skillLevel}</span>}
        <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5 text-faint" /> {course.moduleCount} modules</span>
      </div>

      <div className="mt-auto pt-4">
        {owned ? (
          <Link to={courseBase(course.slug)} className="btn-primary w-full justify-center">
            Continue Building <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <>
            <PriceTag course={course} />
            <PriceNote course={course} className="mt-1.5" />
            <BuyButton course={course} className="mt-3" label="Start Building" />
          </>
        )}
        <Link
          to={osPath(course)}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink-900"
        >
          Explore OS <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}

function OperatingSystems() {
  return (
    <Reveal>
      <section id="systems" aria-labelledby="systems-title" className="scroll-mt-24">
        <h2 id="systems-title" className="text-center font-display text-3xl font-extrabold text-ink-900">
          Choose Your Operating System
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted">
          One problem each. One payment each. Yours to keep using.
        </p>
        <div className="mt-8 space-y-8">
          {OS_GROUPS.map((g) => (
            <div key={g.title}>
              <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-faint">{g.title}</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.slugs.map((slug) => {
                  const c = getCourseBySlug(slug)
                  return c ? <OsCard key={slug} course={c} /> : null
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

// ── 7 · Meet Capy & Byte ────────────────────────────────────────────────────
function MeetCapyByte() {
  return (
    <Reveal>
      <section id="capy-byte" aria-labelledby="mascot-title" className="card scroll-mt-24 border-brand-200 bg-sage-50/60 p-6 sm:p-10">
        <h2 id="mascot-title" className="text-center font-display text-3xl font-extrabold text-ink-900">
          Meet Capy &amp; Byte
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-muted">
          Capy brings the problem. Byte helps solve it. <strong className="text-ink-900">You build the outcome.</strong>
        </p>

        <div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
          {/* Capy reacts on hover; his bubble is the problem. */}
          <div className="group card flex flex-col items-center p-6 text-center transition group-hover:shadow-card">
            <Capy size={104} proximity />
            <div className="relative mt-4 rounded-2xl border border-line bg-card px-4 py-2.5 shadow-soft">
              <p className="font-display text-sm font-bold text-ink-900">“I don’t know where to start.”</p>
            </div>
            <p className="mt-3 text-xs text-faint">Capy — the one with the real-world problem.</p>
          </div>

          {/* Byte floats (built into the mascot); his bubble is the plan. */}
          <div className="group card flex flex-col items-center p-6 text-center">
            <Byte size={88} proximity className="my-2" />
            <div className="relative mt-4 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-2.5">
              <p className="font-display text-sm font-bold text-brand-700">“Let’s break it into steps.”</p>
            </div>
            <p className="mt-3 text-xs text-faint">Byte — the AI assistant with the workflow.</p>
            {/* The solution card that appears — a quiet nod to how lessons feel. */}
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-line bg-card px-3 py-1.5 opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100 motion-reduce:opacity-100">
              <span aria-hidden="true">✅</span>
              <span className="font-display text-xs font-bold text-ink-900">Step 1 · done</span>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  )
}

// ── 8 · Why operating systems ───────────────────────────────────────────────
const COMPARE = {
  old: ['Watch lessons', 'Forget the steps', 'Start from scratch', 'Collect information'],
  staige: ['Learn what matters', 'Complete real missions', 'Build reusable workflows', 'Download practical resources', 'Use the result in real life'],
}

function WhyOperatingSystems() {
  return (
    <Reveal>
      <section aria-labelledby="why-title">
        <h2 id="why-title" className="text-center font-display text-3xl font-extrabold text-ink-900">
          Why an operating system?
        </h2>
        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="card p-6">
            <h3 className="font-display font-bold text-muted">A traditional AI course</h3>
            <ul className="mt-4 space-y-2.5">
              {COMPARE.old.map((x) => (
                <li key={x} className="flex items-center gap-2.5 text-sm text-muted">
                  <XCircle className="h-4 w-4 shrink-0 text-faint" /> {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="card border-brand-200 bg-brand-50/50 p-6">
            <h3 className="font-display font-bold text-brand-700">A STAIGE operating system</h3>
            <ul className="mt-4 space-y-2.5">
              {COMPARE.staige.map((x) => (
                <li key={x} className="flex items-center gap-2.5 text-sm font-medium text-ink-900">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600" /> {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Reveal>
  )
}

// ── 9 · How it works ────────────────────────────────────────────────────────
const STEPS = ['Choose a problem', 'Follow guided missions', 'Build your system', 'Use it in real life']

function HowItWorks() {
  return (
    <Reveal>
      <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-24">
        <h2 id="how-title" className="text-center font-display text-3xl font-extrabold text-ink-900">How it works</h2>
        <ol className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s} className="card p-5 text-center">
              <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-brand-600 font-display text-sm font-extrabold text-white">
                {i + 1}
              </span>
              <p className="mt-3 font-display text-sm font-bold text-ink-900">{s}</p>
            </li>
          ))}
        </ol>
      </section>
    </Reveal>
  )
}

// ── 10 · What you build ─────────────────────────────────────────────────────
const BUILDS = [
  { icon: Library, title: 'Prompt Vaults', text: 'Reusable prompts filed by outcome — yours after the OS ends.' },
  { icon: Bot, title: 'AI Templates', text: 'Ready-to-use templates you fill in, not screenshots you retype.' },
  { icon: Download, title: 'Editable downloads', text: 'Real Word, PDF and Excel files that leave with you.' },
  { icon: ListChecks, title: 'Checklists', text: 'The steps that survive contact with a real Monday.' },
  { icon: LayoutDashboard, title: 'Dashboards', text: 'Trackers you keep updating long after the missions end.' },
  { icon: Workflow, title: 'Workflows', text: 'Repeatable systems — run them again next week without relearning.' },
  { icon: Flag, title: 'Final challenges', text: 'A finishing mission that proves the system works on your problem.' },
  { icon: CloudUpload, title: 'Saved progress', text: 'Everything you build syncs to your account, on every device.' },
]

function WhatYouBuild() {
  return (
    <Reveal>
      <section aria-labelledby="build-title">
        <h2 id="build-title" className="text-center font-display text-3xl font-extrabold text-ink-900">
          What you leave with
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted">
          Not notes. Working assets.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BUILDS.map((b) => (
            <div key={b.title} className="card p-4">
              <span className="mb-2.5 grid h-9 w-9 place-items-center rounded-xl bg-sage-50 text-brand-600">
                <b.icon className="h-4.5 w-4.5" />
              </span>
              <p className="font-display text-sm font-bold text-ink-900">{b.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">{b.text}</p>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

// ── 11 · Pricing ────────────────────────────────────────────────────────────
function Pricing() {
  return (
    <Reveal>
      <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-24">
        <h2 id="pricing-title" className="text-center font-display text-3xl font-extrabold text-ink-900">
          Launch pricing
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted">
          One-time payment. No subscription. Access applies only to the operating system purchased.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {activeCourses.map((c) => (
            <div key={c.slug} className="card flex flex-col p-6 text-center">
              <span className="text-2xl" aria-hidden="true">{c.art?.emoji}</span>
              <h3 className="mt-2 font-display text-lg font-bold text-ink-900">{c.title}</h3>
              <div className="mt-4 flex justify-center"><PriceTag course={c} size="lg" /></div>
              <PriceNote course={c} className="mt-2" />
              <BuyButton course={c} className="mt-5" />
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

// ── 12 · Final CTA ──────────────────────────────────────────────────────────
function FinalCta() {
  return (
    <Reveal>
      <section aria-labelledby="final-title" className="card border-brand-200 bg-brand-50 p-8 text-center sm:p-12">
        <h2 id="final-title" className="font-display text-4xl font-extrabold leading-tight text-ink-900">
          Learn less. <span className="text-brand-600">Build more.</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          Choose the problem you want to solve and start building your AI operating system.
        </p>
        <div className="mt-6 flex justify-center">
          <StartBuilding className="!px-7 !py-3" />
        </div>
      </section>
    </Reveal>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="space-y-16 lg:space-y-24">
      <Hero />
      <WhatIsStaige />
      <ChooseYourGoal />
      <OperatingSystems />
      <MeetCapyByte />
      <WhyOperatingSystems />
      <HowItWorks />
      <WhatYouBuild />
      <Pricing />
      <FinalCta />
    </div>
  )
}
