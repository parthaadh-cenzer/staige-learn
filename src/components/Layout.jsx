import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Library, Lightbulb, CalendarDays, Vault, Flame, Trophy, Menu, X, BookOpen,
  ListChecks, Download, Home, LayoutGrid, Settings,
} from 'lucide-react'
import MascotAdvisor from './MascotAdvisor'
import CourseSwitcher from './CourseSwitcher'
import StaigeMark from './StaigeMark'
import { ProgressBar } from './ui'
import { useStore } from '../store/useStore'
import { useCourse } from '../course/CourseContext'
import { courseProgress } from '../course/progress'

const ALL_FEATURES = { prompts: true, ideas: true, calendar: true, vault: true, challenge: true, badges: true }

// Fallback nav labels — a course overrides any of these via `ui.<key>.nav`.
const NAV_LABEL = {
  prompts: 'Prompt Library', ideas: 'Hustle Ideas', calendar: 'Content Calendar',
  vault: 'Resource Vault', checklists: 'Checklists', downloads: 'Download Center',
  challenge: '7-Day Challenge', badges: 'Achievements',
}

// Build the sidebar nav for the active course (course-relative links + the
// bonus areas that course enables). Labels are course-driven so each course
// names its own sections.
function navGroups(base, features, ui) {
  const f = features || ALL_FEATURES
  const label = (key) => ui?.[key]?.nav || NAV_LABEL[key]
  const item = (key, icon) => f[key] && { to: `${base}/${key}`, label: label(key), icon }
  return [
    { section: 'Learn', items: [
      { to: base, end: true, label: 'Dashboard', icon: LayoutDashboard },
      { to: `${base}/modules`, label: 'All Modules', icon: BookOpen },
    ]},
    { section: 'Bonuses', items: [
      item('prompts', Library),
      item('ideas', Lightbulb),
      item('calendar', CalendarDays),
      item('vault', Vault),
      item('checklists', ListChecks),
      item('downloads', Download),
    ].filter(Boolean) },
    { section: 'Momentum', items: [
      item('challenge', Flame),
      item('badges', Trophy),
    ].filter(Boolean) },
    // Platform-level destinations, so you're never stuck inside one course.
    { section: 'STAIGE', items: [
      { to: '/', end: true, label: 'Home', icon: Home },
      { to: '/courses', label: 'Courses', icon: LayoutGrid },
      { to: '/settings', label: 'Settings', icon: Settings },
    ]},
  ].filter((g) => g.items.length)
}

function NavItems({ groups, onNavigate }) {
  return (
    <nav className="space-y-6">
      {groups.map((group) => (
        <div key={group.section}>
          <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-faint">{group.section}</p>
          <div className="space-y-1">
            {group.items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? 'bg-card text-ink-900 shadow-soft ring-1 ring-brand-200' : 'text-ink-600 hover:bg-card/70 hover:text-ink-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <it.icon className={`h-4.5 w-4.5 ${isActive ? 'text-brand-600' : 'text-faint group-hover:text-ink-700'}`} />
                    {it.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

// Top-left of the course chrome is the platform, not the course — the course
// you're in is named directly underneath by the CourseSwitcher, so putting the
// title here too was saying it twice. The mark links home.

export default function Layout({ children, comingSoon = false }) {
  const [open, setOpen] = useState(false)
  const { course, base } = useCourse()
  const completed = useStore((s) => s.completed)
  const name = useStore((s) => s.name)
  const loc = useLocation()
  const progress = courseProgress(course, completed)
  const groups = navGroups(base, course.features, course.ui)

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar — light sage tint */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-sage-50/80 p-5 backdrop-blur-xl lg:flex">
        <StaigeMark />
        <div className="mt-5"><CourseSwitcher /></div>
        {!comingSoon && (
          <>
            <div className="my-6 rounded-2xl border border-line bg-card p-4 shadow-soft">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-muted">Your progress</span>
                <span className="font-bold text-brand-600">{progress}%</span>
              </div>
              <ProgressBar value={progress} tone="brand" />
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              <NavItems groups={groups} />
            </div>
            <div className="mt-4 rounded-2xl border border-line bg-card p-3 text-xs text-muted">
              {name ? <>Building with you, <span className="font-semibold text-ink-800">{name}</span> 👋</> : 'Your progress saves as you go.'}
            </div>
          </>
        )}
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-canvas/85 px-4 py-3 backdrop-blur-xl lg:hidden">
          <StaigeMark />
          <button onClick={() => setOpen(true)} className="btn-ghost !px-2.5 !py-2" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
        </header>

        <AnimatePresence>
          {open && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-ink-900/30 backdrop-blur-sm lg:hidden" />
              <motion.aside
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 24, stiffness: 240 }}
                className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-line bg-canvas p-5 lg:hidden"
              >
                <div className="mb-5 flex items-center justify-between">
                  <StaigeMark />
                  <button onClick={() => setOpen(false)} className="btn-ghost !px-2.5 !py-2" aria-label="Close"><X className="h-5 w-5" /></button>
                </div>
                <div className="mb-5"><CourseSwitcher onNavigate={() => setOpen(false)} /></div>
                {!comingSoon && (
                  <>
                    <div className="mb-6 rounded-2xl border border-line bg-card p-4 shadow-soft">
                      <div className="mb-2 flex items-center justify-between text-xs"><span className="text-muted">Progress</span><span className="font-bold text-brand-600">{progress}%</span></div>
                      <ProgressBar value={progress} tone="brand" />
                    </div>
                    <NavItems groups={groups} onNavigate={() => setOpen(false)} />
                  </>
                )}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <AnimatePresence mode="wait">
            <motion.div key={loc.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating advisor — minimized until clicked, never covers key UI */}
      <MascotAdvisor mode="mini" />
    </div>
  )
}
