// ============================================================================
//  PREMIUM LANDING PAGE TEMPLATES
//
//  HONESTY NOTE — read before adding anything here.
//
//  The course document specifies this library in full (technical standard,
//  folder shape, setup steps, customisation approach, the Claude prompt) and
//  sets the initial goal at 20 templates. What it deliberately does NOT do is
//  ship the ZIPs: its own "Final Decision" is to generate ONE template at a
//  time, test it locally, package it, and add it here.
//
//  So this file is the roadmap, not a pile of dead download buttons. Every
//  entry has `file: null` and therefore renders as "File pending" with the
//  download disabled. NOTHING here claims a file exists that does not.
//
//  TO PUBLISH A TEMPLATE
//    1. Build it to the standard in `templateStandard` below.
//    2. Verify `npm install && npm run dev` works from a clean extract.
//    3. Put the ZIP somewhere public (e.g. /public/templates/<slug>.zip).
//    4. Set `file: '/templates/<slug>.zip'` and `size: '2.4 MB'` on its entry.
//  The card flips to a live download on its own — no page changes needed.
//
//  The 20 titles below are the course's own subject matter: the eight business
//  categories Module 3 asks you to build for, plus the app and startup surfaces
//  Modules 4–7 cover. They are a plan, and the UI says so.
// ============================================================================

// The technical standard every template must meet. Straight from the document.
export const templateStandard = {
  stack: ['React', 'Vite', 'Tailwind CSS'],
  requirements: [
    'Fully responsive, mobile-first',
    'Clean folder structure',
    'Reusable components',
    'Production-ready',
    'No backend',
    'No API keys',
    'No paid dependencies',
    'SEO-friendly HTML structure',
    'Easy-to-edit content',
    'Well-commented code',
  ],
  deliverables: [
    'Complete project',
    'README.md',
    'Setup instructions',
    'Folder structure',
    'Clean component organization',
  ],
  setup: [
    'Download the ZIP file.',
    'Extract it.',
    'Open the folder in VS Code.',
    'Open Terminal.',
    'Run: npm install',
    'Then run: npm run dev',
    'Open the local URL shown in the terminal.',
  ],
  // The document's customisation rule: one file to edit, not ten.
  customization: {
    file: 'src/data/content.js',
    note: 'Templates are beginner-friendly. Rather than editing several files, all editable content lives in one place, so you can change the words without touching the UI code.',
    example: `export const siteContent = {
  businessName: "Northstar Studio",
  headline: "Helping Businesses Grow",
  email: "hello@example.com"
}`,
  },
  structure: `saas-startup-template/
├── src/
├── public/
├── components/
├── assets/
├── README.md
├── package.json
├── vite.config.js
├── index.html
└── ...`,
}

// The prompt the document requires when generating any template. Reproduced so
// a student can build their own to the same standard while the library grows.
export const templatePrompt = `You are an award-winning UI/UX designer and senior frontend engineer.

Build a production-ready landing page template.

Technical Requirements:
- React
- Vite
- Tailwind CSS
- Fully Responsive
- Clean folder structure
- Reusable components
- Production-ready
- No backend
- No API keys
- No paid dependencies
- Mobile-first
- SEO-friendly HTML structure
- Easy-to-edit content
- Well-commented code

All editable content must live in a single file (src/data/content.js) so the
text can be changed without touching the UI code.

Required Deliverables:
- Complete project
- README.md
- Setup instructions
- Folder structure
- Clean component organization`

// `file: null` → the card shows "File pending" and the download is disabled.
// Fill in `file` and `size` to publish one. Never point two entries at the
// same ZIP.
const t = (num, title, difficulty, blurb, learn) => ({
  id: `ab-t${String(num).padStart(2, '0')}`,
  num,
  title,
  difficulty,
  blurb,
  learn,
  stack: templateStandard.stack,
  file: null,
  size: null,
  status: 'planned',
})

