// ============================================================================
//  /checkout/success · /checkout/cancel
//
//  IMPORTANT: reaching /checkout/success unlocks NOTHING. Anyone can type this
//  URL. All this page does is ask the database, on a short poll, whether the
//  webhook has granted access yet — and the webhook only runs after Stripe has
//  confirmed the payment. The success URL is a place to wait, not a proof.
// ============================================================================
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Loader2, Clock } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider'
import { getCourseBySlug, courseBase } from '../data/courses'
import { Capy } from '../components/mascots'

// Card networks usually settle in a second or two, but the webhook is a network
// hop of its own. Poll politely, then hand over to a "we'll email you" message
// rather than spinning forever.
const POLL_MS = 2000
const GIVE_UP_MS = 40000

export function CheckoutSuccess() {
  const { user, loading, ownsCourse, refreshEntitlements } = useAuth()
  const [params] = useSearchParams()
  const [waited, setWaited] = useState(0)

  // `?course=` says which entitlement to wait for. It is only a hint: the
  // celebration below renders solely because ownsCourse() — which reads
  // `course_access` through RLS — says the row exists. Editing this parameter
  // changes which course we ask about, and nothing else.
  const course = getCourseBySlug(params.get('course') || '')
  const unlocked = Boolean(course && ownsCourse(course.slug))

  useEffect(() => {
    if (unlocked || !user || loading) return
    if (waited >= GIVE_UP_MS) return
    const t = setTimeout(() => {
      refreshEntitlements()
      setWaited((w) => w + POLL_MS)
    }, POLL_MS)
    return () => clearTimeout(t)
  }, [unlocked, user, loading, waited, refreshEntitlements])

  if (unlocked) {
    return (
      <Frame>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-ink-900">You’re in.</h1>
        <p className="mt-2 text-muted">
          <strong className="text-ink-900">{course.title}</strong> is unlocked on your account. It’ll be
          waiting on any device you sign in to.
        </p>
        <Link to={courseBase(course.slug)} className="btn-primary mt-6 justify-center">
          Start the course
        </Link>
        <Link to="/courses" className="btn-ghost mt-2.5 justify-center">Browse all courses</Link>
      </Frame>
    )
  }

  if (waited >= GIVE_UP_MS) {
    return (
      <Frame>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sage-50 text-faint">
          <Clock className="h-6 w-6" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-ink-900">Your payment is still being confirmed</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          This occasionally takes a few minutes. Your course unlocks automatically the moment it clears —
          you don’t need to pay again or do anything else. Refresh this page, or check back shortly.
        </p>
        <button onClick={() => refreshEntitlements()} className="btn-primary mt-6 justify-center">
          Check again
        </button>
        <Link to="/" className="btn-ghost mt-2.5 justify-center">Back to STAIGE</Link>
      </Frame>
    )
  }

  return (
    <Frame>
      <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-600" />
      <h1 className="mt-4 font-display text-2xl font-extrabold text-ink-900">Confirming your payment…</h1>
      <p className="mt-2 text-sm text-muted">One moment — we’re waiting for Stripe to confirm. Don’t close this tab.</p>
    </Frame>
  )
}

export function CheckoutCancel() {
  const [params] = useSearchParams()
  const course = getCourseBySlug(params.get('course') || '')

  return (
    <Frame>
      <h1 className="font-display text-2xl font-extrabold text-ink-900">No payment was taken</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        You cancelled at checkout, so nothing was charged.
        {course && ' Your place in the free preview is exactly where you left it.'}
      </p>
      {course ? (
        <Link to={courseBase(course.slug)} className="btn-primary mt-6 justify-center">
          Back to {course.title}
        </Link>
      ) : (
        <Link to="/courses" className="btn-primary mt-6 justify-center">Browse courses</Link>
      )}
      <Link to="/" className="btn-ghost mt-2.5 justify-center">Back to STAIGE</Link>
    </Frame>
  )
}

const Frame = ({ children }) => (
  <div className="mx-auto flex w-full max-w-md flex-col items-center py-12">
    <Capy size={76} className="mb-4" />
    <div className="card flex w-full flex-col p-8 text-center">{children}</div>
  </div>
)
