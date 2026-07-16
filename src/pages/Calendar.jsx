import { useState } from 'react'
import { CalendarDays, Download, Loader2 } from 'lucide-react'
import { useCourse } from '../course/CourseContext'
import { calendarDoc } from '../lib/resourceDoc'
import { downloadDoc } from '../lib/exporters'
import { tone as toneOf } from '../lib/tones'
import { Reveal } from '../components/ui'
import { Byte, Capy } from '../components/mascots'

export default function Calendar() {
  const { course } = useCourse()
  const { weeklyStructure, thirtyDays } = course.calendar
  const [busy, setBusy] = useState(false)
  // A calendar is a grid you work through → a real spreadsheet, with a column
  // to tick off what you've posted.
  const exportPlan = async () => {
    setBusy(true)
    try {
      await downloadDoc(calendarDoc(course.calendar, course.title))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Capy size={72} proximity className="shrink-0" />
          <div>
            <h1 className="font-display text-3xl font-extrabold text-ink-900">{course.ui.calendar.title}</h1>
            <p className="text-muted">{course.ui.calendar.blurb}</p>
          </div>
        </div>
        <button onClick={exportPlan} disabled={busy} className="btn-ghost shrink-0">
          {busy
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Preparing…</>
            : <><Download className="h-4 w-4" /> Export Excel</>}
        </button>
      </div>

      {/* Weekly rhythm */}
      <div>
        <h2 className="mb-3 font-display text-xl font-bold text-ink-900">The weekly rhythm</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {weeklyStructure.map((w, i) => {
            const t = toneOf(w.tone)
            return (
              <Reveal key={w.day} delay={i * 0.04}>
                <div className={`card card-hover h-full border ${t.border} p-4`}>
                  <p className="text-xs font-bold uppercase tracking-wide text-faint">{w.day}</p>
                  <p className={`font-display font-bold ${t.text}`}>{w.theme}</p>
                  <p className="mt-2 text-sm text-muted">“{w.example}”</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>

      {/* 30 day grid */}
      <div>
        <h2 className="mb-3 font-display text-xl font-bold text-ink-900">Your 30 days, mapped</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {thirtyDays.map((d, i) => {
            const t = toneOf(d.tone)
            return (
              <Reveal key={d.day} delay={Math.min(i, 12) * 0.015}>
                <div className="card card-hover h-full p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-extrabold text-ink-900">{d.day}</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${t.dot}`} />
                  </div>
                  <p className={`mt-1 text-xs font-bold ${t.text}`}>{d.theme}</p>
                  <p className="mt-1 text-xs leading-snug text-muted">{d.prompt}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>

      <div className="card flex items-center gap-4 border-brand-200 bg-brand-50 p-5">
        <Byte size={56} />
        <p className="text-sm text-ink-700">Don’t overthink each post. Pick the theme for the day, write one honest thing, hit publish. <span className="font-semibold text-ink-900">Consistency beats intensity.</span></p>
      </div>
    </div>
  )
}
