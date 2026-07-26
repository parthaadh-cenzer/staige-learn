// ============================================================================
//  FONT PAIRING LIBRARY
//
//  Font loading is the whole design problem here. Fifteen pairings reference
//  roughly a dozen distinct families; loading all of them globally at every
//  weight would be several hundred kilobytes of fonts for a page most people
//  skim. So:
//
//   • Nothing is loaded on mount. A pairing's fonts load only when its card
//     scrolls into view, via one <link> per family appended once and reused.
//   • Only the two weights the preview actually renders (400 and 700) are
//     requested — never the full variable range.
//   • `display=swap` means the preview shows in the fallback immediately and
//     upgrades when the font lands; nothing blocks paint.
//   • Families are tracked in a module-level Set, so switching filters or
//     revisiting the page never re-requests a family already loaded.
// ============================================================================
import { useEffect, useMemo, useRef, useState } from 'react'
import * as Icons from 'lucide-react'
import { fontPairs, typographyRules } from '../../data/appbuilder/fonts'
import { Reveal } from '../../components/ui'
import VaultPage, { NoResults } from './VaultPage'

const loaded = new Set()

const familyParam = (family) => family.trim().replace(/\s+/g, '+')
const importUrl = (families) =>
  `https://fonts.googleapis.com/css2?${families.map((f) => `family=${familyParam(f)}:wght@400;700`).join('&')}&display=swap`

function loadFamilies(families) {
  const missing = families.filter((f) => !loaded.has(f))
  if (!missing.length) return
  missing.forEach((f) => loaded.add(f))
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = importUrl(missing)
  document.head.appendChild(link)
}

// How many cards load their fonts immediately. Everything above the fold must
// never depend on an observer firing: a tab that is backgrounded on first paint
// gets no IntersectionObserver callbacks at all, and "eventually, once you look
// at it" is the wrong guarantee for the content already on screen.
const EAGER = 4

// Load a card's two families: immediately for the first few, otherwise the
// first time the card comes near the viewport.
function useLazyFonts(families, eager) {
  const ref = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (ready) return
    // Eager cards, and any browser without IntersectionObserver, load now.
    if (eager || typeof IntersectionObserver === 'undefined') {
      loadFamilies(families)
      setReady(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          loadFamilies(families)
          setReady(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [families, eager, ready])

  return [ref, ready]
}

export default function Fonts() {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return fontPairs
    return fontPairs.filter((p) =>
      `${p.name} ${p.heading.display} ${p.body.display} ${p.bestFor.join(' ')}`.toLowerCase().includes(query)
    )
  }, [q])

  return (
    <VaultPage
      icon="Type" tone="sky2"
      title="Font Pairing Library"
      blurb="Stop guessing which fonts look good together. Fifteen professionally selected combinations, each with a live preview and a one-click Google Fonts import."
      stats={[`${fontPairs.length} pairings`, 'Live previews', 'Fonts load only when you scroll to them']}
    >
      <div className="relative">
        <Icons.Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-faint" />
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search pairings, fonts or industries…" aria-label="Search font pairings"
          className="input !pl-11 shadow-soft"
        />
      </div>

      {filtered.length === 0 && <NoResults what="pairings" onClear={() => setQ('')} />}

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 8) * 0.03}><PairCard p={p} eager={i < EAGER} /></Reveal>
        ))}
      </div>

      <div className="card border-brand-200 bg-brand-50 p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
          <Icons.Lightbulb className="h-5 w-5 text-brand-600" /> Design Rules
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {typographyRules.map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm text-ink-800">
              <Icons.Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {r}
            </li>
          ))}
        </ul>
      </div>
    </VaultPage>
  )
}

function PairCard({ p, eager }) {
  const families = useMemo(() => [p.heading.family, p.body.family], [p.heading.family, p.body.family])
  const [ref, ready] = useLazyFonts(families, eager)
  const [copied, setCopied] = useState(false)

  const cssImport = `@import url('${importUrl(families)}');`
  const copy = () => {
    navigator.clipboard?.writeText(cssImport)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  // Generic fallbacks keep the preview readable before the webfont arrives —
  // and permanently, for the two families that aren't on Google Fonts.
  const headStyle = { fontFamily: `'${p.heading.family}', ui-sans-serif, system-ui, sans-serif`, fontWeight: 700 }
  const bodyStyle = { fontFamily: `'${p.body.family}', ui-sans-serif, system-ui, sans-serif`, fontWeight: 400 }

  return (
    <div ref={ref} className="card flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-ink-900">
          <span className="text-faint">{p.num}. </span>{p.name}
        </h2>
        {!ready && <span className="pill shrink-0 border-line text-faint">Loading font…</span>}
      </div>

      <div className="mt-1.5 flex flex-wrap gap-1.5">
        <span className="pill border-sky2-100 text-sky2-500">Heading: {p.heading.display}</span>
        <span className="pill border-line text-muted">Body: {p.body.display}</span>
      </div>

      {/* Live preview */}
      <div className="mt-4 rounded-2xl border border-line bg-sage-50 p-5">
        <p style={headStyle} className="text-2xl leading-tight text-ink-900">Build something people love</p>
        <p style={bodyStyle} className="mt-2.5 text-sm leading-relaxed text-ink-700">
          Good typography disappears. The reader notices the idea, not the letterforms — which is exactly
          why one heading font and one body font is usually the whole system you need.
        </p>
      </div>

      {p.note && (
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted">
          <Icons.Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" /> {p.note}
        </p>
      )}

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-faint">Best for</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {p.bestFor.map((b) => <span key={b} className="rounded-lg bg-sage-100 px-2 py-0.5 text-xs text-ink-700">{b}</span>)}
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <button onClick={copy} className="btn-ghost flex-1 justify-center !py-2 !text-xs">
          {copied ? <><Icons.Check className="h-3.5 w-3.5 text-brand-600" /> Copied</> : <><Icons.Copy className="h-3.5 w-3.5" /> Copy Google Fonts import</>}
        </button>
        <a
          href={`https://fonts.google.com/?query=${encodeURIComponent(p.heading.family)}`}
          target="_blank" rel="noopener noreferrer"
          className="btn-ghost flex-1 justify-center !py-2 !text-xs"
        >
          <Icons.ExternalLink className="h-3.5 w-3.5" /> Google Fonts
        </a>
      </div>
    </div>
  )
}
