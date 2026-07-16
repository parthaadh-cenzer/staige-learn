// ============================================================================
//  AI JOB HUNTER OS — PROMPT VAULT (50 prompts)
//  Prompt text is taken verbatim from the course source document. Everything
//  around it (Best For / Works Best With / Difficulty / Estimated Time Saved)
//  is card metadata so the vault stays searchable and extendable without
//  touching the UI.
//
//  The source document supplies that metadata for prompts #11–50. For #1–10
//  (Resume Optimization) it supplies prompt text only, so the metadata there is
//  authored to match the same scale — the prompt content itself is unchanged.
//
//  Shape: { id, num, title, category, bestFor, tools[], timeSaved, difficulty, text }
// ============================================================================

export const promptCategories = [
  { id: 'resume', name: 'Resume Optimization', tone: 'mint', icon: 'FileText' },
  { id: 'linkedin', name: 'LinkedIn Optimization', tone: 'flamingo', icon: 'Briefcase' },
  { id: 'search', name: 'Job Search', tone: 'sky2', icon: 'Search' },
  { id: 'interview', name: 'Interview Preparation', tone: 'sun', icon: 'Mic' },
  { id: 'networking', name: 'Networking', tone: 'lime', icon: 'Users' },
  { id: 'offer', name: 'Offer & Negotiation', tone: 'gold', icon: 'BadgeDollarSign' },
  { id: 'career', name: 'Career Growth', tone: 'brand', icon: 'TrendingUp' },
]

