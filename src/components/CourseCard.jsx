// ============================================================================
//  CourseCard — the single course card used everywhere on the homepage and the
//  Courses page (grids and horizontal rows both render this).
//
//  Everything on it comes from the shared registry: artwork, name, skill level,
//  status, progress, module count and CTA. Nothing is passed in per-surface, so
//  a course added to the registry looks right in every row automatically.
//
//  A coming-soon course renders as a non-interactive <div>: it is never a link,
//  never focusable, and cannot be opened. That's enforced here rather than at
//  each call site so no future surface can leak an unfinished course.
// ============================================================================
import { Link } from 'react-router-dom'
import { ArrowRight, Lock, BookOpen, Signal, CheckCircle2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useAuth } from '../auth/AuthProvider'
import { priceView } from '../../shared/catalog.mjs'
import { courseCta } from '../course/progress'
import { courseBase } from '../data/courses'
import { ProgressBar } from './ui'
import CourseArt from './CourseArt'
import { tone as toneOf } from '../lib/tones'

// Price on the card, from the same catalogue every other price comes from.
// Coming Soon courses have no product and so render nothing here — they must
// never show a price. Owners see that they own it instead of an offer.
function CardPrice({ course }) {
  const { configured, loading, ownsCourse } = useAuth()
  if (!course.requiresPurchase || !configured || loading) return null

  if (ownsCourse(course.slug)) {
    return <span className="pill border-brand-200 text-brand-600">✓ Owned</span>
  }

  const v = priceView(course.product)
  return (
    <span className="flex items-center gap-1.5">
      <span className="font-bold text-ink-900">{v.display}</span>
      {v.strikethrough && <span className="text-faint line-through">{v.strikethrough}</span>}
    </span>
  )
}

export default function CourseCard({ course, size = 'card', className = '' }) {
  const completed = useStore((s) => s.completed)
  const lastLessonId = useStore((s) => s.lastLessonId)
  const t = toneOf(course.art?.tone || course.themeAccent || 'brand')
  const cta = course.isActive ? courseCta(course, completed, lastLessonId) : null

  const body = (
    <>
      <CourseArt course={course} size={size === 'row' ? 'row' : 'card'} className="mb-4 h-32 sm:h-36" />

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-bold leading-snug text-ink-900">{course.title}</h3>
        {course.isActive
          ? <ArrowRight className={`mt-0.5 h-4 w-4 shrink-0 ${t.text} transition group-hover:translate-x-0.5`} />
          : <Lock className="mt-0.5 h-4 w-4 shrink-0 text-faint" />}
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{course.subtitle}</p>

      {/* Metadata — skill level · modules · status */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
        {course.skillLevel && (
          <span className="flex items-center gap-1 text-muted">
            <Signal className="h-3.5 w-3.5 text-faint" /> {course.skillLevel}
          </span>
        )}
        {course.moduleCount > 0 && (
          <span className="flex items-center gap-1 text-muted">
            <BookOpen className="h-3.5 w-3.5 text-faint" /> {course.moduleCount} modules
          </span>
        )}
        {!course.isActive && <span className="pill border-line text-faint">Coming soon</span>}
        <CardPrice course={course} />
      </div>

      {/* Progress + CTA — active courses only */}
      {cta && (
        <div className="mt-auto pt-4">
          {cta.started ? (
            <>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-faint">{cta.done ? 'Complete' : `${cta.pct}% complete`}</span>
                {cta.done
                  ? <CheckCircle2 className={`h-3.5 w-3.5 ${t.text}`} />
                  : <span className={`font-bold ${t.text}`}>{cta.pct}%</span>}
              </div>
              <ProgressBar value={cta.pct} tone={course.art?.tone || 'brand'} />
            </>
          ) : (
            <p className="text-xs font-semibold text-faint">{course.totalLessons} lessons · not started</p>
          )}
          <span className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold ${t.text}`}>
            {cta.label} <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      )}
    </>
  )

  const shell = `card group flex h-full flex-col p-5 ${className}`

  // Coming soon → inert. Not a link, not focusable, cannot open.
  if (!course.isActive) {
    return (
      <div className={`${shell} border-line opacity-80`} aria-label={`${course.title} — coming soon`}>
        {body}
      </div>
    )
  }

  return (
    <Link
      to={courseBase(course.slug)}
      className={`${shell} card-hover border ${t.border} focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40`}
    >
      {body}
    </Link>
  )
}
