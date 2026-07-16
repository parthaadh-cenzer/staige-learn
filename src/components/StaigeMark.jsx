// ============================================================================
//  STAIGE wordmark
//  "ST·AI·GE" — the AI sitting inside the name is picked out in the platform's
//  existing brand green via `.heading-accent` (solid brand-600, the same class
//  every accented heading uses). No new colour is introduced, and the accent
//  can never drift from the rest of the platform because it's the same token.
//
//  The mark is text, not an image: it stays crisp at any size, costs nothing to
//  load, and is readable by screen readers as one word (the inner span is
//  aria-hidden-free on purpose — "STAIGE" reads correctly either way).
// ============================================================================
import { Link } from 'react-router-dom'
import { Byte } from './mascots'

const SIZE = {
  sm: { text: 'text-sm', byte: 30, tag: 'text-[9px]' },
  md: { text: 'text-lg', byte: 36, tag: 'text-[10px]' },
  lg: { text: 'text-2xl', byte: 44, tag: 'text-[11px]' },
}

export function StaigeWordmark({ size = 'md', tagline = 'Learn' }) {
  const s = SIZE[size] || SIZE.md
  return (
    <span className="flex items-center gap-2.5">
      <Byte size={s.byte} hover={false} />
      <span className="leading-tight">
        <span className={`block font-display ${s.text} font-extrabold tracking-tight text-ink-900`}>
          ST<span className="heading-accent">AI</span>GE
        </span>
        {tagline && (
          <span className={`block ${s.tag} font-semibold uppercase tracking-[0.18em] text-faint`}>{tagline}</span>
        )}
      </span>
    </span>
  )
}

// Top-left brand link. Goes home from anywhere on the platform.
export default function StaigeMark({ size = 'md', tagline = 'Learn', className = '' }) {
  return (
    <Link
      to="/"
      aria-label="STAIGE — home"
      className={`inline-flex rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${className}`}
    >
      <StaigeWordmark size={size} tagline={tagline} />
    </Link>
  )
}
