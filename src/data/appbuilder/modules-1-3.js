// ============================================================================
//  MODULES 1–3 · First App → Design → Client Websites
//
//  Every lesson is the course document's own content, mapped onto the shared
//  typed-block model (src/components/Blocks.jsx). Each module closes with a
//  sixth "Builder Mission" lesson carrying the 🎯 mission, 🧠 Byte's review,
//  📦 downloads and the 🏆 Builder's Dashboard — so the mission is something
//  you complete, and the dashboard is the reward for completing it.
// ============================================================================

export const module1 = {
  id: 'ab-m1',
  num: 1,
  title: 'Your First App in Under 30 Minutes',
  subtitle: 'Publish your very first website to the internet.',
  emoji: '🚀',
  color: 'brand',
  badge: { emoji: '🚀', title: 'First Launch', desc: 'Published your first website' },
  lessons: [
    {
      id: 'ab-m1l1',
      title: 'Welcome, Builder',
      subtitle: 'Why you no longer need to code to build software.',
      minutes: 8,
      xp: 75,
      blocks: [
        { t: 'goal', text: 'Publish your very first website to the internet.', quote: 'You don’t need permission to become a builder. You just need your first launch.' },
        { t: 'h', text: 'What You’ll Learn' },
        { t: 'p', text: 'By the end of this lesson, you’ll understand:' },
        { t: 'list', icon: 'check', items: [
          'Why you no longer need to know how to code to build software',
          'How modern AI builders work',
          'The role you’ll play in every project',
          'The mindset that separates builders from consumers',
        ] },

        { t: 'h', text: 'The Biggest Myth' },
        { t: 'p', text: 'Most people believe building an app looks like this:' },
        { t: 'chain', steps: ['Idea', 'Learn coding', 'Spend months learning frameworks', 'Still don’t know where to start', 'Give up.'], tone: 'flamingo' },
        { t: 'p', text: 'That path worked ten years ago. Not today.' },
        { t: 'p', text: 'Today, AI can generate interfaces, write code, fix bugs, and explain errors in seconds.' },
        { t: 'callout', variant: 'success', title: 'Your actual job', text: 'Your job isn’t to write every line of code. Your job is to think clearly, make decisions, and guide the build. That’s a completely different skill—and one that’s becoming more valuable every day.' },

        { t: 'h', text: 'Meet the Team' },
        { t: 'p', text: 'Every great product needs a team. Here’s yours:' },
        { t: 'cards', items: [
          { title: '👨‍💻 You — The Product Owner', tone: 'brand', badge: 'The visionary', icon: 'check', list: ['What to build', 'Who it’s for', 'What success looks like'] },
          { title: '🤖 AI — Your Development Partner', tone: 'sky2', badge: 'A fast junior developer', icon: 'check', list: ['Generate code', 'Design interfaces', 'Debug problems', 'Improve layouts', 'Speed up development'] },
        ] },
        { t: 'p', text: 'Think of AI as a fast junior developer. It works quickly, but it still needs clear direction.' },
        { t: 'capy', label: '🦫 Capy & ⚡ Byte', text: 'Throughout this course, we’ll share shortcuts, design tips, and gentle reminders when you’re overthinking things. Building should feel fun—not intimidating.' },
        { t: 'bot', label: '💬 Byte Says', text: 'Don’t worry about building the perfect app. Build version one. You can always improve version two.' },
      ],
    },
    {
      id: 'ab-m1l2',
      title: 'Meet Your Toolbox',
      subtitle: 'The stack you’ll build with — and why it doesn’t matter that it will change.',
      minutes: 8,
      xp: 75,
      blocks: [
        { t: 'h', text: 'The Golden Rule' },
        { t: 'banner', text: 'Don’t fall in love with tools. Fall in love with solving problems.' },
        { t: 'p', text: 'AI tools will change every year. The ability to build won’t.' },

        { t: 'h', text: 'Our Core Toolkit' },
        { t: 'p', text: 'Throughout this course, we’ll primarily use:' },
        { t: 'toolcards', items: [
          { name: 'Claude', role: 'Thinking', tone: 'brand', uses: ['Planning', 'Architecture', 'Debugging', 'Prompts'], note: 'Where you work out what to build before you ask anything to build it.' },
          { name: 'An AI app builder', role: 'Generating', tone: 'sky2', uses: ['Websites', 'Apps'], note: 'Lovable, Bolt, Replit — whichever you prefer. The workflow is the same.' },
          { name: 'GitHub', role: 'Optional', tone: 'mint', uses: ['Saving projects'], note: 'Not required to finish this course, but worth it once you have projects worth keeping.' },
          { name: 'Vercel', role: 'Publishing', tone: 'gold', uses: ['Deployment', 'Custom domains'], note: 'Module 7 walks through this properly. For now, it’s where your site goes live.' },
          { name: 'Browser DevTools', role: 'Fixing', tone: 'flamingo', uses: ['Quick fixes'], note: 'Right-click, Inspect. You’ll use it more than you expect.' },
        ] },
        { t: 'callout', variant: 'info', title: 'Tools change. Workflows don’t.', text: 'If better tools appear in the future, you can swap them in. The workflow stays the same.' },

        { t: 'h', text: 'Why This Stack?' },
        { t: 'p', text: 'Because it’s:' },
        { t: 'list', icon: 'check', items: ['Beginner-friendly', 'Fast', 'Affordable', 'Professional enough to launch real products'] },
        { t: 'capy', label: '💬 Capy Says', text: 'Professional developers change tools all the time. Professional builders don’t panic when tools change.' },
      ],
    },
    {
      id: 'ab-m1l3',
      title: 'Your First Prompt',
      subtitle: 'This is where everything changes.',
      minutes: 12,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'This is where everything changes.' },
        { t: 'p', text: 'Open your AI app builder. Paste this:' },
        { t: 'prompt', title: 'Your first build prompt', text: `Build a modern personal portfolio website.

Requirements:
- Dark theme
- Smooth animations
- Hero section
- About Me
- Skills
- Projects
- Contact section
- Mobile responsive
- Premium look`, note: 'Click Generate. Then… don’t touch anything. Just watch.' },
        { t: 'p', text: 'A few minutes ago, you had nothing. Now you’re watching software being built in front of you.' },
        { t: 'p', text: 'That’s the moment most people realize:' },
        { t: 'quote', text: 'I can actually do this.' },

        { t: 'h', text: 'Why We Started with a Portfolio' },
        { t: 'p', text: 'Because every builder needs a home on the internet.' },
        { t: 'callout', variant: 'success', title: 'By the end of today', text: 'You’ll have one.' },
      ],
    },
    {
      id: 'ab-m1l4',
      title: 'Make It Yours',
      subtitle: 'You aren’t coding. You’re making decisions.',
      minutes: 15,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Your app already works. Now it’s time to make it feel like yours.' },
        { t: 'p', text: 'Try changing:' },
        { t: 'list', icon: 'dot', items: ['Primary color', 'Font', 'Hero headline', 'Button text', 'Images', 'Layout', 'Animations'] },
        { t: 'callout', variant: 'success', title: 'Notice something?', text: 'You aren’t coding. You’re making decisions. That’s exactly what product builders do.' },
        { t: 'vaultlink', intro: 'Two Builder Vault libraries make this step much faster:', items: [
          { to: 'builder-vault/palettes', label: 'Color Palette Library', desc: '20 palettes with copyable HEX codes', icon: 'Palette', tone: 'gold' },
          { to: 'builder-vault/fonts', label: 'Font Pairing Library', desc: '15 heading + body pairings with live previews', icon: 'Type', tone: 'sky2' },
        ] },

        { t: 'h', text: 'Mini Challenge' },
        { t: 'mission', title: '🎨 Make it unmistakably yours', intro: 'Spend 15 minutes customizing your website until it reflects your personality.', items: ['Change the primary color to one you’d actually choose', 'Swap the font pairing', 'Rewrite the hero headline in your own words', 'Replace the placeholder images'], note: 'Don’t copy mine. Build yours.' },
      ],
    },
    {
      id: 'ab-m1l5',
      title: 'Publish Your First Website',
      subtitle: 'Building is fun. Shipping changes your identity.',
      minutes: 15,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Building is fun. Shipping changes your identity.' },
        { t: 'p', text: 'Today you’ll publish your project. Not someday. Today.' },
        { t: 'p', text: 'We’ll walk through:' },
        { t: 'flow', numbered: true, steps: [
          { title: 'Deploying your project', text: 'Connect your builder to a host and push it live.' },
          { title: 'Getting a public URL', text: 'A real link anyone on the internet can open.' },
          { title: 'Testing on mobile', text: 'Open it on your phone. Fix what looks wrong.' },
          { title: 'Sharing it with friends', text: 'Send the link. Watch what they say.' },
        ] },
        { t: 'banner', text: 'Congratulations. You’re officially a builder.' },
      ],
    },
    {
      id: 'ab-m1l6',
      title: 'Builder Mission — Launch Your Portfolio Website',
      subtitle: 'Generate it, customize it, publish it, save the URL.',
      minutes: 45,
      xp: 150,
      blocks: [
        { t: 'mission', title: '🎯 Builder Mission — Launch Your Portfolio Website', intro: 'Your mission is to:', items: [
          'Generate your portfolio',
          'Customize it',
          'Publish it online',
          'Copy the public URL',
          'Save it—you’ll improve it throughout this course',
        ] },
        { t: 'worksheet', id: 'ab-m1-mission', title: 'Your first launch', fields: [
          { id: 'url', label: 'Your public URL', type: 'text', placeholder: 'https://…' },
          { id: 'proud', label: 'What are you most proud of on it?', type: 'textarea', rows: 2 },
          { id: 'improve', label: 'What’s one thing you’d improve before calling it version 1?', type: 'textarea', rows: 2 },
        ] },

        { t: 'checklist', id: 'ab-m1-review', title: '🧠 Byte’s Builder Challenge', items: [
          'Does my website clearly explain who I am?',
          'Would I be proud to send this link to someone?',
          'What’s one thing I can improve before calling it version 1?',
        ] },
        { t: 'callout', variant: 'fire', title: 'Remember', text: 'Done beats perfect. Launch first. Improve forever.' },

        { t: 'resourcelist', moduleId: 'ab-m1', kind: 'download' },

        { t: 'dashboard', moduleId: 'ab-m1', title: '🏆 Module 1 Complete', pct: 10, stats: [
          { label: 'Projects Built', value: '1/10' },
          { label: 'Apps Published', value: '1' },
        ], skills: ['Prompting', 'UI Customization', 'Deployment'], progressLabel: 'Portfolio Progress', next: 'Build a website that actually converts visitors into customers.' },

        { t: 'bytesummary', intro: 'In Module 1 you learned:', learned: [
          'Why building no longer starts with learning to code',
          'The core toolkit — and why swapping tools doesn’t matter',
          'How to write a first build prompt',
          'How to customize a generated app by making decisions, not edits',
          'How to publish a real site to a real URL',
        ], nextModuleId: 'ab-m2' },
        { t: 'moduleunlock', moduleId: 'ab-m1', nextModuleId: 'ab-m2' },
      ],
    },
  ],
}

