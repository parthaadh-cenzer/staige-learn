// ============================================================================
//  PDF exporter — guides, checklists, workbooks, cheat sheets, SOPs, roadmaps.
//
//  Renders the shared doc model (src/lib/resourceDoc.js) — the same object the
//  on-screen preview renders — so the two can't drift. Colours and type sizes
//  are the platform's own tokens, so a downloaded page looks like the preview
//  it came from rather than a generic report.
//
//  Loaded on demand (see exporters/index.js): jsPDF never reaches the landing
//  page bundle.
// ============================================================================
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { PALETTE, footerParts, saveBlob, winAnsi } from './shared'

const M = 48            // page margin
const FOOT = 40         // reserved footer band

export default function exportPdf(doc) {
  const pdf = new jsPDF({ unit: 'pt', format: 'a4', compress: true })
  const W = pdf.internal.pageSize.getWidth()
  const H = pdf.internal.pageSize.getHeight()
  const CONTENT = W - M * 2
  let y = M

  const ink = () => pdf.setTextColor(...PALETTE.ink)
  const muted = () => pdf.setTextColor(...PALETTE.muted)
  const faint = () => pdf.setTextColor(...PALETTE.faint)

  // Break to a new page when the next `need` points won't fit above the footer.
  const room = (need) => {
    if (y + need <= H - FOOT) return
    pdf.addPage()
    y = M
  }

  const text = (str, { size = 10, style = 'normal', font = 'helvetica', color = muted, gap = 4, indent = 0 } = {}) => {
    pdf.setFont(font, style)
    pdf.setFontSize(size)
    color()
    const lines = pdf.splitTextToSize(winAnsi(str), CONTENT - indent)
    lines.forEach((l) => {
      room(size + gap)
      pdf.text(l, M + indent, y)
      y += size + gap
    })
  }

  const rule = (pad = 10) => {
    room(pad + 2)
    y += pad
    pdf.setDrawColor(...PALETTE.line)
    pdf.setLineWidth(0.75)
    pdf.line(M, y, W - M, y)
    y += pad
  }

  // ── Header ────────────────────────────────────────────────────────────────
  text(doc.title, { size: 19, style: 'bold', color: ink, gap: 7 })
  const meta = [doc.type, doc.subtitle].filter(Boolean).join('  ·  ')
  if (meta) text(meta, { size: 9, color: faint, gap: 6 })
  if (doc.description) { y += 4; text(doc.description, { size: 10, color: muted, gap: 5 }) }
  rule()

  // ── Flow (the Blueprint one-pager) ────────────────────────────────────────
  if (doc.flow) {
    text('The loop, in the order the work happens.', { size: 9, style: 'italic', color: faint, gap: 8 })
    doc.flow.steps.forEach((s, i) => {
      room(34)
      // step chip
      pdf.setFillColor(...PALETTE.sage100)
      pdf.roundedRect(M, y - 9, 22, 16, 4, 4, 'F')
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(8); pdf.setTextColor(...PALETTE.brand)
      pdf.text(String(i + 1).padStart(2, '0'), M + 11, y + 2, { align: 'center' })

      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10.5); ink()
      pdf.text(winAnsi(s.name), M + 32, y + 2)
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); faint()
      pdf.text(winAnsi(s.detail), M + 32, y + 14)
      y += 30
      if (i < doc.flow.steps.length - 1) {
        // Drawn, not typed: a text "↓" can't be encoded by a cp1252 font, and
        // a vector arrow looks better than any substitute anyway.
        const cx = M + 11
        pdf.setDrawColor(...PALETTE.lineStrong)
        pdf.setLineWidth(1)
        pdf.line(cx, y - 12, cx, y - 4)
        pdf.setFillColor(...PALETTE.lineStrong)
        pdf.triangle(cx - 2.5, y - 5, cx + 2.5, y - 5, cx, y - 1, 'F')
        pdf.setLineWidth(0.75)
        y += 4
      }
    })
    if (doc.flow.note) { rule(8); text(doc.flow.note, { size: 9, style: 'italic', color: muted }) }
  }

  // ── Sections ──────────────────────────────────────────────────────────────
  doc.sections.forEach((s, si) => {
    if (si > 0 || doc.flow) y += 10
    room(40)
    text(s.label, { size: 12.5, style: 'bold', color: ink, gap: 5 })
    if (s.note) text(s.note, { size: 8.5, style: 'italic', color: faint, gap: 5 })
    y += 2

    s.body.forEach((b) => {
      if (b.kind === 'lines') {
        // Pre-formatted copy (templates, scripts). Courier because these blocks
        // are column-aligned — a proportional font mangles them. A light left
        // rule stands in for the preview's tinted <pre> box; unlike a filled
        // rect it survives a page break, so it's drawn per page segment.
        const lh = 11
        const indent = 12
        let segTop = y - 8
        const closeSegment = () => {
          pdf.setDrawColor(...PALETTE.lineStrong)
          pdf.setLineWidth(2)
          pdf.line(M + 2, segTop, M + 2, y - lh + 3)
          pdf.setLineWidth(0.75)
        }

        room(Math.min(b.lines.length * lh + 14, 90))
        segTop = y - 8
        pdf.setFont('courier', 'normal')
        pdf.setFontSize(8)
        pdf.setTextColor(...PALETTE.ink)

        b.lines.forEach((line) => {
          const wrapped = pdf.splitTextToSize(winAnsi(line) || ' ', CONTENT - indent - 6)
          wrapped.forEach((wl) => {
            if (y + lh > H - FOOT) {
              closeSegment()
              pdf.addPage()
              y = M
              segTop = y - 8
              pdf.setFont('courier', 'normal')
              pdf.setFontSize(8)
              pdf.setTextColor(...PALETTE.ink)
            }
            pdf.text(wl, M + indent, y)
            y += lh
          })
        })
        closeSegment()
        y += 8
      }

      if (b.kind === 'text') text(b.text, { size: 10, color: muted, gap: 5 })

      if (b.kind === 'fields') {
        b.fields.forEach((f) => {
          room(34)
          pdf.setFont('helvetica', 'bold'); pdf.setFontSize(8.5); pdf.setTextColor(...PALETTE.ink700)
          pdf.text(winAnsi(f), M, y)
          y += 6
          // The blank you write on — mirrors the preview's dashed box.
          pdf.setDrawColor(...PALETTE.lineStrong)
          pdf.setFillColor(...PALETTE.sage50)
          pdf.setLineDashPattern([2, 2], 0)
          pdf.roundedRect(M, y, CONTENT, 18, 3, 3, 'FD')
          pdf.setLineDashPattern([], 0)
          y += 26
        })
      }

      if (b.kind === 'checks') {
        b.items.forEach((i) => {
          room(18)
          pdf.setDrawColor(...PALETTE.lineStrong)
          pdf.setFillColor(255, 255, 255)
          pdf.roundedRect(M, y - 7.5, 9, 9, 2, 2, 'FD')
          if (i.done) {
            pdf.setFont('helvetica', 'bold'); pdf.setFontSize(8); pdf.setTextColor(...PALETTE.brand)
            pdf.text('x', M + 4.5, y - 0.5, { align: 'center' })
          }
          pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9.5)
          pdf.setTextColor(...(i.done ? PALETTE.faint : PALETTE.ink))
          const lines = pdf.splitTextToSize(winAnsi(i.text), CONTENT - 18)
          lines.forEach((l, li) => {
            if (li > 0) { y += 11; room(12) }
            pdf.text(l, M + 16, y)
          })
          y += 15
        })
      }

      if (b.kind === 'answers') {
        b.items.forEach((i) => {
          room(30)
          pdf.setFont('helvetica', 'bold'); pdf.setFontSize(8.5); pdf.setTextColor(...PALETTE.ink700)
          pdf.text(winAnsi(i.label), M, y); y += 12
          text(i.value || '—', { size: 10, color: i.value ? muted : faint, gap: 4, indent: 0 })
          y += 6
        })
      }

      if (b.kind === 'table' || b.kind === 'grid') {
        const isFillIn = b.kind === 'table'
        // `table` = a fill-in grid (row labels down the side, blank cells).
        // `grid`  = real data (calendar rows etc).
        const head = isFillIn ? [['', ...b.columns.map(winAnsi)]] : [b.columns.map(winAnsi)]
        const body = isFillIn
          ? b.rows.map((r) => [winAnsi(r), ...b.columns.map(() => '—')])
          : b.rows.map((r) => r.map(winAnsi))
        room(60)
        autoTable(pdf, {
          startY: y,
          head,
          body,
          margin: { left: M, right: M, bottom: FOOT },
          theme: 'grid',
          styles: {
            font: 'helvetica', fontSize: 7.8, cellPadding: 4.5,
            lineColor: PALETTE.line, lineWidth: 0.6, textColor: PALETTE.ink,
            overflow: 'linebreak', valign: 'middle',
          },
          headStyles: { fillColor: PALETTE.sage100, textColor: PALETTE.ink, fontStyle: 'bold' },
          columnStyles: isFillIn
            ? { 0: { fillColor: PALETTE.sage50, fontStyle: 'bold', cellWidth: 96 } }
            : {},
          didParseCell: (data) => {
            // Blank-cell placeholders stay faint so the grid reads as empty.
            if (isFillIn && data.section === 'body' && data.column.index > 0) {
              data.cell.styles.textColor = PALETTE.faint
              data.cell.styles.halign = 'center'
            }
          },
        })
        y = pdf.lastAutoTable.finalY + 12
      }
    })
  })

  paintFooters(pdf, doc)
  // `output('blob')` rather than jsPDF's own `save()`, so all three exporters
  // hand over through the same saveBlob path.
  saveBlob(pdf.output('blob'), `${doc.id}.pdf`)
}

