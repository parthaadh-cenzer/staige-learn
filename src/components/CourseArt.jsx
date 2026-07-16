// ============================================================================
//  CourseArt — every course's cover, derived from its registry metadata.
//
//  There are no course image assets, and inventing a bespoke illustration per
//  course would mean a new asset (and a new colour) every time someone adds a
//  course. Instead the cover is *generated* from `art: { emoji, tone }`:
//  a soft tint from the existing tone palette, a faint ring motif, and the
//  course emoji. Add a course to the registry and it has artwork immediately —
//  nothing to design, nothing to ship, nothing that can 404.
//
//  Gradients here are BACKGROUNDS, which the design system allows. No heading
//  text ever uses one.
// ============================================================================
import { tone as toneOf } from '../lib/tones'
import { Byte, Capy } from './mascots'

const SIZE = {
  hero: { pad: 'p-8', emoji: 'text-[6rem] sm:text-[8rem]', ring: 'h-[26rem] w-[26rem]', radius: 'rounded-3xl' },
  card: { pad: 'p-5', emoji: 'text-5xl', ring: 'h-56 w-56', radius: 'rounded-3xl' },
  row: { pad: 'p-4', emoji: 'text-4xl', ring: 'h-40 w-40', radius: 'rounded-2xl' },
  tile: { pad: 'p-3', emoji: 'text-3xl', ring: 'h-28 w-28', radius: 'rounded-2xl' },
}

export default function CourseArt({
  course,
  size = 'card',
  className = '',
  mascot = false,
  children,
}) {
  const s = SIZE[size] || SIZE.card
  const t = toneOf(course?.art?.tone || course?.themeAccent || 'brand')
  const emoji = course?.art?.emoji || '🚀'
  const dim = course && !course.isActive

  return (
    <div
      className={`relative isolate overflow-hidden ${s.radius} border ${t.border} ${t.bgSoft} ${s.pad} ${dim ? 'grayscale-[35%]' : ''} ${className}`}
      // Decorative: the course title is always rendered as real text next to it.
      role="presentation"
    >
      {/* Soft tint + ring motif — the whole "artwork", from two divs. */}
      <div className={`pointer-events-none absolute -right-12 -top-16 ${s.ring} rounded-full bg-gradient-to-br ${t.grad} opacity-[0.18] blur-2xl`} />
      <div className={`pointer-events-none absolute -bottom-20 -left-10 ${s.ring} rounded-full border-[3px] ${t.border} opacity-40`} />
      <div className={`pointer-events-none absolute -bottom-10 -left-2 ${s.ring} rounded-full border-2 ${t.border} opacity-25`} />

      <div className="relative flex h-full items-center justify-between gap-4">
        <span className={`${s.emoji} leading-none drop-shadow-sm`} aria-hidden="true">{emoji}</span>
        {mascot && (
          <span className="hidden shrink-0 sm:block">
            {course?.mascotMode === 'capy-byte' ? <Byte size={size === 'hero' ? 92 : 56} /> : <Capy size={56} />}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
