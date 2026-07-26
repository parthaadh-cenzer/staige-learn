// Resolves the active course from the URL (:courseSlug), provides it via
// CourseProvider, wraps the shared Layout, and renders the course's nested
// pages. One shell serves every course — that's the engine.
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { getCourseBySlug, courseBase } from '../data/courses'
import { useAuth } from '../auth/AuthProvider'
import { canAccessCourse, ACCESS } from './access'
import { CourseLock, CoursePurchasePanel } from '../components/Pricing'
import { CourseProvider, useCourse } from './CourseContext'
import Layout from '../components/Layout'
import Dashboard from '../pages/Dashboard'
import Modules from '../pages/Modules'
import ModuleView from '../pages/ModuleView'
import Lesson from '../pages/Lesson'
import Prompts from '../pages/Prompts'
import Ideas from '../pages/Ideas'
import Calendar from '../pages/Calendar'
import Vault from '../pages/Vault'
import Checklists from '../pages/Checklists'
import Downloads from '../pages/Downloads'
import Challenge from '../pages/Challenge'
import Badges from '../pages/Badges'
import Welcome from '../pages/Welcome'
import ComingSoon from '../pages/ComingSoon'
import BuilderVault from '../pages/builder/BuilderVault'
import Recipes from '../pages/builder/Recipes'
import Templates from '../pages/builder/Templates'
import StudyList from '../pages/builder/StudyList'
import Palettes from '../pages/builder/Palettes'
import Fonts from '../pages/builder/Fonts'
import AppIdeas from '../pages/builder/AppIdeas'
import VaultChecklist from '../pages/builder/VaultChecklist'
import VaultResources from '../pages/builder/VaultResources'

export default function CourseShell() {
  const { courseSlug } = useParams()
  const course = getCourseBySlug(courseSlug)

  if (!course) return <Navigate to="/launchpad" replace />

  if (course.status !== 'active') {
    return (
      <CourseProvider course={course}>
        <Layout comingSoon>
          <ComingSoon course={course} />
        </Layout>
      </CourseProvider>
    )
  }

  return (
    <CourseProvider course={course}>
      <Layout>
        <Routes>
          {/* Public by design — this IS the sales page. Anyone can read the
              overview, the welcome and the full module list, signed in or not.
              What's inside a module is what you pay for. */}
          <Route index element={<Offer><Dashboard /></Offer>} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="modules" element={<Offer><Modules /></Offer>} />
          <Route path="module/:moduleId" element={<Offer><ModuleView /></Offer>} />

          {/* The free sample lesson stays open; Gate consults the registry's
              previewLessonIds via the :lessonId param. */}
          <Route path="module/:moduleId/lesson/:lessonId" element={<Gate what="This lesson"><Lesson /></Gate>} />

          {/* Everything a buyer is actually paying for. */}
          <Route path="prompts" element={<Gate what="The Prompt Vault"><Prompts /></Gate>} />
          <Route path="ideas" element={<Gate><Ideas /></Gate>} />
          <Route path="calendar" element={<Gate><Calendar /></Gate>} />
          <Route path="vault" element={<Gate what="The Prompt Vault"><Vault /></Gate>} />
          <Route path="checklists" element={<Gate what="The checklists"><Checklists /></Gate>} />
          <Route path="downloads" element={<Gate what={'The templates & downloads'}><Downloads /></Gate>} />
          <Route path="challenge" element={<Gate what="The challenge"><Challenge /></Gate>} />
          <Route path="badges" element={<Gate what="Your achievements"><Badges /></Gate>} />

          {/* The Builder Vault — nine premium libraries, every one behind the
              same Gate as a lesson. Mounted only for courses that declare
              `features.builderVault`, so no other course grows dead routes. */}
          {course.features?.builderVault && (
            <Route path="builder-vault">
              <Route index element={<Gate what="The Builder Vault"><BuilderVault /></Gate>} />
              <Route path="recipes" element={<Gate what="Builder Recipes"><Recipes /></Gate>} />
              <Route path="templates" element={<Gate what="The template library"><Templates /></Gate>} />
              <Route path="study" element={<Gate what="The study directory"><StudyList /></Gate>} />
              <Route path="palettes" element={<Gate what="The Color Palette Library"><Palettes /></Gate>} />
              <Route path="fonts" element={<Gate what="The Font Pairing Library"><Fonts /></Gate>} />
              <Route path="ideas" element={<Gate what="The App Idea Generator"><AppIdeas /></Gate>} />
              <Route path="launch-checklist" element={<Gate what="The Launch Checklist"><VaultChecklist group="launch" /></Gate>} />
              <Route path="uiux-checklist" element={<Gate what="The UI/UX Checklist"><VaultChecklist group="uiux" /></Gate>} />
              <Route path="resources" element={<Gate what="The Resource Vault"><VaultResources /></Gate>} />
              {/* An unknown vault path is a typo, not a 404 — send them to the
                  vault home rather than all the way back to the dashboard. */}
              <Route path="*" element={<Navigate to={`${courseBase(course.slug)}/builder-vault`} replace />} />
            </Route>
          )}

          <Route path="*" element={<Navigate to={courseBase(course.slug)} replace />} />
        </Routes>
      </Layout>
    </CourseProvider>
  )
}

// The public browsing pages, with the offer attached underneath. These pages are
// never gated — someone deciding whether to buy needs to see what they'd get —
// so the panel is additive and disappears entirely once they own the course.
function Offer({ children }) {
  const { course } = useCourse()
  return (
    <div className="space-y-6">
      {children}
      <CoursePurchasePanel course={course} />
    </div>
  )
}

// The paywall, as the learner experiences it. One rule (course/access.js) asked
// once per gated page, so no screen can drift into its own idea of "locked".
//
// This is presentation, not security: the real boundary is RLS on
// `course_access` plus the webhook being its only writer. Someone who patches
// this component out gets the lesson markup — and still cannot make a purchase
// exist, sync progress into someone else's account, or keep access after a
// refund.
function Gate({ children, what }) {
  const { course } = useCourse()
  const { lessonId } = useParams()
  const auth = useAuth()
  const { allowed, reason } = canAccessCourse(course, auth, { lessonId })

  if (allowed) return children

  // Entitlements still in flight. Showing a lock here would flash "buy this" at
  // someone who already owns the course, on every refresh.
  if (reason === ACCESS.UNKNOWN) {
    return <div className="grid min-h-[40vh] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-faint" /></div>
  }

  return <div className="py-8"><CourseLock course={course} reason={reason} what={what} /></div>
}
