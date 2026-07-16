// Shown when a course exists but isn't active yet.
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import MascotAdvisor from '../components/MascotAdvisor'
import { featuredCourse, courseBase } from '../data/courses'

export default function ComingSoon({ course }) {
  // Suggest whatever is currently featured rather than naming a course here —
  // this page shouldn't need editing every time the line-up changes.
  const alt = featuredCourse

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink-800">
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </Link>
      <div className="card mt-4 overflow-hidden border-brand-200 bg-gradient-to-br from-sage-50 to-brand-50 p-8 text-center">
        <div className="mx-auto mb-2 w-56"><MascotAdvisor mode="empty" /></div>
        <span className="pill border-brand-200 text-brand-600"><Sparkles className="h-3.5 w-3.5" /> Coming soon</span>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-ink-900">{course.title}</h1>
        <p className="mt-2 text-muted">{course.subtitle}</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-700">{course.description}</p>
        {alt && alt.slug !== course.slug && (
          <Link to={courseBase(alt.slug)} className="btn-primary mt-6">
            Start {alt.title} instead
          </Link>
        )}
      </div>
    </div>
  )
}
