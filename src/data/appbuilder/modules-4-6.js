// ============================================================================
//  MODULES 4–6 · Real Apps → AI Features → Polish
//  Same shape as modules-1-3.js: five teaching lessons, then a sixth Builder
//  Mission lesson carrying the mission, review, downloads and dashboard.
// ============================================================================

export const module4 = {
  id: 'ab-m4',
  num: 4,
  title: 'Build Real Apps People Actually Use',
  subtitle: 'Turn everyday problems into functional web apps.',
  emoji: '📱',
  color: 'sky2',
  badge: { emoji: '📱', title: 'Product Builder', desc: 'Shipped your first complete app' },
  lessons: [
    {
      id: 'ab-m4l1',
      title: 'Apps Solve Problems',
      subtitle: 'Stop asking “what should I build?”',
      minutes: 10,
      xp: 75,
      blocks: [
        { t: 'goal', text: 'Learn how to turn everyday problems into functional web apps.', quote: 'The best apps aren’t the most complicated. They’re the ones people keep coming back to.' },
        { t: 'h', text: 'What You’ll Learn' },
        { t: 'beforeafter', beforeLabel: 'Stop thinking', afterLabel: 'Start thinking', before: 'What should I build?', after: 'What problem can I solve?' },
        { t: 'p', text: 'Every successful app starts with friction. Examples:' },
        { t: 'cards', items: [
          { title: '“I keep forgetting tasks.”', tone: 'brand', badge: 'Friction', body: '→ To-Do App' },
          { title: '“I spend too much.”', tone: 'gold', badge: 'Friction', body: '→ Expense Tracker' },
          { title: '“I can’t stay focused.”', tone: 'flamingo', badge: 'Friction', body: '→ Pomodoro Timer' },
          { title: '“I forget my habits.”', tone: 'mint', badge: 'Friction', body: '→ Habit Tracker' },
        ] },
        { t: 'callout', variant: 'success', title: 'Apps aren’t collections of features', text: 'They’re solutions.' },
        { t: 'bot', label: '💬 Byte Says', text: 'People don’t download apps because they’re impressive. They download them because they make life easier.' },
        { t: 'vaultlink', intro: 'Stuck for a problem worth solving?', items: [
          { to: 'builder-vault/ideas', label: 'App Idea Generator', desc: '90 ideas across nine categories, with difficulty and monetisation', icon: 'Lightbulb', tone: 'gold' },
        ] },
      ],
    },
    {
      id: 'ab-m4l2',
      title: 'The MVP Formula',
      subtitle: 'Don’t build the next Uber. Build Version 1.',
      minutes: 10,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Don’t build the next Uber. Build Version 1.' },
        { t: 'quote', text: 'What is the ONE thing this app does really well?' },
        { t: 'compare',
          left: { title: 'Expense Tracker — Version 1', tone: 'brand', icon: 'check', items: ['Add Expense', 'Categories', 'Total Spending'] },
          right: { title: 'Not this', tone: 'flamingo', icon: 'x', items: ['AI', 'Social Feed', 'Cryptocurrency', 'Chat', 'Rewards'] },
        },
        { t: 'banner', text: 'Build small. Ship fast. Improve later.' },

        { t: 'h', text: 'The MVP Checklist' },
        { t: 'checklist', id: 'ab-m4-mvp', title: 'Every project should have', items: [
          'One clear purpose',
          'Three to five core features',
          'Clean design',
          'Mobile responsive',
          'Working functionality',
        ] },
        { t: 'p', text: 'That’s enough.' },
        { t: 'capy', label: '💬 Capy Says', text: 'Your first version should feel a little embarrassing. If it doesn’t, you probably waited too long to launch.' },
      ],
    },
    {
      id: 'ab-m4l3',
      title: 'Build Your First Productivity App',
      subtitle: 'This time, you plan it first.',
      minutes: 20,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Choose one:' },
        { t: 'list', icon: 'check', items: [
          'Habit Tracker', 'Expense Tracker', 'To-Do App', 'Notes App',
          'Recipe Book', 'Workout Planner', 'Reading Tracker', 'Daily Journal',
        ] },
        { t: 'callout', variant: 'warning', title: 'This time…', text: 'No step-by-step tutorial. You’ll plan it first.' },

        { t: 'h', text: 'Builder Blueprint' },
        { t: 'worksheet', id: 'ab-m4-blueprint', title: 'Before touching AI, answer', fields: [
          { id: 'who', label: 'Who uses it?', type: 'textarea', rows: 2 },
          { id: 'problem', label: 'What problem does it solve?', type: 'textarea', rows: 2 },
          { id: 'must', label: 'What features are absolutely necessary?', type: 'textarea', rows: 3 },
          { id: 'later', label: 'What can wait until Version 2?', type: 'textarea', rows: 2 },
        ] },
        { t: 'callout', variant: 'success', title: 'This blueprint becomes your prompt.', text: 'You aren’t guessing at the builder any more — you’re briefing it.' },
      ],
    },
    {
      id: 'ab-m4l4',
      title: 'Make Your App Feel Professional',
      subtitle: 'Handle every situation, not just the happy path.',
      minutes: 15,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Now upgrade it. Add:' },
        { t: 'list', icon: 'check', items: [
          'Empty states', 'Success messages', 'Error messages', 'Search',
          'Filters', 'Dark mode', 'Mobile optimization', 'Better icons',
        ] },
        { t: 'callout', variant: 'success', title: 'These aren’t “extra.” They’re expected.', text: 'Professional apps feel complete because they handle every situation—not just the happy path.' },
      ],
    },
    {
      id: 'ab-m4l5',
      title: 'Think Like a Product Manager',
      subtitle: 'Your app isn’t finished when it works.',
      minutes: 10,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Every product gets feedback.' },
        { t: 'callout', variant: 'success', title: 'When is it finished?', text: 'Your app isn’t finished when it works. It’s finished when people enjoy using it.' },
        { t: 'worksheet', id: 'ab-m4-pm', title: 'Ask', fields: [
          { id: 'confused', label: 'What confused users?', type: 'textarea', rows: 2 },
          { id: 'loved', label: 'What did they love?', type: 'textarea', rows: 2 },
          { id: 'asked', label: 'What feature did everyone ask for?', type: 'textarea', rows: 2 },
          { id: 'v2', label: 'What would Version 2 include?', type: 'textarea', rows: 2 },
        ] },
        { t: 'banner', text: 'You’re no longer just building apps. You’re improving products.' },
      ],
    },
    {
      id: 'ab-m4l6',
      title: 'Builder Mission — Build Your First Complete App',
      subtitle: 'Plan it, build it, test it with real people, improve it.',
      minutes: 60,
      xp: 150,
      blocks: [
        { t: 'mission', title: '🎯 Builder Mission — Build Your First Complete App', intro: 'Choose one project.', items: [
          'Plan it', 'Design it', 'Build it', 'Test it', 'Launch it',
        ], note: 'Then ask three friends or classmates to use it for five minutes. Collect their feedback. Make at least three improvements based on what they tell you.' },

        { t: 'checklist', id: 'ab-m4-review', title: '🧠 Byte’s Product Review', items: [
          'Does my app solve one problem really well?',
          'Can someone use it without instructions?',
          'Is the interface simple?',
          'Is it fast?',
          'Would I personally use this every week?',
        ] },
        { t: 'callout', variant: 'success', title: 'If yes…', text: 'You’ve built your first real product.' },

        { t: 'resourcelist', moduleId: 'ab-m4', kind: 'download' },

        { t: 'dashboard', moduleId: 'ab-m4', title: '🏆 Module 4 Complete', pct: 40, stats: [
          { label: 'Projects Built', value: '3' },
          { label: 'Apps Launched', value: '3' },
        ], skills: ['MVP Thinking', 'Product Planning', 'User Experience', 'Feature Prioritization', 'User Testing'], progressLabel: 'Portfolio Progress', next: 'Build apps that use AI to do the heavy lifting.' },

        { t: 'bytesummary', intro: 'In Module 4 you learned:', learned: [
          'How to find an app idea by noticing friction',
          'The MVP formula, and what to leave out of Version 1',
          'How to plan a build before prompting for it',
          'The states that make an app feel finished',
          'How to collect feedback and act on it',
        ], nextModuleId: 'ab-m5' },
        { t: 'moduleunlock', moduleId: 'ab-m4', nextModuleId: 'ab-m5' },
      ],
    },
  ],
}

