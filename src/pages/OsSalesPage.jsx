// ============================================================================
//  OsSalesPage — the ONE reusable sales page for every Operating System.
//  Route: /os/:slug  (short slug, e.g. /os/job-hunter).
//
//  This template names no course. It resolves the course from the URL, derives
//  everything it shows via salesView(course) (see course/sales.js), and renders
//  the same eleven sections for any OS. A future creator-made OS gets its own
//  sales page by adding a `sales` block to its registry entry — no code here
//  changes. Sections whose metadata is absent simply don't render.
//
//  Design reuses the existing STAIGE system: white surfaces, one green accent,
//  the same cards/pills/mascots. It does not restyle anything global.
// ============================================================================
import { Navigate, useParams, Link } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { ArrowRight, Check, X, Signal, ChevronDown, Lock } from 'lucide-react'
import { getCourseByOsParam, osPath, courseBase } from '../data/courses'
import { salesView } from '../course/sales'
import { useAuth } from '../auth/AuthProvider'
import { PriceTag, PriceNote, BuyButton } from '../components/Pricing'
import { Reveal } from '../components/ui'
import { Capy, Byte } from '../components/mascots'
import { tone as toneOf } from '../lib/tones'

// Metadata carries lucide icon NAMES (strings); resolve them without hardcoding.
const Icon = ({ name, ...p }) => {
  const C = Icons[name] || Icons.Sparkles
  return <C {...p} />
}

// The primary CTA, everywhere it appears. Owner → into the course; visitor →
// BuyButton, which handles signed-out ("Sign in to Buy", returning here after
// login) vs signed-in ("Buy for $5"). Access is never decided here.
function SalesCta({ course, className = '' }) {
  const { ownsCourse } = useAuth()
  if (ownsCourse(course.slug)) {
    return (
      <Link to={courseBase(course.slug)} className={`btn-primary justify-center ${className}`}>
        Continue Building <ArrowRight className="h-4 w-4" />
      </Link>
    )
  }
  return (
    <BuyButton
      course={course}
      className={className}
      signedOutLabel="Sign in to Buy"
      returnTo={osPath(course)}
    />
  )
}

