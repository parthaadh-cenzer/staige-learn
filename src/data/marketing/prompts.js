// ============================================================================
//  MARKETING OS PROMPT VAULT — 20 reusable marketing prompts
//  Prompt text is taken from the course source document and formatted for
//  copy-paste. Everything around it (title, category, difficulty, time saved,
//  recommended tools) is metadata so the vault can be filtered and extended
//  without touching the UI.
//
//  Shape: { id, num, title, category, bestFor, tools[], timeSaved, difficulty, text }
//  `num` drives the "Prompt #01" label. Keep it padded and stable.
// ============================================================================

export const promptCategories = [
  { id: 'strategy', name: 'Strategy', tone: 'brand', icon: 'Compass' },
  { id: 'content', name: 'Content', tone: 'mint', icon: 'PenLine' },
  { id: 'social', name: 'Social Media', tone: 'sun', icon: 'Megaphone' },
  { id: 'email', name: 'Email', tone: 'lime', icon: 'Mail' },
  { id: 'seo', name: 'SEO', tone: 'sky2', icon: 'Search' },
  { id: 'ads', name: 'Advertising', tone: 'flamingo', icon: 'Target' },
  { id: 'analytics', name: 'Analytics', tone: 'gold', icon: 'BarChart3' },
  { id: 'automation', name: 'Automation', tone: 'brand', icon: 'Workflow' },
]

