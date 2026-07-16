import { Trophy, Lock, Zap } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useCourse } from '../course/CourseContext'
import { courseProgress, courseXp, totalCourseXp, moduleProgress } from '../course/progress'
import { ProgressBar, Reveal } from '../components/ui'
import { Capy } from '../components/mascots'
import { tone as toneOf } from '../lib/tones'

function BadgeCard({ badge, earned, delay }) {
  const t = toneOf(badge.tone)
  return (
    <Reveal delay={delay}>
      <div className={`card relative h-full overflow-hidden p-5 text-center transition ${earned ? `border ${t.border} ${t.bgSoft}` : ''}`}>
        <div className={`mx-auto grid h-16 w-16 place-items-center rounded-3xl text-3xl ${earned ? `bg-gradient-to-br ${t.grad} shadow-soft` : 'bg-sage-100 grayscale'}`}>
          {earned ? badge.emoji : <Lock className="h-6 w-6 text-faint" />}
        </div>
        <p className="mt-3 font-display font-bold text-ink-900">{badge.title}</p>
        <p className="text-xs text-muted">{badge.desc}</p>
        <span className={`pill mt-3 ${earned ? `${t.border} ${t.text}` : 'border-line text-faint'}`}>{earned ? 'Earned' : 'Locked'}</span>
      </div>
    </Reveal>
  )
}

export default function Badges() {
  const { course } = useCourse()
  const { completed, challengeComplete } = useStore()
  const progress = courseProgress(course, completed)
  const xp = courseXp(course, completed)
  const ctx = { completed, progress, xp, challengeDone: challengeComplete.length }
  const moduleBadges = course.badges.module
  const milestoneBadges = course.badges.milestone

  const allBadges = [...milestoneBadges, ...moduleBadges]
  const earnedCount = allBadges.filter((b) => (b.type === 'module' ? moduleProgress(course, b.moduleId, completed).complete : b.test(ctx))).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Capy size={72} proximity className="shrink-0" />
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">{course.ui.badges.title}</h1>
          <p className="text-muted">{earnedCount} of {allBadges.length} badges earned. {course.ui.badges.blurb}</p>
        </div>
      </div>

      {/* XP total — only for courses that award it. */}
      {course.features.xp && (
        <div className="card p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-semibold text-ink-800">
              <Zap className="h-4 w-4 text-gold-500" /> XP earned
            </span>
            <span className="font-bold text-gold-500">
              {xp.toLocaleString()} / {totalCourseXp(course).toLocaleString()} XP
            </span>
          </div>
          <ProgressBar value={totalCourseXp(course) ? (xp / totalCourseXp(course)) * 100 : 0} tone="gold" />
        </div>
      )}

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-ink-900">Milestones</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {milestoneBadges.map((b, i) => <BadgeCard key={b.id} badge={b} earned={b.test(ctx)} delay={i * 0.04} />)}
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-ink-900">Module badges</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {moduleBadges.map((b, i) => <BadgeCard key={b.id} badge={b} earned={moduleProgress(course, b.moduleId, completed).complete} delay={i * 0.04} />)}
        </div>
      </div>
    </div>
  )
}
