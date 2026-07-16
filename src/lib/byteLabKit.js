// ============================================================================
//  BYTE LAB KIT — the shared toolkit every course's mission recipes are built
//  from. Extracted from byteLab.js when a second course needed the same text
//  analysis; it lives here so recipe files can import it without importing each
//  other (byteLab.js → byteLabJobHunter.js → byteLabKit.js, no cycle).
//
//  Nothing here knows about any particular course.
// ============================================================================

// A field value, trimmed, with a friendly fallback when the learner left it blank.
export const val = (values, key, fallback = 'your business') => {
  const v = values?.[key]
  if (Array.isArray(v)) return v.length ? v.join(', ') : fallback
  const s = String(v ?? '').trim()
  return s || fallback
}

// Replace {{field}} tokens in a template string with the learner's answers.
export const fill = (str, values) =>
  String(str).replace(/\{\{(\w+)\}\}/g, (_, k) => val(values, k, `your ${k}`))

export const fillDeep = (node, values) => {
  if (typeof node === 'string') return fill(node, values)
  if (Array.isArray(node)) return node.map((n) => fillDeep(n, values))
  if (node && typeof node === 'object') {
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, fillDeep(v, values)]))
  }
  return node
}

export const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)))

// Drop a learner's answer into the middle of a sentence. Only the first letter
// is lowered — a blanket .toLowerCase() would turn "Writing LinkedIn posts"
// into "writing linkedin posts" and hand the tell straight back to them.
export const decap = (s) => String(s).charAt(0).toLowerCase() + String(s).slice(1)

// ── Text analysis (drives the scoring missions) ─────────────────────────────
// Deliberately simple and explainable — the learner should be able to tell why
// a line scored the way it did.

export const AI_CLICHES = [
  'unlock', 'unleash', 'revolutionize', 'game-changer', 'game changer', 'delve',
  'harness the power', 'in today’s fast-paced', "in today's fast-paced", 'elevate',
  'supercharge', 'seamless', 'cutting-edge', 'leverage the power', 'transformative',
  'embark', 'testament', 'tapestry', 'realm',
]

// Résumé-speak: the phrases that describe work instead of proving impact.
export const RESUME_FLUFF = [
  'responsible for', 'duties included', 'hard worker', 'team player', 'go-getter',
  'think outside the box', 'results-driven', 'detail-oriented', 'self-starter',
  'synergy', 'dynamic professional', 'proven track record', 'wear many hats',
  'passionate about', 'ninja', 'rockstar', 'guru',
]

