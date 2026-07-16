import { modules } from './course'

// Badges are earned by completing each module, plus milestone badges.
export const moduleBadges = modules.map((m) => ({
  id: `badge-${m.id}`,
  type: 'module',
  moduleId: m.id,
  emoji: m.emoji,
  title: `${m.title} ✓`,
  desc: `Completed Module ${m.num}`,
  tone: m.color,
}))

export const milestoneBadges = [
  // Tests read `progress` (already scoped to this course) rather than the raw
  // `completed` list, which is shared across every course in the Launchpad —
  // counting it directly would award this badge for another course's lesson.
  { id: 'badge-firststep', type: 'milestone', emoji: '👣', title: 'First Step', desc: 'Completed your first lesson', tone: 'mint', test: (s) => s.progress > 0 },
  { id: 'badge-halfway', type: 'milestone', emoji: '🌗', title: 'Halfway Hero', desc: 'Reached 50% course progress', tone: 'sun', test: (s) => s.progress >= 50 },
  { id: 'badge-graduate', type: 'milestone', emoji: '🎓', title: 'OS Graduate', desc: 'Completed every lesson', tone: 'brand', test: (s) => s.progress >= 100 },
  { id: 'badge-challenger', type: 'milestone', emoji: '🔥', title: 'The Challenger', desc: 'Finished the 7-Day Challenge', tone: 'flamingo', test: (s) => s.challengeDone >= 7 },
]
