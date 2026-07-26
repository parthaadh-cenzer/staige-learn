// App Idea Generator — an inspiration board, not a spreadsheet.
// Search + three independent filters (category, difficulty, monetisation) that
// compose, so "Beginner + Freemium + Finance" is one click each.
import { useMemo, useState } from 'react'
import * as Icons from 'lucide-react'
import { appIdeas, ideaCategories } from '../../data/appbuilder/appIdeas'
import { useStore } from '../../store/useStore'
import { tone as toneOf } from '../../lib/tones'
import { Reveal } from '../../components/ui'
import VaultPage, { Chip, NoResults, DIFFICULTY_TONE } from './VaultPage'

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']
// Derived from the data rather than hardcoded, so an added idea with a new
// monetisation model gets its filter chip automatically.
const MONEY = [...new Set(appIdeas.map((i) => i.money))].sort()
const catOf = (id) => ideaCategories.find((c) => c.id === id)

export default function AppIdeas() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [diff, setDiff] = useState('all')
  const [money, setMoney] = useState('all')

  // Reuse the worksheet slice as a shortlist, the same way the Hustle Ideas
  // page does — it already syncs to the account, so no new storage is needed.
  const saved = useStore((s) => s.worksheets['ab-saved-ideas']?.list) || []
  const setField = useStore((s) => s.setWorksheetField)
  const toggleSave = (id) =>
    setField('ab-saved-ideas', 'list', saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return appIdeas.filter((i) => {
      if (cat === 'saved' && !saved.includes(i.id)) return false
      if (cat !== 'all' && cat !== 'saved' && i.category !== cat) return false
      if (diff !== 'all' && i.difficulty !== diff) return false
      if (money !== 'all' && i.money !== money) return false
      if (!query) return true
      return `${i.name} ${i.desc}`.toLowerCase().includes(query)
    })
  }, [q, cat, diff, money, saved])

  const clear = () => { setQ(''); setCat('all'); setDiff('all'); setMoney('all') }

  return (
    <VaultPage
      icon="Lightbulb" tone="gold"
      title="App Idea Generator"
      blurb="Need inspiration? Browse real app ideas organized by category. Every idea carries a difficulty level and a monetisation angle, so you can find one that matches both your skill and your ambition."
      stats={[`${appIdeas.length} ideas`, `${ideaCategories.length} categories`, 'Filter by difficulty & monetisation']}
    >
      <div className="space-y-3">
        <div className="relative">
          <Icons.Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-faint" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${appIdeas.length} app ideas…`} aria-label="Search app ideas"
            className="input !pl-11 shadow-soft"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip active={cat === 'all'} onClick={() => setCat('all')}>All ({appIdeas.length})</Chip>
          {saved.length > 0 && (
            <Chip active={cat === 'saved'} tone="gold" onClick={() => setCat('saved')}>
              <Icons.Star className="h-3.5 w-3.5 fill-current" /> Saved ({saved.length})
            </Chip>
          )}
          {ideaCategories.map((c) => {
            const n = appIdeas.filter((i) => i.category === c.id).length
            return <Chip key={c.id} active={cat === c.id} tone={c.tone} onClick={() => setCat(c.id)}>{c.name} ({n})</Chip>
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-faint">Difficulty:</span>
          <Chip active={diff === 'all'} onClick={() => setDiff('all')}>Any</Chip>
          {DIFFICULTIES.map((d) => (
            <Chip key={d} active={diff === d} tone={DIFFICULTY_TONE[d]} onClick={() => setDiff(d)}>
              {d} ({appIdeas.filter((i) => i.difficulty === d).length})
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-faint">Monetisation:</span>
          <Chip active={money === 'all'} onClick={() => setMoney('all')}>Any</Chip>
          {MONEY.map((m) => (
            <Chip key={m} active={money === m} tone="mint" onClick={() => setMoney(m)}>
              {m} ({appIdeas.filter((i) => i.money === m).length})
            </Chip>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'idea' : 'ideas'}
      </p>

      {filtered.length === 0 && (
        <NoResults what={cat === 'saved' ? 'saved ideas' : 'ideas'} onClear={clear} />
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((idea, i) => {
          const c = catOf(idea.category)
          const t = toneOf(c?.tone)
          const dt = toneOf(DIFFICULTY_TONE[idea.difficulty])
          const isSaved = saved.includes(idea.id)
          return (
            <Reveal key={idea.id} delay={Math.min(i, 11) * 0.02}>
              <div className={`card card-hover flex h-full flex-col border ${isSaved ? 'border-gold-100' : t.border} p-4`}>
                <div className="flex items-start justify-between gap-2">
                  <span className={`pill ${t.border} ${t.text}`}>{c?.name}</span>
                  <button
                    onClick={() => toggleSave(idea.id)}
                    aria-pressed={isSaved}
                    aria-label={isSaved ? `Remove ${idea.name} from your shortlist` : `Save ${idea.name} to your shortlist`}
                    className={`shrink-0 rounded-lg border p-1.5 transition ${isSaved ? 'border-gold-100 bg-gold-50 text-gold-500' : 'border-line text-faint hover:text-ink-700'}`}
                  >
                    <Icons.Star className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <h2 className="mt-2 font-display font-bold text-ink-900">{idea.name}</h2>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-700">{idea.desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
                  <span className={`pill ${dt.border} ${dt.text}`}>⭐ {idea.difficulty}</span>
                  <span className="pill border-mint-100 text-mint-500">💰 {idea.money}</span>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </VaultPage>
  )
}
