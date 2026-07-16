import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'
import { useStore } from '../store/useStore'
import { useCourse } from '../course/CourseContext'
import { tone as toneOf } from '../lib/tones'
import { generate } from '../lib/byteLab'
import { buildResourceDoc, worksheetDoc, docToText, pickFormat, FORMATS } from '../lib/resourceDoc'
import { downloadDoc } from '../lib/exporters'
import { Reveal } from './ui'
import { Byte, Capy } from './mascots'

const Icon = ({ name, ...props }) => {
  const C = Icons[name] || Icons.Sparkles
  return <C {...props} />
}

// ── Primitives ──────────────────────────────────────────────────────────────
function Paragraph({ b }) {
  return <p className={b.lead ? 'text-lg leading-relaxed text-ink-800' : 'leading-relaxed text-ink-700'}>{b.text}</p>
}
function Heading({ b }) {
  return <h3 className="pt-2 font-display text-xl font-bold text-ink-900">{b.text}</h3>
}
function Quote({ b }) {
  return (
    <figure className="card relative overflow-hidden p-6">
      <div className="absolute -left-1 -top-5 font-display text-7xl text-brand-200">“</div>
      <blockquote className="relative pl-6 text-lg font-medium italic text-ink-800">{b.text}</blockquote>
      {b.author && <figcaption className="mt-3 pl-6 text-sm font-semibold text-brand-600">— {b.author}</figcaption>}
    </figure>
  )
}
function Banner({ b }) {
  return (
    <div className="card relative overflow-hidden border-brand-200 bg-gradient-to-br from-brand-50 to-mint-50 p-6 text-center">
      <Icons.Sparkles className="mx-auto mb-2 h-6 w-6 text-brand-500" />
      <p className="font-display text-lg font-bold text-ink-900">{b.text}</p>
    </div>
  )
}
function List({ b }) {
  const map = { check: { I: Icons.Check, c: 'text-brand-600' }, x: { I: Icons.X, c: 'text-flamingo-500' }, dot: { I: Icons.Dot, c: 'text-brand-500' } }
  const { I, c } = map[b.icon] || map.dot
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {b.items.map((it, i) => (
        <li key={i} className="flex items-start gap-2.5 rounded-2xl border border-line bg-sage-50 px-3.5 py-2.5">
          <I className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${c}`} />
          <span className="text-sm text-ink-700">{it}</span>
        </li>
      ))}
    </ul>
  )
}

const CALLOUTS = {
  info: { icon: 'Info', tone: 'sky2', label: 'Heads up' },
  warning: { icon: 'AlertTriangle', tone: 'sun', label: 'Watch out' },
  success: { icon: 'CheckCircle2', tone: 'brand', label: 'Golden rule' },
  fire: { icon: 'Flame', tone: 'flamingo', label: 'Real talk' },
  myth: { icon: 'Ghost', tone: 'mint', label: 'Myth' },
}
function Callout({ b }) {
  const cfg = CALLOUTS[b.variant] || CALLOUTS.info
  const t = toneOf(cfg.tone)
  return (
    <div className={`card border ${t.border} ${t.bgSoft} p-5`}>
      <div className="flex items-start gap-3.5">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-card ${t.text} shadow-soft`}>
          <Icon name={cfg.icon} className="h-5 w-5" />
        </div>
        <div>
          {b.title && <p className={`text-sm font-bold ${t.text}`}>{b.title}</p>}
          <p className="mt-1 text-sm leading-relaxed text-ink-700">{b.text}</p>
        </div>
      </div>
    </div>
  )
}

function BotTip({ b }) {
  return (
    <div className="card flex items-start gap-4 border-brand-200 bg-brand-50 p-5">
      <Byte size={54} className="shrink-0" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600">{b.label || 'Byte says'}</p>
        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-800">{b.text}</p>
      </div>
    </div>
  )
}

// Capy voicing the learner's own problem — the setup for every Byte answer.
function CapySays({ b }) {
  return (
    <div className="card flex items-start gap-4 border-sun-100 bg-sun-50 p-5">
      <Capy size={58} className="shrink-0" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-sun-500">{b.label || 'Capy’s problem'}</p>
        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed italic text-ink-800">“{b.text}”</p>
      </div>
    </div>
  )
}

// A weak line next to the fixed one. The course leans on this constantly.
function BeforeAfter({ b }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="card border-flamingo-100 bg-flamingo-50 p-5">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-flamingo-500">
          <Icons.X className="h-3.5 w-3.5" /> {b.beforeLabel || 'Instead of this'}
        </p>
        <p className="text-sm leading-relaxed text-ink-800">{b.before}</p>
      </div>
      <div className="card border-brand-200 bg-brand-50 p-5">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-600">
          <Icons.Check className="h-3.5 w-3.5" /> {b.afterLabel || 'Say this'}
        </p>
        <p className="text-sm leading-relaxed text-ink-800">{b.after}</p>
      </div>
      {b.note && <p className="text-sm text-muted md:col-span-2">{b.note}</p>}
    </div>
  )
}

