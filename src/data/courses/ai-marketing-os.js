// ============================================================================
//  COURSE 2 · AI Marketing OS
//  Assembles the content in src/data/marketing/ into one course object for the
//  Launchpad engine — the same shape AI Side Hustle OS uses. Nothing here is
//  bespoke UI: every page, block and progress helper is the shared system.
//
//  Independent progress: every id in src/data/marketing/* is prefixed `mkt-`.
//  The store keeps one flat list of completed lesson ids across all courses,
//  and `courseProgress()` only counts ids belonging to this course — so this
//  course's progress can never touch AI Side Hustle OS's.
// ============================================================================
import { intro, modules } from '../marketing/course'
import { prompts, promptCategories } from '../marketing/prompts'
import { tools, toolCategories, toolStacks } from '../marketing/tools'
import { checklists, checklistGroups } from '../marketing/checklists'
import { downloads } from '../marketing/downloads'
import { milestoneBadges } from '../marketing/badges'

const course = {
  // ── Identity ──────────────────────────────────────────────────────────────
  id: 'c2',
  slug: 'ai-marketing-os',              // URL: /launchpad/ai-marketing-os
  title: 'AI Marketing OS',
  subtitle: 'Turn AI into an always-on marketing engine for your business.',
  description:
    'Eight modules that turn marketing from a scramble into a system — content, ' +
    'design, video, social, email, analytics and automation, with Capy & Byte ' +
    'solving one real problem per lesson.',
  status: 'active',

  // ── Homepage metadata (see data/courses/index.js) ─────────────────────────
  lastUpdated: '2026-07-14',
  skillLevel: 'Beginner → Intermediate',
  art: { emoji: '📣', tone: 'flamingo' },
  goal: { emoji: '📈', label: 'Grow Your Business', order: 3 },
  collections: ['business'],

  // ── Sales page (see pages/OsSalesPage.jsx + course/sales.js) ──────────────
  sales: {
    hero: {
      headline: 'Turn AI into your\nmarketing department.',
      sub: 'Content, design, email, social, analytics and automation — one always-on system that runs weekly, instead of a scramble that eats your week.',
    },
    problems: [
      { icon: 'Clock', title: 'Content takes forever', text: 'Every post starts from a blank page, and the blank page always wins.' },
      { icon: 'Repeat', title: 'No consistency', text: 'You post for a week, go quiet for a month, and the momentum resets every time.' },
      { icon: 'Bot', title: 'No automation', text: 'You’re doing by hand what a workflow should do for you — so it never scales past you.' },
    ],
    builds: [
      'A repeatable content engine',
      'A reusable prompt library',
      'A campaign workflow',
      'Your own AI marketing stack',
      'Marketing SOPs you run weekly',
    ],
    audience: {
      yes: ['Founders & solo business owners', 'Freelancers and consultants', 'Marketers who want leverage', 'Creators growing an audience', 'Small teams with no marketing hire'],
      no: ['You want followers overnight', 'You won’t publish anything', 'You expect AI to run the business for you'],
    },
    faq: [
      { q: 'Do I need design or marketing experience?', a: 'No. It’s built for beginner to intermediate — every lesson brings one real marketing problem and the exact workflow to solve it.' },
      { q: 'Which AI tools do I need to buy?', a: 'Start with the free Starter Stack. Byte’s tool library is organised by workflow, and you only add a paid tool when a real limit forces it — never “just in case.”' },
    ],
    finalCta: {
      headline: 'Ready to make marketing a system?',
      sub: 'Stop scrambling for content. Build the engine that runs every week.',
    },
  },

  // ── Presentation ──────────────────────────────────────────────────────────
  themeAccent: 'brand',
  mascotMode: 'capy-byte',

  // ── Per-page copy (data-driven headings; `nav` overrides the sidebar label) ─
  ui: {
    dashboard: {
      eyebrow: 'AI Marketing OS',
      heroTitle: 'Let’s build your',
      heroAccent: 'marketing system',
      blurb: {
        start: 'Every lesson solves one real marketing problem — not one more AI tool. Capy brings the problems, Byte brings the workflow.',
        mid: 'You’re {pct}% through. The marketers who win aren’t the ones who post most — they’re the ones with a system.',
        done: 'Every lesson done. You have an operating system now — go run it. 🚀',
      },
      meet: 'Capy’s the marketer — that’s you. Byte’s your AI teammate. Capy brings a real marketing problem to every lesson; Byte shows you the workflow that kills it. Start with the two-minute orientation.',
      // The Bonus Resource Center, as it appears on the dashboard.
      bonuses: [
        { sub: 'prompts', label: 'Prompt Vault', desc: '20 marketing prompts', icon: 'Library', tone: 'flamingo' },
        { sub: 'vault', label: 'AI Marketing Tools', desc: 'By workflow, with stacks', icon: 'Wrench', tone: 'sky2' },
        { sub: 'checklists', label: 'Checklists', desc: '10 you’ll actually use', icon: 'ListChecks', tone: 'mint' },
        { sub: 'downloads', label: 'Download Center', desc: 'Templates & the Blueprint', icon: 'Download', tone: 'sun' },
      ],
    },
    modules: {
      title: 'The curriculum',
      blurb: 'Eight modules from “I don’t know where to start” to a marketing system that runs weekly. Go in order — each module assumes the last one.',
    },
    prompts: {
      nav: 'Prompt Vault',
      title: 'Marketing OS Prompt Vault',
      blurb: 'Twenty prompts that replace whole afternoons. Filter by what you’re trying to do, copy, paste, edit the bracketed bits.',
    },
    vault: {
      nav: 'AI Marketing Tools',
      title: 'Favorite AI Marketing Tools',
      blurb: 'Byte’s tool library, organised by workflow — not by vendor. You don’t need all of them. Start with the Starter Stack and add only what a limit forces.',
    },
    checklists: {
      nav: 'Checklists',
      title: 'Marketing Checklists',
      blurb: 'The ten checklists marketers actually use. Tick them off — your progress saves as you go.',
    },
    downloads: {
      nav: 'Download Center',
      title: 'Download Center',
      blurb: 'The templates that make the system repeatable. Preview any of them here, then download a copy to fill in.',
      futureUpdates:
        'Marketing tools change every few months — the workflow doesn’t. When a tool in the library gets replaced ' +
        'by something better, or a new prompt earns its place in the Vault, it lands here and in your course ' +
        'automatically. Nothing to re-buy, nothing to re-download.',
    },
    badges: {
      title: 'Achievements',
      blurb: 'Each one is proof you built something — not that you watched something.',
    },
  },

  // ── Content ───────────────────────────────────────────────────────────────
  intro,
  modules,
  prompts: { items: prompts, categories: promptCategories },
  ideas: { items: [], categories: [] },
  resources: { items: tools, categories: toolCategories, stacks: toolStacks },
  checklists: { items: checklists, groups: checklistGroups },
  downloads: { items: downloads },
  calendar: { weeklyStructure: [], thirtyDays: [] },
  challenge: { days: [], finalReflection: [] },
  badges: { milestone: milestoneBadges },

  // The dashboard spotlight for courses without a multi-day challenge: points
  // at the course's closing challenge lesson instead.
  finalChallenge: {
    title: 'Final Challenge',
    blurb: 'Build your complete AI Marketing Operating System — the whole course on one page.',
    moduleId: 'mkt-m8',
    lessonId: 'mkt-m8l7',
    emoji: '⚙️',
    tone: 'brand',
  },

  progress: { trackBy: 'lessons' },

  // Bonus areas this course exposes in the sidebar.
  features: {
    prompts: true, ideas: false, calendar: false, vault: true,
    checklists: true, downloads: true, challenge: false, badges: true,
  },
}

export default course
