// ============================================================================
//  MODULE 7 · BOSS BATTLE · MODULE 8 (CAPSTONE + GRADUATION)
//
//  The Boss Battle and the Capstone are separate modules because the document
//  treats them as separate experiences — the Boss Battle is one sentence and no
//  brief; the Capstone is a planned, presented product. They keep the document's
//  own names via `label`, so the module list reads "Boss Battle" and "Module 8"
//  rather than "Module 8" and "Module 9".
// ============================================================================

export const module7 = {
  id: 'ab-m7',
  num: 7,
  title: 'Launch Like a Founder',
  subtitle: 'Deploy, optimize, monetize and confidently share your apps with the world.',
  emoji: '🚀',
  color: 'brand',
  badge: { emoji: '🚀', title: 'Shipped', desc: 'Launched a project publicly and collected feedback' },
  lessons: [
    {
      id: 'ab-m7l1',
      title: 'Done is Better Than Perfect',
      subtitle: 'Your first users are your best teachers.',
      minutes: 8,
      xp: 75,
      blocks: [
        { t: 'goal', text: 'Learn how to deploy, optimize, monetize, and confidently share your apps with the world.', quote: 'A product sitting on your computer changes nothing. A product launched into the world can change everything.' },
        { t: 'h', text: 'What You’ll Learn' },
        { t: 'p', text: 'Every builder hears the same voice:' },
        { t: 'quote', text: 'I’ll launch after I fix one more thing.' },
        { t: 'p', text: 'Then… one week becomes one month. One month becomes one year.' },
        { t: 'callout', variant: 'success', title: 'Successful founders launch imperfect products', text: 'Then improve them. Your first users are your best teachers.' },

        { t: 'h', text: 'Version 1 Isn’t Your Final Product' },
        { t: 'list', icon: 'dot', items: ['Instagram wasn’t Instagram.', 'Facebook wasn’t Facebook.', 'Airbnb wasn’t Airbnb.'] },
        { t: 'p', text: 'Every successful product started smaller than you think.' },
        { t: 'banner', text: 'Launch Version 1. Earn Version 2.' },
        { t: 'bot', label: '💬 Byte Says', text: 'Perfection is the fastest way to never ship.' },
      ],
    },
    {
      id: 'ab-m7l2',
      title: 'Deploy Your App',
      subtitle: 'Your app deserves a home.',
      minutes: 15,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Your app deserves a home. In this lesson you’ll learn how to:' },
        { t: 'list', icon: 'check', items: [
          'Publish your project',
          'Connect a custom domain',
          'Create a professional URL',
          'Add a favicon',
          'Improve page titles',
          'Create social sharing previews',
        ] },
        { t: 'callout', variant: 'success', title: 'Because details matter', text: 'The difference between a project and a product is usually the last five of these.' },

        { t: 'h', text: 'Builder Challenge' },
        { t: 'mission', title: '📱 The phone test', intro: 'Visit your app from a phone. Ask yourself:', items: ['Would I believe this belongs to a real company?'], note: 'If not… keep improving.' },
      ],
    },
    {
      id: 'ab-m7l3',
      title: 'Get Your First Users',
      subtitle: 'Find your first ten.',
      minutes: 12,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'A beautiful app nobody knows about… is invisible.' },
        { t: 'p', text: 'We’ll cover simple launch strategies:' },
        { t: 'list', icon: 'dot', items: [
          'Share on LinkedIn', 'Post on X', 'Share in Reddit communities (where appropriate)',
          'Product Hunt', 'Indie Hackers', 'Personal portfolio',
          'Friends and family feedback', 'Relevant Discord communities',
        ] },
        { t: 'callout', variant: 'success', title: 'Don’t chase thousands of users', text: 'Find your first ten. They’ll teach you more than analytics ever will.' },
        { t: 'capy', label: '💬 Capy Says', text: 'Your first users aren’t customers. They’re collaborators.' },
      ],
    },
    {
      id: 'ab-m7l4',
      title: 'Turn Projects Into Portfolio Pieces',
      subtitle: 'Don’t just say what you built. Tell the story.',
      minutes: 12,
      xp: 75,
      blocks: [
        { t: 'beforeafter', beforeLabel: 'Don’t just say', afterLabel: 'Tell the story', before: 'I built a habit tracker.', after: 'The problem, your solution, the key features, your design decisions, the biggest challenge, and what you’d improve next.' },
        { t: 'p', text: 'For every project include:' },
        { t: 'list', icon: 'check', items: [
          'The problem', 'Your solution', 'Key features',
          'Design decisions', 'Biggest challenge', 'What you’d improve next',
        ] },
        { t: 'callout', variant: 'success', title: 'This transforms a project into a case study', text: 'Case studies impress clients. Case studies impress employers. Case studies build trust.' },
      ],
    },
    {
      id: 'ab-m7l5',
      title: 'Your Next Step',
      subtitle: 'Builders see opportunities where everyone else sees inconvenience.',
      minutes: 8,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'You now know how to:' },
        { t: 'list', icon: 'check', items: ['Plan', 'Design', 'Build', 'Polish', 'Launch'] },
        { t: 'p', text: 'Now ask yourself:' },
        { t: 'quote', text: 'What problem bothers me every day?' },
        { t: 'p', text: 'That’s probably your next app.' },
        { t: 'callout', variant: 'success', title: 'The goal isn’t to copy ideas', text: 'It’s to notice problems. Builders see opportunities where everyone else sees inconvenience.' },
      ],
    },
    {
      id: 'ab-m7l6',
      title: 'Builder Mission — Launch Week',
      subtitle: 'Deploy it, write the case study, share it, collect feedback.',
      minutes: 60,
      xp: 150,
      blocks: [
        { t: 'mission', title: '🎯 Builder Mission — Launch Week', intro: 'Choose one project. Complete everything below:', items: [
          'Deploy it',
          'Connect a custom domain (optional but encouraged)',
          'Write a project case study',
          'Share it publicly',
          'Collect feedback from at least five people',
          'Create a Version 2 roadmap with future improvements',
        ], note: 'This isn’t the end of your project. It’s the beginning of its life.' },

        { t: 'checklist', id: 'ab-m7-review', title: '🧠 Byte’s Launch Checklist', items: [
          'Is my app publicly accessible?',
          'Does it load quickly?',
          'Does it work on mobile?',
          'Can someone understand it in under a minute?',
          'Did I actually share it with someone?',
        ] },
        { t: 'callout', variant: 'success', title: 'If yes… congratulations.', text: 'You’re no longer practicing. You’re shipping.' },
        { t: 'vaultlink', intro: 'Run the full pre-launch pass before you call it done:', items: [
          { to: 'builder-vault/launch-checklist', label: 'Launch Checklist', desc: '58 checks: design, responsiveness, performance, SEO, accessibility, testing, code quality, deployment', icon: 'Rocket', tone: 'brand' },
        ] },

        { t: 'resourcelist', moduleId: 'ab-m7', kind: 'download' },

        { t: 'dashboard', moduleId: 'ab-m7', title: '🏆 Module 7 Complete', pct: 90, stats: [
          { label: 'Projects Built', value: '5+' },
          { label: 'Projects Launched', value: '5+' },
          { label: 'Public Portfolio', value: 'Live' },
        ], skills: ['Deployment', 'Product Launch', 'User Feedback', 'Portfolio Building', 'Founder Mindset'], progressLabel: 'Portfolio Progress', nextLabel: 'Final Mission', next: 'Build anything you can imagine.' },

        { t: 'bytesummary', intro: 'In Module 7 you learned:', learned: [
          'Why launching imperfect beats launching never',
          'How to deploy properly — domain, favicon, titles, previews',
          'How to find your first ten users',
          'How to turn a project into a case study',
          'How to spot your next app',
        ], nextModuleId: 'ab-m8' },
        { t: 'moduleunlock', moduleId: 'ab-m7', nextModuleId: 'ab-m8' },
      ],
    },
  ],
}

