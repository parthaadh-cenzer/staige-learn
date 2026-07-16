// Build the single official mascot asset (Capy + Byte duo) from the new render.
//
//   Assets/final image.png  →  public/mascots/{mascot,capy,byte}.webp
//
// The new render sits on a solid WHITE background (≈255). Byte is a *white*
// robot, so a global white-removal would eat his body — instead we border
// flood-fill (connectivity), which only clears background reachable from the
// edges and leaves Byte's interior whites untouched. Solo Capy/Byte crops are
// carved from the cleaned duo for small inline contexts (sidebar, tips, rows).
//
// Run: node scripts/build-mascot.mjs
import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const SRC = join(root, 'Assets', 'final image.png')
const OUT = join(root, 'public', 'mascots')
mkdirSync(OUT, { recursive: true })

// Background = near-white, low saturation. Tuned to keep Byte's edges/shadows.
const isBg = (r, g, b) => r >= 233 && g >= 233 && b >= 233 && Math.max(r, g, b) - Math.min(r, g, b) <= 12

// Clear only background pixels reachable from the image border (4-connectivity).
function knockoutFromBorder(data, w, h) {
  const visited = new Uint8Array(w * h)
  const stack = []
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return
    const p = y * w + x
    if (visited[p]) return
    const i = p * 4
    if (!isBg(data[i], data[i + 1], data[i + 2])) return
    visited[p] = 1
    stack.push(p)
  }
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1) }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y) }
  while (stack.length) {
    const p = stack.pop(), i = p * 4
    data[i + 3] = 0
    const x = p % w, y = (p / w) | 0
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1)
  }
}

// Soften the cut: any light-ish pixel touching transparency gets partial alpha.
function feather(data, w, h) {
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x, i = p * 4
      if (data[i + 3] === 0) continue
      const r = data[i], g = data[i + 1], b = data[i + 2]
      if (r < 215 || g < 215 || b < 215) continue
      if (data[(p - 1) * 4 + 3] === 0 || data[(p + 1) * 4 + 3] === 0 ||
          data[(p - w) * 4 + 3] === 0 || data[(p + w) * 4 + 3] === 0) {
        data[i + 3] = 110
      }
    }
  }
}

// Isolate the connected (non-transparent) blob containing a seed point, so a
// solo crop excludes the *other* character. Returns a fresh RGBA buffer with
// only that blob kept, plus its tight bounding box.
function component(data, w, h, seedX, seedY) {
  const A = (p) => data[p * 4 + 3] > 24
  const seed = seedY * w + seedX
  if (!A(seed)) throw new Error(`seed (${seedX},${seedY}) is transparent`)
  const keep = new Uint8Array(w * h)
  const stack = [seed]
  keep[seed] = 1
  let minX = w, minY = h, maxX = 0, maxY = 0
  while (stack.length) {
    const p = stack.pop()
    const x = p % w, y = (p / w) | 0
    if (x < minX) minX = x; if (x > maxX) maxX = x
    if (y < minY) minY = y; if (y > maxY) maxY = y
    for (const np of [p - 1, p + 1, p - w, p + w]) {
      if (np < 0 || np >= w * h || keep[np] || !A(np)) continue
      keep[np] = 1; stack.push(np)
    }
  }
  const out = Buffer.alloc(w * h * 4)
  for (let p = 0; p < w * h; p++) {
    if (!keep[p]) continue
    const i = p * 4
    out[i] = data[i]; out[i + 1] = data[i + 1]; out[i + 2] = data[i + 2]; out[i + 3] = data[i + 3]
  }
  return { buf: out, box: { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 } }
}

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: w, height: h } = info
knockoutFromBorder(data, w, h)
feather(data, w, h)

const rawOpts = { raw: { width: w, height: h, channels: 4 } }

// Full duo — the official mascot.
await sharp(data, rawOpts)
  .resize({ width: Math.min(w, 1200), withoutEnlargement: true })
  .webp({ quality: 90, alphaQuality: 100, effort: 6 })
  .toFile(join(OUT, 'mascot.webp'))
console.log('✓ mascot.webp (duo)')

// Solo crops via connected-component isolation (seeds inside each character).
const capy = component(data, w, h, Math.round(w * 0.30), Math.round(h * 0.45))
await sharp(capy.buf, rawOpts).extract(capy.box)
  .resize({ width: 760, withoutEnlargement: true })
  .webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(join(OUT, 'capy.webp'))
console.log('✓ capy.webp  (solo)')

// Seed Byte at the centroid of opaque pixels in the right region (x > 0.64w).
let sx = 0, sy = 0, sn = 0
for (let y = 0; y < h; y++) {
  for (let x = Math.round(w * 0.64); x < w; x++) {
    if (data[(y * w + x) * 4 + 3] > 24) { sx += x; sy += y; sn++ }
  }
}
const byte = component(data, w, h, Math.round(sx / sn), Math.round(sy / sn))
await sharp(byte.buf, rawOpts).extract(byte.box)
  .resize({ width: 560, withoutEnlargement: true })
  .webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(join(OUT, 'byte.webp'))
console.log('✓ byte.webp  (solo)')

console.log('\nDone → public/mascots/')
