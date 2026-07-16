// ============================================================================
//  CourseRow — a horizontally-browsable row of courses.
//
//  The browsing *experience* is borrowed from streaming platforms; none of the
//  look is. It's the platform's own white surfaces, sage lines, green accent
//  and rounded cards — just arranged as a scrollable rail.
//
//  Accessibility notes (these are the bits that usually get skipped):
//   • It's a real overflow container, so it scrolls natively — swipe on touch,
//     shift+wheel on desktop, and arrow keys once focused.
//   • It's a labelled region, so a screen reader announces "Available Now,
//     region" rather than dumping every card into one list.
//   • Cards are ordinary links: Tab moves through them and the browser scrolls
//     each into view on focus. The arrow buttons are a convenience on top, and
//     are aria-hidden because they duplicate scrolling that already works.
//   • The arrows disable at each end instead of scrolling into nothing.
//   • prefers-reduced-motion turns the smooth scroll into an instant jump.
// ============================================================================
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CourseCard from './CourseCard'

export default function CourseRow({ title, blurb, courses, icon: Icon, id }) {
  const scroller = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [scrollable, setScrollable] = useState(false)

  const sync = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setScrollable(max > 4)
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft >= max - 4)
  }, [])

  useEffect(() => {
    sync()
    const el = scroller.current
    if (!el) return
    // ResizeObserver keeps the arrows honest when the viewport changes.
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    window.addEventListener('resize', sync)
    return () => { ro.disconnect(); window.removeEventListener('resize', sync) }
  }, [sync, courses])

  const nudge = (dir) => {
    const el = scroller.current
    if (!el) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 240), behavior: reduce ? 'auto' : 'smooth' })
  }

  if (!courses?.length) return null
  const headingId = `row-${id}`

  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id={headingId} className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
            {Icon && <Icon className="h-5 w-5 text-brand-600" />} {title}
          </h2>
          {blurb && <p className="mt-0.5 text-sm text-muted">{blurb}</p>}
        </div>

        {/* Convenience only — the rail already scrolls by swipe, wheel and keyboard. */}
        {scrollable && (
          <div className="hidden shrink-0 gap-1.5 sm:flex" aria-hidden="true">
            <button
              onClick={() => nudge(-1)} disabled={atStart} tabIndex={-1}
              className="btn-ghost !px-2 !py-2 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => nudge(1)} disabled={atEnd} tabIndex={-1}
              className="btn-ghost !px-2 !py-2 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* The rail. Negative margin lets cards bleed to the screen edge on mobile
          while staying aligned with the page grid on desktop. */}
      <div
        ref={scroller}
        onScroll={sync}
        role="region"
        aria-label={title}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      >
        {courses.map((c) => (
          <div key={c.slug} className="w-[17rem] shrink-0 snap-start sm:w-[19rem]">
            <CourseCard course={c} size="row" />
          </div>
        ))}
      </div>
    </section>
  )
}
