// Convert word/document.xml into a line-oriented text file that preserves
// heading level, list membership and bold runs — enough to rebuild the course
// hierarchy without shipping the DOCX anywhere.
//
//   node scripts/appbuilder/extract-docx.mjs <document.xml> [out.txt]
//
// Unzip the .docx first (a .docx IS a zip):  unzip -o "AI App Builder OS.docx" -d unz
// then point this at unz/word/document.xml. The .docx itself is never committed
// and never reaches the browser — only the generated data files do.
import fs from 'node:fs'

const [inPath, outPath = 'course.txt'] = process.argv.slice(2)
if (!inPath) {
  console.error('usage: node extract-docx.mjs <word/document.xml> [out.txt]')
  process.exit(1)
}

const xml = fs.readFileSync(inPath, 'utf8')

const decode = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
   .replace(/&apos;/g, "'").replace(/&#x?([0-9A-Fa-f]+);/g, (_, c) =>
     String.fromCodePoint(parseInt(c, /^x/i.test(_.slice(2, 3)) ? 16 : 10)))
   .replace(/&amp;/g, '&')

const paras = xml.split(/<w:p[ >]/).slice(1)
const out = []

for (const raw of paras) {
  const body = raw.slice(0, raw.indexOf('</w:p>') === -1 ? raw.length : raw.indexOf('</w:p>'))
  const styleM = body.match(/<w:pStyle w:val="([^"]+)"/)
  const style = styleM ? styleM[1] : ''
  const isList = /<w:numPr>/.test(body)
  const ilvlM = body.match(/<w:ilvl w:val="(\d+)"/)
  const ilvl = ilvlM ? Number(ilvlM[1]) : 0

  // text runs
  let text = ''
  const runRe = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g
  let m
  while ((m = runRe.exec(body))) text += decode(m[1])
  if (/<w:br\/>/.test(body) && !text) text = ''
  text = text.replace(/\s+/g, ' ').trim()

  let prefix = ''
  if (/^Heading(\d)/.test(style)) prefix = '#'.repeat(Number(style.match(/^Heading(\d)/)[1])) + ' '
  else if (style === 'Title') prefix = '# '
  else if (isList) prefix = '  '.repeat(ilvl) + '- '

  if (!text) { out.push(''); continue }
  out.push(prefix + text)
}

// collapse runs of blank lines
const lines = []
for (const l of out) {
  if (l === '' && lines[lines.length - 1] === '') continue
  lines.push(l)
}
fs.writeFileSync(outPath, lines.join('\n'), 'utf8')
console.log(`${outPath}: ${lines.length} lines, ${lines.join('\n').length} chars`)
