// MascotAdvisor — the one official Capy & Byte mascot, presented five ways.
//
//   <MascotAdvisor mode="hero | lesson | success | empty | mini" />
//
// Design rules (do not break):
//  • ONE image, never distorted, never a sprite sheet. The art only ever scales
//    uniformly / bobs gently — all the "life" comes from the SURROUNDING UI:
//    a soft green glow that pulses (Byte), floating holographic HTML/CSS cards,
//    and an on-click speech bubble. Capy reads as "breathing" via a tiny scale.
//  • Everything looping is gated behind !reduce (prefers-reduced-motion).
//  • CSS + Framer Motion only. No heavy animation libs.
import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { BarChart3, ListChecks, Workflow, Zap, TrendingUp, X, Sparkles } from 'lucide-react'

const DUO = '/mascots/mascot.webp' // Capy + Byte
const BYTE = '/mascots/byte.webp'  // Byte solo — the advisor avatar

// Byte's nudges. One shows at a time; clicking the mascot rotates them.
const MESSAGES = [
  'Shoo shoo — build your side hustle. Quit procrastinating.',
  'Byte is working. You just need to pick a lane.',
  'One offer. One audience. One weekend.',
  'Stop collecting ideas. Start shipping.',
  'Capy is relaxing because Byte has the boring work handled.',
]

// Floating holographic "AI screens" that orbit Byte. Pure HTML/CSS — never
// baked into the image. Positions are % within the mascot wrapper.
// Positions sit in the image's transparent margins / corners so the cards orbit
// the scene (concentrated around Byte, right) without ever covering a face.
const CARDS = [
  { key: 'analytics',  icon: BarChart3,  label: 'Analytics',  tint: 'text-brand-600', body: 'bars', pos: { top: '1%',    left: '0%' },   delay: 0 },
  { key: 'checklist',  icon: ListChecks, label: 'Tasks',      tint: 'text-mint-500',  body: 'list', pos: { top: '0%',    right: '7%' },  delay: 0.8 },
  { key: 'automation', icon: Zap,        label: 'Automation', tint: 'text-gold-500',  body: 'flow', pos: { top: '46%',   right: '0%' },  delay: 1.6 },
  { key: 'workflow',   icon: Workflow,   label: 'Workflow',   tint: 'text-sky2-500',  body: 'flow', pos: { top: '57%',   left: '0%' },   delay: 2.4 },
  { key: 'progress',   icon: TrendingUp, label: 'Progress',   tint: 'text-brand-600', body: 'bar',  pos: { bottom: '5%', right: '9%' },  delay: 3.2 },
]

// ── Tiny holographic card ────────────────────────────────────────────────────
function HoloCard({ card, reduce, compact }) {
  const Icon = card.icon
  const float = reduce
    ? {}
    : {
        animate: { y: [0, -7, 0], rotate: [-1.5, 1.5, -1.5], opacity: [0.85, 1, 0.85] },
        transition: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: card.delay },
      }
  return (
    <motion.div
      className="pointer-events-none absolute z-20"
      style={card.pos}
      initial={{ opacity: 0, scale: 0.8, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + card.delay * 0.12 }}
    >
      <motion.div
        {...float}
        className={`flex ${compact ? 'w-[3.75rem] gap-1 p-1.5' : 'w-[4.5rem] gap-1 p-1.5'} flex-col rounded-lg border border-brand-200/70 bg-card/80 shadow-[0_8px_22px_-12px_rgba(74,138,46,0.45)] ring-1 ring-lime-100/60 backdrop-blur-md`}
        style={{ willChange: 'transform' }}
      >
        <div className="flex items-center gap-1">
          <Icon className={`h-2.5 w-2.5 shrink-0 ${card.tint}`} />
          <span className="truncate text-[8px] font-bold uppercase tracking-wide text-ink-700">{card.label}</span>
        </div>
        <HoloBody kind={card.body} />
      </motion.div>
    </motion.div>
  )
}

