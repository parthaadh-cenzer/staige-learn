// ============================================================================
//  Settings — the small amount of state this platform actually has.
//  No account system exists (and none is implied): everything lives in this
//  browser. So Settings is: your name, what you've built, and the ability to
//  wipe it. It reuses the store actions the courses already use.
// ============================================================================
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Settings as SettingsIcon, Trash2, Check, ShieldCheck, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { courses, activeCourses, courseBase } from '../data/courses'
import { courseProgress, courseXp, totalCourseXp } from '../course/progress'
import { ProgressBar, Reveal } from '../components/ui'
import { tone as toneOf } from '../lib/tones'

export default function Settings() {
  const { name, setName, completed, favoritePrompts, resetAll } = useStore()
  const [draft, setDraft] = useState(name || '')
  const [saved, setSaved] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const save = () => {
    setName(draft.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

  const wipe = () => {
    resetAll()
    setConfirming(false)
    setDraft('')
  }

  const started = activeCourses.filter((c) => courseProgress(c, completed) > 0)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-3xl bg-brand-50 text-brand-600">
          <SettingsIcon className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">Settings</h1>
          <p className="mt-1 text-muted">Your name and your data. That’s all there is — there’s no account.</p>
        </div>
      </div>

      {/* Name */}
      <Reveal>
        <section aria-labelledby="name-title" className="card p-5 sm:p-6">
          <h2 id="name-title" className="font-display font-bold text-ink-900">What should Byte call you?</h2>
          <p className="mt-1 text-sm text-muted">Used to greet you on your course dashboards. Optional.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <label htmlFor="settings-name" className="sr-only">Your first name</label>
            <input
              id="settings-name" value={draft} onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && save()}
              placeholder="Your first name" className="input max-w-xs"
            />
            <button onClick={save} className="btn-primary">
              {saved ? <><Check className="h-4 w-4" /> Saved</> : 'Save'}
            </button>
          </div>
        </section>
      </Reveal>

      {/* Progress summary */}
      <Reveal>
        <section aria-labelledby="progress-title" className="card p-5 sm:p-6">
          <h2 id="progress-title" className="font-display font-bold text-ink-900">Your progress</h2>
          {started.length === 0 ? (
            <p className="mt-2 text-sm text-muted">
              Nothing started yet. <Link to="/courses" className="font-semibold text-brand-600 hover:underline">Browse the courses →</Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {started.map((c) => {
                const pct = courseProgress(c, completed)
                const xp = courseXp(c, completed)
                const t = toneOf(c.art?.tone || 'brand')
                return (
                  <li key={c.slug}>
                    <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
                      <Link to={courseBase(c.slug)} className="font-display text-sm font-bold text-ink-900 hover:text-brand-700">
                        {c.art?.emoji} {c.title}
                      </Link>
                      <span className="text-xs text-muted">
                        {pct}%{c.features?.xp ? ` · ${xp.toLocaleString()} / ${totalCourseXp(c).toLocaleString()} XP` : ''}
                      </span>
                    </div>
                    <ProgressBar value={pct} tone={c.art?.tone || 'brand'} />
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </Reveal>

      {/* Data */}
      <Reveal>
        <section aria-labelledby="data-title" className="card p-5 sm:p-6">
          <div className="flex items-start gap-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="data-title" className="font-display font-bold text-ink-900">Your data</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Everything — progress, XP, achievements, mission answers, checklists and{' '}
                {favoritePrompts.length} favourited prompt{favoritePrompts.length === 1 ? '' : 's'} — is stored in this
                browser only. There’s no account, no server and nothing is sent anywhere.{' '}
                <Link to="/privacy" className="font-semibold text-brand-600 hover:underline">Read more</Link>.
              </p>
              <p className="mt-2 text-xs text-faint">
                Clearing your browser data for this site will erase it, and it won’t follow you to another device.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Reset — deliberately the last thing, behind a confirm. */}
      <Reveal>
        <section aria-labelledby="reset-title" className="card border-flamingo-100 bg-flamingo-50 p-5 sm:p-6">
          <h2 id="reset-title" className="font-display font-bold text-ink-900">Reset everything</h2>
          <p className="mt-1 text-sm text-muted">
            Wipes progress, XP, achievements and every saved answer across all {courses.length} courses. This can’t be undone.
          </p>
          {confirming ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={wipe} className="btn bg-flamingo-400 text-white hover:brightness-105">
                <Trash2 className="h-4 w-4" /> Yes, erase everything
              </button>
              <button onClick={() => setConfirming(false)} className="btn-ghost">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirming(true)} className="btn-ghost mt-4">
              <Trash2 className="h-4 w-4" /> Reset my progress
            </button>
          )}
        </section>
      </Reveal>

      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline">
        Back to home <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
