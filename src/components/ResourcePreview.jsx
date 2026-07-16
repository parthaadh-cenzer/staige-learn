// ============================================================================
//  ResourcePreview — renders a resource doc (src/lib/resourceDoc.js) on screen.
//
//  This is the *same object* the PDF/DOCX/XLSX exporters render, which is the
//  point: what you see here and what lands in your downloads folder are two
//  renderings of one source, so they can't drift apart.
//
//  The layout is unchanged from the original inline preview — extracting it was
//  about removing the second, parallel implementation, not redesigning it.
// ============================================================================
import Blocks from './Blocks'

function Body({ block }) {
  // Pre-formatted copy: templates and scripts whose column alignment carries
  // meaning. Monospaced, which is what <pre> is for — the exporters use Courier
  // for the same blocks so the two match.
  if (block.kind === 'lines') {
    return (
      <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl border border-line bg-sage-50 p-3.5 font-mono text-[11px] leading-relaxed text-ink-800">
        {block.lines.join('\n')}
      </pre>
    )
  }

  if (block.kind === 'text') {
    return <p className="mt-3 text-sm leading-relaxed text-ink-700">{block.text}</p>
  }

  if (block.kind === 'fields') {
    return (
      <div className="mt-3 space-y-2.5">
        {block.fields.map((f) => (
          <div key={f}>
            <p className="text-xs font-semibold text-ink-700">{f}</p>
            <div className="mt-1 h-8 rounded-xl border border-dashed border-line-strong bg-sage-50" />
          </div>
        ))}
      </div>
    )
  }

  if (block.kind === 'checks') {
    return (
      <ul className="mt-3 space-y-1.5">
        {block.items.map((i, n) => (
          <li key={n} className="flex items-start gap-2.5 text-sm">
            <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border text-[10px] font-bold ${i.done ? 'border-brand-500 bg-brand-500 text-white' : 'border-line-strong bg-card'}`}>
              {i.done ? '✓' : ''}
            </span>
            <span className={i.done ? 'text-faint line-through' : 'text-ink-800'}>{i.text}</span>
          </li>
        ))}
      </ul>
    )
  }

  if (block.kind === 'answers') {
    return (
      <div className="mt-3 space-y-2.5">
        {block.items.map((i, n) => (
          <div key={n}>
            <p className="text-xs font-semibold text-ink-700">{i.label}</p>
            <p className={`mt-0.5 whitespace-pre-line text-sm ${i.value ? 'text-ink-800' : 'text-faint'}`}>{i.value || '—'}</p>
          </div>
        ))}
      </div>
    )
  }

  // `table` is a fill-in grid (row labels down the side, blank cells);
  // `grid` is real data (a calendar, say).
  if (block.kind === 'table' || block.kind === 'grid') {
    const fillIn = block.kind === 'table'
    return (
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-left text-xs">
          <thead>
            <tr>
              {fillIn && <th className="border border-line bg-sage-100 px-2.5 py-2 font-semibold text-ink-800" />}
              {block.columns.map((c) => (
                <th key={c} className="border border-line bg-sage-100 px-2.5 py-2 font-semibold text-ink-800">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri}>
                {fillIn ? (
                  <>
                    <th scope="row" className="border border-line bg-sage-50 px-2.5 py-2 text-left font-semibold text-ink-800">{row}</th>
                    {block.columns.map((c) => (
                      <td key={c} className="border border-line px-2.5 py-2 text-center text-faint">—</td>
                    ))}
                  </>
                ) : (
                  row.map((cell, ci) => (
                    <td key={ci} className={`border border-line px-2.5 py-2 ${ci === 0 ? 'font-semibold text-ink-800' : 'text-ink-700'}`}>
                      {cell || <span className="text-faint">—</span>}
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return null
}

export default function ResourcePreview({ doc }) {
  if (!doc) return null
  return (
    <div className="space-y-5">
      {doc.description && <p className="text-sm leading-relaxed text-ink-700">{doc.description}</p>}

      {doc.flow && (
        <Blocks blocks={[{
          t: 'blueprint',
          title: doc.flow.title,
          subtitle: doc.flow.subtitle,
          steps: doc.flow.steps,
          note: doc.flow.note,
        }]} />
      )}

      {doc.sections.map((s, i) => (
        <div key={i} className="card p-5">
          <p className="font-display font-bold text-ink-900">{s.label}</p>
          {s.note && <p className="mt-1 text-xs italic text-muted">{s.note}</p>}
          {s.body.map((b, bi) => <Body key={bi} block={b} />)}
        </div>
      ))}
    </div>
  )
}
