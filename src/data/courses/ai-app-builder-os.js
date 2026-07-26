// ============================================================================
//  COURSE 7 · AI App Builder OS
//  Assembles src/data/appbuilder/ into one course object for the Launchpad
//  engine — the same shape every other STAIGE course uses. No bespoke LMS:
//  routing, auth, entitlement, progress, XP, badges, the lesson shell and the
//  block renderer are all the shared system.
//
//  Independent progress: every id under src/data/appbuilder/ is prefixed `ab-`.
//  The store keeps one flat list of completed lesson ids across all courses and
//  courseProgress()/courseXp() only count ids belonging to this course, so this
//  course's progress can never touch another's.
//
//  New in this course (opt-in, so other courses are unaffected):
//    • features.builderVault → the nine-page premium Builder Vault
//    • module `label`        → lets a module be called "Boss Battle" instead of
//                              "Module 8" without faking its position
//    • downloads `available` → an honest "File pending" state, and `opensTo`
//                              for resources that live in the Builder Vault
// ============================================================================
import { intro, modules, milestoneBadges } from '../appbuilder/course'
import { downloads } from '../appbuilder/downloads'
import { resources, resourceCategories } from '../appbuilder/resources'
import { launchChecklist, uiuxChecklist } from '../appbuilder/checklists'
// Integers only — importing the vault's data files here would pull ~100 kB of
// recipes, ideas and palettes into the MAIN bundle for every landing-page
// visitor, when none of it is needed until a vault page opens (which lives in
// the lazily-loaded CourseShell chunk). See src/data/appbuilder/counts.js.
import { VAULT_COUNTS } from '../appbuilder/counts'

// The two checklists arrive as {id, name, items[]} sections. The shared
// Checklists page renders one card per entry with its own progress and reset,
// which is exactly the collapsible-section behaviour both checklists need — so
// each SECTION becomes a card, and `group` keeps the two checklists apart.
const checklistItems = [
  ...launchChecklist.map((s, i) => ({
    ...s, group: 'launch', subtitle: `Launch Checklist · section ${i + 1} of ${launchChecklist.length}`,
    tone: ['brand', 'sky2', 'sun', 'mint', 'flamingo', 'gold'][i % 6], icon: 'ListChecks',
  })),
  ...uiuxChecklist.map((s, i) => ({
    ...s, group: 'uiux', subtitle: `UI/UX Checklist · section ${i + 1} of ${uiuxChecklist.length}`,
    tone: ['sky2', 'flamingo', 'brand', 'gold', 'mint', 'sun'][i % 6], icon: 'Sparkles',
  })),
]