export function analyze(text) {
  const t = String(text || '').trim()
  const words = t ? t.split(/\s+/).length : 0
  const hasQuestion = /\?/.test(t)
  const hasNumber = /\d/.test(t)
  const hasYou = /\byou(r|'re)?\b/i.test(t)
  const cliches = AI_CLICHES.filter((c) => t.toLowerCase().includes(c))
  return { text: t, words, hasQuestion, hasNumber, hasYou, cliches, empty: !t }
}

// Curiosity: short, specific, asks something or teases a number.
export const curiosityScore = (a) =>
  clamp(38 + (a.hasQuestion ? 18 : 0) + (a.hasNumber ? 16 : 0) + (a.words <= 12 ? 16 : a.words <= 20 ? 6 : -8) - a.cliches.length * 10)

// Clarity: plain words, one idea, not a paragraph.
export const clarityScore = (a) =>
  clamp(58 + (a.words <= 14 ? 22 : a.words <= 22 ? 8 : -16) + (a.hasYou ? 8 : 0) - a.cliches.length * 12)

// Emotional impact: speaks to a person, stakes, surprise.
export const emotionScore = (a) =>
  clamp(34 + (a.hasYou ? 22 : 0) + (a.hasQuestion ? 10 : 0) + (a.hasNumber ? 10 : 0) + (a.words >= 6 ? 10 : -10) - a.cliches.length * 8)

// Scroll-stop: the blend that actually decides whether they keep reading.
export const scrollScore = (a) => clamp((curiosityScore(a) + emotionScore(a) + clarityScore(a)) / 3)

export const scoreNote = (v) =>
  v >= 75 ? 'Strong — this earns the next sentence.' :
  v >= 55 ? 'Workable. One more pass makes it land.' :
  'This is where you’re losing people. Fix it first.'

// Byte's top-line verdict on a line. Derived from the same score the learner
// is about to read, so the headline can never contradict the bars beneath it.
export const verdict = (a) => {
  const s = scrollScore(a)
  if (a.cliches.length) return 'The idea is fine. The clichés are what’s killing it.'
  if (a.words > 14) return 'Too long. You lose people in the subordinate clause.'
  if (s >= 70) return 'Tight. This has a real shot at earning the second line.'
  if (s >= 55) return 'Nearly. One more pass and this lands.'
  return 'This doesn’t give anyone a reason to read on yet.'
}

// The three standard rewrites the course keeps coming back to.
// When the original line is full of clichés it isn't worth echoing back — the
// rewrites get built from the subject instead, which is the actual lesson.
export const rewrites = (line, subject, usable) => {
  const base = line.replace(/[.?!]+$/, '').trim()
  const s = decap(subject)
  return usable
    ? [
        { label: 'Safe version', text: `${base} — here’s what actually worked.` },
        { label: 'Viral version', text: `Most people get ${s} wrong. ${base}.` },
        { label: 'Professional version', text: `${base}: a practical breakdown.` },
      ]
    : [
        { label: 'Safe version', text: `What I learned about ${s} — and what actually worked.` },
        { label: 'Viral version', text: `Most people get ${s} completely wrong. Here’s the fix.` },
        { label: 'Professional version', text: `A practical look at ${s}, and the decisions behind it.` },
      ]
}

// ── Résumé / interview analysis (AI Job Hunter OS) ──────────────────────────

const ACTION_VERBS = [
  'led', 'built', 'launched', 'created', 'increased', 'reduced', 'delivered', 'drove',
  'designed', 'improved', 'managed', 'owned', 'shipped', 'grew', 'cut', 'negotiated',
  'automated', 'streamlined', 'developed', 'implemented', 'scaled', 'saved',
]

const FILLERS = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'kind of', 'sort of', 'i guess', 'i mean']

// One pass over a résumé bullet / interview answer. Everything the Job Hunter
// scoring missions need, computed from what the learner actually typed.
export function analyzeResume(text) {
  const t = String(text || '').trim()
  const lower = t.toLowerCase()
  const words = t ? t.split(/\s+/).length : 0
  return {
    text: t,
    words,
    empty: !t,
    // A metric is the single strongest signal a bullet is about impact.
    hasMetric: /\d+\s*%|\$\s*[\d,]+|\b\d[\d,.]*\s*(k|m|bn|x|hours?|days?|weeks?|months?|users?|customers?|clients?|people)\b|\b\d{2,}\b/i.test(t),
    hasPercent: /\d+\s*%/.test(t),
    startsWithVerb: ACTION_VERBS.some((v) => lower.startsWith(v)),
    actionVerbs: ACTION_VERBS.filter((v) => new RegExp(`\\b${v}\\b`, 'i').test(t)),
    fluff: RESUME_FLUFF.filter((c) => lower.includes(c)),
    fillers: FILLERS.filter((f) => new RegExp(`\\b${f.replace(/ /g, '\\s')}\\b`, 'i').test(t)),
    firstPersonHeavy: (lower.match(/\bi\b/g) || []).length > 4,
  }
}

// Pull the reusable core out of a résumé bullet so a rewrite can be built from
// it. Echoing the learner's raw text back produces nonsense the moment it
// contains fluff ("Led responsible for managing the accounts, was a team
// player…"), which is exactly the text most people paste in. So: strip the
// fluff phrases, drop any clause that was nothing but fluff, and remove the
// lead-in verb — leaving the noun phrase an action verb can attach to.
//
//   "Responsible for managing the company social media accounts,
//    was a real team player"   →   "the company social media accounts"
const LEAD_INS = /^(responsible for|duties included|in charge of|helped with|worked on|assisted with|tasked with)\s+/i
const LEAD_GERUND = /^(managing|leading|running|handling|overseeing|owning|doing|working on|supporting)\s+/i

