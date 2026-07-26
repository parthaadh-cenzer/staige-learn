// ============================================================================
//  PREMIUM LANDING PAGE TEMPLATES
//
//  The page is honest about its own state, on purpose. The library is published
//  one verified template at a time (that is the course document's own decision),
//  so a card either offers a real ZIP or says "File pending" and disables the
//  button. There is no third behaviour, and no two cards can point at one file.
//
//  Everything else the document specifies IS here and usable today: the
//  technical standard, the folder structure, the setup steps, the single-file
//  customisation approach and the Claude prompt to build one yourself.
// ============================================================================
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'
import { templates, templateStandard, templatePrompt, liveTemplateCount } from '../../data/appbuilder/templates'
import { Reveal } from '../../components/ui'
import VaultPage, { DIFFICULTY_TONE } from './VaultPage'
import { tone as toneOf } from '../../lib/tones'

export default function Templates() {
  const [open, setOpen] = useState(null)
  const [plannedOpen, setPlannedOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const live = templates.filter((t) => t.file)
  const planned = templates.filter((t) => !t.file)

  const copyPrompt = () => {
    navigator.clipboard?.writeText(templatePrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <VaultPage
      icon="LayoutTemplate" tone="sky2"
      title="Premium Landing Page Templates"
      blurb="Production-ready React + Vite + Tailwind starters you download, extract and customise — with all the editable content in a single file so you never have to hunt through components to change a headline."
      stats={[`${templates.length} planned`, liveTemplateCount ? `${liveTemplateCount} available` : 'None available yet', 'React · Vite · Tailwind']}
    >
      {/* The state of the library, said plainly and first. */}
      <div className="card border-sun-100 bg-sun-50 p-5">
        <h2 className="flex items-center gap-2 font-display font-bold text-ink-900">
          <Icons.Info className="h-4.5 w-4.5 text-sun-500" /> Where this library is right now
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
          {liveTemplateCount === 0
            ? 'No template ZIPs have been published yet, so this page gives you the next best thing instead of a wall of dead buttons: the full technical standard, the setup and customisation guides, and the exact prompt used to generate these templates. The roadmap below lists all 20 with what each one teaches. Templates are built and verified one at a time — each is tested with a clean npm install and npm run dev before it appears here as a real download.'
            : `${liveTemplateCount} of ${templates.length} templates are ready to download. The rest are listed in the roadmap below until their ZIP has been built and verified.`}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">
          In the meantime, the standard, the setup guide, the customisation approach and the exact prompt used
          to generate these templates are all below — enough to build any of them yourself today.
        </p>
      </div>

      {/* Templates whose ZIP is built get full cards. The rest keep all their
          learning information — description, what you'll learn, tech stack —
          but sit in one collapsed list instead of twenty identical disabled
          cards, which is what made a paid library feel unfinished. */}
      {live.length > 0 && (
        <div className="grid gap-3 lg:grid-cols-2">
          {live.map((tpl, i) => (
            <Reveal key={tpl.id} delay={Math.min(i, 8) * 0.02}>
              <TemplateCard tpl={tpl} open={open === tpl.id} onToggle={() => setOpen((o) => (o === tpl.id ? null : tpl.id))} />
            </Reveal>
          ))}
        </div>
      )}

      {planned.length > 0 && (
        <div className="rounded-3xl border border-dashed border-line bg-sage-50/60 p-5">
          <button
            onClick={() => setPlannedOpen((o) => !o)}
            aria-expanded={plannedOpen}
            className="flex w-full items-center gap-3 text-left"
          >
            <Icons.Clock className="h-5 w-5 shrink-0 text-faint" />
            <span className="min-w-0 flex-1">
              <span className="block font-display font-bold text-ink-800">
                The roadmap <span className="font-normal text-faint">({planned.length} templates)</span>
              </span>
              <span className="block text-xs text-faint">
                Planned, not yet packaged. Every one is listed with what it teaches, so you can build any of
                them today with the prompt below — no download button here pretends to have a file behind it.
              </span>
            </span>
            <Icons.ChevronDown className={`h-4 w-4 shrink-0 text-faint transition ${plannedOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence initial={false}>
            {plannedOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }} className="overflow-hidden"
              >
                <ul className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
                  {planned.map((tpl) => {
                    const dt = toneOf(DIFFICULTY_TONE[tpl.difficulty])
                    return (
                      <li key={tpl.id} className="rounded-2xl border border-line bg-card p-4">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-display text-sm font-bold text-ink-800">{tpl.title}</p>
                          <span className={`pill shrink-0 ${dt.border} ${dt.text}`}>{tpl.difficulty}</span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted">{tpl.blurb}</p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {tpl.learn.map((l) => (
                            <span key={l} className="rounded-lg bg-sage-100 px-2 py-0.5 text-[11px] text-ink-700">{l}</span>
                          ))}
                        </div>
                        <p className="mt-2.5 text-[11px] font-semibold text-faint">Coming soon · file not yet available</p>
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* The standard */}
      <div className="card p-6">
        <h2 className="font-display text-xl font-bold text-ink-900">Every template includes</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-faint">Technical requirements</p>
            <ul className="mt-2 space-y-1.5">
              {templateStandard.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-ink-800">
                  <Icons.Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" /> {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-faint">Deliverables</p>
            <ul className="mt-2 space-y-1.5">
              {templateStandard.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-ink-800">
                  <Icons.Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" /> {d}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-faint">Folder structure</p>
            <pre className="mt-2 overflow-x-auto rounded-2xl border border-line bg-sage-50 p-3.5 font-mono text-xs leading-relaxed text-ink-800">
              {templateStandard.structure}
            </pre>
          </div>
        </div>
      </div>

      {/* Setup + customisation */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
            <Icons.Terminal className="h-5 w-5 text-brand-600" /> Setup instructions
          </h2>
          <ol className="mt-3 space-y-2">
            {templateStandard.setup.map((s, i) => (
              <li key={s} className="flex items-start gap-3 text-sm text-ink-800">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-brand-50 text-[11px] font-bold text-brand-600">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
            <Icons.Pencil className="h-5 w-5 text-sky2-500" /> Customization guide
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">{templateStandard.customization.note}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-faint">Edit one file</p>
          <p className="mt-1 font-mono text-sm text-ink-900">{templateStandard.customization.file}</p>
          <pre className="mt-2 overflow-x-auto rounded-2xl border border-line bg-sage-50 p-3.5 font-mono text-xs leading-relaxed text-ink-800">
            {templateStandard.customization.example}
          </pre>
        </div>
      </div>

      {/* The generation prompt */}
      <div className="card border-sky2-100 bg-sky2-50/50 p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky2-500">
            <Icons.Sparkles className="h-4 w-4" /> Build one yourself — the Claude prompt
          </span>
          <button onClick={copyPrompt} className="btn-ghost ml-auto !py-1.5 !text-xs">
            {copied ? <><Icons.Check className="h-3.5 w-3.5 text-brand-600" /> Copied</> : <><Icons.Copy className="h-3.5 w-3.5" /> Copy prompt</>}
          </button>
        </div>
        <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl border border-line bg-card p-4 font-sans text-sm leading-relaxed text-ink-800">
          {templatePrompt}
        </pre>
      </div>
    </VaultPage>
  )
}

function TemplateCard({ tpl, open, onToggle }) {
  const dt = toneOf(DIFFICULTY_TONE[tpl.difficulty])
  const ready = Boolean(tpl.file)

  return (
    <div className={`card flex h-full flex-col overflow-hidden ${ready ? 'border border-brand-200' : ''}`}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${tpl.id}-panel`}
        className="flex w-full items-start gap-3.5 p-5 text-left transition hover:bg-sage-50"
      >
        {/* No preview image is claimed for a template that doesn't exist yet —
            a placeholder frame is honest; a fake screenshot would not be. */}
        <span className={`grid h-12 w-16 shrink-0 place-items-center rounded-xl border ${ready ? 'border-brand-200 bg-brand-50 text-brand-600' : 'border-dashed border-line bg-sage-50 text-faint'}`}>
          <Icons.Image className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display font-bold text-ink-900">{tpl.title}</span>
          <span className="mt-1.5 flex flex-wrap gap-1.5">
            <span className={`pill ${dt.border} ${dt.text}`}>{tpl.difficulty}</span>
            {ready
              ? <span className="pill border-brand-200 text-brand-600"><Icons.Check className="h-3 w-3" /> Available{tpl.size ? ` · ${tpl.size}` : ''}</span>
              : <span className="pill border-line text-faint"><Icons.Clock className="h-3 w-3" /> File pending</span>}
          </span>
        </span>
        <Icons.ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-faint transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${tpl.id}-panel`}
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden"
          >
            <div className="border-t border-line p-5">
              <p className="text-sm leading-relaxed text-ink-700">{tpl.blurb}</p>

              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-faint">What you’ll learn</p>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {tpl.learn.map((l) => (
                  <li key={l} className="flex items-start gap-2 text-sm text-ink-800">
                    <Icons.Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" /> {l}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-faint">Tech stack</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {tpl.stack.map((s) => <span key={s} className="rounded-lg bg-sage-100 px-2 py-0.5 text-xs text-ink-700">{s}</span>)}
              </div>

              {ready ? (
                <a href={tpl.file} download className="btn-primary mt-5 w-full justify-center">
                  <Icons.Download className="h-4 w-4" /> Download ZIP{tpl.size ? ` (${tpl.size})` : ''}
                </a>
              ) : (
                <>
                  <button disabled className="btn-ghost mt-5 w-full cursor-not-allowed justify-center opacity-60">
                    <Icons.Clock className="h-4 w-4" /> File pending
                  </button>
                  <p className="mt-2 text-center text-xs text-faint">
                    This template hasn’t been built and packaged yet. Use the Claude prompt below to generate it
                    yourself in the meantime.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
