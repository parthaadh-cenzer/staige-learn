// ============================================================================
//  BYTE LAB · the engine behind every "Marketing Mission"
//
//  Whenever the course says "Byte generates / reviews / scores something", the
//  lesson renders a `bytelab` block (see components/Blocks.jsx) and that block
//  calls `generate()` below.
//
//  ── HOW RESPONSES ARE PRODUCED TODAY ──────────────────────────────────────
//  Locally, from hand-authored recipes. No network, no API key, no failure
//  mode: a mission always returns a useful, structured answer that reflects
//  what the learner typed. Scoring recipes read the learner's actual text
//  (length, questions, numbers, clichés), so the feedback is real — not random.
//
//  ── WIRING UP A LIVE MODEL LATER ──────────────────────────────────────────
//  `generate()` is the ONLY integration point. Swap its body for an API call
//  that returns the same Result shape and every mission in the course upgrades
//  at once. Keep the local recipes as the fallback for when the call fails, so
//  the course never breaks in front of a learner.
//
//  ── Result shape ──────────────────────────────────────────────────────────
//  {
//    headline: string,                       // Byte's one-line verdict
//    scores?:  [{ label, value /* 0-100 */, note }],
//    sections: [{ label, items?: string[], text?: string }],
//    note?:    string,                       // closing Byte tip
//  }
// ============================================================================

// ── Toolkit ─────────────────────────────────────────────────────────────────
// Text analysis, scoring and interpolation helpers live in byteLabKit.js so
// every course's recipe file can share them.
import {
  val, fillDeep, clamp, decap, analyze,
  curiosityScore, clarityScore, emotionScore, scrollScore,
  scoreNote, verdict, rewrites,
} from './byteLabKit'
import { JOB_HUNTER_RECIPES } from './byteLabJobHunter'

// ── Recipes ─────────────────────────────────────────────────────────────────
// A recipe is either:
//   • a template object  → {{field}} tokens are filled from the learner's answers
//   • a function(values) → returns the Result shape (used for scoring/analysis)
//
// Recipe ids are namespaced per course (`m1-…` = AI Marketing OS, `jh-…` = AI
// Job Hunter OS) and merged into one map at the bottom of this file.