export const templates = [
  t(1, 'SaaS Startup', 'Beginner', 'The template the document names as the worked example — hero, features, pricing and a single clear call to action.', ['Hero sections', 'Feature grids', 'Pricing tables', 'Conversion-focused CTAs']),
  t(2, 'Personal Portfolio', 'Beginner', 'A single-page portfolio: hero, about, selected work, contact. The Module 1 project, productionised.', ['Project showcases', 'About sections', 'Contact forms', 'Scroll animations']),
  t(3, 'Restaurant', 'Beginner', 'Menu, gallery, story and reservations, built around one action: book a table.', ['Menu layouts', 'Reservation forms', 'Image galleries', 'Warm colour systems']),
  t(4, 'Coffee Shop', 'Beginner', 'A small local business page with hours, location and a personality that matches the room.', ['Local business layout', 'Hours and location blocks', 'Brand personality', 'Mobile-first design']),
  t(5, 'Gym & Fitness', 'Beginner', 'Classes, trainers, membership tiers and a sign-up path that doesn’t bury the price.', ['Class schedules', 'Pricing tiers', 'Trainer profiles', 'Membership CTAs']),
  t(6, 'Dental Practice', 'Beginner', 'Trust-first medical layout: services, team, patient reviews, appointment booking.', ['Trust signals', 'Service grids', 'Appointment CTAs', 'Accessible contrast']),
  t(7, 'Real Estate Agency', 'Intermediate', 'Property cards, search, agent profiles and enquiry capture.', ['Listing cards', 'Filter interfaces', 'Agent bios', 'Lead capture forms']),
  t(8, 'Photography', 'Beginner', 'A gallery-led site where the work is the interface and the layout gets out of the way.', ['Image-led layouts', 'Lightbox galleries', 'Minimal navigation', 'Portfolio pacing']),
  t(9, 'Marketing Agency', 'Intermediate', 'Services, case studies, results and a booking CTA — the structure Module 3 teaches.', ['Case study layouts', 'Social proof', 'Service positioning', 'Booking flows']),
  t(10, 'Pet Grooming', 'Beginner', 'A friendly small-business page with services, pricing and a booking form.', ['Friendly brand voice', 'Service pricing', 'Booking forms', 'Playful colour']),
  t(11, 'Mobile App Landing', 'Intermediate', 'App-store-style landing: screenshots, feature highlights and download buttons.', ['Device mockups', 'Feature highlights', 'App store CTAs', 'Scroll storytelling']),
  t(12, 'AI Product', 'Intermediate', 'Positioning an AI product by outcome, not by technology — the Module 5 lesson, as a layout.', ['Benefit-led copy blocks', 'Demo sections', 'Dark UI', 'Outcome-first positioning']),
  t(13, 'Course & Education', 'Intermediate', 'Curriculum, instructor, outcomes and enrolment.', ['Curriculum layouts', 'Instructor bios', 'Outcome sections', 'Enrolment CTAs']),
  t(14, 'Ecommerce Storefront', 'Intermediate', 'Product grid, product detail and cart UI, with no backend attached.', ['Product grids', 'Detail pages', 'Cart interfaces', 'Commerce patterns']),
  t(15, 'Event & Conference', 'Intermediate', 'Speakers, agenda, tickets and a countdown to the date.', ['Agenda timelines', 'Speaker cards', 'Ticket tiers', 'Date-driven urgency']),
  t(16, 'Consulting & Finance', 'Intermediate', 'A conservative, high-trust layout for professional services.', ['Trust-first design', 'Credential blocks', 'Enterprise tone', 'Contact funnels']),
  t(17, 'Newsletter & Creator', 'Beginner', 'One goal, one form: subscribe. Everything else supports it.', ['Single-CTA pages', 'Email capture', 'Creator positioning', 'Minimal layouts']),
  t(18, 'Startup Waitlist', 'Beginner', 'A pre-launch page that collects interest before the product exists.', ['Waitlist forms', 'Pre-launch messaging', 'Simple hero design', 'Social proof placeholders']),
  t(19, 'Non-Profit', 'Intermediate', 'Mission, impact, programmes and a donation call to action.', ['Mission storytelling', 'Impact statistics', 'Donation CTAs', 'Empathetic design']),
  t(20, 'Freelancer Services', 'Beginner', 'Services, packages, testimonials and a hire-me path for a one-person business.', ['Service packages', 'Testimonial sections', 'Pricing clarity', 'Personal branding']),
]

export const templateCount = templates.length
export const liveTemplateCount = templates.filter((x) => x.file).length
