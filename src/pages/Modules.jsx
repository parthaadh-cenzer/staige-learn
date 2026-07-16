import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useCourse } from '../course/CourseContext'
import { moduleProgress } from '../course/progress'
import { ProgressBar, Reveal } from '../components/ui'
import { ContextMascot, MODULE_MASCOT, Byte } from '../components/mascots'
import { tone as toneOf } from '../lib/tones'

export default function Modules() {
  const { course, base } = useCourse()
  const completed = useStore((s) => s.completed)
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Byte size={64} proximity className="shrink-0" />
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">{course.ui.modules.title}</h1>
          <p className="mt-1 text-muted">{course.ui.modules.blurb}</p>
        </div>
      </div>
      <div className="grid gap-4">
        {course.modules.map((m, i) => {
          const mp = moduleProgress(course, m.id, completed)
          const t = toneOf(m.color)
          return (
            <Reveal key={m.id} delay={i * 0.04}>
              <Link to={`${base}/module/${m.id}`} className={`card card-hover block border ${mp.complete ? t.border : 'border-line'} p-6`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-gradient-to-br ${t.grad} text-3xl shadow-soft`}>{m.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-faint">Module {m.num}</span>
                      {mp.complete && <span className={`pill ${t.border} ${t.text}`}><CheckCircle2 className="h-3.5 w-3.5" /> Complete</span>}
                    </div>
                    <h2 className="font-display text-xl font-bold text-ink-900">{m.title}</h2>
                    <p className="text-sm text-muted">{m.subtitle}</p>
                    <div className="mt-3 max-w-md">
                      <div className="mb-1 flex justify-between text-xs"><span className="text-faint">{mp.done}/{mp.total} lessons</span><span className={`font-bold ${t.text}`}>{mp.pct}%</span></div>
                      <ProgressBar value={mp.pct} tone={m.color} />
                    </div>
                  </div>
                  <ContextMascot who={MODULE_MASCOT[m.id]?.pose} size={64} className="hidden shrink-0 sm:block" />
                  <ArrowRight className="hidden h-5 w-5 shrink-0 text-faint sm:block" />
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