// Lightweight CSS-only mini visualisations inside each card.
function HoloBody({ kind }) {
  if (kind === 'bars') {
    return (
      <div className="flex h-3.5 items-end gap-0.5">
        {[40, 70, 55, 90, 65].map((h, i) => (
          <span key={i} className="flex-1 rounded-sm bg-gradient-to-t from-brand-200 to-brand-400" style={{ height: `${h}%` }} />
        ))}
      </div>
    )
  }
  if (kind === 'list') {
    return (
      <div className="space-y-0.5">
        {[1, 0].map((done, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className={`h-2 w-2 shrink-0 rounded-[3px] ${done ? 'bg-mint-400' : 'border border-line bg-card'}`} />
            <span className={`h-1 flex-1 rounded-full ${done ? 'bg-sage-200' : 'bg-sage-100'}`} />
          </div>
        ))}
      </div>
    )
  }
  if (kind === 'bar') {
    return (
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-sage-100">
        <span className="block h-full w-3/4 rounded-full bg-gradient-to-r from-brand-300 to-brand-500" />
      </div>
    )
  }
  // flow — three nodes joined by lines
  return (
    <div className="flex items-center gap-1">
      <span className="h-2.5 w-2.5 rounded-full bg-brand-300" />
      <span className="h-px flex-1 bg-line-strong" />
      <span className="h-2.5 w-2.5 rounded-full bg-sky2-400" />
      <span className="h-px flex-1 bg-line-strong" />
      <span className="h-2.5 w-2.5 rounded-full bg-mint-400" />
    </div>
  )
}

