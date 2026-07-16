import { Link, useNavigate } from 'react-router-dom'
import { Play, ArrowRight, CheckCircle2, BookOpen, Trophy, Flame, Target, Zap } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useStore } from '../store/useStore'
import { useCourse } from '../course/CourseContext'
import { courseProgress, courseXp, totalCourseXp, moduleProgress, nextLesson } from '../course/progress'
import { ProgressRing, ProgressBar, Reveal } from '../components/ui'
import { Byte, ContextMascot, MODULE_MASCOT } from '../components/mascots'
import MascotAdvisor from '../components/MascotAdvisor'
import { tone as toneOf } from '../lib/tones'

const Icon = ({ name, ...p }) => { const C = Icons[name] || Icons.Sparkles; return <C {...p} /> }

function StatCard({ icon: I, label, value, sub, tone }) {
  const t = toneOf(tone)
  return (
    <div className="card card-hover p-4">
      <div className={`mb-3 grid h-10 w-10 place-items-center rounded-2xl ${t.bgSoft} ${t.text}`}><I className="h-5 w-5" /></div>
      <p className="font-display text-2xl font-extrabold text-ink-900">{value}</p>
      <p className="text-xs text-muted">{label}</p>
      {sub && <p className={`mt-0.5 text-xs font-semibold ${t.text}`}>{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const nav = useNavigate()
  const { course, base } = useCourse()
  const { completed, name, lastLessonId, challengeComplete } = useStore()
  const progress = courseProgress(course, completed)
  const next = nextLesson(course, completed, lastLessonId)
  const totalLessons = course.totalLessons
  const modules = course.modules
  const modulesDone = modules.filter((m) => moduleProgress(course, m.id, completed).complete).length
  const fresh = completed.filter((id) => course.lessonIds.has(id)).length === 0
  const done = progress === 100

  const d = course.ui.dashboard
  const hasChallenge = course.features.challenge
  const hasXp = course.features.xp
  const finalChallenge = course.finalChallenge

  const xp = courseXp(course, completed)
  const xpTotal = totalCourseXp(course)

  const badgeCtx = { completed, progress, xp, challengeDone: challengeComplete.length }
  const earnedBadges = [
    ...course.badges.module.filter((b) => moduleProgress(course, b.moduleId, completed).complete),
    ...course.badges.milestone.filter((b) => b.test(badgeCtx)),
  ].length

  const tNext = toneOf(next.moduleColor)
  const blurb = (progress === 0 ? d.blurb.start : done ? d.blurb.done : d.blurb.mid).replace('{pct}', progress)

  // Start / Continue / Complete — the CTA reflects where the learner actually is.
  const ctaLabel = fresh ? 'Start course' : done ? 'Review the course' : 'Continue learning'

  return (
    <div className="space-y-8">
      {/* Hero */}
      <Reveal>
        <div className="card relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-brand-100/60 blur-3xl" />
          <div className="relative grid items-center gap-6 lg:grid-cols-[1.4fr,1fr]">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="pill border-brand-200 text-brand-600"><Icons.Sparkles className="h-3.5 w-3.5" /> {d.eyebrow}</span>
                {done && <span className="pill border-gold-100 text-gold-500"><Trophy className="h-3.5 w-3.5" /> Course complete</span>}
              </div>
              <h1 className="font-display text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
                {name
                  ? <>Welcome back, <span className="text-brand-600">{name}</span>.</>
                  : <>{d.heroTitle} <span className="heading-accent">{d.heroAccent}</span>.</>}
              </h1>
              <p className="mt-2 max-w-lg text-muted">{blurb}</p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <button onClick={() => nav(`${base}/module/${next.moduleId}/lesson/${next.id}`)} className="btn-primary">
                  <Play className="h-4 w-4" /> {ctaLabel}
                </button>
                <Link to={`${base}/modules`} className="btn-ghost">Browse modules <ArrowRight className="h-4 w-4" /></Link>
                <div className="flex items-center gap-3">
                  <ProgressRing value={progress} size={56} stroke={6} tone="brand">
                    <span className="font-display text-xs font-extrabold text-ink-900">{progress}%</span>
                  </ProgressRing>
                  <span className="text-xs text-muted">
                    {completed.filter((id) => course.lessonIds.has(id)).length}/{totalLessons}<br />lessons
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <MascotAdvisor mode="hero" className="ml-auto" />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Stats — a course shows the 4th card it actually has data for. */}
      <div className={`grid grid-cols-2 gap-3 sm:gap-4 ${hasChallenge || hasXp ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        <StatCard icon={CheckCircle2} label="Lessons completed" value={`${completed.filter((id) => course.lessonIds.has(id)).length}/${totalLessons}`} tone="brand" />
        <StatCard icon={BookOpen} label="Modules finished" value={`${modulesDone}/${modules.length}`} tone="mint" />
        <StatCard icon={Trophy} label="Badges earned" value={earnedBadges} tone="gold" />
        {hasChallenge && <StatCard icon={Flame} label="Challenge days" value={`${challengeComplete.length}/7`} tone="flamingo" />}
        {!hasChallenge && hasXp && (
          <StatCard icon={Zap} label="XP earned" value={xp.toLocaleString()} sub={`of ${xpTotal.toLocaleString()} XP`} tone="flamingo" />
        )}
      </div>

      {/* Continue + spotlight */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className={`card card-hover h-full border ${tNext.border} p-6`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-faint">
              {fresh ? 'Your next step' : done ? 'Revisit any lesson' : 'Pick up where you left off'}
            </p>
            <div className="mt-3 flex items-start justify-between gap-4">
              <div>
                <span className={`pill ${tNext.border} ${tNext.text}`}>Module {next.moduleNum} · {next.moduleTitle}</span>
                <h2 className="mt-2 font-display text-2xl font-bold text-ink-900">{next.title}</h2>
                <p className="mt-1 text-muted">{next.subtitle}</p>
                <p className="mt-1 text-xs text-faint">~{next.minutes} min read</p>
              </div>
              <Byte size={64} proximity className="hidden shrink-0 sm:block" />
            </div>
            <button onClick={() => nav(`${base}/module/${next.moduleId}/lesson/${next.id}`)} className="btn-primary mt-5">
              <Play className="h-4 w-4" /> {fresh ? 'Begin' : 'Continue this lesson'}
            </button>
          </div>
        </Reveal>

        {hasChallenge ? (
          <Reveal delay={0.05}>
            <Link to={`${base}/challenge`} className="card card-hover flex h-full flex-col justify-between border-flamingo-100 bg-flamingo-50 p-6">
              <div>
                <div className="flex items-center gap-2"><Flame className="h-5 w-5 text-flamingo-500" /><p className="font-display font-bold text-ink-900">7-Day Challenge</p></div>
                <p className="mt-1 text-sm text-muted">Take everything you learn and ship it in a week.</p>
              </div>
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-xs"><span className="text-muted">{challengeComplete.length} of 7 days</span><span className="font-bold text-flamingo-500">{Math.round((challengeComplete.length / 7) * 100)}%</span></div>
                <ProgressBar value={(challengeComplete.length / 7) * 100} tone="flamingo" />
                <div className="mt-3 flex gap-1.5">
                  {course.challenge.days.map((day) => (
                    <div key={day.day} className={`grid h-7 flex-1 place-items-center rounded-lg text-xs font-semibold ${challengeComplete.includes(day.day) ? 'bg-flamingo-400 text-white' : 'bg-card text-faint'}`}>{day.day}</div>
                  ))}
                </div>
              </div>
            </Link>
          </Reveal>
        ) : finalChallenge && (
          <Reveal delay={0.05}>
            <FinalChallengeCard base={base} fc={finalChallenge} done={completed.includes(finalChallenge.lessonId)} />
          </Reveal>
        )}
      </div>

      {/* Modules overview */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink-900">Your modules</h2>
          <Link to={`${base}/modules`} className="text-sm font-semibold text-brand-600 hover:text-brand-700">View all →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => {
            const mp = moduleProgress(course, m.id, completed)
            const t = toneOf(m.color)
            return (
              <Reveal key={m.id} delay={i * 0.04}>
                <Link to={`${base}/module/${m.id}`} className={`card card-hover block h-full p-5 ${mp.complete ? `border ${t.border}` : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{m.emoji}</span>
                    <div className="flex items-center gap-2">
                      {mp.complete ? <CheckCircle2 className={`h-5 w-5 ${t.text}`} /> : <span className="text-xs font-semibold text-faint">{mp.done}/{mp.total}</span>}
                      <ContextMascot who={MODULE_MASCOT[m.id]?.pose} size={36} />
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-faint">Module {m.num}</p>
                  <p className="font-display font-bold text-ink-900">{m.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{m.subtitle}</p>
                  <div className="mt-3"><ProgressBar value={mp.pct} tone={m.color} /></div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>

      {/* Bonus resources */}
      {d.bonuses?.length > 0 && (
        <div>
          <h2 className="mb-3 font-display text-xl font-bold text-ink-900">Bonus resources</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {d.bonuses.map((b, i) => {
              const t = toneOf(b.tone)
              return (
                <Reveal key={b.sub} delay={i * 0.04}>
                  <Link to={`${base}/${b.sub}`} className="card card-hover flex h-full flex-col p-5">
                    <div className={`mb-3 grid h-10 w-10 place-items-center rounded-2xl ${t.bgSoft} ${t.text}`}><Icon name={b.icon} className="h-5 w-5" /></div>
                    <p className="font-display font-bold text-ink-900">{b.label}</p>
                    <p className="text-sm text-muted">{b.desc}</p>
                    <ArrowRight className={`mt-3 h-4 w-4 ${t.text}`} />
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty-state signature scene / read-this-first */}
      <Reveal>
        {fresh ? (
          <div className="card relative overflow-hidden border-brand-200 bg-gradient-to-br from-sage-50 to-brand-50 p-6 sm:p-8">
            <div className="grid items-center gap-6 sm:grid-cols-[1.3fr,1fr]">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-ink-900">Meet Capy & Byte 👋</h2>
                <p className="mt-2 max-w-md text-muted">
                  {d.meet || 'Capy’s the entrepreneur — that’s you. Byte’s your AI sidekick. Together you’ll pick a path, build an offer, and launch it. Start with the 90-second pep talk.'}
                </p>
                <Link to={`${base}/welcome`} className="btn-primary mt-5">Read this first <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <MascotAdvisor mode="empty" className="w-full" />
            </div>
          </div>
        ) : (
          <Link to={`${base}/welcome`} className="card card-hover flex items-center gap-4 border-brand-200 bg-brand-50 p-5">
            <Byte size={52} />
            <div className="flex-1">
              <p className="font-display font-bold text-ink-900">{course.intro.title}</p>
              <p className="text-sm text-muted">{course.intro.subtitle}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-brand-600" />
          </Link>
        )}
      </Reveal>
    </div>
  )
}

// Spotlight for courses whose finale is a lesson rather than a multi-day challenge.
function FinalChallengeCard({ base, fc, done }) {
  const t = toneOf(fc.tone || 'brand')
  return (
    <Link to={`${base}/module/${fc.moduleId}/lesson/${fc.lessonId}`} className={`card card-hover flex h-full flex-col justify-between border ${t.border} ${t.bgSoft} p-6`}>
      <div>
        <div className="flex items-center gap-2">
          <Target className={`h-5 w-5 ${t.text}`} />
          <p className="font-display font-bold text-ink-900">{fc.title}</p>
        </div>
        <p className="mt-1 text-sm text-muted">{fc.blurb}</p>
      </div>
      <div className="mt-4">
        <span className="text-4xl" aria-hidden="true">{fc.emoji}</span>
        <p className={`mt-3 flex items-center gap-1.5 text-sm font-semibold ${done ? t.text : 'text-muted'}`}>
          {done ? <><CheckCircle2 className="h-4 w-4" /> Completed</> : <>Take the challenge <ArrowRight className="h-4 w-4" /></>}
        </p>
      </div>
    </Link>
  )
}
