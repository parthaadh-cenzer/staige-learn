// ============================================================================
//  HomeLayout — the chrome for the platform-level pages (Home, Courses,
//  Settings, Legal).
//
//  Why this exists rather than reusing the course sidebar: the sidebar is
//  course chrome. It shows one course's progress, one course's bonus areas and
//  a course switcher — all of which need a course to exist. The old Launchpad
//  faked one by wrapping itself in the default course's provider, which meant
//  the course library rendered with "AI Side Hustle OS · 16%" down the side.
//  With three courses that's actively wrong.
//
//  So: platform pages get a top bar, course pages keep their sidebar. Nothing
//  about the learning experience changes. Everything here reuses the existing
//  design system — same tokens, same card, same pills, same mascots.
// ============================================================================
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, LayoutGrid, Library, FolderOpen, Trophy, Settings, Menu, X, User, LogOut, ChevronDown, Tag, HelpCircle, Bot } from 'lucide-react'
import StaigeMark, { StaigeWordmark } from './StaigeMark'
import MascotAdvisor from './MascotAdvisor'
import { useActiveCourse, resourceRoute } from '../course/useActiveCourse'
import { courseBase } from '../data/courses'
import { useAuth } from '../auth/AuthProvider'
import { CONTACT_EMAIL } from '../pages/Legal'

// Two navs, one bar. Signed out, the nav sells: it walks the landing page's
// sections. Signed in, it works: dashboard first, then the learner's tools.
// Prompt Vault / Resources / Achievements are course-scoped pages, so they
// deep-link into whichever course the learner is in the middle of.
function navLinks(user, course) {
  if (!user) {
    return [
      { to: '/#how-it-works', label: 'How It Works', icon: HelpCircle, hash: true },
      { to: '/#systems', label: 'Operating Systems', icon: LayoutGrid, hash: true },
      { to: '/#capy-byte', label: 'Meet Capy & Byte', icon: Bot, hash: true },
      { to: '/#pricing', label: 'Pricing', icon: Tag, hash: true },
    ]
  }
  const base = course ? courseBase(course.slug) : '/courses'
  return [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/courses', label: 'Operating Systems', icon: LayoutGrid },
    { to: course?.features?.prompts ? `${base}/prompts` : '/courses', label: 'Prompt Vault', icon: Library },
    { to: course ? `${base}/${resourceRoute(course)}` : '/courses', label: 'Resources', icon: FolderOpen },
    { to: course ? `${base}/badges` : '/courses', label: 'Achievements', icon: Trophy },
  ]
}

const linkCls = ({ isActive }) =>
  `flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-sage-50 hover:text-ink-900'
  }`

// Hash links can't be NavLinks (they'd all "match" /), and the primary CTA is
// a button. This renders whichever a link wants to be.
function NavItem({ link, onClick }) {
  return link.hash ? (
    <Link to={link.to} onClick={onClick} className={linkCls({ isActive: false })}>
      <link.icon className="h-4 w-4" /> {link.label}
    </Link>
  ) : (
    <NavLink to={link.to} end={link.end} onClick={onClick} className={linkCls}>
      <link.icon className="h-4 w-4" /> {link.label}
    </NavLink>
  )
}

