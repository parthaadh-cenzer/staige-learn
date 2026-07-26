// Assembles the AI App Builder OS curriculum from its module files.
// Split by module range so no single file becomes unmaintainable — the course
// registry (src/data/courses/ai-app-builder-os.js) only ever imports from here.
import { intro } from './intro'
import { module1, module2, module3 } from './modules-1-3'
import { module4, module5, module6 } from './modules-4-6'
import { module7, bossBattle, module8 } from './modules-7-9'

export { intro }

export const modules = [
  module1, module2, module3, module4, module5, module6, module7,
  bossBattle,   // "Boss Battle" — one sentence, no brief
  module8,      // "Module 8 — The Capstone Challenge" + graduation
]

// Milestone badges. Module badges are derived by the registry from `badge` on
// each module; these are the extra beats worth marking. `s.progress` is scoped
// to this course, so none of these can be triggered by another course's work.
export const milestoneBadges = [
  { id: 'ab-first-launch', type: 'milestone', emoji: '🌍', title: 'Live on the Internet', desc: 'Published your first website', tone: 'brand', test: (s) => s.completed.includes('ab-m1l6') },
  { id: 'ab-halfway', type: 'milestone', emoji: '⚡', title: 'Halfway Builder', desc: 'Reached 50% of the course', tone: 'sky2', test: (s) => s.progress >= 50 },
  { id: 'ab-ai-builder', type: 'milestone', emoji: '🧠', title: 'AI Integrator', desc: 'Shipped an app with a real AI feature', tone: 'mint', test: (s) => s.completed.includes('ab-m5l6') },
  { id: 'ab-boss', type: 'milestone', emoji: '🥊', title: 'Boss Battle Cleared', desc: 'Built a product from a single sentence', tone: 'flamingo', test: (s) => s.completed.includes('ab-m8l1') },
  { id: 'ab-graduate', type: 'milestone', emoji: '🎓', title: 'AI App Builder', desc: 'Completed the capstone and graduated', tone: 'gold', test: (s) => s.progress === 100 },
]
