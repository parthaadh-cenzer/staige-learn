// ============================================================================
//  AI Side Hustle OS Lite — Course content
//  Source material by John Cenzer, re-authored into an interactive block model.
//  Each lesson is an array of typed blocks rendered by src/components/blocks.
// ============================================================================

export const intro = {
  id: 'welcome',
  title: 'Read this first',
  subtitle: 'The 90-second pep talk before you build',
  blocks: [
    { t: 'p', lead: true, text: "Let's get one thing out of the way: this is not a magic money machine." },
    { t: 'p', text: "If you're looking for a secret prompt that prints $10,000 while you sleep, you're in the wrong place. The internet is full of fake gurus and cherry-picked screenshots. This is different." },
    {
      t: 'compare',
      left: { title: 'What this IS', tone: 'mint', icon: 'check', items: ['A practical workbook', 'A roadmap from idea → launched', 'Tools you can use right now'] },
      right: { title: 'What this is NOT', tone: 'flamingo', icon: 'x', items: ['A get-rich-quick scheme', 'Financial / legal / tax advice', 'A guarantee of income'] },
    },
    { t: 'h', text: "By the end, you'll have:" },
    { t: 'list', icon: 'check', items: ['A side hustle selected', 'A niche validated', 'An offer created', 'The tools to build it', 'A launch plan', 'A customer acquisition plan'] },
    {
      t: 'bot',
      text: "Quick rule from me: whenever you hit an action item, stop reading and actually do it before moving on. The people who make money aren't the smartest — they're the ones who launch.",
    },
    { t: 'quote', text: "The internet doesn't reward the person with the best idea. It rewards the person who ships.", author: 'John Cenzer' },
    { t: 'banner', text: "Progress beats perfection. Launch beats planning. Now let's build something." },
  ],
}