export const module2 = {
  id: 'ab-m2',
  num: 2,
  title: 'Design Like a Pro (Without Being One)',
  subtitle: 'The design principles that make apps look polished, trustworthy, and premium.',
  emoji: '🎨',
  color: 'flamingo',
  badge: { emoji: '🎨', title: 'Design Eye', desc: 'Redesigned your portfolio to a professional standard' },
  lessons: [
    {
      id: 'ab-m2l1',
      title: 'Why Some Apps Feel Premium',
      subtitle: 'Users don’t see code. They see confidence.',
      minutes: 8,
      xp: 75,
      blocks: [
        { t: 'goal', text: 'Learn the design principles that make apps look polished, trustworthy, and premium.', quote: 'People judge your app in seconds. Great design isn’t decoration—it’s communication.' },
        { t: 'h', text: 'What You’ll Learn' },
        { t: 'p', text: 'By the end of this lesson, you’ll understand why apps like Apple, Notion, Airbnb, and Linear feel so polished—even though they’re incredibly simple.' },

        { t: 'h', text: 'First Impressions Matter' },
        { t: 'p', text: 'Open two websites. One is cluttered. One is clean. Both do the exact same thing.' },
        { t: 'p', text: 'Which one would you trust with your money?' },
        { t: 'p', text: 'Exactly.' },
        { t: 'callout', variant: 'success', title: 'Users don’t see code', text: 'They see confidence. Great design creates trust before a single feature is used.' },

        { t: 'h', text: 'The Premium Formula' },
        { t: 'p', text: 'Most beautiful apps follow the same principles:' },
        { t: 'list', icon: 'check', items: ['Simplicity', 'Consistency', 'Clear hierarchy', 'Breathing room', 'Intentional colors'] },
        { t: 'p', text: 'They’re not adding more. They’re removing distractions.' },
        { t: 'bot', label: '💬 Byte Says', text: 'If everything is important, nothing is important.' },
      ],
    },
    {
      id: 'ab-m2l2',
      title: 'Steal Like a Designer',
      subtitle: 'No great designer starts with a blank canvas.',
      minutes: 10,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'No great designer starts with a blank canvas. They collect inspiration.' },
        { t: 'p', text: 'Professional designers call it reference hunting.' },
        { t: 'p', text: 'We’ll create an inspiration board using websites from:' },
        { t: 'list', icon: 'dot', items: ['Mobbin', 'Dribbble', 'Awwwards', 'Land-book', 'Lapa Ninja'] },
        { t: 'callout', variant: 'success', title: 'The rule', text: 'Instead of copying one design, borrow ideas from five different ones. That’s how unique products are born.' },
        { t: 'vaultlink', intro: 'The Builder Vault has two directories built for exactly this:', items: [
          { to: 'builder-vault/study', label: '50 Websites to Study', desc: 'What to look at on each one, and why', icon: 'Eye', tone: 'gold' },
          { to: 'builder-vault/resources', label: 'Resource Vault', desc: 'Every inspiration site with an official link', icon: 'Package', tone: 'flamingo' },
        ] },

        { t: 'h', text: 'Mini Challenge' },
        { t: 'mission', title: '👀 Build your reference board', intro: 'Save five websites that make you say: “I wish I built this.”', items: ['Pick five, not one', 'Note what specifically you like about each', 'Keep the list — you’ll revisit them throughout the course'] },
      ],
    },
    {
      id: 'ab-m2l3',
      title: 'The 5 Rules of Great UI',
      subtitle: 'Forget 200 design rules. Master these five.',
      minutes: 12,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Forget 200 design rules. Master these five.' },
        { t: 'cards', items: [
          { title: 'Rule 1 — White Space Wins', tone: 'brand', badge: 'Space', body: 'Give elements room to breathe. Crowded designs feel cheap.' },
          { title: 'Rule 2 — One Primary Action', tone: 'sky2', badge: 'Focus', body: 'Every screen should answer one question: “What do I want the user to do next?” If there are five buttons, users click none.' },
          { title: 'Rule 3 — Use Fewer Colors', tone: 'gold', badge: 'Color', body: 'Three colors are enough: primary, secondary, accent. More colors = more confusion.' },
          { title: 'Rule 4 — Typography Creates Hierarchy', tone: 'flamingo', badge: 'Type', body: 'Don’t use five fonts. Use one or two. Change size and weight instead.' },
          { title: 'Rule 5 — Consistency Beats Creativity', tone: 'mint', badge: 'System', body: 'Buttons. Spacing. Cards. Icons. Keep them consistent across every page.' },
        ] },
        { t: 'quiz', id: 'ab-m2-quiz-1', question: 'A screen has five equally-weighted buttons. What does Rule 2 predict?', options: ['Users pick their favourite', 'Users click none of them', 'Users click the first one', 'It doesn’t matter if they all work'], answer: 1, explain: 'If there are five buttons, users click none. One primary action per screen is what makes the next step obvious.' },
        { t: 'capy', label: '💬 Capy Says', text: 'Your app should feel like one product—not ten different pages stitched together.' },
      ],
    },
    {
      id: 'ab-m2l4',
      title: 'Build an App People Trust',
      subtitle: 'Redesign your Module 1 portfolio.',
      minutes: 20,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Now we’ll redesign your portfolio from Module 1.' },
        { t: 'p', text: 'Upgrade it using:' },
        { t: 'list', icon: 'check', items: [
          'Better spacing', 'Cleaner typography', 'Stronger hero section', 'Better buttons',
          'Better icons', 'Improved navigation', 'Consistent color palette', 'Better mobile layout',
        ] },
        { t: 'p', text: 'Watch how small improvements completely change the perception of your app.' },

        { t: 'h', text: 'Before vs. After' },
        { t: 'callout', variant: 'info', title: 'Do this first', text: 'Take screenshots before you start. Take screenshots after you’re done. The difference will surprise you.' },
      ],
    },
    {
      id: 'ab-m2l5',
      title: 'Make It Feel Alive',
      subtitle: 'Tiny interactions make products memorable.',
      minutes: 12,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Static apps feel unfinished. Tiny interactions make products memorable.' },
        { t: 'p', text: 'Add:' },
        { t: 'list', icon: 'check', items: [
          'Hover animations', 'Button feedback', 'Smooth scrolling', 'Fade-in sections',
          'Loading states', 'Card animations', 'Micro-interactions',
        ] },
        { t: 'callout', variant: 'warning', title: 'Restraint', text: 'You don’t need flashy effects. You need thoughtful ones.' },
      ],
    },
    {
      id: 'ab-m2l6',
      title: 'Builder Mission — Transform Your Portfolio',
      subtitle: 'Make it something you’d send to a client.',
      minutes: 45,
      xp: 150,
      blocks: [
        { t: 'mission', title: '🎯 Builder Mission', intro: 'Take your portfolio website and transform it into something you’d proudly include in a job application or send to your first client. Focus on:', items: [
          'Better typography', 'Better spacing', 'Better colors', 'Better animations', 'Better user experience',
        ], note: 'Publish the updated version.' },

        { t: 'checklist', id: 'ab-m2-review', title: '🧠 Byte’s Design Review', items: [
          'Does my homepage have one clear focus?',
          'Can someone understand what I do in five seconds?',
          'Does anything feel cluttered?',
          'Would I trust this website if I were a visitor?',
        ] },
        { t: 'callout', variant: 'fire', title: 'If the answer is “no,” keep iterating.', text: 'Good design is never finished—it’s refined.' },

        { t: 'resourcelist', moduleId: 'ab-m2', kind: 'download' },

        { t: 'dashboard', moduleId: 'ab-m2', title: '🏆 Module 2 Complete', pct: 20, stats: [
          { label: 'Projects Built', value: '1' },
          { label: 'Projects Improved', value: '1' },
        ], skills: ['Visual Hierarchy', 'Color Theory', 'Typography', 'White Space', 'Micro-interactions'], skillsLabel: 'Design Skills Unlocked', progressLabel: 'Portfolio Progress', next: 'Build your first real business website for an actual client.' },

        { t: 'bytesummary', intro: 'In Module 2 you learned:', learned: [
          'Why premium products feel premium',
          'How to hunt references instead of staring at a blank canvas',
          'The five UI rules worth actually remembering',
          'How to redesign an existing project to a professional standard',
          'Which micro-interactions are worth adding',
        ], nextModuleId: 'ab-m3' },
        { t: 'moduleunlock', moduleId: 'ab-m2', nextModuleId: 'ab-m3' },
      ],
    },
  ],
}

