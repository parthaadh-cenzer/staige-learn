import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { tone as toneOf } from '../lib/tones'

// Circular progress ring ----------------------------------------------------
export function ProgressRing({ value = 0, size = 120, stroke = 10, tone = 'brand', children }) {
  const t = toneOf(tone)
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  const gid = `ring-${tone}`
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" className={t.text} />
            <stop offset="100%" stopColor="currentColor" className={t.text} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} stroke={`url(#${gid})`} strokeWidth={stroke}
          fill="none" strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}

// Linear progress bar --------------------------------------------------------
export function ProgressBar({ value = 0, tone = 'brand', className = '' }) {
  const t = toneOf(tone)
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-sage-200 ${className}`}>
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${t.grad}`}
        initial={{ width: 0 }} animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  )
}

// Lightweight confetti celebration (canvas) ---------------------------------
// Fires ONCE on each false→true edge of `fire`: pieces fall from the top,
// fade out while falling, finish in ~3.4s, then the canvas clears and unmounts.
// Never loops, never leaves frozen pieces on screen.
const CONFETTI_MS = 3400
export function Confetti({ fire }) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)
  const prev = useRef(false)

  // Start a run only when `fire` rises from false to true.
  useEffect(() => {
    if (fire && !prev.current) setActive(true)
    prev.current = fire
  }, [fire])

  useEffect(() => {
    if (!active) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = (canvas.width = window.innerWidth)
    const H = (canvas.height = window.innerHeight)
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const colors = ['#5CA13A', '#84C53F', '#2FA882', '#E6B23E', '#D08763', '#9BCD80']
    const pieces = Array.from({ length: 140 }, () => ({
      x: Math.random() * W,
      y: -20 - Math.random() * H * 0.6, // staggered above the top → rains in
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3,
      size: 5 + Math.random() * 7,
      color: colors[(Math.random() * colors.length) | 0],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.25,
    }))
    let raf
    const start = performance.now()
    const tick = (now) => {
      const elapsed = now - start
      const prog = Math.min(1, elapsed / CONFETTI_MS)
      const fade = prog < 0.6 ? 1 : Math.max(0, 1 - (prog - 0.6) / 0.4) // fade in final 40%
      ctx.clearRect(0, 0, W, H)
      pieces.forEach((p) => {
        p.vy += 0.16
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        if (p.y > H + 40) return
        ctx.save()
        ctx.globalAlpha = fade
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      })
      if (elapsed < CONFETTI_MS) raf = requestAnimationFrame(tick)
      else { ctx.clearRect(0, 0, W, H); setActive(false) } // done → clear + unmount
    }
    // Reduced motion: skip the falling loop entirely.
    if (reduce) { setActive(false); return }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); ctx.clearRect(0, 0, W, H) }
  }, [active])

  if (!active) return null
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[100]" />
}

// Animated reveal wrapper ----------------------------------------------------
export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// Saved indicator chip -------------------------------------------------------
export function SavedChip({ show }) {
  if (!show) return null
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      className="pill border-mint-400/30 bg-mint-500/10 text-mint-400"
    >
      Saved
    </motion.span>
  )
}