export const modules = [
  // ───────────────────────────── MODULE 1 ──────────────────────────────────
  {
    id: 'm1',
    num: 1,
    title: 'Choosing Your AI Side Hustle',
    subtitle: 'Pick a lane before you build the car.',
    emoji: '🧭',
    color: 'brand',
    art: 'Compass made of glowing app icons pointing toward three paths',
    lessons: [
      {
        id: 'm1l1',
        title: 'The New AI Economy',
        subtitle: 'Why selling outcomes beats selling skills',
        minutes: 5,
        blocks: [
          { t: 'p', lead: true, text: 'Ten years ago, information was valuable. Knowing how to run ads, build sites, or write copy gave you an edge. Today, AI can do all of it.' },
          { t: 'p', text: 'The barrier to entry collapsed. Sounds like bad news — it’s actually the opposite.' },
          {
            t: 'cards',
            items: [
              { title: 'People LOSING right now', tone: 'flamingo', badge: 'Selling skills', body: '“I know how to use ChatGPT.” Nobody wakes up wanting that.' },
              { title: 'People WINNING right now', tone: 'mint', badge: 'Selling outcomes', body: '“I need more customers / leads / time / to lose weight.” That’s what people pay for.' },
            ],
          },
          {
            t: 'callout', variant: 'info', title: 'AI is a leverage multiplier',
            text: 'Think of AI like a power drill. The drill doesn’t build the house — a person does. It just helps them do it faster.',
          },
          { t: 'h', text: 'The rule that changes everything' },
          {
            t: 'compare',
            left: { title: 'Old economy', tone: 'flamingo', icon: 'dot', items: ['Learn a skill', '→ Get a job'] },
            right: { title: 'New economy', tone: 'mint', icon: 'dot', items: ['Solve a problem', '→ Get paid'] },
          },
          { t: 'p', text: 'The bigger the problem you solve, the more money you can make. That’s the whole game.' },
          { t: 'h', text: 'What you actually need' },
          {
            t: 'cards',
            items: [
              { title: 'You do NOT need', tone: 'flamingo', icon: 'x', list: ['To become a programmer', 'To become an AI expert', 'To learn machine learning', 'Years of studying'] },
              { title: 'You DO need', tone: 'mint', icon: 'check', list: ['A problem', 'A solution', 'A way to reach people'] },
            ],
          },
          {
            t: 'callout', variant: 'fire', title: 'Reality check',
            text: 'Most people will spend the next six months watching AI videos. A few will build something. Even fewer will launch. That gap is the opportunity — because execution is still rare.',
          },
          { t: 'quiz', id: 'q-m1l1', question: 'According to this lesson, what do people actually pay for?', options: ['Tools and software', 'Outcomes and solved problems', 'Knowing the latest AI trend'], answer: 1, explain: 'Nobody buys the drill — they buy the hole in the wall. Sell the outcome.' },
        ],
      },
      {
        id: 'm1l2',
        title: 'The Three Paths',
        subtitle: 'Almost every AI side hustle is one of three buckets',
        minutes: 6,
        blocks: [
          { t: 'p', lead: true, text: 'Not twenty paths. Not fifty. Three. Pick the one that matches your goal — not the hype.' },
          {
            t: 'pathcards',
            items: [
              {
                key: 'A', tone: 'brand', name: 'Build an Audience', tag: 'Faceless Content',
                desc: 'Create content. The audience becomes the asset. Monetize later.',
                examples: ['Football page', 'Travel page', 'AI page', 'Finance page'],
                income: ['Sponsorships', 'Affiliate', 'Digital products', 'Brand deals'],
                pros: ['Low startup cost', 'Scales massively', 'Long-term asset'],
                cons: ['Takes time', 'Needs consistency', 'Income delayed'],
              },
              {
                key: 'B', tone: 'mint', name: 'Build a Product', tag: 'Digital Products',
                desc: 'Create something once. Sell it repeatedly.',
                examples: ['Templates', 'Notion systems', 'Prompt packs', 'Guides'],
                income: ['Direct sales'],
                pros: ['Fastest path to first sale', 'No clients', 'Highly scalable'],
                cons: ['Needs demand', 'Requires marketing'],
              },
              {
                key: 'C', tone: 'sun', name: 'Solve Problems for Businesses', tag: 'AI Services',
                desc: 'Businesses don’t care about AI. They care about results.',
                examples: ['Content creation', 'Lead generation', 'Chatbots', 'Automation'],
                income: ['Monthly retainers', 'Project fees'],
                pros: ['Highest revenue potential', 'Fastest cash flow'],
                cons: ['Requires clients', 'Less passive'],
              },
            ],
          },
          { t: 'h', text: 'Which path should you choose?' },
          {
            t: 'flow',
            steps: [
              { title: 'Want money fastest?', text: '→ AI Services' },
              { title: 'Want scalability?', text: '→ Digital Products' },
              { title: 'Want long-term brand?', text: '→ Faceless Content' },
              { title: 'Want all three?', text: 'Start with one. Add the others later.' },
            ],
          },
          { t: 'bot', text: 'Spreading across all three on day one is how people end up finishing none. Pick one. You can always expand once you’ve got momentum.' },
        ],
      },
      {
        id: 'm1l3',
        title: 'The Selection Framework',
        subtitle: 'Answer 4 questions, get your path',
        minutes: 4,
        blocks: [
          { t: 'p', lead: true, text: 'Answer honestly. No wrong answers — this just points you at the path that fits how you actually like to work.' },
          {
            t: 'pathquiz',
            id: 'pathquiz',
            questions: [
              { q: 'How quickly do you need income?', options: [{ label: 'Immediately', path: 'C' }, { label: 'Within a few months', path: 'B' }, { label: 'Long-term is fine', path: 'A' }] },
              { q: 'Do you enjoy creating content?', options: [{ label: 'Yes, love it', path: 'A' }, { label: 'Sometimes', path: 'B' }, { label: 'Not really', path: 'C' }] },
              { q: 'Are you comfortable talking to people?', options: [{ label: 'Yes', path: 'C' }, { label: 'Somewhat', path: 'B' }, { label: 'No', path: 'A' }] },
              { q: 'Would you rather sell your time or a product?', options: [{ label: 'My time / services', path: 'C' }, { label: 'A product', path: 'B' }, { label: 'Content & audience', path: 'A' }] },
            ],
            results: {
              A: { name: 'Faceless Content', tag: 'Path A', tone: 'brand', text: 'You lean toward building an audience and long-term assets.' },
              B: { name: 'Digital Products', tag: 'Path B', tone: 'mint', text: 'You lean toward building something once and selling it repeatedly.' },
              C: { name: 'AI Services', tag: 'Path C', tone: 'sun', text: 'You lean toward fast cash flow by solving problems for businesses.' },
            },
          },
          {
            t: 'callout', variant: 'fire', title: 'Action item — stop reading',
            text: 'Seriously. Pick one path and lock it in below. This is the foundation for everything else.',
          },
          {
            t: 'worksheet', id: 'ws-m1', title: 'My Path Commitment',
            fields: [
              { id: 'path', label: 'My chosen path', type: 'select', options: ['Faceless Content (Path A)', 'Digital Products (Path B)', 'AI Services (Path C)'] },
              { id: 'reason', label: 'Why I chose it', type: 'textarea', placeholder: 'One or two honest sentences…' },
            ],
          },
        ],
      },
    ],
  },

  // ───────────────────────────── MODULE 2 ──────────────────────────────────
  {
    id: 'm2',
    num: 2,
    title: 'Finding a Market',
    subtitle: "You don't need a genius idea — you need a real problem.",
    emoji: '🔍',
    color: 'mint',
    art: 'Magnifying glass over a heatmap of glowing pain points',
    lessons: [
      {
        id: 'm2l1',
        title: 'What People Actually Pay For',
        subtitle: 'Five categories that never go out of style',
        minutes: 5,
        blocks: [
          { t: 'p', lead: true, text: 'Let’s kill a myth: you do not need a revolutionary idea. Most successful businesses are boring. They solve existing problems better, faster, or cheaper.' },
          { t: 'h', text: 'The five things people always pay for' },
          {
            t: 'paycards',
            items: [
              { icon: 'DollarSign', tone: 'mint', name: 'Money', line: 'People want more of it.', ex: ['Side hustles', 'Investing', 'Freelancing', 'Career growth'] },
              { icon: 'Clock', tone: 'brand', name: 'Time', line: 'People hate wasting it.', ex: ['Automation', 'Productivity', 'Templates', 'Done-for-you'] },
              { icon: 'HeartPulse', tone: 'flamingo', name: 'Health', line: 'People want to feel better.', ex: ['Fitness', 'Nutrition', 'Sleep', 'Mental health'] },
              { icon: 'Users', tone: 'sky2', name: 'Relationships', line: 'People want connection.', ex: ['Dating', 'Communication', 'Family', 'Friendships'] },
              { icon: 'Crown', tone: 'sun', name: 'Status', line: 'Nobody admits it. Everyone wants it.', ex: ['Luxury', 'Fashion', 'Personal brand', 'Achievements'] },
            ],
          },
          {
            t: 'callout', variant: 'success', title: 'The Golden Rule',
            text: 'Don’t ask “What do I want to sell?” Ask “What problem do people already want solved?” That single shift saves you months of frustration.',
          },
        ],
      },
      {
        id: 'm2l2',
        title: 'Finding Demand on Reddit',
        subtitle: 'Where people complain honestly',
        minutes: 5,
        blocks: [
          { t: 'p', lead: true, text: 'Reddit is one of the best market-research tools on the internet — because people complain honestly. And complaints are business opportunities.' },
          {
            t: 'callout', variant: 'info', title: "You're not hunting for ideas",
            text: 'You’re hunting for pain. Pain creates demand. Demand creates customers.',
          },
          {
            t: 'flow',
            numbered: true,
            steps: [
              { title: 'Find a subreddit', text: 'r/fitness, r/smallbusiness, r/marketing, r/freelance, r/sidehustle' },
              { title: 'Sort by Top → This Month', text: 'See what consistently rises to the surface.' },
              { title: 'Look for repeated complaints', text: '“I’m struggling to get clients.” “I can’t stay consistent.” “I waste hours doing this manually.”' },
              { title: 'Make a list of the pains', text: 'Finding customers · Creating content · Time management…' },
            ],
          },
          {
            t: 'worksheet', id: 'ws-m2-reddit', title: 'Reddit Research',
            fields: [
              { id: 'subreddit', label: 'Subreddit I researched', type: 'text', placeholder: 'r/…' },
              { id: 'complaints', label: 'Top complaints I found', type: 'textarea', placeholder: 'List the repeated pains you saw…' },
            ],
          },
          { t: 'bot', text: 'Pro tip: if hundreds of people complain about the exact same thing, there’s probably money there. Repetition is the signal.' },
        ],
      },
      {
        id: 'm2l3',
        title: 'Finding Demand on YouTube',
        subtitle: 'Use it for research, not entertainment',
        minutes: 4,
        blocks: [
          { t: 'p', lead: true, text: 'Search your niche + a problem: “how to get clients”, “how to lose weight”, “how to grow Instagram”.' },
          { t: 'h', text: 'Look for videos with…' },
          { t: 'list', icon: 'check', items: ['High views', 'Recent uploads', 'Active comments'] },
          {
            t: 'callout', variant: 'success', title: 'The tell',
            text: 'If a creator made 10 videos about the same problem and they all perform well — congratulations, you found demand.',
          },
          {
            t: 'worksheet', id: 'ws-m2-youtube', title: 'YouTube Research',
            fields: [
              { id: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. getting first clients' },
              { id: 'topvid', label: 'Top performing video', type: 'text', placeholder: 'Title' },
              { id: 'views', label: 'Views', type: 'text', placeholder: 'e.g. 1.2M' },
              { id: 'problem', label: 'Problem being solved', type: 'textarea', placeholder: 'What pain does it address?' },
            ],
          },
          { t: 'callout', variant: 'warning', title: 'Ignore the creator', text: 'Focus on the audience. The audience tells you what they actually care about.' },
        ],
      },
      {
        id: 'm2l4',
        title: 'TikTok + Demand Scorecard',
        subtitle: 'Spot trends, build on markets',
        minutes: 6,
        blocks: [
          { t: 'p', lead: true, text: 'TikTok reveals what people are currently obsessed with. Search your niche and watch for repeated topics, questions, frustrations, and success stories.' },
          { t: 'h', text: 'Trend vs Market — know the difference' },
          {
            t: 'compare',
            left: { title: 'A Trend', tone: 'flamingo', icon: 'dot', items: ['“New AI tool released”', 'Might vanish next month', 'Use it as fuel'] },
            right: { title: 'A Market', tone: 'mint', icon: 'dot', items: ['“People want more customers”', 'Existed for decades', 'Build around this'] },
          },
          { t: 'callout', variant: 'info', title: 'The move', text: 'Build around markets. Use trends as fuel — not as the foundation.' },
          { t: 'h', text: 'Score your niche (1–5 each)' },
          { t: 'scorecard', id: 'scorecard', sources: ['Reddit', 'YouTube', 'TikTok'] },
          {
            t: 'callout', variant: 'fire', title: 'Action item',
            text: 'Open Reddit, YouTube, and TikTok. Research ONE niche. Fill the worksheet. Then commit below.',
          },
          {
            t: 'worksheet', id: 'ws-m2', title: 'My Niche Decision',
            fields: [
              { id: 'niche', label: 'My chosen niche', type: 'text', placeholder: 'e.g. content planning for solo creators' },
              { id: 'problem', label: 'Top problem people want solved', type: 'textarea' },
              { id: 'why', label: 'Why I believe demand exists', type: 'textarea' },
            ],
          },
        ],
      },
    ],
  },

  // ───────────────────────────── MODULE 3 ──────────────────────────────────
  {
    id: 'm3',
    num: 3,
    title: 'Creating Your Offer',
    subtitle: 'People buy outcomes, not products.',
    emoji: '🎁',
    color: 'flamingo',
    art: 'A gift box transforming into a glowing outcome/result arrow',
    lessons: [
      {
        id: 'm3l1',
        title: 'The Offer Formula',
        subtitle: 'Problem → Solution → Outcome',
        minutes: 5,
        blocks: [
          { t: 'p', lead: true, text: 'Nobody buys a drill because they love drills. They want a hole in the wall. Nobody buys a gym membership for the treadmill — they want to lose weight.' },
          { t: 'p', text: 'People don’t care about your PDF, your Notion template, or your prompts. They care about what happens after they use it.' },
          {
            t: 'flow',
            steps: [
              { title: 'Problem', text: 'What pain are they experiencing?' },
              { title: 'Solution', text: 'What are you giving them?' },
              { title: 'Outcome', text: 'What result will they get?' },
            ],
          },
          { t: 'h', text: 'See it in action' },
          {
            t: 'offerexamples',
            items: [
              { problem: '“I don’t know what to post on social media.”', solution: '30-Day Content Calendar Template', outcome: 'Never run out of content ideas again.' },
              { problem: '“My resume isn’t getting interviews.”', solution: 'AI Resume Optimization Kit', outcome: 'Increase your chances of landing interviews.' },
              { problem: '“I waste hours researching competitors.”', solution: 'Competitor Research Prompt Pack', outcome: 'Research competitors in minutes, not hours.' },
            ],
          },
          { t: 'h', text: 'The simple test' },
          {
            t: 'compare',
            left: { title: 'Bad (sounds like a tool)', tone: 'flamingo', icon: 'x', items: ['“100 AI Prompts”', '“Notion Template”'] },
            right: { title: 'Good (sells the destination)', tone: 'mint', icon: 'check', items: ['“100 AI Prompts That Help You Create 30 Days of Content in Under an Hour”', '“Freelancer OS That Keeps Every Client Project Organized”'] },
          },
          { t: 'bot', text: 'If your offer sounds like a tool, you’re doing it wrong. Always sell the destination, not the vehicle.' },
        ],
      },
      {
        id: 'm3l2',
        title: 'Offer Examples by Path',
        subtitle: 'Steal these patterns',
        minutes: 4,
        blocks: [
          { t: 'p', lead: true, text: 'Every great offer starts with a problem — not a product, tool, or feature. Here’s what that looks like across all three paths.' },
          {
            t: 'offergrid',
            groups: [
              {
                path: 'Path A — Faceless Content', tone: 'brand',
                offers: [
                  { problem: 'Want to grow a niche page but don’t know what to post', name: 'Faceless Content Starter Kit', outcome: 'Launch your first content page in a weekend.' },
                  { problem: 'Want more views', name: '100 Viral Hook Templates', outcome: 'Create more engaging content faster.' },
                ],
              },
              {
                path: 'Path B — Digital Products', tone: 'mint',
                offers: [
                  { problem: 'Don’t know how to manage a job search', name: 'Job Hunter OS', outcome: 'Stay organized during your job search.' },
                  { problem: 'Want to start a side hustle', name: 'AI Side Hustle Planner', outcome: 'Turn an idea into an actionable plan.' },
                  { problem: 'Waste time creating content', name: 'Content Creation Toolkit', outcome: 'Plan a month of content in a single day.' },
                ],
              },
              {
                path: 'Path C — AI Services', tone: 'sun',
                offers: [
                  { problem: 'Local businesses lack content', name: 'Monthly AI Content Package', outcome: 'Consistent social content without a full-time hire.' },
                  { problem: 'Businesses miss leads', name: 'Lead Follow-Up Automation', outcome: 'Capture more leads automatically.' },
                  { problem: 'Too much repetitive work', name: 'Workflow Automation Setup', outcome: 'Save hours every week.' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'm3l3',
        title: 'Build Your Offer',
        subtitle: 'Your first offer is not your forever offer',
        minutes: 7,
        blocks: [
          { t: 'p', lead: true, text: 'Don’t overthink this. The goal is to launch — not to achieve perfection. Build it in four steps.' },
          {
            t: 'worksheet', id: 'ws-m3-build', title: 'Build It Step by Step',
            fields: [
              { id: 'problem', label: '1. What problem are you solving? (one sentence)', type: 'textarea' },
              { id: 'solution', label: '2. What are you giving them? (template, guide, service, prompt pack…)', type: 'text' },
              { id: 'outcome', label: '3. What outcome do they get? (the most important question)', type: 'textarea' },
            ],
          },
          { t: 'h', text: 'Step 4 — Your offer statement' },
          {
            t: 'callout', variant: 'info', title: 'Use this formula',
            text: 'I help [audience] solve [problem] by providing [solution] so they can [outcome].',
          },
          {
            t: 'offerexamples',
            items: [
              { problem: 'Job seekers', solution: 'an AI-powered resume toolkit', outcome: 'land more interviews', statement: true },
              { problem: 'Small businesses', solution: 'AI-generated monthly content', outcome: 'attract more customers', statement: true },
            ],
          },
          {
            t: 'worksheet', id: 'ws-m3-statement', title: 'My Offer Statement',
            fields: [
              { id: 'statement', label: 'I help… solve… by providing… so they can…', type: 'textarea', placeholder: 'Write your full offer statement here.' },
            ],
          },
          { t: 'h', text: 'The offer stress test' },
          {
            t: 'checklist', id: 'cl-stresstest', title: 'Answer yes to all of these',
            items: [
              'A stranger can understand it in 10 seconds',
              'It solves a real problem',
              'Someone can explain the benefit without explaining AI',
              'Somebody would pay money to avoid this problem',
            ],
          },
          { t: 'callout', variant: 'warning', title: 'If you said “no” to multiple…', text: 'Simplify. A confused mind never buys.' },
          {
            t: 'worksheet', id: 'ws-m3', title: 'Lock In My Offer',
            fields: [
              { id: 'name', label: 'My offer name', type: 'text' },
              { id: 'problem', label: 'Problem solved', type: 'textarea' },
              { id: 'solution', label: 'Solution', type: 'text' },
              { id: 'outcome', label: 'Outcome', type: 'textarea' },
            ],
          },
          { t: 'banner', text: 'You now have something most aspiring entrepreneurs never create: a real offer. Not an idea. An offer.' },
        ],
      },
    ],
  },

  // ───────────────────────────── MODULE 4 ──────────────────────────────────
  {
    id: 'm4',
    num: 4,
    title: 'The AI Tool Stack',
    subtitle: 'Stop collecting tools. Start using them.',
    emoji: '🧰',
    color: 'sky2',
    art: 'A minimal toolbox with five glowing app tiles, dozens of others greyed out',
    lessons: [
      {
        id: 'm4l1',
        title: 'Stop Collecting Tools',
        subtitle: 'Five categories is all you need',
        minutes: 4,
        blocks: [
          { t: 'p', lead: true, text: 'You do not need 50 AI tools. Most side hustles can be built with five tools or fewer. The biggest beginner mistake is becoming a tool collector who never launches anything.' },
          { t: 'callout', variant: 'fire', title: 'The hard truth', text: 'Tools don’t make money. Systems do.' },
          { t: 'h', text: 'Every AI side hustle needs only five things' },
          {
            t: 'flow',
            steps: [
              { title: 'Thinking', text: 'Generate ideas.' },
              { title: 'Research', text: 'Find information.' },
              { title: 'Design', text: 'Create assets.' },
              { title: 'Content', text: 'Create media.' },
              { title: 'Distribution', text: 'Get in front of people.' },
            ],
          },
        ],
      },
      {
        id: 'm4l2',
        title: 'The Core Five Tools',
        subtitle: 'What each one is actually for',
        minutes: 6,
        blocks: [
          { t: 'p', lead: true, text: 'Here’s your starting toolkit — and exactly what to use each tool for.' },
          {
            t: 'toolcards',
            items: [
              { name: 'ChatGPT', role: 'Your business partner', tone: 'mint', uses: ['Brainstorming', 'Offer creation', 'Writing', 'Research', 'Marketing copy'], note: 'If you could keep one tool, keep this. Not because it’s perfect — because it’s versatile.' },
              { name: 'Claude', role: 'Your long-form specialist', tone: 'brand', uses: ['Guides', 'Ebooks', 'Research summaries', 'Long-form content'], note: 'ChatGPT = fast thinking. Claude = deep thinking. You don’t need both immediately.' },
              { name: 'Canva', role: 'Your design department', tone: 'flamingo', uses: ['Social posts', 'PDFs', 'Lead magnets', 'Workbooks', 'Product images'], note: 'Don’t aim for beautiful. Aim for clear. A clear design beats a fancy one every time.' },
              { name: 'CapCut', role: 'Your video editor', tone: 'sun', uses: ['Reels', 'Shorts', 'TikToks', 'Tutorials'], note: 'You don’t need Hollywood skills. Most viral content is surprisingly simple.' },
              { name: 'Perplexity', role: 'Your research assistant', tone: 'sky2', uses: ['Market research', 'Competitor research', 'Industry trends', 'Learning fast'], note: 'Google gives links. Perplexity gives answers.' },
            ],
          },
          {
            t: 'callout', variant: 'warning', title: 'Common ChatGPT mistake',
            text: 'Bad: “Give me business ideas.” Good: “Give me 20 digital product ideas for people struggling to grow Instagram pages.” Specific wins. Vague loses.',
          },
        ],
      },
      {
        id: 'm4l3',
        title: 'Recommended Stacks',
        subtitle: 'Pick the stack for your path',
        minutes: 5,
        blocks: [
          { t: 'p', lead: true, text: 'Most people don’t need every tool. Choose based on your path.' },
          {
            t: 'stackcards',
            items: [
              { path: 'Path A · Faceless Content', tone: 'brand', tools: ['ChatGPT', 'CapCut', 'Canva'], cost: 'Low', purpose: 'Create and publish content quickly.' },
              { path: 'Path B · Digital Products', tone: 'mint', tools: ['ChatGPT', 'Canva', 'Perplexity'], cost: 'Very Low', purpose: 'Research, create, and sell products.' },
              { path: 'Path C · AI Services', tone: 'sun', tools: ['ChatGPT', 'Claude', 'Perplexity', 'Canva'], cost: 'Moderate', purpose: 'Research clients, create deliverables, communicate.' },
            ],
          },
          {
            t: 'callout', variant: 'success', title: 'The 80/20 rule',
            text: 'Just starting? Use ChatGPT + Canva. That’s it. You can build an entire side hustle with those two. Everything else is optional.',
          },
          {
            t: 'worksheet', id: 'ws-m4', title: 'My Launch Stack',
            fields: [
              { id: 'hustle', label: 'My chosen side hustle', type: 'text' },
              { id: 'tool1', label: 'Core tool #1 + its purpose', type: 'text' },
              { id: 'tool2', label: 'Core tool #2 + its purpose', type: 'text' },
              { id: 'tool3', label: 'Core tool #3 + its purpose', type: 'text' },
              { id: 'cost', label: 'Estimated monthly cost', type: 'text', placeholder: '$' },
            ],
          },
          { t: 'bot', text: 'People don’t fail because they lack tools. They fail because they never use the tools they already have. Now stop researching — let’s launch. 🚀' },
        ],
      },
    ],
  },

  // ───────────────────────────── MODULE 5 ──────────────────────────────────
  {
    id: 'm5',
    num: 5,
    title: 'Launching',
    subtitle: 'Done beats perfect. Every single time.',
    emoji: '🚀',
    color: 'sun',
    art: 'A slightly wonky rocket lifting off — “ugly but flying”',
    lessons: [
      {
        id: 'm5l1',
        title: 'The Launch Trap + Gumroad',
        subtitle: 'Your first launch should be a little ugly',
        minutes: 6,
        blocks: [
          { t: 'p', lead: true, text: 'Your first launch will probably be ugly. Good — it’s supposed to be. Most successful businesses started with bad logos, basic sites, and tiny audiences.' },
          { t: 'callout', variant: 'fire', title: 'The goal isn’t perfection', text: 'The goal is feedback. Feedback is what turns an idea into a business. Done beats perfect, every time.' },
          { t: 'h', text: 'Gumroad: sell in under an hour' },
          { t: 'p', text: 'No coding. No website. No complicated setup. Here’s what goes on your product page:' },
          {
            t: 'compare',
            left: { title: 'Bad product name', tone: 'flamingo', icon: 'x', items: ['“Ultimate Productivity Framework”'] },
            right: { title: 'Good product name', tone: 'mint', icon: 'check', items: ['“30-Day Content Calendar for Busy Creators”'] },
          },
          { t: 'h', text: 'Minimum viable product page' },
          { t: 'list', icon: 'check', items: ['Product title', 'Description (problem → what’s included → outcome)', 'Product image', 'Price', 'Buy button'] },
          { t: 'callout', variant: 'warning', title: 'Be specific in “what’s included”', text: 'Bad: “Templates, Resources, Bonus content.” Good: “30-Day Content Calendar, 100 Content Ideas, Weekly Planning Template, Bonus Posting Checklist.”' },
        ],
      },
      {
        id: 'm5l2',
        title: 'Etsy + Social Profiles',
        subtitle: 'Discoverability beats creation',
        minutes: 5,
        blocks: [
          { t: 'p', lead: true, text: 'Etsy is great for digital products — templates, printables, trackers, checklists. Beginners obsess over creating. Successful sellers obsess over discoverability.' },
          { t: 'callout', variant: 'success', title: 'Competition is proof of demand', text: 'Before creating, search Etsy for your niche. If dozens of similar products exist — good. That means customers already exist. It’s not a reason to quit.' },
          { t: 'h', text: 'Social profiles: launch first, build audience second' },
          { t: 'p', text: 'You do NOT need followers before launching. Read that again. Choose one platform — not five.' },
          {
            t: 'compare',
            left: { title: 'Bad bio', tone: 'flamingo', icon: 'x', items: ['“Entrepreneur | Dreamer | Hustler” — nobody knows what that means'] },
            right: { title: 'Good bio', tone: 'mint', icon: 'check', items: ['“Helping creators plan 30 days of content in under an hour. ↓ Download the Content Calendar.”'] },
          },
          { t: 'bot', text: 'Your bio answers three things: who you help, how you help them, and what they should do next. That’s it.' },
        ],
      },
      {
        id: 'm5l3',
        title: 'Landing Page + Launch',
        subtitle: 'Talk about the customer, not the product',
        minutes: 7,
        blocks: [
          { t: 'p', lead: true, text: 'Most landing pages fail because they talk about the product instead of the customer. Here’s the formula that works.' },
          {
            t: 'flow',
            numbered: true,
            steps: [
              { title: 'Headline', text: 'The outcome you promise. Bad: “AI Prompt Bundle.” Good: “Create a Month of Content in One Afternoon.”' },
              { title: 'Problem', text: 'The pain they feel right now.' },
              { title: 'Solution', text: 'What you’re offering.' },
              { title: 'What’s included', text: 'List everything clearly. No fancy language.' },
              { title: 'Call to action', text: 'One button. One action. “Get Instant Access.”' },
            ],
          },
          { t: 'callout', variant: 'info', title: 'The 80% rule', text: 'If your landing page is 80% done — publish it. Customers care far less about perfection than you think.' },
          { t: 'h', text: 'Launch checklist' },
          {
            t: 'checklist', id: 'cl-launch', title: 'Confirm before publishing',
            items: ['Product created', 'Price added', 'Product image uploaded', 'Description written', 'Payment setup completed', 'Landing page published', 'Social profile created'],
          },
          {
            t: 'callout', variant: 'fire', title: 'The most important exercise in the workbook',
            text: 'Publish your offer. Not plan it. Not redesign it. Not rename it 15 times. Publish it.',
          },
          {
            t: 'worksheet', id: 'ws-m5', title: 'My Launch',
            fields: [
              { id: 'product', label: 'My product name', type: 'text' },
              { id: 'platform', label: 'Platform', type: 'select', options: ['Gumroad', 'Etsy', 'Payhip', 'Other'] },
              { id: 'price', label: 'Price', type: 'text', placeholder: '$' },
              { id: 'link', label: 'Product link', type: 'text', placeholder: 'https://' },
              { id: 'date', label: 'Launch date', type: 'text', placeholder: 'YYYY-MM-DD' },
            ],
          },
          { t: 'banner', text: 'You now have something real. Something people can buy. Something people can reject. And that’s good news — you’ve stopped guessing.' },
        ],
      },
    ],
  },

  // ───────────────────────────── MODULE 6 ──────────────────────────────────
  {
    id: 'm6',
    num: 6,
    title: 'Getting Your First Customer',
    subtitle: 'A great product nobody sees makes nothing.',
    emoji: '🎯',
    color: 'lime',
    art: 'A funnel turning 10 little visitor dots into one glowing customer',
    lessons: [
      {
        id: 'm6l1',
        title: 'The First Customer Problem',
        subtitle: 'Your real goal: the first 10 visitors',
        minutes: 5,
        blocks: [
          { t: 'p', lead: true, text: 'Most people never get their first customer because they never get their first visitor. They launch, then wait. Nothing happens — not because the product is bad, but because nobody knows it exists.' },
          { t: 'callout', variant: 'info', title: 'Visibility matters', text: 'A great product nobody sees makes less than an average product people actually discover.' },
          {
            t: 'compare',
            left: { title: 'NOT the goal', tone: 'flamingo', icon: 'x', items: ['Go viral', 'Get 10,000 followers', 'Build a personal brand'] },
            right: { title: 'THE goal', tone: 'mint', icon: 'check', items: ['Get your first 10 visitors'] },
          },
          { t: 'callout', variant: 'warning', title: 'Skip paid ads (for now)', text: 'When you’re new, you don’t know what messaging works, what converts, or who responds. Buying ads is just buying expensive confusion. Start with free traffic, learn, then scale.' },
        ],
      },
      {
        id: 'm6l2',
        title: 'Free Traffic Channels',
        subtitle: 'LinkedIn, Reddit, Groups, Short-form',
        minutes: 7,
        blocks: [
          { t: 'p', lead: true, text: 'Four free channels that work for beginners — when you lead with value, not promotion.' },
          {
            t: 'channelcards',
            items: [
              { name: 'LinkedIn', tone: 'sky2', tip: 'Massively underrated — almost nobody sells properly there.', dos: ['Lessons learned', 'Mistakes made', 'Behind-the-scenes'], cta: '“Working on a content toolkit for creators. Want early access?”' },
              { name: 'Reddit', tone: 'sun', tip: 'You already found communities in Module 2. Go back — but never spam.', dos: ['Answer questions', 'Provide value', 'Share experiences'], cta: '“I built a content system that solved this for me. Happy to share what worked.”' },
              { name: 'Facebook Groups', tone: 'brand', tip: 'Still work, and most people ignore them. Goal: become recognizable, not famous.', dos: ['Help repeatedly', 'Answer questions', 'Join conversations'], cta: 'People buy from people they trust. Trust comes from visibility.' },
              { name: 'Short-form Content', tone: 'flamingo', tip: 'Highest upside, longest game. You don’t need millions of views.', dos: ['Problem', 'Mistake', 'Solution', 'Call to action'], cta: '100 see it → 10 visit → 1 buys. That’s already a customer.' },
            ],
          },
          { t: 'bot', text: 'The whole secret to all four: help first, sell second. People hate promotion but appreciate help.' },
          {
            t: 'callout', variant: 'success', title: 'The 30-day challenge',
            text: 'Post once per day for a month. Not five times. Not ten. Once. Consistency beats intensity.',
          },
        ],
      },
      {
        id: 'm6l3',
        title: 'First Customer Framework',
        subtitle: 'Climb the traffic ladder',
        minutes: 6,
        blocks: [
          { t: 'p', lead: true, text: 'Most people try to jump straight to referrals and word-of-mouth. Don’t. Climb the ladder.' },
          {
            t: 'timeline',
            steps: [
              { label: 'Level 1', title: 'Your circle', text: 'Friends · Family · Network' },
              { label: 'Level 2', title: 'Communities', text: 'Groups · Forums · Subreddits' },
              { label: 'Level 3', title: 'Content', text: 'Posts · Videos · Articles' },
              { label: 'Level 4', title: 'Referrals', text: 'Word of mouth · Repeat customers' },
            ],
          },
          { t: 'h', text: 'If you don’t know where to start, do this' },
          {
            t: 'flow',
            steps: [
              { title: 'Today', text: 'Send your offer to 5 people.' },
              { title: 'Tomorrow', text: 'Post about it once.' },
              { title: 'This week', text: 'Join 3 communities.' },
              { title: 'This month', text: 'Publish 30 pieces of content.' },
            ],
          },
          { t: 'h', text: 'Visitor tracker — goal: 10 visitors' },
          { t: 'tracker', id: 'visitortracker', days: 7, label: 'Visitors' },
          {
            t: 'worksheet', id: 'ws-m6', title: 'My First Traffic Push',
            fields: [
              { id: 'link', label: 'My offer link', type: 'text', placeholder: 'https://' },
              { id: 'shared', label: 'Where I shared it', type: 'text', placeholder: 'LinkedIn, Reddit, FB Groups…' },
              { id: 'visitors', label: 'Total visitors', type: 'text' },
              { id: 'learned', label: 'What I learned', type: 'textarea' },
            ],
          },
          { t: 'quote', text: 'The person who keeps showing up usually beats the person waiting for perfect conditions. The internet rewards momentum.', author: 'John Cenzer' },
        ],
      },
    ],
  },
]

// Flatten helpers ------------------------------------------------------------
export const allLessons = modules.flatMap((m) =>
  m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleNum: m.num, moduleTitle: m.title, moduleColor: m.color }))
)

export const totalLessons = allLessons.length

export function getModule(id) {
  return modules.find((m) => m.id === id)
}
export function getLesson(moduleId, lessonId) {
  const m = getModule(moduleId)
  return m?.lessons.find((l) => l.id === lessonId)
}
export function lessonIndex(moduleId, lessonId) {
  return allLessons.findIndex((l) => l.moduleId === moduleId && l.id === lessonId)
}
