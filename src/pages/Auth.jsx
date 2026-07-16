// ============================================================================
//  AUTH · /login · /signup · /forgot-password · /reset-password
//  One file, four routes — the same shape Legal.jsx uses. The forms differ by a
//  field and a verb; splitting them would duplicate the shell four times.
//
//  Real Supabase auth throughout. There is no bypass, no demo account and no
//  "pretend I'm logged in" path.
// ============================================================================
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, Mail, Lock, User, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../auth/AuthProvider'
import { Capy } from '../components/mascots'

const MIN_PASSWORD = 8

// Supabase's raw errors are written for developers. "Failed to fetch" in
// particular is what a learner sees when their wifi drops — telling them that
// verbatim helps nobody.
function humanError(err) {
  const raw = err?.message || ''
  if (/failed to fetch|networkerror|load failed/i.test(raw)) {
    return 'We couldn’t reach the server. Check your connection and try again.'
  }
  if (/invalid login credentials/i.test(raw)) {
    // Deliberately vague about WHICH is wrong — naming the email would confirm
    // to a stranger that an account exists.
    return 'That email and password don’t match. Please try again.'
  }
  if (/email not confirmed/i.test(raw)) {
    return 'Please open the confirmation link we emailed you, then sign in.'
  }
  if (/user already registered/i.test(raw)) {
    return 'An account already exists for that email. Try signing in instead.'
  }
  if (/rate limit|too many/i.test(raw)) {
    return 'Too many attempts. Please wait a minute and try again.'
  }
  return raw || 'Something went wrong. Please try again.'
}

const COPY = {
  login: { title: 'Welcome back', blurb: 'Sign in to pick up where you left off.', cta: 'Sign in' },
  signup: { title: 'Create your account', blurb: 'Your progress syncs across every device you learn on.', cta: 'Create account' },
  'forgot-password': { title: 'Reset your password', blurb: "We'll email you a link to set a new one.", cta: 'Send reset link' },
  'reset-password': { title: 'Choose a new password', blurb: 'Almost done — pick something you’ll remember.', cta: 'Update password' },
}

export default function Auth({ page = 'login' }) {
  const copy = COPY[page]
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { user, loading: authLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(null)

  // Where to go after a successful sign-in. Only same-site paths are honoured,
  // so a crafted ?next=https://… link can't bounce someone off the platform.
  const next = (() => {
    const raw = params.get('next') || ''
    return raw.startsWith('/') && !raw.startsWith('//') ? raw : '/'
  })()

  // Already signed in? Nothing to do here.
  useEffect(() => {
    if (page === 'reset-password') return // the recovery link creates a session on purpose
    if (!authLoading && user) navigate(next, { replace: true })
  }, [authLoading, user, page, next, navigate])

  if (!isSupabaseConfigured) {
    return (
      <Shell title="Accounts aren’t available yet">
        <p className="text-sm leading-relaxed text-ink-700">
          Sign-in isn’t configured on this deployment yet. If you’re running STAIGE locally, add your
          Supabase keys to <code className="rounded bg-sage-50 px-1.5 py-0.5 text-xs">.env.local</code> — see{' '}
          <code className="rounded bg-sage-50 px-1.5 py-0.5 text-xs">.env.example</code>.
        </p>
        <Link to="/" className="btn-ghost mt-5 w-full justify-center">Back to STAIGE</Link>
      </Shell>
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (page === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate(next, { replace: true })
        return
      }

      if (page === 'signup') {
        if (password.length < MIN_PASSWORD) throw new Error(`Password must be at least ${MIN_PASSWORD} characters.`)
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name.trim() || undefined },
            emailRedirectTo: `${window.location.origin}/login`,
          },
        })
        if (error) throw error
        // With email confirmation on, there's no session yet — say so instead of
        // dumping them on a page that still shows "Sign in".
        if (!data.session) {
          setDone(`We’ve sent a confirmation link to ${email}. Open it to activate your account.`)
          return
        }
        navigate(next, { replace: true })
        return
      }

      if (page === 'forgot-password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
        // Deliberately not "no account found" — that would let anyone probe which
        // email addresses have accounts.
        setDone(`If an account exists for ${email}, a reset link is on its way.`)
        return
      }

      if (page === 'reset-password') {
        if (password.length < MIN_PASSWORD) throw new Error(`Password must be at least ${MIN_PASSWORD} characters.`)
        const { error } = await supabase.auth.updateUser({ password })
        if (error) throw error
        setDone('Password updated. You’re signed in.')
        setTimeout(() => navigate('/', { replace: true }), 1200)
        return
      }
    } catch (err) {
      setError(humanError(err))
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <Shell title={copy.title}>
        <div className="flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
          <p className="text-sm leading-relaxed text-ink-700">{done}</p>
        </div>
        <Link to="/" className="btn-ghost mt-5 w-full justify-center">Back to STAIGE</Link>
      </Shell>
    )
  }

  return (
    <Shell title={copy.title} blurb={copy.blurb}>
      <form onSubmit={submit} className="space-y-4">
        {page === 'signup' && (
          <Field icon={User} label="Your name" value={name} onChange={setName}
                 autoComplete="name" placeholder="Alex" />
        )}

        {page !== 'reset-password' && (
          <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail}
                 autoComplete="email" placeholder="you@example.com" required />
        )}

        {page !== 'forgot-password' && (
          <Field
            icon={Lock}
            label={page === 'reset-password' ? 'New password' : 'Password'}
            type="password" value={password} onChange={setPassword}
            autoComplete={page === 'login' ? 'current-password' : 'new-password'}
            placeholder="••••••••" required
            hint={page !== 'login' ? `At least ${MIN_PASSWORD} characters.` : null}
          />
        )}

        {error && (
          <div role="alert" className="flex items-start gap-2.5 rounded-2xl border border-flamingo-200 bg-flamingo-50 p-3.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-flamingo-500" />
            <p className="text-sm text-ink-700">{error}</p>
          </div>
        )}

        <button type="submit" disabled={busy} className="btn-primary w-full justify-center">
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Working…</> : copy.cta}
        </button>
      </form>

      <div className="mt-5 space-y-2 text-center text-sm">
        {page === 'login' && (
          <>
            <p className="text-muted">
              New here? <Link to="/signup" className="font-semibold text-brand-600 hover:underline">Create an account</Link>
            </p>
            <p><Link to="/forgot-password" className="text-faint hover:underline">Forgot your password?</Link></p>
          </>
        )}
        {page === 'signup' && (
          <p className="text-muted">
            Already have an account? <Link to="/login" className="font-semibold text-brand-600 hover:underline">Sign in</Link>
          </p>
        )}
        {(page === 'forgot-password' || page === 'reset-password') && (
          <Link to="/login" className="inline-flex items-center gap-1.5 text-faint hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
        )}
      </div>
    </Shell>
  )
}

function Shell({ title, blurb, children }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center py-10">
      <Capy size={72} className="mb-4" />
      <div className="card w-full p-7">
        <h1 className="font-display text-2xl font-extrabold text-ink-900">{title}</h1>
        {blurb && <p className="mt-1.5 mb-6 text-sm text-muted">{blurb}</p>}
        {!blurb && <div className="mb-6" />}
        {children}
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, hint, value, onChange, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink-900">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
        <input {...props} value={value} onChange={(e) => onChange(e.target.value)} className="input !pl-11" />
      </div>
      {hint && <span className="mt-1.5 block text-xs text-faint">{hint}</span>}
    </label>
  )
}
