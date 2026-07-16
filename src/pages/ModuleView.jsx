import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock, Play, Zap } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useCourse } from '../course/CourseContext'
import { moduleProgress } from '../course/progress'
import { ProgressBar, Reveal } from '../components/ui'
import { ContextMascot, MODULE_MASCOT } from '../components/mascots'
import { tone as toneOf } from '../lib/tones'

export default function ModuleView() {
  const { moduleId } = useParams()
  const nav = useNavigate()
  const { course, base } = useCourse()
  const m = course.getModule(moduleId)
  const completed = useStore((s) => s.completed)
  if (!m) return <p className="text-muted">Module not found. <Link to={base} className="text-brand-600">Go home</Link></p>
  const mp = moduleProgress(course, m.id, completed)
  const t = toneOf(m.color)
  const firstUndone = m.lessons.find((l) => !completed.includes(l.id)) || m.lessons[0]
  const mascot = MODULE_MASCOT[m.id] || { pose: 'capy', line: '' }

  return (
    <div className="space-y-6">
      <Link to={`${base}/modules`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink-800"><ArrowLeft className="h-4 w-4" /> All modules</Link>

      <div className={`card relative overflow-hidden border ${t.border} p-6 sm:p-8`}>
        <div className={`pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full ${t.bgSoft} blur-3xl`} />
        <div className="relative grid items-center gap-6 lg:grid-cols-[1.5fr,1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-gradient-to-br ${t.grad} text-3xl shadow-soft`}>{m.emoji}</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-faint">Module {m.num}</p>
                <h1 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">{m.title}</h1>
              </div>
            </div>
            <p className="mt-3 text-ink-700">{m.subtitle}</p>
            <div className="mt-4 max-w-sm">
              <div className="mb-1 flex justify-between text-xs"><span className="text-muted">{mp.done}/{mp.total} lessons</span><span className={`font-bold ${t.text}`}>{mp.pct}%</span></div>
              <ProgressBar value={mp.pct} tone={m.color} />
            </div>
            <button onClick={() => nav(`${base}/module/${m.id}/lesson/${firstUndone.id}`)} className="btn-primary mt-5">
              <Play className="h-4 w-4" /> {mp.done > 0 ? 'Continue' : 'Start module'}
            </button>
          </div>
          <div className="relative hidden lg:block">
            <ContextMascot who={mascot.pose} size={210} proximity className="ml-auto" />
            {mascot.line && (
              <div className="absolute -left-2 top-2 max-w-[12rem] rounded-2xl rounded-bl-sm border border-line bg-card px-3 py-2 text-xs font-medium text-ink-700 shadow-soft">
                {mascot.line}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {m.lessons.map((l, i) => {
          const done = completed.includes(l.id)
          return (
            <Reveal key={l.id} delay={i * 0.05}>
              <Link to={`${base}/module/${m.id}/lesson/${l.id}`} className="card card-hover flex items-center gap-4 p-5">
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${done ? `${t.bgSoft} ${t.text}` : 'bg-sage-100 text-faint'}`}>
                  {done ? <CheckCircle2 className="h-5 w-5" /> : <span className="font-display font-bold">{i + 1}</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold text-ink-900">{l.title}</p>
                  <p className="truncate text-sm text-muted">{l.subtitle}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 text-xs">
                  <span className="flex items-center gap-1.5 text-faint" title="Estimated time to complete">
                    <Clock className="h-3.5 w-3.5" /> {l.minutes} min
                  </span>
                  {l.xp > 0 && (
                    <span className={`flex items-center gap-1 font-semibold ${done ? 'text-gold-500' : 'text-faint'}`}>
                      <Zap className="h-3 w-3" /> {l.xp} XP
                    </span>
                  )}
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