// The end-to-end marketing workflow, as a single readable chain.
function Blueprint({ b }) {
  return (
    <div className="card border-brand-200 bg-sage-50 p-5 sm:p-6">
      <p className="font-display text-lg font-bold text-ink-900">{b.title}</p>
      {b.subtitle && <p className="mt-1 text-sm text-muted">{b.subtitle}</p>}
      <ol className="mt-5 flex flex-wrap items-stretch gap-2">
        {b.steps.map((s, i) => {
          const t = toneOf(s.tone || 'brand')
          return (
            <li key={i} className="flex items-stretch gap-2">
              <div className={`flex min-w-[7.5rem] flex-1 flex-col rounded-2xl border ${t.border} bg-card p-3 shadow-soft`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${t.text}`}>Step {i + 1}</span>
                <span className="mt-0.5 font-display text-sm font-bold text-ink-900">{s.name}</span>
                {s.detail && <span className="mt-1 text-xs leading-snug text-muted">{s.detail}</span>}
              </div>
              {i < b.steps.length - 1 && (
                <span className="grid shrink-0 place-items-center" aria-hidden="true">
                  <Icons.ChevronRight className="h-4 w-4 text-faint" />
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {b.note && <p className="mt-5 border-t border-line pt-4 text-sm text-ink-700">{b.note}</p>}
    </div>
  )
}

// ── Comparison / cards ──────────────────────────────────────────────────────
function Compare({ b }) {
  const cols = [b.left, b.right]
  const iconMap = { check: Icons.Check, x: Icons.X, dot: Icons.ChevronRight }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cols.map((col, i) => {
        const t = toneOf(col.tone)
        const I = iconMap[col.icon] || Icons.ChevronRight
        return (
          <div key={i} className={`card border ${t.border} ${t.bgSoft} p-5`}>
            <p className={`mb-3 font-display text-base font-bold ${t.text}`}>{col.title}</p>
            <ul className="space-y-2">
              {col.items.map((it, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-ink-700">
                  <I className={`mt-0.5 h-4 w-4 shrink-0 ${t.text}`} />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

function Cards({ b }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {b.items.map((c, i) => {
        const t = toneOf(c.tone)
        const I = { check: Icons.Check, x: Icons.X }[c.icon]
        return (
          <div key={i} className={`card border ${t.border} ${t.bgSoft} p-5`}>
            {c.badge && <span className={`pill mb-3 ${t.border} ${t.text}`}>{c.badge}</span>}
            <p className="font-display text-base font-bold text-ink-900">{c.title}</p>
            {c.body && <p className="mt-1.5 text-sm text-ink-700">{c.body}</p>}
            {c.list && (
              <ul className="mt-3 space-y-1.5">
                {c.list.map((it, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-ink-700">
                    {I && <I className={`mt-0.5 h-4 w-4 shrink-0 ${t.text}`} />}
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

function PathCards({ b }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {b.items.map((p) => {
        const t = toneOf(p.tone)
        return (
          <Reveal key={p.key} className={`card card-hover flex flex-col border ${t.border} p-5`}>
            <div className="flex items-center gap-3">
              <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${t.grad} font-display text-lg font-extrabold text-white`}>{p.key}</div>
              <div>
                <p className="font-display font-bold text-ink-900">{p.name}</p>
                <p className={`text-xs font-semibold ${t.text}`}>{p.tag}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-700">{p.desc}</p>
            <div className="mt-4 space-y-3 text-xs">
              <MiniList label="Examples" items={p.examples} t={t} />
              <MiniList label="Income" items={p.income} t={t} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="mb-1 font-bold text-brand-600">Pros</p>
                {p.pros.map((x, i) => <p key={i} className="text-muted">+ {x}</p>)}
              </div>
              <div>
                <p className="mb-1 font-bold text-flamingo-500">Cons</p>
                {p.cons.map((x, i) => <p key={i} className="text-muted">– {x}</p>)}
              </div>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}
function MiniList({ label, items, t }) {
  return (
    <div>
      <p className={`mb-1 font-bold ${t.text}`}>{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((x, i) => <span key={i} className="rounded-lg bg-sage-100 px-2 py-0.5 text-ink-700">{x}</span>)}
      </div>
    </div>
  )
}

function PayCards({ b }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {b.items.map((p, i) => {
        const t = toneOf(p.tone)
        return (
          <Reveal key={i} delay={i * 0.05} className={`card card-hover border ${t.border} p-5`}>
            <div className={`mb-3 grid h-11 w-11 place-items-center rounded-2xl ${t.bgSoft} ${t.text}`}><Icon name={p.icon} className="h-5 w-5" /></div>
            <p className="font-display text-lg font-bold text-ink-900">{p.name}</p>
            <p className={`text-sm ${t.text}`}>{p.line}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.ex.map((x, j) => <span key={j} className="rounded-lg bg-sage-100 px-2 py-0.5 text-xs text-ink-700">{x}</span>)}
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}

function Flow({ b }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {b.steps.map((s, i) => (
        <Reveal key={i} delay={i * 0.05} className="card card-hover relative p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white">{b.numbered ? i + 1 : '→'}</span>
            <p className="font-display font-bold text-ink-900">{s.title}</p>
          </div>
          <p className="text-sm text-ink-700">{s.text}</p>
        </Reveal>
      ))}
    </div>
  )
}

function Timeline({ b }) {
  return (
    <div className="relative space-y-3 pl-6">
      <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-brand-400 to-mint-400" />
      {b.steps.map((s, i) => (
        <Reveal key={i} delay={i * 0.06} className="relative">
          <div className="absolute -left-[1.4rem] top-1.5 h-4 w-4 rounded-full border-2 border-canvas bg-brand-500 shadow-ring" />
          <div className="card p-4">
            <span className="pill border-brand-200 text-brand-600">{s.label}</span>
            <p className="mt-2 font-display font-bold text-ink-900">{s.title}</p>
            <p className="text-sm text-muted">{s.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

function OfferExamples({ b }) {
  return (
    <div className="space-y-3">
      {b.items.map((o, i) => (
        <div key={i} className="card grid gap-3 p-4 md:grid-cols-3">
          <div className="rounded-2xl border border-flamingo-100 bg-flamingo-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-flamingo-500">{o.statement ? 'Audience' : 'Problem'}</p>
            <p className="mt-1 text-sm text-ink-800">{o.problem}</p>
          </div>
          <div className="rounded-2xl border border-brand-200 bg-brand-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{o.statement ? 'By providing' : 'Solution'}</p>
            <p className="mt-1 text-sm text-ink-800">{o.solution}</p>
          </div>
          <div className="rounded-2xl border border-mint-100 bg-mint-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-mint-500">{o.statement ? 'So they can' : 'Outcome'}</p>
            <p className="mt-1 text-sm text-ink-800">{o.outcome}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function OfferGrid({ b }) {
  return (
    <div className="space-y-5">
      {b.groups.map((g, i) => {
        const t = toneOf(g.tone)
        return (
          <div key={i}>
            <p className={`mb-2 font-display font-bold ${t.text}`}>{g.path}</p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {g.offers.map((o, j) => (
                <div key={j} className={`card border ${t.border} p-4`}>
                  <p className="text-xs text-muted">“{o.problem}”</p>
                  <p className="mt-2 font-display font-bold text-ink-900">{o.name}</p>
                  <p className={`mt-1 text-sm ${t.text}`}>→ {o.outcome}</p>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ToolCards({ b }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {b.items.map((tool, i) => {
        const t = toneOf(tool.tone)
        return (
          <Reveal key={i} delay={i * 0.04} className={`card card-hover border ${t.border} p-5`}>
            <div className="flex items-baseline justify-between">
              <p className="font-display text-lg font-bold text-ink-900">{tool.name}</p>
              <span className={`text-xs font-semibold ${t.text}`}>{tool.role}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tool.uses.map((u, j) => <span key={j} className={`rounded-lg ${t.bgSoft} px-2 py-0.5 text-xs ${t.text}`}>{u}</span>)}
            </div>
            <p className="mt-3 text-sm text-muted">{tool.note}</p>
          </Reveal>
        )
      })}
    </div>
  )
}

function StackCards({ b }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {b.items.map((s, i) => {
        const t = toneOf(s.tone)
        return (
          <div key={i} className={`card border ${t.border} p-5`}>
            <p className={`font-display font-bold ${t.text}`}>{s.path}</p>
            <div className="my-3 flex flex-wrap gap-2">
              {s.tools.map((tool, j) => <span key={j} className="rounded-xl border border-line bg-sage-50 px-2.5 py-1 text-sm font-medium text-ink-800">{tool}</span>)}
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3 text-sm">
              <span className="text-muted">{s.purpose}</span>
            </div>
            <p className="mt-2 text-xs"><span className="text-faint">Monthly cost: </span><span className={`font-bold ${t.text}`}>{s.cost}</span></p>
          </div>
        )
      })}
    </div>
  )
}

function ChannelCards({ b }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {b.items.map((c, i) => {
        const t = toneOf(c.tone)
        return (
          <Reveal key={i} delay={i * 0.05} className={`card card-hover border ${t.border} p-5`}>
            <p className="font-display text-lg font-bold text-ink-900">{c.name}</p>
            <p className={`mt-1 text-sm ${t.text}`}>{c.tip}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {c.dos.map((d, j) => <span key={j} className="rounded-lg bg-sage-100 px-2 py-0.5 text-xs text-ink-700">{d}</span>)}
            </div>
            <p className="mt-3 rounded-2xl border border-line bg-sage-50 p-3 text-sm italic text-ink-700">{c.cta}</p>
          </Reveal>
        )
      })}
    </div>
  )
}

// ── Interactive blocks ──────────────────────────────────────────────────────
function Checklist({ b }) {
  const state = useStore((s) => s.checklists[b.id])
  const toggle = useStore((s) => s.toggleChecklistItem)
  const checked = state || Array(b.items.length).fill(false)
  const done = checked.filter(Boolean).length
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display font-bold text-ink-900">{b.title}</p>
        <span className="pill border-brand-200 text-brand-600">{done}/{b.items.length}</span>
      </div>
      <ul className="space-y-2">
        {b.items.map((it, i) => (
          <li key={i}>
            <button
              onClick={() => toggle(b.id, i, b.items.length)}
              className="flex w-full items-center gap-3 rounded-2xl border border-line bg-sage-50 px-3.5 py-2.5 text-left transition hover:bg-mint-50"
            >
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${checked[i] ? 'border-brand-500 bg-brand-500' : 'border-line-strong bg-card'}`}>
                {checked[i] && <Icons.Check className="h-3.5 w-3.5 text-white" />}
              </span>
              <span className={`text-sm ${checked[i] ? 'text-faint line-through' : 'text-ink-800'}`}>{it}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Quiz({ b }) {
  const selected = useStore((s) => s.quizzes[b.id])
  const setAnswer = useStore((s) => s.setQuizAnswer)
  const answered = selected !== undefined
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icons.HelpCircle className="h-5 w-5 text-brand-600" />
        <p className="font-display font-bold text-ink-900">Quick check</p>
      </div>
      <p className="mb-3 text-ink-800">{b.question}</p>
      <div className="space-y-2">
        {b.options.map((opt, i) => {
          const isCorrect = i === b.answer
          const isPicked = selected === i
          let cls = 'border-line bg-sage-50 hover:bg-mint-50'
          if (answered && isCorrect) cls = 'border-brand-300 bg-brand-50'
          else if (answered && isPicked && !isCorrect) cls = 'border-flamingo-100 bg-flamingo-50'
          return (
            <button key={i} disabled={answered} onClick={() => setAnswer(b.id, i)} className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm text-ink-800 transition ${cls}`}>
              <span>{opt}</span>
              {answered && isCorrect && <Icons.Check className="h-4 w-4 text-brand-600" />}
              {answered && isPicked && !isCorrect && <Icons.X className="h-4 w-4 text-flamingo-500" />}
            </button>
          )
        })}
      </div>
      <AnimatePresence>
        {answered && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 overflow-hidden">
            <p className={`rounded-2xl border p-3 text-sm ${selected === b.answer ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-sun-100 bg-sun-50 text-sun-500'}`}>
              {selected === b.answer ? '✅ Nailed it. ' : '💡 '}{b.explain}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PathQuiz({ b }) {
  const stored = useStore((s) => s.pathResults[b.id])
  const setResult = useStore((s) => s.setPathResult)
  const [answers, setAnswers] = useState({}) // { [qi]: { path, oi } }
  const allAnswered = b.questions.every((_, qi) => answers[qi])

  const compute = () => {
    const tally = { A: 0, B: 0, C: 0 }
    b.questions.forEach((_, qi) => {
      const a = answers[qi]
      if (a) tally[a.path] += 1
    })
    const winner = Object.entries(tally).sort((a, c) => c[1] - a[1])[0][0]
    setResult(b.id, winner)
  }

  const res = stored ? b.results[stored] : null
  const t = res ? toneOf(res.tone) : toneOf('brand')

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icons.Compass className="h-5 w-5 text-brand-600" />
        <p className="font-display font-bold text-ink-900">Find your path</p>
      </div>
      <div className="space-y-4">
        {b.questions.map((q, qi) => (
          <div key={qi}>
            <p className="mb-2 text-sm font-medium text-ink-800">{qi + 1}. {q.q}</p>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt, oi) => {
                const picked = answers[qi]?.oi === oi
                return (
                  <button
                    key={oi}
                    onClick={() => setAnswers((a) => ({ ...a, [qi]: { path: opt.path, oi } }))}
                    className={`rounded-2xl border px-3.5 py-2 text-sm transition ${picked ? 'border-brand-400 bg-brand-50 text-ink-900' : 'border-line bg-sage-50 text-ink-700 hover:bg-mint-50'}`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <button onClick={compute} disabled={!allAnswered} className="btn-primary mt-4">
        {stored ? 'Recalculate' : 'Reveal my path'} <Icons.ArrowRight className="h-4 w-4" />
      </button>
      <AnimatePresence>
        {res && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 rounded-2xl border ${t.border} ${t.bgSoft} p-5 text-center`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Your recommended path</p>
            <p className={`mt-1 font-display text-2xl font-extrabold ${t.text}`}>{res.name}</p>
            <p className="mt-1 text-sm text-ink-700">{res.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Scorecard({ b }) {
  const stored = useStore((s) => s.scorecards[b.id]) || {}
  const setScore = useStore((s) => s.setScore)
  const total = b.sources.reduce((sum, src) => sum + (Number(stored[src]) || 0), 0)
  const max = b.sources.length * 5
  const verdict = total >= 13 ? { text: 'Strong demand — proceed!', tone: 'brand' } : total >= 9 ? { text: 'Potential demand — research more.', tone: 'sun' } : total > 0 ? { text: 'Weak — consider another niche.', tone: 'flamingo' } : null
  return (
    <div className="card p-5">
      <p className="mb-4 font-display font-bold text-ink-900">Demand Scorecard</p>
      <div className="space-y-4">
        {b.sources.map((src) => (
          <div key={src}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-ink-700">{src}</span>
              <span className="font-bold text-brand-600">{stored[src] || 0}/5</span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setScore(b.id, src, n)} className={`h-9 flex-1 rounded-xl border transition ${(stored[src] || 0) >= n ? 'border-brand-500 bg-gradient-to-br from-brand-400 to-brand-600' : 'border-line bg-sage-50 hover:bg-mint-50'}`} aria-label={`${src} ${n}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="text-sm text-muted">Total</span>
        <span className="font-display text-xl font-extrabold text-ink-900">{total} / {max}</span>
      </div>
      {verdict && <p className={`mt-2 text-sm font-semibold ${toneOf(verdict.tone).text}`}>{verdict.text}</p>}
    </div>
  )
}

function Field({ field, value, onChange, id }) {
  const common = 'input'
  if (field.type === 'textarea')
    return <textarea id={id} rows={field.rows || 3} className={common} placeholder={field.placeholder} value={value || ''} onChange={(e) => onChange(e.target.value)} />
  if (field.type === 'select')
    return (
      <select id={id} className={common} value={value || ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choose…</option>
        {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    )
  if (field.type === 'checks') {
    const arr = Array.isArray(value) ? value : []
    return (
      <div className="flex flex-wrap gap-2" role="group" aria-labelledby={id}>
        {field.options.map((o) => {
          const on = arr.includes(o)
          return (
            <button key={o} type="button" aria-pressed={on} onClick={() => onChange(on ? arr.filter((x) => x !== o) : [...arr, o])} className={`rounded-2xl border px-3 py-1.5 text-sm transition ${on ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-line bg-sage-50 text-ink-700 hover:bg-mint-50'}`}>
              {on ? '✓ ' : ''}{o}
            </button>
          )
        })}
      </div>
    )
  }
  return <input id={id} type="text" className={common} placeholder={field.placeholder} value={value || ''} onChange={(e) => onChange(e.target.value)} />
}

function Worksheet({ b }) {
  const { course } = useCourse()
  const data = useStore((s) => s.worksheets[b.id]) || {}
  const setField = useStore((s) => s.setWorksheetField)
  const [busy, setBusy] = useState(false)
  const filled = b.fields.filter((f) => data[f.id] && (Array.isArray(data[f.id]) ? data[f.id].length : true)).length

  // Your own answers → an editable Word document, not a text dump.
  const exportDoc = async () => {
    setBusy(true)
    try {
      await downloadDoc(worksheetDoc(b, data, course.title))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card border-brand-200 bg-brand-50/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icons.PencilLine className="h-5 w-5 text-brand-600" />
          <p className="font-display font-bold text-ink-900">{b.title}</p>
        </div>
        <span className="pill border-line text-muted">{filled}/{b.fields.length} filled</span>
      </div>
      <div className="space-y-4">
        {b.fields.map((f) => (
          <div key={f.id}>
            <label htmlFor={`${b.id}-${f.id}`} className="mb-1.5 block text-sm font-medium text-ink-700">{f.label}</label>
            <Field field={f} id={`${b.id}-${f.id}`} value={data[f.id]} onChange={(v) => setField(b.id, f.id, v)} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Icons.Check className="h-4 w-4 text-brand-600" />
        <span className="text-xs text-faint">Saved automatically to this device</span>
        <button onClick={exportDoc} disabled={busy} className="btn-ghost ml-auto !py-1.5 !text-xs">
          {busy
            ? <><Icons.Loader2 className="h-3.5 w-3.5 animate-spin" /> Preparing…</>
            : <><Icons.Download className="h-3.5 w-3.5" /> Export Word</>}
        </button>
      </div>
    </div>
  )
}

function Tracker({ b }) {
  const stored = useStore((s) => s.trackers[b.id]) || Array(b.days).fill('')
  const setDay = useStore((s) => s.setTrackerDay)
  const total = stored.reduce((sum, v) => sum + (Number(v) || 0), 0)
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display font-bold text-ink-900">{b.label} Tracker</p>
        <span className="pill border-brand-200 text-brand-600">Total: {total}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {Array.from({ length: b.days }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-line bg-sage-50 p-3 text-center">
            <p className="text-xs font-semibold text-faint">Day {i + 1}</p>
            <input
              type="number" min="0" inputMode="numeric"
              className="mt-1 w-full bg-transparent text-center font-display text-xl font-bold text-ink-900 outline-none"
              placeholder="0" value={stored[i] || ''}
              onChange={(e) => setDay(b.id, i, e.target.value, b.days)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Module-end sections ─────────────────────────────────────────────────────

// One list, two uses. `kind: 'template'` renders a module's 🤖 AI Templates;
// `kind: 'download'` renders its Downloads. Both read the SAME course resource
// data the Download Center uses (course.downloads.items), filtered by module —
// so a resource is authored once and appears in both places, and the Download
// button here produces the same real file the Download Center does.
function ResourceList({ b }) {
  const { course, base } = useCourse()
  const [copied, setCopied] = useState(null)
  const [busy, setBusy] = useState(null)
  const items = (course.downloads?.items || []).filter(
    (r) => r.moduleId === b.moduleId && (r.kind || 'download') === b.kind
  )
  if (!items.length) return null

  const isTemplate = b.kind === 'template'
  const cfg = isTemplate
    ? { icon: 'Bot', title: '🤖 AI Templates', blurb: 'Ready-to-use templates for this module. Copy one and fill in the blanks.', tone: 'sky2' }
    : { icon: 'Download', title: '📥 Downloads', blurb: 'Everything from this module, ready to take away.', tone: 'brand' }

  const t = toneOf(cfg.tone)

  const take = async (r) => {
    const doc = buildResourceDoc(r, course.title)
    // "Copy template" puts it on the clipboard, which has to be text — that's a
    // copy, not a download. Built from the same doc so it can't drift either.
    if (isTemplate) {
      navigator.clipboard?.writeText(docToText(doc))
      setCopied(r.id)
      setTimeout(() => setCopied((c) => (c === r.id ? null : c)), 1400)
      return
    }
    setBusy(r.id)
    try {
      await downloadDoc(doc)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="pt-2">
      <div className="mb-1 flex items-center gap-2">
        <h3 className="font-display text-xl font-bold text-ink-900">{cfg.title}</h3>
        <span className="pill border-line text-muted">{items.length}</span>
      </div>
      <p className="mb-4 text-sm text-muted">{b.blurb || cfg.blurb}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((r, i) => {
          const rt = toneOf(r.tone || cfg.tone)
          return (
            <Reveal key={r.id} delay={Math.min(i, 6) * 0.03}>
              <div className={`card card-hover flex h-full flex-col border ${rt.border} p-4`}>
                <div className="flex items-start gap-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${rt.bgSoft} ${rt.text}`}>
                    <Icon name={r.icon} className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-bold text-ink-900">{r.title}</p>
                    <span className="mt-1 flex flex-wrap gap-1.5">
                      <span className={`pill ${rt.border} ${rt.text}`}>{r.type}</span>
                      {!isTemplate && <span className="pill border-line text-faint">{FORMATS[pickFormat(r)]?.label}</span>}
                    </span>
                  </div>
                </div>
                <p className="mt-2.5 flex-1 text-xs leading-relaxed text-muted">{r.description}</p>
                <button onClick={() => take(r)} disabled={busy === r.id} className="btn-ghost mt-3 w-full justify-center !py-2 !text-xs">
                  {isTemplate
                    ? (copied === r.id
                        ? <><Icons.Check className="h-3.5 w-3.5 text-brand-600" /> Copied</>
                        : <><Icons.Copy className="h-3.5 w-3.5" /> Copy template</>)
                    : (busy === r.id
                        ? <><Icons.Loader2 className="h-3.5 w-3.5 animate-spin" /> Preparing…</>
                        : <><Icons.Download className="h-3.5 w-3.5" /> Download</>)}
                </button>
              </div>
            </Reveal>
          )
        })}
      </div>
      {course.features?.downloads && (
        <Link to={`${base}/downloads`} className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold ${t.text} hover:underline`}>
          See everything in the Download Center <Icons.ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

// 🤖 Byte Summary — the short "here's what you just learned" beat that closes
// every module. Deliberately terse: it's a recap, not a lesson.
function ByteSummary({ b }) {
  const { course, base } = useCourse()
  const next = b.nextModuleId ? course.getModule(b.nextModuleId) : null
  return (
    <div className="card border-brand-200 bg-brand-50 p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <Byte size={56} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">🤖 Byte Summary</p>
          <p className="mt-1 font-display font-bold text-ink-900">{b.intro || 'Today you learned:'}</p>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {b.learned.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-800">
                <Icons.Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {(next || b.nextLabel) && (
            <p className="mt-4 flex items-center gap-2 border-t border-brand-200 pt-3 text-sm">
              <span className="font-semibold text-faint">Next up</span>
              <Icons.ArrowRight className="h-4 w-4 text-brand-600" />
              <Link
                to={next ? `${base}/module/${next.id}` : base}
                className="font-display font-bold text-brand-700 hover:underline"
              >
                {next ? next.title : b.nextLabel}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// 🔓 Module Unlocked — the reward beat that replaces a plain "Congratulations".
// Locked until the learner actually finishes the module, so it stays a reward
// rather than a spoiler.
function ModuleUnlock({ b }) {
  const { course, base } = useCourse()
  const completed = useStore((s) => s.completed)
  const next = b.nextModuleId ? course.getModule(b.nextModuleId) : null
  const t = toneOf(next?.color || 'gold')

  const mod = course.getModule(b.moduleId)
  const unlocked = mod ? mod.lessons.every((l) => completed.includes(l.id)) : true

  return (
    <div className={`card relative overflow-hidden border ${unlocked ? t.border : 'border-line'} ${unlocked ? t.bgSoft : 'bg-sage-50'} p-6 text-center`}>
      {unlocked && <div className={`pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full ${t.bgSoft} blur-3xl`} />}
      <div className="relative">
        <div className="text-4xl" aria-hidden="true">{unlocked ? '🔓' : '🔒'}</div>
        <p className={`mt-2 text-xs font-bold uppercase tracking-wider ${unlocked ? t.text : 'text-faint'}`}>
          {unlocked ? (next ? 'Module unlocked' : 'Course complete') : 'Finish this module to unlock'}
        </p>
        <h3 className="mt-1 font-display text-2xl font-extrabold text-ink-900">
          {next ? next.title : b.finalTitle || 'You built the whole system'}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          {next ? next.subtitle : b.finalText}
        </p>
        {unlocked ? (
          <Link
            to={next ? `${base}/module/${next.id}` : `${base}/badges`}
            className="btn-primary mt-5"
          >
            {next ? 'Continue' : 'See your achievements'} <Icons.ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <p className="mt-5 text-xs text-faint">Complete every lesson in this module to continue.</p>
        )}
      </div>
    </div>
  )
}

// ── Marketing Mission ───────────────────────────────────────────────────────
// The learner fills in the fields, Byte answers. Answers come from
// src/lib/byteLab.js — see that file for how responses are produced and where
// a live model would plug in. Input persists (worksheets store); the response
// is regenerated on demand, so it always reflects what's currently typed.

function ScoreBar({ score }) {
  const t = toneOf(score.value >= 75 ? 'brand' : score.value >= 55 ? 'sun' : 'flamingo')
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-ink-800">{score.label}</span>
        <span className={`font-display text-sm font-extrabold ${t.text}`}>{score.value}<span className="text-faint">/100</span></span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-sage-200">
        <motion.div
          className={`h-full rounded-full ${t.solid}`}
          initial={{ width: 0 }} animate={{ width: `${score.value}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          role="meter" aria-valuenow={score.value} aria-valuemin={0} aria-valuemax={100} aria-label={score.label}
        />
      </div>
      {score.note && <p className="mt-1 text-xs text-muted">{score.note}</p>}
    </div>
  )
}

function ByteLab({ b }) {
  const data = useStore((s) => s.worksheets[b.id]) || {}
  const setField = useStore((s) => s.setWorksheetField)
  const [result, setResult] = useState(null)
  const [thinking, setThinking] = useState(false)
  const [copied, setCopied] = useState(false)

  const hasValue = (f) => {
    const v = data[f.id]
    return Array.isArray(v) ? v.length > 0 : Boolean(String(v ?? '').trim())
  }
  const ready = b.fields.every((f) => f.optional || hasValue(f))

  const run = () => {
    setThinking(true)
    setResult(null)
    // A beat of "thinking" — the response is local, but instant answers read as
    // canned. Kept short so it never feels like waiting.
    setTimeout(() => {
      setResult(generate(b.recipe, data))
      setThinking(false)
    }, 500)
  }

  const asText = (r) => [
    r.headline, '',
    ...(r.scores || []).map((s) => `${s.label}: ${s.value}/100 — ${s.note || ''}`),
    ...(r.scores?.length ? [''] : []),
    ...r.sections.flatMap((s) => [s.label, s.text || '', ...(s.items || []).map((i) => `• ${i}`), '']),
    r.note || '',
  ].join('\n').trim()

  const copy = (r) => {
    navigator.clipboard?.writeText(asText(r))
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="card border-brand-200 bg-brand-50/60 p-5">
      <div className="mb-1 flex items-center gap-2">
        <Icons.Target className="h-5 w-5 text-brand-600" />
        <p className="font-display font-bold text-ink-900">{b.title || 'Marketing Mission'}</p>
      </div>
      {b.intro && <p className="mb-4 text-sm text-ink-700">{b.intro}</p>}

      {b.examples && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          <span className="text-xs font-semibold text-faint">Examples:</span>
          {b.examples.map((e) => <span key={e} className="rounded-lg bg-sage-100 px-2 py-0.5 text-xs text-ink-700">{e}</span>)}
        </div>
      )}

      <div className="space-y-4">
        {b.fields.map((f) => (
          <div key={f.id}>
            <label htmlFor={`${b.id}-${f.id}`} className="mb-1.5 block text-sm font-medium text-ink-700">
              {f.label}{f.optional && <span className="ml-1 text-xs font-normal text-faint">(optional)</span>}
            </label>
            <Field field={f} id={`${b.id}-${f.id}`} value={data[f.id]} onChange={(v) => setField(b.id, f.id, v)} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={run} disabled={!ready || thinking} className="btn-primary">
          {thinking ? <Icons.Loader2 className="h-4 w-4 animate-spin" /> : <Icons.Sparkles className="h-4 w-4" />}
          {thinking ? 'Byte is working…' : (b.cta || 'Ask Byte')}
        </button>
        {!ready && <span className="text-xs text-faint">Fill this in and Byte will take it from there.</span>}
        {result && (
          <button onClick={() => copy(result)} className="btn-ghost !py-2 !text-xs">
            {copied ? <Icons.Check className="h-3.5 w-3.5 text-brand-600" /> : <Icons.Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        )}
      </div>

      <div aria-live="polite">
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-4 rounded-2xl border border-brand-200 bg-card p-5"
            >
              <div className="flex items-start gap-3.5">
                <Byte size={48} className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Byte</p>
                  <p className="mt-1 font-display font-bold text-ink-900">{result.headline}</p>
                </div>
              </div>

              {result.scores && (
                <div className="mt-4 space-y-3 rounded-2xl border border-line bg-sage-50 p-4">
                  {result.scores.map((s) => <ScoreBar key={s.label} score={s} />)}
                </div>
              )}

              <div className="mt-4 space-y-3">
                {result.sections.map((s, i) => (
                  <div key={i} className="rounded-2xl border border-line bg-sage-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{s.label}</p>
                    {s.text && <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-ink-800">{s.text}</p>}
                    {s.items && (
                      <ul className="mt-2 space-y-1.5">
                        {s.items.map((it, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-ink-800">
                            <Icons.Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {result.note && (
                <p className="mt-4 rounded-2xl border border-brand-200 bg-brand-50 p-3.5 text-sm italic leading-relaxed text-ink-800">{result.note}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-3 text-xs text-faint">Your answers save to this device.</p>
    </div>
  )
}

// ── Dispatcher ──────────────────────────────────────────────────────────────
const MAP = {
  p: Paragraph, h: Heading, quote: Quote, banner: Banner, list: List, callout: Callout, bot: BotTip,
  capy: CapySays, beforeafter: BeforeAfter, blueprint: Blueprint,
  compare: Compare, cards: Cards, pathcards: PathCards, paycards: PayCards, flow: Flow, timeline: Timeline,
  offerexamples: OfferExamples, offergrid: OfferGrid, toolcards: ToolCards, stackcards: StackCards, channelcards: ChannelCards,
  checklist: Checklist, quiz: Quiz, pathquiz: PathQuiz, scorecard: Scorecard, worksheet: Worksheet, tracker: Tracker,
  bytelab: ByteLab,
  resourcelist: ResourceList, bytesummary: ByteSummary, moduleunlock: ModuleUnlock,
}

export default function Blocks({ blocks }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        const C = MAP[b.t]
        if (!C) return null
        return <C key={i} b={b} />
      })}
    </div>
  )
}
