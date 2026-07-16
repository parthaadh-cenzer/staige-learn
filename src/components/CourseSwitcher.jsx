// Collapsible "Launchpad" course switcher for the sidebar.
// Collapsed by default. Current course highlighted; coming-soon disabled.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Rocket, ChevronDown, Check } from 'lucide-react'
import { courses, courseBase } from '../data/courses'
import { useCourse } from '../course/CourseContext'

const STATUS_LABEL = { active: 'Active', 'coming-soon': 'Coming soon', locked: 'Locked' }

export default function CourseSwitcher({ onNavigate }) {
  const { course } = useCourse()
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-line bg-card p-1.5 shadow-soft">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition hover:bg-sage-50"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><Rocket className="h-4 w-4" /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-faint">Course</span>
          <span className="block truncate text-sm font-semibold text-ink-900">{course.title}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-faint transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-1 space-y-0.5 border-t border-line pt-1">
          {courses.map((c) => {
            const current = c.slug === course.slug
            const active = c.status === 'active'
            const row = (
              <div className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 ${current ? 'bg-brand-50' : active ? 'hover:bg-sage-50' : ''}`}>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-sm font-medium ${current ? 'text-brand-700' : active ? 'text-ink-800' : 'text-faint'}`}>{c.title}</span>
                  <span className={`block text-[10px] font-semibold uppercase tracking-wide ${active ? 'text-brand-500' : 'text-faint'}`}>{STATUS_LABEL[c.status]}</span>
                </span>
                {current && <Check className="h-4 w-4 shrink-0 text-brand-600" />}
              </div>
            )
            return active ? (
              <Link key={c.slug} to={courseBase(c.slug)} onClick={onNavigate}>{row}</Link>
            ) : (
              <div key={c.slug} className="cursor-not-allowed opacity-70" aria-disabled="true" title="Coming soon">{row}</div>
            )
          })}
          <Link to="/courses" onClick={onNavigate} className="block rounded-xl px-2.5 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-sage-50">
            View all courses →
          </Link>
        </div>
      )}
    </div>
  )
}