// ── Boss Battle ─────────────────────────────────────────────────────────────
export const bossBattle = {
  id: 'ab-m8',
  num: 8,
  label: 'Boss Battle',
  title: 'Boss Battle — Ship It',
  subtitle: 'One sentence. No brief. No walkthrough. Build it anyway.',
  emoji: '🥊',
  color: 'flamingo',
  badge: { emoji: '🥊', title: 'Boss Battle Cleared', desc: 'Shipped a product from a single sentence' },
  lessons: [
    {
      id: 'ab-m8l1',
      title: 'Ship It',
      subtitle: 'This time, there’s no project brief.',
      minutes: 90,
      xp: 150,
      blocks: [
        { t: 'goal', text: 'One sentence is the whole brief. Everything else is your decision.', quote: 'Exactly like a real freelancer, startup founder, or product designer would.' },
        { t: 'p', lead: true, text: 'This time, there’s no project brief.' },
        { t: 'compare',
          left: { title: 'What you get', tone: 'flamingo', icon: 'x', items: ['No design', 'No walkthrough', 'No starter files', 'No step-by-step tutorial'] },
          right: { title: 'What you get instead', tone: 'brand', icon: 'check', items: ['One sentence', 'Everything you learned in Modules 1–7', 'Your own judgement'] },
        },
        { t: 'p', text: 'You’ll receive one sentence. Example:' },
        { t: 'cards', items: [
          { title: 'Brief A', tone: 'brand', badge: 'One sentence', body: '“Build an app that helps college students split expenses with roommates.”' },
          { title: 'Brief B', tone: 'gold', badge: 'One sentence', body: '“Build a website for a luxury hotel opening in Miami.”' },
          { title: 'Brief C', tone: 'sky2', badge: 'One sentence', body: '“Create a productivity app for remote teams.”' },
        ] },
        { t: 'banner', text: 'That’s it.' },

        { t: 'h', text: 'You’re expected to:' },
        { t: 'timeline', steps: [
          { label: 'Step 1', title: 'Define the problem', text: 'What exactly is broken, and for whom?' },
          { label: 'Step 2', title: 'Research the audience', text: 'Who are they, and what do they already use?' },
          { label: 'Step 3', title: 'Plan the features', text: 'Version 1 only. Three to five things.' },
          { label: 'Step 4', title: 'Design the interface', text: 'Apply the five UI rules from Module 2.' },
          { label: 'Step 5', title: 'Build the product', text: 'Brief the builder from your plan, not from a blank prompt.' },
          { label: 'Step 6', title: 'Polish the experience', text: 'Empty states, errors, mobile, speed.' },
          { label: 'Step 7', title: 'Launch it', text: 'Public URL. Shared with real people.' },
        ] },

        { t: 'worksheet', id: 'ab-boss-battle', title: 'Your Boss Battle', fields: [
          { id: 'brief', label: 'Your one-sentence brief', type: 'textarea', rows: 2, placeholder: 'Pick one of the three above, or write your own.' },
          { id: 'problem', label: 'The problem, defined in your own words', type: 'textarea', rows: 3 },
          { id: 'audience', label: 'Who is it for?', type: 'textarea', rows: 2 },
          { id: 'features', label: 'Version 1 features (3–5)', type: 'textarea', rows: 3 },
          { id: 'url', label: 'The public URL, once it’s live', type: 'text', placeholder: 'https://…' },
        ] },

        { t: 'capy', label: '💬 Capy Says', text: 'This is the part where you find out you already knew how. Nobody is going to hand you the brief in real life either.' },
        { t: 'moduleunlock', moduleId: 'ab-m8', nextModuleId: 'ab-m9' },
      ],
    },
  ],
}

