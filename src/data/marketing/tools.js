// ============================================================================
//  FAVORITE AI MARKETING TOOLS
//  Organised by workflow (the order you actually do the work), not by vendor.
//
//  Tool shape — keys match what the shared Vault page already reads, plus two
//  fields this course adds:
//    name     · tool name
//    category · workflow bucket (see toolCategories)
//    best     · best use, in one line
//    bestFor  · who it suits
//    why      · short description
//    pricing  · 'Free' | 'Freemium' | 'Paid'
//    url      · website (omit → the card renders without a link rather than
//               producing a dead one)
//
//  The source document lists free and paid tiers of the same tool separately
//  (e.g. "ChatGPT Free" and "ChatGPT Plus"). Those are merged here into one
//  freemium entry with the tier difference described in `why` — one card per
//  tool is easier to scan and honest about how the tools are actually sold.
//
//  This is plain data on purpose: tools change constantly, and updating this
//  file should never require touching the UI.
// ============================================================================

export const toolCategories = [
  { id: 'writing', name: 'Content & Writing', tone: 'mint', icon: 'PenLine' },
  { id: 'research', name: 'Research', tone: 'sky2', icon: 'Search' },
  { id: 'design', name: 'Design', tone: 'flamingo', icon: 'Palette' },
  { id: 'video', name: 'Video', tone: 'sky2', icon: 'Clapperboard' },
  { id: 'social', name: 'Social Media', tone: 'sun', icon: 'Megaphone' },
  { id: 'seo', name: 'SEO', tone: 'brand', icon: 'TrendingUp' },
  { id: 'email', name: 'Email Marketing', tone: 'lime', icon: 'Mail' },
  { id: 'crm', name: 'CRM & Lead Management', tone: 'flamingo', icon: 'Users' },
  { id: 'automation', name: 'Automation', tone: 'brand', icon: 'Workflow' },
  { id: 'analytics', name: 'Analytics', tone: 'gold', icon: 'BarChart3' },
]

