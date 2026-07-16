// Download Center — every resource carries its real structure as data, and the
// preview and the downloaded document are two renderings of that same doc
// (src/lib/resourceDoc.js). No dead links, no "file coming soon", no drift.
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Eye, X, Search, Loader2, FileDown } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useCourse } from '../course/CourseContext'
import { buildResourceDoc, FORMATS } from '../lib/resourceDoc'
import { downloadDoc } from '../lib/exporters'
import { Reveal } from '../components/ui'
import { Byte } from '../components/mascots'
import ResourcePreview from '../components/ResourcePreview'
import { tone as toneOf } from '../lib/tones'

const Icon = ({ name, ...p }) => { const C = Icons[name] || Icons.FileText; return <C {...p} /> }

const KIND_LABEL = { template: 'AI Templates', download: 'Downloads' }

// Small format badge — tells you what you're about to get before you click.
function FormatTag({ format, className = '' }) {
  const f = FORMATS[format]
  if (!f) return null
  return <span className={`pill border-line text-faint ${className}`}>{f.label}</span>
}

export default function Downloads() {
  const { course } = useCourse()
  const items = course.downloads?.items || []
  const [preview, setPreview] = useState(null)
  const [busy, setBusy] = useState(null)
  const [q, setQ] = useState('')
  const [kind, setKind] = useState('all')
  const [mod, setMod] = useState('all')

  // One doc per resource, built once. The card badge, the preview and the
  // download all read the same object — that's what keeps them in sync.
  const docs = useMemo(
    () => Object.fromEntries(items.map((r) => [r.id, buildResourceDoc(r, course.title)])),
    [items, course.title]
  )

  // The exporter is fetched on first use, so show that something's happening.
  const take = async (r) => {
    setBusy(r.id)
    try {
      await downloadDoc(docs[r.id])
    } finally {
      setBusy(null)
    }
  }

  // Courses with a handful of resources don't need filtering; a course with 60+
  // does. Both are the same page — the controls appear when they earn their keep.
  const kinds = [...new Set(items.map((r) => r.kind || 'download'))]
  const showFilters = items.length > 12

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return items.filter((r) => {
      if (kind !== 'all' && (r.kind || 'download') !== kind) return false
      if (mod !== 'all' && r.moduleId !== mod) return false
      if (!query) return true
      return `${r.title} ${r.description} ${r.type}`.toLowerCase().includes(query)
    })
  }, [items, q, kind, mod])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Byte size={68} proximity className="shrink-0" />
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">{course.ui.downloads.title}</h1>
          <p className="text-muted">{course.ui.downloads.blurb}</p>
        </div>
      </div>

      {showFilters && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-faint" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${items.length} resources…`} aria-label="Search resources"
              className="input !pl-11 shadow-soft"
            />
          </div>
          {kinds.length > 1 && (
            <div className="flex flex-wrap gap-2">
              <Chip active={kind === 'all'} onClick={() => setKind('all')}>All ({items.length})</Chip>
              {kinds.map((k) => {
                const count = items.filter((r) => (r.kind || 'download') === k).length
                return (
                  <Chip key={k} active={kind === k} tone={k === 'template' ? 'sky2' : 'brand'} onClick={() => setKind(k)}>
                    {KIND_LABEL[k] || k} ({count})
                  </Chip>
                )
              })}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Chip active={mod === 'all'} onClick={() => setMod('all')}>Every module</Chip>
            {course.modules.map((m) => {
              const count = items.filter((r) => r.moduleId === m.id).length
              if (!count) return null
              return (
                <Chip key={m.id} active={mod === m.id} tone={m.color} onClick={() => setMod(m.id)}>
                  {m.emoji} {m.title} ({count})
                </Chip>
              )
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="card p-8 text-center text-muted">Nothing matches that. Try another keyword or clear the filters.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((r, i) => {
          const t = toneOf(r.tone)
          return (
            <Reveal key={r.id} delay={Math.min(i, 6) * 0.04}>
              <div className={`card card-hover flex h-full flex-col border ${t.border} p-5`}>
                <div className="flex items-start gap-3.5">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${t.bgSoft} ${t.text}`}>
                    <Icon name={r.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display font-bold text-ink-900">{r.title}</h2>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <span className={`pill ${t.border} ${t.text}`}>{r.type}</span>
                      {r.kind === 'template' && <span className="pill border-sky2-100 text-sky2-500">🤖 AI Template</span>}
                      <FormatTag format={docs[r.id]?.format} />
                      <span className="pill border-line text-muted">{r.moduleLabel}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">{r.description}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setPreview(docs[r.id])} className="btn-ghost flex-1 justify-center !py-2 !text-xs">
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </button>
                  <button onClick={() => take(r)} disabled={busy === r.id} className="btn-primary flex-1 justify-center !py-2 !text-xs">
                    {busy === r.id
                      ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Preparing…</>
                      : <><Download className="h-3.5 w-3.5" /> Download</>}
                  </button>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>

      {/* Future updates — the closing part of the Bonus Resource Center. Copy is
          course-driven; the card hides for courses that don't supply it. */}
      {course.ui.downloads.futureUpdates && (
        <Reveal>
          <div className="card border-brand-200 bg-brand-50 p-6">
            <div className="flex items-start gap-4">
              <Byte size={52} className="shrink-0" />
              <div>
                <h2 className="font-display text-lg font-bold text-ink-900">Future updates</h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-700">{course.ui.downloads.futureUpdates}</p>
                <p className="mt-3 text-xs text-faint">Your progress and saved answers carry across every update.</p>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      <PreviewModal
        doc={preview}
        onClose={() => setPreview(null)}
        busy={busy === preview?.id}
        onDownload={() => preview && take({ id: preview.id })}
      />
    </div>
  )
}

function Chip({ active, tone = 'brand', onClick, children }) {
  const t = toneOf(tone)
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? `${t.border} ${t.bgSoft} ${t.text}` : 'border-line bg-card text-muted hover:bg-sage-50'}`}>{children}</button>
  )
}

// The preview renders the SAME doc object the download does — see
// components/ResourcePreview.jsx and lib/resourceDoc.js. There is no second
// implementation to keep in step.
function PreviewModal({ doc, onClose, onDownload, busy }) {
  useEffect(() => {
    if (!doc) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [doc, onClose])

  const fmt = doc && FORMATS[doc.format]

  return (
    <AnimatePresence>
      {doc && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            role="dialog" aria-modal="true" aria-labelledby="preview-title"
            className="fixed inset-x-0 bottom-0 top-8 z-50 mx-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-line bg-canvas shadow-card sm:inset-6 sm:top-10 sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-line bg-card p-5">
              <div className="min-w-0">
                <h2 id="preview-title" className="font-display text-xl font-bold text-ink-900">{doc.title}</h2>
                <p className="mt-1 text-sm text-muted">{doc.subtitle}</p>
              </div>
              <button onClick={onClose} className="btn-ghost !px-2.5 !py-2" aria-label="Close preview"><X className="h-5 w-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <ResourcePreview doc={doc} />
            </div>

            <div className="flex items-center gap-3 border-t border-line bg-card p-5">
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <FileDown className="h-3.5 w-3.5 text-brand-600" /> {fmt?.hint}
              </span>
              <button onClick={onDownload} disabled={busy} className="btn-primary ml-auto">
                {busy
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Preparing…</>
                  : <><Download className="h-4 w-4" /> Download {fmt?.label}</>}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
