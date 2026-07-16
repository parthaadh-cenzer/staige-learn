// Final 7-Day Action Plan.
export const challengeDays = [
  {
    day: 1, title: 'Choose Your Path', emoji: '🧭', tone: 'brand',
    brief: 'Pick one. Not three. Not five. One.',
    fields: [{ id: 'path', label: 'My chosen path', type: 'select', options: ['Faceless Content', 'Digital Products', 'AI Services'] }],
  },
  {
    day: 2, title: 'Validate Your Niche', emoji: '🔍', tone: 'mint',
    brief: 'Research demand on Reddit, YouTube, and TikTok. Find a real problem people want solved.',
    fields: [
      { id: 'niche', label: 'My chosen niche', type: 'text' },
      { id: 'problem', label: 'Problem I’m solving', type: 'textarea' },
    ],
  },
  {
    day: 3, title: 'Create Your Offer', emoji: '🎁', tone: 'flamingo',
    brief: 'Remember: people buy outcomes, not products.',
    fields: [
      { id: 'name', label: 'My offer name', type: 'text' },
      { id: 'statement', label: 'My offer statement', type: 'textarea', placeholder: 'I help… solve… by providing… so they can…' },
    ],
  },
  {
    day: 4, title: 'Build Your Assets', emoji: '🛠️', tone: 'sky2',
    brief: 'Create what you need. Version 1 is enough.',
    fields: [{ id: 'assets', label: 'Assets created', type: 'checks', options: ['Product', 'Landing Page', 'Product Image', 'Sales Description'] }],
  },
  {
    day: 5, title: 'Launch', emoji: '🚀', tone: 'sun',
    brief: 'Publish. No excuses. No perfectionism. No waiting.',
    fields: [
      { id: 'platform', label: 'Platform', type: 'select', options: ['Gumroad', 'Etsy', 'Other'] },
      { id: 'link', label: 'Offer link', type: 'text', placeholder: 'https://' },
      { id: 'date', label: 'Launch date', type: 'text', placeholder: 'YYYY-MM-DD' },
    ],
  },
  {
    day: 6, title: 'Promote', emoji: '📣', tone: 'lime',
    brief: 'Get your offer in front of people. Share it. Document the process.',
    fields: [
      { id: 'channels', label: 'Promotion channels', type: 'checks', options: ['LinkedIn', 'Reddit', 'Facebook Groups', 'Short Form Content', 'Other'] },
      { id: 'visitors', label: 'Visitors generated', type: 'text' },
    ],
  },
  {
    day: 7, title: 'Get Your First Customer', emoji: '🎯', tone: 'brand',
    brief: 'This is where most people freeze. Don’t. Ask for feedback. Keep showing up.',
    fields: [
      { id: 'customers', label: 'Customer count', type: 'text' },
      { id: 'lessons', label: 'Lessons learned', type: 'textarea' },
    ],
  },
]

export const finalReflection = [
  'Did I choose a path?',
  'Did I validate demand?',
  'Did I create an offer?',
  'Did I launch?',
  'Did real people see my offer?',
]