export const module5 = {
  id: 'ab-m5',
  num: 5,
  title: 'Build Smarter Apps with AI',
  subtitle: 'Add useful AI features that make your apps more valuable.',
  emoji: '🧠',
  color: 'mint',
  badge: { emoji: '🧠', title: 'AI Integrator', desc: 'Added a meaningful AI feature to a real app' },
  lessons: [
    {
      id: 'ab-m5l1',
      title: 'Where AI Actually Adds Value',
      subtitle: 'Not every app needs AI.',
      minutes: 10,
      xp: 75,
      blocks: [
        { t: 'goal', text: 'Learn how to add useful AI features that make your apps more valuable without turning them into complex AI products.', quote: 'The best AI features are the ones users barely notice—they just make the app feel magical.' },
        { t: 'h', text: 'What You’ll Learn' },
        { t: 'p', text: 'Not every app needs AI. Adding AI just because you can usually makes products worse.' },
        { t: 'p', text: 'Instead, ask:' },
        { t: 'quote', text: 'What task takes my users the longest?' },
        { t: 'p', text: 'That’s where AI belongs. Examples:' },
        { t: 'beforeafter', beforeLabel: 'Expense Tracker — don’t', afterLabel: 'Expense Tracker — do', before: 'AI Dashboard', after: 'Categorize expenses automatically' },
        { t: 'beforeafter', beforeLabel: 'Study App — don’t', afterLabel: 'Study App — do', before: 'AI Avatar', after: 'Explain difficult concepts' },
        { t: 'beforeafter', beforeLabel: 'Resume Builder — don’t', afterLabel: 'Resume Builder — do', before: 'AI Chatbot', after: 'Improve bullet points' },
        { t: 'beforeafter', beforeLabel: 'Travel Planner — don’t', afterLabel: 'Travel Planner — do', before: 'Talking Assistant', after: 'Generate itinerary' },
        { t: 'callout', variant: 'success', title: 'The goal isn’t to impress.', text: 'It’s to remove effort.' },
        { t: 'bot', label: '💬 Byte Says', text: 'Good AI saves clicks. Great AI saves time.' },
      ],
    },
    {
      id: 'ab-m5l2',
      title: 'AI Features Users Love',
      subtitle: 'Features people actually use every day.',
      minutes: 10,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Let’s build features people actually use every day. Examples:' },
        { t: 'list', icon: 'check', items: [
          '✍️ Rewrite Text', '📄 Summarize PDFs', '📧 Write Emails', '🌍 Translate Content',
          '📝 Generate Blog Posts', '📸 Generate Images', '📋 Create Checklists', '📅 Plan Schedules',
        ] },
        { t: 'callout', variant: 'info', title: 'These aren’t separate apps', text: 'They’re powerful features inside existing apps.' },

        { t: 'h', text: 'Challenge' },
        { t: 'mission', title: '⚡ One feature. Not five.', intro: 'Pick one of your previous projects. Add ONE AI feature.', items: ['Choose the task that currently takes users longest', 'Add exactly one AI feature that removes it', 'Resist adding a second'], note: 'Not five. One.' },
      ],
    },
    {
      id: 'ab-m5l3',
      title: 'Build an AI Resume Builder',
      subtitle: 'Simple. Useful. Professional.',
      minutes: 20,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Today’s project:' },
        { t: 'chain', steps: ['Upload resume', 'Improve wording', 'Highlight achievements', 'Generate different versions', 'Export'], tone: 'brand' },
        { t: 'banner', text: 'Simple. Useful. Professional.' },

        { t: 'h', text: 'Why This Project?' },
        { t: 'p', text: 'Because almost everyone understands its value.' },
        { t: 'p', text: 'And it demonstrates how AI can enhance an existing workflow instead of replacing it.' },
        { t: 'vaultlink', intro: 'A full build prompt for this project is in the vault:', items: [
          { to: 'builder-vault/recipes', label: 'Builder Recipes — Web Apps', desc: 'Including the AI Resume Builder prompt', icon: 'LayoutDashboard', tone: 'sky2' },
        ] },
      ],
    },
    {
      id: 'ab-m5l4',
      title: 'Build an AI Study Assistant',
      subtitle: 'Simple workflow. Huge value.',
      minutes: 20,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Project:' },
        { t: 'chain', steps: ['Upload notes', 'Generate summary', 'Create flashcards', 'Generate quiz questions', 'Explain difficult topics'], tone: 'sky2' },
        { t: 'banner', text: 'Again… simple workflow. Huge value.' },

        { t: 'h', text: 'Builder Challenge' },
        { t: 'p', text: 'Choose another niche. Examples: Law, Medical, Finance, Real Estate, Education.' },
        { t: 'worksheet', id: 'ab-m5-niche', title: 'Design the feature before building it', fields: [
          { id: 'niche', label: 'Which niche?', type: 'select', options: ['Law', 'Medical', 'Finance', 'Real Estate', 'Education', 'Something else'] },
          { id: 'task', label: 'What repetitive task could AI make easier?', type: 'textarea', rows: 2 },
          { id: 'feature', label: 'Describe the feature in one sentence', type: 'textarea', rows: 2 },
        ] },
      ],
    },
    {
      id: 'ab-m5l5',
      title: 'Keep AI Invisible',
      subtitle: 'Sell the outcome, not the technology.',
      minutes: 10,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Here’s a secret. Users rarely care that something uses AI. They care that it works.' },
        { t: 'p', text: 'Instead of writing “Powered by AI,” focus on benefits.' },
        { t: 'beforeafter', beforeLabel: 'Instead of', afterLabel: 'Say', before: 'AI Resume Builder', after: 'Create stronger resumes in minutes.' },
        { t: 'beforeafter', beforeLabel: 'Instead of', afterLabel: 'Say', before: 'AI Writing Tool', after: 'Turn rough ideas into polished content.' },
        { t: 'banner', text: 'Sell the outcome. Not the technology.' },
      ],
    },
    {
      id: 'ab-m5l6',
      title: 'Builder Mission — Add an AI Feature',
      subtitle: 'Upgrade an existing app, then explain the decision.',
      minutes: 50,
      xp: 150,
      blocks: [
        { t: 'mission', title: '🎯 Builder Mission', intro: 'Upgrade one of your existing apps by adding an AI-powered feature. Examples:', items: [
          'Resume improvements', 'Text rewriting', 'PDF summaries', 'Blog generation', 'Smart recommendations', 'Image generation',
        ] },
        { t: 'worksheet', id: 'ab-m5-mission', title: 'Then write a short explanation answering', fields: [
          { id: 'why', label: 'Why did you choose this feature?', type: 'textarea', rows: 2 },
          { id: 'problem', label: 'What user problem does it solve?', type: 'textarea', rows: 2 },
          { id: 'experience', label: 'How does it improve the overall experience?', type: 'textarea', rows: 2 },
        ] },

        { t: 'checklist', id: 'ab-m5-review', title: '🧠 Byte’s Product Review', items: [
          'Would users miss this feature if it disappeared?',
          'Does it save time?',
          'Is it easy to use?',
          'Does it solve a real problem?',
          'Is it faster than doing it manually?',
        ] },
        { t: 'callout', variant: 'success', title: 'If yes…', text: 'You’ve added meaningful AI—not just a gimmick.' },

        { t: 'resourcelist', moduleId: 'ab-m5', kind: 'download' },

        { t: 'dashboard', moduleId: 'ab-m5', title: '🏆 Module 5 Complete', pct: 50, stats: [
          { label: 'Projects Built', value: '5' },
          { label: 'AI Features Added', value: '2' },
        ], skills: ['AI Feature Planning', 'Workflow Design', 'Prompt Integration', 'User-Centered AI', 'Product Thinking'], progressLabel: 'Portfolio Progress', next: 'Turn good apps into products people love using.' },

        { t: 'bytesummary', intro: 'In Module 5 you learned:', learned: [
          'Where AI genuinely belongs in a product — and where it doesn’t',
          'The AI features people actually use daily',
          'How to build an AI Resume Builder',
          'How to build an AI Study Assistant',
          'Why the best AI features are never advertised as AI',
        ], nextModuleId: 'ab-m6' },
        { t: 'moduleunlock', moduleId: 'ab-m5', nextModuleId: 'ab-m6' },
      ],
    },
  ],
}

