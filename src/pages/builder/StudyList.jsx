// 50 Websites Every AI App Builder Should Study.
//
// A directory of external links, deliberately text-only: no screenshots, no
// logos, no cached assets. Every link opens in a new tab with
// rel="noopener noreferrer", and the page says plainly that these are study
// references, not partners.
import { useMemo, useState } from 'react'
import * as Icons from 'lucide-react'
import { studySites, studyCategories } from '../../data/appbuilder/study'
import { tone as toneOf } from '../../lib/tones'
import { Reveal } from '../../components/ui'
import VaultPage, { Chip, NoResults } from './VaultPage'

const catOf = (id) => studyCategories.find((c) => c.id === id)
const Icon = ({ name, ...p }) => { const C = Icons[name] || Icons.Sparkles; return <C {...p} /> }

export default function StudyList() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return studySites.filter((s) => {
      if (cat !== 'all' && s.category !== cat) return false
      if (!query) return true
      return `${s.name} ${s.study}`.toLowerCase().includes(query)
    })
  }, [q, cat])

  return (
    <VaultPage
      icon="Eye" tone="gold"
      title="50 Websites Every AI App Builder Should Study"
      blurb="Explore these websites to understand modern UI/UX, layouts, animations, typography, color palettes, dashboards, pricing pages, and user experience. Don’t copy them—study what makes them effective and use those principles in your own projects."
      stats={[`${studySites.length} websites`, `${studyCategories.length} categories`, 'Opens in a new tab']}
    >
      <div className="card border-sun-100 bg-sun-50 p-4">
        <p className="flex items-start gap-2 text-sm leading-relaxed text-ink-700">
          <Icons.Info className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" />
          These are independent websites listed as study references. STAIGE is not affiliated with,
          endorsed by, or sponsored by any of them, and nothing here is a referral link.
        </p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Icons.Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-faint" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search websites or what to study…" aria-label="Search websites"
            className="input !pl-11 shadow-soft"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={cat === 'all'} onClick={() => setCat('all')}>All ({studySites.length})</Chip>
          {studyCategories.map((c) => {
            const n = studySites.filter((s) => s.category === c.id).length
            if (!n) return null
            return (
              <Chip key={c.id} active={cat === c.id} tone={c.tone} onClick={() => setCat(c.id)}>
                <Icon name={c.icon} className="h-3.5 w-3.5" /> {c.name} ({n})
              </Chip>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 && <NoResults what="websites" onClear={() => { setQ(''); setCat('all') }} />}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s, i) => {
          const c = catOf(s.category)
          const t = toneOf(c?.tone)
          return (
            <Reveal key={s.id} delay={Math.min(i, 11) * 0.02}>
              <a
                href={s.url} target="_blank" rel="noopener noreferrer"
                className="card card-hover group flex h-full flex-col p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display font-bold text-ink-900">{s.name}</h2>
                  <Icons.ExternalLink className="h-4 w-4 shrink-0 text-faint transition group-hover:text-ink-700" aria-hidden="true" />
                </div>
                <span className={`pill mt-2 w-fit ${t.border} ${t.text}`}>{c?.name}</span>
                <p className="mt-3 flex-1 text-sm text-ink-700">
                  <span className="font-semibold text-faint">Study: </span>{s.study}
                </p>
                <span className="mt-3 truncate text-xs text-faint">
                  {s.url.replace(/^https?:\/\//, '')}
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
              </a>
            </Reveal>
          )
        })}
      </div>
    </VaultPage>
  )
}
