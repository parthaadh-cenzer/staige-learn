# STAIGE — Learning Platform

A calm, premium, **mascot-driven** learning platform starring **Capy** (the learner) and
**Byte** (the AI teammate). Every course is an *operating system* you keep using, not a
playlist you finish. Think Apple × Linear × Notion browsing, not "another AI course."

Deploys to **learn.staige.world** · light sage-green design · fully responsive · everything
saves locally · no account required.

## Homepage

`/` is the platform homepage (`src/pages/Home.jsx`) — it replaced the old Launchpad grid.
**Every section is derived from the course registry; no course is named in the page.**

| Section | Driven by |
|---------|-----------|
| Hero · ⭐ Featured This Week | `featured: true` on exactly one course |
| Continue Learning | stored progress (`completed` + `lastLessonId`) |
| 🆕 Recently Updated | `lastUpdated`, sorted newest-first |
| Choose Your Goal | `goal: { emoji, label, order }` |
| Browsing rows | `collections` + `status` |
| Coming Soon | `status !== 'active'` |

To feature a different course, move `featured: true`. To reorder Recently Updated, change
`lastUpdated`. Nothing in the homepage needs editing — there is a check that enforces this
contract (see *Verifying* below).

**Chrome:** platform pages (Home, Courses, Settings, Contact/Privacy/Terms) use
`HomeLayout` — STAIGE mark top-left + top nav. Course pages keep their existing sidebar.
The old Launchpad faked a course context to borrow the sidebar, which meant the library
rendered with one course's progress down the side; with three courses that was wrong.

## Tech stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** — calm light design system (`tailwind.config.js`, `src/lib/tones.js`)
- **Framer Motion** — page transitions, reveals, mascot motion, celebrations
- **Zustand** + `persist` → all progress in `localStorage`
- **lucide-react** icons
- **sharp** (build-time only) — optimizes mascot art

