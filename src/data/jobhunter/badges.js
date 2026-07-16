// ============================================================================
//  AI JOB HUNTER OS — ACHIEVEMENTS
//
//  The seven named achievements from the brief are MODULE badges — they're
//  declared on the modules themselves (`badge: {...}` in course.js) and derived
//  automatically by src/data/courses/index.js. That reuses the existing badge
//  system rather than bolting a second one alongside it:
//
//    🏅 System Builder      → Module 1     🏅 Interview Ready    → Module 5
//    🏅 Resume Master       → Module 2     🏅 Networking Builder → Module 6
//    🏅 LinkedIn Pro        → Module 3     🏅 Offer Negotiator   → Module 7
//    🏅 Search Strategist   → Module 4     🏅 Career Architect   → Module 8
//
//  Below are the MILESTONE achievements — the ones that aren't a whole module.
//
//  IMPORTANT: `test` receives { completed, progress, xp, challengeDone } where
//  `completed` is the GLOBAL lesson-id list shared by every course, while
//  `progress` and `xp` are already scoped to this course. So tests must use
//  `progress`/`xp`, or `completed.includes('jh-…')` with an explicit id —
//  never `completed.length`, which would count another course's work.
// ============================================================================
export const milestoneBadges = [
  {
    id: 'jh-badge-firststep', type: 'milestone', emoji: '👣', title: 'First Step',
    desc: 'Started AI Job Hunter OS', tone: 'mint',
    test: (s) => s.progress > 0,
  },
  {
    id: 'jh-badge-ats', type: 'milestone', emoji: '🏅', title: 'ATS Expert',
    desc: 'Learned how ATS really works', tone: 'sky2',
    test: (s) => s.completed.includes('jh-m2l2'),
  },
  {
    id: 'jh-badge-xp', type: 'milestone', emoji: '⚡', title: 'Momentum',
    desc: 'Earned 2,000 XP', tone: 'sun',
    test: (s) => s.xp >= 2000,
  },
  {
    id: 'jh-badge-halfway', type: 'milestone', emoji: '🌗', title: 'Halfway Hero',
    desc: 'Reached 50% course progress', tone: 'flamingo',
    test: (s) => s.progress >= 50,
  },
  {
    id: 'jh-badge-graduate', type: 'milestone', emoji: '🎓', title: 'Job Hunter OS Graduate',
    desc: 'Completed every lesson', tone: 'gold',
    test: (s) => s.progress >= 100,
  },
]
