import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock, Check, Zap } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useCourse } from '../course/CourseContext'
import { moduleProgress } from '../course/progress'
import { ProgressBar } from '../components/ui'
import Blocks from '../components/Blocks'
import { Byte } from '../components/mascots'
import MascotAdvisor from '../components/MascotAdvisor'
import Celebration, { cheer } from '../components/Celebration'
import { tone as toneOf } from '../lib/tones'

export default function Lesson() {
  const { moduleId, lessonId } = useParams()
  const nav = useNavigate()
  const { course, base } = useCourse()
  const lesson = course.getLesson(moduleId, lessonId)
  const m = course.getModule(moduleId)
  const { completed, isLessonDone, completeLesson, setLastLesson, celebratedModules, markModuleCelebrated } = useStore()
  const [celebration, setCelebration] = useState(null)

  useEffect(() => {
    if (lessonId) setLastLesson(lessonId)
    window.scrollTo({ top: 0 })
  }, [lessonId, setLastLesson])

  if (!lesson || !m) return <p className="text-muted">Lesson not found. <Link to={base} className="text-brand-600">Go home</Link></p>

  const t = toneOf(m.color)
  const allLessons = course.allLessons
  const idx = course.lessonIndex(moduleId, lessonId)
  const prev = idx > 0 ? allLessons[idx - 1] : null
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null
  const done = isLessonDone(lessonId)
  const localIdx = m.lessons.findIndex((l) => l.id === lessonId)

  const handleComplete = () => {
    completeLesson(lessonId)
    const updated = [...completed, lessonId]
    const mp = moduleProgress(course, moduleId, updated)
    // XP is derived from `completed`, so finishing the lesson has already
    // awarded it — the celebration just tells the learner it happened.
    if (mp.complete && !celebratedModules.includes(moduleId)) {
      markModuleCelebrated(moduleId)
      setCelebration({
        emoji: m.emoji, tone: m.color, big: true,
        xp: lesson.xp,
        title: `Module ${m.num} complete!`,
        subtitle: `You finished “${m.title}”. That’s a badge earned and real momentum built.`,
        cta: next ? 'Next module →' : 'Back to dashboard',
      })
    } else {
      setCelebration({
        emoji: '✅', tone: 'brand',
        xp: lesson.xp,
        title: 'Lesson complete!',
        subtitle: cheer(completed.length),
        cta: next ? 'Next lesson →' : 'Finish',
      })
    }
  }

  const closeCelebration = () => {
    setCelebration(null)
    if (next) nav(`${base}/module/${next.moduleId}/lesson/${next.id}`)
    else nav(base)
  }

  const mp = moduleProgress(course, moduleId, completed)

  return (
    <div className="mx-auto max-w-3xl">
      <Celebration open={!!celebration} onClose={closeCelebration} {...(celebration || {})} />

      {/* Header */}
      <div className="mb-6">
        <Link to={`${base}/module/${moduleId}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink-800"><ArrowLeft className="h-4 w-4" /> {m.title}</Link>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`pill ${t.border} ${t.text}`}>{m.emoji} Module {m.num}</span>
          {/* Estimated completion time — quiet metadata, same weight as the
              lesson counter. */}
          <span className="pill border-line text-muted" title="Estimated time to complete">
            <Clock className="h-3.5 w-3.5" /> Est. {lesson.minutes} min
          </span>
          <span className="pill border-line text-muted">Lesson {localIdx + 1}/{m.lessons.length}</span>
          {lesson.xp > 0 && (
            <span className={`pill ${done ? 'border-gold-100 text-gold-500' : 'border-line text-muted'}`}>
              <Zap className="h-3.5 w-3.5" /> {done ? `+${lesson.xp} XP earned` : `+${lesson.xp} XP`}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-extrabold leading-tight text-ink-900">{lesson.title}</h1>
            <p className="mt-1 text-lg text-muted">{lesson.subtitle}</p>
          </div>
          <MascotAdvisor mode="lesson" className="hidden sm:block" />
        </div>
        <div className="mt-4"><ProgressBar value={mp.pct} tone={m.color} /></div>
      </div>

      {/* Body */}
      <Blocks blocks={lesson.blocks} />

      {/* Complete CTA */}
      <div className="mt-8">
        {done ? (
          <div className="card flex items-center gap-4 border-brand-200 bg-brand-50 p-5">
            <Byte size={56} />
            <div className="flex-1">
              <p className="font-display font-bold text-brand-700">Lesson complete ✓</p>
              <p className="text-sm text-muted">Nice. Your progress is saved on this device.</p>
            </div>
            {next && <button onClick={() => nav(`${base}/module/${next.moduleId}/lesson/${next.id}`)} className="btn-mint">Next <ArrowRight className="h-4 w-4" /></button>}
          </div>
        ) : (
          <button onClick={handleComplete} className="btn-primary w-full justify-center !py-4 text-base">
            <Check className="h-5 w-5" /> Mark lesson complete
          </button>
        )}
      </div>

      {/* Prev / next
          `min-w-0` is what lets the `truncate` below actually truncate: a flex
          child defaults to min-width:auto and refuses to shrink under its text,
          which pushes the whole page sideways on narrow screens once a lesson
          title is long. The icons need shrink-0 for the same reason. */}
      <div className="mt-6 flex items-center justify-between gap-3">
        {prev ? (
          <Link to={`${base}/module/${prev.moduleId}/lesson/${prev.id}`} className="btn-ghost min-w-0 flex-1 justify-start sm:flex-none">
            <ArrowLeft className="h-4 w-4 shrink-0" /> <span className="truncate">Prev</span>
          </Link>
        ) : <span className="flex-1 sm:flex-none" />}
        {next ? (
          <Link to={`${base}/module/${next.moduleId}/lesson/${next.id}`} className="btn-ghost min-w-0 flex-1 justify-end sm:flex-none">
            <span className="truncate">Next: {next.title}</span> <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        ) : course.features.challenge ? (
          <Link to={`${base}/challenge`} className="btn-primary min-w-0 flex-1 justify-end sm:flex-none">
            <span className="truncate">Start the 7-Day Challenge</span> <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        ) : (
          // Courses without a multi-day challenge end on their final lesson.
          <Link to={base} className="btn-primary min-w-0 flex-1 justify-end sm:flex-none">
            <span className="truncate">Back to dashboard</span> <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        )}
      </div>
    </div>
  )
}
