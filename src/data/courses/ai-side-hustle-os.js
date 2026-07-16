// ============================================================================
//  COURSE 1 · AI Side Hustle OS
//  This is the flagship, fully-built course. It simply ASSEMBLES the existing
//  content modules (src/data/course.js, prompts.js, etc.) into one course
//  object that the engine reads. Nothing about the original content changed.
//
//  To create a NEW course, copy `_template.js` (NOT this file) — it has the same
//  shape with inline comments and placeholder content.
// ============================================================================
import { intro, modules } from '../course'
import { prompts, promptCategories } from '../prompts'
import { hustles, hustleCategories } from '../hustles'
import { resources, resourceCategories } from '../resources'
import { weeklyStructure, thirtyDays } from '../calendar'
import { challengeDays, finalReflection } from '../challenge'
import { milestoneBadges } from '../badges'

const course = {
  // ── Identity ──────────────────────────────────────────────────────────────
  id: 'c1',
  slug: 'ai-side-hustle-os',           // URL: /launchpad/ai-side-hustle-os
  title: 'AI Side Hustle OS',
  subtitle: 'Go from “I want to start something” to “I launched something.”',
  description:
    'A practical, interactive workbook that takes you from idea to your first ' +
    'paying customer — with Capy & Byte guiding every step.',
  status: 'active',                    // 'active' | 'coming-soon' | 'locked'

  // ── Homepage metadata (see data/courses/index.js) ─────────────────────────
  lastUpdated: '2026-06-25',
  skillLevel: 'Beginner',
  art: { emoji: '🚀', tone: 'brand' },
  goal: { emoji: '💰', label: 'Earn Extra Income', order: 1 },
  collections: ['business'],

  // ── Presentation ──────────────────────────────────────────────────────────
  themeAccent: 'brand',                // tone key from src/lib/tones.js (green)
  mascotMode: 'capy-byte',             // which mascot system to use (Capy + Byte)

  // ── Per-page copy (so headings are data-driven, not hardcoded) ────────────
  ui: {
    dashboard: {
      eyebrow: 'AI Side Hustle OS Lite',
      heroTitle: 'Let’s build your',
      heroAccent: 'first income stream',
      blurb: {
        start: 'Go from “I want to start something” to “I launched something.” Capy and Byte will guide you the whole way.',
        mid: 'You’re {pct}% through. The people who win are the ones who keep showing up.',
        done: 'You finished every lesson. Now it’s all about shipping. 🚀',
      },
      // The bonus cards on the dashboard. Each `sub` is a course-relative route.
      bonuses: [
        { sub: 'prompts', label: '100 AI Prompts', desc: 'Searchable, by outcome', icon: 'Library', tone: 'flamingo' },
        { sub: 'ideas', label: '50 Hustle Ideas', desc: 'Filter by path', icon: 'Lightbulb', tone: 'brand' },
        { sub: 'calendar', label: '30-Day Calendar', desc: 'Never ask “what to post”', icon: 'CalendarDays', tone: 'sun' },
        { sub: 'vault', label: 'Resource Vault', desc: 'Every tool you’ll need', icon: 'Vault', tone: 'sky2' },
      ],
    },
    modules: {
      title: 'The curriculum',
      blurb: 'Six modules from idea to your first customer. Capy does the work; Byte handles the AI. Go in order — or jump to what you need.',
    },
    prompts: {
      title: 'Prompt Library',
      blurb: 'Byte’s 100 favorite prompts — organized by outcome, not by “act as a marketer.” Search, filter, copy, go.',
    },
    ideas: {
      title: '50 Side Hustle Ideas',
      blurb: 'Capy’s rule: don’t read all 50. Filter, find one that fits your path, and star it.',
    },
    calendar: {
      title: '30-Day Content Calendar',
      blurb: 'Most people fail because every day starts with “what should I post?” Here’s your answer — for a month.',
    },
    vault: {
      title: 'Resource Vault',
      blurb: 'Byte’s curated tools, platforms, and communities. You don’t need them all — start with what moves you forward today.',
    },
    challenge: {
      title: 'The 7-Day Challenge',
      blurb: 'Capy’s done the lessons — now you both ship. No overthinking. Just action.',
    },
    badges: {
      title: 'Achievements',
      blurb: 'Each one is proof Capy did the work — not just watched another video.',
    },
  },

  // ── Content (the engine reads these) ──────────────────────────────────────
  intro,                                       // "Read this first" welcome
  modules,                                     // [{ id, num, title, lessons:[…] }]
  prompts: { items: prompts, categories: promptCategories },
  ideas: { items: hustles, categories: hustleCategories },
  resources: { items: resources, categories: resourceCategories },
  calendar: { weeklyStructure, thirtyDays },
  challenge: { days: challengeDays, finalReflection },
  badges: { milestone: milestoneBadges },      // module badges are auto-derived

  // ── Progress config ───────────────────────────────────────────────────────
  // Progress is computed from completed lesson ids (stored in localStorage).
  // `trackBy: 'lessons'` → % = completed lessons / total lessons in this course.
  progress: { trackBy: 'lessons' },

  // Bonus areas this course exposes in the sidebar (others can omit these).
  features: {
    prompts: true, ideas: true, calendar: true, vault: true,
    checklists: false, downloads: false, challenge: true, badges: true,
  },
}

export default course