## Getting started

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # production build → dist/
npm run preview  # preview the production build
```

> If your browser can't reach `localhost:5180`, it may be resolving to IPv6. The dev server
> binds all interfaces (`server.host: true`), so try the printed Network URL too.

## Multi-course engine — the Launchpad

This app is a **reusable course engine**. Courses are **data files** — no component
changes required.

| Course | Status |
|--------|--------|
| **AI Side Hustle OS** — 6 modules, 19 lessons | Active (default) |
| **AI Marketing OS** — 8 modules, 59 lessons | Active |
| **AI Job Hunter OS** — 8 modules, 62 lessons, 5,300 XP | Active |
| AI Employee OS · AI Agents for Business · AI Small Business OS | Coming soon |

### Structure

- `src/data/courses/` — one file per course (the content) + `index.js` (the registry).
- `src/data/courses/_template.js` — heavily-commented starter; **copy this** for a new course.
- `src/course/CourseContext.jsx` — `useCourse()` → `{ course, base }` for the active course.
- `src/course/CourseShell.jsx` — resolves the course from the URL and renders the shared pages.
- `src/course/progress.js` — course-aware progress helpers (`courseProgress`, `moduleProgress`, `nextLesson`).
- `src/components/CourseSwitcher.jsx` — the collapsible **Launchpad** switcher in the sidebar.
- `src/pages/Launchpad.jsx` — the course library at `/launchpad`.

The pages in `src/pages/` **are** the reusable course template — they read everything from
`useCourse()`, so the same screens render for any course:

| Requested component | Lives in |
|---------------------|----------|
| `CourseDashboard` | `src/pages/Dashboard.jsx` |
| `CourseSidebar` + `CourseSwitcher` | `src/components/Layout.jsx` + `src/components/CourseSwitcher.jsx` |
| `CourseHero` / `CourseStats` | the hero + stat cards inside `Dashboard.jsx` |
| `ModuleGrid` / `ModuleCard` | `src/pages/Modules.jsx` + `ModuleView.jsx` |
| `LessonPage` | `src/pages/Lesson.jsx` |
| `ChallengePage` | `src/pages/Challenge.jsx` |
| `PromptLibrary` / `ResourceVault` | `src/pages/Prompts.jsx` + `Vault.jsx` |
| `ChecklistsPage` / `DownloadCenter` | `src/pages/Checklists.jsx` + `Downloads.jsx` |
| `MascotAdvisor` | `src/components/MascotAdvisor.jsx` |

Both `Prompts.jsx` and `Vault.jsx` adapt to the data they're given: supply bare prompts
(`{ id, category, text }`) and you get the compact list; supply full prompt cards
(`title`, `bestFor`, `tools`, `timeSaved`, `difficulty`) and you get the premium layout.
Likewise the Vault shows a pricing filter only when tools carry `pricing`, and a
"Recommended stacks" section only when `resources.stacks` exists.

### Routes

| Route | Shows |
|-------|-------|
| `/` | **the STAIGE homepage** (landing page) |
| `/courses` | the full course library |
| `/settings` · `/contact` · `/privacy` · `/terms` | platform pages |
| `/course/:alias` | short alias → canonical course URL (`/course/job-hunter`) |
| `/launchpad` | → `/` (the Launchpad became the homepage) |
| `/launchpad/:courseSlug` | course dashboard |
| `/launchpad/:courseSlug/modules` | all modules |
| `/launchpad/:courseSlug/module/:moduleId/lesson/:lessonId` | a lesson |
| `/launchpad/:courseSlug/{prompts,ideas,calendar,vault,checklists,downloads,challenge,badges}` | bonus areas (shown per `features`) |

Legacy links (`/modules`, `/learn/:m/:l`, `/prompts`, …) redirect to the default course, so
existing bookmarks and navigation keep working. Course URLs are unchanged
(`/launchpad/<slug>`); `/course/<alias>` resolves against the registry rather than a
hardcoded map, so a new course gets its short URL for free.

### Bundle & code splitting

The homepage is the landing page, so the learning app is lazy-loaded (`React.lazy` on
`CourseShell` in `App.jsx`):

| Chunk | Size | When |
|-------|------|------|
| `index-*.js` | ~691 kB | landing page |
| `CourseShell-*.js` | ~990 kB | fetched when a course is opened |

That's a **59% cut** to landing-page JS (was one 1,672 kB chunk). The remaining entry
weight is largely course *content*, because the homepage needs every course's lesson ids to
compute progress. Splitting that too means separating course **metadata** from course
**content** (a `*.meta.js` per course, with content behind a dynamic import) — worth doing
before the course count grows much further.

### How to add a new course

1. **Duplicate** `src/data/courses/_template.js` → `src/data/courses/my-course.js`.
2. **Edit** the fields: `slug`, `title`, `modules`/`lessons`, `prompts`, `resources`,
   `challenge`, `badges`, etc. **Use globally-unique ids** (prefix with the slug, e.g.
   `mkt-m1l1`) — progress is keyed by id. Set `status: 'active'` when it's ready (leave it
   `'coming-soon'` to list it as a disabled, not-yet-clickable card).
3. **Register** it in `src/data/courses/index.js` (import it and add to the `courses` array).
4. Done — it appears in the **Launchpad** switcher and library automatically. When
   `active`, clicking it opens its dashboard at `/launchpad/<slug>`.

`AI Marketing OS` (`src/data/courses/ai-marketing-os.js` + `src/data/marketing/`) is the
worked example of steps 1–4 — copy its structure rather than inventing a new one.

**Which sidebar/dashboard sections a course shows** is `features`: `prompts`, `ideas`,
`calendar`, `vault`, `checklists`, `downloads`, `challenge`, `badges`. Each maps to the
route of the same name. Courses name their own sections via `ui.<key>.title` /
`ui.<key>.nav` (sidebar label) — nothing in the chrome is hardcoded to one course.

**Dashboard copy** is `ui.dashboard`: `eyebrow`, `heroTitle` + `heroAccent`,
`blurb.{start,mid,done}` (`{pct}` is substituted), `bonuses[]` (the bonus cards) and
`meet` (the first-run Capy & Byte card). A course with `features.challenge: false` can
set `finalChallenge: { title, blurb, moduleId, lessonId, emoji, tone }` to spotlight its
closing lesson instead of the 7-day challenge.

> Frontend-only by design: no backend, database, auth, or payments. Progress lives in
> `localStorage`. Deploys as a static site (Vercel-ready).

### Progress isolation between courses

The store keeps **one flat list** of completed lesson ids (plus one map each for
worksheets, checklists, quizzes…) shared by every course. Isolation comes entirely from
**id prefixes** — `courseProgress()` only counts ids belonging to the course you're
viewing. So:

- Prefix every lesson, module, worksheet, checklist and mission id with your slug.
- Milestone badge `test(s)` receives `{ completed, progress, challengeDone }` where
  `completed` is the **global** list and `progress` is already course-scoped. Test
  `s.progress`, or `s.completed.includes('<your-prefix>-…')` — never `s.completed.length`,
  which counts other courses' work.

### XP & achievements (opt-in)

Set `features.xp: true` and give each lesson an `xp` value. **XP is derived, never
stored** — `courseXp(course, completed)` sums the `xp` of this course's completed
lessons, so it can't drift out of sync, needs no migration, and stays course-scoped for
free. The dashboard grows an XP stat card, the Badges page grows an XP bar, and lesson
completion shows a `+50 XP` chip. Courses that omit `xp` are entirely unaffected.

Achievements reuse the **existing badge system**. A module can override its derived badge
to give it a real name:

```js
{ id: 'jh-m2', title: 'Resume OS', …,
  badge: { emoji: '🏅', title: 'Resume Master', desc: 'Built your Resume OS' } }
