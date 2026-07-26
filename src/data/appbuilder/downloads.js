// ============================================================================
//  MODULE DOWNLOADS · every 📦 resource the course document lists.
//
//  HONESTY RULES (the whole reason this file reads the way it does):
//
//   • Every title in the document appears here, spelled exactly as written.
//     Nothing is silently dropped because we don't have a file for it.
//   • A card only offers a download when something real is behind it.
//     `opensTo` points at a Builder Vault page that genuinely contains the
//     resource — that's a live destination, not a file.
//   • Everything else carries `available: false` and renders as "File pending"
//     with the button disabled. No fake PDFs, no two cards pointing at one ZIP,
//     no broken links.
//   • To publish one later: give it `sections`/`steps` (the shape
//     src/lib/resourceDoc.js turns into a real document) and drop
//     `available: false`. The card becomes a working download with no page
//     changes. Or set `file` to a hosted asset path.
//
//  `kind: 'template'` renders in a lesson's 🤖 AI Templates block; anything
//  else renders under 📥 Downloads. Both read this same list.
// ============================================================================

const M = {
  m1: { id: 'ab-m1', label: 'Module 1 · First App' },
  m2: { id: 'ab-m2', label: 'Module 2 · Design' },
  m3: { id: 'ab-m3', label: 'Module 3 · Client Websites' },
  m4: { id: 'ab-m4', label: 'Module 4 · Real Apps' },
  m5: { id: 'ab-m5', label: 'Module 5 · AI Features' },
  m6: { id: 'ab-m6', label: 'Module 6 · Polish' },
  m7: { id: 'ab-m7', label: 'Module 7 · Launch' },
  grad: { id: 'ab-m9', label: 'Graduation Kit' },
}

// A resource that IS live — it opens a Builder Vault page that really holds it.
const live = (id, mod, title, type, icon, tone, opensTo, description) => ({
  id, moduleId: M[mod].id, moduleLabel: M[mod].label,
  title, type, icon, tone, description,
  opensTo, available: true, kind: 'download',
})

// A resource named by the document that has no file yet. Title preserved
// exactly; the UI says "File pending" and disables the button.
const pending = (id, mod, title, type, icon, tone, description) => ({
  id, moduleId: M[mod].id, moduleLabel: M[mod].label,
  title, type, icon, tone, description,
  opensTo: null, available: false, kind: 'download',
})

