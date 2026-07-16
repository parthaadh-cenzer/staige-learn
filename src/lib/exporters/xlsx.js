// ============================================================================
//  XLSX exporter — trackers, dashboards, calendars, matrices, scorecards and
//  the planners that are really grids.
//
//  Renders the shared doc model (src/lib/resourceDoc.js). Loaded on demand.
//
//  A note on what this deliberately doesn't do: SheetJS's community build
//  writes cell *values*, not cell *formats*. Bold, fills, borders and frozen
//  panes are all Pro features and are silently dropped — I verified that by
//  inspecting the generated XML rather than trusting the option. So this
//  doesn't pretend to style anything. It invests in what CE genuinely supports
//  and what actually matters in a spreadsheet: one sheet per table, sensible
//  column widths, and blank cells you can type straight into. The STAIGE
//  footer is a real row at the bottom of each sheet.
// ============================================================================
import * as XLSX from 'xlsx'
import { footerPlain, saveBlob } from './shared'

// Excel sheet names: ≤31 chars, and none of : \ / ? * [ ]
const sheetName = (s, used) => {
  let base = String(s || 'Sheet').replace(/[:\\/?*[\]]/g, ' ').trim().slice(0, 31) || 'Sheet'
  let name = base
  let n = 2
  while (used.has(name)) {
    const suffix = ` ${n++}`
    name = base.slice(0, 31 - suffix.length) + suffix
  }
  used.add(name)
  return name
}

// Column widths from the content, so nothing lands as ####.
const widths = (rows) => {
  const w = []
  rows.forEach((r) => r.forEach((c, i) => {
    const len = String(c ?? '').length
    w[i] = Math.max(w[i] || 10, Math.min(len + 2, 60))
  }))
  return w.map((wch) => ({ wch }))
}

export default function exportXlsx(doc) {
  const wb = XLSX.utils.book_new()
  const used = new Set()

  // Every table/grid becomes its own sheet — that's what makes it a workbook
  // rather than a text file with commas.
  const tables = []
  doc.sections.forEach((s) => {
    s.body.forEach((b) => {
      if (b.kind === 'table' || b.kind === 'grid') tables.push({ section: s, block: b })
    })
  })

  tables.forEach(({ section, block }) => {
    const isFillIn = block.kind === 'table'
    const head = isFillIn ? ['', ...block.columns] : block.columns
    const rows = isFillIn
      // Blank, not "—": a placeholder glyph in a spreadsheet has to be deleted
      // before you can type, and it breaks any formula over the column.
      ? block.rows.map((r) => [String(r), ...block.columns.map(() => '')])
      : block.rows.map((r) => r.map((c) => c ?? ''))

    const aoa = [[section.label]]
    if (section.note) aoa.push([section.note])
    aoa.push([], head, ...rows, [], [footerPlain(doc)])

    const ws = XLSX.utils.aoa_to_sheet(aoa)
    ws['!cols'] = widths([head, ...rows])
    // With a single table the section label is often an internal word like
    // "Columns" — the document's own name is the useful tab name. With several,
    // the section labels are what tell them apart.
    XLSX.utils.book_append_sheet(wb, ws, sheetName(tables.length === 1 ? doc.title : section.label, used))
  })

  // Anything that isn't a table (intro copy, fields, ready-made lines) goes on
  // a leading sheet so nothing from the preview is lost.
  const notes = [[doc.title]]
  if (doc.type || doc.subtitle) notes.push([[doc.type, doc.subtitle].filter(Boolean).join('  ·  ')])
  if (doc.description) notes.push([doc.description])
  notes.push([])

  if (doc.flow) {
    notes.push(['The loop, in the order the work happens.'], [])
    doc.flow.steps.forEach((s, i) => notes.push([`${String(i + 1).padStart(2, '0')}. ${s.name}`, s.detail]))
    if (doc.flow.note) notes.push([], [doc.flow.note])
    notes.push([])
  }

  let hasNotes = false
  doc.sections.forEach((s) => {
    const nonTable = s.body.filter((b) => b.kind !== 'table' && b.kind !== 'grid')
    if (!nonTable.length) return
    hasNotes = true
    notes.push([s.label])
    if (s.note) notes.push([s.note])
    nonTable.forEach((b) => {
      if (b.kind === 'lines') b.lines.forEach((l) => notes.push([String(l ?? '')]))
      if (b.kind === 'text') notes.push([b.text])
      if (b.kind === 'fields') b.fields.forEach((f) => notes.push([f, '']))
      if (b.kind === 'checks') b.items.forEach((i) => notes.push([i.done ? 'x' : '', i.text]))
      if (b.kind === 'answers') b.items.forEach((i) => notes.push([i.label, i.value || '']))
    })
    notes.push([])
  })
  notes.push([], [footerPlain(doc)])

  if (hasNotes || !tables.length) {
    const ws = XLSX.utils.aoa_to_sheet(notes)
    ws['!cols'] = [{ wch: 46 }, { wch: 60 }]
    // Appended last on purpose: opening a tracker should land on the tracker,
    // with the surrounding guidance a tab away.
    XLSX.utils.book_append_sheet(wb, ws, sheetName(tables.length ? 'Notes' : doc.title, used))
  }

  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveBlob(
    new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    `${doc.id}.xlsx`
  )
}
