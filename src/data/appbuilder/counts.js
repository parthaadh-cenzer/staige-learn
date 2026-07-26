// ============================================================================
//  BUILDER VAULT COUNTS · the numbers, without the payload.
//
//  WHY THIS FILE EXISTS. The course registry (src/data/courses/*) ships in the
//  MAIN bundle — the homepage needs lesson ids to compute progress, so every
//  course object is loaded up front. The Builder Vault's data is not small
//  (95 full prompts alone are ~38 kB), and none of it is needed until someone
//  opens a vault page, which lives in the lazily-loaded CourseShell chunk.
//
//  Importing recipes.js just to write "95 recipes" on a dashboard card would
//  drag all of it onto the landing page for every visitor, including the ones
//  who never sign in. So the registry imports these six integers instead, and
//  the vault pages import the real data.
//
//  KEEPING THEM HONEST: src/data/appbuilder/vault.js derives the same counts
//  from the actual arrays and, in development, warns loudly if any number here
//  disagrees. A stale count is therefore a console warning during the very next
//  dev run, not something that quietly ships.
// ============================================================================

export const VAULT_COUNTS = {
  recipes: 95,
  templates: 20,
  sites: 50,
  palettes: 20,
  fonts: 15,
  ideas: 90,
  resources: 72,
  launchItems: 58,
  uiuxItems: 67,
}
