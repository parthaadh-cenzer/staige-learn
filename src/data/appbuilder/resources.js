// ============================================================================
//  RESOURCE VAULT · the third-party sites the course points builders at.
//
//  The course document names 72 resources across 16 categories but supplies no
//  links, descriptions or pricing — so those are authored here, once, against
//  each project's OFFICIAL site. Rules this file keeps:
//
//   • Official URLs only. No referral links, no mirrors, no affiliate codes.
//   • Nothing is redistributed. Every card is a link out; we host no assets.
//   • Pricing is a coarse badge, not a claim about a specific plan — vendors
//     change tiers constantly, so `pricing` says Free / Freemium / Paid / Open
//     Source and the copy avoids promising what any particular tier includes.
//   • `bestFor` is what a builder would actually reach for it for.
//
//  Rendered by the shared Vault page (src/pages/Vault.jsx) — the same one AI
//  Side Hustle OS uses — so search, category chips and pricing filters come for
//  free and this course adds no second directory implementation.
// ============================================================================

export const resourceCategories = [
  { id: 'icons', name: 'Icons', icon: 'Shapes', tone: 'brand' },
  { id: 'illustrations', name: 'Illustrations', icon: 'PenTool', tone: 'flamingo' },
  { id: 'photos', name: 'Stock Photos', icon: 'Image', tone: 'sky2' },
  { id: 'video', name: 'Videos', icon: 'Film', tone: 'mint' },
  { id: 'svg', name: 'SVG Resources', icon: 'Spline', tone: 'sun' },
  { id: 'gradients', name: 'Gradients', icon: 'Blend', tone: 'flamingo' },
  { id: 'color', name: 'Color Tools', icon: 'Palette', tone: 'gold' },
  { id: 'fonts', name: 'Fonts', icon: 'Type', tone: 'sky2' },
  { id: 'animation', name: 'Animations', icon: 'Sparkles', tone: 'mint' },
  { id: 'components', name: 'UI Components', icon: 'Component', tone: 'brand' },
  { id: 'charts', name: 'Charts', icon: 'BarChart3', tone: 'sun' },
  { id: 'mockups', name: 'Mockups', icon: 'Monitor', tone: 'sky2' },
  { id: 'deploy', name: 'Deployment', icon: 'Rocket', tone: 'brand' },
  { id: 'ai', name: 'AI Tools', icon: 'Bot', tone: 'mint' },
  { id: 'inspiration', name: 'Inspiration', icon: 'Eye', tone: 'gold' },
  { id: 'assets', name: 'Assets', icon: 'Package', tone: 'flamingo' },
]