const raw = [
  {
    title: 'AI Customer Persona Builder',
    category: 'strategy',
    bestFor: 'Knowing exactly who you’re writing to before you write anything',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '3 hours',
    difficulty: 'Beginner',
    text: `Act as a senior marketing strategist.

Based on the following business:

Business:
[Describe Business]

Create a detailed customer persona including:

• Demographics
• Goals
• Pain points
• Buying motivations
• Objections
• Favorite social platforms
• Preferred content formats
• Messaging style`,
  },
  {
    title: 'Weekly Content Calendar Generator',
    category: 'content',
    bestFor: 'Never opening a blank calendar on a Monday again',
    tools: ['ChatGPT', 'Claude', 'Notion'],
    timeSaved: '2 hours/week',
    difficulty: 'Beginner',
    text: `Create a 7-day content calendar for my business.

Business:
[Describe]

Include:

• Platform
• Topic
• Hook
• CTA
• Caption
• Suggested image/video`,
  },
  {
    title: 'Viral Hook Generator',
    category: 'social',
    bestFor: 'Fixing the first line — the one that decides everything',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '90 minutes',
    difficulty: 'Beginner',
    text: `Generate 50 scroll-stopping hooks for my niche.

Niche:
[Your niche]

Use different hook styles:

• Curiosity
• Controversial
• Story
• Statistics
• Fear of missing out
• Mistakes`,
  },
  {
    title: 'Social Caption Writer',
    category: 'social',
    bestFor: 'Ten captions in the time it takes to write one badly',
    tools: ['ChatGPT', 'Jasper'],
    timeSaved: '1 hour',
    difficulty: 'Beginner',
    text: `Write 10 engaging captions for this topic.

Topic:
[Your topic]

Tone:
Friendly
Professional
Funny
Luxury
Educational

Include CTAs.`,
  },
  {
    title: 'SEO Blog Article Writer',
    category: 'seo',
    bestFor: 'Long-form that ranks instead of long-form that exists',
    tools: ['Claude', 'Surfer SEO', 'ChatGPT'],
    timeSaved: '4 hours',
    difficulty: 'Intermediate',
    text: `Write a 2,000-word SEO blog article.

Target keyword:
[Your keyword]

Structure:

Introduction

H2

H2

FAQ

Conclusion

Optimize naturally for SEO.`,
  },
  {
    title: 'Email Sequence Generator',
    category: 'email',
    bestFor: 'A welcome series that runs forever after one afternoon',
    tools: ['ChatGPT', 'Claude', 'Beehiiv'],
    timeSaved: '5 hours',
    difficulty: 'Intermediate',
    text: `Create a 5-email welcome sequence.

Business:
Goal:
Audience:

Emails should include:

Subject

Preview text

Body

CTA`,
  },
  {
    title: 'Landing Page Copywriter',
    category: 'content',
    bestFor: 'The page your ads and lead magnets point at',
    tools: ['Claude', 'ChatGPT'],
    timeSaved: '3 hours',
    difficulty: 'Intermediate',
    text: `Write landing page copy using AIDA.

Product:
[Describe]

Sections:

Headline

Subheadline

Benefits

Features

Social proof

FAQ

CTA`,
  },
  {
    title: 'Video Script Generator',
    category: 'content',
    bestFor: 'Reels, Shorts and ads that get to the point',
    tools: ['ChatGPT', 'Descript'],
    timeSaved: '90 minutes',
    difficulty: 'Beginner',
    text: `Write a 60-second video script.

Product/topic:
[Describe]

Structure:

Hook (3 sec)

Problem

Solution

CTA`,
  },
  {
    title: 'Ad Copy Generator',
    category: 'ads',
    bestFor: 'Enough variations to actually run a test',
    tools: ['ChatGPT', 'Jasper'],
    timeSaved: '2 hours',
    difficulty: 'Intermediate',
    text: `Write Facebook, Instagram and Google ads.

Create:

5 headlines

5 descriptions

3 CTAs

Target audience:
[Describe]`,
  },
  {
    title: 'Product Description Rewriter',
    category: 'content',
    bestFor: 'Turning a spec list into a reason to buy',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '45 minutes',
    difficulty: 'Beginner',
    text: `Rewrite this product description to improve conversions.

Description:
[Paste current description]

Focus on benefits rather than features.

Target audience:
[Describe]`,
  },
  {
    title: 'Competitor Analysis Engine',
    category: 'strategy',
    bestFor: 'Knowing the gap before you pick a position',
    tools: ['Perplexity', 'Claude', 'Gemini'],
    timeSaved: '6 hours',
    difficulty: 'Intermediate',
    text: `Analyze my top competitors.

Business:
[Describe]

Competitors:
[List them]

Provide:

Strengths

Weaknesses

Positioning

Content strategy

Marketing opportunities`,
  },
  {
    title: 'SEO Keyword Planner',
    category: 'seo',
    bestFor: 'Finding what people actually type',
    tools: ['ChatGPT', 'Ahrefs', 'Semrush'],
    timeSaved: '3 hours',
    difficulty: 'Intermediate',
    text: `Generate SEO keywords.

Primary keyword:
[Your keyword]

Include:

Long-tail keywords

Search intent

Related questions

Blog ideas`,
  },
  {
    title: 'Content Repurposing Machine',
    category: 'content',
    bestFor: 'One blog becoming a week of everything else',
    tools: ['Claude', 'ChatGPT'],
    timeSaved: '4 hours',
    difficulty: 'Beginner',
    text: `Turn one blog article into:

Twitter thread

LinkedIn post

Instagram carousel

Newsletter

YouTube script

TikTok script

Article:
[Paste article]`,
  },
  {
    title: 'Marketing Funnel Builder',
    category: 'strategy',
    bestFor: 'Seeing the whole path from stranger to customer',
    tools: ['Claude', 'ChatGPT'],
    timeSaved: '5 hours',
    difficulty: 'Advanced',
    text: `Create a complete marketing funnel.

Business:
[Describe]

Include:

Lead magnet

Landing page

Email sequence

Sales page

Retargeting

Upsells`,
  },
  {
    title: 'Audience Research Assistant',
    category: 'strategy',
    bestFor: 'Writing about their problem in their words',
    tools: ['Perplexity', 'ChatGPT', 'AnswerThePublic'],
    timeSaved: '4 hours',
    difficulty: 'Beginner',
    text: `Find the biggest frustrations my target audience experiences.

Industry:
[Your industry]

Audience:
[Describe]

Rank by importance.`,
  },
  {
    title: 'Marketing Audit Analyst',
    category: 'analytics',
    bestFor: 'An honest second opinion on your own site',
    tools: ['Claude', 'ChatGPT', 'Microsoft Clarity'],
    timeSaved: '6 hours',
    difficulty: 'Intermediate',
    text: `Audit my website.

Website:
[URL or describe]

Review:

Messaging

SEO

UX

Branding

Calls-to-action

Trust signals

Give recommendations.`,
  },
  {
    title: 'Content Idea Machine',
    category: 'content',
    bestFor: 'Ending “what should I post?” permanently',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '3 hours',
    difficulty: 'Beginner',
    text: `Generate 100 content ideas.

Niche:
[Your niche]

Organize by:

Educational

Entertaining

Promotional

Behind-the-scenes

Case studies

FAQs`,
  },
  {
    title: 'Brand Voice Creator',
    category: 'strategy',
    bestFor: 'The document that makes AI sound like you',
    tools: ['Claude', 'ChatGPT'],
    timeSaved: '4 hours',
    difficulty: 'Intermediate',
    text: `Help define my brand voice.

Business:
[Describe]

Desired personality:
[e.g. friendly, bold, minimal]

Create:

Tone

Vocabulary

Messaging examples

Words to avoid`,
  },
  {
    title: 'Marketing Automation Planner',
    category: 'automation',
    bestFor: 'Designing the system before you buy the tools',
    tools: ['Claude', 'Zapier', 'Make'],
    timeSaved: '5 hours',
    difficulty: 'Advanced',
    text: `Design an automated marketing system.

Business:
[Describe]

Include:

Lead capture

Email automation

CRM

Follow-ups

Analytics

Recommended tools`,
  },
  {
    title: 'Monthly Marketing Report Builder',
    category: 'analytics',
    bestFor: 'The report nobody wants to write',
    tools: ['ChatGPT', 'Claude', 'Google Analytics'],
    timeSaved: '3 hours/month',
    difficulty: 'Intermediate',
    text: `Generate a monthly marketing report template.

Business:
[Describe]

Include:

Traffic

Conversions

Email performance

Social growth

Paid ads

Recommendations

Next month's priorities`,
  },
]

export const prompts = raw.map((p, i) => ({
  ...p,
  id: i + 1,
  num: String(i + 1).padStart(2, '0'),
}))
