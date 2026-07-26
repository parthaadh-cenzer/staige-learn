// Shared chrome for every Builder Vault page: the back link to the vault home,
// the heading block and an optional stat strip. Keeping it here means the nine
// pages can't drift into nine slightly different headers.
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useCourse } from '../../course/CourseContext'
import { tone as toneOf } from '../../lib/tones'

const Icon = ({ name, ...p }) => { const C = Icons[name] || Icons.Sparkles; return <C {...p} /> }

export default function VaultPage({ icon, tone = 'brand', title, blurb, stats = [], children, actions }) {
  const { base } = useCourse()
  const t = toneOf(tone)
  return (
    <div className="space-y-6">
      <Link to={`${base}/builder-vault`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink-800">
        <ArrowLeft className="h-4 w-4" /> Builder Vault
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-3xl ${t.bgSoft} ${t.text}`}>
          <Icon name={icon} className="h-7 w-7" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-extrabold text-ink-900">{title}</h1>
          <p className="mt-1 max-w-3xl text-muted">{blurb}</p>
          {stats.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {stats.map((s) => <span key={s} className="pill border-line text-muted">{s}</span>)}
            </div>
          )}
        </div>
        {actions}
      </div>

      {children}
    </div>
  )
}

// The filter chip every vault page uses. One implementation, one focus ring.
export function Chip({ active, tone = 'brand', onClick, children, ...rest }) {
  const t = toneOf(tone)
  return (
    <button
      type="button" onClick={onClick} aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
        active ? `${t.border} ${t.bgSoft} ${t.text}` : 'border-line bg-card text-muted hover:bg-sage-50'
      }`}
      {...rest}
    >
      {children}
    </button>
  )
}

// Shared empty state, so "no results" reads the same everywhere.
export function NoResults({ what = 'results', onClear }) {
  return (
    <div className="card p-8 text-center">
      <Icons.SearchX className="mx-auto h-8 w-8 text-faint" />
      <p className="mt-3 font-display font-bold text-ink-900">No {what} match that</p>
      <p className="mt-1 text-sm text-muted">Try a different keyword, or clear the filters to see everything again.</p>
      {onClear && <button onClick={onClear} className="btn-ghost mt-4">Clear filters</button>}
    </div>
  )
}

export const DIFFICULTY_TONE = { Beginner: 'brand', Intermediate: 'sun', Advanced: 'flamingo' }
