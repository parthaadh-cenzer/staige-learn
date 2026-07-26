// The Launch Checklist and the UI/UX Checklist, as Builder Vault pages.
//
// Both reuse the platform's existing ChecklistCard (src/pages/Checklists.jsx) —
// same collapsible sections, same per-section progress, same PDF export, same
// persistence. Ticks live in the shared store's `checklists` slice keyed by
// section id (`ab-cl-launch-…` / `ab-cl-uiux-…`), which is namespaced by
// course, checklist type and section, so it can never collide with another
// course's checklist, and it syncs to the learner's account rather than being
// stranded in one browser's localStorage.
//
// Ticking boxes here has no effect on official course completion — that is
// decided by completed lessons, and nothing on this page writes to them.
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { useStore } from '../../store/useStore'
import { useCourse } from '../../course/CourseContext'
import { launchCloser } from '../../data/appbuilder/checklists'
import { ProgressBar, Reveal, Confetti } from '../../components/ui'
import { ChecklistCard } from '../Checklists'
import VaultPage from './VaultPage'

const CONFIG = {
  launch: {
    icon: 'Rocket', tone: 'brand',
    title: 'Launch Checklist',
    blurb: 'Before you publish your website or web app, make sure you’ve completed every item below.',
    closer: launchCloser,
  },
  uiux: {
    icon: 'ListChecks', tone: 'flamingo',
    title: 'UI/UX Checklist',
    blurb: 'Use this checklist before calling your design complete. Great design isn’t about adding more—it’s about refining what already exists.',
    closer: 'Every box ticked. Your design has passed a full professional audit. 🎨',
  },
}

export default function VaultChecklist({ group }) {
  const { course } = useCourse()
  const cfg = CONFIG[group]
  const checklists = useStore((s) => s.checklists)
  const lists = useMemo(
    () => (course.checklists?.items || []).filter((l) => l.group === group),
    [course, group]
  )
  const [open, setOpen] = useState(() => lists[0]?.id ?? null)

  const totalItems = lists.reduce((n, l) => n + l.items.length, 0)
  const totalDone = lists.reduce((n, l) => n + (checklists[l.id] || []).filter(Boolean).length, 0)
  const pct = totalItems ? Math.round((totalDone / totalItems) * 100) : 0
  const allDone = totalItems > 0 && totalDone === totalItems

  return (
    <VaultPage
      icon={cfg.icon} tone={cfg.tone}
      title={cfg.title}
      blurb={cfg.blurb}
      stats={[`${lists.length} sections`, `${totalItems} checks`, 'Saved to your account']}
    >
      {/* Confetti fires once on the false→true edge of "everything ticked",
          and is a no-op for anyone who's asked for reduced motion. */}
      <Confetti fire={allDone} />

      <div className="card sticky top-2 z-30 p-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="flex items-center gap-2 font-semibold text-ink-800">
            <Icons.ListChecks className="h-4 w-4 text-brand-600" /> {lists.length} sections
          </span>
          <span className="font-bold text-brand-600">{totalDone}/{totalItems} · {pct}%</span>
        </div>
        <ProgressBar value={pct} tone={cfg.tone} />
      </div>

      {allDone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          role="status"
          className="card border-gold-100 bg-gradient-to-br from-gold-50 to-sun-50 p-6 text-center"
        >
          <div className="text-4xl" aria-hidden="true">🎉</div>
          <p className="mt-2 font-display text-xl font-extrabold text-ink-900">{cfg.closer}</p>
          <p className="mt-1 text-sm text-muted">
            This checklist is a tool, not a grade — your course progress is decided by the lessons you complete.
          </p>
        </motion.div>
      )}

      <div className="space-y-3">
        {lists.map((l, i) => (
          <Reveal key={l.id} delay={Math.min(i, 8) * 0.03}>
            <ChecklistCard
              list={l}
              courseTitle={course.title}
              open={open === l.id}
              onToggleOpen={() => setOpen((o) => (o === l.id ? null : l.id))}
            />
          </Reveal>
        ))}
      </div>
    </VaultPage>
  )
}