export const tools = [
  // ── Content & Writing ─────────────────────────────────────────────────────
  {
    name: 'ChatGPT', category: 'writing', pricing: 'Freemium',
    best: 'Content generation and everyday drafting',
    bestFor: 'Everyone — this is the default first tool',
    why: 'The versatile all-rounder. The free tier covers most marketing writing; Plus adds better reasoning, longer context and image generation.',
    url: 'https://chat.openai.com',
  },
  {
    name: 'Claude', category: 'writing', pricing: 'Freemium',
    best: 'Long-form writing and editing',
    bestFor: 'Anyone writing blogs, sequences or anything over 500 words',
    why: 'Holds a long document in its head and keeps your voice consistent across it. Pro raises the usage limits.',
    url: 'https://claude.ai',
  },
  {
    name: 'Jasper', category: 'writing', pricing: 'Paid',
    best: 'Marketing copy at team scale',
    bestFor: 'Teams needing brand-voice consistency across many writers',
    why: 'Purpose-built for marketing copy with brand voice controls. Worth it when several people write for one brand.',
    url: 'https://jasper.ai',
  },
  {
    name: 'Notion', category: 'writing', pricing: 'Freemium',
    best: 'Planning and organising the whole system',
    bestFor: 'Anyone whose calendar and SOPs live in six different places',
    why: 'Where your content calendar, playbooks and brand voice doc should live so you can actually find them.',
    url: 'https://notion.so',
  },

  // ── Research ──────────────────────────────────────────────────────────────
  {
    name: 'Perplexity', category: 'research', pricing: 'Freemium',
    best: 'AI search with sources',
    bestFor: 'Competitor and market research',
    why: 'Google gives you links. This gives you an answer with citations you can check.',
    url: 'https://perplexity.ai',
  },
  {
    name: 'Google Gemini', category: 'research', pricing: 'Freemium',
    best: 'Research with Google integration',
    bestFor: 'Anyone already living in Google Workspace',
    why: 'Strong research model that reaches into Search and your Google docs.',
    url: 'https://gemini.google.com',
  },
  {
    name: 'AnswerThePublic', category: 'research', pricing: 'Freemium',
    best: 'Content research — the questions people ask',
    bestFor: 'Finding blog and video topics that already have demand',
    why: 'Shows the actual questions people type. Free tier gives a few searches a day, which is usually enough.',
    url: 'https://answerthepublic.com',
  },

  // ── Design ────────────────────────────────────────────────────────────────
  {
    name: 'Canva', category: 'design', pricing: 'Freemium',
    best: 'Marketing assets and templates',
    bestFor: 'Everyone who isn’t a designer — which is most marketers',
    why: 'Design without being a designer. The free tier is genuinely usable; Pro adds brand kits and background removal, which is what makes templates stick.',
    url: 'https://canva.com',
  },
  {
    name: 'Midjourney', category: 'design', pricing: 'Paid',
    best: 'AI images with a consistent look',
    bestFor: 'Brands that need original imagery rather than stock',
    why: 'The best-looking AI images available. Steepest learning curve of anything on this list.',
    url: 'https://midjourney.com',
  },
  {
    name: 'Adobe Express', category: 'design', pricing: 'Freemium',
    best: 'Branding and quick edits',
    bestFor: 'Teams already inside the Adobe ecosystem',
    why: 'A lighter Adobe tool with solid brand controls and AI generation built in.',
    url: 'https://adobe.com/express',
  },

  // ── Video ─────────────────────────────────────────────────────────────────
  {
    name: 'CapCut', category: 'video', pricing: 'Freemium',
    best: 'Video editing for short-form',
    bestFor: 'Reels, Shorts and TikToks',
    why: 'Auto-captions, auto-reframe and silence removal for free. This alone removes most of the reason people avoid video.',
    url: 'https://capcut.com',
  },
  {
    name: 'Descript', category: 'video', pricing: 'Paid',
    best: 'Editing video by editing text',
    bestFor: 'Talking-head video, podcasts and webinars',
    why: 'Delete a word from the transcript and it disappears from the video. Changes what editing even means.',
    url: 'https://descript.com',
  },
  {
    name: 'ElevenLabs', category: 'video', pricing: 'Freemium',
    best: 'AI voiceovers',
    bestFor: 'Faceless video and pickup lines you don’t want to re-record',
    why: 'The most natural AI voice available. Useful for fixing one wrong word without setting the mic back up.',
    url: 'https://elevenlabs.io',
  },

  // ── Social Media ──────────────────────────────────────────────────────────
  {
    name: 'Buffer', category: 'social', pricing: 'Freemium',
    best: 'Scheduling across platforms',
    bestFor: 'Solo marketers running two or three channels',
    why: 'Simple, cheap, does the one job well. The free tier covers three channels — enough for the two-platform strategy this course recommends.',
    url: 'https://buffer.com',
  },
  {
    name: 'Meta Business Suite', category: 'social', pricing: 'Free',
    best: 'Scheduling Facebook and Instagram',
    bestFor: 'Anyone whose audience is on Meta platforms',
    why: 'Free, native, and includes the analytics. No reason to pay a third party for these two networks.',
    url: 'https://business.facebook.com',
  },

  // ── SEO ───────────────────────────────────────────────────────────────────
  {
    name: 'Google Search Console', category: 'seo', pricing: 'Free',
    best: 'What you already rank for',
    bestFor: 'Every website, without exception',
    why: 'Free, and the only source of truth for how Google actually sees your site. Set this up before buying any SEO tool.',
    url: 'https://search.google.com/search-console',
  },
  {
    name: 'Semrush', category: 'seo', pricing: 'Paid',
    best: 'All-round SEO and competitor visibility',
    bestFor: 'Businesses where search is a main channel',
    why: 'Keyword research, competitor tracking and site audits in one place. Expensive — justify it with traffic.',
    url: 'https://semrush.com',
  },
  {
    name: 'Ahrefs', category: 'seo', pricing: 'Paid',
    best: 'SEO research and backlinks',
    bestFor: 'Serious content operations',
    why: 'The strongest backlink and keyword data available. Overkill until content is genuinely a channel for you.',
    url: 'https://ahrefs.com',
  },
  {
    name: 'Surfer SEO', category: 'seo', pricing: 'Paid',
    best: 'Optimising content you’ve already written',
    bestFor: 'Anyone publishing blogs regularly',
    why: 'Tells you what a ranking page for your keyword actually contains. Pairs naturally with an AI first draft.',
    url: 'https://surferseo.com',
  },

  // ── Email Marketing ───────────────────────────────────────────────────────
  {
    name: 'Mailchimp', category: 'email', pricing: 'Freemium',
    best: 'Email marketing for a first list',
    bestFor: 'Beginners sending their first newsletter',
    why: 'The default starting point. Free tier is fine for a small list; the price climbs as the list grows.',
    url: 'https://mailchimp.com',
  },
  {
    name: 'Brevo', category: 'email', pricing: 'Freemium',
    best: 'Email automation and sequences',
    bestFor: 'Anyone who wants automation without HubSpot pricing',
    why: 'Generous free tier with real automation. Priced on sends rather than list size, which suits smaller senders.',
    url: 'https://brevo.com',
  },
  {
    name: 'Beehiiv', category: 'email', pricing: 'Freemium',
    best: 'Newsletters built to grow',
    bestFor: 'Anyone whose newsletter is the product',
    why: 'Built for growth and monetisation rather than transactional email. The best home for a real newsletter.',
    url: 'https://beehiiv.com',
  },

  // ── CRM & Lead Management ─────────────────────────────────────────────────
  {
    name: 'HubSpot', category: 'crm', pricing: 'Freemium',
    best: 'CRM and the full funnel in one place',
    bestFor: 'Businesses with a sales conversation, not just a checkout',
    why: 'The free CRM is genuinely good. The paid tiers get expensive quickly — start free and only upgrade when a specific limit hurts.',
    url: 'https://hubspot.com',
  },

  // ── Automation ────────────────────────────────────────────────────────────
  {
    name: 'Zapier', category: 'automation', pricing: 'Freemium',
    best: 'Connecting your tools without code',
    bestFor: 'Your first automations',
    why: 'The easiest place to start. If a workflow is “when X, do Y”, this handles it in ten minutes.',
    url: 'https://zapier.com',
  },
  {
    name: 'Make', category: 'automation', pricing: 'Freemium',
    best: 'Advanced multi-step automation',
    bestFor: 'Workflows with branches, conditions and loops',
    why: 'More power and cheaper at volume than Zapier — in exchange for a visual builder you have to learn.',
    url: 'https://make.com',
  },

  // ── Analytics ─────────────────────────────────────────────────────────────
  {
    name: 'Google Analytics (GA4)', category: 'analytics', pricing: 'Free',
    best: 'Website analytics',
    bestFor: 'Every website',
    why: 'Free and standard. Ugly, but it answers where traffic comes from and what it does next.',
    url: 'https://analytics.google.com',
  },
  {
    name: 'Microsoft Clarity', category: 'analytics', pricing: 'Free',
    best: 'Heatmaps and session recordings',
    bestFor: 'Anyone whose landing page isn’t converting',
    why: 'Completely free, no sampling. Watching five real sessions teaches you more than a month of GA4 charts.',
    url: 'https://clarity.microsoft.com',
  },
]