export const resources = [
  // ── Icons ─────────────────────────────────────────────────────────────────
  { name: 'Heroicons', url: 'https://heroicons.com', category: 'icons', pricing: 'Open Source', best: 'Hand-crafted SVG icons from the team behind Tailwind CSS.', bestFor: 'Tailwind projects', why: 'Outline and solid sets that already match Tailwind sizing.' },
  { name: 'Lucide', url: 'https://lucide.dev', category: 'icons', pricing: 'Open Source', best: 'A large, consistent icon set with a React package.', bestFor: 'React apps', why: 'The set this very platform uses — consistent stroke weight throughout.' },
  { name: 'Tabler Icons', url: 'https://tabler.io/icons', category: 'icons', pricing: 'Open Source', best: 'Thousands of pixel-perfect icons on a 24×24 grid.', bestFor: 'Dashboards', why: 'Deep coverage when you need an icon nobody else has.' },
  { name: 'Phosphor Icons', url: 'https://phosphoricons.com', category: 'icons', pricing: 'Open Source', best: 'One icon family in six weights, from thin to duotone.', bestFor: 'Expressive UI', why: 'Weight changes let one icon set carry real hierarchy.' },
  { name: 'Remix Icon', url: 'https://remixicon.com', category: 'icons', pricing: 'Open Source', best: 'A neutral, systematic icon library for product interfaces.', bestFor: 'Product UI', why: 'Line and fill variants of every icon, so states are easy.' },
  { name: 'Iconoir', url: 'https://iconoir.com', category: 'icons', pricing: 'Open Source', best: 'A large open icon library with no tracking and no sign-up.', bestFor: 'Quick prototypes', why: 'Copy an SVG and go — nothing to install.' },
  { name: 'Font Awesome', url: 'https://fontawesome.com', category: 'icons', pricing: 'Freemium', best: 'The long-running icon toolkit, with a free core set.', bestFor: 'Brand and social icons', why: 'Still the easiest place to find a specific brand mark.' },
  { name: 'Material Symbols', url: 'https://fonts.google.com/icons', category: 'icons', pricing: 'Open Source', best: 'Google’s variable icon font with adjustable weight and fill.', bestFor: 'Material-style apps', why: 'One font file covers every icon and every weight.' },

  // ── Illustrations ────────────────────────────────────────────────────────
  { name: 'unDraw', url: 'https://undraw.co/illustrations', category: 'illustrations', pricing: 'Free', best: 'Open illustrations you can recolour to your brand before downloading.', bestFor: 'Empty states, hero art', why: 'Set the accent colour on the site and the whole set matches your palette.' },
  { name: 'Storyset', url: 'https://storyset.com', category: 'illustrations', pricing: 'Freemium', best: 'Customisable illustrations, some with built-in animation.', bestFor: 'Onboarding screens', why: 'Editable characters and colours without opening a design tool.' },
  { name: 'ManyPixels', url: 'https://www.manypixels.co/gallery', category: 'illustrations', pricing: 'Freemium', best: 'A gallery of illustrations in several consistent styles.', bestFor: 'Marketing pages', why: 'Pick one style and stay in it across the whole site.' },
  { name: 'DrawKit', url: 'https://www.drawkit.com', category: 'illustrations', pricing: 'Freemium', best: 'Illustration packs, icons and mockups with a free section.', bestFor: 'Landing pages', why: 'Packs are themed, so a set reads as one visual language.' },
  { name: 'IRA Design', url: 'https://iradesign.io', category: 'illustrations', pricing: 'Free', best: 'Build gradient illustrations by mixing and matching components.', bestFor: 'Startup hero art', why: 'Compose something that doesn’t look like everyone else’s stock art.' },
  { name: 'Blush', url: 'https://blush.design', category: 'illustrations', pricing: 'Freemium', best: 'Illustration collections from independent artists, customisable in-browser.', bestFor: 'Character illustration', why: 'Swap poses and colours before you export.' },

  // ── Stock Photos ─────────────────────────────────────────────────────────
  { name: 'Unsplash', url: 'https://unsplash.com', category: 'photos', pricing: 'Free', best: 'High-resolution photography under a permissive licence.', bestFor: 'Hero images', why: 'Check the current licence terms before commercial use.' },
  { name: 'Pexels', url: 'https://www.pexels.com', category: 'photos', pricing: 'Free', best: 'Free stock photos and video in one searchable library.', bestFor: 'Photos and video together', why: 'Good coverage of everyday, less-staged imagery.' },
  { name: 'Pixabay', url: 'https://pixabay.com', category: 'photos', pricing: 'Free', best: 'A large library of photos, vectors, video and audio.', bestFor: 'Filling a gap fast', why: 'Broad rather than curated — search carefully.' },

  // ── Videos ────────────────────────────────────────────────────────────────
  { name: 'Coverr', url: 'https://coverr.co', category: 'video', pricing: 'Free', best: 'Short background videos made for website hero sections.', bestFor: 'Video backgrounds', why: 'Clips are already cut to loop behind text.' },
  { name: 'Mixkit', url: 'https://mixkit.co', category: 'video', pricing: 'Free', best: 'Free stock video, music and sound effects.', bestFor: 'Product demos', why: 'Audio and video in the same place saves a second hunt.' },
  { name: 'Pexels Videos', url: 'https://www.pexels.com/videos', category: 'video', pricing: 'Free', best: 'The video half of Pexels, free to use.', bestFor: 'Ambient footage', why: 'Same licence and search as the photo library.' },

  // ── SVG Resources ────────────────────────────────────────────────────────
  { name: 'SVG Repo', url: 'https://www.svgrepo.com', category: 'svg', pricing: 'Free', best: 'A searchable archive of vectors and icons, filterable by licence.', bestFor: 'Finding one specific shape', why: 'Always read the per-file licence — they differ.' },
  { name: 'Haikei', url: 'https://haikei.app', category: 'svg', pricing: 'Free', best: 'Generate SVG blobs, waves, and layered backgrounds in the browser.', bestFor: 'Section backgrounds', why: 'Export straight to SVG or PNG at any size.' },
  { name: 'BGJar', url: 'https://bgjar.com', category: 'svg', pricing: 'Free', best: 'A free generator for SVG background patterns.', bestFor: 'Hero backdrops', why: 'Tweak colour and density, then copy the SVG.' },
  { name: 'Hero Patterns', url: 'https://heropatterns.com', category: 'svg', pricing: 'Open Source', best: 'Repeatable SVG patterns you drop straight into CSS.', bestFor: 'Subtle texture', why: 'Tiny file size — it’s a background-image, not an asset.' },
  { name: 'Pattern Monster', url: 'https://pattern.monster', category: 'svg', pricing: 'Free', best: 'A large pattern generator with colour, stroke and spacing controls.', bestFor: 'Branded texture', why: 'Copy as SVG, CSS or a data URI.' },

  // ── Gradients ────────────────────────────────────────────────────────────
  { name: 'UI Gradients', url: 'https://uigradients.com', category: 'gradients', pricing: 'Free', best: 'A browsable collection of two-colour CSS gradients.', bestFor: 'Buttons and cards', why: 'Copy the CSS directly — no account, no export step.' },
  { name: 'Gradient Hunt', url: 'https://gradienthunt.com', category: 'gradients', pricing: 'Free', best: 'Community-submitted gradients with HEX values.', bestFor: 'Finding a mood fast', why: 'Sorted by popularity, so the good ones surface.' },
  { name: 'Grabient', url: 'https://www.grabient.com', category: 'gradients', pricing: 'Free', best: 'Adjust angle and colour stops, then copy the CSS.', bestFor: 'Tuning a gradient', why: 'The angle control is what most gradient sites are missing.' },

  // ── Color Tools ──────────────────────────────────────────────────────────
  { name: 'Coolors', url: 'https://coolors.co', category: 'color', pricing: 'Freemium', best: 'Generate, lock and refine five-colour palettes.', bestFor: 'Starting a palette', why: 'Lock the one colour you like and re-roll the rest.' },
  { name: 'Color Hunt', url: 'https://colorhunt.co', category: 'color', pricing: 'Free', best: 'A curated feed of four-colour palettes.', bestFor: 'Browsing for inspiration', why: 'Faster than generating when you don’t know what you want yet.' },
  { name: 'Adobe Color', url: 'https://color.adobe.com', category: 'color', pricing: 'Freemium', best: 'Colour-theory wheel plus contrast and accessibility checks.', bestFor: 'Accessible palettes', why: 'The contrast checker is the part worth the visit.' },
  { name: 'Happy Hues', url: 'https://www.happyhues.co', category: 'color', pricing: 'Free', best: 'Palettes shown in context on a real page layout.', bestFor: 'Seeing a palette used', why: 'It tells you which colour goes where — rare and useful.' },

  // ── Fonts ─────────────────────────────────────────────────────────────────
  { name: 'Google Fonts', url: 'https://fonts.google.com', category: 'fonts', pricing: 'Open Source', best: 'The default free web-font library, with a ready-made embed snippet.', bestFor: 'Almost every project', why: 'Every pairing in the Font Pairing Library loads from here.' },
  { name: 'Fontshare', url: 'https://www.fontshare.com', category: 'fonts', pricing: 'Free', best: 'Professional-quality typefaces offered free for personal and commercial use.', bestFor: 'Standing out', why: 'Where Clash Display and General Sans live.' },
  { name: 'Bunny Fonts', url: 'https://fonts.bunny.net', category: 'fonts', pricing: 'Free', best: 'A privacy-first, drop-in replacement for the Google Fonts CDN.', bestFor: 'Privacy-conscious sites', why: 'Same font names, no tracking cookies.' },

  // ── Animations ───────────────────────────────────────────────────────────
  { name: 'LottieFiles', url: 'https://lottiefiles.com', category: 'animation', pricing: 'Freemium', best: 'Lightweight JSON animations you can drop into a web page.', bestFor: 'Loading and success states', why: 'Vector animation at a fraction of a GIF’s weight.' },
  { name: 'Motion One', url: 'https://motion.dev', category: 'animation', pricing: 'Open Source', best: 'A tiny animation library built on the Web Animations API.', bestFor: 'Small bundles', why: 'When Framer Motion is more than the page needs.' },
  { name: 'GSAP', url: 'https://gsap.com', category: 'animation', pricing: 'Freemium', best: 'The industry-standard timeline animation library.', bestFor: 'Scroll and timeline work', why: 'Check the current licence for commercial plugin use.' },
  { name: 'Framer Motion', url: 'https://motion.dev/docs/react', category: 'animation', pricing: 'Open Source', best: 'Declarative animation for React components.', bestFor: 'React micro-interactions', why: 'The library this platform animates with.' },

  // ── UI Components ────────────────────────────────────────────────────────
  { name: 'shadcn/ui', url: 'https://ui.shadcn.com', category: 'components', pricing: 'Open Source', best: 'Accessible React components you copy into your own codebase.', bestFor: 'Owning your components', why: 'Not a dependency — the code becomes yours to edit.' },
  { name: 'Magic UI', url: 'https://magicui.design', category: 'components', pricing: 'Freemium', best: 'Animated React and Tailwind components for landing pages.', bestFor: 'Marketing sites', why: 'The effects that make a hero section feel expensive.' },
  { name: 'Aceternity UI', url: 'https://ui.aceternity.com', category: 'components', pricing: 'Freemium', best: 'Bold, motion-heavy Tailwind components.', bestFor: 'Standout hero sections', why: 'Use sparingly — one of these per page is usually enough.' },
  { name: 'Origin UI', url: 'https://originui.com', category: 'components', pricing: 'Open Source', best: 'A large set of copy-paste Tailwind components.', bestFor: 'Forms and inputs', why: 'Especially strong on the fiddly form controls.' },
  { name: 'Tailwind UI', url: 'https://tailwindcss.com/plus', category: 'components', pricing: 'Paid', best: 'The official paid component and template library for Tailwind.', bestFor: 'Production dashboards', why: 'A paid licence — the document flags it as such.' },
  { name: 'HyperUI', url: 'https://www.hyperui.dev', category: 'components', pricing: 'Open Source', best: 'Free Tailwind components for marketing and ecommerce.', bestFor: 'Ecommerce layouts', why: 'Product grids and cart UI without writing them twice.' },

  // ── Charts ────────────────────────────────────────────────────────────────
  { name: 'Recharts', url: 'https://recharts.org', category: 'charts', pricing: 'Open Source', best: 'Composable chart components built for React.', bestFor: 'React dashboards', why: 'Charts are JSX, so they compose like the rest of your UI.' },
  { name: 'Tremor', url: 'https://tremor.so', category: 'charts', pricing: 'Freemium', best: 'React components for dashboards — charts, KPI cards and tables.', bestFor: 'Analytics dashboards', why: 'Opinionated defaults that already look designed.' },
  { name: 'Chart.js', url: 'https://www.chartjs.org', category: 'charts', pricing: 'Open Source', best: 'A simple, framework-agnostic canvas charting library.', bestFor: 'Non-React projects', why: 'Works anywhere there’s a canvas element.' },
  { name: 'ApexCharts', url: 'https://apexcharts.com', category: 'charts', pricing: 'Open Source', best: 'Interactive SVG charts with zoom, export and annotations.', bestFor: 'Data-heavy views', why: 'More chart types than most projects will ever need.' },

  // ── Mockups ───────────────────────────────────────────────────────────────
  { name: 'Shots.so', url: 'https://shots.so', category: 'mockups', pricing: 'Freemium', best: 'Drop a screenshot into a device frame with a background.', bestFor: 'Portfolio case studies', why: 'Turns a flat screenshot into a presentable image in seconds.' },
  { name: 'Smartmockups', url: 'https://smartmockups.com', category: 'mockups', pricing: 'Freemium', best: 'A large mockup library covering devices, print and apparel.', bestFor: 'Client presentations', why: 'Realistic scenes when a plain device frame is too plain.' },
  { name: 'Mockup World', url: 'https://www.mockupworld.co', category: 'mockups', pricing: 'Free', best: 'A directory of free mockup files from across the web.', bestFor: 'Free PSD mockups', why: 'Most files need a photo editor to use.' },

  // ── Deployment ───────────────────────────────────────────────────────────
  { name: 'Vercel', url: 'https://vercel.com', category: 'deploy', pricing: 'Freemium', best: 'Push to Git and get a live URL, with a generous hobby tier.', bestFor: 'React and Vite projects', why: 'The deployment path Module 7 walks through.' },
  { name: 'Netlify', url: 'https://www.netlify.com', category: 'deploy', pricing: 'Freemium', best: 'Static and Jamstack hosting with forms and redirects built in.', bestFor: 'Static sites with forms', why: 'Form handling without writing a backend.' },
  { name: 'Cloudflare Pages', url: 'https://pages.cloudflare.com', category: 'deploy', pricing: 'Freemium', best: 'Static hosting on Cloudflare’s global network.', bestFor: 'Fast global delivery', why: 'Bandwidth is not metered on the free tier.' },
  { name: 'GitHub Pages', url: 'https://pages.github.com', category: 'deploy', pricing: 'Free', best: 'Publish a static site straight from a GitHub repository.', bestFor: 'Simple portfolios', why: 'No extra account — it’s already where your code is.' },

  // ── AI Tools ──────────────────────────────────────────────────────────────
  { name: 'Claude', url: 'https://claude.ai', category: 'ai', pricing: 'Freemium', best: 'Planning, architecture, debugging and prompt writing.', bestFor: 'Thinking through a build', why: 'The planning half of this course’s core toolkit.' },
  { name: 'ChatGPT', url: 'https://chatgpt.com', category: 'ai', pricing: 'Freemium', best: 'General-purpose assistant for copy, code and explanation.', bestFor: 'Second opinions', why: 'Useful when you want a different model’s take.' },
  { name: 'Gemini', url: 'https://gemini.google.com', category: 'ai', pricing: 'Freemium', best: 'Google’s assistant, with strong long-context handling.', bestFor: 'Long documents', why: 'Handy when you’re feeding in a lot of material at once.' },
  { name: 'Lovable', url: 'https://lovable.dev', category: 'ai', pricing: 'Freemium', best: 'Describe an app in plain language and get a working project.', bestFor: 'First drafts of an app', why: 'One of the AI app builders this course is built around.' },
  { name: 'Bolt', url: 'https://bolt.new', category: 'ai', pricing: 'Freemium', best: 'Generate and run full-stack web apps in the browser.', bestFor: 'Fast prototypes', why: 'Preview and edit without setting anything up locally.' },
  { name: 'Cursor', url: 'https://cursor.com', category: 'ai', pricing: 'Freemium', best: 'An AI-first code editor for editing a project you already have.', bestFor: 'Refining generated code', why: 'Where you go once the builder’s output needs real changes.' },
  { name: 'Replit', url: 'https://replit.com', category: 'ai', pricing: 'Freemium', best: 'Browser-based development and hosting with an AI agent.', bestFor: 'Building on a Chromebook', why: 'Nothing to install — editor, runtime and hosting in one tab.' },

  // ── Inspiration ──────────────────────────────────────────────────────────
  { name: 'Mobbin', url: 'https://mobbin.com', category: 'inspiration', pricing: 'Freemium', best: 'Real screenshots of shipped mobile and web app flows.', bestFor: 'Studying real UX', why: 'Whole flows, not single screens — that’s the value.' },
  { name: 'Land-book', url: 'https://land-book.com', category: 'inspiration', pricing: 'Freemium', best: 'A curated gallery of landing pages, filterable by industry.', bestFor: 'Landing page structure', why: 'Filter by category to see what your niche expects.' },
  { name: 'Godly', url: 'https://godly.website', category: 'inspiration', pricing: 'Free', best: 'A tight selection of exceptionally designed websites.', bestFor: 'Raising your standard', why: 'Small and curated — quality over volume.' },
  { name: 'Awwwards', url: 'https://www.awwwards.com', category: 'inspiration', pricing: 'Freemium', best: 'Award-winning web design, judged and archived.', bestFor: 'Ambitious motion work', why: 'Inspiring, but rarely a template for a client site.' },
  { name: 'One Page Love', url: 'https://onepagelove.com', category: 'inspiration', pricing: 'Freemium', best: 'A gallery devoted entirely to single-page websites.', bestFor: 'One-page portfolios', why: 'Exactly the format Module 1’s portfolio project takes.' },

  // ── Assets ────────────────────────────────────────────────────────────────
  { name: 'Freepik', url: 'https://www.freepik.com', category: 'assets', pricing: 'Freemium', best: 'Vectors, photos and PSDs, with attribution required on the free tier.', bestFor: 'Vector graphics', why: 'Read the licence — free use has attribution conditions.' },
  { name: 'Icons8', url: 'https://icons8.com', category: 'assets', pricing: 'Freemium', best: 'Icons, illustrations, photos and music in one library.', bestFor: 'One-stop asset hunting', why: 'Consistent style across asset types.' },
  { name: 'Remove.bg', url: 'https://www.remove.bg', category: 'assets', pricing: 'Freemium', best: 'Strip the background out of an image automatically.', bestFor: 'Product and profile shots', why: 'Free previews are lower resolution than paid exports.' },
  { name: 'TinyPNG', url: 'https://tinypng.com', category: 'assets', pricing: 'Freemium', best: 'Compress PNG, JPEG and WebP files without a visible quality drop.', bestFor: 'Passing the performance check', why: 'The fastest fix for the “images optimized” launch-checklist item.' },
]

export const resourceCount = resources.length
