// 30-Day Content Calendar — Bonus #3.
export const weeklyStructure = [
  { day: 'Monday', theme: 'Mistake', tone: 'flamingo', example: '3 mistakes new creators make.' },
  { day: 'Tuesday', theme: 'Lesson Learned', tone: 'brand', example: 'The biggest thing I learned building my first side hustle.' },
  { day: 'Wednesday', theme: 'Case Study', tone: 'mint', example: 'How a simple template generated my first sale.' },
  { day: 'Thursday', theme: 'Tool Recommendation', tone: 'sky2', example: 'One AI tool worth using this week.' },
  { day: 'Friday', theme: 'Myth Busting', tone: 'sun', example: 'Why followers don’t equal customers.' },
  { day: 'Saturday', theme: 'Behind The Scenes', tone: 'flamingo', example: 'Here’s what I’m building.' },
  { day: 'Sunday', theme: 'Personal Reflection', tone: 'brand', example: 'What worked and what didn’t this week.' },
]

// Build a 30-day grid by cycling the weekly themes.
export const thirtyDays = Array.from({ length: 30 }, (_, i) => {
  const t = weeklyStructure[i % 7]
  return { day: i + 1, theme: t.theme, tone: t.tone, prompt: t.example }
})