const raw = [
  // ── Resume Optimization (1–10) ───────────────────────────────────────────
  {
    title: 'ATS Resume Analyzer',
    category: 'resume',
    bestFor: 'Finding out why your resume is being filtered before a human sees it',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '45 minutes',
    difficulty: 'Beginner',
    text: `Act as an ATS recruiter.

Review my resume against the following job description.

Evaluate:

- ATS compatibility (0-100)
- Keyword match
- Missing keywords
- Formatting issues
- Weak bullet points
- Skills gap
- Overall interview probability

Suggest improvements without adding fake experience.

Resume:

[Paste Resume]

Job Description:

[Paste JD]`,
  },
  {
    title: 'Tailor My Resume',
    category: 'resume',
    bestFor: 'Turning one master resume into a version built for this exact job',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '60 minutes per application',
    difficulty: 'Beginner',
    text: `Customize my resume specifically for this job description.

Maintain complete honesty.

Improve wording, keywords, achievements, and ATS compatibility while preserving factual experience.

Resume:

[Paste Resume]

Job Description:

[Paste JD]`,
  },
  {
    title: 'Rewrite Resume Bullet Points',
    category: 'resume',
    bestFor: 'Turning “responsible for” into proof of impact',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '40 minutes',
    difficulty: 'Beginner',
    text: `Rewrite my experience bullets using strong action verbs and measurable achievements.

Transform responsibilities into impact statements.

Experience:

[Paste Experience]`,
  },
  {
    title: 'Improve Professional Summary',
    category: 'resume',
    bestFor: 'The three lines at the top that decide whether the rest gets read',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '30 minutes',
    difficulty: 'Beginner',
    text: `Write a professional resume summary based on my experience.

Keep it concise, ATS-friendly, and aligned with this role.

Current Resume:

[Paste Resume]

Target Role:

[Target Role]`,
  },
  {
    title: 'Keyword Extraction',
    category: 'resume',
    bestFor: 'Getting the exact terms recruiters will search for',
    tools: ['ChatGPT', 'Claude', 'Gemini'],
    timeSaved: '25 minutes',
    difficulty: 'Beginner',
    text: `Extract the top ATS keywords from this job description.

Rank them by importance.

Separate into:

Required Skills

Preferred Skills

Tools

Certifications

Soft Skills

Job Description:

[Paste JD]`,
  },
  {
    title: 'Resume Scorecard',
    category: 'resume',
    bestFor: 'An honest score before a recruiter gives you a silent one',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '35 minutes',
    difficulty: 'Beginner',
    text: `Score my resume out of 100.

Evaluate:

ATS

Readability

Impact

Achievements

Formatting

Keywords

Professionalism

Give detailed recommendations.

Resume:

[Paste Resume]`,
  },
  {
    title: 'Achievement Generator',
    category: 'resume',
    bestFor: 'Converting a job description of your own role into evidence',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '45 minutes',
    difficulty: 'Intermediate',
    text: `Convert these responsibilities into achievement-focused resume bullets with measurable business impact.

Responsibilities:

[Paste Responsibilities]`,
  },
  {
    title: 'Resume Gap Analyzer',
    category: 'resume',
    bestFor: 'Knowing what’s missing before you apply, not after the rejection',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '40 minutes',
    difficulty: 'Intermediate',
    text: `Compare my resume against this job description.

Identify missing qualifications and recommend ways to strengthen my application without exaggerating experience.

Resume:

[Paste Resume]

Job Description:

[Paste JD]`,
  },
  {
    title: 'Career Switch Resume',
    category: 'resume',
    bestFor: 'Making a pivot make sense to someone reading for six seconds',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '90 minutes',
    difficulty: 'Advanced',
    text: `Rewrite my resume for a career transition.

Highlight transferable skills and relevant experience.

Current Industry:

[Current Industry]

Target Industry:

[Target Industry]

Resume:

[Paste Resume]`,
  },
  {
    title: 'Resume Red Flag Review',
    category: 'resume',
    bestFor: 'Hearing the objection before the hiring manager thinks it silently',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '30 minutes',
    difficulty: 'Beginner',
    text: `Act as a hiring manager.

Identify every reason my resume might be rejected before an interview.

Resume:

[Paste Resume]`,
  },

  // ── LinkedIn Optimization (11–18) ────────────────────────────────────────
  {
    title: 'AI LinkedIn Headline Generator',
    category: 'linkedin',
    bestFor: 'Creating a recruiter-friendly LinkedIn headline that clearly communicates your value.',
    tools: ['ChatGPT', 'Claude', 'Gemini'],
    timeSaved: '20–30 minutes',
    difficulty: 'Beginner',
    text: `Act as a LinkedIn branding expert.

Create 10 high-converting LinkedIn headlines based on my experience.

My Details:

Current Role:
Target Role:
Industry:
Years of Experience:
Top Skills:
Career Goal:

Generate headlines in these styles:

- Professional
- Executive
- Recruiter-Friendly
- Personal Brand
- ATS Optimized
- Startup Style
- Corporate Style
- Creative
- Leadership
- Minimalist

For each headline, explain why it works.`,
  },
  {
    title: 'AI About Section Writer',
    category: 'linkedin',
    bestFor: 'Writing a compelling LinkedIn About section that sounds authentic while highlighting experience, strengths, and career goals.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '45–60 minutes',
    difficulty: 'Beginner',
    text: `Act as a professional LinkedIn branding coach.

Write a LinkedIn About section that sounds natural, professional, and memorable.

Use this structure:

• Opening Hook
• Professional Background
• Key Strengths
• Biggest Achievements
• Industries Worked In
• Career Interests
• Closing Call-to-Action

Keep it conversational, not robotic.

My Information:

Current Role:
Years of Experience:
Industry:
Top Skills:
Biggest Achievement:
Career Goal:

Create three versions:

- Professional
- Friendly
- Executive`,
  },
  {
    title: 'LinkedIn Experience Optimizer',
    category: 'linkedin',
    bestFor: 'Rewriting experience entries to focus on achievements rather than responsibilities.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '30–45 minutes',
    difficulty: 'Intermediate',
    text: `Rewrite my LinkedIn experience section.

Do not copy my resume.

Instead:

- Expand achievements
- Add measurable impact
- Improve readability
- Include recruiter-friendly keywords
- Maintain complete honesty

Current Experience:

[Paste Experience]

Target Role:

Return:

- Optimized Experience Section
- Suggested Metrics
- Missing Keywords
- Suggested Skills`,
  },
  {
    title: 'Complete LinkedIn Profile Audit',
    category: 'linkedin',
    bestFor: 'Finding weaknesses in your LinkedIn profile before recruiters do.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '40 minutes',
    difficulty: 'Beginner',
    text: `Act as a senior recruiter.

Audit my LinkedIn profile.

Evaluate:

- Headline
- Profile Photo
- Banner
- About Section
- Experience
- Skills
- Featured Section
- Certifications
- Recommendations
- Activity Level

Score each section from 1–10.

Then provide:

- Biggest Strengths
- Biggest Weaknesses
- Highest Priority Improvements
- Overall Recruiter Score`,
  },
  {
    title: 'LinkedIn Keyword Optimizer',
    category: 'linkedin',
    bestFor: 'Increasing recruiter visibility in LinkedIn search results.',
    tools: ['ChatGPT', 'Claude', 'Gemini'],
    timeSaved: '20–30 minutes',
    difficulty: 'Intermediate',
    text: `Based on my target role, generate the best LinkedIn keywords to include throughout my profile.

My Target Role:

Industry:

Experience Level:

Provide:

- Top 30 Keywords
- Skills to Add
- Certifications
- Industry Buzzwords
- Software/Tools
- Missing Keywords

Also explain exactly where each keyword should appear:

- Headline
- About
- Experience
- Skills
- Featured`,
  },
  {
    title: 'LinkedIn Banner & Personal Brand Generator',
    category: 'linkedin',
    bestFor: 'Designing a professional LinkedIn banner that reinforces your expertise.',
    tools: ['ChatGPT', 'Image generation AI'],
    timeSaved: '30 minutes',
    difficulty: 'Beginner',
    text: `Act as a personal branding expert.

Help me design a LinkedIn banner.

My Information:

Industry:
Role:
Personal Brand:
Favorite Colors:
Target Audience:

Generate:

- Banner Layout
- Headline Text
- Supporting Text
- Color Palette
- Icon Ideas
- Background Style
- CTA (optional)

Also generate an AI image prompt suitable for tools like DALL·E, Midjourney, or Flux.`,
  },
  {
    title: 'Featured Section Optimizer',
    category: 'linkedin',
    bestFor: 'Choosing the best projects, achievements, and content to showcase in LinkedIn’s Featured section.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '20 minutes',
    difficulty: 'Beginner',
    text: `Help me build an outstanding LinkedIn Featured section.

Based on my background, recommend what I should showcase.

Possible items include:

- Portfolio
- Projects
- Certifications
- Presentations
- Articles
- Videos
- Websites
- GitHub
- Awards

My Information:

Industry:
Experience:
Career Goal:

Rank recommendations from highest to lowest impact and explain why.`,
  },
  {
    title: 'AI Personal Branding Strategy',
    category: 'linkedin',
    bestFor: 'Creating a long-term LinkedIn content strategy to attract recruiters and opportunities.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '60+ minutes',
    difficulty: 'Intermediate',
    text: `Act as my personal branding strategist.

Help me build a LinkedIn growth strategy that positions me as an expert in my field.

My Details:

Industry:
Target Role:
Experience:
Career Goal:

Create:

- Personal Brand Statement
- Content Pillars
- Weekly Posting Schedule
- 30 Content Ideas
- Commenting Strategy
- Networking Strategy
- Profile Optimization Plan
- Growth KPIs

Finally, create a 90-day LinkedIn growth roadmap designed to increase recruiter visibility and professional opportunities.`,
  },

  // ── Job Search (19–27) ───────────────────────────────────────────────────
  {
    title: 'AI Career Match Finder',
    category: 'search',
    bestFor: 'Discovering the best-fit roles based on your skills and experience.',
    tools: ['ChatGPT', 'Claude', 'Gemini'],
    timeSaved: '30–45 minutes',
    difficulty: 'Beginner',
    text: `Act as an experienced career coach.

Based on my background, recommend the best career paths and job titles that fit my experience.

My Background:

Current Role:
Years of Experience:
Industry:
Education:
Skills:
Tools I Know:
Certifications:
Career Interests:

Generate:

- Top 15 job titles
- Salary range
- Career growth potential
- Difficulty to transition
- Required missing skills
- Recommended learning roadmap

Rank every recommendation from best to worst fit.`,
  },
  {
    title: 'AI Job Search Strategy Builder',
    category: 'search',
    bestFor: 'Creating a structured weekly job search plan instead of applying randomly.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '45 minutes',
    difficulty: 'Beginner',
    text: `Act as my personal job search coach.

Create a complete weekly job search strategy.

My Goal:

Target Role:
Experience:
Preferred Location:
Remote/Hybrid/On-site:
Hours Available Per Week:

Create:

- Daily schedule
- Application goals
- Networking goals
- Resume tailoring schedule
- Interview preparation schedule
- KPI dashboard

Also recommend what I should focus on every day.`,
  },
  {
    title: 'Best Companies Finder',
    category: 'search',
    bestFor: 'Finding companies that match your career goals instead of only searching job boards.',
    tools: ['ChatGPT', 'Claude', 'Gemini'],
    timeSaved: '60 minutes',
    difficulty: 'Intermediate',
    text: `Based on my experience and career goals, recommend companies where I would be a strong candidate.

My Details:

Role:
Industry:
Years of Experience:
Location:
Salary Goal:

Create three categories:

Dream Companies

Strong Matches

Practice Companies

For every company include:

- Why it matches
- Hiring trends
- Company size
- Work culture
- Career growth
- Recommended departments`,
  },
  {
    title: 'AI Job Description Analyzer',
    category: 'search',
    bestFor: 'Breaking down a job description before applying.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '25 minutes',
    difficulty: 'Beginner',
    text: `Analyze this job description like a recruiter.

Identify:

- Required skills
- Preferred skills
- Hidden expectations
- Keywords
- ATS keywords
- Important tools
- Required certifications
- Soft skills
- Interview topics

Finally provide:

- Application priority (High / Medium / Low)
- Resume recommendations
- LinkedIn improvements

Job Description:

[Paste Here]`,
  },
  {
    title: 'AI Job Match Score',
    category: 'search',
    bestFor: 'Measuring how well you match a specific job before applying.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '30 minutes',
    difficulty: 'Intermediate',
    text: `Compare my resume against this job description.

Return a detailed Job Match Score.

Evaluate:

- Skills Match
- Experience Match
- Education Match
- Industry Match
- ATS Compatibility
- Technical Skills
- Soft Skills
- Overall Match

Score every category from 0–100.

Explain why.

Suggest improvements before I apply.

Resume:

Job Description:`,
  },
  {
    title: 'AI Application Strategy',
    category: 'search',
    bestFor: 'Building a complete application plan for one specific job.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '40 minutes',
    difficulty: 'Intermediate',
    text: `Help me maximize my chances of getting an interview for this position.

Based on my resume and the job description, create an application strategy.

Include:

- Resume improvements
- LinkedIn improvements
- Cover letter recommendations
- Recruiter outreach strategy
- Networking opportunities
- Follow-up timeline
- Interview preparation topics

Resume:

Job Description:`,
  },
  {
    title: 'AI Company Research Assistant',
    category: 'search',
    bestFor: 'Researching companies before applying or interviewing.',
    tools: ['ChatGPT', 'Claude', 'Gemini'],
    timeSaved: '45–60 minutes',
    difficulty: 'Beginner',
    text: `Act as a company research analyst.

Research this company before my application.

Company:

Generate:

- Company overview
- Products & Services
- Mission
- Recent news
- Competitors
- Company culture
- Leadership
- Growth opportunities
- Interview tips
- Questions I should ask
- Potential red flags

Summarize everything in a recruiter-friendly briefing.`,
  },
  {
    title: 'AI Application Prioritizer',
    category: 'search',
    bestFor: 'Deciding which opportunities deserve your time.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '20–30 minutes',
    difficulty: 'Intermediate',
    text: `I have multiple job opportunities.

Help me prioritize which ones I should apply to first.

For each opportunity evaluate:

- Match with my skills
- Career growth
- Salary potential
- Company reputation
- Learning opportunities
- Location
- Remote flexibility
- Promotion potential

Rank every opportunity from highest to lowest priority.

Explain your reasoning.`,
  },
  {
    title: 'AI Job Search Dashboard Builder',
    category: 'search',
    bestFor: 'Creating a complete system to track every application.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '60+ minutes',
    difficulty: 'Intermediate',
    text: `Act as a productivity consultant.

Help me build a complete Job Search Dashboard.

Include sections for:

- Target Companies
- Applications Submitted
- Resume Versions
- Recruiter Contacts
- Networking
- Referrals
- Interview Stages
- Follow-up Dates
- Offers
- Rejections
- Weekly KPIs

Recommend how to organize this dashboard in:

- Notion
- Excel
- Google Sheets

Also include a weekly review workflow and automation ideas to keep everything updated.`,
  },

  // ── Interview Preparation (28–38) ────────────────────────────────────────
  {
    title: 'Tell Me About Yourself Generator',
    category: 'interview',
    bestFor: 'Creating a confident and personalized introduction for interviews.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '30–45 minutes',
    difficulty: 'Beginner',
    text: `Act as an executive interview coach.

Help me answer the interview question:

"Tell me about yourself."

My Details:

Current Role:
Years of Experience:
Industry:
Biggest Achievement:
Target Role:

Structure the answer using:

- Present
- Past
- Future

Create three versions:

- 30-second answer
- 60-second answer
- Executive version

Explain why each version is effective.`,
  },
  {
    title: 'STAR Story Builder',
    category: 'interview',
    bestFor: 'Turning your work experience into compelling STAR interview answers.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '45 minutes',
    difficulty: 'Intermediate',
    text: `Act as an interview coach.

Convert my work experience into STAR interview stories.

Experience:

[Paste Experience]

Generate STAR stories for:

- Leadership
- Conflict
- Failure
- Success
- Innovation
- Tight Deadlines
- Teamwork
- Customer Challenges
- Problem Solving
- Adaptability

For each story include:

Situation

Task

Action

Result

Lessons Learned`,
  },
  {
    title: 'Behavioral Interview Coach',
    category: 'interview',
    bestFor: 'Preparing for common behavioral interview questions.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '60 minutes',
    difficulty: 'Intermediate',
    text: `Act as a Fortune 500 hiring manager.

Ask me 20 behavioral interview questions one at a time.

After every answer:

- Score it (1–10)
- Identify weaknesses
- Suggest improvements
- Rewrite the answer
- Explain how to make it stronger

Do not move to the next question until feedback is complete.`,
  },
  {
    title: 'Technical Interview Generator',
    category: 'interview',
    bestFor: 'Preparing for technical or role-specific interviews.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '60+ minutes',
    difficulty: 'Intermediate',
    text: `Act as a senior interviewer.

Generate a realistic technical interview for this role.

Role:

Industry:

Experience Level:

Include:

- Beginner questions
- Intermediate questions
- Advanced questions
- Scenario-based questions
- Follow-up questions

After each answer:

- Score my response
- Correct mistakes
- Suggest a better answer`,
  },
  {
    title: 'AI Mock Interview Simulator',
    category: 'interview',
    bestFor: 'Practicing a complete interview from start to finish.',
    tools: ['ChatGPT (Voice)', 'Claude'],
    timeSaved: '60–90 minutes',
    difficulty: 'Advanced',
    text: `Act as a professional interviewer.

Conduct a complete mock interview.

Start with introductions.

Ask one question at a time.

Wait for my answer.

After each response:

- Evaluate confidence
- Evaluate clarity
- Evaluate structure
- Evaluate relevance
- Evaluate professionalism

Then ask the next question.

At the end generate:

- Overall Score
- Strengths
- Weaknesses
- Improvement Plan`,
  },
  {
    title: 'Weak Answer Improver',
    category: 'interview',
    bestFor: 'Improving interview responses that feel unclear or weak.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '20 minutes',
    difficulty: 'Beginner',
    text: `Improve my interview answer.

Question:

My Answer:

Rewrite it in three styles:

- Professional
- Executive
- Conversational

Explain why each version is stronger.

Point out filler words, weak phrasing, and missing details.`,
  },
  {
    title: 'Interview Performance Review',
    category: 'interview',
    bestFor: 'Analyzing a completed interview and identifying areas for improvement.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '30–45 minutes',
    difficulty: 'Intermediate',
    text: `Act as an interview coach.

Review my interview performance.

Questions Asked:

My Answers:

Evaluate:

- Communication
- Confidence
- Storytelling
- Technical Knowledge
- Leadership
- Professionalism

Score each category from 1–10.

Create a personalized improvement plan.`,
  },
  {
    title: 'Questions to Ask the Interviewer',
    category: 'interview',
    bestFor: 'Generating thoughtful questions that demonstrate curiosity and professionalism.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '15–20 minutes',
    difficulty: 'Beginner',
    text: `Generate 25 thoughtful questions I can ask during my interview.

Company:

Role:

Industry:

Organize them into:

- Team
- Culture
- Success Metrics
- Career Growth
- Leadership
- Projects
- Technology
- Company Vision

Highlight the top 10 questions that leave the strongest impression.`,
  },
  {
    title: 'Company-Specific Interview Prep',
    category: 'interview',
    bestFor: 'Preparing for interviews at a specific company.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '45–60 minutes',
    difficulty: 'Intermediate',
    text: `Help me prepare for an interview at this company.

Company:

Role:

Job Description:

Create:

- Company overview
- Interview expectations
- Likely behavioral questions
- Likely technical questions
- Company values
- Recent news to mention
- Questions I should ask
- Common mistakes to avoid

Finish with a one-page interview cheat sheet.`,
  },
  {
    title: 'Executive Presence Coach',
    category: 'interview',
    bestFor: 'Improving confidence, communication, and executive presence.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '40 minutes',
    difficulty: 'Advanced',
    text: `Act as an executive communication coach.

Review my interview answers.

Help me improve:

- Confidence
- Clarity
- Speaking style
- Executive presence
- Storytelling
- Leadership language
- Body language recommendations
- Voice tone recommendations

Rewrite my responses to sound more confident while remaining authentic.`,
  },
  {
    title: 'Final Interview Readiness Checklist',
    category: 'interview',
    bestFor: 'Making sure you’re fully prepared before interview day.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '20 minutes',
    difficulty: 'Beginner',
    text: `Act as my interview preparation coach.

Create a personalized Interview Readiness Checklist.

Role:

Company:

Interview Type:

Experience Level:

Generate checklists for:

- Resume Review
- Company Research
- STAR Stories
- Technical Preparation
- Behavioral Questions
- Questions for the Interviewer
- Documents to Bring
- Virtual Interview Setup
- In-Person Interview Preparation
- Post-Interview Follow-up

At the end, give me an Interview Readiness Score (0–100) and identify any gaps before interview day.`,
  },

  // ── Networking (39–44) ───────────────────────────────────────────────────
  {
    title: 'Recruiter Outreach Message Generator',
    category: 'networking',
    bestFor: 'Writing professional messages that recruiters are more likely to respond to.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '20–30 minutes',
    difficulty: 'Beginner',
    text: `Act as an experienced recruiter.

Help me write a personalized outreach message.

My Details:

Current Role:
Years of Experience:
Target Role:
Company:
Recruiter Name (optional):

Generate:

- LinkedIn Message
- Email Version
- Follow-up Message (5 days later)

Keep the message professional, concise, and personalized.`,
  },
  {
    title: 'Referral Request Generator',
    category: 'networking',
    bestFor: 'Asking for referrals professionally without sounding desperate.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '20 minutes',
    difficulty: 'Beginner',
    text: `Help me write a referral request.

Relationship:

- Friend
- Former Coworker
- Alumni
- Recruiter
- Hiring Manager

Role:

Company:

Create three versions:

- Casual
- Professional
- Formal

Also explain when I should send each version.`,
  },
  {
    title: 'Alumni Networking Assistant',
    category: 'networking',
    bestFor: 'Connecting with alumni and building professional relationships.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '20 minutes',
    difficulty: 'Beginner',
    text: `Act as a networking coach.

Help me connect with alumni from my university.

My Information:

University:
Current Role:
Target Role:
Industry:

Generate:

- Connection Request
- First Message
- Follow-up
- Coffee Chat Request
- Thank You Message

Keep every message authentic and relationship-focused.`,
  },
  {
    title: 'LinkedIn Connection Request Generator',
    category: 'networking',
    bestFor: 'Sending personalized LinkedIn invitations.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '15 minutes',
    difficulty: 'Beginner',
    text: `Generate personalized LinkedIn connection requests.

Recipient Type:

- Recruiter
- Hiring Manager
- Industry Professional
- Alumni
- Former Coworker

Create five different versions.

Keep every message under LinkedIn's character limit while remaining professional.`,
  },
  {
    title: 'Follow-Up Message Builder',
    category: 'networking',
    bestFor: 'Following up after networking conversations or job applications.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '20 minutes',
    difficulty: 'Beginner',
    text: `Help me write professional follow-up messages.

Scenario:

- After Applying
- After Networking
- After Recruiter Call
- After Interview
- After Referral

Generate:

- First Follow-up
- Second Follow-up
- Final Check-in

Maintain a professional and respectful tone.`,
  },
  {
    title: 'Thank You Message Generator',
    category: 'networking',
    bestFor: 'Writing thoughtful thank-you messages after interviews or networking meetings.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '10 minutes',
    difficulty: 'Beginner',
    text: `Write a thank-you message after:

- Job Interview
- Coffee Chat
- Networking Event
- Recruiter Conversation
- Referral

Mention:

- Appreciation
- Key discussion point
- Continued interest
- Professional closing

Create both LinkedIn and email versions.`,
  },

  // ── Offer & Negotiation (45–48) ──────────────────────────────────────────
  {
    title: 'Salary Negotiation Script Generator',
    category: 'offer',
    bestFor: 'Preparing confident and professional salary negotiations.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '30–45 minutes',
    difficulty: 'Intermediate',
    text: `Act as a salary negotiation coach.

Help me negotiate my job offer.

Current Offer:

Desired Salary:

Role:

Location:

Years of Experience:

Generate:

- Negotiation Script
- Email Version
- Phone Conversation
- Common Objections
- Professional Responses

Keep the tone confident and collaborative.`,
  },
  {
    title: 'Offer Comparison Matrix',
    category: 'offer',
    bestFor: 'Comparing multiple job offers objectively.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '30 minutes',
    difficulty: 'Beginner',
    text: `Compare these job offers.

Evaluate:

- Salary
- Bonus
- Equity
- Health Benefits
- Retirement
- PTO
- Remote Flexibility
- Career Growth
- Manager
- Learning Opportunities
- Company Stability
- Work-Life Balance

Rank each offer and explain your reasoning.

Recommend which offer best supports my long-term career goals.`,
  },
  {
    title: 'Counter Offer Builder',
    category: 'offer',
    bestFor: 'Responding professionally when negotiating compensation or benefits.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '20–30 minutes',
    difficulty: 'Intermediate',
    text: `Help me prepare a counteroffer.

Current Offer:

Desired Compensation:

Reason:

Generate:

- Email Version
- Phone Script
- Recruiter Conversation

Also prepare responses if the employer says:

- "This is our final offer."
- "We don't negotiate."
- "We need approval."

Maintain professionalism throughout.`,
  },
  {
    title: 'Total Compensation Evaluator',
    category: 'offer',
    bestFor: 'Understanding the true value of a job offer beyond base salary.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '25 minutes',
    difficulty: 'Beginner',
    text: `Evaluate my complete compensation package.

Include:

- Base Salary
- Bonus
- Equity
- Insurance
- Retirement Match
- PTO
- Learning Budget
- Signing Bonus
- Remote Benefits
- Other Perks

Calculate the approximate total value.

Identify strengths, weaknesses, and negotiation opportunities.

Recommend questions I should ask before accepting the offer.`,
  },

  // ── Career Growth (49–50) ────────────────────────────────────────────────
  {
    title: 'AI Career Roadmap Builder',
    category: 'career',
    bestFor: 'Planning long-term career growth with clear milestones.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '45–60 minutes',
    difficulty: 'Intermediate',
    text: `Act as my AI Career Coach.

Build a personalized 3-year career roadmap.

My Information:

Current Role:
Years of Experience:
Industry:
Target Role:
Career Goal:

Include:

- Skills to Develop
- Certifications
- Recommended Projects
- Networking Goals
- Salary Milestones
- Promotion Strategy
- Quarterly Objectives
- Learning Plan

Finish with a step-by-step action plan for the next 90 days.`,
  },
  {
    title: 'Quarterly Career Review',
    category: 'career',
    bestFor: 'Reviewing your progress and staying prepared for future opportunities.',
    tools: ['ChatGPT', 'Claude'],
    timeSaved: '30–45 minutes',
    difficulty: 'Beginner',
    text: `Act as my personal career advisor.

Review my progress over the last 90 days.

Evaluate:

- Achievements
- Skills Learned
- Certifications Completed
- Projects Delivered
- Networking Growth
- Resume Updates
- LinkedIn Activity
- Interview Readiness
- Promotion Readiness

Score each area from 1–10.

Then recommend:

- My biggest strengths
- My biggest weaknesses
- Skills to learn next
- Networking goals
- Career priorities for the next quarter

Finish by creating a personalized 90-day career improvement plan.`,
  },
]

export const prompts = raw.map((p, i) => ({
  ...p,
  id: i + 1,
  num: String(i + 1).padStart(2, '0'),
}))
