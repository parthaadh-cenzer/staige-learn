// ============================================================================
//  RESOURCE DOCUMENT MODEL
//
//  ONE model, rendered three ways. The preview (src/pages/Downloads.jsx) and
//  every exporter (src/lib/exporters/*) read this same doc, so a download can
//  never drift out of sync with what was on screen — that was the whole point
//  of replacing the old parallel `buildResourceText()` walk.
//
//  Producers: any surface with something to hand over builds a doc here —
//  course resources, checklists, the content calendar, the 7-day challenge.
//  Consumers: components/ResourcePreview.jsx and the pdf/docx/xlsx exporters.
//
//  ── Doc shape ─────────────────────────────────────────────────────────────
//  {
//    id, title, type, subtitle?, description?, courseTitle, format,
//    flow?: { title, subtitle, note, steps: [{ name, detail }] },
//    sections: [{
//      label, note?,
//      body: [ { kind: 'lines',  lines: [...] }
//            | { kind: 'fields', fields: [...] }        // blanks to fill in
//            | { kind: 'table',  columns: [...], rows: [...] }
//            | { kind: 'text',   text }
//            ]
//    }]
//  }
// ============================================================================

export const FORMATS = {
  pdf: { ext: 'pdf', label: 'PDF', hint: 'Downloads as a PDF' },
  docx: { ext: 'docx', label: 'Word', hint: 'Downloads as an editable Word document' },
  xlsx: { ext: 'xlsx', label: 'Excel', hint: 'Downloads as an Excel workbook' },
}

// ── Format selection ────────────────────────────────────────────────────────
// Driven by the resource's own `type`, which every resource already declares.
//   pdf  · read it, print it, tick it — nothing to fill in on a keyboard
//   docx · you rewrite it into your own words
//   xlsx · a grid you maintain over time
const TYPE_FORMAT = {
  // → PDF
  Guide: 'pdf', Checklist: 'pdf', Workbook: 'pdf', 'Cheat Sheet': 'pdf',
  SOP: 'pdf', Roadmap: 'pdf', Blueprint: 'pdf', 'Question Bank': 'pdf',
  Library: 'pdf', Challenge: 'pdf',
  // → DOCX
  Template: 'docx', Worksheet: 'docx', Journal: 'docx', Notes: 'docx',
  // → XLSX
  Tracker: 'xlsx', Dashboard: 'xlsx', Database: 'xlsx', Matrix: 'xlsx',
  Calculator: 'xlsx', Scorecard: 'xlsx', Calendar: 'xlsx',
}

// `Planner` is deliberately absent above: the brief lists planners under BOTH
// PDF and XLSX, and both are right depending on the planner. A planner built
// around a grid you keep filling in is a spreadsheet; one that's guidance with
// a few blanks is a PDF. So it's decided by shape, below.
const AMBIGUOUS = new Set(['Planner'])

const sectionKinds = (r) => {
  let tables = 0, other = 0
  ;(r.sections || []).forEach((s) => {
    if (s.table) tables++
    if (s.fields || s.lines) other++
  })
  return { tables, other }
}

export function pickFormat(resource) {
  // 1. An explicit `format` on the resource always wins — the escape hatch for
  //    the handful the rules below get wrong.
  if (resource.format && FORMATS[resource.format]) return resource.format

  // 2. A one-page visual flow (the Blueprint) is a PDF, whatever its type says.
  if (resource.steps?.length && !resource.sections?.length) return 'pdf'

  const { tables, other } = sectionKinds(resource)
  const mapped = TYPE_FORMAT[resource.type]

  // 3. Ambiguous types (and Templates) follow their content: if the thing is
  //    mostly a grid, it wants to be a spreadsheet.
  if (AMBIGUOUS.has(resource.type) || resource.type === 'Template') {
    if (tables > 0 && tables >= other) return 'xlsx'
    return mapped || 'docx'
  }

  return mapped || 'pdf'
}

// ── Builder ─────────────────────────────────────────────────────────────────
const bodyOf = (s) => {
  const body = []
  if (s.lines) body.push({ kind: 'lines', lines: s.lines })
  if (s.fields) body.push({ kind: 'fields', fields: s.fields })
  if (s.table) body.push({ kind: 'table', columns: s.table.columns, rows: s.table.rows })
  if (s.text) body.push({ kind: 'text', text: s.text })
  return body
}

export function buildResourceDoc(resource, courseTitle = 'STAIGE') {
  return {
    id: resource.id,
    title: resource.title,
    type: resource.type,
    subtitle: resource.moduleLabel,
    description: resource.description,
    courseTitle,
    format: pickFormat(resource),
    flow: resource.steps?.length
      ? { title: resource.title, subtitle: 'The loop, in the order the work happens.', steps: resource.steps, note: resource.note }
      : null,
    sections: (resource.sections || []).map((s) => ({
      label: s.label,
      note: s.note,
      body: bodyOf(s),
    })),
  }
}

// ── Other producers ─────────────────────────────────────────────────────────
// Everything that used to hand out a .txt now builds a doc instead, so it gets
// the same layout, the same footer and a real file format.

