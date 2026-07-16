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
