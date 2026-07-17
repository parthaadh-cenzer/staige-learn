// ============================================================================
//  HeroStory — the problem → solution loop on the public homepage.
//
//  One ~9s CSS keyframe timeline tells the whole STAIGE pitch without a word
//  of the surrounding copy: Capy has a problem, Byte arrives, a practical
//  solution appears step by step, Capy ends up confident. Then it loops.
//
//  Data-driven on purpose: the story (problem line + solution steps) is a plain
//  object, so a marketing or side-hustle story is a new entry in STORIES, not a
//  rebuild. The choreography is fixed; only the words and emoji change.
//
//  Engineering constraints this file honours:
//  · Existing mascot art only (public/mascots/*.webp) — nothing redrawn. Mood
//    is conveyed by transforms: Capy droops while the problem is up and pops
//    upright when the solution lands.
//  · Pure CSS keyframes — no animation dependency, no JS timeline. The one
//    piece of JS pauses the animation when the tab is hidden.
//  · No layout shift: the scene box has a fixed height and everything inside
//    is absolutely positioned; animation only touches transform/opacity.
//  · prefers-reduced-motion: every animation is removed, and because each
//    element's RESTING styles are the final "solved" scene, what remains is a
//    complete static composition — not a blank stage.
//  · Mobile: the same scene, scaled tighter via responsive classes and a
//    smaller travel distance; nothing extra to maintain.
// ============================================================================
import { useEffect, useState } from 'react'
import { POSES } from './mascots/poses'

// ── Stories ─────────────────────────────────────────────────────────────────
// To add one: give it a problem line and exactly three steps (the timeline has
// three card slots). Swap via <HeroStory story={STORIES.marketing} />.
export const STORIES = {
  job: {
    id: 'job',
    problem: 'I need a job.',
    steps: [
      { emoji: '📄', label: 'Resume' },
      { emoji: '🎤', label: 'Interview' },
      { emoji: '🎉', label: 'Offer!' },
    ],
    sr: 'Capy has a problem: he needs a job. Byte arrives and breaks it into steps — build a resume, prepare for the interview — and Capy lands the offer, confident.',
  },
  marketing: {
    id: 'marketing',
    problem: 'Nobody sees my business.',
    steps: [
      { emoji: '✍️', label: 'Content' },
      { emoji: '📬', label: 'Email list' },
      { emoji: '📈', label: 'Customers' },
    ],
    sr: 'Capy has a problem: nobody sees his business. Byte arrives and breaks it into steps — content, an email list — and customers start arriving.',
  },
  sideHustle: {
    id: 'side-hustle',
    problem: 'I want to earn more.',
    steps: [
      { emoji: '💡', label: 'Offer' },
      { emoji: '🚀', label: 'Launch' },
      { emoji: '💰', label: 'First sale' },
    ],
    sr: 'Capy wants to earn more. Byte arrives and breaks it into steps — shape an offer, launch it — and Capy makes his first sale.',
  },
}

