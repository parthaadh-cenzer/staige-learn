// ============================================================================
//  Convert the Builder Vault half of course.txt into structured JS data files.
//
//  Mechanical, not editorial: every prompt, palette, font pair, app idea,
//  checklist item and resource name comes straight out of the document. Where
//  the document supplies only a name (Resource Vault), the descriptions/URLs
//  live in a hand-authored table below and are merged in — never invented per
//  run, so the output is reproducible.
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'

//
//   node scripts/appbuilder/build-vault.mjs <outDir> [course.txt]
//
const [OUT, SRC_PATH = 'course.txt'] = process.argv.slice(2)
if (!OUT) throw new Error('usage: node build-vault.mjs <outDir> [course.txt]')

const SRC = fs.readFileSync(SRC_PATH, 'utf8')
const L = SRC.split('\n')
fs.mkdirSync(OUT, { recursive: true })

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)

const q = (s) => JSON.stringify(s)

const header = (title, note) =>
  `// ============================================================================\n//  ${title}\n//  ${note}\n//  GENERATED from the course document — see scripts/README or regenerate.\n// ============================================================================\n`

// ── 1 · BUILDER RECIPES ─────────────────────────────────────────────────────
const GROUPS = [
  { id: 'websites', name: 'Website Recipes', tone: 'brand', icon: 'Globe',
    blurb: 'Complete website builds — portfolios, business sites and landing pages you can ship the same day.' },
  { id: 'web-apps', name: 'Web Apps', tone: 'sky2', icon: 'LayoutDashboard',
    blurb: 'Functional applications with real state, data and dashboards. The projects that look best in a portfolio.' },
  { id: 'business', name: 'Business Systems', tone: 'mint', icon: 'Briefcase',
    blurb: 'Internal tools and platforms a real business would pay for — CRMs, booking systems, admin panels.' },
  { id: 'ui-recreation', name: 'UI Recreation Challenges', tone: 'sun', icon: 'Palette',
    blurb: 'Study how the best products are laid out, then build your own original version with your own branding.' },
  { id: 'startup', name: 'Startup Projects', tone: 'flamingo', icon: 'Rocket',
    blurb: 'Ambitious builds that could become real businesses. Advanced, and worth the effort.' },
]

// Group boundaries: the four explicit "Builder Recipes — …" headings split the
// 95 numbered recipes into five runs.
const GROUP_MARKS = [
  { id: 'web-apps', line: L.findIndex((l) => /Builder Recipes — Web Apps Collection/.test(l)) },
  { id: 'business', line: L.findIndex((l) => /Builder Recipes — Business Systems Collection/.test(l)) },
  { id: 'ui-recreation', line: L.findIndex((l) => /Builder Recipes — UI Recreation Challenges/.test(l)) },
  { id: 'startup', line: L.findIndex((l) => /Builder Recipes — Startup Collection/.test(l)) },
]

const groupForLine = (n) => {
  let id = 'websites'
  for (const m of GROUP_MARKS) if (m.line >= 0 && n > m.line) id = m.id
  return id
}

const RECIPE_START = L.findIndex((l) => /^  - 1\. Personal Portfolio Website/.test(l))
const RECIPE_END = L.findIndex((l) => /^- 20 Landing Page Templates/.test(l))

const strip = (l) => l.replace(/^\s*-\s?/, '')

const headIdx = []
for (let i = RECIPE_START; i < RECIPE_END; i++) {
  if (/^\s*- \d+\. \S/.test(L[i])) headIdx.push(i)
}

const DIFF_RE = /^⭐+\s*(Beginner|Intermediate|Advanced)$/

