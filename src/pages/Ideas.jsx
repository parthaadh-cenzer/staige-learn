import { useMemo, useState } from 'react'
import { Search, Lightbulb, Star } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useCourse } from '../course/CourseContext'
import { tone as toneOf } from '../lib/tones'
import { Reveal } from '../components/ui'
import { Capy } from '../components/mascots'

const PATHS = { A: 'Faceless Content', B: 'Digital Products', C: 'AI Services' }

export default function Ideas() {
  const { course } = useCourse()
  const hustles = course.ideas.items
  const hustleCategories = course.ideas.categories
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  // Reuse worksheet store as a tiny "saved ideas" shortlist.
  const saved = useStore((s) => s.worksheets['saved-ideas']?.list) || []
  const setField = useStore((s) => s.setWorksheetField)
  const toggleSave = (id) => setField('saved-ideas', 'list', saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return hustles.filter((h) => (cat === 'all' || h.category === cat) && (!query || h.name.toLowerCase().includes(query)))
  }, [q, cat])

  const catOf = (id) => hustleCategories.find((c) => c.id === id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Capy size={72} proximity className="shrink-0" />
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">{course.ui.ideas.title}</h1>
          <p className="text-muted">{course.ui.ideas.blurb}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ideas…" className="input !pl-11 shadow-soft" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={cat === 'all'} onClick={() => setCat('all')}>All</Chip>
          {hustleCategories.map((c) => <Chip key={c.id} active={cat === c.id} tone={c.tone} onClick={() => setCat(c.id)}>{c.name}</Chip>)}
        </div>
      </div>

      {saved.length > 0 && (
        <div className="card border-gold-100 bg-gold-50 p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-gold-500"><Star className="h-4 w-4 fill-gold-400 text-gold-400" /> Your shortlist ({saved.length})</p>
          <div className="flex flex-wrap gap-2">
            {saved.map((id) => { const h = hustles.find((x) => x.id === id); return h ? <span key={id} className="pill border-gold-100 text-gold-500">{h.name}</span> : null })}
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((h, i) => {
          const c = catOf(h.category)
          const t = toneOf(c.tone)
          const isSaved = saved.includes(h.id)
          return (
            <Reveal key={h.id} delay={Math.min(i, 9) * 0.02}>
              <div className={`card card-hover flex h-full items-start justify-between gap-2 border ${isSaved ? 'border-gold-100' : 'border-line'} p-4`}>
                <div>
                  <span className={`pill mb-2 ${t.border} ${t.text}`}>{c.name}</span>
                  <p className="font-display font-bold text-ink-900">{h.name}</p>
                  <p className="mt-0.5 text-xs text-faint">Best fit: Path {c.path} · {PATHS[c.path]}</p>
                </div>
                <button onClick={() => toggleSave(h.id)} className={`shrink-0 rounded-lg border p-2 transition ${isSaved ? 'border-gold-100 text-gold-400' : 'border-line text-faint hover:text-ink-700'}`} aria-label="Save idea">
                  <Star className={`h-4 w-4 ${isSaved ? 'fill-gold-400' : ''}`} />
                </button>
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

function Chip({ active, tone = 'brand', onClick, children }) {
  const t = toneOf(tone)
  return <button onClick={onClick} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? `${t.border} ${t.bgSoft} ${t.text}` : 'border-line bg-card text-muted hover:bg-sage-50'}`}>{children}</button>
}
