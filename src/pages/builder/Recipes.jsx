// ============================================================================
//  BUILDER RECIPES · 95 complete build prompts.
//
//  Two performance decisions worth knowing about:
//   • Cards render in pages of 24 with a "Show more" button. Mounting all 95
//     prompt bodies at once is a lot of DOM for a list most people filter first.
//   • A recipe's full prompt only mounts when its card is expanded. Collapsed
//     cards carry the metadata and nothing else.
//  Filtering itself is a plain memo over 95 objects — fast enough that adding
//  an index would be complexity for no gain.
// ============================================================================
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'
import { recipes, recipeGroups } from '../../data/appbuilder/recipes'
import { tone as toneOf } from '../../lib/tones'
import { Reveal } from '../../components/ui'
import VaultPage, { Chip, NoResults, DIFFICULTY_TONE } from './VaultPage'

const PAGE = 24
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']
const groupOf = (id) => recipeGroups.find((g) => g.id === id)

export default function Recipes() {
  const [q, setQ] = useState('')
  const [group, setGroup] = useState('all')
  const [diff, setDiff] = useState('all')
  const [open, setOpen] = useState(null)
  const [shown, setShown] = useState(PAGE)

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return recipes.filter((r) => {
      if (group !== 'all' && r.group !== group) return false
      if (diff !== 'all' && r.difficulty !== diff) return false
      if (!query) return true
      return `${r.title} ${r.learn.join(' ')} ${r.prompt}`.toLowerCase().includes(query)
    })
  }, [q, group, diff])

  // Any filter change starts the list over, so "Show more" can't leave you
  // scrolled past the end of a smaller result set.
  const change = (fn) => (v) => { fn(v); setShown(PAGE); setOpen(null) }
  const clear = () => { setQ(''); setGroup('all'); setDiff('all'); setShown(PAGE) }

  const visible = filtered.slice(0, shown)
  const isUiChallenge = group === 'ui-recreation'

  return (
    <VaultPage
      icon="ChefHat" tone="brand"
      title="Builder Recipes"
      blurb="Complete build prompts for real projects. Pick one, copy the whole prompt, paste it into your AI builder, then make it yours. Every prompt is reproduced in full — nothing here is truncated."
      stats={[`${recipes.length} recipes`, `${recipeGroups.length} collections`, 'Beginner → Advanced']}
    >
      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Icons.Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-faint" />
          <input
            value={q} onChange={(e) => change(setQ)(e.target.value)}
            placeholder={`Search ${recipes.length} recipes…`} aria-label="Search recipes"
            className="input !pl-11 shadow-soft"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={group === 'all'} onClick={() => change(setGroup)('all')}>All ({recipes.length})</Chip>
          {recipeGroups.map((g) => {
            const n = recipes.filter((r) => r.group === g.id).length
            return (
              <Chip key={g.id} active={group === g.id} tone={g.tone} onClick={() => change(setGroup)(g.id)}>
                <Icons.Circle className="h-2 w-2 fill-current" /> {g.name} ({n})
              </Chip>
            )
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-faint">Difficulty:</span>
          <Chip active={diff === 'all'} onClick={() => change(setDiff)('all')}>Any</Chip>
          {DIFFICULTIES.map((d) => {
            const n = recipes.filter((r) => r.difficulty === d).length
            return <Chip key={d} active={diff === d} tone={DIFFICULTY_TONE[d]} onClick={() => change(setDiff)(d)}>{d} ({n})</Chip>
          })}
        </div>
      </div>

      {/* The UI Recreation collection needs saying out loud, once, where it's
          being browsed — not buried in a recipe body. */}
      {isUiChallenge && (
        <div className="card border-sun-100 bg-sun-50 p-5">
          <p className="flex items-center gap-2 font-display font-bold text-ink-900">
            <Icons.Info className="h-4.5 w-4.5 text-sun-500" /> How to use these challenges
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
            These are learning exercises inspired by well-known products’ <em>design principles</em> — layout,
            spacing, hierarchy, motion. Build your own original version: your own brand name, your own logo,
            your own copy, your own colours. Don’t copy logos, proprietary text or assets from the source
            sites, and don’t present the result as connected to those companies. Nothing here is affiliated
            with, endorsed by, or sponsored by any brand named in a prompt.
          </p>
        </div>
      )}

      <p className="text-sm text-muted" aria-live="polite">
        Showing {visible.length} of {filtered.length} {filtered.length === 1 ? 'recipe' : 'recipes'}
      </p>

      {filtered.length === 0 && <NoResults what="recipes" onClear={clear} />}

      <div className="grid gap-3 lg:grid-cols-2">
        {visible.map((r, i) => (
          <Reveal key={r.id} delay={Math.min(i, 8) * 0.02}>
            <RecipeCard r={r} open={open === r.id} onToggle={() => setOpen((o) => (o === r.id ? null : r.id))} />
          </Reveal>
        ))}
      </div>

      {shown < filtered.length && (
        <button onClick={() => setShown((s) => s + PAGE)} className="btn-ghost w-full justify-center">
          <Icons.ChevronDown className="h-4 w-4" /> Show {Math.min(PAGE, filtered.length - shown)} more
        </button>
      )}
    </VaultPage>
  )
}

function RecipeCard({ r, open, onToggle }) {
  const [copied, setCopied] = useState(false)
  const g = groupOf(r.group)
  const t = toneOf(g?.tone)
  const dt = toneOf(DIFFICULTY_TONE[r.difficulty])

  const copy = () => {
    navigator.clipboard?.writeText(r.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className={`card flex h-full flex-col overflow-hidden border ${open ? t.border : 'border-line'}`}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${r.id}-panel`}
        className="flex w-full items-start gap-3.5 p-5 text-left transition hover:bg-sage-50"
      >
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${t.bgSoft} font-display text-sm font-extrabold ${t.text}`}>
          {r.num}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display font-bold text-ink-900">{r.title}</span>
          <span className="mt-1.5 flex flex-wrap gap-1.5">
            <span className={`pill ${t.border} ${t.text}`}>{g?.name}</span>
            <span className={`pill ${dt.border} ${dt.text}`}>{r.difficulty}</span>
          </span>
          {r.learn.length > 0 && (
            <span className="mt-2 flex flex-wrap gap-1.5">
              {r.learn.map((l) => (
                <span key={l} className="rounded-lg bg-sage-100 px-2 py-0.5 text-xs text-ink-700">{l}</span>
              ))}
            </span>
          )}
        </span>
        <Icons.ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-faint transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${r.id}-panel`}
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden"
          >
            <div className="border-t border-line p-5">
              {r.learn.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-faint">What you’ll learn</p>
                  <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                    {r.learn.map((l) => (
                      <li key={l} className="flex items-start gap-2 text-sm text-ink-800">
                        <Icons.Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${t.text}`} /> {l}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-xs font-bold uppercase tracking-wider text-faint">The prompt</p>
              <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl border border-line bg-sage-50 p-4 font-sans text-sm leading-relaxed text-ink-800">
                {r.prompt}
              </pre>
              <button onClick={copy} className="btn-primary mt-4 w-full justify-center">
                {copied ? <><Icons.Check className="h-4 w-4" /> Copied</> : <><Icons.Copy className="h-4 w-4" /> Copy prompt</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