// An interactive checklist (AI Marketing OS) → a PDF you can print and tick.
export function checklistDoc(list, checked, courseTitle) {
  const done = checked.filter(Boolean).length
  return {
    id: list.id,
    title: list.name,
    type: 'Checklist',
    subtitle: list.subtitle,
    description: `${done} of ${list.items.length} complete.`,
    courseTitle,
    format: 'pdf',
    flow: null,
    sections: [{
      label: list.name,
      body: [{ kind: 'checks', items: list.items.map((text, i) => ({ text, done: Boolean(checked[i]) })) }],
    }],
  }
}

// The 30-day content calendar (AI Side Hustle OS) → a real spreadsheet.
export function calendarDoc({ weeklyStructure, thirtyDays }, courseTitle) {
  return {
    id: 'content-calendar',
    title: '30-Day Content Calendar',
    type: 'Calendar',
    subtitle: 'Never ask “what should I post?” again',
    description: 'Your weekly rhythm, then thirty days of prompts to work through.',
    courseTitle,
    format: 'xlsx',
    flow: null,
    sections: [
      {
        label: 'Weekly rhythm',
        body: [{
          kind: 'grid',
          columns: ['Day', 'Theme', 'Example'],
          rows: weeklyStructure.map((w) => [w.day, w.theme, w.example]),
        }],
      },
      {
        label: '30 days',
        body: [{
          kind: 'grid',
          columns: ['Day', 'Theme', 'Prompt', 'Posted?'],
          rows: thirtyDays.map((d) => [`Day ${d.day}`, d.theme, d.prompt, '']),
        }],
      },
    ],
  }
}

// The 7-day challenge (AI Side Hustle OS) → an editable record of your answers.
export function challengeDoc({ days, challenge, challengeComplete }, courseTitle) {
  return {
    id: '7-day-challenge',
    title: 'My 7-Day Challenge',
    type: 'Workbook',
    subtitle: `${challengeComplete.length} of ${days.length} days complete`,
    description: 'Everything you shipped during the challenge, in your own words.',
    courseTitle,
    format: 'docx',
    flow: null,
    sections: days.map((d) => ({
      label: `Day ${d.day}: ${d.title}${challengeComplete.includes(d.day) ? '  ✓' : ''}`,
      note: d.brief,
      body: [{
        kind: 'answers',
        items: d.fields.map((f) => {
          const v = challenge[d.day]?.[f.id]
          return { label: f.label, value: Array.isArray(v) ? v.join(', ') : v || '' }
        }),
      }],
    })),
  }
}

// An interactive worksheet block (any course) → an editable document with your
// answers already in it.
export function worksheetDoc(block, data, courseTitle) {
  return {
    id: block.id,
    title: block.title,
    type: 'Worksheet',
    subtitle: null,
    description: 'Your answers, saved from the lesson.',
    courseTitle,
    format: 'docx',
    flow: null,
    sections: [{
      label: block.title,
      body: [{
        kind: 'answers',
        items: block.fields.map((f) => {
          const v = data[f.id]
          return { label: f.label, value: Array.isArray(v) ? v.join(', ') : v || '' }
        }),
      }],
    }],
  }
}

// ── Plain text ──────────────────────────────────────────────────────────────
// NOT a download — this is the clipboard payload for "Copy template", which has
// to be text. Built from the same doc so it can't drift either.
export function docToText(doc) {
  const RULE = '─'.repeat(60)
  const out = [doc.title.toUpperCase(), RULE, '']
  if (doc.description) out.push(doc.description, '')
  if (doc.type) out.push(`Type: ${doc.type}`)
  if (doc.subtitle) out.push(`Related: ${doc.subtitle}`)
  out.push('', RULE, '')

  if (doc.flow) {
    out.push('THE LOOP', '')
    doc.flow.steps.forEach((s, i) => {
      out.push(`${String(i + 1).padStart(2, '0')}. ${s.name}`)
      out.push(`    ${s.detail}`)
      if (i < doc.flow.steps.length - 1) out.push('     ↓')
    })
    if (doc.flow.note) out.push('', doc.flow.note)
    out.push('', RULE, '')
  }

  doc.sections.forEach((s) => {
    out.push(s.label.toUpperCase(), '')
    if (s.note) out.push(`(${s.note})`, '')
    s.body.forEach((b) => {
      if (b.kind === 'lines') out.push(...b.lines, '')
      if (b.kind === 'text') out.push(b.text, '')
      if (b.kind === 'fields') b.fields.forEach((f) => out.push(`${f}:`, '', '_'.repeat(56), ''))
      if (b.kind === 'checks') b.items.forEach((i) => out.push(`[${i.done ? 'x' : ' '}] ${i.text}`))
      if (b.kind === 'answers') b.items.forEach((i) => out.push(`${i.label}:`, i.value || '(blank)', ''))
      if (b.kind === 'table') {
        out.push(`${'Row'.padEnd(28)}${b.columns.join(' | ')}`, '')
        b.rows.forEach((r) => out.push(`${String(r).padEnd(28)}${b.columns.map(() => '________').join(' | ')}`))
        out.push('')
      }
      if (b.kind === 'grid') {
        out.push(b.columns.join(' | '))
        b.rows.forEach((r) => out.push(r.join(' | ')))
        out.push('')
      }
    })
    out.push(RULE, '')
  })

  out.push('', `STAIGE · ${doc.courseTitle}`)
  return out.join('\n')
}
