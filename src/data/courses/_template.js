// ============================================================================
//  COURSE TEMPLATE  ·  copy this file to create a new course
//
//  HOW TO ADD A NEW COURSE
//  1. Duplicate this file → src/data/courses/my-new-course.js
//  2. Edit the fields below (slug, title, modules, lessons, resources…)
//  3. Register it in src/data/courses/index.js (add to the `courses` array)
//  4. Done — it shows up in the Launchpad switcher automatically.
//
//  RULES OF THUMB
//  • IDs must be GLOBALLY UNIQUE across every course (progress is keyed by id).
//    Prefix everything with your course slug, e.g. 'mkt-m1', 'mkt-m1l1'.
//    This prefix IS the progress isolation — see README "Progress isolation".
//  • Set status:'active' only when the course is fully built. 'coming-soon'
//    courses appear in the switcher but are disabled (not clickable).
//  • Lesson content uses the same typed-block model as course 1 — see
//    src/data/course.js and src/components/Blocks.jsx for every block type.
//
//  WORKED EXAMPLES — copy the one closest to what you're building:
//  • `ai-marketing-os.js` + `src/data/marketing/` — skips ideas/calendar/
//    challenge, adds checklists + downloads, `bytelab` missions, finalChallenge.
//  • `ai-job-hunter-os.js` + `src/data/jobhunter/` — adds XP + named
//    achievements, and the module-end sequence (AI Templates → Downloads →
//    Byte Summary → Module Unlocked).
// ============================================================================

