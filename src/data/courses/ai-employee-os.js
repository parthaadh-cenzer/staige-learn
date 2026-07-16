// COURSE · AI Employee OS  (placeholder — coming soon)
// Build it out by copying the shape from `_template.js` / `ai-side-hustle-os.js`.
const course = {
  id: 'c3',
  slug: 'ai-employee-os',
  title: 'AI Employee OS',
  subtitle: 'Build AI “employees” that handle real work end to end.',
  description: 'Design, train, and deploy reliable AI workflows that act like teammates.',
  status: 'coming-soon',
  // Homepage metadata — a coming-soon course still needs art and a goal card;
  // the homepage renders it as locked and refuses to link to it.
  skillLevel: 'Intermediate',
  art: { emoji: '🤖', tone: 'mint' },
  goal: { emoji: '🤖', label: 'Work Smarter', order: 4 },
  collections: ['career'],
  themeAccent: 'brand',
  mascotMode: 'capy-byte',
  ui: { dashboard: { eyebrow: 'AI Employee OS' } },
  intro: { id: 'welcome', title: 'Read this first', subtitle: 'Coming soon.', blocks: [] },
  modules: [],
  prompts: { items: [], categories: [] },
  ideas: { items: [], categories: [] },
  resources: { items: [], categories: [] },
  calendar: { weeklyStructure: [], thirtyDays: [] },
  challenge: { days: [], finalReflection: [] },
  badges: { milestone: [] },
  progress: { trackBy: 'lessons' },
  features: { prompts: false, ideas: false, calendar: false, vault: false, challenge: false, badges: false },
}
export default course
