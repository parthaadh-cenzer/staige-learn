import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'
import { Confetti } from './ui'
import { ByteCelebrate } from './mascots'
import MascotAdvisor from './MascotAdvisor'
import { tone as toneOf } from '../lib/tones'

export const LESSON_CHEERS = [
  'Boom. One lesson down. Future you is grinning.',
  'That’s momentum. The internet rewards exactly this.',
  'Progress beats perfection — and you just made progress.',
  'Look at you, actually doing the work. Rare. Keep going.',
  'Another brick laid. Businesses are built like this.',
  'Done beats perfect. You’re building the “done” habit.',
]

export function cheer(i = 0) {
  return LESSON_CHEERS[i % LESSON_CHEERS.length]
}

// `big` shows the full Capy & Byte success scene (module/challenge completion).
// `xp` (optional) shows the XP the lesson just awarded — courses that don't use
// XP simply omit it and the chip never renders.
export default function Celebration({ open, onClose, title, subtitle, emoji = '🎉', tone = 'brand', cta = 'Keep going', big = false, xp = 0 }) {
  const t = toneOf(tone)
  return (
    <AnimatePresence>
      {open && (
        <>
          <Confetti fire={open} />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[90] grid place-items-center bg-ink-900/40 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 18, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className={`card w-full ${big ? 'max-w-lg' : 'max-w-md'} overflow-hidden border ${t.border} p-8 text-center`}
            >
              {big ? (
                <MascotAdvisor mode="success" className="mb-2" />
              ) : (
                <div className="mx-auto mb-1 w-fit"><ByteCelebrate width={96} /></div>
              )}
              <div className="text-5xl">{emoji}</div>
              <h2 className="mt-3 font-display text-2xl font-extrabold text-ink-900">{title}</h2>
              {xp > 0 && (
                <motion.p
                  initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: 'spring', damping: 12, stiffness: 260 }}
                  className="pill mx-auto mt-3 w-fit border-gold-100 bg-gold-50 text-gold-500"
                >
                  <Zap className="h-3.5 w-3.5" /> +{xp} XP
                </motion.p>
              )}
              <p className="mt-2 text-ink-700">{subtitle}</p>
              <button onClick={onClose} className="btn-primary mt-6 w-full justify-center">{cta}</button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
