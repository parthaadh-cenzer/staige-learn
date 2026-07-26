// Builder Vault home — nine cards, one per premium library.
// Deliberately just a directory: the vault is nine separate pages precisely so
// no single page becomes an unscrollable wall of 95 prompts plus 90 ideas plus
// 125 checklist items.
import { Link } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { useCourse } from '../../course/CourseContext'
import { vaultSections } from '../../data/appbuilder/vault'
import { tone as toneOf } from '../../lib/tones'
import { Reveal } from '../../components/ui'
import { Capy } from '../../components/mascots'

const Icon = ({ name, ...p }) => { const C = Icons[name] || Icons.Sparkles; return <C {...p} /> }

export default function BuilderVault() {
  const { course, base } = useCourse()
  const ui = course.ui?.builderVault || {}

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Capy size={72} proximity className="shrink-0" />
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">{ui.title || 'Builder Vault'}</h1>
          <p className="mt-1 text-muted">{ui.blurb}</p>
        </div>
      </div>

      <div className="card border-brand-200 bg-brand-50 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-brand-700">
          <Icons.Lock className="h-4 w-4" /> Included with your access to {course.title}
        </p>
        <p className="mt-1 text-sm text-ink-700">
          Everything below stays available after you finish the course. It’s built to be used on the
          projects you take on afterwards, not just the ones inside it.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {vaultSections.map((s, i) => {
          const t = toneOf(s.tone)
          return (
            <Reveal key={s.id} delay={Math.min(i, 8) * 0.04}>
              <Link
                to={`${base}/builder-vault/${s.to}`}
                className={`card card-hover group flex h-full flex-col border ${t.border} p-5`}
              >
                <div className="flex items-start gap-3.5">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${t.bgSoft} ${t.text}`}>
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-lg font-bold text-ink-900">{s.name}</h2>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <span className={`pill ${t.border} ${t.text}`}>{s.count}</span>
                      <span className="pill border-brand-200 text-brand-600">
                        <Icons.Check className="h-3 w-3" /> Unlocked
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">{s.desc}</p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                  <span className="text-xs text-faint">{s.meta}</span>
                  <span className={`inline-flex shrink-0 items-center gap-1 text-sm font-semibold ${t.text}`}>
                    Open <Icons.ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
