// ============================================================================
//  SERVER-SIDE PRICE AUTHORITY
//
//  The browser never names a price. It names a PRODUCT KEY ('side-hustle'), and
//  this module decides which Stripe Price that means, by reading the approved
//  Price ID out of the server environment. Two consequences that matter:
//
//    1. A tampered client cannot buy AI Marketing OS for $0.50, because it has
//       no way to express an amount at all.
//    2. The webhook can ask the reverse question — "does the Price that was
//       actually paid belong to a product we sell?" — and refuse to grant access
//       when the answer is no.
// ============================================================================
import { PRODUCTS, activeTier, productByKey } from '../../shared/catalog.mjs'
import { requireEnv } from './env.mjs'

// The Price ID a checkout for this product must use, right now.
export function resolveActivePrice(productKey) {
  const product = productByKey(productKey)
  if (!product) throw new Error(`Unknown product key: ${productKey}`)

  const tier = activeTier(product)
  const priceId = requireEnv(product.priceEnv[tier])
  return { product, tier, priceId }
}

// Every Price ID we are willing to honour, mapped back to its product and tier.
// Built from the environment on each call — the set of configured prices is not
// worth caching across a cold start, and a stale map here would be a security
// bug rather than a performance one.
export function approvedPrices() {
  const map = new Map()
  for (const product of Object.values(PRODUCTS)) {
    for (const tier of ['regular', 'intro']) {
      const id = process.env[product.priceEnv[tier]]
      if (id) map.set(id, { product, tier })
    }
  }
  return map
}

// Webhook guard. Returns the product a paid Price belongs to, or null if the
// Price is not one of ours — a Price created by hand in the dashboard, a Price
// from another product, or a Price we have since retired all land here.
export const productForPriceId = (priceId) => approvedPrices().get(priceId) || null
