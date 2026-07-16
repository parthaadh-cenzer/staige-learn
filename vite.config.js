import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // jsPDF pulls in html2canvas (~198 kB) and dompurify (~28 kB) solely for
      // its `.html()` renderer, which we never call — our PDF exporter draws
      // with the layout API. Rollup can't drop them because jsPDF references
      // them unconditionally at module scope, so they're stubbed out here.
      // If anything ever needs jsPDF's `.html()`, delete these two lines.
      html2canvas: fileURLToPath(new URL('./src/lib/exporters/empty-module.js', import.meta.url)),
      dompurify: fileURLToPath(new URL('./src/lib/exporters/empty-module.js', import.meta.url)),
    },
  },
  server: {
    host: true, // bind all interfaces (helps when the browser resolves localhost to IPv6)
    port: 5180,
    open: false,
  },
})
