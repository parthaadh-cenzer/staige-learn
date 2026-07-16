// ============================================================================
//  Download dispatcher.
//
//  One entry point for every download on the platform. It picks the format the
//  doc declares and dynamically imports only that exporter — jsPDF, docx and
//  SheetJS are heavy, and nobody should pay for all three (or any of them) just
//  to load a page. Each is fetched the first time someone actually downloads.
//
//  Formats:
//    pdf  · guides, checklists, workbooks, cheat sheets, SOPs, roadmaps
//    docx · templates, worksheets, journals, notes — things you rewrite
//    xlsx · trackers, dashboards, calendars, matrices — grids you maintain
// ============================================================================
import { FORMATS } from '../resourceDoc'

export async function downloadDoc(doc) {
  // An explicitly attached file (a designed PDF, say) always wins over
  // generating one.
  if (doc.file) {
    const a = document.createElement('a')
    a.href = doc.file
    a.download = doc.file.split('/').pop()
    a.click()
    return
  }

  const format = FORMATS[doc.format] ? doc.format : 'pdf'
  switch (format) {
    case 'docx': {
      const { default: exportDocx } = await import('./docx')
      return exportDocx(doc)
    }
    case 'xlsx': {
      const { default: exportXlsx } = await import('./xlsx')
      return exportXlsx(doc)
    }
    default: {
      const { default: exportPdf } = await import('./pdf')
      return exportPdf(doc)
    }
  }
}