// The timeline, in one place. Percentages of the 9s loop.
const CSS = `
  .hs-scene [data-hs] { animation-duration: 9s; animation-iteration-count: infinite; animation-timing-function: ease-in-out; animation-fill-mode: both; }
  .hs-scene[data-paused="true"] [data-hs] { animation-play-state: paused; }

  /* Capy: droops while the problem is on screen, pops upright when solved. */
  @keyframes hs-capy {
    0%, 4%       { transform: translateY(0) rotate(0deg); }
    10%, 58%     { transform: translateY(5px) rotate(-4deg); }   /* worried slump */
    66%          { transform: translateY(2px) rotate(-1deg); }
    74%          { transform: translateY(-10px) rotate(2deg); }  /* the lift */
    80%, 96%     { transform: translateY(0) rotate(0deg); }      /* confident */
    100%         { transform: translateY(0) rotate(0deg); }
  }
  /* Problem bubble: in early, gone once Byte starts working. */
  @keyframes hs-problem {
    0%           { opacity: 0; transform: translateY(6px) scale(0.9); }
    7%, 40%      { opacity: 1; transform: translateY(0) scale(1); }
    48%, 100%    { opacity: 0; transform: translateY(-4px) scale(0.95); }
  }
  /* Byte: floats in from the right once the problem is stated, bobs gently,
     slips away at the end of the loop. */
  @keyframes hs-byte {
    0%, 16%      { opacity: 0; transform: translate(var(--hs-travel, 56px), -8px); }
    26%          { opacity: 1; transform: translate(0, 0); }
    44%          { transform: translate(0, -7px); }
    62%          { transform: translate(0, 0); }
    80%          { transform: translate(0, -5px); }
    94%          { opacity: 1; transform: translate(0, 0); }
    100%         { opacity: 0; transform: translate(12px, -6px); }
  }
  /* The "solved" spark next to Capy. */
  @keyframes hs-spark {
    0%, 72%      { opacity: 0; transform: scale(0.5) rotate(-20deg); }
    78%          { opacity: 1; transform: scale(1.15) rotate(8deg); }
    84%, 92%     { opacity: 1; transform: scale(1) rotate(0deg); }
    98%, 100%    { opacity: 0; transform: scale(0.8); }
  }

  .hs-capy    { animation-name: hs-capy; }
  .hs-problem { animation-name: hs-problem; opacity: 0; } /* resting: hidden — solved scenes have no problem */
  .hs-byte    { animation-name: hs-byte; }
  .hs-spark   { animation-name: hs-spark; }

  /* Solution cards pop in one at a time. Custom properties can't parameterise
     keyframe selectors, so the three card slots get three thin keyframe
     variants instead of a JS timeline. */
  @keyframes hs-step-1 { 0%,34% {opacity:0;transform:translateY(10px) scale(.92);} 40%,92% {opacity:1;transform:none;} 98%,100% {opacity:0;transform:translateY(-6px) scale(.96);} }
  @keyframes hs-step-2 { 0%,48% {opacity:0;transform:translateY(10px) scale(.92);} 54%,92% {opacity:1;transform:none;} 98%,100% {opacity:0;transform:translateY(-6px) scale(.96);} }
  @keyframes hs-step-3 { 0%,62% {opacity:0;transform:translateY(10px) scale(.92);} 68%,92% {opacity:1;transform:none;} 98%,100% {opacity:0;transform:translateY(-6px) scale(.96);} }
  .hs-step-1 { animation-name: hs-step-1; }
  .hs-step-2 { animation-name: hs-step-2; }
  .hs-step-3 { animation-name: hs-step-3; }

  @media (max-width: 640px) {
    .hs-scene { --hs-travel: 28px; } /* shorter journeys on small screens */
  }
  /* Reduced motion: no animation at all. Resting styles below compose the
     final solved scene, so the story is still told — as a picture. */
  @media (prefers-reduced-motion: reduce) {
    .hs-scene [data-hs] { animation: none !important; }
    .hs-scene .hs-problem { opacity: 0 !important; }
  }
`

export default function HeroStory({ story = STORIES.job, className = '' }) {
  // CSS animations don't pause on hidden tabs by themselves; this is the one
  // bit of JS in the component. Initialised from document.hidden because the
  // component can mount IN a hidden tab — visibilitychange alone would miss it.
  const [paused, setPaused] = useState(() => typeof document !== 'undefined' && document.hidden)
  useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return (
    <div className={className}>
      <style>{CSS}</style>

      {/* What a screen reader gets instead of choreography. */}
      <p className="sr-only">{story.sr}</p>

      <div
        aria-hidden="true"
        data-paused={paused}
        className="hs-scene relative h-64 w-full select-none sm:h-72"
      >
        {/* Capy — bottom left, carrying the problem. */}
        <div data-hs className="hs-capy absolute bottom-0 left-2 w-32 sm:left-4 sm:w-40">
          <img src={POSES.capy} alt="" className="block w-full" loading="eager" decoding="async" draggable={false} />
        </div>

        {/* The problem, as a speech bubble off Capy. */}
        <div data-hs className="hs-problem absolute left-24 top-8 sm:left-36 sm:top-10">
          <div className="relative rounded-2xl border border-line bg-card px-3.5 py-2 shadow-soft">
            <p className="whitespace-nowrap font-display text-sm font-bold text-ink-900">“{story.problem}”</p>
            <span className="absolute -bottom-1.5 left-4 h-3 w-3 rotate-45 border-b border-r border-line bg-card" />
          </div>
        </div>

        {/* Byte — floats in from the right to help. */}
        <div data-hs className="hs-byte absolute right-3 top-2 w-16 sm:right-8 sm:top-3 sm:w-20">
          <img src={POSES.byte} alt="" className="block w-full" loading="eager" decoding="async" draggable={false} />
        </div>

        {/* The solution, one practical step at a time. */}
        <div className="absolute bottom-4 right-2 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
          {story.steps.map((s, i) => (
            <div
              key={s.label}
              data-hs
              className={`hs-step-${i + 1} flex items-center gap-2 rounded-2xl border border-brand-200 bg-card px-3 py-1.5 shadow-soft sm:px-3.5 sm:py-2`}
            >
              <span className="text-base sm:text-lg">{s.emoji}</span>
              <span className="font-display text-xs font-bold text-ink-900 sm:text-sm">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Solved — a spark of confidence next to Capy. */}
        <div data-hs className="hs-spark absolute left-32 bottom-24 text-2xl sm:left-40 sm:bottom-28 sm:text-3xl">✨</div>
      </div>
    </div>
  )
}
