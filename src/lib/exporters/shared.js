// ============================================================================
//  Shared bits for every exporter — the palette and the footer.
//
//  The colours are the platform's own tokens (tailwind.config.js), transcribed
//  once here as RGB/hex because jsPDF/docx/xlsx can't read Tailwind classes. If
//  the brand green ever changes, it changes in both places — there's a check
//  that asserts these still match the config.
// ============================================================================

// tailwind.config.js → colors
export const PALETTE = {
  ink: [25, 39, 31],          // ink-900  #19271F
  ink700: [58, 74, 64],       // ink-700  #3A4A40
  muted: [94, 111, 102],      // muted    #5E6F66
  faint: [138, 152, 143],     // faint    #8A988F
  line: [229, 236, 224],      // line     #E5ECE0
  lineStrong: [214, 224, 206],// line-strong #D6E0CE
  sage50: [244, 248, 242],    // sage-50  #F4F8F2
  sage100: [234, 241, 230],   // sage-100 #EAF1E6
  brand: [74, 138, 46],       // brand-600 #4A8A2E — the STAIGE green
}

export const HEX = {
  ink: '19271F',
  ink700: '3A4A40',
  muted: '5E6F66',
  faint: '8A988F',
  line: 'E5ECE0',
  lineStrong: 'D6E0CE',
  sage50: 'F4F8F2',
  sage100: 'EAF1E6',
  brand: '4A8A2E',
}

// The one branding element: a small STAIGE wordmark in the footer, with the AI
// picked out in the brand green exactly as the platform renders it on screen.
// Split into parts so each exporter can colour the middle run.
export function footerParts(doc) {
  return {
    pre: 'ST',
    accent: 'AI',
    post: 'GE',
    right: doc.courseTitle || 'STAIGE',
  }
}

export const footerPlain = (doc) => `STAIGE · ${doc.courseTitle || ''}`.trim().replace(/ ·\s*$/, '')

// ── cp1252 safety (PDF only) ────────────────────────────────────────────────
// jsPDF's built-in fonts are single-byte cp1252. Anything outside that range
// isn't rejected — it's silently truncated to its low byte and renders as a
// *different* character. "↓" (U+2193) came out as a left curly quote, eleven
// times, in the Blueprint. So every string that reaches the PDF goes through
// this first.
//
// DOCX and XLSX are UTF-8 and need none of this — they get the real glyphs.
const SUBSTITUTIONS = [
  [/[→⇒]/g, '->'],   // → ⇒
  [/[←⇐]/g, '<-'],   // ← ⇐
  [/[↓⇓]/g, 'v'],    // ↓ ⇓
  [/[↑⇑]/g, '^'],    // ↑ ⇑
  [/✓|✔/g, 'v'],     // ✓ ✔  (paired with × below for good/bad lists)
  [/✗|✘|❌/g, '×'], // ✗ ✘ ❌ → × (a real cross, and cp1252)
  [/─/g, '-'],            // ─ box-drawing rule
  [/[‘’]/g, '’'],
  [/[“”]/g, '"'],
  [/…/g, '...'],
  // Coloured tier markers: the label right after them carries the meaning.
  [/[\u{1F7E2}\u{1F7E1}\u{1F535}\u{1F534}\u{1F7E0}\u{1F7E3}]/gu, '•'],
]

// Everything cp1252 can represent.
const CP1252_EXTRA = new Set([
  0x20ac, 0x201a, 0x0192, 0x201e, 0x2026, 0x2020, 0x2021, 0x02c6, 0x2030, 0x0160,
  0x2039, 0x0152, 0x017d, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2013, 0x2014,
  0x02dc, 0x2122, 0x0161, 0x203a, 0x0153, 0x017e, 0x0178,
])
const encodable = (cp) => cp <= 0x7e || (cp >= 0xa0 && cp <= 0xff) || CP1252_EXTRA.has(cp)

export function winAnsi(input) {
  let s = String(input ?? '')
  for (const [re, to] of SUBSTITUTIONS) s = s.replace(re, to)
  // Anything still unrepresentable (stray emoji, CJK…) is dropped rather than
  // allowed to render as the wrong glyph. Silent-but-correct beats confident-
  // but-wrong.
  let out = ''
  for (const ch of s) out += encodable(ch.codePointAt(0)) ? ch : ''
  return out
}

// Kick off a browser download from a Blob.
export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
