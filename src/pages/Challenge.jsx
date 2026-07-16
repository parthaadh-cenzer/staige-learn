import { useState, useEffect, useRef } from 'react'
import { Flame, Check, Download, Lock, Loader2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useCourse } from '../course/CourseContext'
import { challengeDoc } from '../lib/resourceDoc'
import { downloadDoc } from '../lib/exporters'
import { ProgressBar, Reveal, Confetti } from '../components/ui'
import { Byte, Capy, Mascot } from '../components/mascots'
import { tone as toneOf } from '../lib/tones'

function DayField({ field, value, onChange }) {
  if (field.type === 'textarea')
    return <textarea rows={2} className="input" placeholder={field.placeholder} value={value || ''} onChange={(e) => onChange(e.target.value)} />
  if (field.type === 'select')
    return (
      <select className="input" value={value || ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choose…</option>
        {field.options.map((o) => <option key={o}>{o}</option>)}
      </select>
    )
  if (field.type === 'checks') {
    const arr = Array.isArray(value) ? value : []
    return (
      <div className="flex flex-wrap gap-2">
        {field.options.map((o) => {
          const on = arr.includes(o)
          return <button key={o} onClick={() => onChange(on ? arr.filter((x) => x !== o) : [...arr, o])} className={`rounded-2xl border px-3 py-1.5 text-sm transition ${on ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-line bg-sage-50 text-ink-700 hover:bg-mint-50'}`}>{on ? '✓ ' : ''}{o}</button>
        })}
      </div>
    )
  }
  return <input className="input" placeholder={field.placeholder} value={value || ''} onChange={(e) => onChange(e.target.value)} />
}

export default function Challenge() {
  const { course } = useCourse()
  const challengeDays = course.challenge.days
  const finalReflection = course.challenge.finalReflection
  const { challenge, challengeComplete, setChallengeField, toggleChallengeDay, worksheets, setWorksheetField } = useStore()
  const [burst, setBurst] = useState(false)
  const allDone = challengeDays.length > 0 && challengeComplete.length === challengeDays.length
  const wasDone = useRef(allDone) // seed with mount value → no replay on reload

  // Fire once only when the challenge *reaches* 100%; reset so re-completing fires again.
  useEffect(() => {
    if (allDone && !wasDone.current) {
      wasDone.current = true
      setBurst(true)
      const id = setTimeout(() => setBurst(false), 3600)
      return () => clearTimeout(id)
    }
    if (!allDone) wasDone.current = false
  }, [allDone])

  const reflection = worksheets['final-reflection'] || {}
  const [busy, setBusy] = useState(false)

  // A record of what you shipped, in your own words → an editable document.
  const exportChallenge = async () => {
    setBusy(true)
    try {
      await downloadDoc(challengeDoc(
        { days: challengeDays, challenge, challengeComplete },
        course.title
      ))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <Confetti fire={burst} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Capy size={72} proximity className="shrink-0" />
          <div>
            <h1 className="font-display text-3xl font-extrabold text-ink-900">{course.ui.challenge.title}</h1>
            <p className="text-muted">{course.ui.challenge.blurb}</p>
          </div>
        </div>
        <button onClick={exportChallenge} disabled={busy} className="btn-ghost shrink-0">
          {busy
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Preparing…</>
            : <><Download className="h-4 w-4" /> Export Word</>}
        </button>
      </div>

      {/* Progress header */}
      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between text-sm"><span className="font-semibold text-ink-700">{challengeComplete.length} of {challengeDays.length} days done</span><span className="font-bold text-flamingo-500">{Math.round((challengeComplete.length / challengeDays.length) * 100)}%</span></div>
        <ProgressBar value={(challengeComplete.length / challengeDays.length) * 100} tone="flamingo" />
      </div>

      <div className="space-y-4">
        {challengeDays.map((d, i) => {
          const t = toneOf(d.tone)
          const isDone = challengeComplete.includes(d.day)
          const locked = i > 0 && !challengeComplete.includes(challengeDays[i - 1].day)
          return (
            <Reveal key={d.day} delay={i * 0.03}>
              <div className={`card border ${isDone ? t.border : 'border-line'} p-5 ${locked ? 'opacity-70' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${t.grad} text-2xl`}>{d.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-faint">Day {d.day}</span>
                      {locked && <span className="pill border-line text-faint"><Lock className="h-3 w-3" /> finish day {d.day - 1} first</span>}
                    </div>
                    <h3 className="font-display text-lg font-bold text-ink-900">{d.title}</h3>
                    <p className="text-sm text-muted">{d.brief}</p>
                  </div>
                </div>
                {!locked && (
                  <div className="mt-4 space-y-3 pl-0 sm:pl-16">
                    {d.fields.map((f) => (
                      <div key={f.id}>
                        <label className="mb-1.5 block text-sm font-medium text-ink-700">{f.label}</label>
                        <DayField field={f} value={challenge[d.day]?.[f.id]} onChange={(v) => setChallengeField(d.day, f.id, v)} />
                      </div>
                    ))}
                    <button onClick={() => toggleChallengeDay(d.day)} className={isDone ? 'btn-ghost' : 'btn-mint'}>
                      <Check className="h-4 w-4" /> {isDone ? 'Day complete — undo?' : `Mark Day ${d.day} done`}
                    </button>
                  </div>
                )}
              </div>
            </Reveal>
          )
        })}
      </div>

      {/* Final reflection */}
      <div className="card border-brand-200 bg-brand-50 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Byte size={56} />
          <div>
            <h2 className="font-display text-lg font-bold text-ink-900">Before you leave — answer honestly</h2>
            <p className="text-sm text-muted">The real goal isn’t a customer in 7 days. It’s becoming someone who launches.</p>
          </div>
        </div>
        <div className="space-y-2">
          {finalReflection.map((qst, i) => {
            const v = reflection[`q${i}`]
            return (
              <div key={i} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-card px-4 py-3">
                <span className="text-sm text-ink-800">{qst}</span>
                <div className="flex shrink-0 gap-1.5">
                  {['Yes', 'No'].map((opt) => (
                    <button key={opt} onClick={() => setWorksheetField('final-reflection', `q${i}`, opt)} className={`rounded-xl border px-3 py-1 text-xs font-semibold transition ${v === opt ? (opt === 'Yes' ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-flamingo-100 bg-flamingo-50 text-flamingo-500') : 'border-line text-muted hover:bg-sage-50'}`}>{opt}</button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {allDone && (
        <div className="card overflow-hidden border-flamingo-100 bg-gradient-to-br from-sun-50 to-flamingo-50 p-6 text-center">
          <Mascot pose="hero" anim="celebrate" hover={false} className="mx-auto mb-2 w-72" />
          <p className="text-4xl">🏆</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-ink-900">You finished the 7-Day Challenge.</h2>
          <p className="mt-1 text-ink-700">A year from now you’ll have a side hustle — or you’ll still be thinking about starting one. You chose to build. — John Cenzer</p>
        </div>
      )}
    </div>
  )
}
