// ============================================================================
//  AI MARKETING OS — DOWNLOAD CENTER
//
//  These are not filenames pointing at files that don't exist. Each resource
//  below carries its real structure as data, and src/pages/Downloads.jsx both
//  previews it in-app and generates the downloadable file from it on the fly
//  (see src/lib/resourceDoc.js → src/lib/exporters). So every Download
//  button produces a genuine, usable worksheet with no asset pipeline and no
//  dead links.
//
//  If a designed PDF version is produced later, add `file: '/downloads/x.pdf'`
//  to that resource and the page will link to it instead of generating text.
//  Until then the generated version is the real one.
//
//  Section shapes:
//    { label, note?, fields: ['Field name', …] }                 → form block
//    { label, note?, table: { columns: [...], rows: [...] } }    → grid block
//  `steps` is only used by the Blueprint.
// ============================================================================

export const downloads = [
  {
    id: 'mkt-dl-workflow',
    title: 'AI Marketing Workflow Template',
    description: 'One page per marketing task: what it’s for, who owns it, which tool and prompt does it, and what it saved you. This is the template that turns “I use AI sometimes” into a system.',
    type: 'Template',
    moduleId: 'mkt-m8',
    moduleLabel: 'Module 8 · AI Marketing Automation',
    icon: 'Workflow',
    tone: 'brand',
    sections: [
      { label: 'Set the target', fields: ['Marketing objective', 'Target audience', 'KPI'] },
      {
        label: 'The workflow',
        note: 'One row per recurring task. If a task never repeats, it doesn’t belong here.',
        table: {
          columns: ['Weekly workflow step', 'Task owner', 'Tool used', 'AI prompt used', 'Expected output', 'Time saved'],
          rows: ['Monday — Planning', 'Tuesday — Content creation', 'Wednesday — Design & video', 'Thursday — Publishing & email', 'Friday — Analytics & optimisation'],
        },
      },
      { label: 'Review', note: 'Fill this in at the end of the week, while you still remember what broke.', fields: ['Review notes'] },
    ],
  },
  {
    id: 'mkt-dl-planner',
    title: 'Weekly Marketing Planner',
    description: 'The Module 8 week — Monday planning through Friday optimisation — as a page you fill in every Monday morning. Batching only works if the week is decided before it starts.',
    type: 'Planner',
    moduleId: 'mkt-m8',
    moduleLabel: 'Module 8 · AI Marketing Automation',
    icon: 'CalendarDays',
    tone: 'sun',
    sections: [
      { label: 'This week', fields: ['Weekly objective', 'Main campaign'] },
      {
        label: 'The week',
        table: {
          columns: ['Plan', 'Done?'],
          rows: ['Monday — Planning', 'Tuesday — Content creation', 'Wednesday — Design & video', 'Thursday — Publishing & email', 'Friday — Analytics & optimisation'],
        },
      },
      { label: 'Keep it honest', fields: ['Priorities', 'Deadlines', 'Notes'] },
      { label: 'Friday', note: 'Compare this against the weekly objective at the top. That comparison is the whole point of the page.', fields: ['Weekly results'] },
    ],
  },
  {
    id: 'mkt-dl-sop',
    title: 'Marketing SOP Template',
    description: 'Write the process down once so the tired Thursday version of you doesn’t have to invent it again. This is what makes a marketing task repeatable — and delegatable.',
    type: 'SOP',
    moduleId: 'mkt-m8',
    moduleLabel: 'Module 8 · AI Marketing Automation',
    icon: 'BookOpen',
    tone: 'sky2',
    sections: [
      { label: 'Identity', fields: ['SOP name', 'Purpose', 'Owner', 'Frequency', 'Trigger'] },
      { label: 'What it needs', fields: ['Required tools', 'Inputs'] },
      {
        label: 'The process',
        note: 'One row per step. If a step needs a paragraph, it’s two steps.',
        table: {
          columns: ['Step', 'What happens', 'AI prompt used', 'Output'],
          rows: ['1', '2', '3', '4', '5', '6'],
        },
      },
      { label: 'Quality control', note: 'The checks that run before anything public ships.', fields: ['Quality-control checklist', 'Approval process'] },
      { label: 'Improve it', fields: ['Automation opportunities', 'KPI', 'Revision history'] },
    ],
  },
  {
    id: 'mkt-dl-automation',
    title: 'Automation Planning Worksheet',
    description: 'Before you build an automation, describe it. Most automations fail because nobody decided what happens when they break — there’s a field for that here.',
    type: 'Worksheet',
    moduleId: 'mkt-m8',
    moduleLabel: 'Module 8 · AI Marketing Automation',
    icon: 'Zap',
    tone: 'brand',
    sections: [
      { label: 'The task today', fields: ['Repetitive task', 'Existing manual steps', 'Frequency', 'Time required'] },
      { label: 'The automation', fields: ['Trigger', 'Inputs', 'Actions', 'Conditions', 'Output', 'Recommended tools'] },
      { label: 'Safety', note: 'Never skip these two. A silent failure is worse than doing the task by hand.', fields: ['Human-review point', 'Error handling'] },
      { label: 'Worth it?', fields: ['Expected time saved', 'Automation priority (High / Medium / Low)'] },
    ],
  },
  {
    id: 'mkt-dl-stack',
    title: 'AI Tool Stack Checklist',
    description: 'One tool per job, the cost next to it, and an owner. Fill this in and you’ll usually find you’re paying twice for the same capability.',
    type: 'Checklist',
    moduleId: 'mkt-m8',
    moduleLabel: 'Module 8 · AI Marketing Automation',
    icon: 'Layers',
    tone: 'mint',
    sections: [
      {
        label: 'Your stack',
        note: 'One tool per row. If a row is empty, that’s a gap. If a row has three tools, that’s a bill.',
        table: {
          columns: ['Tool chosen', 'Cost', 'Owner', 'Integration notes'],
          rows: ['Research', 'Content', 'Design', 'Video', 'Social publishing', 'Email', 'CRM', 'SEO', 'Analytics', 'Automation'],
        },
      },
      { label: 'Decision', note: 'Total the costs. Then justify each line against a result.', fields: ['Final selected stack', 'Total monthly cost'] },
    ],
  },
  {
    id: 'mkt-dl-audit',
    title: 'Marketing Audit Template',
    description: 'Score every part of your marketing out of 10, with evidence next to the score. The evidence column is what stops an audit becoming a mood.',
    type: 'Template',
    moduleId: 'mkt-m7',
    moduleLabel: 'Module 7 · AI Marketing Analytics',
    icon: 'ClipboardCheck',
    tone: 'gold',
    sections: [
      {
        label: 'Score each area',
        note: 'Score /10, then write the evidence. A score without evidence is a feeling.',
        table: {
          columns: ['Category score (/10)', 'Evidence or notes', 'Priority', 'Recommended action', 'Owner', 'Deadline'],
          rows: ['Website', 'Messaging', 'Content', 'SEO', 'Social media', 'Email', 'Lead generation', 'Advertising', 'Analytics', 'Automation'],
        },
      },
      { label: 'The outcome', note: 'Fix the lowest score with the highest business impact. Not the easiest one.', fields: ['Lowest three scores', 'The one thing to fix this month'] },
    ],
  },
  {
    id: 'mkt-dl-blueprint',
    title: 'AI Marketing OS Blueprint',
    description: 'The entire course on one page: the twelve stages of the loop, in the order the work actually happens. Print it and put it where you plan your week.',
    type: 'Blueprint',
    moduleId: 'mkt-m8',
    moduleLabel: 'Module 8 · AI Marketing Automation',
    icon: 'Map',
    tone: 'flamingo',
    steps: [
      { name: 'Research', detail: 'Audience, competitors, keywords', tone: 'sky2' },
      { name: 'Strategy', detail: 'Goal, positioning, pillars', tone: 'sky2' },
      { name: 'Planning', detail: 'Calendar, batching', tone: 'mint' },
      { name: 'Content', detail: 'One idea → seven assets', tone: 'mint' },
      { name: 'Design', detail: 'Templates, brand rules', tone: 'flamingo' },
      { name: 'Video', detail: 'Script → shoot → auto-edit', tone: 'flamingo' },
      { name: 'Publishing', detail: 'Schedule, cross-post', tone: 'sun' },
      { name: 'Lead Capture', detail: 'Magnet → landing page', tone: 'sun' },
      { name: 'Email Nurture', detail: 'Welcome → sequence', tone: 'lime' },
      { name: 'Analytics', detail: 'Outcome, drivers, inputs', tone: 'gold' },
      { name: 'Optimisation', detail: 'One test per week', tone: 'gold' },
      { name: 'Automation', detail: 'Trigger → draft → approve → ship', tone: 'brand' },
    ],
    note: 'Each stage feeds the next, and Automation feeds Research again. That loop is the operating system — the tools inside it are replaceable.',
  },
]

// The document model + exporters live in src/lib/resourceDoc.js and
// src/lib/exporters/ — every course shares them.
