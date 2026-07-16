// ============================================================================
//  BYTE LAB · AI JOB HUNTER OS RECIPES
//
//  Every `bytelab` block in src/data/jobhunter/course.js points at a key here.
//  Shared analysis/scoring helpers come from byteLabKit.js; the merge into the
//  single RECIPES map — and the live-model integration point — live in
//  byteLab.js. Nothing in this file talks to a network.
//
//  Scoring recipes read what the learner actually typed (metrics, action verbs,
//  résumé fluff, filler words, STAR beats), so feedback is honest rather than
//  decorative. A learner who pastes a weak bullet gets told why it's weak.
// ============================================================================
import {
  val, clamp, decap,
  analyzeResume, impactScore, atsScore, readabilityScore, confidenceScore,
  starParts, starScore, resumeNote, bulletCore,
} from './byteLabKit'

// Money in, money out — parses "90000", "$90,000", "90k".
const money = (s) => {
  const t = String(s || '').toLowerCase().replace(/[^0-9.k]/g, '')
  if (!t) return 0
  const n = parseFloat(t.replace('k', ''))
  if (!isFinite(n)) return 0
  return t.includes('k') ? n * 1000 : n
}
const usd = (n) => `$${Math.round(n).toLocaleString()}`

export const JOB_HUNTER_RECIPES = {
  // ═══════════════ MODULE 1 · Build Your Job Search System ═════════════════
  'jh-m1-analyze': (v) => {
    const style = val(v, 'style', 'I apply to everything I see.')
    const map = {
      'I apply to everything I see.': {
        weakness: 'Applying without a repeatable strategy.',
        why: 'Volume feels like progress because it produces activity. It doesn’t produce interviews — the same untailored resume fails 250 times just as easily as it fails once.',
        first: 'Cut your application volume by 80% and put that time into tailoring. Fewer, better.',
      },
      'I only apply to jobs I really like.': {
        weakness: 'Too few applications, and no pipeline behind them.',
        why: 'Being selective is right. Being selective with no volume at all means one rejection resets you to zero.',
        first: 'Build a target list of 20–30 companies so there’s always something in flight.',
      },
      'I mostly use LinkedIn Easy Apply.': {
        weakness: 'Competing in the highest-volume, lowest-signal channel there is.',
        why: 'Easy Apply is easy for everyone — that’s the problem. You’re applicant 400, with no referral and no tailoring.',
        first: 'Apply on the company’s own careers page instead, and find one person to message.',
      },
      'Recruiters usually contact me.': {
        weakness: 'A passive pipeline you don’t control.',
        why: 'Inbound is a great position — until it stops, and you have no system to fall back on.',
        first: 'Keep the inbound, but build the outbound system anyway. It’s insurance.',
      },
      'I’m not actively applying yet.': {
        weakness: 'Nothing yet — which is the best time to build the system.',
        why: 'Everything in this course is easier to build before you need it, and far harder while you’re anxious about rent.',
        first: 'Start with your target list and your resume. Applications come later.',
      },
    }
    const m = map[style] || map['I apply to everything I see.']
    return {
      headline: 'Based on your answer, here’s your biggest opportunity.',
      sections: [
        { label: 'Current weakness', text: m.weakness },
        { label: 'Why it’s costing you', text: m.why },
        { label: 'What we’ll build in this course', items: [
          'AI-powered job search workflow',
          'Resume optimization system',
          'LinkedIn optimization',
          'Interview preparation',
          'Networking system',
          'Offer tracker',
        ]},
        { label: 'Your first move', text: m.first },
      ],
      note: 'By the end of this course you’ll have a repeatable process instead of guessing what to do next.',
    }
  },

  'jh-m1-plan': (v) => {
    const role = val(v, 'role', 'Marketing Manager')
    return {
      headline: `Here’s the search plan for “${role}”.`,
      sections: [
        { label: 'Suggested job titles', items: [
          role,
          `Senior ${role}`,
          `${role} (Contract)`,
          `Associate ${role}`,
          `${role.split(' ')[0]} Lead`,
          `${role.split(' ').slice(-1)[0]} Specialist`,
        ]},
        { label: 'Related keywords to search', items: [
          `${role} + your industry`,
          `${role} + remote`,
          `${role} + the tools you know`,
          `${role} + your city`,
        ]},
        { label: 'Similar roles worth a look', text: `Roles rarely have one name. The same job is posted as ${role}, as a Specialist, and as a Lead depending on company size. Search all three or you’ll miss half the market.` },
        { label: 'Core skills employers expect', items: [
          'The two or three tools named in almost every posting',
          'One measurable outcome you own',
          'Evidence you’ve done it before, with a number attached',
        ]},
      ],
      note: 'Search titles, not vibes. The exact words in the posting are the words recruiters filter on.',
    }
  },

  'jh-m1-targets': (v) => {
    const companies = val(v, 'companies', 'five companies you admire')
    return {
      headline: 'Good list. Now put it in an order you can actually work through.',
      sections: [
        { label: 'Your list', text: companies },
        { label: '🟢 Dream companies', text: 'The ones you genuinely want. Apply to these LAST — after you’ve practised. You only get one shot per company per role.' },
        { label: '🟡 Strong matches', text: 'You meet most of the bar and would be happy there. This is where most of your applications should go.' },
        { label: '🔵 Practice applications', text: 'Real roles you’d accept, but wouldn’t mourn. Apply here first — this is where you learn what the interview actually asks.' },
        { label: 'The order that works', items: [
          'Week 1–2: practice applications — get the process fluent',
          'Week 3+: strong matches — where the offers usually come from',
          'Then: dream companies — once your answers are sharp',
        ]},
      ],
      note: 'Most people apply to their dream company on day one, with their worst resume and zero interview practice. Don’t.',
    }
  },

  'jh-m1-dashboard': (v) => {
    const industry = val(v, 'industry', 'your industry')
    const level = val(v, 'level', 'Mid-Level')
    return {
      headline: `Your Job Hunter dashboard — ${level}, ${industry}.`,
      sections: [
        { label: 'Track these', items: [
          'Target companies', 'Applications submitted', 'Resume versions',
          'Recruiter conversations', 'Interview stages', 'Follow-ups',
          'Offers', 'Rejections', 'Next actions',
        ]},
        { label: 'Personalised for you', text: `Level: ${level} · Industry: ${industry} · Location: ${val(v, 'location', 'flexible')} · Type: ${val(v, 'type', 'Remote / Hybrid')}. Salary goal: ${val(v, 'salary', 'to be set')}.` },
        { label: 'The metrics that matter', items: [
          'Interview rate — interviews ÷ applications',
          'Recruiter response rate',
          'Referral rate',
          'Offer rate',
        ]},
        { label: 'The metric that doesn’t', text: 'Applications sent. It measures effort, not progress — and it’s the one that makes people feel productive while getting nowhere.' },
      ],
      note: 'Don’t measure success by the number of applications. Measure whether your rates are improving.',
    }
  },

  'jh-m1-challenge': (v) => ({
    headline: `Your complete Job Search System for ${val(v, 'role', 'your target role')}.`,
    sections: [
      { label: 'Target job titles', text: `${val(v, 'role', 'your role')} — plus the Senior / Specialist / Lead variants of the same job.` },
      { label: 'Target company list', text: 'Twenty companies, split 🟢 dream / 🟡 strong / 🔵 practice. Practice first.' },
      { label: 'Weekly application workflow', items: [
        'Mon — research', 'Tue — tailor resumes', 'Wed — submit',
        'Thu — network & follow up', 'Fri — interview prep & review',
      ]},
      { label: 'AI-powered job tracker', text: 'Company, role, recruiter, date, resume version, referral, stage, follow-up date, notes.' },
      { label: 'Success metrics', items: ['Interview rate', 'Recruiter response rate', 'Referral rate', 'Offer rate'] },
      { label: '30-day application plan', text: 'Week 1 practice applications · Week 2 refine from what you learn · Weeks 3–4 strong matches and dream companies. 40 targeted applications beats 250 random ones.' },
    ],
    note: 'You now have a system. Every module from here improves one stage of it.',
  }),

  // ═══════════════════════ MODULE 2 · Resume OS ════════════════════════════
  'jh-m2-analyze': (v) => {
    const a = analyzeResume(val(v, 'resume', ''))
    if (a.empty) return null
    const overall = clamp((impactScore(a) + atsScore(a) + readabilityScore(a)) / 3)
    return {
      headline: a.hasMetric
        ? 'There’s real evidence in here. Now let’s make it easy to find.'
        : 'The biggest problem: nothing here proves you achieved anything.',
      scores: [
        { label: 'ATS compatibility', value: atsScore(a), note: a.words > 40 ? 'Long, dense blocks parse badly. Break into bullets.' : 'Structure looks parseable.' },
        { label: 'Readability', value: readabilityScore(a), note: 'A recruiter gives this about six seconds. Would they get it?' },
        { label: 'Keyword match', value: clamp(atsScore(a) - 6), note: 'Paste the job description in Lesson 2.4 for a real match score.' },
        { label: 'Impact', value: impactScore(a), note: a.hasMetric ? 'You quantified something. That’s the whole game.' : 'No numbers = no proof. Add one metric.' },
        { label: 'Formatting', value: clamp(readabilityScore(a) + (a.startsWithVerb ? 6 : -6)), note: 'Simple beats flashy. Columns and graphics break parsers.' },
        { label: 'Overall score', value: overall, note: resumeNote(overall) },
      ],
      sections: [
        { label: '✅ Strengths', items: [
          ...(a.hasMetric ? ['You use numbers — most resumes don’t'] : []),
          ...(a.startsWithVerb ? ['You lead with action verbs'] : []),
          ...(a.actionVerbs.length ? [`Strong verbs found: ${a.actionVerbs.slice(0, 4).join(', ')}`] : []),
          ...(!a.hasMetric && !a.startsWithVerb ? ['You showed up and pasted it — that’s step one'] : []),
        ]},
        { label: '⚠ Weaknesses', items: [
          ...(a.fluff.length ? [`Buzzword fluff: ${a.fluff.map((f) => `“${f}”`).join(', ')} — these say nothing`] : []),
          ...(!a.hasMetric ? ['No measurable impact anywhere'] : []),
          ...(!a.startsWithVerb ? ['Doesn’t lead with an action verb'] : []),
          ...(a.words > 40 ? ['Too dense — recruiters skim, they don’t read'] : []),
          ...(a.fluff.length === 0 && a.hasMetric && a.startsWithVerb ? ['Nothing structural — now it’s about tailoring'] : []),
        ]},
        { label: '🚀 Quick wins', items: [
          'Add one number to your top three bullets',
          'Replace “Responsible for” with what you actually achieved',
          'Cut anything older than 10 years or irrelevant to the role',
          'One column, standard headings, no text inside images',
        ]},
      ],
      note: 'The goal isn’t a prettier resume. It’s a resume that’s easier to understand in six seconds.',
    }
  },

  'jh-m2-ats': (v) => {
    const role = val(v, 'role', 'Product Manager')
    return {
      headline: `ATS optimisation for “${role}”.`,
      sections: [
        { label: 'Suggested keywords', text: `Pull these from three real ${role} postings, not from imagination. The words in the posting ARE the keywords — recruiters search the exact terms they wrote.` },
        { label: 'ATS-friendly structure', items: [
          'Name', 'Contact information', 'Professional summary', 'Experience',
          'Projects', 'Education', 'Skills', 'Certifications',
        ]},
        { label: 'What breaks compatibility', items: [
          'Multiple columns — text gets read out of order',
          'Text inside images or graphics — invisible to the parser',
          'Headers/footers holding your contact details',
          'Creative section names (“Where I’ve Made Magic”) instead of “Experience”',
          'Tables for layout',
        ]},
        { label: 'The honest truth about ATS', text: 'ATS doesn’t “reject” you. It organises applications so a recruiter can search and filter. If you’re not findable for the terms they search, you’re not rejected — you’re invisible. That’s worse.' },
      ],
      note: 'Fancy graphics and multiple columns often reduce compatibility. Simple wins.',
    }
  },

  'jh-m2-bullets': (v) => {
    const a = analyzeResume(val(v, 'bullet', ''))
    if (a.empty) return null
    const base = a.text.replace(/[.]+$/, '').trim()
    // A bullet full of fluff isn't worth echoing back — rebuild the rewrites
    // from its core instead, which is the actual lesson.
    const clean = a.fluff.length === 0 && a.startsWithVerb
    const core = decap(bulletCore(a.text))
    return {
      headline: a.hasMetric
        ? 'Good — there’s a number in it. Let’s sharpen the rest.'
        : 'This describes the work. It doesn’t prove the result.',
      scores: [
        { label: 'Impact', value: impactScore(a), note: a.hasMetric ? 'Quantified. This is what gets read.' : 'Add a metric — %, $, time saved, or volume.' },
        { label: 'ATS', value: atsScore(a), note: 'Keywords plus a verb plus a number is the parseable shape.' },
        { label: 'Readability', value: readabilityScore(a), note: a.words > 30 ? 'Too long for a bullet. One line, one achievement.' : 'Good length.' },
      ],
      sections: [
        ...(a.fluff.length ? [{ label: 'Cut these first', items: a.fluff.map((f) => `“${f}” — describes a job description, not you`) }] : []),
        { label: 'Byte’s formula', text: 'Action verb → Task → Result → Metric.\nCreated → Email campaign → Improved open rate → +24%' },
        ...(clean ? [] : [{ label: 'What’s actually in your bullet', text: `Strip the padding and you’re left with: “${core}”. Everything below is built from that — the rest was describing a job description, not you.` }]),
        { label: 'Recruiter version', text: clean
          ? `${base}, delivering a measurable improvement in the metric that mattered.`
          : `Grew ${core}, increasing [metric] by [X%] over [timeframe].` },
        { label: 'Executive version', text: `Owned ${core} end to end — set the strategy, drove the delivery, and reported the outcome to leadership.` },
        { label: 'ATS version', text: `Managed ${core} using [the exact tools named in the job description].` },
        { label: 'Achievement version', text: a.hasMetric
          ? `${base}\n\nKeep this one — the number is already doing the work.`
          : `Increased [metric] for ${core} by [X%] over [timeframe].\n\nFill in the brackets with something true. That’s the whole exercise — and it’s the difference between this bullet getting read and getting skipped.` },
      ],
      note: 'Most resumes describe work. Great resumes demonstrate impact. The difference is usually one number.',
    }
  },

  'jh-m2-tailor': (v) => {
    const jd = analyzeResume(val(v, 'jd', ''))
    if (jd.empty) return null
    return {
      headline: 'Compared. Here’s the gap between your resume and this job.',
      scores: [
        { label: 'ATS match score', value: clamp(atsScore(jd) - 8), note: 'Rises fast once you mirror the posting’s own language.' },
      ],
      sections: [
        { label: '✅ Missing keywords', text: 'Read the posting again and list every tool, method and certification it names. Any that are true of you but absent from your resume are free points — add them where they’re honest.' },
        { label: '✅ Missing skills', text: 'Anything required that you genuinely lack: don’t fabricate it. Note it as a learning goal and lean on the transferable evidence you do have.' },
        { label: '✅ Strong matches', text: 'Where your experience already lines up, use THEIR wording, not yours. “Lifecycle marketing” and “CRM marketing” are the same job — only one of them is being searched for.' },
        { label: '✅ Weak matches', text: 'Where you’re adjacent but not exact, add the bridging detail: the project, the tool, the scale.' },
        { label: 'Updated professional summary', text: `Three lines: who you are, the outcome you own, and the exact role you're targeting — using the posting's own title.` },
        { label: 'Improved experience bullets', text: 'Reorder so the bullets closest to this job sit at the top of each role. Same truth, better order.' },
      ],
      note: 'Maintain complete honesty. Tailoring means changing emphasis and wording — never inventing experience.',
    }
  },

  'jh-m2-versions': (v) => {
    const path = val(v, 'path', 'Marketing')
    return {
      headline: `Build these ${path} resume versions once, then reuse them forever.`,
      sections: [
        { label: 'Your core version', text: `The master ${path} resume. Everything true, nothing cut. You never send this one — you cut it down.` },
        { label: 'Recommended variants', items: [
          `${path} — generalist (the safe default)`,
          `${path} — analytics/data emphasis`,
          `${path} — leadership/management emphasis`,
          `${path} — specialist (your strongest niche)`,
        ]},
        { label: 'How this saves hours', text: 'Tailoring from a variant takes 10 minutes. Tailoring from scratch takes 90. Build the four once and every future application is a small edit.' },
        { label: 'Naming convention', text: 'Firstname-Lastname-Role-Company.pdf. Never “resume-final-v3-REAL.pdf” — recruiters see the filename.' },
      ],
      note: 'Different jobs need different resumes. That doesn’t mean writing each one from scratch.',
    }
  },

  'jh-m2-audit': (v) => {
    const a = analyzeResume(val(v, 'resume', ''))
    if (a.empty) return null
    const credibility = clamp(72 - a.fluff.length * 14 + (a.hasMetric ? 14 : -10))
    return {
      headline: a.fluff.length
        ? `${a.fluff.length} red flag${a.fluff.length > 1 ? 's' : ''} a recruiter will notice in the first pass.`
        : 'No obvious red flags. Now it’s about proof.',
      scores: [
        { label: 'Clarity', value: readabilityScore(a), note: 'Can a stranger tell what you do?' },
        { label: 'Professionalism', value: clamp(70 - a.fluff.length * 12), note: a.fluff.length ? 'Buzzwords read as padding.' : 'Clean.' },
        { label: 'ATS compatibility', value: atsScore(a), note: 'Simple structure, real keywords.' },
        { label: 'Readability', value: readabilityScore(a), note: 'Six seconds. That’s the budget.' },
        { label: 'Impact', value: impactScore(a), note: a.hasMetric ? 'Evidence present.' : 'No numbers = no evidence.' },
        { label: 'Credibility', value: credibility, note: credibility >= 70 ? 'Believable and specific.' : 'Claims without proof read as noise.' },
      ],
      sections: [
        { label: 'Priority fixes', items: [
          ...(a.fluff.length ? [`Delete: ${a.fluff.map((f) => `“${f}”`).join(', ')}`] : []),
          ...(!a.hasMetric ? ['Add a measurable result to your top three bullets'] : []),
          ...(!a.startsWithVerb ? ['Start every bullet with an action verb'] : []),
          ...(a.words > 40 ? ['Break the dense block into single-line bullets'] : []),
        ]},
        { label: 'The eight red flags recruiters scan for', items: [
          'Generic summary', 'Long paragraphs', 'Buzzword overload', 'Grammar mistakes',
          'Irrelevant experience', 'Missing numbers', 'Keyword stuffing', 'Poor formatting',
        ]},
        { label: 'Updated example', text: a.hasMetric
          ? 'Yours already carries a number — apply the same treatment to every other bullet.'
          : 'Instead of “Managed social media” → “Increased Instagram engagement by 38% over six months through an education-led content strategy.”' },
      ],
      note: 'Keyword stuffing is as damaging as no keywords. Recruiters can spot a wall of skills with no evidence behind it.',
    }
  },

  'jh-m2-stage': (v) => {
    const level = val(v, 'level', 'Mid-Level Professional')
    const years = val(v, 'years', 'a few')
    const role = val(v, 'role', 'your target role')
    const map = {
      Student: { summary: 'Lead with education, projects and internships. A summary is optional — evidence isn’t.', emphasis: 'Projects and coursework carry the weight. Quantify them anyway: “team of 4”, “200 survey responses”.', layout: 'One page. Education at the top.' },
      'New Graduate': { summary: 'Two lines: your field and the outcome you want to own.', emphasis: 'Internships, projects, and any real deliverable. Move education below experience the moment you have any.', layout: 'One page. No exceptions.' },
      'Career Switcher': { summary: 'This is your most important section — it explains the pivot before they can dismiss it.', emphasis: 'Transferable skills first. Reframe old achievements in the new industry’s language.', layout: 'One page. Consider a skills-forward layout.' },
      'Mid-Level Professional': { summary: 'Three lines: role, specialism, and the metric you move.', emphasis: 'Achievements over responsibilities. Every role needs at least one number.', layout: 'One page, two at a push.' },
      'Senior Professional': { summary: 'Lead with scope: budget, team size, systems owned.', emphasis: 'Outcomes and scale. Nobody needs your task list at this level.', layout: 'Two pages is fine.' },
      Manager: { summary: 'People, budget, and business outcome — in the first two lines.', emphasis: 'What your team delivered, and what you built that outlasted you.', layout: 'Two pages.' },
      Executive: { summary: 'A short positioning statement, not a summary. What do you turn around?', emphasis: 'P&L, strategy, org design. Numbers in the millions or percentages of the business.', layout: 'Two pages, heavy white space.' },
    }
    const m = map[level] || map['Mid-Level Professional']
    return {
      headline: `A ${level.toLowerCase()} resume strategy for ${role}.`,
      sections: [
        { label: 'Summary', text: m.summary },
        { label: 'Experience emphasis', text: m.emphasis },
        { label: 'Layout', text: m.layout },
        { label: 'Your inputs', text: `${years} years’ experience · ${val(v, 'industry', 'your industry')} · targeting ${role}.` },
        { label: 'Keywords', text: `Pull them from three real ${role} postings. The posting is the keyword list — stop guessing.` },
      ],
      note: 'A student’s resume shouldn’t look like a manager’s. Same rules, very different emphasis.',
    }
  },

  'jh-m2-challenge': (v) => ({
    headline: `Your complete Resume OS for ${val(v, 'role', 'your target role')}.`,
    sections: [
      { label: 'ATS-friendly resume', text: 'One column. Standard headings. Real text, no graphics. Parseable by anything.' },
      { label: 'Optimised professional summary', text: 'Three lines: who you are, the outcome you own, the role you want — in the posting’s own words.' },
      { label: 'Achievement-based experience', text: 'Every bullet: action verb → task → result → metric. No “responsible for”.' },
      { label: 'Tailored skills section', text: 'Only skills the posting names and you actually have. Ordered by how often they appear in it.' },
      { label: 'Keyword library', text: `Every tool, method and certification named across ten ${val(v, 'role', 'target')} postings. Reuse it forever.` },
      { label: 'Three tailored versions', items: ['Generalist', 'Specialist (your strongest niche)', 'Leadership emphasis'] },
      { label: 'Resume improvement checklist', items: [
        'One metric per bullet', 'Action verb first', 'No fluff phrases',
        'One column', 'Standard headings', 'Filename says who you are',
      ]},
      { label: 'ATS compatibility report', text: 'Run your final file back through Lesson 2.1 and compare the score to where you started.' },
    ],
    note: 'You now have a Resume OS — not just a resume. Next: the asset recruiters check straight after it.',
  }),

  // ═══════════════════════ MODULE 3 · LinkedIn OS ══════════════════════════
  'jh-m3-headline': (v) => {
    const a = analyzeResume(val(v, 'headline', ''))
    if (a.empty) return null
    const isJobTitleOnly = /^[\w\s]+ at [\w\s]+$/i.test(a.text)
    const score = clamp(isJobTitleOnly ? 34 : 44 + (a.text.includes('|') ? 22 : 0) + (a.words >= 5 ? 12 : -8))
    return {
      headline: isJobTitleOnly
        ? 'That’s your job title, not a headline. It tells a recruiter nothing they can search for.'
        : 'Decent start. Let’s make it searchable.',
      scores: [
        { label: 'Recruiter searchability', value: score, note: score >= 70 ? 'Contains terms recruiters actually search.' : 'Add your specialisms — this is a search field, not a nameplate.' },
        { label: 'Clarity', value: readabilityScore(a), note: 'Who you are, what you do, what you’re good at.' },
      ],
      sections: [
        { label: 'Recruiter version', text: `${a.text.split(' at ')[0] || a.text} | ${val(v, 'skills', 'Your Specialism')} | Open to ${val(v, 'target', 'new opportunities')}` },
        { label: 'Executive version', text: `${a.text.split(' at ')[0] || a.text} — driving measurable outcomes in ${val(v, 'industry', 'your industry')}` },
        { label: 'Personal brand version', text: `Helping ${val(v, 'industry', 'teams')} do more with less | ${val(v, 'skills', 'Your Specialism')}` },
        { label: 'ATS-friendly version', text: `${val(v, 'target', 'Target Role')} | ${val(v, 'skills', 'Skill, Skill, Skill')} | ${val(v, 'industry', 'Industry')}` },
        { label: 'Why the pipes matter', text: 'A headline is a search field. Recruiters type “marketing analytics”, not “Marketing Manager at XYZ”. Separators let you carry three or four searchable terms without a sentence.' },
      ],
      note: 'Most people write “Marketing Manager at XYZ”. That’s a nameplate. Write something a recruiter could find.',
    }
  },

  'jh-m3-genheadline': (v) => {
    const role = val(v, 'target', 'Marketing Manager')
    const industry = val(v, 'industry', 'SaaS')
    const skills = val(v, 'skills', 'Analytics, Strategy, Campaigns')
    const first = skills.split(',')[0]?.trim() || 'Strategy'
    return {
      headline: 'Five headlines. Steal the one that sounds like you.',
      sections: [
        { label: '1 · Recruiter-friendly', text: `${role} | ${skills} | ${industry}` },
        { label: '2 · Value-led', text: `${role} helping ${industry} teams turn ${decap(first)} into revenue` },
        { label: '3 · Executive', text: `${role} — ${industry} | ${first} | Measurable growth` },
        { label: '4 · Specialist', text: `${first} specialist | ${role} | ${industry}` },
        { label: '5 · Open-to-work', text: `${role} | ${skills} | Open to ${industry} opportunities` },
        { label: 'The formula', text: 'Current role → Specialisation → Industry → Value. Every one of those is a term someone might search.' },
      ],
      note: 'A headline should instantly explain who you are, what you do, and what you’re good at.',
    }
  },

  'jh-m3-about': (v) => {
    const exp = val(v, 'experience', 'your experience')
    const target = val(v, 'target', 'your target role')
    const goal = val(v, 'goal', 'your career goal')
    return {
      headline: 'Your About section — three versions, same story.',
      sections: [
        { label: 'Byte’s framework', text: 'Past → Present → Strengths → Future goals → Call to action. Five beats. Nobody reads more.' },
        { label: 'Professional version', text: `I’ve spent the last few years working in ${decap(exp)}.\n\nThese days I focus on ${decap(target)} — specifically the parts most teams find hardest to measure.\n\nWhat I’m good at: turning a vague goal into something with a number attached.\n\nI’m currently looking for ${decap(goal)}.\n\nIf that’s the kind of problem you’re hiring for, my inbox is open.` },
        { label: 'Conversational version', text: `Most people find ${decap(target)} frustrating for the same reason: it’s easy to be busy and hard to prove it worked.\n\nThat’s the bit I like.\n\n${exp} taught me how to tell the difference.\n\nRight now I’m after ${decap(goal)} — happy to chat if that overlaps with what you’re building.` },
        { label: 'Executive version', text: `${exp}.\n\nI focus on ${decap(target)}: setting the strategy, building the system, and holding the outcome.\n\nCurrently exploring ${decap(goal)}.\n\nOpen to conversations with teams who care about measurable results.` },
        { label: 'The rule', text: 'Your About section isn’t your resume — it’s your story. If it reads like a bullet list, rewrite it.' },
      ],
      note: 'Great About sections answer: who are you, what problems do you solve, what motivates you, what are you looking for.',
    }
  },

  'jh-m3-experience': (v) => {
    const a = analyzeResume(val(v, 'experience', ''))
    if (a.empty) return null
    return {
      headline: 'LinkedIn gives you more room than your resume. Use it.',
      scores: [
        { label: 'Impact', value: impactScore(a), note: a.hasMetric ? 'Numbers present.' : 'Add scale: team size, budget, volume, %.' },
        { label: 'Recruiter keywords', value: atsScore(a), note: 'LinkedIn search reads this section. Name your tools.' },
      ],
      sections: [
        { label: 'Recruiter version', text: `${a.text}\n\n→ Add underneath: the tools you used, the size of the thing, and the outcome. Recruiters search tool names.` },
        { label: 'Storytelling version', text: `Lead with the problem the team had. Then what you changed. Then what happened. LinkedIn rewards the version a human wants to finish.` },
        { label: 'ATS version', text: `Keep the same facts, but mirror the exact terms from the jobs you're targeting — LinkedIn's recruiter search is a keyword match, same as an ATS.` },
        { label: 'Each role should include', items: ['Responsibilities', 'Achievements', 'Metrics', 'Technologies', 'Projects', 'Keywords'] },
      ],
      note: 'Don’t copy your resume word-for-word. Same truth, more room, more keywords.',
    }
  },

  'jh-m3-optimize': (v) => {
    const role = val(v, 'target', 'Product Manager')
    return {
      headline: `Making you findable for “${role}”.`,
      sections: [
        { label: 'Top keywords', text: `Take three live ${role} postings. Every term appearing in all three is a keyword you must carry. That's your list — no guesswork.` },
        { label: 'Where each keyword goes', items: [
          'Headline — your 3 strongest terms',
          'About — worked into sentences, not stuffed',
          'Experience — naturally, next to the evidence',
          'Skills — the exact term, spelled the way they search it',
          'Featured — where you prove it',
        ]},
        { label: 'Missing skills', text: 'LinkedIn ranks profiles partly on skills with endorsements. Add the ones you have, get three colleagues to endorse the top three, and stop there.' },
        { label: 'Suggested certifications', text: `Only ones that appear in real ${role} postings. A certification nobody asks for is a hobby, not a signal.` },
        { label: 'Recruiter search score', text: 'A complete profile with 5+ skills, a banner, a photo and an active feed ranks materially higher than a skeleton. Completeness is a ranking factor, not vanity.' },
      ],
      note: 'Recruiters search using keywords. If your profile doesn’t contain them, you don’t appear — you’re not rejected, you’re absent.',
    }
  },

  'jh-m3-message': (v) => {
    const who = val(v, 'who', 'Recruiter')
    const map = {
      Recruiter: 'Hi [Name] — I saw you’re hiring for [Role]. I’ve spent the last [X] years doing [the specific thing the role needs], most recently [one concrete result]. Happy to send a short summary if it’s useful.',
      'Hiring Manager': 'Hi [Name] — I’m applying for [Role] on your team. I noticed [something specific and true about their work]. I’ve done [closest relevant thing] and would love to hear what a strong first 90 days looks like to you.',
      Alumni: 'Hi [Name] — fellow [University] grad here. I’m moving toward [target role] and saw you’ve been at [Company] for a while. Would you be open to a 15-minute chat about how you got there? Happy to work around your calendar.',
      Employee: 'Hi [Name] — I’m researching the [Team] team at [Company] and your name kept coming up. I’m considering applying for [Role]. Would you be open to telling me what the team is actually like day to day?',
      Friend: 'Hey [Name] — I’m job hunting properly now, targeting [Role] in [Industry]. No ask right now, just flagging it in case you hear of anything. I’ll send my one-pager so you’ve got it.',
    }
    return {
      headline: `A ${who.toLowerCase()} message that doesn’t read as spam.`,
      sections: [
        { label: 'Your message', text: map[who] || map.Recruiter },
        { label: 'Why it works', items: [
          'It’s specific — proof you didn’t mass-send it',
          'It gives before it asks',
          'It has one small, easy ask',
          'It’s short enough to answer from a phone',
        ]},
        { label: 'Never send', text: '“Hi, can you get me a job?” It asks a stranger for a favour with no context, no evidence, and no reason to say yes.' },
      ],
      note: 'Networking isn’t asking strangers for jobs. It’s starting a conversation you might need in six months.',
    }
  },

  'jh-m3-plan': (v) => {
    const time = val(v, 'time', '15 minutes/day')
    const plans = {
      '15 minutes/day': { daily: 'Two thoughtful comments. That’s it.', weekly: 'One post · 5 connection requests · profile review on Friday.' },
      '30 minutes/day': { daily: 'Three comments and one connection request.', weekly: 'One post · one article read and shared · 10 connections · Friday profile review.' },
      '1 hour/day': { daily: 'Five comments, two connections, 15 minutes of research.', weekly: 'Two posts · one long-form article · 20 connections · two coffee chats.' },
    }
    const p = plans[time] || plans['15 minutes/day']
    return {
      headline: `A LinkedIn plan that survives ${time}.`,
      sections: [
        { label: 'Daily', text: p.daily },
        { label: 'Weekly', text: p.weekly },
        { label: 'Why commenting beats posting', text: 'A good comment on a big account is seen by more relevant people than your own post — and costs a fraction of the effort. Start there.' },
        { label: 'The compounding bit', text: 'Visibility isn’t an event. Recruiters find people who showed up repeatedly, not people who posted once brilliantly.' },
      ],
      note: 'Consistency builds visibility. Your profile isn’t static — activity is what surfaces it.',
    }
  },

  'jh-m3-challenge': (v) => ({
    headline: `Your complete LinkedIn OS for ${val(v, 'target', 'your target role')}.`,
    sections: [
      { label: 'Optimised headline', text: 'Role | Specialisms | Industry — every segment a term someone searches.' },
      { label: 'Professional About section', text: 'Past → Present → Strengths → Future → CTA. Written like a person, not a resume.' },
      { label: 'Updated Experience', text: 'Achievements, metrics, technologies and projects — not a copy-paste of your resume.' },
      { label: 'Skills strategy', text: 'The exact terms from real postings. Top three endorsed. Nothing aspirational.' },
      { label: 'Keyword optimisation', text: 'The same terms across headline, About, experience, skills and featured.' },
      { label: 'Featured section', text: 'Proof: a project, a deck, an article, a portfolio. One click from the headline claim.' },
      { label: 'Networking message library', items: ['Connection request', 'Recruiter outreach', 'Referral request', 'Thank you', 'Follow-up'] },
      { label: 'Weekly growth plan', text: 'Comment daily, post weekly, review monthly. Small and repeated beats big and once.' },
    ],
    note: 'A polished profile works for you 24/7 — including on the days you don’t open the app.',
  }),

  // ═══════════════ MODULE 4 · AI Job Search Engine ═════════════════════════
  'jh-m4-strategy': (v) => {
    const role = val(v, 'role', 'Marketing Manager')
    const loc = val(v, 'location', 'your city')
    return {
      headline: `Search strategy for ${role} — ${loc}.`,
      sections: [
        { label: 'Recommended job titles', items: [role, `Senior ${role}`, `${role.split(' ')[0]} Lead`, `${role.split(' ').slice(-1)[0]} Specialist`] },
        { label: 'Related roles most people miss', text: 'The same job carries different titles at different company sizes. Search at least three variants or you’re looking at a third of the market.' },
        { label: 'Salary range', text: `Check ${role} in ${loc} across Levels.fyi, Glassdoor and real postings that publish bands. Take the median of actual postings — not the aspirational number.` },
        { label: 'Best search keywords', items: [`"${role}" + remote`, `"${role}" + ${val(v, 'preference', 'hybrid')}`, `"${role}" + your top tool`, `"${role}" + ${loc}`] },
        { label: 'Recommended job boards', items: ['LinkedIn Jobs', 'Indeed', 'Company career pages', 'Google Jobs', 'Wellfound (startups)', 'Built In (tech)'] },
      ],
      note: 'The biggest mistake isn’t applying too little. It’s applying without a filter.',
    }
  },

  'jh-m4-sources': (v) => {
    const level = val(v, 'level', 'Mid-Level')
    const map = {
      Student: ['Handshake', 'University career portal', 'LinkedIn Jobs', 'Company internship pages', 'Government & public sector portals'],
      'Entry Level': ['LinkedIn Jobs', 'Indeed', 'Company career pages', 'Built In', 'Government portals'],
      'Mid-Level': ['LinkedIn Jobs', 'Company career pages', 'Built In', 'Wellfound', 'Google Jobs'],
      Senior: ['Company career pages', 'LinkedIn Jobs', 'Wellfound', 'Your network (highest yield at this level)', 'Specialist recruiters'],
      Executive: ['Executive search firms', 'Your network — almost exclusively', 'Board and advisory routes', 'Company career pages'],
    }
    return {
      headline: `Where a ${level} candidate should actually be looking.`,
      sections: [
        { label: 'Your sources, in priority order', items: map[level] || map['Mid-Level'] },
        { label: 'The one people skip', text: 'Company career pages. Many companies post there days before the job boards pick it up — being early is a bigger edge than being polished.' },
        { label: 'Don’t rely on one site', text: 'Build a search ecosystem: two boards, five career pages, one alert. Check it on a schedule instead of doom-scrolling daily.' },
      ],
      note: `At ${level === 'Senior' || level === 'Executive' ? 'your level, the network IS the job board' : 'every level, the earlier you see a posting the better your odds'}.`,
    }
  },

  'jh-m4-analyzejob': (v) => {
    const jd = analyzeResume(val(v, 'jd', ''))
    if (jd.empty) return null
    return {
      headline: 'Analysed. Here’s what this posting is really asking for.',
      sections: [
        { label: '✅ Required skills', text: 'Anything in the first third, or repeated twice, or written as “must”. That’s the real bar — the rest is a wish list.' },
        { label: '✅ Preferred skills', text: '“Nice to have”, “bonus”, “a plus”. You can be missing several of these and still be the strongest applicant.' },
        { label: '✅ Keywords', text: 'Every tool, method and certification named. These are the literal terms the recruiter will search — mirror them exactly.' },
        { label: '✅ Resume keywords to add', text: 'The intersection of what they named and what’s true of you but missing from your resume. Free points. Add them today.' },
        { label: '✅ Interview topics', text: 'Whatever the posting spends the most words on is what they’ll ask about. Word count is intent.' },
        { label: '✅ Hidden expectations', text: '“Fast-paced” often means under-resourced. “Wear many hats” means the team is small. “Own end to end” means no support. Not dealbreakers — just know before you sign.' },
      ],
      note: 'Most people skim job descriptions. Recruiters wrote them. Read them like the answer key they are.',
    }
  },

  'jh-m4-match': (v) => {
    const resume = analyzeResume(val(v, 'resume', ''))
    const jd = analyzeResume(val(v, 'jd', ''))
    if (resume.empty || jd.empty) return null
    // Overlap of meaningful words between the resume and the posting — crude but
    // honest and explainable, which is the point of showing a score at all.
    const stop = new Set(['with', 'that', 'this', 'from', 'have', 'will', 'your', 'their', 'they', 'and', 'the', 'for', 'you', 'our', 'are', 'work', 'role', 'team', 'about', 'across', 'within'])
    const words = (t) => new Set(String(t).toLowerCase().match(/[a-z][a-z+#.]{3,}/g)?.filter((w) => !stop.has(w)) || [])
    const rw = words(resume.text)
    const jw = words(jd.text)
    const shared = [...jw].filter((w) => rw.has(w))
    const overlap = jw.size ? shared.length / jw.size : 0
    const skills = clamp(38 + overlap * 130)
    const experience = clamp(skills - 8 + (resume.hasMetric ? 10 : -6))
    const industry = clamp(skills - 4)
    const readiness = clamp((atsScore(resume) + impactScore(resume)) / 2)
    const overall = clamp(skills * 0.4 + experience * 0.25 + industry * 0.15 + readiness * 0.2)
    const rec = overall >= 80 ? 'Apply immediately' : overall >= 60 ? 'Improve your resume first' : 'Gain more experience — or find a closer role'
    return {
      headline: `Job Match Score: ${overall}%. ${rec}.`,
      scores: [
        { label: 'Skills match', value: skills, note: `${shared.length} of the posting’s ${jw.size} meaningful terms appear in your resume.` },
        { label: 'Experience match', value: experience, note: resume.hasMetric ? 'You have quantified evidence.' : 'Add metrics — they read as experience.' },
        { label: 'Industry match', value: industry, note: 'Based on shared language between the two documents.' },
        { label: 'Resume readiness', value: readiness, note: resumeNote(readiness) },
        { label: 'Overall match', value: overall, note: rec },
      ],
      sections: [
        { label: 'Terms you already share', text: shared.length ? shared.slice(0, 18).join(' · ') : 'Almost nothing overlaps — that’s the finding. This posting and your resume are describing different jobs.' },
        { label: 'Byte’s recommendation', text: overall >= 80
          ? 'Strong match. Tailor the summary, mirror their title, and send it today — speed matters more than polish at this score.'
          : overall >= 60
            ? 'You’re close. Spend 20 minutes adding their language to your resume before applying — this score moves fast.'
            : 'Low match. Either this is the wrong role, or your resume is describing a different person than the one applying. Check which.' },
      ],
      note: 'Not every job deserves an application. This is how you decide, before you spend the hour.',
    }
  },

  'jh-m4-tracker': (v) => ({
    headline: 'Your job tracker — the only memory that survives 40 applications.',
    sections: [
      { label: 'Columns you need', items: [
        'Company', 'Position', 'Recruiter', 'Date applied', 'Resume version',
        'Cover letter', 'Referral', 'Interview stage', 'Follow-up date', 'Notes',
      ]},
      { label: 'The one that matters most', text: 'Resume version. Six weeks in, someone calls about a job you barely remember and you need to know which resume they’re holding.' },
      { label: 'Follow-up date', text: 'Set it the moment you apply, not when you remember. A tracker without dates is a diary.' },
      { label: 'Weekly review', text: `${val(v, 'tool', 'Notion or a spreadsheet')} — 10 minutes every Friday. What moved, what stalled, what needs a nudge.` },
    ],
    note: 'Don’t rely on memory. By application 20 you won’t remember which company asked what.',
  }),

  'jh-m4-followup': (v) => {
    const who = val(v, 'who', 'Recruiter')
    const map = {
      Recruiter: { when: '5–7 days after applying', text: 'Hi [Name] — I applied for [Role] last week and wanted to flag my interest directly. I’ve done [closest relevant thing] most recently at [Company]. Happy to send a short summary if that’s easier than the ATS.' },
      'Hiring Manager': { when: '7 days after applying, only if you can find them', text: 'Hi [Name] — I applied for [Role] on your team. I noticed [specific, true detail about their work]. I’ve worked on [closest relevant thing] and would welcome the chance to talk about it.' },
      HR: { when: '7–10 days, once', text: 'Hi [Name] — following up on my application for [Role], submitted [date]. Is there anything else useful I can send? Happy to wait if the process is still open.' },
    }
    const m = map[who] || map.Recruiter
    return {
      headline: `Following up with ${who.toLowerCase()} — professionally.`,
      sections: [
        { label: 'When to send', text: m.when },
        { label: 'Your message', text: m.text },
        { label: 'The rules', items: [
          'Two follow-ups maximum. Then let it go.',
          'Always add something — never just “checking in”',
          'Never follow up the day after applying',
          'A “no” is information. Chasing after one is not.',
        ]},
      ],
      note: 'Most applicants never follow up at all. Two polite, useful messages puts you ahead of nearly everyone.',
    }
  },

  'jh-m4-weekly': (v) => {
    const hours = val(v, 'hours', '10')
    const n = parseInt(hours, 10) || 10
    const apps = Math.max(3, Math.round(n * 0.6))
    return {
      headline: `${hours} hours a week → roughly ${apps} strong applications.`,
      sections: [
        { label: 'Weekly schedule', items: [
          'Monday — Research and shortlist',
          'Tuesday — Resume tailoring',
          'Wednesday — Applications',
          'Thursday — Networking and follow-ups',
          'Friday — Interview prep',
          'Weekend — Review and plan',
        ]},
        { label: 'Target applications', text: `${apps} tailored applications a week. Not 40. ${apps} you actually customised will out-perform 40 you didn’t — and they’re sustainable.` },
        { label: 'Networking goals', text: `${Math.max(2, Math.round(n / 3))} outreach messages a week. This is the highest-yield hour you’ll spend.` },
        { label: 'Follow-up reminders', text: 'Every application gets a follow-up date at the moment you submit it. Non-negotiable.' },
        { label: 'The trap', text: 'Applying to 40 jobs on a Sunday feels productive and achieves nothing. Consistency beats intensity — one focused hour a day beats a heroic weekend.' },
      ],
      note: 'Search today, nothing tomorrow, 40 applications Sunday is not a system. This is.',
    }
  },

  'jh-m4-challenge': (v) => ({
    headline: `Your complete AI Job Search Engine for ${val(v, 'role', 'your target role')}.`,
    sections: [
      { label: 'Search strategy', text: 'Three title variants, a real salary band, and the keywords pulled from live postings.' },
      { label: 'Target job boards', text: 'Two boards, five company career pages, one alert. Checked on a schedule.' },
      { label: 'AI job tracker', text: 'Company, role, recruiter, date, resume version, referral, stage, follow-up date, notes.' },
      { label: 'Weekly pipeline', items: ['Mon research', 'Tue tailor', 'Wed apply', 'Thu network', 'Fri prep', 'Weekend review'] },
      { label: 'Match score workflow', text: 'Score before you apply. Under 60 — fix the resume or skip the role. Don’t spend an hour on a 40% match.' },
      { label: 'Follow-up system', text: 'Follow-up date set at submission. Two messages maximum, each one adding something.' },
      { label: '30-day application plan', text: 'Practice applications first, strong matches second, dream companies once your answers are sharp.' },
    ],
    note: 'You now have a repeatable engine instead of a random application process.',
  }),

  // ═══════════════════════ MODULE 5 · Interview OS ═════════════════════════
  'jh-m5-plan': (v) => {
    const type = val(v, 'type', 'HR Screening')
    const map = {
      'HR Screening': { focus: '20 minutes, mostly logistics and a sanity check on your story.', qs: ['Tell me about yourself', 'Why this role?', 'Salary expectations?', 'Notice period?'], prep: 'Nail your 60-second intro and know your number. That’s 90% of it.' },
      'Hiring Manager': { focus: 'Can you do the job, and will they enjoy working with you?', qs: ['Walk me through a project you owned', 'Tell me about a time you failed', 'How would you approach [their problem]?'], prep: 'Three STAR stories that flex to any question. Know their team’s actual problem.' },
      'Technical Interview': { focus: 'Depth. They’re probing for the edge of what you know.', qs: ['Role-specific problems', 'How would you debug/diagnose X?', 'Design something under constraints'], prep: 'Practise out loud. Saying “I don’t know, here’s how I’d find out” is a strong answer.' },
      'Panel Interview': { focus: 'Consistency across four people with different agendas.', qs: ['Same story, asked four ways', 'Cross-functional conflict', 'Stakeholder management'], prep: 'One coherent story. Panels compare notes — contradictions surface fast.' },
      'Final Interview': { focus: 'Risk. They mostly want you; they’re checking for reasons not to.', qs: ['Why us, specifically?', 'What are you looking for next?', 'Any concerns about the role?'], prep: 'Be enthusiastic and specific. This is where offers are won or quietly lost.' },
    }
    const m = map[type] || map['HR Screening']
    return {
      headline: `Your ${type} roadmap.`,
      sections: [
        { label: 'What this stage is really testing', text: m.focus },
        { label: 'Most likely questions', items: m.qs },
        { label: 'Preparation checklist', text: m.prep },
        { label: 'Practice schedule', items: [
          'Day 1 — write your stories down',
          'Day 2 — say them out loud, time them',
          'Day 3 — mock interview (Lesson 5.4)',
          'Day before — read your notes once, then stop',
        ]},
      ],
      note: 'Interviews aren’t tests. They’re conversations. The goal isn’t perfection — it’s confidence and clarity.',
    }
  },

  'jh-m5-star': (v) => {
    const answer = val(v, 'answer', '')
    const question = val(v, 'question', 'Tell me about a time when…')
    const a = analyzeResume(answer)
    if (a.empty) return null
    const parts = starParts(answer)
    const score = starScore(answer)
    const missing = Object.entries(parts).filter(([, hit]) => !hit).map(([k]) => k)
    return {
      headline: missing.length
        ? `Your answer is missing the ${missing.join(' and ')} ${missing.length > 1 ? 'beats' : 'beat'}. That’s why it doesn’t land.`
        : 'All four STAR beats are there. Now it’s about tightening.',
      scores: [
        { label: 'STAR completeness', value: score, note: missing.length ? `Missing: ${missing.join(', ')}.` : 'Situation, Task, Action, Result — all present.' },
        { label: 'Impact', value: impactScore(a), note: a.hasMetric ? 'You ended on a number. That’s the whole point of the R.' : 'No result metric — the story has no ending.' },
        { label: 'Confidence', value: confidenceScore(a), note: a.fillers.length ? `Filler words: ${a.fillers.join(', ')}. Cut them.` : 'Clean delivery.' },
      ],
      sections: [
        { label: `Question: ${question}`, text: 'Companies want evidence, not opinions. “I’m a good leader” proves nothing. A story with a number proves it for you.' },
        { label: 'Beginner version', text: `Situation: [when and where]. Task: [what you had to do]. Action: [what you actually did — “I”, not “we”]. Result: [the number].` },
        { label: 'Professional version', text: `Open with the stakes, not the setup. “Our deadline moved forward two weeks” beats “So, at my last company…”. Then task, action, result — 90 seconds total.` },
        { label: 'Executive version', text: `Lead with the result, then explain how. “We launched on time and grew registrations 28% — here's what had to change.” Senior interviewers want the outcome first.` },
        ...(missing.length ? [{ label: 'Fix this first', text: `Add the ${missing[0]} beat. ${missing.includes('result') ? 'Especially the result — a story without an outcome is just an anecdote.' : ''}` }] : []),
      ],
      note: 'Don’t memorise answers. Memorise your stories — the same experience can answer a dozen different questions.',
    }
  },

  'jh-m5-intro': (v) => {
    const role = val(v, 'role', 'Marketing Specialist')
    const years = val(v, 'years', 'three')
    const target = val(v, 'target', 'a senior role')
    return {
      headline: 'The most common question — and the one most people answer badly.',
      sections: [
        { label: 'Byte’s formula', text: 'Present → Past → Future. Not your life story, not your CV read aloud.' },
        { label: '30-second answer', text: `I’m currently a ${role}. Over the last ${years} years I’ve focused on [the thing this job needs], most recently [one concrete result]. I’m looking for ${decap(target)} where I can do more of that.` },
        { label: '60-second answer', text: `I’m currently a ${role}, where I own [specific area].\n\nBefore that I spent ${years} years learning [the foundation] — the thing that stuck was [one insight that makes you good at this].\n\nThe result I’m proudest of is [number].\n\nNow I’m looking for ${decap(target)} — which is why this role caught my eye specifically.` },
        { label: 'Executive version', text: `${years} years in [field], currently ${decap(role)}. I focus on [the outcome you own]. I’m interested in ${decap(target)} because [reason tied to their problem, not your ambition].` },
        { label: 'The mistake', text: 'Starting at university. They asked what you do now. Answer that, then earn the right to explain how you got here.' },
      ],
      note: 'End on why you’re in this room. That’s the sentence that makes the next question easier.',
    }
  },

  'jh-m5-mock': (v) => {
    const answer = val(v, 'answer', '')
    const style = val(v, 'style', 'Friendly Recruiter')
    const a = analyzeResume(answer)
    if (a.empty) return null
    const parts = starParts(answer)
    const structure = starScore(answer)
    const clarity = readabilityScore(a)
    const conf = confidenceScore(a)
    const overall = clamp((structure + clarity + conf + impactScore(a)) / 4)
    const styleNote = {
      'Friendly Recruiter': 'I’d have let that slide — but a tougher interviewer wouldn’t.',
      'Tough Recruiter': 'I’m going to push on the vaguest part of that answer. Be ready.',
      'Hiring Manager': 'I’m listening for whether you actually did this, or watched someone do it.',
      'Technical Manager': 'I want the specifics: the tools, the trade-offs, the thing that broke.',
      'Executive Panel': 'Give me the outcome first. I’ll ask for the detail if I want it.',
    }
    return {
      headline: `${style}: ${overall >= 75 ? 'Strong answer. I’d move you forward.' : overall >= 55 ? 'Decent. It wouldn’t lose you the round, but it wouldn’t win it.' : 'That answer would cost you this interview.'}`,
      scores: [
        { label: 'Confidence', value: conf, note: a.fillers.length ? `Filler words heard: ${a.fillers.join(', ')}.` : 'No hedging. Good.' },
        { label: 'Clarity', value: clarity, note: a.words > 220 ? 'Too long — I stopped listening around the halfway mark.' : a.words < 30 ? 'Too short. I don’t have enough to evaluate.' : 'Good length.' },
        { label: 'Structure', value: structure, note: parts.result ? 'You landed the result.' : 'No clear result — the story just stops.' },
        { label: 'Relevance', value: clamp(clarity - 5), note: 'Answer the question they asked, not the one you prepared.' },
        { label: 'Examples', value: impactScore(a), note: a.hasMetric ? 'Specific and evidenced.' : 'Generic. Give me a number.' },
        { label: 'Communication', value: overall, note: resumeNote(overall) },
      ],
      sections: [
        { label: 'Before the next question', text: styleNote[style] || styleNote['Friendly Recruiter'] },
        { label: 'Improve this', items: [
          ...(a.fillers.length ? [`Cut the fillers: ${a.fillers.join(', ')} — pause instead. Silence reads as confidence.`] : []),
          ...(!parts.result ? ['End on a result. Every answer, every time.'] : []),
          ...(!a.hasMetric ? ['Add one number. It converts a claim into evidence.'] : []),
          ...(a.words > 220 ? ['Halve it. 90 seconds is the ceiling.'] : []),
          ...(a.firstPersonHeavy ? ['You said “I” a lot — good for ownership, but vary the sentence openings.'] : []),
          ...(overall >= 75 ? ['Honestly: run this one back as-is. It works.'] : []),
        ]},
      ],
      note: 'Practice is where confidence comes from. Run it again — the score moves faster than you expect.',
    }
  },

  'jh-m5-technical': (v) => {
    const role = val(v, 'role', 'Product Manager')
    return {
      headline: `A realistic technical interview for ${role}.`,
      sections: [
        { label: 'Beginner questions', items: [
          `Walk me through the tools you use daily as a ${role}`,
          'Explain [core concept of the role] to a non-expert',
          'What does good look like in this job?',
        ]},
        { label: 'Intermediate questions', items: [
          `Talk me through a ${role} project end to end — what broke?`,
          'How do you decide what to prioritise when everything is urgent?',
          'What metric would you use, and why that one?',
        ]},
        { label: 'Advanced questions', items: [
          'Design an approach for [an ambiguous problem] with limited data',
          'Where would this go wrong at ten times the scale?',
          'Argue against your own recommendation.',
        ]},
        { label: 'How to answer any of them', text: 'Think out loud. They’re assessing your reasoning, not testing recall. “I don’t know — here’s how I’d find out” is a genuinely strong answer. Silence is not.' },
      ],
      note: 'Every role is different, but the shape is the same: reasoning beats recall.',
    }
  },

  'jh-m5-questions': (v) => {
    const type = val(v, 'type', 'Startup')
    const map = {
      Startup: ['What does the first 90 days look like?', 'What’s the runway situation?', 'Who was the last person in this seat, and what happened?', 'What breaks if this hire doesn’t work?'],
      Corporate: ['How is success measured in the first year?', 'What does progression look like from here?', 'How do decisions actually get made?', 'Which teams would I depend on most?'],
      Nonprofit: ['How is impact measured?', 'Where does funding come from and how stable is it?', 'What does the team struggle with most?', 'How do you avoid burnout here?'],
      Government: ['What does the approval process look like?', 'How long do projects typically run?', 'What’s the biggest constraint on this team?', 'How is performance reviewed?'],
    }
    return {
      headline: `Ten questions for a ${type.toLowerCase()} interview.`,
      sections: [
        { label: 'Sharp ones for this context', items: map[type] || map.Startup },
        { label: 'Always worth asking', items: [
          'What does success look like in this role at 90 days?',
          'What’s the hardest part of this job that isn’t in the description?',
          'What would you change about the team if you could?',
          'How would you describe your management style?',
          'Is there anything about my background that gives you pause?',
        ]},
        { label: 'The last one matters most', text: '“Anything that gives you pause?” lets you handle an objection while you’re still in the room. Almost nobody asks it. It works.' },
        { label: 'Never ask', text: 'Anything answered on their homepage. It signals you didn’t look.' },
      ],
      note: 'Interviews go both ways. Strong candidates ask questions that only make sense if they were listening.',
    }
  },

  'jh-m5-salary': (v) => {
    const expected = money(val(v, 'expected', '0'))
    const loc = val(v, 'location', 'your market')
    return {
      headline: expected ? `Negotiation plan for a ${usd(expected)} target in ${loc}.` : `Negotiation plan for ${loc}.`,
      sections: [
        { label: 'Research first', items: [
          `Levels.fyi and Glassdoor for ${loc}`,
          'Real postings that publish bands — the honest source',
          'Ask two people in the role, not on the internet',
        ]},
        ...(expected ? [{ label: 'Your range', text: `Target: ${usd(expected)} · Ask: ${usd(expected * 1.12)} (you must leave room to be negotiated down) · Walk away below: ${usd(expected * 0.88)}. Decide the walk-away number NOW, while you’re calm.` }] : []),
        { label: 'The script', text: 'Instead of “Can I get more?” say: “Thank you for the offer — I’m genuinely excited about the role. Based on my experience and current market research for this role in ' + loc + ', I was hoping we could discuss a package closer to [number].”' },
        { label: 'Why that works', items: [
          'It opens with gratitude, not conflict',
          'It anchors on market data, not your rent',
          'It gives one specific number',
          'It invites collaboration instead of a yes/no',
        ]},
        { label: 'Benefits to evaluate', items: ['Bonus', 'Equity', 'Retirement match', 'Health insurance', 'PTO', 'Learning budget', 'Remote flexibility'] },
      ],
      note: 'Many candidates negotiate emotionally. Professionals negotiate with preparation — the script is just the last 5%.',
    }
  },

  'jh-m5-challenge': (v) => ({
    headline: `Your complete Interview OS for ${val(v, 'role', 'your target role')}.`,
    sections: [
      { label: 'Personal introduction', text: 'Present → Past → Future. 30s and 60s versions, both said out loud until they’re boring.' },
      { label: 'STAR answer library', text: 'Six stories — leadership, conflict, failure, deadline, teamwork, impact. Each one ends on a number.' },
      { label: 'AI mock interview score', text: 'Run Lesson 5.4 until confidence and structure both clear 75.' },
      { label: 'Technical prep', text: 'Beginner → intermediate → advanced. Think out loud; reasoning beats recall.' },
      { label: 'Questions for the interviewer', text: 'Five, including “is there anything about my background that gives you pause?”' },
      { label: 'Salary negotiation plan', text: 'Target, ask, and walk-away number — decided before the call, not during it.' },
      { label: 'Final interview playbook', text: 'One page: your stories, your numbers, your questions, your range. Read it once before you walk in, then put it away.' },
    ],
    note: 'You now know how to communicate your experience with confidence — from the first recruiter call to the final offer.',
  }),

  // ═══════════════════════ MODULE 6 · Networking OS ════════════════════════
  'jh-m6-style': (v) => {
    const level = val(v, 'level', 'Never done it')
    const map = {
      'Never done it': { weak: 'You’ve never tried, so it feels enormous. It isn’t.', opp: 'The lowest bar in the world: send one message this week. One.', road: ['Week 1 — message one alumnus', 'Week 2 — comment on five posts', 'Week 3 — one coffee chat', 'Week 4 — one referral request'] },
      Sometimes: { weak: 'Inconsistency. You network when you need something, which is exactly when it works worst.', opp: 'Make it a weekly habit, not an emergency response.', road: ['Week 1 — reconnect with three dormant contacts', 'Week 2 — five new connections', 'Week 3 — two coffee chats', 'Week 4 — one referral request'] },
      'Fairly comfortable': { weak: 'You’re comfortable but probably not systematic — no tracking, no follow-up.', opp: 'Add a CRM and a follow-up cadence. You’re leaving relationships to decay.', road: ['Week 1 — build your networking tracker', 'Week 2 — reconnect with ten contacts', 'Week 3 — three coffee chats', 'Week 4 — two referral requests'] },
      'Very comfortable': { weak: 'Likely nothing — except converting relationships into referrals.', opp: 'Ask directly. Comfortable networkers often never make the ask.', road: ['Week 1 — list who could refer you', 'Week 2 — make three specific asks', 'Week 3 — coffee chats at target companies', 'Week 4 — help someone else, unprompted'] },
    }
    const m = map[level] || map['Never done it']
    return {
      headline: 'Here’s your networking profile.',
      sections: [
        { label: 'Biggest weakness', text: m.weak },
        { label: 'Biggest opportunity', text: m.opp },
        { label: 'Your 30-day roadmap', items: m.road },
        { label: 'The reframe', text: 'Networking isn’t asking people for jobs. It’s building professional relationships before you need them. The strongest candidates get referrals because they built trust — not because they sent the most applications.' },
      ],
      note: 'You’re not asking for a favour. You’re starting a conversation.',
    }
  },

  'jh-m6-map': (v) => {
    const company = val(v, 'company', 'your dream company')
    return {
      headline: `Your networking map for ${company}.`,
      sections: [
        { label: 'Contact in this order', items: [
          `1 · Alumni at ${company} — the warmest possible intro`,
          '2 · Former coworkers who moved there',
          `3 · Employees on the actual team you'd join`,
          '4 · The recruiter for the role',
          '5 · The hiring manager — last, and only with something specific to say',
        ]},
        { label: 'Why that order', text: 'Warmth decays as you go down the list. Start where you have a reason to be talking, and let each conversation earn the next introduction.' },
        { label: 'Best message strategy', text: `Lead with something true and specific about ${company} — a product decision, a post they wrote, a change you noticed. Generic messages get ignored because they deserve to be.` },
        { label: 'How many', text: 'Three to five people per company. Not thirty. This is depth, not a mail merge.' },
      ],
      note: 'Don’t message everyone. Message the right people, in the right order.',
    }
  },

  'jh-m6-outreach': (v) => {
    const type = val(v, 'type', 'Connection Request')
    const company = val(v, 'company', '[Company]')
    const map = {
      'Connection Request': `Hi [Name] — I came across your profile while researching the team at ${company}. I’m working toward ${val(v, 'target', '[target role]')} and your path there caught my eye. Would love to connect.`,
      'Recruiter Outreach': `Hi [Name] — I saw you’re hiring for [Role] at ${company}. I’ve spent the last ${val(v, 'years', '[X]')} years doing [the exact thing the role needs], most recently [one concrete result]. Happy to send a short summary if useful.`,
      'Employee Outreach': `Hi [Name] — I’m researching the team at ${company} and noticed you’ve been there a while. I’m considering applying for [Role]. Would you be open to telling me what the team is actually like day to day? Ten minutes would be plenty.`,
      'Alumni Outreach': `Hi [Name] — fellow [University] grad here. I noticed you’re at ${company} now. I’m moving toward ${val(v, 'target', '[target role]')} and would love 15 minutes on how you made that jump. Happy to work around your schedule.`,
      'Hiring Manager Introduction': `Hi [Name] — I’m applying for [Role] on your team at ${company}. I noticed [something specific and true about their work]. I’ve worked on [closest relevant thing] and I’d welcome the chance to hear what a strong first 90 days looks like to you.`,
    }
    return {
      headline: `Your ${type.toLowerCase()} — specific enough to earn a reply.`,
      sections: [
        { label: 'Your message', text: map[type] || map['Connection Request'] },
        { label: 'Why generic messages fail', text: 'Because “Hi, can you get me a job?” asks a stranger to spend their reputation on someone they’ve never met. There’s no version of that which works.' },
        { label: 'The four rules', items: [
          'Say something only true of THEM',
          'Explain why you, briefly, with evidence',
          'Make one small ask',
          'Keep it phone-answerable — under 100 words',
        ]},
      ],
      note: 'Most networking messages fail because they’re generic. Specific is the entire trick.',
    }
  },

  'jh-m6-referral': (v) => {
    const rel = val(v, 'relationship', 'Alumni')
    const map = {
      Friend: 'Hey [Name] — I’m applying for [Role] at [Company] and saw you know people there. No pressure at all, but if you’re comfortable referring me I’d really appreciate it. I’ve attached my resume and a two-line summary so it’s zero effort for you.',
      Alumni: 'Hi [Name] — thanks for the chat last week, it genuinely helped. I’ve applied for [Role] at [Company]. If you feel comfortable referring me I’d be grateful — and completely understand if not. I’ve attached my resume and the job link to make it easy either way.',
      Recruiter: 'Hi [Name] — following up on our conversation. I’ve formally applied for [Role]. If there’s anything else useful for the file, happy to send it over.',
      'Former Coworker': 'Hi [Name] — hope things are good at [Company]! I’m applying for [Role] there. You saw my work on [specific project] first-hand — would you be comfortable referring me? Resume attached, and no worries at all if it’s awkward.',
      'Hiring Manager': 'Hi [Name] — I’ve applied for [Role]. Given our conversation about [specific topic], I wanted to flag it directly in case it’s useful.',
    }
    return {
      headline: `Asking ${rel === 'Friend' ? 'a friend' : `an ${rel.toLowerCase()}`} for a referral — without the cringe.`,
      sections: [
        { label: 'Your message', text: map[rel] || map.Alumni },
        { label: 'When to ask', text: 'After at least one real interaction. Never in the first message — that’s the thing that makes people dread networking messages.' },
        { label: 'What to include', items: [
          'The job link',
          'Your resume',
          'Two lines they can paste straight into the referral form',
          'An explicit “no is completely fine”',
        ]},
        { label: 'When NOT to ask', text: 'When you’ve never spoken. When they’ve just been laid off. When you’re not actually qualified. A referral spends their credibility — treat it that way.' },
      ],
      note: 'Referrals are earned, not demanded. Make it zero effort for them and the yes gets easy.',
    }
  },

  'jh-m6-followup': (v) => ({
    headline: 'A follow-up sequence that builds a conversation instead of nagging.',
    sections: [
      { label: 'First follow-up — day 5–7', text: 'Hi [Name] — just floating this back up in case it got buried. No rush at all.' },
      { label: 'Second follow-up — day 14', text: 'Hi [Name] — saw [relevant article/news about their company] and thought of our conversation. Still keen to chat if you have 15 minutes.' },
      { label: 'Thank-you message', text: 'Thanks for the time today — the point about [specific thing they said] was genuinely useful. I’ll [the thing you said you’d do].' },
      { label: 'Check-in — every 8–12 weeks', text: 'Hi [Name] — hope [specific thing] went well. Quick update from me: [one line]. No ask, just staying in touch.' },
      { label: 'Reconnection — after 6+ months', text: 'Hi [Name] — it’s been a while! I’m now [update]. Saw you’ve moved to [thing] — congratulations. Would love to catch up.' },
      { label: 'The rule', text: 'Two follow-ups on any single ask. Then stop. But keep the relationship — a check-in every couple of months costs nothing and is why people remember you.' },
    ],
    note: 'Most people send one message. Professionals build conversations — and never send the third chase.',
  }),

  'jh-m6-brand': (v) => {
    const topic = val(v, 'topic', 'your field')
    return {
      headline: `Being remembered for ${topic}.`,
      sections: [
        { label: 'Weekly plan', items: [
          'Monday — comment on three posts',
          'Tuesday — share an insight',
          'Wednesday — connect with three people',
          'Thursday — post something valuable',
          'Friday — follow up',
        ]},
        { label: 'What to post', text: `The thing you learned this week about ${topic}, written plainly. Not thought leadership — just the specific thing that took you time to figure out. That’s what people save.` },
        { label: 'Why commenting first', text: 'Your comment on a large account reaches more relevant people than your own post will for months. Borrow the audience while you build one.' },
        { label: 'The goal', text: 'People hire people they remember. Being consistently useful about one topic is how you get remembered.' },
      ],
      note: 'You don’t need to be an influencer. You need three people to think of you when your topic comes up.',
    }
  },

  'jh-m6-crm': () => ({
    headline: 'Your networking CRM — because you will not remember.',
    sections: [
      { label: 'Track', items: [
        'Name', 'Company', 'Role', 'Where you met',
        'Last interaction', 'Follow-up date', 'Referral status', 'Notes',
      ]},
      { label: 'The field that matters most', text: 'Notes. “Has two kids, moved from Berlin, hates standups” is what turns a contact into a relationship six months later.' },
      { label: 'Follow-up date', text: 'Every contact gets one. Without it, relationships decay silently and you only notice when you need them.' },
      { label: 'Review it monthly', text: '15 minutes. Who haven’t you spoken to in 90 days? Send one line. That’s the whole system.' },
    ],
    note: 'Networking is easier when you remember people. Nobody remembers 200 people. Write it down.',
  }),

  'jh-m6-challenge': (v) => ({
    headline: `Your complete Networking OS for ${val(v, 'company', 'your target companies')}.`,
    sections: [
      { label: 'Networking strategy', text: 'Depth over volume: 3–5 real contacts per target company, not 30 cold adds.' },
      { label: 'Dream company map', text: 'Alumni → former coworkers → team employees → recruiter → hiring manager. In that order.' },
      { label: 'Outreach templates', items: ['Connection request', 'Recruiter outreach', 'Employee outreach', 'Alumni outreach', 'Hiring manager intro'] },
      { label: 'Referral strategy', text: 'Never in the first message. Always with the link, the resume, and two paste-ready lines.' },
      { label: 'Follow-up workflow', text: 'Two follow-ups per ask. Check-in every 8–12 weeks forever.' },
      { label: 'Personal branding plan', text: 'Comment daily, post weekly, about one topic.' },
      { label: 'Networking CRM', text: 'Name, company, role, where you met, last interaction, follow-up date, referral status, notes.' },
      { label: '30-day networking calendar', text: 'Week 1 reconnect · Week 2 new connections · Week 3 coffee chats · Week 4 referral asks.' },
    ],
    note: 'You’re no longer relying only on job boards. You’ve built a system that brings opportunities to you.',
  }),

  // ═══════════════════════ MODULE 7 · Offer OS ═════════════════════════════
  'jh-m7-priorities': (v) => {
    const priorities = val(v, 'priorities', 'Career Growth')
    return {
      headline: `Your decision framework — weighted for ${priorities}.`,
      sections: [
        { label: 'What you said matters most', text: priorities },
        { label: 'Score every offer on these', items: [
          'Salary', 'Bonus', 'Benefits', 'PTO', 'Retirement',
          'Growth opportunities', 'Learning budget', 'Team culture',
          'Remote flexibility', 'Career progression',
        ]},
        { label: 'How to weight them', text: `Give your stated priorities double weight and everything else single. If ${decap(priorities)} genuinely matters most, an offer that wins on salary but loses there should lose overall. That’s the point of deciding now — before a big number clouds it.` },
        { label: 'Decide before the offer lands', text: 'Write your priorities down today. Once someone says a number out loud, your priorities quietly rearrange themselves to justify saying yes.' },
      ],
      note: 'A job offer isn’t about salary. It’s about your career. Accepting too fast can cost you thousands — or two unhappy years.',
    }
  },

  'jh-m7-compare': (v) => {
    const aBase = money(val(v, 'aSalary', '0'))
    const bBase = money(val(v, 'bSalary', '0'))
    if (!aBase || !bBase) return null
    const aBonus = aBase * (parseFloat(val(v, 'aBonus', '0')) || 0) / 100
    const bBonus = bBase * (parseFloat(val(v, 'bBonus', '0')) || 0) / 100
    const aExtra = money(val(v, 'aExtra', '0'))
    const bExtra = money(val(v, 'bExtra', '0'))
    const aTotal = aBase + aBonus + aExtra
    const bTotal = bBase + bBonus + bExtra
    const winner = aTotal === bTotal ? null : aTotal > bTotal ? 'A' : 'B'
    const gap = Math.abs(aTotal - bTotal)
    const baseWinner = aBase > bBase ? 'A' : bBase > aBase ? 'B' : null
    const flipped = winner && baseWinner && winner !== baseWinner
    return {
      headline: winner
        ? `Offer ${winner} is worth ${usd(gap)} more per year${flipped ? ' — even though it has the lower base salary.' : '.'}`
        : 'They’re worth the same. Now it’s entirely about the non-financial stuff.',
      scores: [
        { label: `Offer A — ${usd(aTotal)}`, value: clamp((aTotal / Math.max(aTotal, bTotal)) * 100), note: `Base ${usd(aBase)} + bonus ${usd(aBonus)} + extras ${usd(aExtra)}` },
        { label: `Offer B — ${usd(bTotal)}`, value: clamp((bTotal / Math.max(aTotal, bTotal)) * 100), note: `Base ${usd(bBase)} + bonus ${usd(bBonus)} + extras ${usd(bExtra)}` },
      ],
      sections: [
        ...(flipped ? [{ label: 'This is the whole lesson', text: `Offer ${baseWinner} has the bigger salary. Offer ${winner} is worth more money. Base salary is the number people compare because it's the easy one — it's not the one that pays you.` }] : []),
        { label: 'What you haven’t counted yet', items: [
          'Retirement match — free money, often 3–6% of base',
          'Health insurance — a bad plan can cost thousands a year',
          'PTO — ten extra days is ~4% of your salary in time',
          'Equity — real, but not spendable; discount it heavily',
          'Learning budget and home office — small but real',
          'Commute — cost AND hours of your life',
        ]},
        { label: 'The honest caveat', text: `${usd(gap)} a year is real, but it’s roughly ${((gap / Math.max(aTotal, bTotal)) * 100).toFixed(1)}% of the package. A bad manager costs more than that in one year of your career.` },
      ],
      note: 'Salary isn’t everything. Offer B could be worth more — that’s exactly why you calculate instead of guessing.',
    }
  },

  'jh-m7-negotiate': (v) => {
    const offered = money(val(v, 'offered', '0'))
    const desired = money(val(v, 'desired', '0'))
    const role = val(v, 'role', 'the role')
    const loc = val(v, 'location', 'your market')
    if (!offered) return null
    const gap = desired - offered
    const pct = offered ? (gap / offered) * 100 : 0
    const realistic = pct <= 20
    return {
      headline: desired
        ? `You’re asking for ${usd(gap)} more — ${pct.toFixed(0)}% above the offer. ${realistic ? 'That’s a normal, winnable ask.' : 'That’s a big jump; you’ll need strong evidence.'}`
        : `Negotiating a ${usd(offered)} offer.`,
      sections: [
        { label: 'Byte’s formula', text: 'Gratitude → Excitement → Market research → Desired range → Collaboration.' },
        { label: 'Your script', text: `Thank you for the offer — I’m genuinely excited about ${role} and the team.\n\nBased on my experience and current market research for this role in ${loc}, I was hoping we could discuss a compensation package closer to ${desired ? usd(desired) : '[your number]'}.\n\nIs there flexibility there?` },
        { label: 'Why it works', items: [
          'Gratitude first — this is a conversation, not a confrontation',
          'Excitement — removes the fear you’re about to walk',
          'Market research — makes it about data, not your feelings',
          'One number — vague asks get vague answers',
          'A question at the end — invites collaboration, not a yes/no',
        ]},
        ...(!realistic ? [{ label: 'Be realistic', text: `A ${pct.toFixed(0)}% jump is unusual without a competing offer or a scope change. Either bring evidence (a rival offer, market data, extra responsibilities) or aim closer to ${usd(offered * 1.15)}.` }] : []),
        { label: 'If they say no', text: 'Negotiate the rest: signing bonus, extra PTO, learning budget, an early review date, title. Base is the least flexible number in the package.' },
        { label: 'The bit nobody tells you', text: 'Almost nobody has their offer withdrawn for negotiating once, politely. The downside is far smaller than people fear; the upside compounds for your whole career.' },
      ],
      note: 'Negotiation isn’t confrontation. It’s a professional conversation about a number.',
    }
  },

  'jh-m7-scorecard': (v) => ({
    headline: 'Score every offer on the things that will actually matter in a year.',
    sections: [
      { label: 'Score each 1–10', items: [
        'Compensation', 'Career growth', 'Learning', 'Manager', 'Team',
        'Stability', 'Work-life balance', 'Commute', 'Flexibility', 'Long-term value',
      ]},
      { label: 'Weight them', text: `Your stated priorities (${val(v, 'priorities', 'growth and balance')}) get double weight. Everything else counts once.` },
      { label: 'The one people under-weight', text: 'Manager. It predicts your day-to-day happiness better than salary, title, or company logo — and it’s the hardest to fix later.' },
      { label: 'The one people over-weight', text: 'Company brand. The logo helps for one job hop. Your manager shapes two years of your life.' },
      { label: 'If it’s close', text: 'When two offers are within ~5%, stop optimising. Pick the manager you’d rather learn from.' },
    ],
    note: 'Sometimes the highest salary isn’t the best choice. Score it before the number seduces you.',
  }),

  'jh-m7-redflags': (v) => {
    const desc = val(v, 'offer', '')
    if (!desc.trim()) return null
    const lower = desc.toLowerCase()
    const hits = [
      { k: /fast[- ]paced|wear many hats|hustle|rockstar|ninja/, f: '“Fast-paced” / “wear many hats” — often means under-resourced. Ask how many people have held this role in two years.' },
      { k: /family|like a family/, f: '“We’re like a family” — families don’t make you redundant. Ask about their layoff history.' },
      { k: /urgent|asap|immediately|start next week/, f: 'Unusual urgency — ask why the seat is empty and what happened to the last person.' },
      { k: /unlimited pto|unlimited vacation/, f: '“Unlimited PTO” — ask what the average taken actually was last year. Often it’s lower than a fixed allowance.' },
      { k: /equity|options|stock/, f: 'Equity mentioned — ask strike price, total shares outstanding, and the last valuation. Without those three numbers it’s not a number.' },
      { k: /no formal|figure it out|self[- ]start|autonom/, f: 'Vague structure — could mean freedom, could mean no support. Ask who you’d go to when stuck.' },
    ].filter((h) => h.k.test(lower)).map((h) => h.f)
    const risk = hits.length >= 3 ? 'High' : hits.length >= 1 ? 'Medium' : 'Low'
    return {
      headline: hits.length
        ? `${hits.length} thing${hits.length > 1 ? 's' : ''} in that description I'd want answered before signing.`
        : 'Nothing in the wording jumps out. Ask the questions below anyway.',
      scores: [
        { label: 'Risk level', value: risk === 'High' ? 78 : risk === 'Medium' ? 45 : 18, note: `${risk} — based on the language used in the offer/role description.` },
      ],
      sections: [
        ...(hits.length ? [{ label: 'Concerns', items: hits }] : []),
        { label: 'The eight red flags', items: [
          'Unrealistic expectations', 'High employee turnover', 'Poor interview experience',
          'Extremely vague responsibilities', 'Unrealistic deadlines', 'Toxic culture indicators',
          'No growth opportunities', 'Poor communication',
        ]},
        { label: 'Questions to ask before accepting', items: [
          'Why is this role open?',
          'How long did the last person stay, and where did they go?',
          'What does success look like at 90 days?',
          'Can I speak to someone who’d be my peer?',
        ]},
        { label: 'The strongest signal', text: 'How they treated you during interviewing. It is the best behaviour they will ever show you. If it was disorganised or rude now, that’s the ceiling.' },
      ],
      note: 'Not every offer is a good offer. The excitement of a yes is exactly when you’re least able to see it.',
    }
  },

  'jh-m7-response': (v) => {
    const type = val(v, 'type', 'Offer Acceptance')
    const map = {
      'Offer Acceptance': 'Hi [Name] — delighted to accept the offer for [Role]. Thank you for a genuinely thoughtful process. To confirm my understanding: [salary], starting [date], reporting to [manager]. Please let me know what you need from me next — looking forward to it.',
      'Offer Decline': 'Hi [Name] — thank you for the offer, and for the time your team invested. After careful thought I’ve decided to accept another opportunity that’s a closer fit for my goals right now. It was a genuine pleasure meeting the team, and I hope our paths cross again.',
      'Request More Time': 'Hi [Name] — thank you for the offer, I’m genuinely excited. As this is an important decision I’d like a little time to consider it properly. Would [date, ~1 week] work for a decision? Happy to answer anything in the meantime.',
      'Counteroffer Response': 'Hi [Name] — thank you again for the offer. I’m enthusiastic about the role. Based on my experience and market research, I was hoping we could discuss a package closer to [number]. Is there any flexibility?',
      'Withdrawal Message': 'Hi [Name] — thank you for your time throughout the process. I’m withdrawing my application, as my circumstances have changed. I appreciate the conversations and wish the team well.',
    }
    return {
      headline: `Your ${type.toLowerCase()} message.`,
      sections: [
        { label: 'The message', text: map[type] || map['Offer Acceptance'] },
        { label: 'Why the details matter', text: type === 'Offer Acceptance'
          ? 'Restating salary, start date and manager in writing prevents the most common and most painful misunderstanding in hiring.'
          : 'Your reputation outlives this decision. The recruiter you decline politely today is the one hiring for your dream role in three years.' },
        { label: 'Never', items: ['Ghost. Ever.', 'Decline by silence', 'Burn the bridge on the way out', 'Accept verbally before you have it in writing'] },
      ],
      note: 'Whether you say yes or no, your reputation matters. The industry is smaller than it looks.',
    }
  },

  'jh-m7-ninety': (v) => {
    const role = val(v, 'role', 'your new role')
    return {
      headline: `Your first 90 days as ${decap(role)}.`,
      sections: [
        { label: 'Days 1–30 — Learn', items: [
          'Meet everyone; ask each what they wish someone would fix',
          'Understand the systems before proposing to change them',
          'Find the actual decision makers, not the org chart',
          'Ship one small, visible thing',
        ]},
        { label: 'Days 31–60 — Contribute', items: [
          'Take ownership of something real',
          'Fix the thing three people complained about',
          'Build the relationship with your manager’s peers',
        ]},
        { label: 'Days 61–90 — Deliver', items: [
          'Land one measurable result',
          'Write it down — this is your first performance review entry',
          'Plan the next quarter with your manager, explicitly',
        ]},
        { label: 'The mistake', text: 'Trying to change everything in week two. You have no credit yet. Spend the first month earning the right to have opinions.' },
      ],
      note: 'Landing the job isn’t the finish line. It’s day one.',
    }
  },

  'jh-m7-challenge': (v) => ({
    headline: `Your complete Offer OS.`,
    sections: [
      { label: 'Compensation comparison', text: 'Base + bonus + equity + retirement + insurance + PTO. Total value, not headline salary.' },
      { label: 'Negotiation script', text: 'Gratitude → excitement → market research → one number → “is there flexibility?”' },
      { label: 'Offer scorecard', text: 'Ten dimensions, your priorities double-weighted. Manager counts more than you think.' },
      { label: 'Risk assessment', text: 'Why is the role open? How long did the last person stay? What does 90 days look like?' },
      { label: 'Decision framework', text: `Written down before the offer arrived: ${val(v, 'priorities', 'your priorities')}.` },
      { label: 'Acceptance & decline emails', text: 'Both written in advance, both gracious. Confirm salary, start date and manager in writing.' },
      { label: '30/60/90-day plan', text: 'Learn → contribute → deliver. One measurable result by day 90.' },
    ],
    note: 'Don’t ask “how much can I get?” Ask “which opportunity gives me the strongest long-term growth?”',
  }),

  // ═══════════════════════ MODULE 8 · Career OS ════════════════════════════
  'jh-m8-roadmap': (v) => {
    const goal = val(v, 'goal', 'Promotion')
    const map = {
      Promotion: { path: 'Deliver → document → make it visible → ask explicitly. Most people do the first and skip the rest.', skills: ['The next level’s scope', 'Written communication', 'Influence without authority'], first: 'Ask your manager what specifically is missing. Then close exactly that.' },
      'Higher Salary': { path: 'The fastest route is usually a move, not a raise. But get the raise conversation on record first.', skills: ['Negotiation', 'Market awareness', 'A quantified track record'], first: 'Find out your market rate this week. You can’t negotiate a number you don’t know.' },
      Leadership: { path: 'Lead before the title. Own an outcome, then own a team.', skills: ['Coaching', 'Delegation', 'Hard conversations'], first: 'Volunteer to mentor someone. It’s the cheapest leadership evidence available.' },
      'Career Switch': { path: 'Bridge, don’t leap. Find the role that uses your old skills in the new industry.', skills: ['The new industry’s language', 'One credible project', 'A network in the target field'], first: 'Build one real project in the new field. It beats any certificate.' },
      Management: { path: 'Managing is a different job, not a promotion. Make sure you want it.', skills: ['1:1s', 'Performance conversations', 'Hiring'], first: 'Shadow a manager for a month before you commit to the path.' },
      Entrepreneurship: { path: 'Build while employed. Prove demand before you quit anything.', skills: ['Sales', 'Finance', 'Shipping fast'], first: 'Find one person willing to pay. That’s the only validation that counts.' },
      'Technical Expertise': { path: 'Depth compounds. Pick one thing and become the person people ask.', skills: ['One deep specialism', 'Teaching it', 'Staying current'], first: 'Write about what you know. Teaching exposes the gaps instantly.' },
    }
    const m = map[goal] || map.Promotion
    return {
      headline: `Your roadmap toward ${decap(goal)}.`,
      sections: [
        { label: 'Career path', text: m.path },
        { label: 'Skill roadmap', items: m.skills },
        { label: 'Milestones', items: ['90 days — one visible result', '6 months — one new skill, demonstrated', '12 months — the conversation, with evidence'] },
        { label: 'Your first move', text: m.first },
        { label: 'The growth loop', text: 'Learn → deliver results → build relationships → gain skills → document achievements → grow → repeat.' },
      ],
      note: 'The most successful professionals don’t wait until they’re unemployed to improve their career.',
    }
  },

  'jh-m8-achievements': () => ({
    headline: 'Your career journal — so you never rebuild your resume from memory again.',
    sections: [
      { label: 'Track, every Friday, in five minutes', items: [
        'Projects', 'KPIs moved', 'Wins', 'Certifications',
        'Awards', 'Client feedback', 'Promotions',
      ]},
      { label: 'The format that works', text: 'One line: what you did, the number, the date. “Cut onboarding time 40% — Mar 2026.” That line is a resume bullet, a review talking point, and an interview story simultaneously.' },
      { label: 'Why Friday', text: 'You will not remember in December what you shipped in March. Nobody does. Five minutes a week saves the two miserable days everyone spends rebuilding a resume under pressure.' },
      { label: 'The payoff', text: 'When it’s time to apply, your resume is already 90% written — and it’s accurate, because you wrote it while you remembered.' },
    ],
    note: 'Most people update their resume only after losing a job. That’s the worst possible time to try to remember your wins.',
  }),

  'jh-m8-learning': (v) => {
    const current = val(v, 'current', 'your current role')
    const dream = val(v, 'dream', 'your dream role')
    const timeline = val(v, 'timeline', '12 months')
    return {
      headline: `${current} → ${dream}, over ${timeline}.`,
      sections: [
        { label: 'Skill gap', text: `Take three real ${dream} postings. Everything they require that you can't evidence is your gap. That's your curriculum — not a course catalogue.` },
        { label: 'What to learn first', text: 'The skill that appears in every posting AND that you lack. There’s usually only one or two. Ignore everything else until those are closed.' },
        { label: 'Certifications', text: `Only ones that appear in real ${dream} postings. A certification nobody asks for is a hobby with a receipt.` },
        { label: 'Weekly learning plan', items: [
          '3 hours — the one skill that closes your gap',
          '1 hour — build something small with it',
          '30 minutes — write down what you learned',
        ]},
        { label: 'The honest bit', text: 'A project beats a certificate. Certificates prove you attended; projects prove you can do it. Employers can tell the difference.' },
      ],
      note: 'Instead of wondering what to learn next, work backwards from the job you want.',
    }
  },

  'jh-m8-promotion': (v) => {
    const evidence = analyzeResume(val(v, 'evidence', ''))
    if (evidence.empty) return null
    const readiness = clamp((impactScore(evidence) + confidenceScore(evidence)) / 2)
    return {
      headline: evidence.hasMetric
        ? `Promotion readiness: ${readiness}%. You have evidence — now make it visible.`
        : `Promotion readiness: ${readiness}%. The work may be there; the evidence isn’t.`,
      scores: [
        { label: 'Evidence strength', value: impactScore(evidence), note: evidence.hasMetric ? 'You can point at numbers. That’s what a promotion case is.' : 'No numbers = no case. “I worked hard” is not evidence.' },
        { label: 'Promotion readiness', value: readiness, note: readiness >= 70 ? 'Have the conversation.' : 'Close the gap first, then have it.' },
      ],
      sections: [
        { label: 'Track these', items: [
          'Revenue generated', 'Cost savings', 'Projects completed',
          'Team impact', 'Leadership moments', 'Process improvements',
        ]},
        { label: 'Skill gaps', text: 'Ask your manager directly: “What specifically would you need to see to support a promotion?” Then write down the answer verbatim and close exactly that. Not what you assume — what they said.' },
        { label: 'Leadership opportunities', text: 'Mentor someone. Own a cross-team project. Run the thing nobody wants to run. Promotions follow scope, and scope is usually available if you ask.' },
        { label: 'The mistake', text: 'Waiting to be noticed. Managers are busy and your work is not their top priority. Build evidence, then present it — that’s not arrogance, it’s the job.' },
      ],
      note: 'Don’t wait for your manager to notice your work. Build the evidence, then make the ask.',
    }
  },

  'jh-m8-brand': (v) => {
    const topic = val(v, 'topic', 'your specialism')
    return {
      headline: `Being known for ${topic}.`,
      sections: [
        { label: 'Pick one thing', text: `“${topic}” — that’s the answer to “what do you do?” People can only remember you for one thing. Choose it deliberately or the choice gets made for you.` },
        { label: 'Build authority by', items: ['Posting insights', 'Speaking', 'Teaching', 'Writing', 'Sharing projects'] },
        { label: 'Start with the cheapest', text: 'Writing. One post a week about the thing you learned. No audience needed to start — the writing itself sharpens the expertise.' },
        { label: 'The test', text: 'When someone in your network hears “' + topic + '”, do they think of you? That’s the entire goal. Not followers — recall.' },
      ],
      note: 'People hire people they remember. Being remembered for something specific beats being vaguely impressive.',
    }
  },

  'jh-m8-review': (v) => ({
    headline: 'Your quarterly career review.',
    sections: [
      { label: 'What did I learn?', text: val(v, 'learned', 'Write it down — if nothing comes to mind, that IS the finding.') },
      { label: 'What did I achieve?', text: val(v, 'achieved', 'Numbers, not adjectives.') },
      { label: 'What skills are missing?', text: 'Compare against the job you want next, not the one you have.' },
      { label: 'What opportunities exist?', text: 'Internal moves, projects nobody owns, people worth knowing.' },
      { label: 'What’s next?', items: ['One skill to build', 'One relationship to deepen', 'One result to deliver'] },
      { label: 'Why 90 days', text: 'Long enough to have done something; short enough to change course. Annual reviews are too late to act on.' },
    ],
    note: 'Every 90 days. Half an hour. It’s the difference between a career and a sequence of jobs.',
  }),

  'jh-m8-dashboard': (v) => ({
    headline: 'One dashboard. One career system.',
    sections: [
      { label: 'Track', items: [
        'Skills', 'Certifications', 'Resume', 'LinkedIn', 'Network',
        'Interviews', 'Salary', 'Promotions', 'Learning', 'Goals',
      ]},
      { label: 'Your focus', text: `Metrics you chose: ${val(v, 'metrics', 'skills, network, achievements')}.` },
      { label: 'Review rhythm', text: 'Achievements weekly (5 min). Skills and network monthly (15 min). The whole dashboard quarterly (30 min).' },
      { label: 'Why it works', text: 'Because everything in this course decays without maintenance. Your resume goes stale, your network goes cold, your skills date. The dashboard is what keeps the system alive when you’re not job hunting.' },
    ],
    note: 'This is the difference between having a job and having a career system.',
  }),

  'jh-m8-final': (v) => {
    const role = val(v, 'role', 'your target role')
    const resume = analyzeResume(val(v, 'resume', ''))
    // Self-reported readiness, 1–10 each, turned into the course scorecard.
    const s = (k, d = 5) => clamp((parseFloat(val(v, k, String(d))) || d) * 10)
    const scores = {
      resume: resume.empty ? s('resumeScore') : clamp((impactScore(resume) + atsScore(resume)) / 2),
      linkedin: s('linkedinScore'),
      networking: s('networkingScore'),
      interview: s('interviewScore'),
      negotiation: s('negotiationScore'),
      career: s('careerScore'),
    }
    const overall = clamp(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length)
    const entries = Object.entries(scores)
    const strengths = entries.filter(([, x]) => x >= 70).map(([k]) => k)
    const gaps = entries.filter(([, x]) => x < 60).map(([k]) => k)
    const LABEL = {
      resume: 'Resume', linkedin: 'LinkedIn', networking: 'Networking',
      interview: 'Interview readiness', negotiation: 'Salary negotiation', career: 'Career planning',
    }
    return {
      headline: `Your Job Hunter Score: ${overall}/100 — ${overall >= 80 ? 'you’re ready. Go apply.' : overall >= 60 ? 'strong foundation, one or two gaps to close.' : 'the system exists; now it needs reps.'}`,
      scores: [
        ...entries.map(([k, x]) => ({ label: LABEL[k], value: x, note: resumeNote(x) })),
        { label: 'Overall Job Hunter Score', value: overall, note: `Targeting: ${role}.` },
      ],
      sections: [
        { label: 'Your biggest strengths', items: strengths.length ? strengths.map((k) => `${LABEL[k]} — this is doing real work for you`) : ['Nothing above 70 yet. That’s not failure — it’s a to-do list with numbers on it.'] },
        { label: 'Biggest opportunities', items: gaps.length ? gaps.map((k) => `${LABEL[k]} — the cheapest place to gain points right now`) : ['No gaps under 60. Your constraint is now volume, not quality — go apply.'] },
        { label: 'Recommended next steps', items: [
          'Apply to 10 high-quality roles this week',
          'Reach out to 5 professionals',
          'Complete one mock interview every weekend',
          'Update your Career Dashboard every Friday',
        ]},
        { label: 'What you actually built', items: [
          'Job search system', 'Resume OS', 'LinkedIn OS', 'AI Job Search Engine',
          'Interview OS', 'Networking OS', 'Offer OS', 'Career OS',
        ]},
      ],
      note: 'You didn’t learn how to get one job. You built a system you’ll reuse for every job after this one.',
    }
  },
}
