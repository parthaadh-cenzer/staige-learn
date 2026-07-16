import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Rocket, Target, Wrench } from 'lucide-react'
import { useStore } from '../store/useStore'
import { CapyByteHero } from './mascots'

// Platform-level, not course-level: this is the first thing anyone sees, and
// they haven't chosen a course yet. It used to pitch AI Side Hustle OS
// specifically, which stopped being true the moment there was more than one.
const HIGHLIGHTS = [
  { icon: Target, text: 'Operating systems you keep — not courses you finish' },
  { icon: Wrench, text: 'Interactive missions that save as you type' },
  { icon: Rocket, text: 'Progress, XP and achievements, stored on your device' },
]

export default function Onboarding() {
  const finish = useStore((s) => s.finishOnboarding)
  const [name, setName] = useState('')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[120] grid place-items-center bg-ink-900/40 p-4 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
        className="card w-full max-w-lg overflow-hidden p-0"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-50 to-mint-50 px-8 pt-7 text-center">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-100/70 blur-3xl" />
          <CapyByteHero className="relative mx-auto w-64" priority />
          <h1 className="relative mt-1 font-display text-2xl font-extrabold text-ink-900">
            Welcome to ST<span className="heading-accent">AI</span>GE
          </h1>
          <p className="relative mb-6 mt-1 text-sm text-muted">Meet Capy (that’s you) and Byte, your AI teammate. Capy brings a real problem to every lesson; Byte brings the workflow that solves it.</p>
        </div>
        <div className="p-6">
          <ul className="mb-5 space-y-2.5">
            {HIGHLIGHTS.map((h, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-ink-700">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600"><h.icon className="h-4.5 w-4.5" /></span>
                {h.text}
              </li>
            ))}
          </ul>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">What should I call you? <span className="text-faint">(optional)</span></label>
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && finish(name.trim())}
            placeholder="Your first name" className="input" autoFocus
          />
          <button onClick={() => finish(name.trim())} className="btn-primary mt-4 w-full justify-center !py-3.5">
            Let’s build something <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-3 text-center text-xs text-faint">No account needed to start. Sign in whenever you want your progress on every device.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
