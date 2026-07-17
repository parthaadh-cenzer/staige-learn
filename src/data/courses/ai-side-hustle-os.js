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

  // ── Sales page (see pages/OsSalesPage.jsx + course/sales.js) ──────────────
  sales: {
    hero: {
      headline: 'Go from “I want to start something”\nto “I launched.”',
      sub: 'Pick a lane, shape an offer people actually want, and get to your first paying customer — one guided step at a time.',
    },
    problems: [
      { icon: 'Shuffle', title: 'Too many ideas', text: 'Twelve tabs, twelve maybes, and no way to tell which one is worth a weekend.' },
      { icon: 'Hourglass', title: 'No execution', text: 'You’ve “researched” for months. The idea is still an idea, not an offer.' },
      { icon: 'Compass', title: 'Don’t know where to begin', text: 'Everyone says “just start” — nobody says with what, or in what order.' },
    ],
    builds: [
      'A validated business idea',
      'An offer people actually want',
      'Your landing assets',
      'A concrete launch plan',
      'A first-customer workflow',
    ],
    audience: {
      yes: ['Total beginners', 'People with an idea but no plan', 'Nine-to-fivers starting on the side', 'Students and recent grads', 'Anyone who’s researched for months but never shipped'],
      no: ['You want passive income with no work', 'You won’t talk to a single customer', 'You’re looking for a get-rich-quick scheme'],
    },
    faq: [
      { q: 'Do I need an idea already?', a: 'No. Module 1 is about choosing a lane and picking an idea worth your time — you can start from a completely blank page.' },
      { q: 'Do I need money to start?', a: 'No. The whole system is built to get you a first paying customer before you spend on tools or ads. You validate first, invest later.' },
    ],
    finalCta: {
      headline: 'Ready to actually launch?',
      sub: 'Stop collecting ideas. Build the one that gets you your first paying customer.',
    },
  },

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