export const module3 = {
  id: 'ab-m3',
  num: 3,
  title: 'Build Websites That People Actually Pay For',
  subtitle: 'Build websites that convert visitors into customers—not just look pretty.',
  emoji: '💰',
  color: 'gold',
  badge: { emoji: '💼', title: 'First Client Build', desc: 'Delivered a complete client website' },
  lessons: [
    {
      id: 'ab-m3l1',
      title: 'Think Like a Business Owner',
      subtitle: 'Every website has one job.',
      minutes: 10,
      xp: 75,
      blocks: [
        { t: 'goal', text: 'Learn how to build websites that convert visitors into customers—not just look pretty.', quote: 'A beautiful website that doesn’t get results is just digital art.' },
        { t: 'h', text: 'What You’ll Learn' },
        { t: 'p', text: 'By the end of this lesson, you’ll understand why every successful website starts with one question:' },
        { t: 'quote', text: 'What is this website supposed to achieve?' },
        { t: 'list', icon: 'dot', items: [
          'A restaurant wants reservations.',
          'A gym wants memberships.',
          'A dentist wants appointments.',
          'A freelancer wants inquiries.',
        ] },
        { t: 'callout', variant: 'success', title: 'Every website has one job', text: 'Your job is to make that action obvious.' },

        { t: 'h', text: 'The 5-Second Test' },
        { t: 'p', text: 'Imagine someone lands on your homepage. Can they answer these questions within five seconds?' },
        { t: 'checklist', id: 'ab-m3-5second', title: 'The 5-Second Test', items: [
          'What is this business?',
          'Who is it for?',
          'Why should I care?',
          'What should I do next?',
        ] },
        { t: 'p', text: 'If not, redesign it. Confused visitors never convert.' },
        { t: 'bot', label: '💬 Byte Says', text: 'If users have to think, you’ve already lost them.' },
      ],
    },
    {
      id: 'ab-m3l2',
      title: 'Anatomy of a High-Converting Homepage',
      subtitle: 'Every great homepage follows a simple flow.',
      minutes: 12,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Every great homepage follows a simple flow.' },
        { t: 'timeline', steps: [
          { label: 'Section 1', title: 'Hero Section', text: 'Grab attention. Answer: “What do you do?”' },
          { label: 'Section 2', title: 'Social Proof', text: 'Show why you’re trustworthy — reviews, client logos, awards, testimonials, case studies.' },
          { label: 'Section 3', title: 'Benefits', text: 'Focus on outcomes, not features.' },
          { label: 'Section 4', title: 'How It Works', text: 'Make the process simple. Step 1, Step 2, Step 3.' },
          { label: 'Section 5', title: 'Final CTA', text: 'Ask for one action. Book a call. Order now. Get started.' },
        ] },
        { t: 'beforeafter', beforeLabel: 'Instead of this (a feature)', afterLabel: 'Say this (an outcome)', before: 'AI-powered CRM', after: 'Never lose another customer.' },
      ],
    },
    {
      id: 'ab-m3l3',
      title: 'Build Your First Client Website',
      subtitle: 'Stop building for yourself. Pick a client.',
      minutes: 15,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Time to stop building for yourself.' },
        { t: 'p', text: 'Choose one:' },
        { t: 'list', icon: 'dot', items: [
          '🍔 Restaurant', '🏋️ Gym', '☕ Coffee Shop', '🦷 Dentist',
          '🏠 Real Estate Agent', '📸 Photographer', '💼 Marketing Agency', '🐶 Pet Groomer',
        ] },
        { t: 'callout', variant: 'success', title: 'Pick one', text: 'Treat it like a real client.' },

        { t: 'h', text: 'Project Brief' },
        { t: 'p', text: 'You’ll receive:' },
        { t: 'list', icon: 'check', items: ['Business description', 'Target audience', 'Goals', 'Brand personality', 'Color preferences'] },
        { t: 'p', text: 'Your job? Turn that brief into a professional website.' },
        { t: 'vaultlink', intro: 'The Builder Recipes collection has ready-made prompts for most of these categories:', items: [
          { to: 'builder-vault/recipes', label: 'Builder Recipes — Website Recipes', desc: 'Restaurant, gym, dentist, real estate, photographer and more', icon: 'Globe', tone: 'brand' },
        ] },
      ],
    },
    {
      id: 'ab-m3l4',
      title: 'Sell Before You Build',
      subtitle: 'Professionals ask questions first.',
      minutes: 12,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'One mistake beginners make: they open the builder immediately.' },
        { t: 'p', text: 'Professionals ask questions first.' },
        { t: 'worksheet', id: 'ab-m3-discovery', title: 'Before building, answer', fields: [
          { id: 'customer', label: 'Who is the customer?', type: 'textarea', rows: 2 },
          { id: 'problem', label: 'What problem are we solving?', type: 'textarea', rows: 2 },
          { id: 'action', label: 'What action do we want visitors to take?', type: 'text' },
          { id: 'different', label: 'What makes this business different?', type: 'textarea', rows: 2 },
          { id: 'trust', label: 'Why should anyone trust them?', type: 'textarea', rows: 2 },
        ] },
        { t: 'callout', variant: 'success', title: 'These answers become your blueprint.', text: 'Everything you build afterwards is downstream of them.' },

        { t: 'h', text: 'Builder Framework' },
        { t: 'blueprint', title: 'Before every project', subtitle: 'Six steps, in this order.', steps: [
          { name: 'Understand', tone: 'brand', detail: 'Ask the questions' },
          { name: 'Plan', tone: 'sky2', detail: 'Decide the structure' },
          { name: 'Design', tone: 'flamingo', detail: 'Choose the look' },
          { name: 'Build', tone: 'gold', detail: 'Generate and refine' },
          { name: 'Test', tone: 'mint', detail: 'Every device' },
          { name: 'Launch', tone: 'brand', detail: 'Ship it' },
        ], note: 'Skip Step 1, and the rest usually falls apart.' },
      ],
    },
    {
      id: 'ab-m3l5',
      title: 'Present Like a Professional',
      subtitle: 'A great builder explains their decisions.',
      minutes: 10,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'A great builder doesn’t just deliver a website. They explain their decisions.' },
        { t: 'p', text: 'Practice presenting your project:' },
        { t: 'list', icon: 'dot', items: [
          'Why did you choose these colors?',
          'Why is the CTA here?',
          'Why is the navigation simple?',
          'Why this layout?',
        ] },
        { t: 'callout', variant: 'success', title: 'The payoff', text: 'If you can explain your choices, clients trust you more.' },
      ],
    },
    {
      id: 'ab-m3l6',
      title: 'Builder Mission — Your First Client Project',
      subtitle: 'A complete website, plus the summary that explains it.',
      minutes: 60,
      xp: 150,
      blocks: [
        { t: 'mission', title: '🎯 Builder Mission — Your First Client Project', intro: 'Choose one business category. Design a complete website that includes:', items: [
          'Homepage', 'About', 'Services', 'Testimonials', 'Contact', 'Mobile version',
        ] },
        { t: 'worksheet', id: 'ab-m3-mission', title: 'Then write a short project summary explaining', fields: [
          { id: 'goal', label: 'The business goal', type: 'textarea', rows: 2 },
          { id: 'audience', label: 'The target audience', type: 'textarea', rows: 2 },
          { id: 'decisions', label: 'Three design decisions you made', type: 'textarea', rows: 3 },
          { id: 'v2', label: 'One thing you’d improve in Version 2', type: 'textarea', rows: 2 },
        ] },
        { t: 'capy', label: '💬 Capy’s Client Tip', text: 'Clients don’t buy pages—they buy confidence that you’ll solve their problem.' },

        { t: 'checklist', id: 'ab-m3-review', title: '🧠 Byte’s Review Checklist', items: [
          'Can I understand the business in five seconds?',
          'Is there one clear call-to-action?',
          'Would I trust this business if I found it online?',
          'Does the design match the brand personality?',
          'Is it mobile-friendly?',
        ] },
        { t: 'callout', variant: 'success', title: 'All five ticked?', text: 'You’re ready to launch.' },

        { t: 'resourcelist', moduleId: 'ab-m3', kind: 'download' },

        { t: 'dashboard', moduleId: 'ab-m3', title: '🏆 Module 3 Complete', pct: 30, stats: [
          { label: 'Projects Built', value: '2' },
          { label: 'Client Projects', value: '1' },
        ], skills: ['Client Discovery', 'Conversion-Focused Design', 'Homepage Structure', 'Presentation Skills'], progressLabel: 'Portfolio Progress', next: 'Stop building websites. Start building real web applications.' },

        { t: 'bytesummary', intro: 'In Module 3 you learned:', learned: [
          'That every website has exactly one job',
          'The five-second test, and how to pass it',
          'The structure behind a high-converting homepage',
          'The discovery questions to ask before opening a builder',
          'How to present design decisions so clients trust them',
        ], nextModuleId: 'ab-m4' },
        { t: 'moduleunlock', moduleId: 'ab-m3', nextModuleId: 'ab-m4' },
      ],
    },
  ],
}
