import { useMemo, useState } from 'react'
import { Search, ExternalLink } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useCourse } from '../course/CourseContext'
import { tone as toneOf } from '../lib/tones'
import { Reveal } from '../components/ui'
import { Byte } from '../components/mascots'

const Icon = ({ name, ...p }) => { const C = Icons[name] || Icons.Sparkles; return <C {...p} /> }

const PRICING_TONE = { Free: 'brand', Freemium: 'sky2', Paid: 'flamingo' }
const PRICING_ORDER = ['Free', 'Freemium', 'Paid']

export default function Vault() {
  const { course } = useCourse()
  const resources = course.resources.items
  const resourceCategories = course.resources.categories
  const stacks = course.resources.stacks || []
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [price, setPrice] = useState('all')

  // Only courses that price their tools get the pricing filter.
  const hasPricing = resources.some((r) => r.pricing)

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return resources.filter((r) => {
      if (cat !== 'all' && r.category !== cat) return false
      if (price !== 'all' && r.pricing !== price) return false
      if (!query) return true
      return `${r.name} ${r.best} ${r.why} ${r.bestFor || ''}`.toLowerCase().includes(query)
    })
  }, [q, cat, price, resources])

  const catOf = (id) => resourceCategories.find((c) => c.id === id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Byte size={68} proximity className="shrink-0" />
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">{course.ui.vault.title}</h1>
          <p className="text-muted">{course.ui.vault.blurb}</p>
        </div>
      </div>

      {/* Recommended stacks — the shortcut for people who don't want to choose */}
      {stacks.length > 0 && (
        <div>
          <h2 className="mb-3 font-display text-xl font-bold text-ink-900">Recommended stacks</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {stacks.map((s, i) => {
              const t = toneOf(s.tone)
              return (
                <Reveal key={s.id} delay={i * 0.05}>
                  <div className={`card flex h-full flex-col border ${t.border} p-5`}>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-display text-lg font-bold text-ink-900">{s.name}</p>
                      <span className={`pill ${t.border} ${t.text}`}>{s.cost}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-ink-700">{s.purpose}</p>
                    <div className="my-4 flex flex-wrap gap-1.5">
                      {s.tools.map((tool) => (
                        <span key={tool} className="rounded-xl border border-line bg-sage-50 px-2.5 py-1 text-xs font-medium text-ink-800">{tool}</span>
                      ))}
                    </div>
                    <p className="mt-auto border-t border-line pt-3 text-xs text-muted">{s.note}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-faint" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search tools…" aria-label="Search tools"
            className="input !pl-11 shadow-soft"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={cat === 'all'} onClick={() => setCat('all')}>All</Chip>
          {resourceCategories.map((c) => {
            const count = resources.filter((r) => r.category === c.id).length
            if (!count) return null
            return <Chip key={c.id} active={cat === c.id} tone={c.tone} onClick={() => setCat(c.id)}><Icon name={c.icon} className="h-3.5 w-3.5" /> {c.name}</Chip>
          })}
        </div>
        {hasPricing && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-faint">Pricing:</span>
            <Chip active={price === 'all'} onClick={() => setPrice('all')}>Any</Chip>
            {PRICING_ORDER.map((p) => {
              const count = resources.filter((r) => r.pricing === p).length
              if (!count) return null
              return <Chip key={p} active={price === p} tone={PRICING_TONE[p]} onClick={() => setPrice(p)}>{p} ({count})</Chip>
            })}
          </div>
        )}
      </div>

      {filtered.length === 0 && <p className="card p-8 text-center text-muted">No tools match that. Try another keyword or clear the filters.</p>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r, i) => (
          <Reveal key={r.name} delay={Math.min(i, 9) * 0.02}>
            <ToolCard r={r} cat={catOf(r.category)} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function ToolCard({ r, cat }) {
  const t = toneOf(cat?.tone)
  const pt = toneOf(PRICING_TONE[r.pricing] || 'brand')

  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="font-display font-bold text-ink-900">{r.name}</p>
        {r.url && <ExternalLink className="h-4 w-4 shrink-0 text-faint transition group-hover:text-ink-700" />}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {cat && <span className={`pill w-fit ${t.border} ${t.text}`}>{cat.name}</span>}
        {r.pricing && <span className={`pill w-fit ${pt.border} ${pt.text}`}>{r.pricing}</span>}
      </div>
      <p className="mt-3 text-sm text-ink-700">{r.best}</p>
      {r.bestFor && <p className="mt-1.5 text-xs text-muted"><span className="font-semibold text-faint">Best for: </span>{r.bestFor}</p>}
      <p className="mt-auto pt-2 text-xs text-faint">{r.why}</p>
    </>
  )

  // No URL yet → still a complete card, just not a dead link.
  if (!r.url) return <div className="card flex h-full flex-col p-4">{body}</div>

  return (
    <a href={r.url} target="_blank" rel="noreferrer" className="card card-hover group flex h-full flex-col p-4">
      {body}
    </a>
  )
}

function Chip({ active, tone = 'sky2', onClick, children }) {
  const t = toneOf(tone)
  return <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? `${t.border} ${t.bgSoft} ${t.text}` : 'border-line bg-card text-muted hover:bg-sage-50'}`}>{children}</button>
}