const MARKETING_RECIPES = {
  // ── Module 1 · Welcome ────────────────────────────────────────────────────
  'm1-workflow': (v) => {
    const task = val(v, 'task', 'writing marketing content')
    return {
      headline: `Perfect. “${task}” is exactly the kind of task this course kills.`,
      sections: [
        { label: 'By the end, you’ll have a workflow that can', items: [
          'Generate ideas on demand',
          'Write the first draft for you',
          'Improve the hook until it earns attention',
          'Rewrite the same idea for a different audience',
          'Schedule it so it ships without you',
        ]},
        { label: 'The maths', text: `Today, ${decap(task)} probably eats about 2 hours. With a workflow behind it, expect roughly 20 minutes — and a better result, because you spend that time editing instead of staring at a blank page.` },
      ],
      note: 'You don’t need to learn every AI tool. You need to solve this one problem, repeatedly, without dreading it.',
    }
  },

  // ── Module 2 · Content Creation ───────────────────────────────────────────
  'm2-ideas': (v) => {
    const topic = val(v, 'topic', 'your topic')
    return {
      headline: `Here’s a week of ${topic} content from one word.`,
      sections: [
        { label: '10 content ideas', items: [
          `The biggest myth about ${topic}`,
          `5 mistakes beginners make with ${topic}`,
          `What I got wrong about ${topic} for two years`,
          `A 5-minute ${topic} routine that actually sticks`,
          `${topic}: what changed in the last 12 months`,
          `The cheapest way to get started with ${topic}`,
          `Why most ${topic} advice fails ordinary people`,
          `A before-and-after story from ${topic}`,
          `The one ${topic} metric worth tracking`,
          `What I'd do differently if I started ${topic} today`,
        ]},
        { label: '5 headline ideas', items: [
          `Nobody tells you this about ${topic}`,
          `I tried ${topic} for 30 days. Here’s the honest result.`,
          `The ${topic} mistake costing you hours every week`,
          `${topic} is simpler than the internet makes it look`,
          `Stop doing ${topic} the hard way`,
        ]},
        { label: '3 content angles', items: [
          `Contrarian — argue against the popular ${topic} advice`,
          `Teaching — one specific, repeatable ${topic} process`,
          `Story — what ${topic} looked like before and after`,
        ]},
      ],
      note: 'Pick one. Don’t try to publish all ten — that’s how people quit in week two.',
    }
  },

  'm2-prompt': {
    headline: 'That’s a real prompt now — specific inputs, specific outputs.',
    sections: [
      { label: 'Your assembled prompt', text: 'You’re a {{tone}} marketing strategist. Write a {{platform}} post for {{audience}} with the goal of {{goal}}. Use a {{tone}} tone, open with a hook that earns the second line, keep it scannable, and end with this call-to-action: {{cta}}.' },
      { label: 'Why this works', items: [
        'Audience — {{audience}} — stops the model writing for “everyone”, which reads like nobody',
        'Goal — {{goal}} — decides what gets cut',
        'Platform — {{platform}} — sets the length, formatting and register',
        'Tone — {{tone}} — is the difference between your voice and generic AI voice',
        'CTA — {{cta}} — gives the reader somewhere to go',
      ]},
      { label: 'Before you paste it', text: 'Add one thing only you know — a number from your business, a client’s exact words, a mistake you made. That single detail is what makes it sound like you and not like the internet.' },
    ],
    note: 'Save this prompt. You’ll reuse the skeleton every week and only swap the five inputs.',
  },

  'm2-repurpose': (v) => {
    const idea = val(v, 'idea', 'your idea')
    return {
      headline: 'One idea. Seven assets. No rewriting from scratch.',
      sections: [
        { label: 'LinkedIn post', text: `Open with the tension in “${idea}”, give three short lessons, close with a question. Short lines. No hashtags soup.` },
        { label: 'Instagram caption', text: `Lead with the most surprising sentence from “${idea}”, then 3 quick bullets, then a soft CTA to save the post.` },
        { label: 'X thread', text: `Tweet 1 = the claim. Tweets 2–6 = one point each from “${idea}”. Final tweet = the summary people screenshot.` },
        { label: 'Facebook post', text: `Tell “${idea}” as a story with a beginning, a mistake, and what changed. Longer sentences are fine here.` },
        { label: 'Newsletter intro', text: `Two paragraphs: the problem “${idea}” solves, and what the reader will be able to do by the end.` },
        { label: 'Blog outline', text: `H1: ${idea} · H2 the problem · H2 the method · H2 a worked example · H2 the mistakes · FAQ · conclusion.` },
        { label: 'Reel script', text: `0–3s hook: the boldest line in “${idea}”. 3–20s: three fast points. 20–30s: the CTA.` },
      ],
      note: 'Adapting beats rewriting. Same idea, seven shapes — that’s a week of content from one thought.',
    }
  },

  'm2-hooks': (v) => {
    const a = analyze(val(v, 'headline', ''))
    const subject = val(v, 'subject', 'this topic')
    if (a.empty) return null
    return {
      headline: verdict(a),
      scores: [
        { label: 'Curiosity', value: curiosityScore(a), note: a.hasQuestion || a.hasNumber ? 'You give the reader a reason to want the next line.' : 'Nothing here makes me need to keep reading. Add a question or a number.' },
        { label: 'Clarity', value: clarityScore(a), note: a.words <= 14 ? 'One idea, plainly said.' : 'Cut it to one idea. Long hooks read as effort.' },
        { label: 'Emotional impact', value: emotionScore(a), note: a.hasYou ? 'You’re talking to a person, not an audience — that helps.' : 'Say “you”. Nobody feels addressed by “businesses”.' },
        { label: 'Scroll potential', value: scrollScore(a), note: scoreNote(scrollScore(a)) },
      ],
      sections: [
        ...(a.cliches.length ? [{ label: 'Cut these', items: a.cliches.map((c) => `“${c}” — this is the phrase that makes it read as AI-written`) }] : []),
        { label: 'Three rewrites', items: rewrites(a.text, subject, a.cliches.length === 0).map((r) => `${r.label}: ${r.text}`) },
      ],
      note: 'The first sentence has one job: earn the second sentence. That’s all.',
    }
  },

  'm2-humanize': (v) => {
    const a = analyze(val(v, 'draft', ''))
    if (a.empty) return null
    return {
      headline: a.cliches.length ? `Found ${a.cliches.length} phrase${a.cliches.length > 1 ? 's' : ''} that give this away as AI-written.` : 'No obvious AI tells — now it’s just about rhythm.',
      scores: [
        { label: 'Readability', value: clarityScore(a), note: a.words > 60 ? 'Break it up. Long paragraphs get skimmed, then skipped.' : 'Good length — a person can finish this.' },
        { label: 'Sounds human', value: clamp(88 - a.cliches.length * 18 - (a.words > 60 ? 12 : 0)), note: a.cliches.length ? 'Cut the clichés and this reads like a person.' : 'This sounds like someone, not something.' },
      ],
      sections: [
        ...(a.cliches.length ? [{ label: 'AI clichés to remove', items: a.cliches.map((c) => `“${c}”`) }] : []),
        { label: 'The swap that fixes most AI writing', text: 'Instead of “Unlock the power of AI to revolutionize your marketing” → “AI can save you hours every week — if you know how to use it.” Same meaning. One of them sounds like a human wrote it.' },
        { label: 'Do this to your draft', items: [
          'Delete every adjective that isn’t carrying weight',
          'Cut any sentence you wouldn’t say out loud',
          'Vary the sentence length — all-medium sentences read robotic',
          'Keep one specific detail: a number, a name, a moment',
        ]},
      ],
      note: 'Too perfect is the tell. Simple wins.',
    }
  },

  'm2-batch': (v) => {
    const freq = val(v, 'frequency', 'a few times a week')
    return {
      headline: `Posting ${freq}? Then you need one session, not seven.`,
      sections: [
        { label: 'Your weekly batch', items: [
          'Monday — Ideas. Generate more than you need, keep the best.',
          'Tuesday — Writing. Draft everything in one sitting, edit nothing.',
          'Wednesday — Design. Visuals for the whole batch at once.',
          'Thursday — Schedule. Load it all in, then close the tab.',
          'Friday — Review. What performed, what didn’t, what to repeat.',
        ]},
        { label: 'Why batching wins', text: 'Context-switching is the tax. Writing five posts in one session costs far less than five sessions of one post, because you only warm up once.' },
      ],
      note: 'Stop creating content every day. Create it once, publish it all week.',
    }
  },

  'm2-voice': (v) => {
    const tone = val(v, 'tone', 'Friendly')
    const topic = val(v, 'topic', 'our product')
    const lines = {
      Friendly: `Honestly? ${topic} took us a while to get right — here’s what finally worked.`,
      Professional: `A practical breakdown of ${topic}, and the decisions behind it.`,
      Luxury: `${topic}. Considered, unhurried, and built to last.`,
      Bold: `Everyone’s doing ${topic} wrong. We fixed it.`,
      Educational: `Here’s how ${topic} actually works — in three steps.`,
      Funny: `We tried ${topic} the hard way first. Obviously.`,
      Minimal: `${topic}. That’s it. That’s the post.`,
    }
    return {
      headline: `Same message, seven personalities. Yours reads ${tone}.`,
      sections: [
        { label: `Your pick — ${tone}`, text: lines[tone] || lines.Friendly },
        { label: 'The same idea in every other tone', items: Object.entries(lines).filter(([k]) => k !== tone).map(([k, t]) => `${k}: ${t}`) },
      ],
      note: 'Read them side by side and one will feel like you. That’s your brand voice — write it down and reuse it.',
    }
  },

  'm2-kit': (v) => {
    const biz = val(v, 'business', 'I help small businesses grow using AI')
    return {
      headline: 'Your content kit is built. One sentence in, a week of marketing out.',
      sections: [
        { label: 'LinkedIn post', text: `Hook: “${biz}” — and the part nobody mentions. Then three short lessons and a question to close.` },
        { label: 'Instagram caption', text: `${biz}. Here’s what that actually looks like day to day 👇 (3 bullets, then “save this”).` },
        { label: 'X thread', text: `1/ ${biz}. 2/ The mistake everyone makes first. 3/ What to do instead. 4/ A worked example. 5/ The summary.` },
        { label: 'Email introduction', text: `Subject: the thing nobody tells you. Body: ${biz} — and the one change that made it work.` },
        { label: 'Landing page headline', text: `${biz} — without the guesswork.` },
        { label: '10 hook ideas', items: [
          'The advice everyone repeats — and why it fails',
          'What two years of doing this taught me',
          'The 15-minute version of a 2-hour task',
          'Nobody talks about this part',
          'I was wrong about this for a long time',
          'The cheapest fix, first',
          'Here’s the number that changed my mind',
          'Most people quit right before this step',
          'Steal my exact process',
          'This took me 6 months to learn. It takes you 3 minutes.',
        ]},
        { label: '5 CTA variations', items: [
          'What would you add? →',
          'Save this for the next time you’re stuck.',
          'Want the template? Say the word.',
          'Try it this week and tell me what broke.',
          'Follow for the rest of the system.',
        ]},
      ],
      note: 'That’s Module 2 done: one idea now becomes every asset you need. Next we make it look good.',
    }
  },

  // ── Module 3 · Design Studio ──────────────────────────────────────────────
  'm3-design': (v) => ({
    headline: `Here’s how I’d lay out “${val(v, 'idea', 'your design')}”.`,
    sections: [
      { label: 'Layout', text: 'One focal point, top-left entry, generous margins. If everything is emphasised, nothing is. Decide what the eye hits first and protect it.' },
      { label: 'Colour palette', text: 'One dominant colour, one accent, one neutral. That’s it. The accent is for the single thing you want clicked.' },
      { label: 'Typography', text: 'Two fonts maximum — one for headings, one for body. Size difference should be obvious, not subtle.' },
      { label: 'Image style', text: 'Pick a lane and stay in it: all photography, or all illustration. Mixing styles is what makes a brand look improvised.' },
    ],
    note: 'Good design isn’t creativity — it’s clarity. If it reads in 3 seconds, it works.',
  }),

  'm3-imageprompt': (v) => {
    const desc = val(v, 'image', 'a product photo')
    return {
      headline: 'Your prompt was a description. Here’s a brief.',
      sections: [
        { label: 'You wrote', text: desc },
        { label: 'Byte’s version', text: `${desc}, shot on 50mm, soft directional window light from the left, shallow depth of field, muted natural palette, generous negative space on the right for headline text, photorealistic, no text, no logos.` },
        { label: 'What changed', items: [
          'Subject — kept exactly what you asked for',
          'Light — named, so it stops being random',
          'Composition — negative space reserved for your copy',
          'Palette — constrained, so it matches your brand',
          'Exclusions — “no text, no logos” saves you a regeneration',
        ]},
      ],
      note: 'Image prompts fail for the same reason writing prompts fail: not wrong, just vague.',
    }
  },

  'm3-social': (v) => {
    const post = val(v, 'post', 'your post')
    return {
      headline: `Three changes would lift “${post}” immediately.`,
      sections: [
        { label: 'Better layout', text: 'Move the headline to the top third. On a phone, the bottom half of a feed image is frequently cropped or ignored.' },
        { label: 'Better spacing', text: 'Double your margins and delete one element. Crowding reads as amateur faster than any font choice.' },
        { label: 'Better CTA placement', text: 'One CTA, bottom-right, high contrast. Two CTAs means the reader picks neither.' },
      ],
      note: 'People decide whether to read your post before they read your post.',
    }
  },

  'm3-brand': (v) => {
    const p = val(v, 'personality', 'Modern')
    const guides = {
      Modern: { colour: 'One saturated accent on a near-white base. Lots of air.', type: 'Geometric sans, tight headings, generous body spacing.', img: 'Clean product shots, real light, no stock handshakes.' },
      Luxury: { colour: 'Deep neutral base, one metallic or muted accent. Never bright.', type: 'A serif for headings, restrained sans for body. Wide letter-spacing.', img: 'Sparse, dark, macro detail. Show craft, not people.' },
      Friendly: { colour: 'Warm base, soft secondary, rounded everything.', type: 'Rounded sans, larger body size, short lines.', img: 'People mid-action, candid, natural colour.' },
      Minimal: { colour: 'Black, white, one accent used almost never.', type: 'One font, two weights. Discipline is the design.', img: 'Single subject, huge negative space.' },
      Bold: { colour: 'High-contrast pairs. Colour blocking over gradients.', type: 'Heavy display headings, plain body. Size does the shouting.', img: 'Tight crops, strong angles, saturated.' },
      Corporate: { colour: 'Blue-leaning neutrals, one supporting accent, consistent everywhere.', type: 'Neutral sans, strict hierarchy, no personality in the body.', img: 'Real teams, real offices, consistent grade.' },
    }
    const g = guides[p] || guides.Modern
    return {
      headline: `A ${p.toLowerCase()} style guide — copy this into your brand doc.`,
      sections: [
        { label: 'Colour', text: g.colour },
        { label: 'Typography', text: g.type },
        { label: 'Imagery', text: g.img },
        { label: 'Rules that keep it consistent', items: [
          'One accent colour, used only for the action you want taken',
          'Two fonts maximum, forever',
          'Same corner radius on every card and button',
          'Same icon family — never mix outline and filled',
          'Logo gets clear space equal to its own height',
        ]},
      ],
      note: 'Consistency is what makes a small brand look established. Pick the rules once, then stop deciding.',
    }
  },

  'm3-deck': (v) => {
    const topic = val(v, 'topic', 'your topic')
    return {
      headline: `A deck outline for “${topic}” that won’t look like PowerPoint.`,
      sections: [
        { label: 'Structure', items: [
          '1 · Title — the promise, not the agenda',
          '2 · The problem, in the audience’s words',
          '3 · Why the usual fix fails',
          `4 · Your approach to ${topic}`,
          '5 · Proof — one number, one story',
          '6 · How it works (three steps, no more)',
          '7 · What it costs / what it takes',
          '8 · The single next step',
        ]},
        { label: 'Visual per slide', items: [
          'Title — full-bleed image, text bottom-left',
          'Problem — one stat, enormous, nothing else',
          'Approach — a simple three-node diagram',
          'Proof — one chart, one highlighted bar',
          'Next step — plain slide, one sentence, one button-shaped CTA',
        ]},
        { label: 'The rule', text: 'One idea per slide. If a slide needs a paragraph, it’s a document — send it instead.' },
      ],
      note: 'Slides support you. They aren’t the handout. Nobody has ever complained a deck was too easy to read.',
    }
  },

  'm3-template': (v) => {
    const type = val(v, 'type', 'Instagram post')
    return {
      headline: `A reusable ${type} template beats designing from scratch every time.`,
      sections: [
        { label: 'Fixed elements (never change)', items: ['Logo position and size', 'Brand colours', 'Font pair and heading size', 'Corner radius and margins'] },
        { label: 'Swappable elements (change every post)', items: ['Headline', 'Supporting image', 'One accent detail', 'CTA text'] },
        { label: 'Make three variants', items: [`${type} — text-led`, `${type} — image-led`, `${type} — quote or stat`] },
      ],
      note: 'Design the template once. After that, publishing is filling in blanks — which is the point.',
    }
  },

  'm3-review': (v) => {
    const a = analyze(val(v, 'design', ''))
    if (a.empty) return null
    return {
      headline: 'Reviewed. Here’s what’s helping and what’s costing you.',
      scores: [
        { label: 'Readability', value: clarityScore(a), note: 'Can a stranger get the message in 3 seconds, on a phone, at arm’s length?' },
        { label: 'Visual hierarchy', value: clamp(curiosityScore(a) + 8), note: 'There should be exactly one thing the eye hits first.' },
        { label: 'Branding consistency', value: clamp(emotionScore(a) + 10), note: 'Same fonts, same colours, same radius as your last five posts.' },
      ],
      sections: [
        { label: 'The six mistakes to check for', items: [
          'Too much text — cut it in half, then again',
          'Poor contrast — light grey on white is invisible outdoors',
          'Inconsistent fonts — two maximum',
          'Low-quality images — a blurry photo undoes good layout',
          'Weak hierarchy — everything bold means nothing is',
          'No focal point — decide what wins',
        ]},
        { label: 'Accessibility', items: [
          'Body text at 4.5:1 contrast minimum against its background',
          'Don’t use colour alone to carry meaning',
          'Real text beats text baked into an image — screen readers can’t read pixels',
          'Add alt text describing the message, not the decoration',
        ]},
      ],
      note: 'Design isn’t decoration. It’s whether the message survives the scroll.',
    }
  },

  'm3-assetpack': (v) => ({
    headline: `A full asset pack for “${val(v, 'business', 'your business')}” — all of it AI-assisted.`,
    sections: [
      { label: 'Logo', text: 'Wordmark in your heading font, one accent colour, one simple mark. Resist the illustration — it dates fastest.' },
      { label: 'Social media post', text: 'Headline top-third, image beneath, CTA bottom-right. Template it.' },
      { label: 'Instagram carousel', text: 'Slide 1 hook · 2–4 one point each · 5 recap · 6 CTA. Same layout every slide.' },
      { label: 'LinkedIn graphic', text: 'Text-led, high contrast, readable at thumbnail size. Assume no one taps to expand.' },
      { label: 'Presentation cover', text: 'Full-bleed image, title bottom-left, logo small and top-right.' },
      { label: 'Webinar banner', text: 'Promise, date, one CTA. Nothing else earns the space.' },
      { label: 'Website hero image', text: 'Negative space on the side where your headline sits. Generate it with the space already in the prompt.' },
    ],
    note: 'Module 3 done. You now have a look. Next: make it move.',
  }),

  // ── Module 4 · Video Marketing ────────────────────────────────────────────
  'm4-videotype': (v) => {
    const type = val(v, 'type', 'Instagram Reel')
    const flows = {
      'Instagram Reel': 'Hook in 3s → one idea → text on screen throughout → CTA in the caption, not the video.',
      TikTok: 'Talk first, title card never. Cut every pause. Trend audio low under your voice.',
      'YouTube Short': 'Front-load the payoff, then explain. Loop the last second into the first.',
      'Product Demo': 'Problem (5s) → the product doing the thing (30s) → the result (10s). No feature tours.',
      'Webinar Promo': 'The promise → who it’s for → the date → one CTA. 30 seconds, hard stop.',
      Advertisement: 'Hook → pain → proof → offer → CTA. Test five hooks against one body.',
    }
    return {
      headline: `${type} it is. Here’s the workflow that fits it.`,
      sections: [
        { label: 'Your format', text: flows[type] || flows['Instagram Reel'] },
        { label: 'The repeatable loop', items: [
          'Script it in one pass — don’t edit while writing',
          'Record in one take, mistakes included',
          'Let AI cut silences and generate captions',
          'Reframe for vertical automatically',
          'Publish, then repurpose the same footage everywhere else',
        ]},
      ],
      note: 'You don’t need to become a video editor. You need a workflow you can repeat when you don’t feel like it.',
    }
  },

  'm4-script': (v) => {
    const p = val(v, 'product', 'your product')
    return {
      headline: `Two scripts for ${p} — same idea, two lengths.`,
      sections: [
        { label: 'Hook (first 3 seconds)', text: `“You’re spending hours on something ${p} does in minutes.”` },
        { label: '30-second script', text: `0–3s: the hook. 3–10s: the problem, in one sentence, in their words. 10–22s: ${p} solving it on screen — show, don’t narrate. 22–30s: the result, then the CTA.` },
        { label: '60-second script', text: `0–3s: the hook. 3–12s: the problem and what it costs. 12–25s: why the usual fix fails. 25–45s: ${p}, three beats, each one visible. 45–55s: proof — a number or a customer line. 55–60s: one CTA.` },
        { label: 'CTA', text: `“Link in bio — try ${p} on the task you’ve been avoiding all week.”` },
      ],
      note: 'Write for the ear. If you wouldn’t say it out loud, cut it.',
    }
  },

  'm4-style': (v) => {
    const style = val(v, 'style', 'Faceless')
    const map = {
      'Talking head': { tools: 'Your phone, Descript for editing, ElevenLabs only if you need pickups.', flow: 'Highest trust, lowest production. One light, one mic, one take.' },
      Faceless: { tools: 'Stock or AI b-roll, ElevenLabs voice, CapCut for assembly.', flow: 'Scales fastest. Lives or dies on script and pacing.' },
      'Product showcase': { tools: 'Phone on a tripod, Canva for text, CapCut for cuts.', flow: 'Show the product doing the job. Nobody needs your logo animation.' },
      'Animated explainer': { tools: 'Canva or after-effects templates, AI voiceover.', flow: 'Best for abstract products where there’s nothing to film.' },
      'AI-generated visuals': { tools: 'Image model for stills, video model for motion, CapCut to cut.', flow: 'Great for hooks and b-roll. Weak for anything needing continuity.' },
    }
    const m = map[style] || map.Faceless
    return {
      headline: `${style} suits you. Here’s the stack.`,
      sections: [
        { label: 'Tools', text: m.tools },
        { label: 'Why this format', text: m.flow },
        { label: 'Workflow', items: ['Script → record → auto-caption → cut silences → reframe vertical → publish → repurpose'] },
      ],
      note: 'Pick one format and get boringly good at it before you add a second.',
    }
  },

  'm4-edit': (v) => ({
    headline: `Here’s where “${val(v, 'video', 'your video')}” is losing people.`,
    sections: [
      { label: 'Fix first', items: [
        'Dead air before the hook — cut everything before your first real word',
        'Silences over 0.4s — let AI strip them automatically',
        'No captions — most of your audience is watching muted',
        'A slow middle — if the energy dips at 40%, that’s where they leave',
      ]},
      { label: 'Then polish', items: [
        'Music under the voice, never over it',
        'A cut or a movement at least every 3 seconds',
        'Auto-reframe for vertical rather than reshooting',
        'Caption styling that matches your brand fonts',
      ]},
    ],
    note: 'Editing is mostly deletion. The best cut is the one nobody notices.',
  }),

  'm4-hook': (v) => {
    const a = analyze(val(v, 'opening', ''))
    if (a.empty) return null
    return {
      headline: verdict(a),
      scores: [
        { label: 'Scroll-stop potential', value: scrollScore(a), note: scoreNote(scrollScore(a)) },
        { label: 'Curiosity', value: curiosityScore(a), note: 'Does the next second feel necessary?' },
        { label: 'Clarity', value: clarityScore(a), note: 'They get one listen. There’s no rewind.' },
        { label: 'Retention', value: clamp(scrollScore(a) - (a.words > 14 ? 12 : 0)), note: a.words > 14 ? 'Every extra word before the idea costs viewers.' : 'The idea arrives before they can leave.' },
      ],
      sections: [
        { label: 'Three stronger openings', items: rewrites(a.text, val(v, 'subject', 'this'), a.cliches.length === 0).map((r) => `${r.label}: ${r.text}`) },
        { label: 'Hook styles that reliably work', items: ['Curiosity', 'Story', 'A mistake you made', 'Contrarian', 'Before & after', 'An unexpected fact'] },
      ],
      note: 'A great video is decided in the first 3 seconds. Everything after that is just keeping the promise.',
    }
  },

  'm4-repurpose': (v) => ({
    headline: 'One long video is eight assets. Here’s the plan.',
    sections: [
      { label: 'Cut from the transcript', items: [
        'YouTube Short — the single strongest 45 seconds',
        'Instagram Reel — the same clip, captioned, vertical',
        'TikTok — the most contrarian 30 seconds, no intro',
        'LinkedIn clip — the most useful minute, professional framing',
      ]},
      { label: 'Derive from the words', items: [
        'Quote graphic — the line people replayed',
        'Carousel — your five section headings',
        'Blog — the transcript, restructured with headings',
        'Newsletter — the summary plus what you cut',
      ]},
      { label: 'Order of operations', text: 'Publish the long version first, let the data tell you which section performed, then cut the shorts from that section. Repurposing blind wastes the best footage.' },
    ],
    note: 'Create once. Publish everywhere. That’s the whole trick.',
  }),

  'm4-analytics': (v) => ({
    headline: `Reading “${val(v, 'results', 'your results')}” — here’s the signal.`,
    sections: [
      { label: 'What’s working', items: ['Anything with above-average watch time — that’s the topic, not the luck', 'Saves and shares beat likes as a quality signal'] },
      { label: 'What’s hurting retention', items: ['A drop in the first 3 seconds = your hook, not your content', 'A drop at 40% = a slow middle, cut it', 'A drop at the end = your CTA arrives before the payoff'] },
      { label: 'Test next', items: ['Same content, new hook — this is the highest-leverage test in video', 'Shorter cut of the winner', 'The same idea on the platform where it underperformed'] },
    ],
    note: 'Watch time and retention tell you the truth. Views tell you what the algorithm felt like doing that day.',
  }),

  'm4-campaign': (v) => ({
    headline: `A complete video campaign for ${val(v, 'product', 'your product')}.`,
    sections: [
      { label: 'Hook', text: `“You’re spending hours on something ${val(v, 'product', 'this')} does in minutes.”` },
      { label: 'Script', text: '30s: hook → problem → product doing the job → result → CTA. Written for the ear.' },
      { label: 'Scene breakdown', items: ['1 · Face to camera, hook, no intro', '2 · Screen recording of the problem', '3 · The product, mid-task', '4 · The result, on screen', '5 · CTA, plain background'] },
      { label: 'AI visual prompt', text: 'Clean desk workspace, soft window light from the left, shallow depth of field, muted palette, negative space right for captions, photorealistic, no text.' },
      { label: 'Captions', text: 'Burned in, brand font, two lines maximum, high contrast. Assume muted playback.' },
      { label: 'Thumbnail', text: 'One face, one emotion, three words maximum. Readable at thumbnail size.' },
      { label: 'CTA', text: 'One action, spoken and on screen, at the payoff — not before it.' },
      { label: 'Repurposing plan', text: 'Short → Reel → TikTok → LinkedIn clip → quote graphic → carousel → blog → newsletter.' },
    ],
    note: 'Module 4 done. You can make video without becoming a video editor. Now let’s get it seen.',
  }),

  // ── Module 5 · Social Media ───────────────────────────────────────────────
  'm5-platform': (v) => {
    const p = val(v, 'platform', 'LinkedIn')
    const strat = {
      Instagram: 'Carousels for saves, Reels for reach, Stories for the people who already like you. Post 4–5×/week.',
      LinkedIn: 'Text-led posts, one idea, short lines. Tuesday–Thursday mornings. Comment more than you post.',
      X: 'Volume game. Threads for depth, single posts for reach. Reply to bigger accounts — that’s the distribution.',
      Facebook: 'Groups and community over page posts. Longer, story-shaped writing still works here.',
      TikTok: 'Hook-first, trend-aware, post daily. The algorithm rewards frequency more than any other platform.',
      YouTube: 'Search-driven. Title and thumbnail decide everything. One good video outlives a hundred posts.',
    }
    return {
      headline: `${p} is your home base. Play it that way.`,
      sections: [
        { label: 'Your strategy', text: strat[p] || strat.LinkedIn },
        { label: 'The distribution rule', text: 'Spend as long distributing a post as you spent making it. Most people spend 100% on creation and 0% on distribution, then blame the algorithm.' },
      ],
      note: 'Content is half the job. Distribution is what gets attention.',
    }
  },

  'm5-pick': (v) => ({
    headline: `For “${val(v, 'business', 'your business')}”, two platforms — not six.`,
    sections: [
      { label: 'Primary', text: 'Wherever your buyers already are and you can post in your strongest format. If you write well, that’s LinkedIn or X. If you show well, Instagram or TikTok.' },
      { label: 'Secondary', text: 'Pick the one that compounds: YouTube or a newsletter. Slow to start, still working in a year.' },
      { label: 'Ignore for now', text: 'Everything else. Two done properly beats six done badly — and six is how people burn out by week three.' },
    ],
    note: 'Not every platform wants the same content. Two platforms, done properly, is a strategy. Six is a chore list.',
  }),

  'm5-repurpose6': (v) => {
    const post = val(v, 'post', 'your post')
    return {
      headline: 'Six versions. Same idea. No rewriting.',
      sections: [
        { label: 'LinkedIn', text: `“${post}” — opened with the tension, three short lessons, closing question.` },
        { label: 'Instagram', text: 'Most surprising line first, three bullets, “save this for later”.' },
        { label: 'Reel', text: '0–3s the boldest claim, 3–20s three points, 20–30s CTA.' },
        { label: 'Story', text: 'Three frames: the problem, the fix, the poll. Polls are the cheapest engagement you’ll ever get.' },
        { label: 'Thread', text: 'Claim → one point per post → the screenshot-able summary.' },
        { label: 'Newsletter', text: 'The idea, plus the part you cut for length. Subscribers get the director’s cut.' },
      ],
      note: 'Adapting isn’t rewriting. Change the shape, keep the idea.',
    }
  },

  'm5-calendar': (v) => {
    const n = val(v, 'frequency', '3')
    return {
      headline: `${n} posts a week — planned once, not decided daily.`,
      sections: [
        { label: 'Your content pillars', items: [
          'Teach — the thing you know that they don’t',
          'Prove — results, numbers, before-and-afters',
          'Story — what you got wrong and what changed',
          'Offer — what you sell, said plainly (roughly 1 in 5)',
        ]},
        { label: 'Weekly themes', items: ['Monday — teach', 'Wednesday — prove or story', 'Friday — the lighter one', 'Rotate the offer post through the slots'] },
        { label: 'Batch it', text: 'One session per week produces all of it. Deciding what to post daily is the tax that makes people quit.' },
      ],
      note: 'Stop asking “what should I post today?” Answer it once a month instead.',
    }
  },

  'm5-caption': (v) => {
    const a = analyze(val(v, 'caption', ''))
    if (a.empty) return null
    return {
      headline: a.hasQuestion ? 'You gave people a reason to reply. Good.' : 'No reason to comment — that’s the gap.',
      scores: [
        { label: 'Hook strength', value: curiosityScore(a), note: 'The first line is the whole caption for most readers.' },
        { label: 'Readability', value: clarityScore(a), note: a.words > 60 ? 'Break it into shorter lines. Walls of text get skipped.' : 'Scannable.' },
        { label: 'CTA', value: clamp(a.hasQuestion ? 78 : 36), note: a.hasQuestion ? 'A question is the cheapest CTA that works.' : 'Add one specific ask — “save this”, or a question.' },
        { label: 'Engagement potential', value: scrollScore(a), note: scoreNote(scrollScore(a)) },
      ],
      sections: [
        { label: 'Rewritten', text: `${a.text.split(/[.!?]/)[0]}.\n\nHere’s what most people miss:\n\n• the part that costs time\n• the part that costs money\n• the part nobody mentions\n\nWhich one’s hurting you most?` },
        { label: 'Rules', items: ['First line does the work', 'Line breaks are formatting', 'One CTA', 'Emojis as punctuation, not decoration'] },
      ],
      note: 'Captions aren’t filler. On most platforms they’re the actual content.',
    }
  },

  'm5-keywords': (v) => {
    const topic = val(v, 'topic', 'your topic')
    return {
      headline: `Social is search now. Here’s how people look for ${topic}.`,
      sections: [
        { label: 'Keywords', items: [`${topic} for beginners`, `how to ${topic}`, `${topic} mistakes`, `best ${topic} tools`, `${topic} examples`] },
        { label: 'Hashtags', items: [`#${topic.replace(/\s+/g, '').toLowerCase()}`, `#${topic.replace(/\s+/g, '').toLowerCase()}tips`, '#marketing', '#aimarketing', '#smallbusiness'] },
        { label: 'Search phrases to put in your captions', items: [`“what is ${topic}”`, `“${topic} vs”`, `“is ${topic} worth it”`, `“${topic} step by step”`] },
      ],
      note: 'Write the words people type. Hashtags help discovery; keywords in the first line help more.',
    }
  },

  'm5-schedule': (v) => ({
    headline: `Around “${val(v, 'schedule', 'your week')}”, here’s a publishing workflow that survives a busy week.`,
    sections: [
      { label: 'One creation block', text: 'Everything gets made in a single session. Protect it like a client meeting.' },
      { label: 'One scheduling block', text: '20 minutes. Load the whole week, set it, close the tab.' },
      { label: 'Daily, 10 minutes', text: 'Reply to comments. This is distribution, not admin — it’s the highest-return ten minutes you have.' },
      { label: 'Automate', items: ['Cross-post the same asset with platform-native formatting', 'Auto-generate captions from the source content', 'Route approvals through one place if someone else signs off'] },
    ],
    note: 'Spend one day creating. Let the schedule handle the rest of the week.',
  }),

  'm5-plan30': (v) => ({
    headline: `A 30-day social plan for ${val(v, 'business', 'your business')}.`,
    sections: [
      { label: 'Content pillars', items: ['Teach', 'Prove', 'Story', 'Offer'] },
      { label: 'Posting schedule', text: '3×/week on your primary platform, 1×/week on your secondary. Same days every week — consistency is the algorithm’s favourite input.' },
      { label: '30 post ideas', text: 'Rotate the pillars: 12 teach, 8 prove, 6 story, 4 offer. Generate them in one sitting from your topic list.' },
      { label: 'Captions', text: 'First line = hook. Body = three points. Last line = one question.' },
      { label: 'Platform versions', text: 'Each idea ships as a post, a story frame, and a short. Three assets, one thought.' },
      { label: 'CTA library', items: ['What would you add?', 'Save this for later.', 'Want the template?', 'Try it and tell me what broke.', 'Follow for the rest.'] },
      { label: 'Publishing calendar', text: 'Batch Monday, schedule Monday, engage daily, review Friday.' },
    ],
    note: 'Module 5 done. You’re distributing, not just posting. Now let’s own the audience instead of renting it.',
  }),

  // ── Module 6 · Email & Lead Gen ───────────────────────────────────────────
  'm6-capture': (v) => {
    const where = val(v, 'where', 'Instagram')
    const map = {
      Instagram: 'Link in bio → a one-page landing page → one lead magnet. Not a link tree with nine options.',
      LinkedIn: 'A featured link plus a “comment for the template” post. Highest-intent leads on the internet.',
      Facebook: 'Group → pinned post → landing page. The group is the asset, not the page.',
      YouTube: 'Pinned comment and description link. Mention it once, in the middle, where they’re still watching.',
      Website: 'One exit-intent offer and one inline offer. Two placements, one offer.',
      'Nowhere yet': 'Start with the landing page. One page, one promise, one form. Then send everything to it.',
    }
    return {
      headline: `Your audience lives on ${where}. Here’s how to stop renting it.`,
      sections: [
        { label: 'Your capture strategy', text: map[where] || map['Nowhere yet'] },
        { label: 'Why bother', text: 'Followers are borrowed — a platform can change its algorithm tomorrow and your reach is gone. An email list is the only audience you own outright.' },
      ],
      note: 'Your goal isn’t to go viral. It’s to build relationships you actually control.',
    }
  },

  'm6-magnet': (v) => {
    const biz = val(v, 'business', 'your business')
    return {
      headline: `Five lead magnets for ${biz} — each buildable this week.`,
      sections: [
        { label: 'Ideas, easiest first', items: [
          `The ${biz} checklist — the one you already follow in your head`,
          `A template that removes a blank page`,
          `A cheat sheet of the mistakes you see constantly`,
          `A prompt pack for the tasks your audience hates`,
          `A 5-day mini course by email — highest value, most effort`,
        ]},
        { label: 'Pick using this test', text: 'The best lead magnet solves one specific problem in under 10 minutes. Not a 40-page ebook nobody opens — a thing that works before lunch.' },
      ],
      note: 'AI turns a two-week lead magnet into a two-hour one. That’s the unlock — not the writing, the shipping.',
    }
  },

  'm6-headline': (v) => {
    const a = analyze(val(v, 'headline', ''))
    if (a.empty) return null
    return {
      headline: scrollScore(a) >= 70 ? 'Specific enough to convert. Ship it.'
        : a.hasNumber ? 'Good specificity — the rest still needs tightening.'
        : 'Vague. Vague headlines don’t convert — they get skimmed.',
      scores: [
        { label: 'Clarity', value: clarityScore(a), note: 'Would a stranger know what they get?' },
        { label: 'Curiosity', value: curiosityScore(a), note: 'Is there a reason to read the subheading?' },
        { label: 'Benefit', value: clamp(emotionScore(a) + (a.hasNumber ? 12 : -8)), note: 'Name the outcome, not the feature.' },
        { label: 'Conversion potential', value: scrollScore(a), note: scoreNote(scrollScore(a)) },
      ],
      sections: [
        { label: 'Improved', items: [
          `${a.text.replace(/[.?!]+$/, '')} — in under 10 minutes`,
          `Get ${decap(a.text.replace(/[.?!]+$/, ''))} without the guesswork`,
          `The 5-step way to ${decap(a.text.replace(/[.?!]+$/, ''))}`,
        ]},
        { label: 'The formula', text: 'Outcome + timeframe + removed objection. “Write a week of content in 20 minutes — without sounding like a robot.”' },
      ],
      note: 'A landing page has one job. The headline does most of it.',
    }
  },

  'm6-email': (v) => {
    const a = analyze(val(v, 'email', ''))
    if (a.empty) return null
    return {
      headline: a.cliches.length ? 'It reads automated. That’s the whole problem.' : 'Sounds like a person. That’s most of the battle.',
      scores: [
        { label: 'Subject line', value: curiosityScore(a), note: 'Under 40 characters. Curiosity or usefulness — pick one, not both.' },
        { label: 'Readability', value: clarityScore(a), note: a.words > 120 ? 'Too long. Nobody reads a wall of text from a stranger.' : 'A person can finish this on a phone.' },
        { label: 'Engagement', value: emotionScore(a), note: 'Write to one person. “Hi everyone” is why nobody replies.' },
        { label: 'CTA strength', value: clamp(a.hasQuestion ? 74 : 40), note: 'One CTA. Two is zero.' },
      ],
      sections: [
        { label: 'Rewritten', text: `Subject: the thing nobody mentions\n\nHi —\n\n${a.text.split(/[.!?]/)[0]}.\n\nHere’s the version that actually worked, in three lines:\n\n• what to stop\n• what to try\n• what to measure\n\nWorth a reply — which one are you stuck on?` },
        { label: 'Rules', items: ['One idea per email', 'Short paragraphs, one CTA', 'Write like you’d write to a colleague', 'Ask a question — replies teach the inbox you’re wanted'] },
      ],
      note: 'Sound human, not automated. The inbox is the last place people notice the difference.',
    }
  },

  'm6-sequence': (v) => {
    const type = val(v, 'type', 'Welcome Series')
    const seqs = {
      'Welcome Series': ['1 · Deliver what you promised. Nothing else.', '2 · Your story — why you do this', '3 · Your best free thing', '4 · A quick win they can use today', '5 · The soft offer, framed as the next step'],
      'Webinar Sequence': ['1 · Confirmation + calendar link', '2 · What you’ll cover (the promise)', '3 · A reminder the day before', '4 · “We’re live in 1 hour”', '5 · The replay + the offer'],
      'Product Launch': ['1 · The problem, in their words', '2 · The story of building it', '3 · The offer opens', '4 · Objections, handled', '5 · Closing tonight'],
      'Cart Recovery': ['1 · “Still thinking?” (1 hour later)', '2 · The objection you hear most (24h)', '3 · One customer story (48h)', '4 · Last call'],
      'Re-engagement': ['1 · “Still want these?”', '2 · The best thing you missed', '3 · “Last one unless you click”'],
      'Customer Onboarding': ['1 · Welcome + the first step', '2 · The feature that creates the habit', '3 · A common mistake to skip', '4 · How to get help', '5 · What’s next'],
    }
    return {
      headline: `Your ${type} — written as a sequence, not five separate emails.`,
      sections: [
        { label: 'The emails', items: seqs[type] || seqs['Welcome Series'] },
        { label: 'Each email needs', items: ['A subject under 40 characters', 'Preview text that isn’t a repeat of the subject', 'One idea', 'One CTA'] },
      ],
      note: 'A sequence beats a broadcast because it arrives when the reader is ready, not when you felt like writing.',
    }
  },

  'm6-personalize': (v) => {
    const aud = val(v, 'audience', 'small business owners')
    return {
      headline: `The same email, written for three slices of ${aud}.`,
      sections: [
        { label: 'Beginner', text: `“You don’t need a marketing team. You need one hour and a system.” — reassure first, teach second.` },
        { label: 'Experienced', text: `“You already know the theory. Here’s the workflow that removes the busywork.” — respect their time, skip the basics.` },
        { label: 'Buyer / returning', text: `“You’ve done this once. Here’s how to make it repeatable.” — reference what they already did.` },
        { label: 'What actually changed', items: ['The opening line', 'The example', 'The CTA — nothing else'] },
      ],
      note: 'Personalisation isn’t writing every email by hand. It’s changing three lines for three segments.',
    }
  },

  'm6-metrics': (v) => ({
    headline: `Reading “${val(v, 'metrics', 'your campaign')}” — here’s what it’s telling you.`,
    sections: [
      { label: 'What each metric means', items: [
        'Open rate — your subject line and your sender reputation. Nothing else.',
        'Click rate — whether the body earned the click. This is the honest one.',
        'Conversion rate — whether the promise survived the landing page.',
        'Replies — the strongest deliverability signal you can get.',
        'Revenue — the only one your business feels.',
      ]},
      { label: 'What to improve', text: 'Low opens → subject lines. Good opens, low clicks → the body over-promised or the CTA hid. Good clicks, low conversions → the landing page broke the promise.' },
      { label: 'Next experiment', text: 'Change one thing. Two changes teach you nothing.' },
    ],
    note: 'Don’t obsess over opens. Opens are vanity now — clicks and replies are the truth.',
  }),

  'm6-leadsystem': (v) => ({
    headline: `A complete lead system for ${val(v, 'business', 'your business')}.`,
    sections: [
      { label: 'Lead magnet', text: 'One checklist or template that solves one problem in under 10 minutes.' },
      { label: 'Landing page copy', text: 'Headline = outcome + timeframe. Three benefits. One form field. One CTA above the fold.' },
      { label: 'Welcome email', text: 'Deliver the thing immediately. One line about who you are. Nothing to sell yet.' },
      { label: '5-email nurture sequence', items: ['1 · Deliver', '2 · Your story', '3 · Best free resource', '4 · Quick win', '5 · Soft offer'] },
      { label: 'CTA variations', items: ['Get the checklist', 'Send me the template', 'Show me the system', 'Start free', 'Reply and I’ll send it'] },
      { label: 'Follow-up email', text: 'One week later: “Did it work?” Replies tell you more than any dashboard.' },
      { label: 'Performance checklist', items: ['Open rate above 30%', 'Click rate above 3%', 'At least one reply per send', 'Unsubscribes under 0.5%'] },
    ],
    note: 'Module 6 done. You own an audience now. Next: find out what’s actually working.',
  }),

  // ── Module 7 · Analytics ──────────────────────────────────────────────────
  'm7-goal': (v) => {
    const goal = val(v, 'goal', 'More leads')
    const map = {
      'More sales': ['Revenue', 'Conversion rate', 'Average order value', 'Cost per acquisition'],
      'More leads': ['Leads per week', 'Landing page conversion rate', 'Cost per lead', 'Lead-to-customer rate'],
      'More website traffic': ['Sessions', 'Traffic by source', 'Bounce rate', 'Pages per session'],
      'More followers': ['Follower growth rate', 'Reach', 'Saves and shares', 'Profile visits'],
      'Better engagement': ['Engagement rate', 'Saves', 'Comments per post', 'Watch time'],
    }
    return {
      headline: `“${goal}” — so these are the only four numbers that matter.`,
      sections: [
        { label: 'Track these', items: map[goal] || map['More leads'] },
        { label: 'Ignore everything else', text: 'Every metric you track that doesn’t serve this goal is a metric that will eventually mislead you into optimising the wrong thing.' },
      ],
      note: 'Marketing isn’t posting more. It’s learning what works and doing more of it.',
    }
  },

  'm7-kpi': (v) => ({
    headline: `A KPI dashboard for “${val(v, 'goal', 'your goal')}”.`,
    sections: [
      { label: 'Top row — the outcome', items: ['Revenue or leads this month', 'vs. last month', 'vs. target'] },
      { label: 'Middle row — the drivers', items: ['Traffic by source', 'Conversion rate by page', 'Email click rate'] },
      { label: 'Bottom row — the inputs', items: ['Posts published', 'Emails sent', 'Experiments run'] },
      { label: 'The discipline', text: 'If a number can’t change a decision, it doesn’t belong on the dashboard. Delete it.' },
    ],
    note: 'Focus on business outcomes, not likes. Likes have never paid an invoice.',
  }),

  'm7-read': (v) => ({
    headline: `Summarising “${val(v, 'results', 'your campaign')}”.`,
    sections: [
      { label: 'Wins', items: ['Your highest-engagement piece tells you the topic your audience wants more of', 'Anything with above-average saves is your next long-form piece'] },
      { label: 'Problems', items: ['A high bounce rate means the page broke the promise the ad made', 'High opens with low clicks means the subject over-sold the body'] },
      { label: 'Opportunities', items: ['Repurpose the winner into the format that underperformed', 'Double down on the channel with the lowest cost per lead'] },
      { label: 'Next steps', items: ['One test, one variable, one week', 'Kill the worst performer rather than trying to save it'] },
    ],
    note: 'Instead of staring at charts, ask the data questions. “Why did this win?” is a better prompt than “summarise this”.',
  }),

  'm7-abtest': (v) => {
    const a = analyze(val(v, 'headline', ''))
    if (a.empty) return null
    const base = a.text.replace(/[.?!]+$/, '')
    return {
      headline: 'Three variations — each testing exactly one thing.',
      sections: [
        { label: 'A · Specificity', text: `“${base} — in 10 minutes.” Tests whether a concrete timeframe beats a general promise.` },
        { label: 'B · Curiosity', text: `“What nobody tells you about ${decap(base)}.” Tests whether intrigue beats clarity for your audience.` },
        { label: 'C · Objection', text: `“${base} — without the guesswork.” Tests whether removing the fear beats naming the benefit.` },
        { label: 'How to run it', items: ['One variable at a time', 'Wait for 100+ conversions per arm before believing it', 'Keep the winner, write the next challenger against it'] },
      ],
      note: 'Small changes, big differences. But only if you change one thing at a time.',
    }
  },

  'm7-report': (v) => ({
    headline: 'Your executive summary — the version a busy person will actually read.',
    sections: [
      { label: 'Headline result', text: `From your notes: “${val(v, 'data', 'the campaign')}”. Lead with the number that moved and by how much. One sentence.` },
      { label: 'What drove it', items: ['The channel that over-performed', 'The single piece of content that carried the month', 'The change you made that worked'] },
      { label: 'What didn’t work', items: ['The experiment that failed and what it ruled out', 'The channel to cut or fix'] },
      { label: 'Next month', items: ['One priority', 'One experiment', 'One thing to stop doing'] },
    ],
    note: 'Nobody enjoys building reports. Now you don’t have to — but keep the judgement, AI only does the assembly.',
  }),

  'm7-opportunities': (v) => {
    const niche = val(v, 'niche', 'your niche')
    return {
      headline: `Five opportunities in ${niche} worth testing.`,
      sections: [
        { label: 'Test these', items: [
          `The question ${niche} beginners ask constantly and nobody answers well`,
          `A seasonal moment in ${niche} you could own before everyone else`,
          `The keyword competitors rank for badly — take it with one good page`,
          `Your best-performing post, remade for the platform where you're weakest`,
          `The audience segment buying from you that you never write for`,
        ]},
        { label: 'Pick one', text: 'Rank by effort against evidence. The cheapest test with the strongest signal wins.' },
      ],
      note: 'Good marketers fix problems. Great ones spot opportunities before they’re obvious.',
    }
  },

  'm7-dashboard': (v) => ({
    headline: 'One dashboard. One source of truth.',
    sections: [
      { label: 'Your layout', text: `Metrics you chose: ${val(v, 'metrics', 'traffic, leads, conversions')}. Outcome at the top, drivers in the middle, inputs at the bottom.` },
      { label: 'Pull from', items: ['Social — reach, saves, engagement rate', 'Website — sessions, source, conversion rate', 'Email — click rate, replies, revenue', 'Ads — cost per lead, ROAS', 'Leads — new, qualified, converted', 'Sales — revenue, AOV'] },
      { label: 'Review rhythm', text: 'Weekly for inputs, monthly for outcomes. Checking revenue daily is how people make bad decisions fast.' },
    ],
    note: 'One dashboard beats six tabs. Six tabs is how you end up guessing.',
  }),

  'm7-review': (v) => ({
    headline: `Reviewing “${val(v, 'campaign', 'your campaign')}”.`,
    sections: [
      { label: 'KPI summary', text: 'The one number that defines success, where it landed, and against what target.' },
      { label: 'What’s working', items: ['Your best channel by cost per result', 'Your best content by saves and shares'] },
      { label: 'What’s not', items: ['The channel with the worst cost per result', 'The step in the funnel with the steepest drop'] },
      { label: 'Three improvement ideas', items: ['Fix the biggest funnel drop first — it’s always the cheapest win', 'Repurpose the winner rather than making something new', 'Cut the weakest channel and move the budget'] },
      { label: 'A/B test plan', text: 'One variable, one week, 100+ conversions per arm before you call it.' },
      { label: 'Next week’s action plan', items: ['One fix', 'One test', 'One thing to stop'] },
    ],
    note: 'Module 7 done. You’re deciding with data now. Last step: make it run without you.',
  }),

  // ── Module 8 · Automation ─────────────────────────────────────────────────
  'm8-automate': (v) => {
    const task = val(v, 'task', 'Social media posts')
    const map = {
      'Social media posts': 'Batch → schedule → auto cross-post. Your input drops to one session a week.',
      Emails: 'Templates + sequences + triggers. Write once, sends forever.',
      Reports: 'Auto-pull the data, AI writes the summary, you edit the judgement. 3 hours → 20 minutes.',
      'Competitor research': 'A scheduled search digest into one doc. Read it weekly instead of remembering to look.',
      'Blog writing': 'Outline from your keyword list, draft from the outline, you rewrite the middle. Half the time.',
      'Lead follow-ups': 'Trigger on form submit. This one should never be manual — speed is the entire game.',
    }
    return {
      headline: `“${task}” — yes, this can mostly go away.`,
      sections: [
        { label: 'Your automation', text: map[task] || map['Social media posts'] },
        { label: 'The test for automating anything', items: [
          'You do it at least weekly',
          'The steps are the same every time',
          'A mistake wouldn’t be catastrophic',
          'You can describe it to someone else in under 5 minutes',
        ]},
        { label: 'Keep a human here', text: 'Anything customer-facing gets a review step. Automation with no review is how brands end up apologising publicly.' },
      ],
      note: 'Automation isn’t about replacing you. It’s about deleting the parts of the week you resent.',
    }
  },

  'm8-workflow': (v) => ({
    headline: `Built around “${val(v, 'schedule', 'your week')}” — a marketing week that repeats.`,
    sections: [
      { label: 'Monday — Planning', text: 'Review last week’s numbers. Pick this week’s ideas. 45 minutes.' },
      { label: 'Tuesday — Content creation', text: 'Draft everything in one block. Don’t edit while writing.' },
      { label: 'Wednesday — Design & video', text: 'Visuals for the whole batch. Templates make this fast.' },
      { label: 'Thursday — Publishing & email', text: 'Schedule the week. Send the newsletter.' },
      { label: 'Friday — Analytics & optimisation', text: 'What worked, what didn’t, what to test. 30 minutes, then stop.' },
      { label: 'AI supports every step', text: 'Ideas on Monday, drafts on Tuesday, prompts and captions on Wednesday, scheduling on Thursday, the summary on Friday.' },
    ],
    note: 'Instead of working randomly, work the same way every week. Boring is what scales.',
  }),

  'm8-stack': (v) => {
    const flow = val(v, 'workflow', 'New blog → social posts')
    return {
      headline: `Mapping “${flow}” step by step. No code.`,
      sections: [
        { label: 'Trigger', text: `What starts it: ${flow.split('→')[0]?.trim() || 'a new item appears'}.` },
        { label: 'Actions', items: [
          'AI generates the platform-specific versions',
          'The draft lands somewhere you can see it',
          'You approve (this step stays human)',
          'It publishes and gets logged',
        ]},
        { label: 'Common maps worth stealing', items: [
          'New blog → social posts',
          'New lead → welcome email',
          'Webinar registration → reminder sequence',
          'Form submission → CRM record + notification',
          'New video → captions for every platform',
        ]},
        { label: 'Error handling', text: 'Decide now what happens when it fails: notify you, retry once, and never silently drop. Silent failures are worse than manual work.' },
      ],
      note: 'Your tools already talk to each other. Most people just never introduce them.',
    }
  },

  'm8-playbook': (v) => {
    const task = val(v, 'task', 'the weekly newsletter')
    return {
      headline: `A reusable playbook for ${task}.`,
      sections: [
        { label: 'Trigger', text: 'When it runs, and what starts it.' },
        { label: 'Steps', items: ['Inputs you gather first', 'The prompt you always use', 'The draft', 'The quality check', 'Approval', 'Publish', 'Log the result'] },
        { label: 'Quality control', items: ['Does it sound like us?', 'One idea, one CTA?', 'Facts and numbers checked?', 'Links tested?'] },
        { label: 'Why a playbook', text: 'Because the version of you that’s tired on a Thursday makes worse decisions than the version writing this now. The playbook is you, protecting you.' },
      ],
      note: 'The goal is consistency, not complexity. A playbook you follow beats a system you admire.',
    }
  },

  'm8-scale': (v) => {
    const hours = val(v, 'hours', 'more time on strategy')
    return {
      headline: `Five hours back a week — and you'd spend it on ${hours}.`,
      sections: [
        { label: 'AI takes these first', items: [
          'First drafts — always. Editing is faster than starting.',
          'Repurposing — pure mechanical transformation',
          'Captions and subtitles',
          'Report assembly',
          'Research summaries',
        ]},
        { label: 'You keep these', items: [
          'Strategy and positioning',
          'Taste — deciding what’s good',
          'Relationships and replies',
          'The final say on anything public',
        ]},
        { label: 'Systems before hires', text: 'Most businesses think they need more people. Often they need one documented process and a template. Hire after the system, not instead of it.' },
      ],
      note: 'Scale the work before you scale the team. It’s cheaper and it’s reversible.',
    }
  },

  'm8-system': (v) => ({
    headline: 'Here’s what’s missing from your marketing system.',
    sections: [
      { label: 'You’ve got the pieces', items: ['Content planning', 'Content creation', 'Design', 'Video', 'Social media', 'Email', 'Analytics', 'Automation'] },
      { label: 'The gaps most people leave', items: [
        'No review step before anything public goes out',
        'No single place the numbers live',
        'No documented prompt for the task you do weekly',
        'No plan for when an automation fails',
      ]},
      { label: 'Fix in this order', text: 'Review step first (it protects the brand), then the dashboard (it protects your decisions), then documentation (it protects your time).' },
    ],
    note: 'One connected workflow beats eight clever tools that don’t know about each other.',
  }),

  'm8-os': (v) => ({
    headline: `Your AI Marketing Operating System for ${val(v, 'business', 'your business')}. This is the whole course in one page.`,
    sections: [
      { label: 'Weekly workflow', text: 'Mon plan · Tue create · Wed design & video · Thu publish & email · Fri analyse & optimise.' },
      { label: 'AI tool stack', text: 'One writing model, one design tool, one video editor, one email platform, one automation tool, one analytics view. Six tools. Not sixty.' },
      { label: 'Content system', text: 'One idea → seven assets. Batched weekly, never daily.' },
      { label: 'Social media plan', text: 'Two platforms. Four pillars. Same days every week.' },
      { label: 'Email system', text: 'One lead magnet → landing page → 5-email nurture → weekly send.' },
      { label: 'Analytics dashboard', text: 'Outcome, drivers, inputs. Weekly for inputs, monthly for outcomes.' },
      { label: 'Automation workflow', text: 'Trigger → AI drafts → you approve → it ships → it gets logged.' },
      { label: 'Optimisation checklist', items: ['One test per week', 'Kill the weakest channel monthly', 'Repurpose the winner, always', 'Review the whole system quarterly'] },
    ],
    note: 'That’s the operating system. It isn’t a pile of AI tools — it’s a way of working that survives a bad week.',
  }),
}

// Every course's recipes, in one map. Ids are prefixed per course, so a course
// can be added or removed here without touching any other course's missions.
const RECIPES = {
  ...MARKETING_RECIPES,
  ...JOB_HUNTER_RECIPES,
}

// ============================================================================
//  THE INTEGRATION POINT
//  ---------------------------------------------------------------------------
//  Everything above is local content. This is the only function a live model
//  needs to replace. Contract: return the Result shape, or null when there's
//  nothing to say yet (the block then simply asks for input rather than
//  showing an error).
// ============================================================================
export function generate(recipeId, values = {}) {
  const recipe = RECIPES[recipeId]
  if (!recipe) return null
  const result = typeof recipe === 'function' ? recipe(values) : fillDeep(recipe, values)
  return result || null
}

export const hasRecipe = (recipeId) => Boolean(RECIPES[recipeId])
