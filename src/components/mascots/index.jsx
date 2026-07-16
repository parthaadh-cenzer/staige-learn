// Capy & Byte mascot framework — public API.
// Reusable across the Staige ecosystem: import named components instead of
// hardcoding <img> tags, so future courses share one consistent mascot system.
import Mascot from './Mascot'
import { POSES, MODULE_MASCOT, BONUS_MASCOT, poseList } from './poses'

export { Mascot, POSES, MODULE_MASCOT, BONUS_MASCOT, poseList }

// ── Inline characters (px-sized). Byte hovers, Capy breathes. ───────────────
// `mood`/`blink`/`float` are accepted for call-site compatibility and ignored;
// motion is driven by the framework so every placement feels alive consistently.
export function Byte({ size = 48, anim = 'float', className = '', proximity = false, alt = 'Byte, your AI assistant' }) {
  return <Mascot pose="byte" anim={anim} width={size} className={className} proximity={proximity} alt={alt} />
}
export function Capy({ size = 64, anim = 'breathe', className = '', proximity = false, alt = 'Capy, the entrepreneur' }) {
  return <Mascot pose="capy" anim={anim} width={size} className={className} proximity={proximity} alt={alt} />
}

// ── Named compositions ───────────────────────────────────────────────────────
export const CapyByteHero = (props) => (
  <Mascot pose="hero" anim="float" proximity priority alt="Capy and Byte, ready to start" {...props} />
)
export const CapyByteDuo = (props) => <Mascot pose="hero" anim="float" alt="Capy and Byte" {...props} />
export const CapyCelebrate = (props) => <Mascot pose="capy" anim="celebrate" hover={false} alt="Capy celebrating" {...props} />
export const ByteCelebrate = (props) => <Mascot pose="byte" anim="celebrate" hover={false} alt="Byte celebrating" {...props} />

// Pick the right solo for a context key ('capy' | 'byte').
export const ContextMascot = ({ who = 'byte', ...props }) =>
  who === 'capy' ? <Capy {...props} /> : <Byte {...props} />
