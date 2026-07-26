# AI App Builder OS · content generators

These two scripts turn the source course document into the structured data files
under `src/data/appbuilder/`. They are checked in so the generated files are
**reproducible** rather than a one-off hand transcription that nobody can verify
or regenerate.

They are **not** part of the build. `npm run build` never runs them, and the raw
`.docx` is deliberately never shipped to the browser — only the generated `.js`.

## What's generated vs. hand-authored

| File | Source |
|---|---|
| `recipes.js` | generated — 95 build prompts, verbatim |
| `study.js` | generated — 50 websites + what to study |
| `palettes.js` | generated — 20 palettes × 5 HEX codes |
| `fonts.js` | generated — 15 pairings + the typography rules |
| `appIdeas.js` | generated — 90 ideas (see "enrichment" below) |
| `checklists.js` | generated — Launch (9×58) + UI/UX (11×67) |
| `intro.js`, `modules-*.js`, `course.js` | **hand-authored** — narrative lessons mapped onto typed blocks |
| `resources.js` | **hand-authored** — the document names 72 tools but supplies no URLs, descriptions or pricing |
| `templates.js` | **hand-authored** — the roadmap + the technical standard |
| `downloads.js` | **hand-authored** — module resource cards and their honest availability state |
| `counts.js` | **hand-authored** — integers for the main bundle; `vault.js` warns in dev if one drifts |

## Running them

```bash
# 1 · DOCX → a line-oriented text file (heading level, list depth, runs)
node scripts/appbuilder/extract-docx.mjs      # expects ./unz/word/document.xml

# 2 · text → the generated data files
node scripts/appbuilder/build-vault.mjs src/data/appbuilder
```

`build-vault.mjs` **asserts** its own output — 95 recipes each with a non-empty
prompt, 50 study sites, 20 palettes, 15 pairings, 90 fully-classified ideas. If
the source document changes shape, it fails loudly instead of quietly emitting a
short library.

## The one place content is added rather than extracted

The document writes the **Productivity** category of the App Idea Generator in
full (description + difficulty + monetisation) and the other eight categories as
bare lists of names. The `ENRICH` table in `build-vault.mjs` supplies the missing
one-liner and badges for those 80 ideas. It lives in the script, checked in, so
the output is identical on every run — nothing is invented at generation time.
No idea is renamed or reclassified; each description restates the idea the
document already named.

Two smaller normalisations, both commented at their call site:

- Palettes 11–20 carry no `Best For:` line; their label restates the palette's
  own name (`Cyberpunk` → "Gaming, Web3, Neon UI").
- One idea's monetisation reads `Ads / Premium` where every other is a single
  label; it's filed as `Freemium`, which is what the rest of the document calls
  free-with-a-paid-upgrade.