// Words that carry no meaning on their own — what's left of "was a real team
// player" once "team player" is removed.
const FILLER_WORDS = /^(a|an|the|real|very|good|great|strong|highly|extremely|quite|and|was|is|were)$/i
const hasSubstance = (s) => s.split(/\s+/).filter((w) => w && !FILLER_WORDS.test(w)).length >= 2

// Removing a fluff phrase from mid-sentence leaves dangling connectives —
// "…and being a", "who was …". Trim them off both ends until it reads cleanly.
const TRAIL_JUNK = /\s+(and|or|but|being|been|a|an|the|who|that|which|with|for|of|to|in|on|at|by)$/i
const LEAD_JUNK = /^(and|or|but|who|that|which|was|is|were|being|been|of|with|for|to|in|on|at|by)\s+/i
const tidy = (s) => {
  let t = String(s).trim()
  let prev
  do {
    prev = t
    t = t.replace(TRAIL_JUNK, '').replace(LEAD_JUNK, '').trim()
  } while (t !== prev)
  return t
}

export function bulletCore(text) {
  const clauses = String(text || '').replace(/[.]+$/, '').split(/[;,]/).filter((c) => c.trim())

  const kept = clauses
    .map((c) => {
      const stripped = RESUME_FLUFF.reduce(
        (s, f) => s.replace(new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), ''),
        c
      ).replace(/\s+/g, ' ').trim()
      return { text: stripped.replace(/^(was|is|were|and)\s+/i, '').trim(), lostFluff: stripped !== c.trim() }
    })
    // Clauses that lost fluff must still say something. Clauses that never had
    // any are kept as-is — "Cut costs" is short but it's the actual bullet.
    .filter(({ text: t, lostFluff }) => (lostFluff ? hasSubstance(t) : t.length > 0))
    .map(({ text: t }) => t)

  const core = tidy((kept.length ? kept : clauses).join(', '))
  const stripped = tidy(core.replace(LEAD_INS, '').replace(LEAD_GERUND, ''))
  return stripped || String(text || '').trim()
}

// Impact: did you prove anything, or just describe the job?
export const impactScore = (a) =>
  clamp(30 + (a.hasMetric ? 34 : 0) + (a.hasPercent ? 8 : 0) + (a.startsWithVerb ? 14 : 0) + (a.actionVerbs.length ? 8 : 0) - a.fluff.length * 12)

// ATS: parseable, keyword-bearing, not a paragraph.
export const atsScore = (a) =>
  clamp(46 + (a.hasMetric ? 14 : 0) + (a.actionVerbs.length ? 12 : 0) + (a.words >= 8 && a.words <= 32 ? 16 : -10) - a.fluff.length * 10)

// Readability: a recruiter gives this about six seconds.
export const readabilityScore = (a) =>
  clamp(62 + (a.words <= 24 ? 20 : a.words <= 36 ? 4 : -20) + (a.startsWithVerb ? 8 : 0) - a.fluff.length * 8)

// Confidence (interview answers): structure and specifics, minus the hedging.
export const confidenceScore = (a) =>
  clamp(52 + (a.hasMetric ? 16 : 0) + (a.startsWithVerb ? 8 : 0) + (a.words >= 40 ? 10 : -8) - a.fillers.length * 9 - (a.firstPersonHeavy ? 6 : 0))

// STAR: does the answer actually carry all four beats?
export function starParts(text) {
  const t = String(text || '').toLowerCase()
  return {
    situation: /\b(when|while|during|at the time|context|we were|our team was)\b/.test(t),
    task: /\b(needed to|had to|my job|responsible|goal was|asked me|tasked)\b/.test(t),
    action: /\b(i |we )(led|built|created|ran|organi|redistribut|automat|schedul|implement|design|propos)/.test(t),
    result: /\d+\s*%|\$\s*[\d,]+|\b(result|increased|reduced|saved|delivered|launched|grew|improved)\b/.test(t),
  }
}

export const starScore = (text) => {
  const p = starParts(text)
  const hits = Object.values(p).filter(Boolean).length
  return clamp(18 + hits * 20)
}

export const resumeNote = (v) =>
  v >= 75 ? 'Strong — this is doing real work for you.' :
  v >= 55 ? 'Passable. One specific number would lift it.' :
  'This is costing you interviews. Fix it first.'