export const module6 = {
  id: 'ab-m6',
  num: 6,
  title: 'Polish Like a Pro',
  subtitle: 'Transform a working app into a product that feels fast, polished, and trustworthy.',
  emoji: '✨',
  color: 'sun',
  badge: { emoji: '✨', title: 'Polish Master', desc: 'Gave a project a full professional makeover' },
  lessons: [
    {
      id: 'ab-m6l1',
      title: 'Why People Love Some Apps',
      subtitle: 'Great products remove friction.',
      minutes: 8,
      xp: 75,
      blocks: [
        { t: 'goal', text: 'Transform a working app into a product that feels fast, polished, and trustworthy.', quote: 'People forgive missing features. They rarely forgive a bad experience.' },
        { t: 'h', text: 'What You’ll Learn' },
        { t: 'p', text: 'Think about the apps you use every day. Apple Notes. Spotify. Notion. Airbnb. Linear.' },
        { t: 'p', text: 'None of them are successful because they have the most features. They’re successful because they’re effortless to use.' },
        { t: 'callout', variant: 'success', title: 'Great products remove friction', text: 'Your goal isn’t to build more. It’s to make every interaction feel intentional.' },

        { t: 'h', text: 'The Premium Checklist' },
        { t: 'p', text: 'Professional products feel:' },
        { t: 'list', icon: 'check', items: ['Fast', 'Clean', 'Consistent', 'Predictable', 'Smooth'] },
        { t: 'p', text: 'If your app feels confusing, users leave before discovering your best feature.' },
        { t: 'bot', label: '💬 Byte Says', text: 'A polished app whispers quality before users even click a button.' },
      ],
    },
    {
      id: 'ab-m6l2',
      title: 'Micro-Interactions Matter',
      subtitle: 'Small details create big impressions.',
      minutes: 12,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Small details create big impressions. We’ll add:' },
        { t: 'list', icon: 'check', items: [
          '✨ Hover effects', '✨ Button feedback', '✨ Page transitions', '✨ Skeleton loading screens',
          '✨ Success animations', '✨ Empty states', '✨ Error messages', '✨ Toast notifications',
        ] },
        { t: 'p', text: 'Users notice these things—even if they can’t explain why your app feels better.' },

        { t: 'h', text: 'Challenge' },
        { t: 'mission', title: '✨ Three micro-interactions', intro: 'Add three micro-interactions to one of your apps.', items: ['Pick three from the list above', 'Add them to a single project', 'Compare it with the original version side by side'] },
      ],
    },
    {
      id: 'ab-m6l3',
      title: 'Design for Real Humans',
      subtitle: 'Every user deserves a great experience, on any device.',
      minutes: 12,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'A beautiful app that only works on your laptop isn’t finished.' },
        { t: 'p', text: 'We’ll optimize for:' },
        { t: 'list', icon: 'dot', items: ['📱 Mobile', '💻 Tablet', '🖥 Desktop'] },
        { t: 'p', text: 'Also improve:' },
        { t: 'list', icon: 'check', items: ['Readability', 'Button sizes', 'Navigation', 'Touch interactions', 'Accessibility', 'Dark mode'] },
        { t: 'p', text: 'Every user deserves a great experience, no matter what device they use.' },
        { t: 'capy', label: '💬 Capy Says', text: 'Your users won’t resize their screen for you. Your app should adapt to them.' },
        { t: 'vaultlink', intro: 'Audit it properly before you move on:', items: [
          { to: 'builder-vault/uiux-checklist', label: 'UI/UX Checklist', desc: '67 checks across 11 sections, including Responsive Design and Accessibility', icon: 'ListChecks', tone: 'mint' },
        ] },
      ],
    },
    {
      id: 'ab-m6l4',
      title: 'Speed Wins',
      subtitle: 'Fast products feel professional.',
      minutes: 12,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'People expect websites to feel instant. We’ll optimize:' },
        { t: 'list', icon: 'check', items: [
          'Image sizes', 'Loading performance', 'Fonts', 'Animations',
          'Component reuse', 'Lazy loading', 'Performance best practices',
        ] },
        { t: 'callout', variant: 'warning', title: 'Remember', text: 'A one-second delay can cost users. Fast products feel professional.' },

        { t: 'h', text: 'Builder Challenge' },
        { t: 'mission', title: '⚡ The annoyance list', intro: 'Test your app on:', items: ['Phone', 'Tablet', 'Desktop'], note: 'Write down every annoying thing you notice. Fix them.' },
      ],
    },
    {
      id: 'ab-m6l5',
      title: 'The Final Polish',
      subtitle: 'Would I charge someone for this?',
      minutes: 12,
      xp: 75,
      blocks: [
        { t: 'p', lead: true, text: 'Now pretend your app is launching tomorrow. Ask yourself:' },
        { t: 'quote', text: 'Would I charge someone for this?' },
        { t: 'p', text: 'If not… what’s missing?' },
        { t: 'p', text: 'Review:' },
        { t: 'list', icon: 'dot', items: [
          'Typography', 'Colors', 'Icons', 'Empty states',
          'Loading screens', 'Error handling', 'Consistency', 'Performance',
        ] },
        { t: 'callout', variant: 'success', title: 'Then create Version 2', text: 'Not because it’s required. Because professionals iterate.' },
      ],
    },
    {
      id: 'ab-m6l6',
      title: 'Builder Mission — The Professional Makeover',
      subtitle: 'Not just prettier. Easier and more enjoyable to use.',
      minutes: 50,
      xp: 150,
      blocks: [
        { t: 'mission', title: '🎯 Builder Mission', intro: 'Take one of your previous projects and give it a complete professional makeover. Improve:', items: [
          'Visual design', 'Responsiveness', 'Animations', 'Performance', 'Accessibility', 'Overall user experience',
        ], note: 'Document the changes with before-and-after screenshots. Your goal isn’t just to make it prettier—it’s to make it easier and more enjoyable to use.' },

        { t: 'checklist', id: 'ab-m6-review', title: '🧠 Byte’s Product Audit', items: [
          'Does my app feel smooth?',
          'Is every button intentional?',
          'Are loading and error states handled?',
          'Does it work well on mobile?',
          'Would I proudly demo this to a potential client or employer?',
        ] },
        { t: 'callout', variant: 'fire', title: 'If you hesitated on any answer, keep polishing.', text: 'Professionals obsess over the last 10%.' },

        { t: 'resourcelist', moduleId: 'ab-m6', kind: 'download' },

        { t: 'dashboard', moduleId: 'ab-m6', title: '🏆 Module 6 Complete', pct: 70, stats: [
          { label: 'Projects Built', value: '5' },
          { label: 'Projects Polished', value: '5' },
        ], skills: ['Responsive Design', 'Micro-interactions', 'Performance Optimization', 'Accessibility', 'Product QA'], progressLabel: 'Portfolio Progress', next: 'Launch your apps like a professional and prepare them for real users.' },

        { t: 'bytesummary', intro: 'In Module 6 you learned:', learned: [
          'Why effortless beats feature-rich',
          'Which micro-interactions are worth the effort',
          'How to design for every device, not just your laptop',
          'What actually makes an app feel fast',
          'The final-polish review that decides if it’s worth charging for',
        ], nextModuleId: 'ab-m7' },
        { t: 'moduleunlock', moduleId: 'ab-m6', nextModuleId: 'ab-m7' },
      ],
    },
  ],
}