// ── Recommended stacks ──────────────────────────────────────────────────────
// Three honest starting points. Costs are indicative monthly ballparks, not
// quotes — vendors change pricing constantly.
export const toolStacks = [
  {
    id: 'starter',
    name: 'Starter Stack',
    tone: 'brand',
    cost: '$0/month',
    purpose: 'Prove the system works before you spend anything.',
    tools: ['ChatGPT (free)', 'Canva (free)', 'CapCut', 'Buffer (free)', 'Mailchimp (free)', 'GA4', 'Search Console'],
    note: 'Genuinely enough to run everything in this course. Most people should stay here for their first three months.',
  },
  {
    id: 'professional',
    name: 'Professional Stack',
    tone: 'sun',
    cost: '~$150/month',
    purpose: 'You’re publishing weekly and the free limits are costing you time.',
    tools: ['ChatGPT Plus', 'Claude Pro', 'Canva Pro', 'Descript', 'Semrush', 'Zapier', 'Beehiiv', 'GA4 + Clarity'],
    note: 'Upgrade one tool at a time, and only when a specific free limit is actively slowing you down.',
  },
  {
    id: 'advanced',
    name: 'Advanced Stack',
    tone: 'flamingo',
    cost: '~$500+/month',
    purpose: 'Marketing is a channel with revenue attached and a team behind it.',
    tools: ['ChatGPT Plus', 'Claude Pro', 'Midjourney', 'Canva Pro', 'Descript', 'ElevenLabs', 'Ahrefs', 'Surfer SEO', 'HubSpot', 'Make', 'Jasper'],
    note: 'Only worth it when you can point at the revenue each tool supports. Otherwise it’s a subscription hobby.',
  },
]
