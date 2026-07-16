// Milestone badges for AI Marketing OS. (Module badges are derived automatically
// from the modules — see src/data/courses/index.js.)
//
// IMPORTANT: `test` receives { completed, progress, challengeDone } where
// `completed` is the GLOBAL lesson-id list shared by every course, and
// `progress` is already scoped to this course. So tests here must use either
// `progress`, or `completed.includes('mkt-…')` with an explicit id — never
// `completed.length`, which would count another course's work.
export const milestoneBadges = [
  {
    id: 'mkt-badge-firststep', type: 'milestone', emoji: '👣', title: 'First Step',
    desc: 'Started AI Marketing OS', tone: 'mint',
    test: (s) => s.progress > 0,
  },
  {
    id: 'mkt-badge-mission', type: 'milestone', emoji: '🤖', title: 'Byte’s Teammate',
    desc: 'Completed Marketing Mission #1', tone: 'brand',
    test: (s) => s.completed.includes('mkt-m1l4'),
  },
  {
    id: 'mkt-badge-halfway', type: 'milestone', emoji: '🌗', title: 'Halfway Hero',
    desc: 'Reached 50% course progress', tone: 'sun',
    test: (s) => s.progress >= 50,
  },
  {
    id: 'mkt-badge-graduate', type: 'milestone', emoji: '🎓', title: 'Marketing OS Graduate',
    desc: 'Completed every lesson', tone: 'gold',
    test: (s) => s.progress >= 100,
  },
]
