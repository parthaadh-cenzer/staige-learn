// ============================================================================
//  COURSE 3 · AI Job Hunter OS
//  Assembles src/data/jobhunter/ into one course object for the Launchpad
//  engine — the same shape AI Side Hustle OS and AI Marketing OS use. No
//  bespoke pages: every screen, block and progress helper is the shared system.
//
//  Independent progress: every id in src/data/jobhunter/* is prefixed `jh-`.
//  The store keeps one flat list of completed lesson ids across all courses and
//  `courseProgress()`/`courseXp()` only count ids belonging to this course — so
//  this course's progress can never touch another's.
//
//  New in this course (all opt-in, so other courses are unaffected):
//    • features.xp        → lessons carry `xp`; the dashboard/Badges show it
//    • module `badge`     → names the achievements ("🏅 Resume Master")
//    • downloads `kind`   → 'template' (🤖 AI Templates) vs 'download'
// ============================================================================
import { intro, modules } from '../jobhunter/course'
import { prompts, promptCategories } from '../jobhunter/prompts'
import { downloads } from '../jobhunter/resources'
import { milestoneBadges } from '../jobhunter/badges'

const course = {
  // ── Identity ──────────────────────────────────────────────────────────────
  id: 'c6',
  slug: 'ai-job-hunter-os',              // URL: /launchpad/ai-job-hunter-os
  title: 'AI Job Hunter OS',
  subtitle: 'Land better interviews. Get more offers. Let AI handle the repetitive work.',
  description:
    'Eight modules that turn a job search from a lottery into a system — resume, ' +
    'LinkedIn, search, interviews, networking, offers and the career you build ' +
    'after you’re hired. Capy brings the problem; Byte brings the workflow.',
  status: 'active',

  // ── Homepage metadata (see data/courses/index.js) ─────────────────────────
  featured: true,                        // → the hero + ⭐ Featured This Week
  lastUpdated: '2026-07-15',
  skillLevel: 'Beginner → Intermediate',
  art: { emoji: '💼', tone: 'sky2' },
  goal: { emoji: '💼', label: 'Get Hired', order: 2 },
  collections: ['career'],

  // ── Presentation ──────────────────────────────────────────────────────────
  themeAccent: 'brand',
  mascotMode: 'capy-byte',

  // ── Per-page copy (data-driven; `nav` overrides the sidebar label) ────────
  ui: {
    dashboard: {
      eyebrow: 'AI Job Hunter OS',
      heroTitle: 'Let’s build your',
      heroAccent: 'job search system',
      blurb: {
        start: 'The goal isn’t to send more applications — it’s to send better ones. Every lesson solves one real hiring problem, and you keep the system afterwards.',
        mid: 'You’re {pct}% through. Quality beats quantity — 40 targeted applications beat 250 random ones.',
        done: 'Every lesson done. You didn’t learn how to get one job — you built a system for every job after this one. 🚀',
      },
      meet: 'Capy’s the job hunter — that’s you. Byte’s your AI teammate. Capy brings a real hiring problem to every lesson; Byte shows you the workflow that solves it. Start with the two-minute orientation.',
      bonuses: [
        { sub: 'prompts', label: 'Prompt Vault', desc: '50 job search prompts', icon: 'Library', tone: 'flamingo' },
        { sub: 'downloads', label: 'Templates & Downloads', desc: 'Every module’s resources', icon: 'Download', tone: 'sky2' },
        { sub: 'badges', label: 'Achievements', desc: 'XP and badges earned', icon: 'Trophy', tone: 'gold' },
        { sub: 'modules', label: 'All Modules', desc: 'The full curriculum', icon: 'BookOpen', tone: 'brand' },
      ],
    },
    modules: {
      title: 'The curriculum',
      blurb: 'Eight modules, from “why does nobody reply?” to a career system you keep using long after you’re hired. Go in order — each module improves one stage of the hiring process.',
    },
    prompts: {
      nav: 'Prompt Vault',
      title: 'AI Job Hunter Prompt Vault',
      blurb: 'Fifty prompts for every stage of the search. Filter by what you’re trying to do, star the ones you’ll reuse, copy, paste, edit the bracketed bits.',
    },
    downloads: {
      nav: 'Templates & Downloads',
      title: 'Templates & Download Center',
      blurb: 'Every 🤖 AI Template and download from all eight modules. Preview any of them here, then take a copy to fill in.',
      futureUpdates:
        'Hiring changes — ATS vendors, LinkedIn’s ranking, what recruiters search for. The system doesn’t. ' +
        'When a template stops matching how hiring actually works, it gets updated here and in your course ' +
        'automatically. Nothing to re-buy, nothing to re-download.',
    },
    badges: {
      title: 'Achievements',
      blurb: 'Each one is proof you built a piece of the system — not that you read about it.',
    },
  },

  // ── Content ───────────────────────────────────────────────────────────────
  intro,
  modules,
  prompts: { items: prompts, categories: promptCategories },
  downloads: { items: downloads },
  // Unused sections for this course — the sidebar hides them via `features`.
  ideas: { items: [], categories: [] },
  resources: { items: [], categories: [] },
  checklists: { items: [], groups: [] },
  calendar: { weeklyStructure: [], thirtyDays: [] },
  challenge: { days: [], finalReflection: [] },
  badges: { milestone: milestoneBadges },

  // The dashboard spotlight — this course finishes on a lesson, not a 7-day challenge.
  finalChallenge: {
    title: 'Final Challenge',
    blurb: 'Build your complete AI Job Hunter OS and score every system you’ve built.',
    moduleId: 'jh-m8',
    lessonId: 'jh-m8l8',
    emoji: '🏆',
    tone: 'gold',
  },

  progress: { trackBy: 'lessons' },

  features: {
    prompts: true, ideas: false, calendar: false, vault: false,
    checklists: false, downloads: true, challenge: false, badges: true,
    xp: true,
  },
}

export default course
