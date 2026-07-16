// /profile — the learner's account: who they are, what they own, how to leave.
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, LogOut, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider'
import { supabase } from '../lib/supabase'
import { activeCourses, courseBase } from '../data/courses'
import { courseProgress } from '../course/progress'
import { useStore } from '../store/useStore'
import { PriceTag, BuyButton } from '../components/Pricing'
import { Capy } from '../components/mascots'

export default function Profile() {
  const { user, profile, loading, ownedSlugs, refreshProfile, signOut } = useAuth()
  const navigate = useNavigate()
  const completed = useStore((s) => s.completed)

  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setName(profile?.display_name || '') }, [profile?.display_name])

  // RequireAuth guards this route, so a missing user here means we're still
  // resolving the session rather than that they're signed out.
  if (loading || !user) {
    return <div className="grid min-h-[40vh] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-faint" /></div>
  }

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setSaved(false)
    await supabase.from('profiles').update({ display_name: name.trim() || null }).eq('user_id', user.id)
    await refreshProfile()
    setBusy(false)
    setSaved(true)
  }

  const owned = activeCourses.filter((c) => ownedSlugs?.has(c.slug))
  const notOwned = activeCourses.filter((c) => !ownedSlugs?.has(c.slug))

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-8">
      <div className="flex items-center gap-4">
        <Capy size={68} className="shrink-0" />
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">Your account</h1>
          <p className="text-muted">{user.email}</p>
        </div>
      </div>

      <form onSubmit={save} className="card space-y-4 p-6">
        <h2 className="font-display text-lg font-bold text-ink-900">Profile</h2>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-900">Display name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="What should we call you?" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-900">Email</span>
          <input value={user.email} disabled className="input opacity-60" />
          <span className="mt-1.5 block text-xs text-faint">Your email is how you sign in and where receipts go.</span>
        </label>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : 'Save changes'}
          </button>
          {saved && <span className="flex items-center gap-1.5 text-sm text-brand-600"><CheckCircle2 className="h-4 w-4" /> Saved</span>}
        </div>
      </form>

      <section className="card p-6">
        <h2 className="font-display text-lg font-bold text-ink-900">Your courses</h2>
        {owned.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            You haven’t added a course yet. Every course has a free preview lesson —{' '}
            <Link to="/courses" className="font-semibold text-brand-600 hover:underline">have a look around</Link>.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {owned.map((c) => {
              const pct = courseProgress(c, completed)
              return (
                <li key={c.slug}>
                  <Link to={courseBase(c.slug)} className="flex items-center gap-4 rounded-2xl border border-line p-4 transition hover:bg-sage-50">
                    <span className="text-2xl">{c.art?.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display font-bold text-ink-900">{c.title}</span>
                      <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-sage-50">
                        <span className="block h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-muted">{pct}%</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {notOwned.length > 0 && (
        <section className="card p-6">
          <h2 className="font-display text-lg font-bold text-ink-900">Add another course</h2>
          <ul className="mt-4 space-y-4">
            {notOwned.map((c) => (
              <li key={c.slug} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line p-4">
                <span className="text-2xl">{c.art?.emoji}</span>
                <span className="min-w-0 flex-1">
                  <Link to={courseBase(c.slug)} className="block font-display font-bold text-ink-900 hover:underline">{c.title}</Link>
                  <span className="mt-0.5 block text-sm text-muted">{c.subtitle}</span>
                </span>
                <PriceTag course={c} />
                <BuyButton course={c} className="w-full sm:w-auto" label="Get it" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card p-6">
        <h2 className="font-display text-lg font-bold text-ink-900">Session</h2>
        <p className="mt-1 text-sm text-muted">
          You’ll stay signed in on this device until you sign out. Your progress is saved to your account either way.
        </p>
        <button
          onClick={async () => { await signOut(); navigate('/') }}
          className="btn-ghost mt-4"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>
    </div>
  )
}
