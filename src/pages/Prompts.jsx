import { useMemo, useState } from 'react'
import { Search, Copy, Check, Clock, Wrench, Star } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useStore } from '../store/useStore'
import { useCourse } from '../course/CourseContext'
import { tone as toneOf } from '../lib/tones'
import { Reveal } from '../components/ui'
import { Byte } from '../components/mascots'

const Icon = ({ name, ...p }) => { const C = Icons[name] || Icons.Sparkles; return <C {...p} /> }

const DIFFICULTY_TONE = { Beginner: 'brand', Intermediate: 'sun', Advanced: 'flamingo' }

export default function Prompts() {
  const { course } = useCourse()
  const prompts = course.prompts.items
  const promptCategories = course.prompts.categories
  const favorites = useStore((s) => s.favoritePrompts)
  const toggleFavorite = useStore((s) => s.togglePromptFavorite)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [copied, setCopied] = useState(null)

  // Prompt ids restart at 1 in every course, so favourites are keyed by slug.
  const favKey = (p) => `${course.slug}:${p.id}`
  const isFav = (p) => favorites.includes(favKey(p))
  const favCount = prompts.filter(isFav).length

  // Courses can supply either a bare prompt ({ id, category, text }) or a full
  // prompt card ({ title, bestFor, tools, timeSaved, difficulty, … }). The
  // richer layout switches on automatically when the data is there.
  const rich = prompts.some((p) => p.title)

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return prompts.filter((p) => {
      if (cat === 'favorites' && !favorites.includes(`${course.slug}:${p.id}`)) return false
      if (cat !== 'all' && cat !== 'favorites' && p.category !== cat) return false
      if (!query) return true
      return `${p.title || ''} ${p.bestFor || ''} ${p.text}`.toLowerCase().includes(query)
    })
  }, [q, cat, prompts, favorites, course.slug])

  const copy = (p) => {
    navigator.clipboard?.writeText(p.text)
    setCopied(p.id)
    setTimeout(() => setCopied((c) => (c === p.id ? null : c)), 1400)
  }

  const catOf = (id) => promptCategories.find((c) => c.id === id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Byte size={68} proximity className="shrink-0" />
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">{course.ui.prompts.title}</h1>
          <p className="text-muted">{course.ui.prompts.blurb}</p>
        </div>
      </div>

      {/* Search */}
      <div className="sticky top-2 z-30 space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-faint" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${prompts.length} prompts…`}
            aria-label="Search prompts"
            className="input !pl-11 shadow-soft"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={cat === 'all'} onClick={() => setCat('all')}>All ({prompts.length})</Chip>
          {favCount > 0 && (
            <Chip active={cat === 'favorites'} tone="gold" onClick={() => setCat('favorites')}>
              <Star className="h-3.5 w-3.5 fill-current" /> Favorites ({favCount})
            </Chip>
          )}
          {promptCategories.map((c) => {
            const count = prompts.filter((p) => p.category === c.id).length
            if (!count) return null
            return <Chip key={c.id} active={cat === c.id} tone={c.tone} onClick={() => setCat(c.id)}><Icon name={c.icon} className="h-3.5 w-3.5" /> {c.name} ({count})</Chip>
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="card p-8 text-center text-muted">
          {cat === 'favorites' ? 'No favorites yet. Star a prompt to keep it here.' : `No prompts match “${q}”. Try another keyword.`}
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((p, i) => {
          const c = catOf(p.category)
          const t = toneOf(c?.tone)
          return (
            <Reveal key={p.id} delay={Math.min(i, 8) * 0.02}>
              {rich
                ? (
                  <PromptCard
                    p={p} cat={c} t={t}
                    copied={copied === p.id} onCopy={() => copy(p)}
                    fav={isFav(p)} onFav={() => toggleFavorite(favKey(p))}
                  />
                )
                : (
                  <div className="card card-hover group flex h-full items-start gap-3 p-4">
                    <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${t.bgSoft} text-xs font-bold ${t.text}`}>{p.id}</span>
                    <p className="flex-1 text-sm leading-relaxed text-ink-800">{p.text}</p>
                    <FavButton fav={isFav(p)} onClick={() => toggleFavorite(favKey(p))} id={p.id} subtle />
                    <button onClick={() => copy(p)} className="shrink-0 rounded-lg border border-line bg-sage-50 p-2 text-muted transition hover:text-ink-900 sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Copy prompt ${p.id}`}>
                      {copied === p.id ? <Check className="h-4 w-4 text-brand-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                )}
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

// Star toggle. `subtle` is the compact variant used by the bare prompt list.
function FavButton({ fav, onClick, id, subtle = false }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={fav}
      aria-label={fav ? `Remove prompt ${id} from favorites` : `Add prompt ${id} to favorites`}
      className={`shrink-0 rounded-lg border p-2 transition ${
        fav
          ? 'border-gold-100 bg-gold-50 text-gold-500'
          : `border-line bg-sage-50 text-muted hover:text-ink-900 ${subtle ? 'sm:opacity-0 sm:group-hover:opacity-100' : ''}`
      }`}
    >
      <Star className={`h-4 w-4 ${fav ? 'fill-current' : ''}`} />
    </button>
  )
}

function PromptCard({ p, cat, t, copied, onCopy, fav, onFav }) {
  const dt = toneOf(DIFFICULTY_TONE[p.difficulty] || 'brand')
  return (
    <div className={`card card-hover flex h-full flex-col border ${fav ? 'border-gold-100' : t.border} p-5`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`pill ${t.border} ${t.text}`}>Prompt #{p.num}</span>
        {cat && <span className="pill border-line text-muted"><Icon name={cat.icon} className="h-3.5 w-3.5" /> {cat.name}</span>}
        <span className={`pill ${dt.border} ${dt.text}`}>{p.difficulty}</span>
        <span className="ml-auto"><FavButton fav={fav} onClick={onFav} id={p.num} /></span>
      </div>

      <h2 className="mt-3 font-display text-lg font-bold text-ink-900">{p.title}</h2>
      <p className="mt-1 text-sm text-ink-700"><span className="font-semibold text-faint">Best for: </span>{p.bestFor}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <span className="flex items-center gap-1.5 text-muted" title="Works best with">
          <Wrench className="h-3.5 w-3.5 text-faint" />
          {p.tools.join(' · ')}
        </span>
        <span className={`flex items-center gap-1.5 font-semibold ${t.text}`} title="Estimated time saved">
          <Clock className="h-3.5 w-3.5" /> Saves ~{p.timeSaved}
        </span>
      </div>

      <pre className="mt-4 max-h-56 flex-1 overflow-auto whitespace-pre-wrap rounded-2xl border border-line bg-sage-50 p-3.5 font-sans text-xs leading-relaxed text-ink-800">
        {p.text}
      </pre>

      <button onClick={onCopy} className="btn-ghost mt-4 w-full justify-center">
        {copied ? <><Check className="h-4 w-4 text-brand-600" /> Copied</> : <><Copy className="h-4 w-4" /> Copy Prompt</>}
      </button>
    </div>
  )
}

function Chip({ active, tone = 'brand', onClick, children }) {
  const t = toneOf(tone)
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? `${t.border} ${t.bgSoft} ${t.text}` : 'border-line bg-card text-muted hover:bg-sage-50'}`}>{children}</button>
  )
}
