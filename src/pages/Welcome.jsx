import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useCourse } from '../course/CourseContext'
import Blocks from '../components/Blocks'

export default function Welcome() {
  const { course, base } = useCourse()
  const first = course.allLessons[0]
  return (
    <div className="mx-auto max-w-3xl">
      <Link to={base} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink-800"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>
      <h1 className="mt-4 font-display text-3xl font-extrabold text-ink-900">{course.intro.title}</h1>
      <p className="mt-1 text-lg text-muted">{course.intro.subtitle}</p>
      <div className="mt-6"><Blocks blocks={course.intro.blocks} /></div>
      {first && (
        <Link to={`${base}/module/${first.moduleId}/lesson/${first.id}`} className="btn-primary mt-8 w-full justify-center !py-4 text-base">
          Start Module 1 <ArrowRight className="h-5 w-5" />
        </Link>
      )}
    </div>
  )
}