const course = {
  // ── Identity ──────────────────────────────────────────────────────────────
  id: 'c7',
  slug: 'ai-app-builder-os',            // URL: /launchpad/ai-app-builder-os
  title: 'AI App Builder OS',
  subtitle: 'Build Websites & Apps Without Writing Code',
  description:
    'A project-based course that turns an idea into a shipped product. Eight modules, ' +
    'a Boss Battle and a capstone take you from your first published website to a ' +
    'portfolio of live apps — portfolio site, client website, productivity app, ' +
    'AI resume builder, AI study assistant and your own final project. Capy and Byte ' +
    'guide the build; the Builder Vault gives you the recipes, palettes, fonts, ' +
    'checklists and resources professionals reach for.',
  status: 'active',

  // ── Homepage metadata (see data/courses/index.js) ─────────────────────────
  lastUpdated: '2026-07-25',
  skillLevel: 'Beginner → Intermediate',
  art: { emoji: '🛠️', tone: 'sky2' },
  // `order: 5` puts this last among the "What do you want to solve?" cards, so
  // the four existing goals keep the order they already had.
  goal: { emoji: '🛠️', label: 'Build Apps & Websites', order: 5 },
  // `creator` first → the homepage groups it with AI Side Hustle OS under
  // "Creator" (see homeGroups()). It also belongs to career and business, so it
  // appears under both /courses filters.
  collections: ['creator', 'career', 'business'],

  // ── Sales page (pages/OsSalesPage.jsx + course/sales.js) ──────────────────
  sales: {
    hero: {
      headline: 'Build websites & apps.\nWithout writing code.\nShip them for real.',
      sub: 'Nine modules of building, not watching. You finish with a published portfolio site, a client website, working apps, AI-powered features and a capstone product — all live, all yours.',
    },
    problems: [
      { icon: 'Code2', title: '“I’d need to learn to code”', text: 'You start another tutorial, get three videos in, and still have nothing you can show anyone.' },
      { icon: 'FolderX', title: 'Nothing to show', text: 'You understand the ideas but have no live projects — so no client, and no employer, can tell.' },
      { icon: 'Wand2', title: 'AI builds something generic', text: 'You click Generate and get a page that looks like everyone else’s. Nobody taught you what to ask for.' },
    ],
    outcome: {
      title: 'From “I can’t code” to a portfolio of things you launched.',
      text: 'You start with an idea and finish with live URLs — websites, working web apps, AI-powered tools and a capstone product, all publicly deployed and all yours. No traditional coding experience required; your job is to think clearly and direct the build, and the course teaches you exactly how.',
    },
    // Every project the course actually produces, in the order you build them.
    builds: [
      'Personal portfolio website',
      'Business landing page',
      'Productivity app',
      'Habit tracker',
      'Expense tracker',
      'AI resume builder',
      'AI study assistant',
      'Mini SaaS dashboard',
      'Capstone project',
      'A public portfolio of everything above',
    ],
    journey: [
      { emoji: '👋', title: 'Welcome', text: 'The builder mindset, your toolkit, and why you no longer start by learning to code.' },
      { emoji: '🚀', title: 'Modules 1–7', text: 'First launch, design, client websites, real apps, AI features, polish and launch — each ending in a shipped project.' },
      { emoji: '🎯', title: 'Builder Missions', text: 'Every module closes with a mission you complete, not a video you finish. That is what produces the portfolio.' },
      { emoji: '🥊', title: 'Boss Battle', text: 'One sentence, no brief, no walkthrough. You define, design, build and launch it yourself.' },
      { emoji: '🏆', title: 'Module 8 — Capstone', text: 'Plan, build, launch and present a complete product of your own choosing.' },
      { emoji: '🎓', title: 'Graduation', text: 'The final dashboard, the graduation checklist and the kit you keep using afterwards.' },
    ],
    vault: {
      title: 'The Builder Vault',
      blurb: 'Nine premium libraries included with the course — the references and audit tools you will reach for on every project you build afterwards, not just the ones inside it.',
      items: [
        { name: 'Builder Recipes', count: '95 recipes', note: 'Complete, copy-and-paste build prompts across five collections.' },
        { name: 'Landing Page Templates', count: '20 planned', note: 'Full standard, setup and customisation guides, plus the generation prompt.' },
        { name: 'Websites to Study', count: '50 sites', note: 'What specifically to look at on each, and why.' },
        { name: 'Color Palette Library', count: '20 palettes', note: 'Five swatches each, copyable HEX, with a Best For label.' },
        { name: 'Font Pairing Library', count: '15 pairings', note: 'Live previews and a one-click Google Fonts import.' },
        { name: 'App Idea Generator', count: '90 ideas', note: 'Filter by category, difficulty and monetisation.' },
        { name: 'Launch Checklist', count: '58 checks', note: 'Nine sections, ticks saved to your account.' },
        { name: 'UI/UX Checklist', count: '67 checks', note: 'Eleven sections, including the Premium Design Test.' },
        { name: 'Resource Vault', count: '72 tools', note: 'Official links across 16 categories. Nothing redistributed.' },
      ],
      // The line that keeps this section honest.
      footnote: 'Template library and guided build resources. The landing-page template ZIPs are published and verified one at a time — the Templates page states plainly which files are ready, and no download button appears without a file behind it. Everything else listed above works in the browser today.',
    },
    // The Builder Vault has its own section above, so these are the OTHER
    // things included. Without them the derived list is a single lonely
    // "Achievements" card, because this course ships no downloadable files.
    resources: [
      { icon: 'Target', title: 'Builder Missions', text: 'Eight missions that each end in a real, deployed project — the thing that actually becomes your portfolio.' },
      { icon: 'PencilLine', title: 'Saved planning canvases', text: 'The Builder Canvas, discovery questions and founder questions save to your account as you fill them in.' },
      { icon: 'RefreshCw', title: 'Free updates', text: 'AI builders change fast. When a resource or template lands, it appears in your account — nothing to re-buy.' },
    ],
    how: [
      'Learn one concept',
      'Follow a guided build',
      'Complete the Builder Mission',
      'Improve the project',
      'Launch it publicly',
      'Add it to your portfolio',
    ],
    audience: {
      yes: [
        'Complete beginners with no coding background',
        'Students building a portfolio',
        'Freelancers who want to sell websites',
        'Marketers who need pages built without waiting on a developer',
        'Creators turning an audience into a product',
        'Small-business owners building their own site',
        'Aspiring founders who need a working prototype',
        'Anyone with an app idea and limited coding experience',
      ],
      no: ['You want to become a software engineer', 'You won’t actually build the projects', 'You expect AI to decide what to build for you'],
    },
    faq: [
      { q: 'Do I need coding experience?', a: 'No. That’s the point. You’ll use AI builders to generate the code, and your job is to think clearly, make product decisions and guide the build. If you can describe what you want precisely, you can finish this course.' },
      { q: 'Which tools will I use?', a: 'Claude for planning, architecture and debugging, plus an AI app builder of your choice — Lovable, Bolt, Replit and Cursor all work — with Vercel for publishing and GitHub optionally for saving projects. Module 1 Lesson 2 is explicit that tools change and the workflow doesn’t, so nothing here breaks when a new builder appears.' },
      { q: 'Is this a subscription?', a: 'No. It’s a single one-time payment for this Operating System, and it stays on your account. Buying one OS does not unlock the others, and there is nothing recurring to cancel.' },
      { q: 'What is included in Builder Vault?', a: 'Nine libraries: 95 Builder Recipes, the landing-page template library, 50 websites to study, 20 colour palettes, 15 font pairings, 90 app ideas, the Launch Checklist (58 checks), the UI/UX Checklist (67 checks) and a Resource Vault of 72 official tools. It stays available after you finish the course.' },
      { q: 'Are all template ZIPs currently downloadable?', a: 'No — and the course says so on the page itself rather than in the small print. The landing-page templates are built, tested and packaged one at a time; the Templates page shows exactly which files are ready and which are still on the roadmap, and never renders a download button without a file behind it. What is available today is the full technical standard, the setup and customisation guides, and the exact prompt used to generate them, so you can build any of them yourself in the meantime.' },
      { q: 'Will my progress be saved?', a: 'Yes. Completed lessons, XP, worksheet answers and checklist ticks save to your account and sync across devices when you’re signed in. Progress is only ever added — nothing in the sync can reduce what you’ve completed.' },
      { q: 'Can I access it on mobile?', a: 'Yes. Every page — lessons, the Builder Vault, the checklists, the recipe prompts — is built to work at phone, tablet and desktop widths. You’ll want a laptop for the actual building, but the course reads fine on a phone.' },
      { q: 'What happens after purchase?', a: 'Access is immediate. Checkout returns you to the course, the entitlement is written by our payment webhook once Stripe confirms the payment, and AI App Builder OS appears in your account straight away — including the full Builder Vault.' },
      { q: 'Do I get a certificate?', a: 'No. STAIGE doesn’t issue certificates, and this course deliberately doesn’t pretend to — the Graduation Kit lists the certificate as unavailable rather than generating a credential that means nothing. What you finish with is a set of deployed products with your name on them, which is what a client or an employer actually looks at.' },
    ],
    finalCta: {
      headline: 'Ready to build something you can actually show people?',
      sub: 'Start with one published website in your first hour. Finish with a portfolio.',
    },
  },

  // ── Presentation ──────────────────────────────────────────────────────────
  themeAccent: 'brand',
  mascotMode: 'capy-byte',

  // ── Per-page copy ─────────────────────────────────────────────────────────
  ui: {
    dashboard: {
      eyebrow: 'AI App Builder OS',
      heroTitle: 'Let’s build your',
      heroAccent: 'first real product',
      blurb: {
        start: 'Every module ends with something real. By the end of Module 1 you’ll have a website live on the internet — not next week, within your first hour.',
        mid: 'You’re {pct}% through. Keep shipping — done beats perfect, and version two is earned by launching version one.',
        done: 'Every lesson done. You didn’t collect a certificate — you built a portfolio of live products. 🚀',
      },
      meet: 'Capy’s the builder — that’s you. Byte’s your AI teammate. Capy brings the doubt every beginner has; Byte brings the shortcut that gets past it. Start with the orientation, then publish something today.',
      bonuses: [
        { sub: 'builder-vault', label: 'Builder Vault', desc: '9 premium resource libraries', icon: 'Vault', tone: 'gold' },
        { sub: 'builder-vault/recipes', label: 'Builder Recipes', desc: `${VAULT_COUNTS.recipes} full build prompts`, icon: 'ChefHat', tone: 'brand' },
        { sub: 'downloads', label: 'Downloads', desc: 'Every module’s resources', icon: 'Download', tone: 'sky2' },
        { sub: 'badges', label: 'Achievements', desc: 'XP and badges earned', icon: 'Trophy', tone: 'flamingo' },
      ],
    },
    modules: {
      title: 'The curriculum',
      blurb: 'Nine modules, from “I can’t code” to a launched capstone product. Go in order — every module builds on the project you finished in the last one.',
    },
    downloads: {
      nav: 'Downloads',
      title: 'Download Center',
      blurb: 'Every 📦 resource listed at the end of a module. Each one opens the real thing inside your course. Resources whose files aren’t ready yet are listed under “Upcoming” at the bottom — nothing from the course is hidden, and nothing offers a download it doesn’t have.',
      futureUpdates:
        'AI builders change fast — new models, new tools, new defaults. The workflow doesn’t. ' +
        'When a resource here is ready, or a template ZIP is published, it appears in your account ' +
        'automatically. Nothing to re-buy, nothing to re-download.',
    },
    checklists: {
      nav: 'Checklists',
      title: 'Checklists',
      blurb: 'The Launch Checklist and the UI/UX Checklist, section by section. Ticks save to your account.',
    },
    vault: {
      nav: 'Resource Vault',
      title: 'Resource Vault',
      blurb: `${VAULT_COUNTS.resources} official tools and asset libraries across ${resourceCategories.length} categories. Everything links out to the real site — nothing is redistributed here.`,
    },
    badges: {
      title: 'Achievements',
      blurb: 'Each one is proof you shipped something — not that you watched a lesson.',
    },
    builderVault: {
      nav: 'Builder Vault',
      title: 'Builder Vault',
      blurb: 'Nine premium libraries: the recipes, references and audit tools you’ll reach for on every project after this course.',
    },
  },

  // ── Content ───────────────────────────────────────────────────────────────
  intro,
  modules,
  downloads: { items: downloads },
  resources: { items: resources, categories: resourceCategories },
  checklists: {
    items: checklistItems,
    groups: [
      { id: 'launch', name: '🚀 Launch Checklist', tone: 'brand' },
      { id: 'uiux', name: '🎨 UI/UX Checklist', tone: 'flamingo' },
    ],
  },
  // Unused sections — hidden by `features`.
  prompts: { items: [], categories: [] },
  ideas: { items: [], categories: [] },
  calendar: { weeklyStructure: [], thirtyDays: [] },
  challenge: { days: [], finalReflection: [] },
  badges: { milestone: milestoneBadges },

  // The dashboard spotlight — this course ends on graduation, not a 7-day challenge.
  finalChallenge: {
    title: 'The Capstone Challenge',
    blurb: 'Plan, build, launch and present a complete product of your own — then graduate.',
    moduleId: 'ab-m9',
    lessonId: 'ab-m9l6',
    emoji: '🏆',
    tone: 'gold',
  },

  progress: { trackBy: 'lessons' },

  features: {
    // Recipes replace a prompt library; the App Idea Generator replaces the
    // ideas page; the Resource Vault and both checklists live inside the
    // Builder Vault. They're reachable there, so they're off the main nav.
    prompts: false, ideas: false, calendar: false, vault: false,
    checklists: false, downloads: true, challenge: false, badges: true,
    xp: true,
    builderVault: true,
  },

  // Counts the Builder Vault home and the sales page quote, derived so they can
  // never drift from the data.
  builderVault: VAULT_COUNTS,
}

export default course