// ── Footer: the STAIGE wordmark + page numbers, on every page ───────────────
function paintFooters(pdf, doc) {
  const { pre, accent, post, right } = footerParts(doc)
  const W = pdf.internal.pageSize.getWidth()
  const H = pdf.internal.pageSize.getHeight()
  const total = pdf.internal.getNumberOfPages()
  const baseline = H - 24

  for (let p = 1; p <= total; p++) {
    pdf.setPage(p)
    pdf.setDrawColor(...PALETTE.line)
    pdf.setLineWidth(0.75)
    pdf.line(M, baseline - 12, W - M, baseline - 12)

    // ST·AI·GE — the AI in the brand green, exactly as the platform renders it.
    pdf.setFontSize(8)
    let x = M
    pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...PALETTE.ink)
    pdf.text(pre, x, baseline); x += pdf.getTextWidth(pre)
    pdf.setTextColor(...PALETTE.brand)
    pdf.text(accent, x, baseline); x += pdf.getTextWidth(accent)
    pdf.setTextColor(...PALETTE.ink)
    pdf.text(post, x, baseline); x += pdf.getTextWidth(post)

    pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...PALETTE.faint)
    pdf.text(winAnsi(`  ·  ${right}`), x, baseline)

    // Page numbers only earn their place once there's more than one page.
    if (total > 1) {
      pdf.text(`${p} / ${total}`, W - M, baseline, { align: 'right' })
    }
  }
}