```

Milestone badge `test(ctx)` receives `{ completed, progress, xp, challengeDone }`.

### Module-end sections

AI Job Hunter OS closes every module with four blocks, in this order:

| Block | Renders |
|-------|---------|
| `{ t: 'resourcelist', kind: 'template', moduleId }` | 🤖 **AI Templates** |
| `{ t: 'resourcelist', kind: 'download', moduleId }` | 📥 **Downloads** |
| `{ t: 'bytesummary', learned: [...], nextModuleId }` | 🤖 **Byte Summary** |
| `{ t: 'moduleunlock', moduleId, nextModuleId }` | 🔓 **Module Unlocked** (locked until the module is complete) |

`resourcelist` reads the **same** `course.downloads.items` the Download Center uses,
filtered by `moduleId` + `kind` — so a resource is authored once and appears in both
places, and both generate the same real file via `src/lib/resourceFile.js`.

### Downloads — one source, three formats

There are **no .txt downloads**. Every resource is a doc built by
`src/lib/resourceDoc.js`, and that same doc object is rendered two ways:

- on screen by `components/ResourcePreview.jsx`
- into a file by `lib/exporters/{pdf,docx,xlsx}.js`

So the preview and the download can't drift — there's no second implementation.
`docToText()` also lives there, but only for the **clipboard** ("Copy template"), which
has to be text.

**Format is chosen from the resource's own `type`** (`pickFormat`):

| Format | Types | Why |
|--------|-------|-----|
| **PDF** | Guide, Checklist, Workbook, Cheat Sheet, SOP, Roadmap, Blueprint, Question Bank, Library, Challenge | read it, print it, tick it |
| **DOCX** | Template, Worksheet, Journal, Notes | you rewrite it in your own words |
| **XLSX** | Tracker, Dashboard, Database, Matrix, Calculator, Scorecard, Calendar | a grid you maintain |

`Planner` and `Template` are decided by shape (mostly-a-grid → XLSX), because the brief
lists planners under both. Set `format: 'xlsx'` on a resource to override — a couple do.

Exporters are **dynamically imported** so jsPDF/docx/SheetJS never touch the landing page.
Other producers (`checklistDoc`, `calendarDoc`, `challengeDoc`, `worksheetDoc`) feed the
same pipeline, which is how the Side Hustle calendar became a real spreadsheet.

**Two things worth knowing before editing the exporters:**

1. **PDF text must go through `winAnsi()`** (`exporters/shared.js`). jsPDF's built-in
   fonts are cp1252; anything outside it is silently truncated to its low byte and renders
   as a *different* glyph. `↓` came out as `“` eleven times in the Blueprint before this
   existed. DOCX/XLSX are UTF-8 and need none of it.
2. **SheetJS CE writes values, not formats.** Bold, fills, borders and frozen panes are Pro
   features and are dropped silently — don't add code that pretends otherwise. The XLSX
   exporter invests in what CE does support: a sheet per table, column widths, blank cells.

### Marketing Missions (`bytelab` blocks)

`{ t: 'bytelab', id, title, intro, examples?, fields: [...], cta, recipe }` renders an
interactive mission: the learner fills in fields (persisted via the `worksheets` store)
and Byte answers. Answers come from **`src/lib/byteLab.js`**, which produces them locally
from hand-authored recipes — no network, no API key, no failure mode. `recipe` must match
a key in that file's `RECIPES` map.

To wire up a live model later, replace the body of `generate()` — it is the single
integration point — keeping the same `{ headline, scores?, sections[], note? }` result
shape and falling back to the local recipes on error.

Recipes are split per course and merged in `byteLab.js`:

| File | Holds |
|------|-------|
| `src/lib/byteLabKit.js` | shared analysis/scoring helpers (no course knows about another) |
| `src/lib/byteLab.js` | AI Marketing OS recipes · the merge · `generate()` |
| `src/lib/byteLabJobHunter.js` | AI Job Hunter OS recipes |

**Two rules learned the hard way** when writing scoring recipes:
1. The headline verdict must derive from the same score the learner is about to read, or
   it contradicts the bars underneath it.
2. Never echo the learner's raw text back into a "better version" — if it's full of
   fluff you'll produce nonsense ("Led responsible for managing the accounts…"). Use
   `bulletCore()` / the `usable` flag to rebuild from the core instead.

## Design system (brand pivot)

Calm and trustworthy, derived from the mascots' green:

| Token | Value | Use |
|-------|-------|-----|
| `canvas` | `#FAFCFA` | page background |
| `card` | `#FFFFFF` | cards |
| `sage-50/100/200` | light sage | sidebar, subtle surfaces, hovers |
| `line` | subtle neutral-green | borders |
| `ink-900…600` | near-black green | text |
| `brand-*` | mascot green | primary, buttons, progress, success |
| `gold-*` | warm gold | achievements |
| `sun-*` | muted amber | warnings |

