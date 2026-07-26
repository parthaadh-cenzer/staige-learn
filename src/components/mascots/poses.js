// Central mascot registry — single source of truth for Capy & Byte art.
// Only truly-transparent assets live here (carved from the clean "hero" render).
// Staige note: to reuse this framework, copy /public/mascots + this file.
export const POSES = {
  hero: '/mascots/mascot.webp', // Capy + Byte duo (the one official mascot image)
  duo: '/mascots/mascot.webp',
  capy: '/mascots/capy.webp', // Capy solo — the entrepreneur (the student)
  byte: '/mascots/byte.webp', // Byte solo — the AI assistant
}

export const poseList = Object.keys(POSES)

// Contextual mascot per module: which character leads + an in-character line.
// Capy fronts the "you do the work" modules; Byte fronts the AI-tooling ones.
export const MODULE_MASCOT = {
  // AI Side Hustle OS
  m1: { pose: 'capy', line: 'Capy’s picking a lane. Your turn to choose.' },
  m2: { pose: 'byte', line: 'Byte’s scanning for real, paid-for demand.' },
  m3: { pose: 'capy', line: 'Capy’s shaping an offer people actually want.' },
  m4: { pose: 'byte', line: 'Byte’s loading the only tools you need.' },
  m5: { pose: 'capy', line: 'Capy’s about to hit publish. Ugly is fine.' },
  m6: { pose: 'byte', line: 'Byte’s hunting down your first 10 visitors.' },

  // AI Marketing OS — Capy fronts the modules where you do the work,
  // Byte fronts the ones where the machine does the lifting.
  'mkt-m1': { pose: 'capy', line: 'Capy’s hiring his first AI teammate.' },
  'mkt-m2': { pose: 'byte', line: 'Byte’s turning one idea into a week of content.' },
  'mkt-m3': { pose: 'capy', line: 'Capy’s making it look like a brand.' },
  'mkt-m4': { pose: 'byte', line: 'Byte’s doing the editing so you don’t have to.' },
  'mkt-m5': { pose: 'capy', line: 'Capy’s distributing, not just posting.' },
  'mkt-m6': { pose: 'byte', line: 'Byte’s building the list you actually own.' },
  'mkt-m7': { pose: 'byte', line: 'Byte’s finding the pattern in your numbers.' },
  'mkt-m8': { pose: 'capy', line: 'Capy’s week now runs without him.' },

  // AI App Builder OS — Capy fronts the modules where you decide and ship,
  // Byte fronts the ones where the tooling does the lifting.
  'ab-m1': { pose: 'capy', line: 'Capy’s about to publish his first site. Nervously.' },
  'ab-m2': { pose: 'byte', line: 'Byte’s hunting references, not blank canvases.' },
  'ab-m3': { pose: 'capy', line: 'Capy’s treating this one like a real client.' },
  'ab-m4': { pose: 'byte', line: 'Byte’s cutting the feature list down to Version 1.' },
  'ab-m5': { pose: 'byte', line: 'Byte’s adding one AI feature. Only one.' },
  'ab-m6': { pose: 'capy', line: 'Capy’s obsessing over the last 10%.' },
  'ab-m7': { pose: 'capy', line: 'Capy’s hitting publish before it’s perfect.' },
  'ab-m8': { pose: 'byte', line: 'One sentence. No brief. Byte’s not helping this time.' },
  'ab-m9': { pose: 'capy', line: 'Capy’s building the one he actually cares about.' },
}

// Which character narrates each bonus area.
export const BONUS_MASCOT = {
  prompts: 'byte',
  ideas: 'capy',
  calendar: 'capy',
  vault: 'byte',
  badges: 'capy',
  challenge: 'capy',
}