// ── 1 · Hero ────────────────────────────────────────────────────────────────
function Hero({ course, view }) {
  const t = toneOf(course.art?.tone || 'brand')
  return (
    <section aria-labelledby="os-title" className="card relative overflow-hidden p-6 sm:p-10">
      <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-brand-100/50 blur-3xl" />
      <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="min-w-0">
          <span className={`pill ${t.border} ${t.text}`} aria-hidden="true">{course.art?.emoji} Operating System</span>
          <h1 id="os-title" className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl">
            {course.title}
          </h1>
          <p className="mt-4 whitespace-pre-line font-display text-xl font-bold leading-snug text-brand-600 sm:text-2xl">
            {view.hero.headline}
          </p>
          <p className="mt-3 max-w-xl leading-relaxed text-muted">{view.hero.sub}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {view.highlights.map((h, i) => (
              <li key={i} className="pill border-line text-muted">
                {i === 0
                  ? <Signal className="h-3.5 w-3.5 text-faint" />
                  : <Check className="h-3.5 w-3.5 text-brand-600" />} {h}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            {course.requiresPurchase ? (
              <>
                <PriceTag course={course} size="lg" />
                <PriceNote course={course} className="mt-1.5" />
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <SalesCta course={course} />
                  <a href="#inside" className="btn-ghost">See What’s Inside <ArrowRight className="h-4 w-4" /></a>
                </div>
              </>
            ) : (
              <span className="pill border-line text-faint"><Lock className="h-3.5 w-3.5" /> Coming Soon</span>
            )}
          </div>
        </div>

        {/* Capy carries the problem into the page. */}
        <div className="hidden justify-self-center lg:block">
          <Capy size={220} proximity />
        </div>
      </div>
    </section>
  )
}

// ── 2 · Is this your problem? ───────────────────────────────────────────────
function Problems({ view }) {
  if (!view.problems.length) return null
  return (
    <Reveal>
      <section aria-labelledby="problems-title">
        <h2 id="problems-title" className="text-center font-display text-3xl font-extrabold text-ink-900">
          Is this your problem?
        </h2>
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
          {view.problems.map((p, i) => (
            <div key={i} className="card p-6 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-flamingo-50 text-flamingo-500">
                <Icon name={p.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display font-bold text-ink-900">{p.title}</h3>
              {p.text && <p className="mt-1 text-sm leading-relaxed text-muted">{p.text}</p>}
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

// ── 3 · What You'll Build ───────────────────────────────────────────────────
function Builds({ course, view }) {
  if (!view.builds.length) return null
  return (
    <Reveal>
      <section aria-labelledby="builds-title" className="card border-brand-200 bg-brand-50/50 p-6 sm:p-10">
        <h2 id="builds-title" className="text-center font-display text-3xl font-extrabold text-ink-900">
          What you’ll build
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted">
          Not notes — working assets you finish the {course.title.replace(/^AI /, '')} with.
        </p>
        <ul className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
          {view.builds.map((b, i) => (
            <li key={i} className="flex items-center gap-3 rounded-2xl border border-brand-200 bg-card px-4 py-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                <Check className="h-4 w-4" />
              </span>
              <span className="font-medium text-ink-900">{b}</span>
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  )
}

// ── 4 · Inside the Operating System (expandable modules) ────────────────────
function InsideModules({ view }) {
  if (!view.modules.length) return null
  return (
    <Reveal>
      <section id="inside" aria-labelledby="inside-title" className="scroll-mt-24">
        <h2 id="inside-title" className="text-center font-display text-3xl font-extrabold text-ink-900">
          Inside the Operating System
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted">
          {view.modules.length} modules. Expand any one to see what it covers.
        </p>
        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {view.modules.map((m, i) => (
            <details key={m.num} className="group card overflow-hidden p-0" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center gap-4 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sage-50 text-lg" aria-hidden="true">
                  {m.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-faint">Module {m.num}</span>
                  <span className="block font-display font-bold text-ink-900">{m.title}</span>
                </span>
                <ChevronDown className="h-5 w-5 shrink-0 text-faint transition group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="border-t border-line px-5 py-4 sm:pl-[4.75rem]">
                {m.desc && <p className="text-sm leading-relaxed text-muted">{m.desc}</p>}
                {m.lessons > 0 && (
                  <p className="mt-2 text-xs font-semibold text-faint">{m.lessons} lessons</p>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

// ── 5 · Included Resources ──────────────────────────────────────────────────
function Resources({ view }) {
  if (!view.resources.length) return null
  return (
    <Reveal>
      <section aria-labelledby="res-title">
        <h2 id="res-title" className="text-center font-display text-3xl font-extrabold text-ink-900">
          Included with the OS
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {view.resources.map((r, i) => (
            <div key={i} className="card flex items-start gap-3.5 p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sage-50 text-brand-600">
                <Icon name={r.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-ink-900">{r.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-muted">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

// ── 6 · Meet Capy & Byte (small, reuses existing mascots) ───────────────────
function MeetCapyByte() {
  return (
    <Reveal>
      <section aria-labelledby="mascot-title" className="card border-brand-200 bg-sage-50/60 p-6 sm:p-8">
        <div className="grid items-center gap-6 sm:grid-cols-[auto,1fr]">
          <div className="flex shrink-0 items-end gap-2 justify-self-center">
            <Capy size={92} proximity />
            <Byte size={64} proximity />
          </div>
          <div>
            <h2 id="mascot-title" className="font-display text-2xl font-extrabold text-ink-900">Meet Capy &amp; Byte</h2>
            <p className="mt-2 max-w-md leading-relaxed text-muted">
              <strong className="text-ink-900">Capy brings the problem</strong> — the real one you actually have.{' '}
              <strong className="text-ink-900">Byte helps solve it</strong> with the workflow. And{' '}
              <strong className="text-ink-900">you build the outcome</strong>, one mission at a time.
            </p>
          </div>
        </div>
      </section>
    </Reveal>
  )
}

// ── 7 · Who Is This For? ────────────────────────────────────────────────────
function Audience({ view }) {
  const { yes, no } = view.audience
  if (!yes.length && !no.length) return null
  return (
    <Reveal>
      <section aria-labelledby="who-title">
        <h2 id="who-title" className="text-center font-display text-3xl font-extrabold text-ink-900">
          Who is this for?
        </h2>
        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          {yes.length > 0 && (
            <div className="card p-6">
              <h3 className="flex items-center gap-2 font-display font-bold text-brand-700">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-white"><Check className="h-4 w-4" /></span>
                This is for you if…
              </h3>
              <ul className="mt-4 space-y-2.5">
                {yes.map((x) => (
                  <li key={x} className="flex items-center gap-2.5 text-sm font-medium text-ink-900">
                    <Check className="h-4 w-4 shrink-0 text-brand-600" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {no.length > 0 && (
            <div className="card p-6">
              <h3 className="flex items-center gap-2 font-display font-bold text-muted">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-sage-100 text-faint"><X className="h-4 w-4" /></span>
                It’s not for you if…
              </h3>
              <ul className="mt-4 space-y-2.5">
                {no.map((x) => (
                  <li key={x} className="flex items-center gap-2.5 text-sm text-muted">
                    <X className="h-4 w-4 shrink-0 text-faint" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </Reveal>
  )
}

// ── 8 · How It Works ────────────────────────────────────────────────────────
const STEPS = ['Choose your OS', 'Complete guided missions', 'Download your resources', 'Use it in real life']
function HowItWorks() {
  return (
    <Reveal>
      <section aria-labelledby="how-title">
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

// ── 9 · Pricing ─────────────────────────────────────────────────────────────
function PricingSection({ course }) {
  if (!course.requiresPurchase) return null
  return (
    <Reveal>
      <section id="pricing" aria-labelledby="price-title" className="scroll-mt-24">
        <div className="mx-auto max-w-lg card border-brand-200 p-8 text-center">
          <span className="pill border-brand-200 bg-brand-50 text-brand-600">Launch Offer</span>
          <h2 id="price-title" className="mt-4 font-display text-2xl font-extrabold text-ink-900">{course.title}</h2>
          <div className="mt-4 flex justify-center"><PriceTag course={course} size="lg" /></div>
          <PriceNote course={course} className="mt-2" />
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
            One payment. Access only to this Operating System — buying one does not unlock the others.
            No subscription.
          </p>
          <div className="mt-6"><SalesCta course={course} className="w-full" /></div>
        </div>
      </section>
    </Reveal>
  )
}

// ── 10 · FAQ ────────────────────────────────────────────────────────────────
function Faq({ view }) {
  if (!view.faq.length) return null
  return (
    <Reveal>
      <section aria-labelledby="faq-title">
        <h2 id="faq-title" className="text-center font-display text-3xl font-extrabold text-ink-900">
          Questions
        </h2>
        <div className="mx-auto mt-8 max-w-2xl space-y-3">
          {view.faq.map((f, i) => (
            <details key={i} className="group card p-0">
              <summary className="flex cursor-pointer list-none items-center gap-3 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                <span className="flex-1 font-display font-bold text-ink-900">{f.q}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-faint transition group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="border-t border-line px-5 py-4 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

// ── 11 · Final CTA ──────────────────────────────────────────────────────────
function FinalCta({ course, view }) {
  return (
    <Reveal>
      <section aria-labelledby="final-title" className="card border-brand-200 bg-brand-50 p-8 text-center sm:p-12">
        <h2 id="final-title" className="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
          {view.finalHeadline}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted">{view.finalSub}</p>
        {course.requiresPurchase && (
          <div className="mx-auto mt-6 max-w-xs"><SalesCta course={course} className="w-full" /></div>
        )}
      </section>
    </Reveal>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function OsSalesPage() {
  const { slug } = useParams()
  const course = getCourseByOsParam(slug)

  // Unknown OS → the library, not a dead end.
  if (!course) return <Navigate to="/courses" replace />

  const view = salesView(course)

  return (
    <div className="space-y-16 lg:space-y-20">
      <Hero course={course} view={view} />
      <Problems view={view} />
      <Builds course={course} view={view} />
      <InsideModules view={view} />
      <Resources view={view} />
      <MeetCapyByte />
      <Audience view={view} />
      <HowItWorks />
      <PricingSection course={course} />
      <Faq view={view} />
      <FinalCta course={course} view={view} />
    </div>
  )
}