No purple, neon, pink, or cyber-blue. Tone keys in `src/lib/tones.js` are stable
(`brand/mint/flamingo/sun/sky2/lime`) and map onto the green-centric palette.

### Branding

The wordmark is `src/components/StaigeMark.jsx` — text, not an image, so it stays crisp and
costs nothing to load. The **AI** inside ST·AI·GE uses `.heading-accent` (solid
`brand-600`), the exact same class every accented heading uses, so the brand green can never
drift from the platform green. It sits top-left in both chromes and links home.

### Headings never use gradient text

Heading text is always a **solid** colour — `text-ink-900`, with `.heading-accent`
(solid `brand-600`) for an accented word. Gradient *backgrounds* on cards and progress
bars are fine; gradient **text** is not — it washes out at small sizes and loses contrast
against the canvas. There is no `.gradient-text` utility; use `.heading-accent`.

## Capy & Byte mascot (`src/components/MascotAdvisor.jsx`)

One official mascot image — Capy (the entrepreneur, that's you) lounging while Byte
(your AI sidekick) does the busywork. The art is **never distorted or sprite-sheeted**;
all life comes from the *surrounding* UI — a soft green glow pulse, floating
holographic HTML/CSS cards around Byte, and an on-click speech bubble. Everything
respects `prefers-reduced-motion`.

- `MascotAdvisor` — the single reusable component. Pass a `mode`:

  | mode | Where |
  |------|-------|
  | `hero` | dashboard hero (right side, inside the card) — glow + floating cards + speech bubble |
  | `lesson` | smaller advisor near lesson intros / "Byte says" tips |
  | `success` | lesson / module / challenge completion |
  | `empty` | empty states & "nothing here yet" sections |
  | `mini` | floating circular advisor button, bottom-right; minimized until clicked |

- `src/components/mascots/` — thin legacy exports (`Byte`, `Capy`, `CapyByteHero`, …)
  kept so existing placements stay byte-for-byte the same; all now resolve to the new art.

### Regenerating mascot art

The source render lives at `Assets/final image.png`. To rebuild the transparent
WebP assets (duo + solo Capy/Byte crops, white background knocked out by
connectivity so Byte's white body survives):

```bash
node scripts/build-mascot.mjs   # → public/mascots/{mascot,capy,byte}.webp
```

## What's inside

6 modules / 19 lessons (block model in `src/data/course.js`, rendered by
`src/components/Blocks.jsx`), interactive quizzes/checklists/worksheets/scorecards/trackers
(auto-saved + exportable), a searchable 100-prompt library, 50 filterable hustle ideas, a
30-day content calendar, a filterable resource vault, a gated 7-day challenge, and green+gold
achievement badges with confetti celebrations.

## Data persistence

Everything lives under the `ai-side-hustle-os` localStorage key. No backend, no telemetry.
Worksheets and the challenge export to `.txt`.