const course = {
  // ── Identity ──────────────────────────────────────────────────────────────
  id: 'cX',                       // any unique short id — must not clash
  slug: 'my-new-course',          // URL-safe; becomes /launchpad/my-new-course
                                  // (and /course/my-new automatically)
  title: 'My New Course',
  subtitle: 'One-line promise of the outcome.',  // ← the homepage uses this as
                                  // the promise. Don't add a second field for it.
  description: 'A short paragraph describing who this is for and what they get.',
  status: 'coming-soon',          // 'active' | 'coming-soon' | 'locked'

  // ── Homepage metadata ─────────────────────────────────────────────────────
  // The homepage (src/pages/Home.jsx) is entirely derived from these. It never
  // names a course, so filling these in is all that's needed to appear on it.
  // featured: true,              // the hero + ⭐ Featured This Week. ONE course only.
  lastUpdated: '2026-01-01',      // YYYY-MM-DD — drives 🆕 Recently Updated order
  skillLevel: 'Beginner',         // 'Beginner' | 'Beginner → Intermediate' | …
  art: { emoji: '🚀', tone: 'brand' },   // the derived cover — see CourseArt.jsx
  collections: ['business'],      // 'career' | 'business' — which rows it shows in
  // goal: { emoji: '💰', label: 'Earn Extra Income', order: 1 },  // its goal card

  // ── Presentation ──────────────────────────────────────────────────────────
  themeAccent: 'brand',           // tone key from src/lib/tones.js
  mascotMode: 'capy-byte',        // mascot system (Capy + Byte) — keep as-is for now

  // ── Per-page headings (data-driven copy). Safe to leave as defaults. ──────
  //    `title`/`blurb` head the page; optional `nav` overrides the sidebar label.
  ui: {
    dashboard: {
      eyebrow: 'My New Course',
      heroTitle: 'Let’s build your',      // rendered solid…
      heroAccent: 'first thing',          // …with this word in brand green
      blurb: {
        start: 'What the learner gets, before they’ve started.',
        mid: 'You’re {pct}% through. A nudge to keep going.',
        done: 'Finished. What to do with it now.',
      },
      meet: 'The first-run “Meet Capy & Byte” card copy.',
      // Bonus cards on the dashboard. `sub` is a course-relative route and
      // `icon` is any lucide-react icon name.
      bonuses: [
        // { sub: 'prompts', label: 'Prompt Library', desc: '…', icon: 'Library', tone: 'flamingo' },
      ],
    },
    modules: { title: 'The curriculum', blurb: 'What this course covers.' },
    prompts: { title: 'Prompt Library', blurb: 'Handy prompts for this course.' },
    ideas: { title: 'Ideas', blurb: 'A shortlist to pick from.' },
    calendar: { title: 'Content Calendar', blurb: 'A month of posting prompts.' },
    vault: { title: 'Resource Vault', blurb: 'Curated tools and links.' },
    checklists: { title: 'Checklists', blurb: 'Tick-off lists that persist.' },
    downloads: { title: 'Download Center', blurb: 'Templates to fill in.' },
    challenge: { title: 'The Challenge', blurb: 'Ship something this week.' },
    badges: { title: 'Achievements', blurb: 'Proof of the work you did.' },
  },

  // ── "Read this first" welcome screen (typed blocks). ──────────────────────
  intro: {
    id: 'welcome',
    title: 'Read this first',
    subtitle: 'The quick orientation before you start.',
    blocks: [
      { t: 'p', lead: true, text: 'Replace this with your course intro.' },
    ],
  },

  // ── Modules → Lessons → typed blocks. The heart of the course. ────────────
  modules: [
    {
      id: 'cX-m1',                // unique
      num: 1,
      title: 'Module One Title',
      subtitle: 'What this module gets done.',
      emoji: '🚀',
      color: 'brand',            // tone key
      // Optional: give this module's badge a real achievement name instead of
      // the derived "Module One Title ✓".
      // badge: { emoji: '🏅', title: 'Achievement Name', desc: 'What you built' },
      lessons: [
        {
          id: 'cX-m1l1',         // unique
          title: 'First Lesson',
          subtitle: 'One-line summary.',
          minutes: 5,            // shown as "Est. 5 min" on the lesson + module list
          xp: 50,                // only if features.xp — 50 short / 75 standard /
                                 // 100 heavy / 150 module challenge
          blocks: [
            { t: 'p', lead: true, text: 'Write the first lesson here.' },
            { t: 'h', text: 'A subheading' },
            { t: 'list', icon: 'check', items: ['Point one', 'Point two'] },
            { t: 'bot', text: 'A note from Byte.' },
          ],
        },
      ],
    },
  ],

  // ── Bonus content. Leave arrays empty if a course doesn't use a section; ──
  //    set the matching `features` flag to false to hide it from the sidebar. ─
  prompts: {
    items: [/* { id: 1, category: 'cat1', text: '…' } */],
    categories: [/* { id: 'cat1', name: 'Category', icon: 'Sparkles', tone: 'brand' } */],
  },
  ideas: {
    items: [/* { id: 'cX-i1', name: 'Idea', category: 'cat1' } */],
    categories: [/* { id: 'cat1', name: 'Category', tone: 'brand', path: 'A' } */],
  },
  resources: {
    // Add `pricing: 'Free'|'Freemium'|'Paid'` + `bestFor` and the Vault grows a
    // pricing filter and a richer card. Omit `url` → the card renders without a
    // link rather than a dead one.
    items: [/* { name: 'Tool', url: 'https://…', category: 'cat1', best: '…', why: '…' } */],
    categories: [/* { id: 'cat1', name: 'Category', icon: 'Wrench', tone: 'sky2' } */],
    stacks: [/* { id, name, tone, cost, purpose, tools: [], note } */],
  },
  // Interactive checklists (features.checklists). Ticks persist by `id`.
  checklists: {
    items: [/* { id: 'cX-cl-1', name, subtitle, group: 'g1', tone, icon, items: [] } */],
    groups: [/* { id: 'g1', name: 'Group', tone: 'brand' } */],
  },
  // Download Center (features.downloads). Each item carries its real structure;
  // the page generates the file from it. See src/data/marketing/downloads.js.
  downloads: {
    items: [/* { id, title, description, type, moduleId, moduleLabel, icon, tone, sections: [] } */],
  },
  calendar: {
    weeklyStructure: [/* { day: 'Mon', theme: 'Theme', example: '…', tone: 'brand' } */],
    thirtyDays: [/* { day: 1, theme: 'Theme', prompt: '…', tone: 'brand' } */],
  },
  challenge: {
    days: [/* { day: 1, title: '…', brief: '…', emoji: '🔥', tone: 'brand', fields: [] } */],
    finalReflection: [/* 'A yes/no reflection question' */],
  },
  badges: {
    // Module badges are auto-derived from `modules`. Add milestone badges here.
    // Each milestone has a test(ctx) where ctx = { completed, progress, challengeDone }.
    // `completed` is the GLOBAL list shared by every course; `progress` is scoped
    // to this one. Test `progress` (or an explicit prefixed id) — never
    // `completed.length`, which counts other courses' lessons.
    milestone: [
      // { id: 'cX-firststep', type: 'milestone', emoji: '👣', title: 'First Step',
      //   desc: 'Completed your first lesson', tone: 'mint', test: (s) => s.progress > 0 },
    ],
  },

  // Courses with `features.challenge: false` can spotlight their closing lesson
  // on the dashboard instead of the 7-day challenge card.
  // finalChallenge: { title, blurb, moduleId, lessonId, emoji, tone },

  progress: { trackBy: 'lessons' },

  // Toggle which bonus areas appear in this course's sidebar.
  // `xp: true` turns on the XP system (needs `xp` on every lesson).
  features: {
    prompts: false, ideas: false, calendar: false, vault: false,
    checklists: false, downloads: false, challenge: false, badges: false,
    xp: false,
  },
}

export default course
