// ============================================================================
//  BUILDER VAULT · the nine sections, described once.
//
//  The vault home renders these cards, and the routes in CourseShell mount the
//  matching pages. Counts are DERIVED from the data files, so a card can never
//  advertise 95 recipes while the library holds 94.
// ============================================================================
import { recipes, recipeGroups } from './recipes'
import { templates, liveTemplateCount } from './templates'
import { studySites, studyCategories } from './study'
import { palettes } from './palettes'
import { fontPairs } from './fonts'
import { appIdeas, ideaCategories } from './appIdeas'
import { launchChecklist, uiuxChecklist } from './checklists'
import { resources, resourceCategories } from './resources'
import { VAULT_COUNTS } from './counts'

const count = (arr) => arr.length
const items = (sections) => sections.reduce((n, s) => n + s.items.length, 0)

// ── Drift guard ─────────────────────────────────────────────────────────────
// counts.js exists so the main bundle doesn't have to import 100 kB of vault
// data to print a number (see the header there). This is the check that keeps
// the two in step: the moment a real count diverges, the next dev run says so.
// Development only — it costs nothing in production and never throws, because a
// wrong number on a card is not worth taking the app down for.
if (import.meta.env?.DEV) {
  const actual = {
    recipes: count(recipes), templates: count(templates), sites: count(studySites),
    palettes: count(palettes), fonts: count(fontPairs), ideas: count(appIdeas),
    resources: count(resources),
    launchItems: items(launchChecklist), uiuxItems: items(uiuxChecklist),
  }
  for (const [k, v] of Object.entries(actual)) {
    if (VAULT_COUNTS[k] !== v) {
      console.warn(
        `[staige] Builder Vault count drift: counts.js says ${k}=${VAULT_COUNTS[k]}, actual is ${v}. ` +
        `Update src/data/appbuilder/counts.js.`
      )
    }
  }
}

export const vaultSections = [
  {
    id: 'recipes',
    to: 'recipes',
    name: 'Builder Recipes',
    desc: 'Complete, copy-and-paste build prompts for real projects — websites, web apps, business systems, UI challenges and startup builds.',
    icon: 'ChefHat',
    tone: 'brand',
    count: `${count(recipes)} recipes`,
    meta: `${recipeGroups.length} collections · Beginner → Advanced`,
  },
  {
    id: 'templates',
    to: 'templates',
    name: 'Premium Landing Page Templates',
    desc: 'Production-ready React + Vite + Tailwind starters, with setup and customisation guides. Published one at a time — each card says honestly whether its file is ready.',
    icon: 'LayoutTemplate',
    tone: 'sky2',
    count: `${count(templates)} planned`,
    meta: liveTemplateCount ? `${liveTemplateCount} available to download` : 'Files pending — none available yet',
  },
  {
    id: 'study',
    to: 'study',
    name: '50 Websites to Study',
    desc: 'A curated directory of the sites worth taking apart, with what to look at on each one. Study the principles — don’t copy the brands.',
    icon: 'Eye',
    tone: 'gold',
    count: `${count(studySites)} websites`,
    meta: `${studyCategories.length} categories · external links`,
  },
  {
    id: 'palettes',
    to: 'palettes',
    name: 'Color Palette Library',
    desc: 'Five-swatch palettes with copyable HEX codes and a Best For label, so you never open a project on a blank colour picker again.',
    icon: 'Palette',
    tone: 'flamingo',
    count: `${count(palettes)} palettes`,
    meta: `${count(palettes) * 5} colours · copy HEX or whole palette`,
  },
  {
    id: 'fonts',
    to: 'fonts',
    name: 'Font Pairing Library',
    desc: 'Heading and body pairings with live previews, best-use cases and a one-click Google Fonts import.',
    icon: 'Type',
    tone: 'sky2',
    count: `${count(fontPairs)} pairings`,
    meta: 'Live previews · copy @import',
  },
  {
    id: 'ideas',
    to: 'ideas',
    name: 'App Idea Generator',
    desc: 'An inspiration board of app ideas, each with a difficulty level and a monetisation angle. Filter by all three.',
    icon: 'Lightbulb',
    tone: 'gold',
    count: `${count(appIdeas)} ideas`,
    meta: `${ideaCategories.length} categories · Beginner → Advanced`,
  },
  {
    id: 'launch-checklist',
    to: 'launch-checklist',
    name: 'Launch Checklist',
    desc: 'Everything to clear before a project goes public — design, responsiveness, performance, SEO, accessibility, testing, code quality and deployment.',
    icon: 'Rocket',
    tone: 'brand',
    count: `${items(launchChecklist)} checks`,
    meta: `${launchChecklist.length} sections · progress saved to your account`,
  },
  {
    id: 'uiux-checklist',
    to: 'uiux-checklist',
    name: 'UI/UX Checklist',
    desc: 'A professional design audit: layout, visual design, typography, navigation, interactions, forms, responsiveness, animation and accessibility.',
    icon: 'ListChecks',
    tone: 'mint',
    count: `${items(uiuxChecklist)} checks`,
    meta: `${uiuxChecklist.length} sections · includes the Premium Design Test`,
  },
  {
    id: 'resources',
    to: 'resources',
    name: 'Resource Vault',
    desc: 'The icons, illustrations, photos, fonts, components, charts, mockups and deployment tools professionals actually use. Official links only.',
    icon: 'Package',
    tone: 'flamingo',
    count: `${count(resources)} resources`,
    meta: `${resourceCategories.length} categories · Free → Paid badges`,
  },
]