export default function HomeLayout({ children }) {
  const [open, setOpen] = useState(false)
  const course = useActiveCourse()
  const { user } = useAuth()
  const links = navLinks(user, course)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip link — the first thing a keyboard user hits. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-2xl focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-900 focus:shadow-card focus:ring-2 focus:ring-brand-500/40"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Top-left branding */}
          <StaigeMark />

          <nav aria-label="Platform" className="ml-auto hidden items-center gap-1 lg:flex">
            {links.map((l) => <NavItem key={l.label} link={l} />)}
            <AccountNav />
          </nav>

          <button
            onClick={() => setOpen(true)}
            className="btn-ghost ml-auto !px-2.5 !py-2 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile nav */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-ink-900/30 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 240 }}
              className="fixed inset-y-0 right-0 z-50 w-72 overflow-y-auto border-l border-line bg-canvas p-5 lg:hidden"
              aria-label="Platform menu"
            >
              <div className="mb-6 flex items-center justify-between">
                <StaigeWordmark size="sm" />
                <button onClick={() => setOpen(false)} className="btn-ghost !px-2.5 !py-2" aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav aria-label="Platform" className="space-y-1">
                {links.map((l) => <NavItem key={l.label} link={l} onClick={() => setOpen(false)} />)}
              </nav>
              <AccountLinks className="mt-4 border-t border-line pt-4" onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {children}
      </main>

      <footer className="mt-8 border-t border-line bg-sage-50/60">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <StaigeWordmark size="sm" />
              <p className="mt-2 max-w-xs text-sm text-muted">
                Learn less. Build more.
              </p>
            </div>
            {/* Deliberately one short list — the footer is a map, not a second nav. */}
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {[
                  { to: user ? '/courses' : '/#systems', label: 'Operating Systems' },
                  { to: '/#how-it-works', label: 'How It Works' },
                  { to: '/#pricing', label: 'Pricing' },
                  user ? { to: '/dashboard', label: 'Dashboard' } : { to: '/login', label: 'Sign In' },
                  { to: '/contact', label: 'Contact' },
                  { to: '/privacy', label: 'Privacy' },
                  { to: '/terms', label: 'Terms' },
                ].map((i) => (
                  <li key={i.label}>
                    <Link to={i.to} className="rounded text-muted transition hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="mt-8 border-t border-line pt-6 text-xs text-faint">
            © {new Date().getFullYear()} STAIGE
            {CONTACT_EMAIL && (
              <> · <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-brand-700">{CONTACT_EMAIL}</a></>
            )}
            {' '}· Sign in and your progress follows you to every device.
          </div>
        </div>
      </footer>

      <MascotAdvisor mode="mini" />
    </div>
  )
}

// ── Account ─────────────────────────────────────────────────────────────────
// Renders nothing at all until the session is known, so a signed-in learner
// never sees "Sign in" flash on the way to their own name.
function AccountNav() {
  const { configured, loading, user, profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const away = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc) }
  }, [open])

  if (!configured) return null
  if (loading) return <div className="ml-2 h-9 w-24" aria-hidden="true" />

  if (!user) {
    return (
      <div className="ml-2 flex items-center gap-2">
        <Link to="/login" className={linkCls({ isActive: false })}>Sign In</Link>
        <Link to="/signup" className="btn-primary !px-4 !py-2 !text-sm">Start Building</Link>
      </div>
    )
  }

  const label = profile?.display_name || user.email?.split('@')[0] || 'Account'
  const initial = label.charAt(0).toUpperCase()

  return (
    <div ref={ref} className="relative ml-2">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-2xl px-2 py-1.5 text-sm font-medium text-ink-600 transition hover:bg-sage-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">{initial}</span>
        <span className="max-w-[9rem] truncate">{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            role="menu"
            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-card p-1.5 shadow-card"
          >
            <p className="truncate px-3 py-2 text-xs text-faint">{user.email}</p>
            <Link to="/profile" role="menuitem" onClick={() => setOpen(false)} className={linkCls({ isActive: false })}>
              <User className="h-4 w-4" /> Your account
            </Link>
            {/* Settings left the top bar when Dashboard arrived; it lives here now. */}
            <Link to="/settings" role="menuitem" onClick={() => setOpen(false)} className={linkCls({ isActive: false })}>
              <Settings className="h-4 w-4" /> Settings
            </Link>
            <button
              role="menuitem"
              onClick={() => { setOpen(false); signOut() }}
              className={`w-full ${linkCls({ isActive: false })}`}
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// The same options, laid flat for the mobile drawer.
function AccountLinks({ className = '', onNavigate }) {
  const { configured, loading, user, signOut } = useAuth()
  if (!configured || loading) return null

  return (
    <div className={className}>
      {user ? (
        <>
          <Link to="/profile" onClick={onNavigate} className={linkCls({ isActive: false })}>
            <User className="h-4 w-4" /> Your account
          </Link>
          <Link to="/settings" onClick={onNavigate} className={linkCls({ isActive: false })}>
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <button onClick={() => { onNavigate?.(); signOut() }} className={`w-full ${linkCls({ isActive: false })}`}>
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </>
      ) : (
        <>
          <Link to="/login" onClick={onNavigate} className={linkCls({ isActive: false })}>
            <User className="h-4 w-4" /> Sign In
          </Link>
          <Link to="/signup" onClick={onNavigate} className="btn-primary mt-2 w-full justify-center !text-sm">
            Start Building
          </Link>
        </>
      )}
    </div>
  )
}
