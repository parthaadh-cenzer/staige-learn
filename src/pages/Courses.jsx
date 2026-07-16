// ============================================================================
//  Courses — the full library. Same registry, same cards as the homepage rows;
//  this is just the "see everything at once" view the homepage links into.
// ============================================================================
import { useMemo, useState } from 'react'
import { Search, LayoutGrid } from 'lucide-react'
import { courses, activeCourses, comingSoonCourses } from '../data/courses'
import { Reveal } from '../components/ui'
import CourseCard from '../components/CourseCard'
import { tone as toneOf } from '../lib/tones'

const FILTERS = [
  { id: 'all', label: 'All courses', pick: () => courses },
  { id: 'active', label: 'Available now', pick: () => activeCourses },
  { id: 'career', label: 'Career growth', pick: () => courses.filter((c) => c.collections?.includes('career')) },
  { id: 'business', label: 'Business & income', pick: () => courses.filter((c) => c.collections?.includes('business')) },
  { id: 'soon', label: 'Coming soon', pick: () => comingSoonCourses },
]

export default function Courses() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')

  const shown = useMemo(() => {
    const base = (FILTERS.find((f) => f.id === filter) || FILTERS[0]).pick()
    const query = q.trim().toLowerCase()
    if (!query) return base
    return base.filter((c) => `${c.title} ${c.subtitle} ${c.description} ${c.skillLevel || ''}`.toLowerCase().includes(query))
  }, [q, filter])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-3xl bg-brand-50 text-brand-600">
          <LayoutGrid className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">Courses</h1>
          <p className="mt-1 text-muted">Every STAIGE operating system. {activeCourses.length} available now, {comingSoonCourses.length} on the way.</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-faint" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses…" aria-label="Search courses"
            className="input !pl-11 shadow-soft"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const count = f.pick().length
            if (!count) return null
            const active = filter === f.id
            const t = toneOf('brand')
            return (
              <button
                key={f.id} onClick={() => setFilter(f.id)} aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
                  active ? `${t.border} ${t.bgSoft} ${t.text}` : 'border-line bg-card text-muted hover:bg-sage-50'
                }`}
              >
                {f.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {shown.length === 0 && <p className="card p-8 text-center text-muted">No courses match “{q}”.</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c, i) => (
          <Reveal key={c.slug} delay={Math.min(i, 6) * 0.04}>
            <CourseCard course={c} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
