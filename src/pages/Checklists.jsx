// Marketing Checklists — interactive, persisted, per-course.
// State lives in the shared store's `checklists` slice, keyed by each
// checklist's id (all prefixed `mkt-cl-` for this course), so ticking things
// here can never touch another course's progress.
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, RotateCcw, Download, ListChecks, Loader2 } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useStore } from '../store/useStore'
import { useCourse } from '../course/CourseContext'
import { checklistDoc } from '../lib/resourceDoc'
import { downloadDoc } from '../lib/exporters'
import { ProgressBar, Reveal } from '../components/ui'
import { Capy } from '../components/mascots'
import { tone as toneOf } from '../lib/tones'

const Icon = ({ name, ...p }) => { const C = Icons[name] || Icons.ListChecks; return <C {...p} /> }

export default function Checklists() {
  const { course } = useCourse()
  const lists = course.checklists?.items || []
  const groups = course.checklists?.groups || []
  const checklists = useStore((s) => s.checklists)
  const [group, setGroup] = useState('all')
  const [open, setOpen] = useState(() => lists[0]?.id ?? null)

  const doneCount = (l) => (checklists[l.id] || []).filter(Boolean).length
  const totalItems = lists.reduce((n, l) => n + l.items.length, 0)
  const totalDone = lists.reduce((n, l) => n + doneCount(l), 0)
  const overall = totalItems ? Math.round((totalDone / totalItems) * 100) : 0

  const visible = group === 'all' ? lists : lists.filter((l) => l.group === group)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Capy size={72} proximity className="shrink-0" />
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">{course.ui.checklists.title}</h1>
          <p className="text-muted">{course.ui.checklists.blurb}</p>
        </div>
      </div>

      {/* Overall progress */}
      <div className="card p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 font-semibold text-ink-800">
            <ListChecks className="h-4 w-4 text-brand-600" /> {lists.length} checklists
          </span>
          <span className="font-bold text-brand-600">{totalDone}/{totalItems} · {overall}%</span>
        </div>
        <ProgressBar value={overall} tone="brand" />
      </div>

      {/* Group filter */}
      {groups.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Chip active={group === 'all'} onClick={() => setGroup('all')}>All ({lists.length})</Chip>
          {groups.map((g) => {
            const count = lists.filter((l) => l.group === g.id).length
            if (!count) return null
            return <Chip key={g.id} active={group === g.id} tone={g.tone} onClick={() => setGroup(g.id)}>{g.name} ({count})</Chip>
          })}
        </div>
      )}

      <div className="space-y-3">
        {visible.map((l, i) => (
          <Reveal key={l.id} delay={Math.min(i, 6) * 0.03}>
            <ChecklistCard
              list={l} courseTitle={course.title}
              open={open === l.id} onToggleOpen={() => setOpen((o) => (o === l.id ? null : l.id))}
            />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function ChecklistCard({ list, open, onToggleOpen, courseTitle }) {
  const [busy, setBusy] = useState(false)
  const state = useStore((s) => s.checklists[list.id])
  const toggle = useStore((s) => s.toggleChecklistItem)
  const reset = useStore((s) => s.resetChecklist)
  const checked = state || Array(list.items.length).fill(false)
  const done = checked.filter(Boolean).length
  const pct = Math.round((done / list.items.length) * 100)
  const complete = done === list.items.length
  const t = toneOf(list.tone)

  // A checklist is something you print and tick → PDF, with your current ticks
  // already in it.
  const download = async () => {
    setBusy(true)
    try {
      await downloadDoc(checklistDoc(list, checked, courseTitle))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`card overflow-hidden ${complete ? `border ${t.border}` : ''}`}>
      <button
        onClick={onToggleOpen}
        aria-expanded={open}
        aria-controls={`${list.id}-panel`}
        className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-sage-50"
      >
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${t.bgSoft} ${t.text}`}>
          <Icon name={list.icon} className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-display font-bold text-ink-900">{list.name}</span>
            {complete && <span className={`pill ${t.border} ${t.text}`}><Check className="h-3 w-3" /> Complete</span>}
          </span>
          <span className="mt-0.5 block text-sm text-muted">{list.subtitle}</span>
          <span className="mt-2 block max-w-xs">
            <ProgressBar value={pct} tone={list.tone} />
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <span className={`pill ${t.border} ${t.text}`}>{done}/{list.items.length}</span>
          <ChevronDown className={`h-4 w-4 text-faint transition ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${list.id}-panel`}
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden"
          >
            <div className="border-t border-line p-5">
              <ul className="space-y-2">
                {list.items.map((it, i) => (
                  <li key={i}>
                    <label className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-line bg-sage-50 px-3.5 py-2.5 transition hover:bg-mint-50">
                      <input
                        type="checkbox"
                        checked={Boolean(checked[i])}
                        onChange={() => toggle(list.id, i, list.items.length)}
                        className="h-5 w-5 shrink-0 cursor-pointer rounded-md border-line-strong text-brand-500 accent-brand-500 focus:ring-2 focus:ring-brand-500/40"
                      />
                      <span className={`text-sm ${checked[i] ? 'text-faint line-through' : 'text-ink-800'}`}>{it}</span>
                    </label>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button onClick={download} disabled={busy} className="btn-ghost !py-2 !text-xs">
                  {busy
                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Preparing…</>
                    : <><Download className="h-3.5 w-3.5" /> Download PDF</>}
                </button>
                <button onClick={() => reset(list.id)} disabled={done === 0} className="btn-ghost !py-2 !text-xs"><RotateCcw className="h-3.5 w-3.5" /> Reset</button>
                <span className="ml-auto text-xs text-faint">Saved to this device</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Chip({ active, tone = 'brand', onClick, children }) {
  const t = toneOf(tone)
  return <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? `${t.border} ${t.bgSoft} ${t.text}` : 'border-line bg-card text-muted hover:bg-sage-50'}`}>{children}</button>
}
