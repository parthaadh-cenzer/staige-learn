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
    builds: [
      'A published personal portfolio website',
      'A complete client business website',
      'A productivity app people actually use',
      'An AI resume builder and an AI study assistant',
      'A capstone product you planned, launched and presented',
    ],
    resources: [
      { icon: 'Vault', title: 'Builder Vault', text: '95 build recipes, 20 palettes, 15 font pairings, 90 app ideas, 50 sites to study, two audit checklists and 72 tools.' },
    ],
    audience: {
      yes: ['Complete beginners with no coding background', 'Students building a portfolio', 'Freelancers who want to sell websites', 'Founders who need a working prototype', 'Anyone with an idea and no way to build it'],
      no: ['You want to become a software engineer', 'You won’t actually build the projects', 'You expect AI to decide what to build for you'],
    },
    faq: [
      { q: 'Do I need to know how to code?', a: 'No. That’s the point. You’ll use AI builders to generate the code, and your job is to think clearly, make product decisions and guide the build. If you can describe what you want precisely, you can finish this course.' },
      { q: 'Which AI builder does it use?', a: 'Claude for planning and debugging, plus an AI app builder of your choice — Lovable, Bolt, Replit and Cursor all work. Module 2 is explicit that tools change and the workflow doesn’t, so nothing here breaks when a new builder appears.' },
      { q: 'Do I get the landing page templates?', a: 'The Template Library is published one template at a time, and every entry says honestly whether its file is available yet. Nothing on that page is a download button with nothing behind it. The course is complete and fully usable without them.' },
      { q: 'Will I have anything to show at the end?', a: 'Yes — that’s the whole design. Every module ends with a Builder Mission that produces a real, deployed project. By graduation you have a portfolio of live URLs, not a certificate.' },
      // Overrides the platform's generic "yes, everything downloads" answer,
      // which isn't true for this course — its resources are live libraries you
      // use in the browser, not files. Saying so here is better than being
      // corrected by the Download Center after someone has paid.
      { q: 'Can I download the templates?', a: 'This course’s resources are living libraries rather than files: the 95 Builder Recipes, the palettes, the font pairings, the app ideas and the two audit checklists all work in the browser, with copy buttons where you need the text. The downloadable landing-page template ZIPs are being published one at a time, and every card states plainly whether its file is ready — you will never find a download button here with nothing behind it.' },
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
