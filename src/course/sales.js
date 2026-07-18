// ============================================================================
//  SALES VIEW · turns a hydrated course into everything its sales page renders.
//
//  The sales page template (pages/OsSalesPage.jsx) is completely generic — it
//  reads ONLY the object this function returns and never names a course. Two
//  kinds of thing feed it:
//
//   1. STRUCTURAL data, derived from the registry the course already has:
//      title, subtitle, skill level, modules (title + one-line subtitle),
//      counts of prompts / templates / downloads / checklists, price. A new OS
//      gets all of this for free the moment it's added to the registry.
//
//   2. PERSUASIVE data, authored per OS in `course.sales`: the punchy hero
//      headline, the "is this your problem?" list, the outcomes you'll build,
//      the who-it's-for lists, and any OS-specific FAQ. These are the things no
//      algorithm can invent — so they live in the course's data file, not here,
//      and a section simply doesn't render if its metadata is absent.
//
//  => Future creator-made Operating Systems receive the same sales page by
//     adding a `sales` block. Nothing in the template is hardcoded for the
//     current three. See any of data/courses/ai-*.js for the shape.
// ============================================================================
import { priceView } from '../../shared/catalog.mjs'

const len = (x) => (Array.isArray(x) ? x.length : 0)

// Resources are DERIVED from what the course actually ships, so the list is
// always honest: a course with no downloads shows no "Downloads" card.
function derivedResources(course) {
  const f = course.features || {}
  const promptCount = len(course.prompts?.items)
  const downloadItems = course.downloads?.items || []
  const templateCount = downloadItems.filter((d) => d.kind === 'template').length
  const downloadCount = downloadItems.length - templateCount
  const checklistCount = len(course.checklists?.items)
  const toolCount = len(course.resources?.items)
  const ideaCount = len(course.ideas?.items)

  const out = []
  if (f.prompts && promptCount)
    out.push({ icon: 'Library', title: 'Prompt Vault', text: `${promptCount} reusable prompts, filed by outcome — yours to keep.` })
  if (templateCount)
    out.push({ icon: 'Bot', title: 'AI Templates', text: `${templateCount} ready-to-use templates you fill in, not screenshots you retype.` })
  if (f.downloads && downloadCount)
    out.push({ icon: 'Download', title: 'Downloads', text: 'Editable Word, PDF and Excel files that leave with you.' })
  if (f.checklists && checklistCount)
    out.push({ icon: 'ListChecks', title: 'Checklists', text: `${checklistCount} step-by-step checklists — tick them off as you go.` })
  if (f.vault && toolCount)
    out.push({ icon: 'Wrench', title: 'Tool Library', text: 'Byte’s tools, organised by workflow — start with the essentials.' })
  if (f.ideas && ideaCount)
    out.push({ icon: 'Lightbulb', title: 'Idea Bank', text: `${ideaCount} ideas to filter by what fits you.` })
  if (f.badges || f.xp)
    out.push({ icon: 'Trophy', title: 'Achievements', text: 'XP and badges for what you build — not what you watched.' })

  // Any OS-specific extras the course wants to spotlight (e.g. a signature
  // bonus) are appended, so authoring stays additive.
  return [...out, ...(course.sales?.resources || [])]
}

// A generic FAQ every OS can answer from its own facts. Course-specific
// questions (e.g. "Will this get me a job?") are added via `course.sales.faq`
// and can override any of these by repeating the question.
function baseFaq(course) {
  const price = priceView(course.product)
  const priceText = price?.display || 'one payment'
  return [
    {
      q: 'How long does it take?',
      a: `${course.totalLessons} lessons across ${course.moduleCount} modules — go at your own pace. Most people work through a module in a sitting and keep the system afterwards.`,
    },
    {
      q: 'Do I keep access?',
      a: `Yes. It's ${priceText}, once — then ${course.title} stays on your account. Sign in on any device and it's there.`,
    },
    {
      q: 'Can beginners use it?',
      a: `It's built for ${course.skillLevel || 'beginners and up'}. Every lesson brings one real problem and the workflow to solve it — no prior AI experience assumed.`,
    },
    {
      q: 'Are updates included?',
      a: 'Yes. When tools or best practices change, the templates and prompts update in your account automatically. Nothing to re-buy.',
    },
    {
      q: 'Can I download the templates?',
      a: 'Yes. Every template and resource is a real Word, PDF or Excel file you download and keep — not a screenshot.',
    },
    {
      // Kept consistent in meaning with Terms (REFUND_POLICY) and the checkout
      // copy — one-time purchase, generally final, we'll fix genuine problems.
      q: 'Can I get a refund?',
      a: `It's a one-time payment, and each Operating System unlocks only itself — no subscription, and buying one doesn't unlock the others. Because access is immediate and includes downloads, purchases are generally final; if something goes wrong, contact us and we'll put it right.`,
    },
  ]
}

// Merge base + authored FAQ, letting an authored question replace a base one.
function mergeFaq(course) {
  const authored = course.sales?.faq || []
  const seen = new Set(authored.map((f) => f.q.trim().toLowerCase()))
  const base = baseFaq(course).filter((f) => !seen.has(f.q.trim().toLowerCase()))
  // Authored questions first — they're usually the ones a buyer most wants
  // answered ("will this actually work for me?").
  return [...authored, ...base]
}

// The hero fact-chips. Only shows what the course genuinely includes.
function heroHighlights(course) {
  const downloadItems = course.downloads?.items || []
  const templateCount = downloadItems.filter((d) => d.kind === 'template').length
  const downloadCount = downloadItems.length - templateCount
  return [
    course.skillLevel,
    `${course.moduleCount} modules`,
    `${course.totalLessons} lessons`,
    len(course.prompts?.items) && 'Prompt Vault included',
    templateCount && 'Templates included',
    downloadCount && 'Downloads included',
  ].filter(Boolean)
}

export function salesView(course) {
  const s = course.sales || {}
  return {
    // Section 1
    hero: {
      headline: s.hero?.headline || course.subtitle,
      sub: s.hero?.sub || course.description,
    },
    highlights: heroHighlights(course),
    // Section 2 — renders only when authored.
    problems: s.problems || [],
    // Section 3 — renders only when authored.
    builds: s.builds || [],
    // Section 4 — always derivable from the curriculum. A module's own
    // one-line subtitle and its lesson COUNT build confidence without ever
    // revealing lesson content.
    modules: (course.modules || []).map((m) => ({
      num: m.num,
      emoji: m.emoji,
      title: m.title,
      desc: m.subtitle || '',
      lessons: m.lessons?.length || 0,
    })),
    // Section 5 — derived, always present for a real OS.
    resources: derivedResources(course),
    // Section 7 — renders only when authored.
    audience: { yes: s.audience?.yes || [], no: s.audience?.no || [] },
    // Section 10 — base + authored.
    faq: mergeFaq(course),
    // Section 11
    finalHeadline: s.finalCta?.headline || `Ready to build your ${course.title.replace(/^AI /, '')}?`,
    finalSub: s.finalCta?.sub || 'Choose the problem you want to solve and start building.',
  }
}
