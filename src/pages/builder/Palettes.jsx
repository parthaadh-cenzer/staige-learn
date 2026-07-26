// Color Palette Library — five adjacent swatches per palette with the HEX code
// readable INSIDE each swatch, exactly as the course document specifies.
//
// Contrast is computed per swatch (relative luminance, WCAG formula) rather
// than guessed, so the code stays legible on #0F172A and on #FFFFFF without
// anyone hand-picking a text colour for 100 individual swatches.
import { useMemo, useState } from 'react'
import * as Icons from 'lucide-react'
import { palettes } from '../../data/appbuilder/palettes'
import { Reveal } from '../../components/ui'
import VaultPage, { NoResults } from './VaultPage'

// Pick whichever ink — near-black or white — has the higher WCAG contrast
// ratio against this swatch. Computing both rather than thresholding matters:
// a naive "is it light?" cut-off puts white on mid-tones like #FB7185 at
// 2.7:1, which fails AA outright. Taking the max is guaranteed to clear 4.5:1
// on every possible colour, because the two curves cross at ~4.58:1.
const INK = { dark: '#111111', light: '#FFFFFF' }

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16)
  const lin = (c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255)
}

const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)

function inkOn(hex) {
  const L = luminance(hex)
  return contrast(L, luminance(INK.dark)) >= contrast(L, luminance(INK.light)) ? INK.dark : INK.light
}

export default function Palettes() {
  const [q, setQ] = useState('')
  const [copied, setCopied] = useState(null)

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return palettes
    return palettes.filter((p) => `${p.name} ${p.bestFor} ${p.colors.join(' ')}`.toLowerCase().includes(query))
  }, [q])

  const copy = (key, text) => {
    navigator.clipboard?.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1400)
  }

  return (
    <VaultPage
      icon="Palette" tone="flamingo"
      title="Color Palette Library"
      blurb="Twenty palettes, five colours each, with the industries they suit. Click any swatch to copy its HEX code, or take the whole palette in one go."
      stats={[`${palettes.length} palettes`, `${palettes.length * 5} colours`, 'Click to copy']}
    >
      <div className="relative">
        <Icons.Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-faint" />
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search palettes, industries or HEX codes…" aria-label="Search palettes"
          className="input !pl-11 shadow-soft"
        />
      </div>

      {filtered.length === 0 && <NoResults what="palettes" onClear={() => setQ('')} />}

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 8) * 0.03}>
            <div className="card flex h-full flex-col overflow-hidden">
              <div className="flex items-start justify-between gap-3 p-5 pb-3">
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-bold text-ink-900">
                    <span className="text-faint">{p.num}. </span>{p.name}
                  </h2>
                </div>
                <button
                  onClick={() => copy(`${p.id}-all`, p.colors.join(', '))}
                  className="btn-ghost shrink-0 !py-1.5 !text-xs"
                  aria-label={`Copy all five HEX codes from the ${p.name} palette`}
                >
                  {copied === `${p.id}-all`
                    ? <><Icons.Check className="h-3.5 w-3.5 text-brand-600" /> Copied</>
                    : <><Icons.Copy className="h-3.5 w-3.5" /> Copy palette</>}
                </button>
              </div>

              {/* Five adjacent blocks, HEX centred inside each. */}
              <div className="flex px-5" role="list">
                {p.colors.map((c, j) => {
                  const ink = inkOn(c)
                  const key = `${p.id}-${j}`
                  return (
                    <button
                      key={key}
                      role="listitem"
                      onClick={() => copy(key, c)}
                      style={{ backgroundColor: c, color: ink }}
                      className={`group relative grid h-24 flex-1 place-items-center text-[11px] font-bold tracking-wide transition focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-brand-500 ${
                        j === 0 ? 'rounded-l-2xl' : ''} ${j === p.colors.length - 1 ? 'rounded-r-2xl' : ''}`}
                      aria-label={`Copy ${c} from the ${p.name} palette`}
                      title={`Copy ${c}`}
                    >
                      {copied === key
                        ? <span className="flex items-center gap-1"><Icons.Check className="h-3.5 w-3.5" /> Copied</span>
                        : c}
                    </button>
                  )
                })}
              </div>

              <p className="mt-auto p-5 pt-4 text-sm">
                <span className="font-semibold text-faint">Best For: </span>
                <span className="text-ink-800">{p.bestFor}</span>
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </VaultPage>
  )
}
