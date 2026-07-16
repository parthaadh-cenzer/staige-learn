// ============================================================================
//  PRODUCT CATALOGUE · the one place pricing is written down.
//
//  Imported by BOTH the browser bundle and the serverless functions, so it must
//  contain NO SECRETS — no Stripe keys, no service-role key, and deliberately no
//  Price ID VALUES. It names the environment variables that hold the Price IDs;
//  only the server ever reads them (api/_lib/pricing.mjs).
//
//  The frontend uses this to DISPLAY prices. It never sends a price or a Price
//  ID to the server — /api/checkout accepts a product key and nothing else, and
//  resolves the amount itself. So a tampered bundle can change what a visitor
//  sees, but not what they are charged.
//
//  To change a price: update Stripe, update the numbers here, redeploy. One edit.
// ============================================================================

export const CURRENCY = 'usd'

// Turning the introductory offer off is a one-word edit per product, and it is
// the ONLY switch. See docs/LAUNCH.md → "Ending the introductory offer".
export const PRODUCTS = {
  'side-hustle': {
    key: 'side-hustle',
    courseSlug: 'ai-side-hustle-os',
    name: 'AI Side Hustle OS',
    regularPrice: 10,
    introductoryPrice: 5,
    currency: CURRENCY,
    introductoryOfferActive: true,
    // null = no end date claimed. Only set this to a real ISO date if the offer
    // genuinely ends then — the UI shows a date only when one exists here, and
    // there is no countdown timer anywhere.
    introductoryOfferEndsAt: null,
    priceEnv: { regular: 'STRIPE_PRICE_SIDE_HUSTLE_REGULAR', intro: 'STRIPE_PRICE_SIDE_HUSTLE_INTRO' },
  },
  marketing: {
    key: 'marketing',
    courseSlug: 'ai-marketing-os',
    name: 'AI Marketing OS',
    regularPrice: 10,
    introductoryPrice: 5,
    currency: CURRENCY,
    introductoryOfferActive: true,
    introductoryOfferEndsAt: null,
    priceEnv: { regular: 'STRIPE_PRICE_MARKETING_REGULAR', intro: 'STRIPE_PRICE_MARKETING_INTRO' },
  },
  'job-hunter': {
    key: 'job-hunter',
    courseSlug: 'ai-job-hunter-os',
    name: 'AI Job Hunter OS',
    regularPrice: 10,
    introductoryPrice: 5,
    currency: CURRENCY,
    introductoryOfferActive: true,
    introductoryOfferEndsAt: null,
    priceEnv: { regular: 'STRIPE_PRICE_JOB_HUNTER_REGULAR', intro: 'STRIPE_PRICE_JOB_HUNTER_INTRO' },
  },
}

export const productList = Object.values(PRODUCTS)

export const productByKey = (key) => PRODUCTS[key]
export const productForCourse = (slug) => productList.find((p) => p.courseSlug === slug)

// Is the offer live *right now*? An end date in the past retires the offer on
// its own, so nobody has to remember to flip the flag.
export function offerIsLive(product, now = new Date()) {
  if (!product?.introductoryOfferActive) return false
  if (!product.introductoryOfferEndsAt) return true
  return new Date(product.introductoryOfferEndsAt) > now
}

// Which tier a purchase happens at, and therefore which Price ID the server
// resolves. Client and server call this same function — that's what keeps the
// displayed price and the charged price from drifting apart.
export const activeTier = (product, now) => (offerIsLive(product, now) ? 'intro' : 'regular')
export const activePrice = (product, now) =>
  offerIsLive(product, now) ? product.introductoryPrice : product.regularPrice

// Display helpers. $10 and $5 are whole dollars today; this still formats
// correctly if that ever stops being true.
export const formatPrice = (amount, currency = CURRENCY) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)

// Everything the UI needs to render a price, derived in one place so no
// component has to reason about the offer rules.
export function priceView(product, now) {
  if (!product) return null
  const live = offerIsLive(product, now)
  return {
    key: product.key,
    live,
    amount: live ? product.introductoryPrice : product.regularPrice,
    display: formatPrice(live ? product.introductoryPrice : product.regularPrice, product.currency),
    strikethrough: live ? formatPrice(product.regularPrice, product.currency) : null,
    endsAt: live ? product.introductoryOfferEndsAt : null,
    label: live ? 'Introductory Offer' : null,
    note: live ? 'Launch pricing for a limited time.' : null,
  }
}