// ── Pulsing green glow behind Byte ───────────────────────────────────────────
function Glow({ reduce, className = '' }) {
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute rounded-full bg-lime-400/30 blur-2xl ${className}`}
      animate={reduce ? {} : { scale: [1, 1.18, 1], opacity: [0.35, 0.6, 0.35] }}
      transition={reduce ? {} : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ willChange: 'transform, opacity' }}
    />
  )
}

// ── Speech bubble (only on click) ────────────────────────────────────────────
function SpeechBubble({ message, onClose, placement = 'top' }) {
  const isTop = placement === 'top'
  return (
    <motion.div
      key={message}
      initial={{ opacity: 0, y: isTop ? 8 : -8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: 'spring', damping: 20, stiffness: 280 }}
      onClick={(e) => { e.stopPropagation(); onClose() }}
      className={`absolute z-40 cursor-pointer ${isTop ? 'bottom-full mb-3' : 'top-full mt-3'} left-1/2 w-56 max-w-[15rem] -translate-x-1/2 rounded-2xl border border-brand-200 bg-card px-4 py-3 text-center shadow-lift`}
    >
      <p className="text-sm font-medium leading-snug text-ink-800">{message}</p>
      <span
        className={`absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-brand-200 bg-card ${
          isTop ? 'top-full -mt-1.5 border-b border-r' : 'bottom-full -mb-1.5 border-l border-t'
        }`}
      />
    </motion.div>
  )
}

// Shared: the clickable mascot image with its breathing idle + glow + bubble.
function Stage({ src, alt, reduce, idle, onPoke, open, message, onClose, bubble = 'top', glowClass }) {
  return (
    <div className="relative">
      <Glow reduce={reduce} className={glowClass} />
      <AnimatePresence>
        {open && bubble !== false && (
          <SpeechBubble message={message} onClose={onClose} placement={bubble} />
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={onPoke}
        aria-label="Talk to Capy and Byte"
        className="relative z-10 block w-full cursor-pointer rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60"
        whileTap={reduce ? undefined : { scale: 0.97 }}
        {...idle}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="pointer-events-none block w-full select-none"
        />
      </motion.button>
    </div>
  )
}

export default function MascotAdvisor({ mode = 'hero', className = '' }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * MESSAGES.length))
  const [expanded, setExpanded] = useState(false)

  const poke = () => {
    if (open) setIdx((i) => (i + 1) % MESSAGES.length)
    else setOpen(true)
  }
  const message = MESSAGES[idx]

  // Idle: uniform breathe + tiny bob/tilt. Non-distorting; disabled if reduced.
  const breathe = reduce
    ? {}
    : {
        animate: { scale: [1, 1.015, 1], y: [0, -4, 0], rotate: [0, 0.5, 0, -0.5, 0] },
        transition: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
      }
  const celebrate = reduce
    ? {}
    : {
        animate: { y: [0, -12, 0, -5, 0], rotate: [0, -3, 3, -1.5, 0] },
        transition: { duration: 1.2, repeat: Infinity, repeatDelay: 0.4, ease: 'easeInOut' },
      }

  // ── MINI: floating circular advisor, bottom-right. Minimized until clicked. ─
  if (mode === 'mini') {
    return (
      <div className={`fixed bottom-5 right-5 z-40 print:hidden ${className}`}>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.92 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
              className="absolute bottom-full right-0 mb-3 w-72 max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-3xl border border-brand-200 bg-card p-4 shadow-lift"
            >
              <button
                onClick={() => setExpanded(false)}
                aria-label="Minimize advisor"
                className="absolute right-2 top-2 z-30 grid h-7 w-7 place-items-center rounded-full text-faint transition hover:bg-sage-50 hover:text-ink-700"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
                <Sparkles className="h-3.5 w-3.5" /> Capy &amp; Byte
              </p>
              <div className="relative">
                <Glow reduce={reduce} className="inset-x-6 bottom-0 top-6 opacity-80" />
                <motion.img
                  src={DUO}
                  alt="Capy and Byte, your advisors"
                  draggable={false}
                  className="relative z-10 mx-auto block w-44 select-none"
                  {...breathe}
                />
              </div>
              <p className="relative z-10 mt-1 text-center text-sm font-medium leading-snug text-ink-800">{message}</p>
              <button onClick={() => setIdx((i) => (i + 1) % MESSAGES.length)} className="mx-auto mt-3 block rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100">
                Tell me again →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Minimize advisor' : 'Open Capy & Byte advisor'}
          aria-expanded={expanded}
          className="relative grid h-14 w-14 place-items-center rounded-full border border-brand-200 bg-card shadow-lift outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60"
          whileHover={reduce ? undefined : { scale: 1.06 }}
          whileTap={reduce ? undefined : { scale: 0.94 }}
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-lime-400/40 blur-md"
            animate={reduce ? {} : { scale: [1, 1.25, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={reduce ? {} : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.img
            src={BYTE}
            alt=""
            draggable={false}
            className="relative z-10 h-11 w-11 select-none object-contain"
            animate={reduce || expanded ? {} : { y: [0, -2, 0] }}
            transition={reduce ? {} : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          {!expanded && (
            <span aria-hidden className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-card bg-brand-500" />
          )}
        </motion.button>
      </div>
    )
  }

  // ── SUCCESS: celebratory duo for completion moments. ────────────────────────
  if (mode === 'success') {
    return (
      <div className={`relative mx-auto w-60 max-w-full ${className}`}>
        <Glow reduce={reduce} className="inset-x-8 bottom-2 top-8" />
        <motion.img
          src={DUO}
          alt="Capy and Byte celebrating"
          draggable={false}
          className="relative z-10 block w-full select-none"
          {...celebrate}
        />
      </div>
    )
  }

  // ── LESSON: compact Byte advisor for lesson intros / "Byte says" tips. ───────
  if (mode === 'lesson') {
    return (
      <div className={`relative w-20 shrink-0 sm:w-24 ${className}`}>
        <Glow reduce={reduce} className="inset-x-2 bottom-0 top-3 opacity-80" />
        <motion.img src={BYTE} alt="Byte, your lesson guide" draggable={false} className="relative z-10 block w-full select-none" {...breathe} />
      </div>
    )
  }

  // ── EMPTY: calm duo for "nothing here yet" states. ──────────────────────────
  if (mode === 'empty') {
    return (
      <div className={`relative mx-auto w-52 max-w-full ${className}`}>
        <Glow reduce={reduce} className="inset-x-6 bottom-2 top-8" />
        <motion.img src={DUO} alt="Capy and Byte" draggable={false} className="relative z-10 block w-full select-none" {...breathe} />
      </div>
    )
  }

  // ── HERO: full treatment — glow + floating cards + speech bubble. ───────────
  // Lives INSIDE the hero card (not fixed, not sticky).
  return (
    <div className={`relative mx-auto w-full max-w-[23rem] ${className}`}>
      {!reduce && CARDS.map((c) => <HoloCard key={c.key} card={c} reduce={reduce} />)}
      {reduce && CARDS.slice(0, 2).map((c) => <HoloCard key={c.key} card={c} reduce />)}
      <Stage
        src={DUO}
        alt="Capy lounging while Byte handles the busywork"
        reduce={reduce}
        idle={breathe}
        onPoke={poke}
        open={open}
        message={message}
        onClose={() => setOpen(false)}
        bubble="top"
        glowClass="inset-x-10 bottom-4 top-10"
      />
    </div>
  )
}
