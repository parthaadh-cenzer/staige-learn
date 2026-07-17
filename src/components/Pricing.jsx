// ============================================================================
//  PRICING UI · the only place that renders a price or a buy button.
//
//  Every number and every word about the offer comes from shared/catalog.mjs via
//  priceView(). Nothing here hardcodes "$5", "$10" or "Introductory Offer", so
//  changing the price is one edit in one file and every surface follows.
//
//  There is no countdown timer. An end date is shown only when the catalogue
//  actually has one — no invented urgency.
// ============================================================================
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { priceView } from '../../shared/catalog.mjs'
import { useAuth } from '../auth/AuthProvider'
import { apiPost } from '../lib/supabase'
import { ACCESS } from '../course/access'

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

/** The price, with the regular price struck through while the offer is live. */
export function PriceTag({ course, size = 'md', className = '' }) {
  const view = priceView(course?.product)
  if (!view) return null

  const big = size === 'lg'
  return (
    <div className={`flex flex-wrap items-baseline gap-x-2.5 gap-y-1 ${className}`}>
      <span className={`font-display font-extrabold text-ink-900 ${big ? 'text-3xl' : 'text-xl'}`}>
        {view.display}
      </span>
      {view.strikethrough && (
        <>
          <span className={`text-faint line-through ${big ? 'text-lg' : 'text-sm'}`}>{view.strikethrough}</span>
          <span className="pill border-brand-200 bg-brand-50 text-brand-600">{view.label}</span>
        </>
      )}
    </div>
  )
}

/**
 * The supporting copy under the price.
 *
 * "One-time payment. No subscription." is unconditional — it's true whether or
 * not the launch offer is running, and it's the thing a buyer most wants
 * confirmed before clicking. The offer line only appears while the offer is
 * live, and an end date only if the catalogue actually has one. No countdown.
 */
export function PriceNote({ course, className = '' }) {
  const view = priceView(course?.product)
  if (!view) return null
  return (
    <p className={`text-xs leading-relaxed text-faint ${className}`}>
      {view.note && (
        <>
          {view.note}
          {view.endsAt && ` Offer ends ${fmtDate(view.endsAt)}.`}
          <br />
        </>
      )}
      One-time payment. No subscription.
    </p>
  )
}

/**
 * Starts Checkout. Sends only the product key — the price is the server's
 * decision (api/_lib/pricing.mjs), so this button cannot name an amount.
 */
export function BuyButton({ course, className = '', label, signedOutLabel = 'Sign In to Purchase', returnTo }) {
  const { user, ownsCourse } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  if (!course?.requiresPurchase) return null

  const owned = ownsCourse(course.slug)
  if (owned) {
    return (
      <span className={`inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-600 ${className}`}>
        <CheckCircle2 className="h-4 w-4" /> Course Owned
      </span>
    )
  }

  const view = priceView(course.product)

  const buy = async () => {
    if (!user) {
      // Come back to where they were after signing in. `returnTo` lets the OS
      // sales page send them back to itself; other surfaces default to the
      // course overview. A crafted value can only change navigation, never
      // access, so no validation beyond same-site is needed here.
      const dest = returnTo || `/launchpad/${course.slug}`
      navigate(`/login?next=${encodeURIComponent(dest)}`)
      return
    }
    setBusy(true)
    setError(null)
    try {
      const data = await apiPost('/api/checkout', { productKey: course.productKey })
      if (data.alreadyOwned) {
        // Entitlement landed between page load and click.
        window.location.reload()
        return
      }
      window.location.href = data.url
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  // Signed-out visitors are told what the button will do before it does it —
  // clicking sends them to sign in, not to Stripe. Purchases are tied to an
  // account, so there is no anonymous checkout to offer them. `label` overrides
  // the signed-in text; `signedOutLabel` overrides the signed-out text.
  const text = label || (user ? `Buy for ${view.display}` : signedOutLabel)

  return (
    <div className={className}>
      <button onClick={buy} disabled={busy} className="btn-primary w-full justify-center">
        {busy
          ? <><Loader2 className="h-4 w-4 animate-spin" /> Taking you to checkout…</>
          : text}
      </button>
      {error && (
        <p role="alert" className="mt-2 flex items-start gap-1.5 text-xs text-flamingo-500">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  )
}

/**
 * The offer, on the course overview. The overview is public — it IS the sales
 * page — so this is where a visitor who likes what they see actually buys.
 * Renders nothing for owners and nothing for courses that aren't for sale, so
 * the page is unchanged for anyone it doesn't apply to.
 */
export function CoursePurchasePanel({ course }) {
  const { loading, ownsCourse } = useAuth()

  if (!course?.requiresPurchase) return null
  // Say nothing rather than flash an offer at someone who already owns it.
  // `loading` is only about ownership — the price itself needs no session.
  if (loading || ownsCourse(course.slug)) return null

  const preview = course.allLessons?.[0]

  return (
    <div className="card border-brand-200 bg-brand-50 p-6">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold text-ink-900">Get the full course</h2>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-700">
            All {course.moduleCount} modules · {course.totalLessons} lessons · every prompt, template and download.
            {preview && ' Lesson 1 is free to read first.'}
          </p>
          <PriceNote course={course} className="mt-2" />
        </div>
        <div className="flex shrink-0 flex-col gap-2.5">
          <PriceTag course={course} size="lg" />
          <BuyButton course={course} />
        </div>
      </div>
    </div>
  )
}

/**
 * The locked state. Shown in place of gated content — never as a modal over
 * readable text, and never with the content merely hidden behind it.
 */
export function CourseLock({ course, reason, what = 'This part of the course' }) {
  const view = priceView(course?.product)

  return (
    <div className="card mx-auto max-w-lg p-8 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sage-50 text-faint">
        <Lock className="h-6 w-6" />
      </span>
      <h2 className="mt-4 font-display text-2xl font-extrabold text-ink-900">
        {what} is part of {course.title}
      </h2>

      {reason === ACCESS.SIGN_IN ? (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Sign in to check whether you already own it — or get it below.
          </p>
          <div className="mt-5 flex flex-col gap-2.5">
            <Link to={`/login?next=${encodeURIComponent(`/launchpad/${course.slug}`)}`} className="btn-primary justify-center">
              Sign in
            </Link>
            <BuyButton course={course} label={`Create an account & get it — ${view?.display}`} />
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            One payment. Every lesson, prompt, template and download in the course.
          </p>
          <div className="mt-5 flex flex-col items-center gap-3">
            <PriceTag course={course} size="lg" className="justify-center" />
            <PriceNote course={course} />
            <BuyButton course={course} className="w-full" />
          </div>
        </>
      )}

      <p className="mt-5 text-xs text-faint">
        Your progress is saved to your account and syncs across your devices.
      </p>
    </div>
  )
}
