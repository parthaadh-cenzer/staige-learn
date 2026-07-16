import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import Onboarding from './components/Onboarding'
import HomeLayout from './components/HomeLayout'
import { useStore } from './store/useStore'
import { courses, DEFAULT_COURSE_SLUG, courseBase, getCourseBySlug } from './data/courses'
import Home from './pages/Home'
import Courses from './pages/Courses'
import Settings from './pages/Settings'
import Legal from './pages/Legal'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import { CheckoutSuccess, CheckoutCancel } from './pages/Checkout'
import RequireAuth from './auth/RequireAuth'
import useProgressSync from './course/useProgressSync'

// The homepage is the landing page, so it shouldn't pay for the whole learning
// app. Everything behind a lesson — the block renderer, the mission engine and
// its recipes — is split into its own chunk and fetched when someone actually
// opens a course. (The course *content* still ships up front: the homepage
// needs lesson ids to compute progress. See README for what it'd take to split
// that too.)
const CourseShell = lazy(() => import('./course/CourseShell'))

// Deliberately plain: this appears for a few hundred milliseconds at most, and
// a spinner that flashes is worse than a calm blank canvas.
const ShellFallback = () => <div className="min-h-screen bg-canvas" aria-busy="true" />

const LazyCourseShell = () => (
  <Suspense fallback={<ShellFallback />}>
    <CourseShell />
  </Suspense>
)

const DEFAULT_BASE = courseBase(DEFAULT_COURSE_SLUG) // /launchpad/ai-side-hustle-os

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0 }) }, [pathname])
  return null
}

// Platform-level pages share the homepage chrome (STAIGE brand + top nav).
// Course pages keep their own sidebar — see CourseShell.
const Platform = ({ children }) => <HomeLayout>{children}</HomeLayout>

// Backward-compat: old param routes → default-course equivalents.
function RedirectLesson() {
  const { moduleId, lessonId } = useParams()
  return <Navigate to={`${DEFAULT_BASE}/module/${moduleId}/lesson/${lessonId}`} replace />
}
function RedirectModule() {
  const { moduleId } = useParams()
  return <Navigate to={`${DEFAULT_BASE}/module/${moduleId}`} replace />
}

// Short course aliases: /course/job-hunter → /launchpad/ai-job-hunter-os.
// Resolved against the registry — never a hardcoded map — so a new course gets
// its short URL for free. Accepts the full slug or the slug minus its
// "ai-"/"-os" decoration. Unknown alias → the course library, not a 404.
const shortSlug = (slug) => slug.replace(/^ai-/, '').replace(/-os$/, '')
function CourseAlias() {
  const { alias = '' } = useParams()
  const a = alias.toLowerCase()
  const course = getCourseBySlug(a) || courses.find((c) => shortSlug(c.slug) === a)
  return <Navigate to={course ? courseBase(course.slug) : '/courses'} replace />
}

export default function App() {
  const onboarded = useStore((s) => s.onboarded)
  // Signed out this is inert; signed in it merges local progress up to Supabase
  // and keeps the two in step. See course/progressSync.js.
  useProgressSync()

  return (
    <>
      {!onboarded && <Onboarding />}
      <ScrollTop />
      <Routes>
        {/* The homepage IS the landing page now. */}
        <Route path="/" element={<Platform><Home /></Platform>} />
        <Route path="/courses" element={<Platform><Courses /></Platform>} />
        <Route path="/settings" element={<Platform><Settings /></Platform>} />
        <Route path="/contact" element={<Platform><Legal page="contact" /></Platform>} />
        <Route path="/privacy" element={<Platform><Legal page="privacy" /></Platform>} />
        <Route path="/terms" element={<Platform><Legal page="terms" /></Platform>} />

        {/* Accounts. Real Supabase auth — see pages/Auth.jsx. */}
        <Route path="/login" element={<Platform><Auth page="login" /></Platform>} />
        <Route path="/signup" element={<Platform><Auth page="signup" /></Platform>} />
        <Route path="/forgot-password" element={<Platform><Auth page="forgot-password" /></Platform>} />
        <Route path="/reset-password" element={<Platform><Auth page="reset-password" /></Platform>} />
        <Route path="/profile" element={<Platform><RequireAuth><Profile /></RequireAuth></Platform>} />

        {/* Stripe's return URLs. Neither one grants anything — see pages/Checkout.jsx. */}
        <Route path="/checkout/success" element={<Platform><RequireAuth><CheckoutSuccess /></RequireAuth></Platform>} />
        <Route path="/checkout/cancel" element={<Platform><CheckoutCancel /></Platform>} />

        {/* Course-scoped app — unchanged, just code-split. */}
        <Route path="/launchpad/:courseSlug/*" element={<LazyCourseShell />} />

        {/* Short aliases for course URLs. */}
        <Route path="/course/:alias" element={<CourseAlias />} />

        {/* The Launchpad became the homepage; old links still land somewhere real. */}
        <Route path="/launchpad" element={<Navigate to="/" replace />} />

        {/* Legacy routes → default course (keep old links/bookmarks working) */}
        <Route path="/welcome" element={<Navigate to={`${DEFAULT_BASE}/welcome`} replace />} />
        <Route path="/modules" element={<Navigate to={`${DEFAULT_BASE}/modules`} replace />} />
        <Route path="/module/:moduleId" element={<RedirectModule />} />
        <Route path="/learn/:moduleId/:lessonId" element={<RedirectLesson />} />
        <Route path="/prompts" element={<Navigate to={`${DEFAULT_BASE}/prompts`} replace />} />
        <Route path="/ideas" element={<Navigate to={`${DEFAULT_BASE}/ideas`} replace />} />
        <Route path="/calendar" element={<Navigate to={`${DEFAULT_BASE}/calendar`} replace />} />
        <Route path="/vault" element={<Navigate to={`${DEFAULT_BASE}/vault`} replace />} />
        <Route path="/challenge" element={<Navigate to={`${DEFAULT_BASE}/challenge`} replace />} />
        <Route path="/badges" element={<Navigate to={`${DEFAULT_BASE}/badges`} replace />} />

        {/* Anything else → the homepage. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