// ── Module 8 · The Capstone Challenge ───────────────────────────────────────
export const module8 = {
  id: 'ab-m9',
  num: 9,
  label: 'Module 8',
  title: 'The Capstone Challenge',
  subtitle: 'Plan, design, build, launch and present a complete product from scratch.',
  emoji: '🏆',
  color: 'gold',
  badge: { emoji: '🎓', title: 'AI App Builder', desc: 'Completed the capstone and graduated' },
  lessons: [
    {
      id: 'ab-m9l1',
      title: 'Choose Your Big Idea',
      subtitle: 'This project is yours.',
      minutes: 20,
      xp: 75,
      blocks: [
        { t: 'goal', text: 'Plan, design, build, launch, and present a complete product from scratch using everything you’ve learned.', quote: 'The best way to prove you’ve learned something isn’t by passing a test—it’s by creating something that didn’t exist before.' },
        { t: 'p', lead: true, text: 'This project starts with one question:' },
        { t: 'quote', text: 'If you could build one app today, what would it be?' },
        { t: 'p', text: 'Maybe it’s…' },
        { t: 'list', icon: 'dot', items: [
          '📚 A Study Planner', '💸 A Budget Tracker', '🍽 Restaurant Booking App', '💪 Fitness Dashboard',
          '🎮 Gaming Community', '🏡 Property Listing Website', '🧑‍💼 CRM for Small Businesses',
          '📅 Appointment Booking System', '🎓 Student Portal', '🛍 E-commerce Store',
        ] },
        { t: 'p', text: 'Or… something completely original.' },
        { t: 'callout', variant: 'success', title: 'This project is yours', text: 'Choose something you’ll actually be excited to finish.' },

        { t: 'h', text: 'The Builder Canvas' },
        { t: 'p', text: 'Before opening your AI builder, answer:' },
        { t: 'worksheet', id: 'ab-builder-canvas', title: 'The Builder Canvas', fields: [
          { id: 'name', label: 'Product Name', type: 'text' },
          { id: 'problem', label: 'Problem You’re Solving', type: 'textarea', rows: 3 },
          { id: 'audience', label: 'Who Is It For?', type: 'textarea', rows: 2 },
          { id: 'core', label: 'Core Features', type: 'textarea', rows: 4 },
          { id: 'future', label: 'Future Features', type: 'textarea', rows: 3 },
          { id: 'metric', label: 'Success Metric', type: 'text' },
          { id: 'why', label: 'Why Would Someone Use It?', type: 'textarea', rows: 3 },
        ] },
        { t: 'callout', variant: 'warning', title: 'If you can’t answer these…', text: 'You’re not ready to build.' },
        { t: 'bot', label: '💬 Byte Says', text: 'The strongest products start with the clearest problems.' },
        { t: 'vaultlink', intro: 'Still deciding? Two vault tools were built for this moment:', items: [
          { to: 'builder-vault/ideas', label: 'App Idea Generator', desc: '90 ideas, filterable by category, difficulty and monetisation', icon: 'Lightbulb', tone: 'gold' },
          { to: 'builder-vault/recipes', label: 'Builder Recipes — Startup Projects', desc: '20 ambitious builds that could become real businesses', icon: 'Rocket', tone: 'flamingo' },
        ] },
      ],
    },
    {
      id: 'ab-m9l2',
      title: 'Build Without Instructions',
      subtitle: 'You’re no longer following. You’re creating.',
      minutes: 90,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'This lesson is intentionally different.' },
        { t: 'list', icon: 'x', items: ['No walkthrough', 'No screenshots', 'No copy-paste prompts'] },
        { t: 'p', text: 'You already know how to:' },
        { t: 'list', icon: 'check', items: ['Plan', 'Prompt', 'Design', 'Build', 'Polish'] },
        { t: 'banner', text: 'Now trust yourself. You’re no longer following. You’re creating.' },
        { t: 'capy', label: '💬 Capy Says', text: 'At some point, every builder has to stop watching tutorials and start making decisions.' },
      ],
    },
    {
      id: 'ab-m9l3',
      title: 'Think Like a Founder',
      subtitle: 'Products are never finished. They’re continuously improved.',
      minutes: 15,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Imagine this app launches tomorrow. Ask yourself:' },
        { t: 'worksheet', id: 'ab-m9-founder', title: 'Founder questions', fields: [
          { id: 'understand', label: 'Would people understand it?', type: 'textarea', rows: 2 },
          { id: 'recommend', label: 'Would they recommend it?', type: 'textarea', rows: 2 },
          { id: 'return', label: 'Would they come back?', type: 'textarea', rows: 2 },
          { id: 'pay', label: 'Would they pay for it?', type: 'textarea', rows: 2 },
          { id: 'v2', label: 'What would Version 2 look like?', type: 'textarea', rows: 3 },
        ] },
        { t: 'callout', variant: 'success', title: 'Products are never finished', text: 'They’re continuously improved.' },
      ],
    },
    {
      id: 'ab-m9l4',
      title: 'Present Your Story',
      subtitle: 'Great builders present vision, not features.',
      minutes: 15,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Don’t show your app. Tell its story.' },
        { t: 'p', text: 'Explain:' },
        { t: 'worksheet', id: 'ab-m9-story', title: 'Your product story', fields: [
          { id: 'inspired', label: 'What problem inspired it?', type: 'textarea', rows: 2 },
          { id: 'matters', label: 'Why does it matter?', type: 'textarea', rows: 2 },
          { id: 'benefits', label: 'Who benefits?', type: 'textarea', rows: 2 },
          { id: 'challenges', label: 'What challenges did you overcome?', type: 'textarea', rows: 3 },
          { id: 'month', label: 'What would you improve with another month?', type: 'textarea', rows: 3 },
        ] },
        { t: 'callout', variant: 'success', title: 'Great builders don’t just present features', text: 'They present vision.' },
      ],
    },
    {
      id: 'ab-m9l5',
      title: 'Graduation Day',
      subtitle: 'Remember where you started.',
      minutes: 10,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Take a moment. Remember where you started.' },
        { t: 'p', text: 'At the beginning of this course… you probably believed building apps required years of coding experience.' },
        { t: 'p', text: 'Today…' },
        { t: 'list', icon: 'check', items: [
          'You’ve planned products.',
          'Designed interfaces.',
          'Built websites.',
          'Created applications.',
          'Integrated AI features.',
          'Launched projects.',
          'Collected feedback.',
          'Improved your work.',
        ] },
        { t: 'banner', text: 'Most importantly… you proved to yourself that you can build.' },
        { t: 'callout', variant: 'success', title: 'That’s a skill nobody can take away from you.', text: 'The tools will change. This won’t.' },
      ],
    },
    {
      id: 'ab-m9l6',
      title: 'Final Builder Mission & Graduation',
      subtitle: 'Build your dream project, then collect the kit.',
      minutes: 90,
      xp: 150,
      blocks: [
        { t: 'mission', title: '🎯 Final Builder Mission — Build Your Dream Project', intro: 'Requirements:', items: [
          'At least 5 pages or screens',
          'Responsive design',
          'Professional UI',
          'One AI-powered feature (optional but encouraged)',
          'Publicly deployed',
          'Case study completed',
        ], note: 'Bonus points if you: purchase a custom domain · share it publicly · collect user feedback · continue improving it after the course.' },

        { t: 'checklist', id: 'ab-m9-graduation', title: '🎓 Graduation Checklist', items: [
          'Can I turn an idea into a working product?',
          'Can I design a clean user experience?',
          'Can I build without copying tutorials?',
          'Can I confidently launch my work?',
          'Can I explain my decisions?',
        ] },
        { t: 'callout', variant: 'success', title: 'If your answer is “yes”…', text: 'Welcome to the builder community.' },

        { t: 'resourcelist', moduleId: 'ab-m9', kind: 'download', title: '📦 Graduation Kit', blurb: 'Everything you take with you — yours to keep using long after the course.' },

        { t: 'dashboard', moduleId: 'ab-m9', title: '🎉 AI APP BUILDER OS COMPLETE', final: true, pct: 100, stats: [
          { label: 'Projects Built', value: '🏗 6+' },
          { label: 'Websites Created', value: '🌐 Multiple' },
          { label: 'Apps Created', value: '📱 Multiple' },
          { label: 'Products Launched', value: '🚀 Live' },
          { label: 'Portfolio', value: '💼 Ready' },
        ], skills: ['Officially an AI App Builder'], skillsLabel: 'Status', progressLabel: 'Builder Level', next: 'Build anything you can imagine.' },

        { t: 'capy', label: '🦫 Capy’s final message', text: 'Six months ago, you might have looked at a website and thought, “I wonder who built this.”\n\nToday, you’ll look at it and think…\n\n“I could build something even better.”' },
        { t: 'bot', label: '⚡ Byte’s final message', text: 'The tools you used in this course will change.\nNew AI models will appear.\nNew app builders will replace old ones.\n\nBut one thing won’t change…\n\nYou now know how to turn ideas into products.\n\nThat’s the skill that lasts.' },

        { t: 'moduleunlock', moduleId: 'ab-m9', finalTitle: 'You built the whole portfolio', finalText: 'Not a certificate — a set of live products with your name on them. Go and build the next one.' },
      ],
    },
  ],
}
