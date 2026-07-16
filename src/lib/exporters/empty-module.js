// Stub. See vite.config.js → resolve.alias.
//
// jsPDF references html2canvas and dompurify at module scope for its `.html()`
// renderer. We never call `.html()` — the PDF exporter draws with the layout
// API — but Rollup can't prove that, so those two packages (~226 kB) would ship
// inside the pdf chunk. This takes their place.
//
// If jsPDF's `.html()` is ever needed, remove the aliases in vite.config.js and
// the real packages come back.
export default undefined
