// ============================================================================
//  DOCX exporter — the editable resources: templates, worksheets, journals,
//  interview notes, resume templates.
//
//  Renders the shared doc model (src/lib/resourceDoc.js), so it stays in step
//  with the preview. Loaded on demand — `docx` never reaches the landing page.
// ============================================================================
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  BorderStyle, AlignmentType, Footer, HeadingLevel, ShadingType,
} from 'docx'
import { HEX, footerParts, saveBlob } from './shared'

const BORDER = { style: BorderStyle.SINGLE, size: 4, color: HEX.line }
const CELL_BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER }

const p = (text, opts = {}) => new Paragraph({
  spacing: { after: opts.after ?? 120, before: opts.before ?? 0 },
  alignment: opts.align,
  children: [new TextRun({
    text: String(text ?? ''),
    bold: opts.bold,
    italics: opts.italics,
    size: opts.size ?? 20,             // half-points → 20 = 10pt
    color: opts.color ?? HEX.muted,
    font: opts.font ?? 'Calibri',
  })],
})

export default async function exportDocx(doc) {
  const body = []

  // ── Header ───────────────────────────────────────────────────────────────
  body.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 80 },
    children: [new TextRun({ text: doc.title, bold: true, size: 38, color: HEX.ink, font: 'Calibri' })],
  }))
  const meta = [doc.type, doc.subtitle].filter(Boolean).join('  ·  ')
  if (meta) body.push(p(meta, { size: 17, color: HEX.faint, after: 100 }))
  if (doc.description) body.push(p(doc.description, { size: 20, color: HEX.muted, after: 200 }))

  // ── Flow ─────────────────────────────────────────────────────────────────
  if (doc.flow) {
    doc.flow.steps.forEach((s, i) => {
      body.push(new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: `${String(i + 1).padStart(2, '0')}  `, bold: true, size: 18, color: HEX.brand, font: 'Calibri' }),
          new TextRun({ text: s.name, bold: true, size: 21, color: HEX.ink, font: 'Calibri' }),
          new TextRun({ text: `   ${s.detail}`, size: 18, color: HEX.faint, font: 'Calibri' }),
        ],
      }))
    })
    if (doc.flow.note) body.push(p(doc.flow.note, { italics: true, size: 18, before: 120, after: 200 }))
  }

  // ── Sections ─────────────────────────────────────────────────────────────
  doc.sections.forEach((s) => {
    body.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 280, after: 80 },
      children: [new TextRun({ text: s.label, bold: true, size: 25, color: HEX.ink, font: 'Calibri' })],
    }))
    if (s.note) body.push(p(s.note, { italics: true, size: 17, color: HEX.faint, after: 120 }))

    s.body.forEach((b) => {
      if (b.kind === 'lines') {
        // Pre-formatted copy — monospaced so the column alignment survives.
        b.lines.forEach((line) => body.push(new Paragraph({
          spacing: { after: 0, line: 240 },
          children: [new TextRun({ text: String(line ?? '') || ' ', font: 'Consolas', size: 17, color: HEX.ink })],
        })))
        body.push(p('', { after: 160 }))
      }

      if (b.kind === 'text') body.push(p(b.text, { size: 20 }))

      if (b.kind === 'fields') {
        // Label + a ruled line to write on — the editable equivalent of the
        // preview's dashed blank.
        b.fields.forEach((f) => {
          body.push(p(f, { bold: true, size: 18, color: HEX.ink700, after: 40 }))
          body.push(new Paragraph({
            spacing: { after: 160 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: HEX.lineStrong } },
            children: [new TextRun({ text: ' ', size: 20 })],
          }))
        })
      }

      if (b.kind === 'checks') {
        b.items.forEach((i) => body.push(new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: i.done ? '☒  ' : '☐  ', size: 22, color: i.done ? HEX.brand : HEX.lineStrong, font: 'Segoe UI Symbol' }),
            new TextRun({ text: i.text, size: 19, color: i.done ? HEX.faint : HEX.ink, strike: i.done, font: 'Calibri' }),
          ],
        })))
        body.push(p('', { after: 120 }))
      }

      if (b.kind === 'answers') {
        b.items.forEach((i) => {
          body.push(p(i.label, { bold: true, size: 18, color: HEX.ink700, after: 40 }))
          body.push(p(i.value || '—', { size: 20, color: i.value ? HEX.muted : HEX.faint, after: 160 }))
        })
      }

      if (b.kind === 'table' || b.kind === 'grid') {
        const isFillIn = b.kind === 'table'
        const cols = isFillIn ? ['', ...b.columns] : b.columns
        const rows = isFillIn
          ? b.rows.map((r) => [String(r), ...b.columns.map(() => '—')])
          : b.rows.map((r) => r.map((c) => String(c ?? '')))

        const cell = (txt, { header, rowHead } = {}) => new TableCell({
          borders: CELL_BORDERS,
          shading: header || rowHead
            ? { type: ShadingType.CLEAR, fill: header ? HEX.sage100 : HEX.sage50 }
            : undefined,
          margins: { top: 60, bottom: 60, left: 90, right: 90 },
          children: [new Paragraph({
            spacing: { after: 0 },
            alignment: !header && !rowHead && isFillIn ? AlignmentType.CENTER : undefined,
            children: [new TextRun({
              text: txt,
              bold: header || rowHead,
              size: 16,
              color: header || rowHead ? HEX.ink : (isFillIn ? HEX.faint : HEX.ink),
              font: 'Calibri',
            })],
          })],
        })

        body.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ tableHeader: true, children: cols.map((c) => cell(String(c), { header: true })) }),
            ...rows.map((r) => new TableRow({
              children: r.map((c, ci) => cell(c, { rowHead: isFillIn && ci === 0 })),
            })),
          ],
        }))
        body.push(p('', { after: 200 }))
      }
    })
  })

  // ── Footer: the small STAIGE wordmark ────────────────────────────────────
  const { pre, accent, post, right } = footerParts(doc)
  const footer = new Footer({
    children: [new Paragraph({
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: HEX.line } },
      spacing: { before: 120 },
      children: [
        new TextRun({ text: pre, bold: true, size: 15, color: HEX.ink, font: 'Calibri' }),
        new TextRun({ text: accent, bold: true, size: 15, color: HEX.brand, font: 'Calibri' }),
        new TextRun({ text: post, bold: true, size: 15, color: HEX.ink, font: 'Calibri' }),
        new TextRun({ text: `   ·   ${right}`, size: 15, color: HEX.faint, font: 'Calibri' }),
      ],
    })],
  })

  const file = new Document({
    creator: 'STAIGE',
    title: doc.title,
    description: doc.description || '',
    sections: [{
      properties: { page: { margin: { top: 900, right: 900, bottom: 900, left: 900 } } },
      footers: { default: footer },
      children: body,
    }],
  })

  saveBlob(await Packer.toBlob(file), `${doc.id}.docx`)
}