export const downloads = [
  // ── Module 1 ──────────────────────────────────────────────────────────────
  live('ab-d-m1-1', 'm1', 'Beginner Prompt Pack', 'Library', 'Sparkles', 'brand', 'builder-vault/recipes',
    'Opens Builder Recipes — 95 complete build prompts, starting with the beginner website collection.'),
  pending('ab-d-m1-2', 'm1', 'Portfolio Copy Templates', 'Template', 'FileText', 'sky2',
    'Fill-in-the-blank copy for every section of a personal portfolio.'),
  pending('ab-d-m1-3', 'm1', 'Hero Headline Swipe File', 'Library', 'Type', 'flamingo',
    'Headline patterns that say who you are in five seconds.'),
  live('ab-d-m1-4', 'm1', 'Color Palette Collection', 'Library', 'Palette', 'gold', 'builder-vault/palettes',
    'Opens the Color Palette Library — 20 palettes, five swatches each, with HEX codes you can copy.'),
  live('ab-d-m1-5', 'm1', 'Font Pairing Guide', 'Guide', 'Type', 'sky2', 'builder-vault/fonts',
    'Opens the Font Pairing Library — 15 heading/body pairings with live previews.'),
  live('ab-d-m1-6', 'm1', 'Website Launch Checklist', 'Checklist', 'ListChecks', 'mint', 'builder-vault/launch-checklist',
    'Opens the Launch Checklist — 58 items across nine sections, ticks saved to your account.'),

  // ── Module 2 ──────────────────────────────────────────────────────────────
  live('ab-d-m2-1', 'm2', 'Premium Color Palette Pack', 'Library', 'Palette', 'gold', 'builder-vault/palettes',
    'Opens the Color Palette Library, with a Best For label on every palette.'),
  live('ab-d-m2-2', 'm2', 'Font Pairing Cheat Sheet', 'Cheat Sheet', 'Type', 'sky2', 'builder-vault/fonts',
    'Opens the Font Pairing Library, including the document’s five typography rules.'),
  live('ab-d-m2-3', 'm2', 'UI Inspiration Collection', 'Library', 'Eye', 'flamingo', 'builder-vault/study',
    'Opens 50 Websites Every AI App Builder Should Study — what to look at on each one.'),
  pending('ab-d-m2-4', 'm2', 'Hero Section Templates', 'Template', 'LayoutTemplate', 'brand',
    'Hero layouts that answer “what is this?” before anyone scrolls.'),
  pending('ab-d-m2-5', 'm2', 'Button & CTA Library', 'Library', 'MousePointerClick', 'sun',
    'Button styles and call-to-action patterns that stay consistent across a site.'),
  live('ab-d-m2-6', 'm2', 'Design Checklist', 'Checklist', 'ListChecks', 'mint', 'builder-vault/uiux-checklist',
    'Opens the UI/UX Checklist — 67 items across 11 sections, including the Premium Design Test.'),
  pending('ab-d-m2-7', 'm2', 'Before & After Review Template', 'Template', 'GitCompare', 'sky2',
    'A side-by-side format for documenting what your redesign actually changed.'),

  // ── Module 3 ──────────────────────────────────────────────────────────────
  pending('ab-d-m3-1', 'm3', '10 Client Project Briefs', 'Workbook', 'Briefcase', 'brand',
    'Ten realistic client briefs — business, audience, goals, brand personality.'),
  pending('ab-d-m3-2', 'm3', 'Homepage Wireframe Templates', 'Template', 'LayoutTemplate', 'sky2',
    'The high-converting homepage flow as reusable wireframes.'),
  pending('ab-d-m3-3', 'm3', 'CTA Swipe File', 'Library', 'MousePointerClick', 'sun',
    'Call-to-action wording for booking, buying and enquiring.'),
  pending('ab-d-m3-4', 'm3', 'Testimonial Section Templates', 'Template', 'Quote', 'flamingo',
    'Social-proof layouts that read as credible rather than decorative.'),
  pending('ab-d-m3-5', 'm3', 'Landing Page Copy Framework', 'Guide', 'FileText', 'brand',
    'The section-by-section copy structure behind a page that converts.'),
  pending('ab-d-m3-6', 'm3', 'Client Discovery Questionnaire', 'Worksheet', 'HelpCircle', 'mint',
    'The questions to ask before you open the builder — Lesson 4’s framework as a form.'),
  live('ab-d-m3-7', 'm3', 'Website Review Checklist', 'Checklist', 'ListChecks', 'mint', 'builder-vault/uiux-checklist',
    'Opens the UI/UX Checklist — the design audit to run before you call a site finished.'),

  // ── Module 4 ──────────────────────────────────────────────────────────────
  live('ab-d-m4-1', 'm4', 'Product Planning Canvas', 'Worksheet', 'PencilLine', 'brand', 'module/ab-m9/lesson/ab-m9l1',
    'Opens the Builder Canvas — product name, problem, audience, core features, success metric. Your answers save to your account.'),
  pending('ab-d-m4-2', 'm4', 'Feature Prioritization Worksheet', 'Worksheet', 'ListFilter', 'sky2',
    'Sorting Version 1 features from Version 2 wishes.'),
  pending('ab-d-m4-3', 'm4', 'App Wireframe Templates', 'Template', 'LayoutTemplate', 'sky2',
    'Screen layouts for the common productivity-app patterns.'),
  live('ab-d-m4-4', 'm4', 'UX Checklist', 'Checklist', 'ListChecks', 'mint', 'builder-vault/uiux-checklist',
    'Opens the UI/UX Checklist — layout, navigation, forms, interactions and accessibility.'),
  pending('ab-d-m4-5', 'm4', 'User Testing Questionnaire', 'Worksheet', 'Users', 'sun',
    'What to ask the three people you hand your app to.'),
  pending('ab-d-m4-6', 'm4', 'Product Feedback Tracker', 'Tracker', 'ClipboardList', 'flamingo',
    'A place to record what confused people and what they asked for.'),
  live('ab-d-m4-7', 'm4', 'MVP Launch Checklist', 'Checklist', 'ListChecks', 'mint', 'builder-vault/launch-checklist',
    'Opens the Launch Checklist — everything to clear before a first version goes live.'),

  // ── Module 5 ──────────────────────────────────────────────────────────────
  live('ab-d-m5-1', 'm5', 'AI Feature Idea Vault (100+ ideas)', 'Library', 'Lightbulb', 'gold', 'builder-vault/ideas',
    'Opens the App Idea Generator — 90 app ideas across nine categories, each with a difficulty and monetisation badge.'),
  live('ab-d-m5-2', 'm5', 'AI Prompt Templates', 'Library', 'Sparkles', 'brand', 'builder-vault/recipes',
    'Opens Builder Recipes — 95 full prompts, including the AI-powered app builds.'),
  pending('ab-d-m5-3', 'm5', 'AI UX Best Practices', 'Guide', 'Bot', 'sky2',
    'How to present an AI feature so it feels helpful rather than gimmicky.'),
  pending('ab-d-m5-4', 'm5', 'Resume Builder UI Kit', 'Template', 'FileText', 'flamingo',
    'The screens behind the Lesson 3 project.'),
  pending('ab-d-m5-5', 'm5', 'Study App UI Kit', 'Template', 'GraduationCap', 'sky2',
    'The screens behind the Lesson 4 project.'),
  pending('ab-d-m5-6', 'm5', 'AI Integration Checklist', 'Checklist', 'ListChecks', 'mint',
    'The questions from Byte’s Product Review, as a pre-ship check.'),
  pending('ab-d-m5-7', 'm5', 'Feature Planning Worksheet', 'Worksheet', 'PencilLine', 'brand',
    'Design the feature before you build it — the Lesson 4 Builder Challenge as a form.'),

  // ── Module 6 ──────────────────────────────────────────────────────────────
  live('ab-d-m6-1', 'm6', 'Premium UI Component Library', 'Library', 'Component', 'brand', 'builder-vault/resources',
    'Opens the Resource Vault — shadcn/ui, Magic UI, Aceternity, Origin UI and more, with official links.'),
  live('ab-d-m6-2', 'm6', 'Animation Inspiration Pack', 'Library', 'Sparkles', 'sky2', 'builder-vault/resources',
    'Opens the Resource Vault’s animation section — LottieFiles, Motion One, GSAP, Framer Motion.'),
  live('ab-d-m6-3', 'm6', 'Mobile Design Checklist', 'Checklist', 'Smartphone', 'mint', 'builder-vault/uiux-checklist',
    'Opens the UI/UX Checklist — its Responsive Design section is this check.'),
  live('ab-d-m6-4', 'm6', 'Accessibility Checklist', 'Checklist', 'Accessibility', 'mint', 'builder-vault/uiux-checklist',
    'Opens the UI/UX Checklist — contrast, keyboard access, labels and readability.'),
  pending('ab-d-m6-5', 'm6', 'Performance Optimization Guide', 'Guide', 'Gauge', 'sun',
    'Images, fonts, lazy loading and the rest of the Lesson 4 list.'),
  live('ab-d-m6-6', 'm6', 'Product QA Checklist', 'Checklist', 'ListChecks', 'mint', 'builder-vault/launch-checklist',
    'Opens the Launch Checklist — its Testing and Final Review sections are the QA pass.'),
  pending('ab-d-m6-7', 'm6', 'Before & After Audit Template', 'Template', 'GitCompare', 'sky2',
    'Document the makeover with paired screenshots and what each change fixed.'),

  // ── Module 7 ──────────────────────────────────────────────────────────────
  live('ab-d-m7-1', 'm7', 'Launch Checklist', 'Checklist', 'Rocket', 'brand', 'builder-vault/launch-checklist',
    'Opens the Launch Checklist — design, responsiveness, performance, SEO, accessibility, testing, code quality, deployment, final review.'),
  pending('ab-d-m7-2', 'm7', 'Product Case Study Template', 'Template', 'FileText', 'sky2',
    'Problem, solution, features, decisions, biggest challenge, what’s next.'),
  pending('ab-d-m7-3', 'm7', 'Portfolio Project Template', 'Template', 'Briefcase', 'flamingo',
    'How each project should be presented on your portfolio site.'),
  pending('ab-d-m7-4', 'm7', 'Product Hunt Launch Guide', 'Guide', 'Rocket', 'sun',
    'What to prepare before posting a launch anywhere public.'),
  pending('ab-d-m7-5', 'm7', 'Feedback Collection Form', 'Worksheet', 'MessageSquare', 'mint',
    'The five questions to put in front of your first users.'),
  pending('ab-d-m7-6', 'm7', 'Version 2 Roadmap Template', 'Template', 'Map', 'brand',
    'Turning collected feedback into an ordered list of next changes.'),
  pending('ab-d-m7-7', 'm7', 'App Maintenance Checklist', 'Checklist', 'Wrench', 'mint',
    'What to check on a live project once it has actual users.'),

  // ── Graduation Kit ────────────────────────────────────────────────────────
  // The certificate is listed because the document lists it. STAIGE has no
  // certificate system and no certificate asset, so it is marked pending
  // rather than issuing a credential that doesn't exist.
  pending('ab-d-g-1', 'grad', 'AI App Builder Certificate', 'Guide', 'Award', 'gold',
    'Not yet available. STAIGE does not currently issue certificates, so nothing is generated here — your finished, deployed projects are the credential this course is built around.'),
  live('ab-d-g-2', 'grad', 'Portfolio Review Checklist', 'Checklist', 'ListChecks', 'mint', 'builder-vault/uiux-checklist',
    'Opens the UI/UX Checklist — run it over every project before it goes in your portfolio.'),
  live('ab-d-g-3', 'grad', '100 App Ideas Vault', 'Library', 'Lightbulb', 'gold', 'builder-vault/ideas',
    'Opens the App Idea Generator — 90 ideas, filterable by category, difficulty and monetisation.'),
  live('ab-d-g-4', 'grad', 'Product Planning Canvas', 'Worksheet', 'PencilLine', 'brand', 'module/ab-m9/lesson/ab-m9l1',
    'Opens the Builder Canvas from the Capstone — reusable for every product you plan after this one.'),
  pending('ab-d-g-5', 'grad', 'Founder Toolkit', 'Guide', 'Rocket', 'sun',
    'The founder-thinking questions from Module 8, collected in one place.'),
  pending('ab-d-g-6', 'grad', 'Client Proposal Template', 'Template', 'FileText', 'sky2',
    'How to price and propose a build to a real client.'),
  live('ab-d-g-7', 'grad', 'App Launch Checklist', 'Checklist', 'Rocket', 'brand', 'builder-vault/launch-checklist',
    'Opens the Launch Checklist — the same 58 checks, for every project after this course.'),
  live('ab-d-g-8', 'grad', 'Lifetime Resource Vault', 'Library', 'Package', 'flamingo', 'builder-vault/resources',
    'Opens the Resource Vault — 72 official tools and asset libraries across 16 categories.'),
]

export const downloadCount = downloads.length
export const liveDownloadCount = downloads.filter((d) => d.available).length
export const pendingDownloadCount = downloads.filter((d) => !d.available).length
