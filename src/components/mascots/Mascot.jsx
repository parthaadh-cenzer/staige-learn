import { useRef } from 'react'
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { POSES } from './poses'

// Idle loops — deliberately small. Personality, not distraction.
const IDLE = {
  // Byte: gentle hover + a periodic "life" dip (reads as a blink/settle on a flat render).
  float: { animate: { y: [0, -7, 0, -3, 0], rotate: [0, 0.6, 0, -0.6, 0] }, transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } },
  // Capy: slow breathing.
  breathe: { animate: { scale: [1, 1.025, 1], y: [0, -2, 0] }, transition: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } },
  // Subtle head-tilt sway.
  sway: { animate: { rotate: [0, 1.4, 0, -1.4, 0] }, transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' } },
  // Celebration: a small bounce + wiggle.
  celebrate: { animate: { y: [0, -14, 0, -6, 0], rotate: [0, -4, 4, -2, 0] }, transition: { duration: 1.1, repeat: Infinity, repeatDelay: 0.4, ease: 'easeInOut' } },
  none: {},
}

// `width` sets a fixed px size; otherwise size via className (e.g. w-72).
export default function Mascot({
  pose = 'hero', anim = 'float', width, className = '', alt,
  hover = true, proximity = false, priority = false, flip = false,
}) {
  const reduce = useReducedMotion()
  const src = POSES[pose] || POSES.hero
  const idle = reduce ? IDLE.none : IDLE[anim] || IDLE.float

  // Cursor-proximity lean (premium micro-interaction).
  const ref = useRef(null)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 15 })
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 15 })
  const tx = useSpring(useTransform(px, [-0.5, 0.5], [-5, 5]), { stiffness: 150, damping: 15 })

  const onMove = (e) => {
    if (!proximity || reduce) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => { px.set(0); py.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block ${className}`}
      style={{ width, perspective: proximity ? 600 : undefined, rotateX: proximity ? rx : 0, rotateY: proximity ? ry : 0, x: proximity ? tx : 0, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 18, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img
        src={src}
        alt={alt || `Capy & Byte — ${pose}`}
        className="pointer-events-none block w-full select-none"
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{ willChange: 'transform', scaleX: flip ? -1 : 1 }}
        {...idle}
        whileHover={hover && !reduce ? { scale: 1.045, rotate: anim === 'breathe' ? 0 : 1 } : undefined}
      />
    </motion.div>
  )
}
