// ============================================================================
//  "Welcome to AI App Builder OS" — the orientation screen (/welcome).
//  Every line here is the course document's own wording, arranged into the
//  platform's typed blocks rather than rewritten.
// ============================================================================

export const intro = {
  id: 'ab-welcome',
  title: 'Welcome to AI App Builder OS',
  subtitle: 'Build websites & apps without writing code.',
  blocks: [
    { t: 'p', lead: true, text: 'Most people think building an app requires years of coding, expensive developers, or a computer science degree.' },
    { t: 'p', text: 'That used to be true.' },
    { t: 'p', text: 'Today, your biggest advantage isn’t knowing how to code—it’s knowing how to communicate your ideas to AI.' },
    { t: 'p', text: 'Throughout this course, you’ll learn how to turn simple ideas into real, working websites and apps using modern AI-powered builders. You’ll create projects you can actually use, showcase, or even sell—without getting lost in programming tutorials.' },
    { t: 'banner', text: 'By the time you finish, you won’t just understand how these tools work. You’ll have a portfolio of projects that proves you can build.' },

    { t: 'h', text: '🚀 What You’ll Build' },
    { t: 'p', text: 'This isn’t a watch-and-forget course. Every module ends with something real.' },
    { t: 'list', icon: 'check', items: [
      'Personal Portfolio Website',
      'Business Landing Page',
      'Productivity App',
      'Habit Tracker',
      'Expense Tracker',
      'AI Resume Builder',
      'PDF Study Assistant',
      'Mini SaaS Dashboard',
      'Your Own Final Project',
    ] },
    { t: 'p', text: 'By graduation, you’ll have a portfolio full of projects—not just a certificate.' },

    { t: 'h', text: '💡 How This Course Works' },
    { t: 'p', text: 'Forget lectures. Forget theory. Forget memorizing prompts.' },
    { t: 'banner', text: '🎯 Learn → Build → Improve → Launch' },
    { t: 'list', icon: 'dot', items: [
      'Every lesson teaches one concept.',
      'Every module ends with a project.',
      'Every project makes you a better builder.',
    ] },
    { t: 'callout', variant: 'success', title: 'The fastest way to learn', text: 'It isn’t by watching someone else build. It’s by building alongside them.' },

    { t: 'h', text: '🤝 Meet Your Team' },
    { t: 'p', text: 'You’re never building alone.' },
    { t: 'cards', items: [
      { title: '👨‍💻 You — The Product Owner', tone: 'brand', badge: 'The visionary', body: 'You bring the ideas. You decide what to build. You shape the vision.' },
      { title: '🤖 AI — Your Development Partner', tone: 'sky2', badge: 'The accelerator', body: 'AI helps you generate interfaces, write code behind the scenes, fix bugs, improve designs and build faster. You’re still in control — AI simply accelerates the process.' },
    ] },
    { t: 'bot', label: '🦫 Capy & ⚡ Byte', text: 'They’ll guide you through every module with tips, shortcuts, and the occasional reality check when something inevitably breaks.\n\nBecause yes… something will break. And that’s part of becoming a builder.' },

    { t: 'h', text: '🛠️ The Builder Mindset' },
    { t: 'p', text: 'The goal isn’t to become a software engineer. The goal is to become someone who can take an idea and bring it to life.' },
    { t: 'quote', text: 'What problem am I solving?', author: 'The question every successful app starts with' },
    { t: 'p', text: 'The tools will change. The technology will evolve. But that mindset will always matter.' },

    { t: 'h', text: '🎓 Before You Begin' },
    { t: 'compare',
      left: { title: 'You don’t need', tone: 'flamingo', icon: 'x', items: ['Coding experience', 'A computer science degree', 'A design background', 'Expensive software'] },
      right: { title: 'You only need', tone: 'brand', icon: 'check', items: ['Curiosity', 'A willingness to experiment', 'The confidence to click “Generate” and see what happens'] },
    },

    { t: 'h', text: '🏁 Your First Challenge' },
    { t: 'p', text: 'By the end of Module 1, your goal is simple:' },
    { t: 'banner', text: 'Publish your first website to the internet.' },
    { t: 'p', text: 'Not next week. Not at the end of the course. Within your first hour.' },
    { t: 'p', lead: true, text: 'Let’s build something you’re proud to share. 🚀' },
  ],
}