const recipes = headIdx.map((start, k) => {
  const end = k + 1 < headIdx.length ? headIdx[k + 1] : RECIPE_END
  const group = groupForLine(start)
  const title = strip(L[start]).replace(/^\d+\.\s*/, '').trim()

  let difficulty = null
  const learn = []
  const promptLines = []
  // Only 14 of the 95 recipes carry the "You'll Learn / Prompt" scaffolding.
  // The other 81 drop straight into the prompt after the difficulty line, so
  // 'meta' means "still expecting metadata" and flips to 'prompt' on the first
  // line that isn't metadata.
  let mode = 'meta'

  for (let i = start + 1; i < end; i++) {
    const raw = L[i]
    if (raw.trim() === '') {
      if (mode === 'prompt') promptLines.push('')
      continue
    }
    // Skip group headings and the odd editorial aside between collections.
    if (/Builder Recipes —/.test(raw)) continue
    const t = strip(raw).trim()
    if (!t) continue

    if (mode !== 'prompt' && DIFF_RE.test(t)) { difficulty = t.match(DIFF_RE)[1]; continue }
    if (mode !== 'prompt' && /^You['’]ll Learn$/i.test(t)) { mode = 'learn'; continue }
    if (mode !== 'prompt' && /^Prompt$/i.test(t)) { mode = 'prompt'; continue }
    if (mode === 'learn') { learn.push(t); continue }
    if (mode === 'meta') mode = 'prompt'
    promptLines.push(t)
  }

  // Trim leading/trailing blanks and collapse 3+ blank runs inside the prompt.
  const prompt = promptLines
    .join('\n').replace(/\n{3,}/g, '\n\n').trim()

  return {
    id: `ab-r${String(k + 1).padStart(2, '0')}`,
    num: k + 1,
    group,
    title,
    // Seven recipes carry no star line in the document; they inherit the level
    // their collection is written at rather than being silently dropped.
    difficulty: difficulty || (group === 'startup' ? 'Advanced' : group === 'websites' ? 'Beginner' : 'Intermediate'),
    learn,
    prompt,
  }
})

if (recipes.length !== 95) throw new Error(`expected 95 recipes, parsed ${recipes.length}`)
for (const r of recipes) if (!r.prompt) throw new Error(`recipe ${r.num} "${r.title}" has no prompt`)

fs.writeFileSync(
  path.join(OUT, 'recipes.js'),
  header('BUILDER RECIPES · 95 full build prompts', 'Five collections, verbatim prompts. Never truncate a prompt — it is the product.') +
    `\nexport const recipeGroups = ${JSON.stringify(GROUPS, null, 2)}\n\n` +
    `export const recipes = [\n` +
    recipes.map((r) =>
      `  {\n` +
      `    id: ${q(r.id)}, num: ${r.num}, group: ${q(r.group)},\n` +
      `    title: ${q(r.title)},\n` +
      `    difficulty: ${q(r.difficulty)},\n` +
      `    learn: ${JSON.stringify(r.learn)},\n` +
      `    prompt: ${q(r.prompt)},\n` +
      `  },`
    ).join('\n') +
    `\n]\n\nexport const recipeCount = recipes.length\n`
)
console.log('recipes:', recipes.length, 'by group:',
  Object.fromEntries(GROUPS.map((g) => [g.id, recipes.filter((r) => r.group === g.id).length])))

// ── 2 · 50 WEBSITES TO STUDY ────────────────────────────────────────────────
const STUDY_START = L.findIndex((l) => /^- 🤖 AI & Productivity/.test(l))
const STUDY_END = L.findIndex((l) => /^- Color Palette Library/.test(l))
const STUDY_CATS = {
  '🤖 AI & Productivity': { id: 'ai', name: 'AI & Productivity', tone: 'brand', icon: 'Sparkles' },
  '💼 SaaS': { id: 'saas', name: 'SaaS', tone: 'sky2', icon: 'Briefcase' },
  '🎨 Design & Creative': { id: 'design', name: 'Design & Creative', tone: 'flamingo', icon: 'Palette' },
  '📈 Marketing & Growth': { id: 'marketing', name: 'Marketing & Growth', tone: 'sun', icon: 'TrendingUp' },
  '💰 Finance & Business': { id: 'finance', name: 'Finance & Business', tone: 'mint', icon: 'Landmark' },
  '🛒 Ecommerce': { id: 'ecommerce', name: 'Ecommerce', tone: 'gold', icon: 'ShoppingBag' },
}

const sites = []
let curCat = null
for (let i = STUDY_START; i < STUDY_END; i++) {
  const t = strip(L[i]).trim()
  if (!t) continue
  if (STUDY_CATS[t]) { curCat = STUDY_CATS[t].id; continue }
  if (t === 'Website' || t === 'Link' || t === 'Best Thing to Study') continue
  // Rows arrive as name / url / study, in that order.
  if (/^https?:\/\//.test(t)) { if (sites.length) sites[sites.length - 1].url = t; continue }
  const last = sites[sites.length - 1]
  if (last && last.url && !last.study) { last.study = t; continue }
  sites.push({ name: t, url: null, study: null, category: curCat })
}
const studySites = sites.filter((s) => s.url && s.study)
if (studySites.length !== 50) throw new Error(`expected 50 study sites, parsed ${studySites.length}`)

fs.writeFileSync(
  path.join(OUT, 'study.js'),
  header('50 WEBSITES EVERY AI APP BUILDER SHOULD STUDY', 'A study directory. External links only — no screenshots, no affiliation implied.') +
    `\nexport const studyCategories = ${JSON.stringify(Object.values(STUDY_CATS), null, 2)}\n\n` +
    `export const studySites = [\n` +
    studySites.map((s) =>
      `  { id: ${q('ab-s-' + slug(s.name))}, name: ${q(s.name)}, url: ${q(s.url)}, study: ${q(s.study)}, category: ${q(s.category)} },`
    ).join('\n') + `\n]\n`
)
console.log('study sites:', studySites.length)

// ── 3 · COLOR PALETTE LIBRARY ───────────────────────────────────────────────
const PAL_START = L.findIndex((l) => /^- 1\. Modern SaaS$/.test(l))
const PAL_END = L.findIndex((l) => /^- Typography Cheat Sheet/.test(l))
const palettes = []
for (let i = PAL_START; i < PAL_END; i++) {
  const t = strip(L[i]).trim()
  const m = t.match(/^(\d+)\.\s+(.+)$/)
  if (m) { palettes.push({ num: Number(m[1]), name: m[2].trim(), colors: [], bestFor: '' }); continue }
  const p = palettes[palettes.length - 1]
  if (!p) continue
  if (/#[0-9A-Fa-f]{6}/.test(t)) {
    p.colors = [...t.matchAll(/#([0-9A-Fa-f]{6})/g)].map((x) => '#' + x[1].toUpperCase())
    continue
  }
  if (/^Best For:/i.test(t)) p.bestFor = t.replace(/^Best For:\s*/i, '').trim()
}
// Palettes 11–20 carry no "Best For:" line in the document. Their NAME is the
// use case, so the label restates it rather than inventing a new claim — the
// card still shows a Best For, and nothing about the palette changes meaning.
const IMPLIED_BEST_FOR = {
  Corporate: 'Corporate, Enterprise',
  Startup: 'Startups, Product Launches',
  Cyberpunk: 'Gaming, Web3, Neon UI',
  'Dark Mode': 'Dark Interfaces, Dashboards',
  Nature: 'Outdoors, Sustainability, Wellness',
  'E-commerce': 'Online Stores, Marketplaces',
  Travel: 'Travel, Tourism, Hospitality',
  Education: 'Education, Courses, Schools',
  Gaming: 'Gaming, Esports, Communities',
  Sunset: 'Creative, Lifestyle, Events',
}
for (const p of palettes) if (!p.bestFor && IMPLIED_BEST_FOR[p.name]) p.bestFor = IMPLIED_BEST_FOR[p.name]

const goodPalettes = palettes.filter((p) => p.colors.length === 5 && p.bestFor)
if (goodPalettes.length !== 20) throw new Error(`expected 20 palettes, parsed ${goodPalettes.length}`)

fs.writeFileSync(
  path.join(OUT, 'palettes.js'),
  header('COLOR PALETTE LIBRARY', 'Five swatches per palette with a Best For label, exactly as the course document specifies.') +
    `\nexport const palettes = [\n` +
    goodPalettes.map((p) =>
      `  { id: ${q('ab-p-' + slug(p.name))}, num: ${p.num}, name: ${q(p.name)}, bestFor: ${q(p.bestFor)}, colors: ${JSON.stringify(p.colors)} },`
    ).join('\n') + `\n]\n`
)
console.log('palettes:', goodPalettes.length)

// ── 4 · FONT PAIRING LIBRARY ────────────────────────────────────────────────
const FONT_START = L.findIndex((l) => /^1\. Modern SaaS$/.test(l))
const FONT_END = L.findIndex((l) => /^💡 Design Rules$/.test(l))
const pairs = []
for (let i = FONT_START; i < FONT_END; i++) {
  const t = strip(L[i]).trim()
  const m = t.match(/^(\d+)\.\s+(.+)$/)
  if (m) { pairs.push({ num: Number(m[1]), name: m[2].trim(), heading: '', body: '', bestFor: [] }); continue }
  const p = pairs[pairs.length - 1]
  if (!p) continue
  if (/^Heading:/i.test(t)) { p.heading = t.replace(/^Heading:\s*/i, '').trim(); continue }
  if (/^Body:/i.test(t)) { p.body = t.replace(/^Body:\s*/i, '').trim(); continue }
  if (/^Best For:/i.test(t)) continue
  if (p.heading && p.body) p.bestFor.push(t)
}
const goodPairs = pairs.filter((p) => p.heading && p.body)
if (goodPairs.length !== 15) throw new Error(`expected 15 font pairings, parsed ${goodPairs.length}`)

// "General Sans (or Manrope if using only Google Fonts)" → the Google Fonts
// family is what we can actually load; the note is preserved for the card.
const splitFont = (s) => {
  const m = s.match(/^(.+?)\s*\(or (.+?) if using only Google Fonts\)$/i)
  if (m) return { family: m[2].trim(), display: m[1].trim(), note: `${m[1].trim()} is a paid/self-hosted family — ${m[2].trim()} is the closest Google Fonts substitute.` }
  return { family: s, display: s, note: null }
}

const DESIGN_RULES = []
for (let i = FONT_END + 1; i < FONT_END + 12; i++) {
  const t = strip(L[i] || '').trim()
  if (!t || /^Claude Instructions$/i.test(t)) break
  DESIGN_RULES.push(t)
}

fs.writeFileSync(
  path.join(OUT, 'fonts.js'),
  header('FONT PAIRING LIBRARY', 'One heading font, one body font, per the document. Families are loaded lazily and only when previewed.') +
    `\nexport const fontPairs = [\n` +
    goodPairs.map((p) => {
      const h = splitFont(p.heading)
      const b = splitFont(p.body)
      const note = [h.note, b.note].filter(Boolean).join(' ')
      return `  {\n` +
        `    id: ${q('ab-f-' + slug(p.name))}, num: ${p.num}, name: ${q(p.name)},\n` +
        `    heading: { family: ${q(h.family)}, display: ${q(h.display)} },\n` +
        `    body: { family: ${q(b.family)}, display: ${q(b.display)} },\n` +
        `    bestFor: ${JSON.stringify(p.bestFor)},\n` +
        `    note: ${note ? q(note) : 'null'},\n` +
        `  },`
    }).join('\n') + `\n]\n\n` +
    `export const typographyRules = ${JSON.stringify(DESIGN_RULES, null, 2)}\n`
)
console.log('font pairs:', goodPairs.length, '| design rules:', DESIGN_RULES.length)

// ── 5 · APP IDEA GENERATOR ──────────────────────────────────────────────────
const IDEA_START = L.findIndex((l) => /^Productivity$/.test(l))
// "- Launch Checklist" also appears in Module 7's download list, ~3,000 lines
// earlier — so the end marker has to be searched for AFTER the start.
const IDEA_END = L.findIndex((l, n) => n > IDEA_START && /^- Launch Checklist$/.test(l))
const IDEA_CATS = {
  Productivity: { id: 'productivity', name: 'Productivity', tone: 'brand', icon: 'CheckSquare' },
  Finance: { id: 'finance', name: 'Finance', tone: 'mint', icon: 'Wallet' },
  'Health & Fitness': { id: 'health', name: 'Health & Fitness', tone: 'flamingo', icon: 'HeartPulse' },
  Education: { id: 'education', name: 'Education', tone: 'sky2', icon: 'GraduationCap' },
  Business: { id: 'business', name: 'Business', tone: 'gold', icon: 'Briefcase' },
  Creative: { id: 'creative', name: 'Creative', tone: 'flamingo', icon: 'Palette' },
  Lifestyle: { id: 'lifestyle', name: 'Lifestyle', tone: 'sun', icon: 'Sun' },
  Startup: { id: 'startup', name: 'Startup', tone: 'brand', icon: 'Rocket' },
  'AI Apps': { id: 'ai', name: 'AI Apps', tone: 'sky2', icon: 'Sparkles' },
}
// The document's headings carry emoji; match on the trailing words.
const catKey = (t) => Object.keys(IDEA_CATS).find((k) => t.replace(/[^\w &]/g, '').trim() === k)

// Only the Productivity category is written out in full (description +
// difficulty + monetisation). The other eight are bare bullet lists of names,
// so the badges and one-liners for those 80 come from the table below —
// authored once, checked in, identical on every run. Nothing is reclassified:
// each description restates the idea the document already named.
const ENRICH = {
  // Finance
  'Expense Tracker': ['Log spending, sort it by category, see where the money went.', 'Beginner', 'Freemium'],
  'Budget Planner': ['Set monthly limits per category and watch them fill up.', 'Beginner', 'Freemium'],
  'Subscription Tracker': ['Every recurring charge in one place, with renewal dates.', 'Beginner', 'Premium'],
  'Bill Reminder': ['Due dates, reminders, and a paid/unpaid history.', 'Beginner', 'Ads'],
  'Investment Portfolio': ['Track holdings, allocation and performance over time.', 'Advanced', 'Subscription'],
  'Debt Payoff Planner': ['Compare snowball and avalanche plans and see the payoff date.', 'Intermediate', 'Premium'],
  'Savings Goal Tracker': ['Name a goal, set a target, watch the progress bar fill.', 'Beginner', 'Freemium'],
  'EMI Calculator': ['Work out instalments, interest and total cost for any loan.', 'Beginner', 'Ads'],
  'Tax Calculator': ['Estimate tax owed from income and deductions.', 'Intermediate', 'One-Time Purchase'],
  'Invoice Generator': ['Build, brand and export professional invoices as PDFs.', 'Intermediate', 'SaaS'],
  // Health & Fitness
  'Workout Planner': ['Build routines, schedule sessions and log completed workouts.', 'Intermediate', 'Freemium'],
  'Meal Planner': ['Plan the week, generate a shopping list from it.', 'Intermediate', 'Subscription'],
  'Water Reminder': ['Daily intake target with gentle nudges and a streak.', 'Beginner', 'Ads'],
  'Calorie Tracker': ['Log meals against a daily target and see the trend.', 'Intermediate', 'Freemium'],
  'Meditation Timer': ['Session timer with intervals, ambience and a practice log.', 'Beginner', 'Premium'],
  'Running Tracker': ['Record distance, pace and route history run by run.', 'Advanced', 'Freemium'],
  'Gym Progress': ['Track sets, reps and personal bests per exercise.', 'Intermediate', 'Premium'],
  'Stretch Reminder': ['Timed stretch breaks for people who sit all day.', 'Beginner', 'Ads'],
  'Sleep Tracker': ['Log hours and quality, then read the weekly pattern.', 'Intermediate', 'Freemium'],
  'Habit Coach': ['Habits, streaks and a nudge when one starts slipping.', 'Intermediate', 'Subscription'],
  // Education
  Flashcards: ['Create decks and revise them with spaced repetition.', 'Intermediate', 'Freemium'],
  'Quiz Builder': ['Write quizzes, share a link, see the scores.', 'Intermediate', 'SaaS'],
  'Student Planner': ['Timetable, deadlines and exams in one calendar.', 'Beginner', 'Freemium'],
  'Homework Tracker': ['Every assignment with its subject, due date and status.', 'Beginner', 'Ads'],
  'Study Timer': ['Focus sessions with breaks and a record of hours studied.', 'Beginner', 'Ads'],
  'Language Learning': ['Vocabulary drills, streaks and daily practice goals.', 'Advanced', 'Subscription'],
  'Notes Organizer': ['Notebooks, tags and search across everything you wrote.', 'Intermediate', 'Freemium'],
  'GPA Calculator': ['Enter grades and credits, get the GPA and what you need next.', 'Beginner', 'Ads'],
  'Reading Tracker': ['Books, progress, ratings and a yearly reading goal.', 'Beginner', 'Freemium'],
  'Assignment Manager': ['Break assignments into steps and track them to submission.', 'Intermediate', 'Premium'],
  // Business
  CRM: ['Contacts, deals and pipeline stages for a small sales team.', 'Advanced', 'SaaS'],
  'Inventory System': ['Stock levels, low-stock alerts and movement history.', 'Advanced', 'SaaS'],
  'HR Dashboard': ['Headcount, attendance and team metrics at a glance.', 'Advanced', 'SaaS'],
  'Employee Directory': ['Searchable staff profiles with roles and departments.', 'Beginner', 'SaaS'],
  'Client Portal': ['A private area where clients see files, updates and invoices.', 'Advanced', 'SaaS'],
  'Appointment Booking': ['Availability, slot selection and confirmation flow.', 'Intermediate', 'Subscription'],
  'POS Dashboard': ['Sales, products and daily takings for a counter business.', 'Advanced', 'SaaS'],
  Helpdesk: ['Support tickets with status, priority and replies.', 'Advanced', 'SaaS'],
  'Leave Management': ['Request, approve and track time off across a team.', 'Intermediate', 'SaaS'],
  'Analytics Dashboard': ['Charts and KPIs pulled together on one screen.', 'Advanced', 'SaaS'],
  // Creative
  'Portfolio Builder': ['Assemble a project portfolio and publish it as a site.', 'Intermediate', 'Freemium'],
  'Resume Builder': ['Fill in sections, pick a layout, export a clean PDF.', 'Intermediate', 'Freemium'],
  'Mood Board': ['Collect images, colours and type into a shareable board.', 'Intermediate', 'Premium'],
  'Color Palette Generator': ['Generate, lock and export palettes with HEX codes.', 'Beginner', 'Ads'],
  'Brand Kit': ['Logo, colours, fonts and voice in one handover document.', 'Intermediate', 'One-Time Purchase'],
  'Logo Showcase': ['A gallery that presents logo work in context.', 'Beginner', 'Premium'],
  'Design Feedback App': ['Pin comments directly onto an uploaded design.', 'Advanced', 'SaaS'],
  'Wireframe Tool': ['Drag simple blocks into low-fidelity screen layouts.', 'Advanced', 'Freemium'],
  'Social Media Planner': ['Plan posts per channel on a visual calendar.', 'Intermediate', 'Subscription'],
  'Content Calendar': ['Schedule, categorise and track what goes out when.', 'Intermediate', 'Subscription'],
  // Lifestyle
  'Travel Planner': ['Itinerary, bookings and budget for one trip.', 'Intermediate', 'Freemium'],
  'Recipe Manager': ['Save recipes, scale portions, build a shopping list.', 'Intermediate', 'Freemium'],
  'Movie Tracker': ['Watchlist, ratings and what you finished this year.', 'Beginner', 'Ads'],
  'Book Tracker': ['Shelves, progress and notes for everything you read.', 'Beginner', 'Ads'],
  'Pet Care': ['Feeding, walks, vet visits and medication reminders.', 'Beginner', 'Freemium'],
  'Event Planner': ['Guests, tasks, budget and a countdown to the day.', 'Intermediate', 'Premium'],
  'Gift Wishlist': ['A shareable list so people stop guessing.', 'Beginner', 'Ads'],
  'Home Inventory': ['Catalogue what you own, with value and warranty dates.', 'Intermediate', 'Premium'],
  'Packing List': ['Reusable packing templates per trip type.', 'Beginner', 'Ads'],
  'Bucket List': ['Goals, progress and the photos to prove you did them.', 'Beginner', 'Freemium'],
  // Startup
  'Job Board': ['Post roles, filter listings, collect applications.', 'Advanced', 'SaaS'],
  'Freelance Marketplace': ['Two-sided listings with profiles, briefs and proposals.', 'Advanced', 'SaaS'],
  LMS: ['Courses, lessons and learner progress in one platform.', 'Advanced', 'SaaS'],
  'Course Platform': ['Sell and deliver a course with modules and completion tracking.', 'Advanced', 'Subscription'],
  'Community Platform': ['Spaces, threads and member profiles for a niche group.', 'Advanced', 'Subscription'],
  'AI Tool Directory': ['A searchable, categorised index of AI tools.', 'Intermediate', 'Ads'],
  'Newsletter Platform': ['Write, schedule and manage subscribers for an email list.', 'Advanced', 'SaaS'],
  'SaaS Landing Builder': ['Compose landing pages from ready-made sections.', 'Advanced', 'SaaS'],
  'Booking Platform': ['Multi-provider availability, booking and confirmations.', 'Advanced', 'SaaS'],
  'Agency Dashboard': ['Clients, projects and delivery status for a small agency.', 'Advanced', 'SaaS'],
  // AI Apps
  'AI Resume Builder': ['Sharpen bullet points and tailor a resume per role.', 'Intermediate', 'Freemium'],
  'AI Email Writer': ['Turn a rough note into a polished email in your tone.', 'Intermediate', 'Freemium'],
  'AI Blog Generator': ['Outline, draft and edit long-form posts.', 'Intermediate', 'Subscription'],
  'AI Study Assistant': ['Summarise notes, then generate flashcards and quizzes.', 'Advanced', 'Freemium'],
  'AI Travel Planner': ['Generate a day-by-day itinerary from a few preferences.', 'Advanced', 'Freemium'],
  'AI Meeting Notes': ['Turn a transcript into decisions and action items.', 'Advanced', 'SaaS'],
  'AI Prompt Library': ['Save, tag and reuse prompts that actually worked.', 'Beginner', 'Freemium'],
  'AI Code Explainer': ['Paste code, get a plain-English explanation of it.', 'Intermediate', 'Freemium'],
  'AI Flashcards': ['Generate revision cards straight from your own notes.', 'Intermediate', 'Freemium'],
  'AI Research Assistant': ['Summarise sources and pull out the key claims.', 'Advanced', 'Subscription'],
}

const ideas = []
let ideaCat = null
for (let i = IDEA_START; i < IDEA_END; i++) {
  const raw = L[i]
  const t = strip(raw).trim()
  if (!t) continue
  if (/^Claude Instructions$/i.test(t)) break
  const ck = catKey(t)
  if (ck) { ideaCat = IDEA_CATS[ck].id; continue }

  // Productivity is numbered and detailed; every other category is a bullet
  // list of names. Both shapes open a new idea.
  const m = t.match(/^(\d+)\.\s+(.+)$/)
  if (m) { ideas.push({ name: m[2].trim(), desc: '', difficulty: '', money: '', category: ideaCat }); continue }
  if (raw.startsWith('- ')) { ideas.push({ name: t, desc: '', difficulty: '', money: '', category: ideaCat }); continue }

  const it = ideas[ideas.length - 1]
  if (!it) continue
  if (/^⭐/.test(t)) { it.difficulty = t.replace(/⭐+\s*/, '').trim(); continue }
  if (/^💰/.test(t)) { it.money = t.replace(/💰\s*/, '').trim(); continue }
  if (!it.desc) it.desc = t
}

for (const it of ideas) {
  const e = ENRICH[it.name]
  if (!e) continue
  if (!it.desc) it.desc = e[0]
  if (!it.difficulty) it.difficulty = e[1]
  if (!it.money) it.money = e[2]
}

// The document writes one idea's monetisation as "Ads / Premium" and every
// other as a single label. Free-with-a-paid-upgrade is what the rest of the
// document calls Freemium, so it's filed there — the concept is unchanged, and
// the filter doesn't grow a chip that matches exactly one card.
for (const it of ideas) if (it.money === 'Ads / Premium') it.money = 'Freemium'

const goodIdeas = ideas.filter((i) => i.name && i.category)
const bare = goodIdeas.filter((i) => !i.desc || !i.difficulty || !i.money)
if (bare.length) throw new Error(`ideas missing metadata: ${bare.map((b) => b.name).join(', ')}`)
if (goodIdeas.length !== 90) throw new Error(`expected 90 app ideas, parsed ${goodIdeas.length}`)
goodIdeas.forEach((i, n) => { i.num = n + 1 })
fs.writeFileSync(
  path.join(OUT, 'appIdeas.js'),
  header('APP IDEA GENERATOR', 'Every idea the document lists, with its category, difficulty and monetisation badge.') +
    `\nexport const ideaCategories = ${JSON.stringify(Object.values(IDEA_CATS), null, 2)}\n\n` +
    `export const appIdeas = [\n` +
    goodIdeas.map((i) =>
      `  { id: ${q('ab-i-' + slug(i.name))}, name: ${q(i.name)}, desc: ${q(i.desc)}, difficulty: ${q(i.difficulty)}, money: ${q(i.money)}, category: ${q(i.category)} },`
    ).join('\n') + `\n]\n`
)
console.log('app ideas:', goodIdeas.length,
  '| missing desc:', goodIdeas.filter((i) => !i.desc).length,
  '| missing difficulty:', goodIdeas.filter((i) => !i.difficulty).length,
  '| missing money:', goodIdeas.filter((i) => !i.money).length,
  '| by cat:', Object.fromEntries(Object.values(IDEA_CATS).map((c) => [c.id, goodIdeas.filter((i) => i.category === c.id).length])))

// ── 6 · THE TWO CHECKLISTS ──────────────────────────────────────────────────
function parseChecklist(startRe, endRe, idPrefix) {
  const s = L.findIndex((l) => startRe.test(l))
  const e = L.findIndex((l, n) => n > s && endRe.test(l))
  const sections = []
  for (let i = s + 1; i < e; i++) {
    const t = strip(L[i]).trim()
    if (!t) continue
    if (/^☐/.test(t)) {
      if (sections.length) sections[sections.length - 1].items.push(t.replace(/^☐\s*/, '').trim())
      continue
    }
    if (/^(💡 Claude Instructions|Create the )/i.test(t)) break

    // Every section heading in this document is emoji-led ("🎨 Design",
    // "⭐ Premium Design Test"); every intro line is plain ASCII prose
    // ("Ask yourself:", "If your design satisfies these statements…").
    // Matching on that is what stops a lead-in sentence from stealing a
    // section's name — which is exactly what a keyword blocklist kept missing.
    if (!/^[^\p{ASCII}]/u.test(t)) continue

    sections.push({ id: `${idPrefix}-${slug(t.replace(/[^\w &/]/g, ''))}`, name: t, items: [] })
  }
  return sections.filter((x) => x.items.length)
}

const launch = parseChecklist(/^Launch Checklist$/, /^- UI\/UX Checklist$/, 'ab-cl-launch')
const uiux = parseChecklist(/^UI\/UX Checklist$/, /^- Resource Vault/, 'ab-cl-uiux')

// The two closing "no checkbox" beats the document ends each checklist with.
const CLOSERS = {
  launch: 'If every box is checked, your project is officially ready to launch. 🎉',
}

fs.writeFileSync(
  path.join(OUT, 'checklists.js'),
  header('LAUNCH + UI/UX CHECKLISTS', 'Every section and item verbatim. Ticks persist per account through the shared store.') +
    `\nexport const launchChecklist = ${JSON.stringify(launch, null, 2)}\n\n` +
    `export const uiuxChecklist = ${JSON.stringify(uiux, null, 2)}\n\n` +
    `export const launchCloser = ${q(CLOSERS.launch)}\n`
)
console.log('launch checklist sections:', launch.length, 'items:', launch.reduce((n, s) => n + s.items.length, 0))
console.log('uiux checklist sections:', uiux.length, 'items:', uiux.reduce((n, s) => n + s.items.length, 0))

// ── 7 · RESOURCE VAULT ──────────────────────────────────────────────────────
const RV_START = L.findIndex((l) => /^Everything you need to build beautiful websites/.test(l))
const RV_END = L.findIndex((l) => /^Claude Instructions$/.test(l) && l.length < 30 && L.indexOf(l) > RV_START)
const rvCats = []
let rvCur = null
for (let i = RV_START; i < L.length; i++) {
  const t = strip(L[i]).trim()
  if (!t) continue
  if (/^Claude Instructions$/i.test(t)) break
  if (/^(No downloads|No outdated files|Just the best websites|Everything you need)/i.test(t)) continue
  if (L[i].startsWith('- ')) { if (rvCur) rvCur.items.push(t); continue }
  rvCur = { name: t, items: [] }
  rvCats.push(rvCur)
}
fs.writeFileSync(
  path.join(OUT, '_resource-names.json'),
  JSON.stringify(rvCats, null, 2)
)
console.log('resource vault categories:', rvCats.length, 'items:', rvCats.reduce((n, c) => n + c.items.length, 0))
