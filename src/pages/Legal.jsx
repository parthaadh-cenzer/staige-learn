// ============================================================================
//  Contact · Privacy · Terms — one component, three routes.
//
//  ⚠️ BEFORE LAUNCH: set CONTACT_EMAIL below. It is deliberately null rather
//  than a plausible-looking placeholder — a fake address that ships is worse
//  than an obviously missing one. While it's null the Contact page says so
//  plainly instead of inventing somewhere to write to.
//
//  The Privacy copy describes what this app ACTUALLY does, which is unusually
//  easy to state: it is a static front-end with no backend, no accounts, no
//  analytics and no network calls. Everything lives in localStorage under one
//  key. That is verifiable in src/store/useStore.js. The Terms are a plain
//  summary of the same reality — have a lawyer review them before launch.
// ============================================================================
import { Link } from 'react-router-dom'
import { Mail, ShieldCheck, ScrollText, ArrowRight } from 'lucide-react'
import { Reveal } from '../components/ui'

export const CONTACT_EMAIL = null // ← e.g. 'hello@staige.world'

const PAGES = {
  contact: {
    icon: Mail,
    title: 'Contact',
    intro: 'Questions, feedback, or something broken?',
    body: () => (
      <>
        {CONTACT_EMAIL ? (
          <p>
            Email <a className="font-semibold text-brand-600 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and
            you’ll get a reply from a person.
          </p>
        ) : (
          <p>
            A contact address for STAIGE hasn’t been published yet. If you reached this page from a link,
            the address will appear here once it’s live.
          </p>
        )}
        <h2>About your data first</h2>
        <p>
          Before you write in about progress or a lost course: nothing you do here is stored on a server, so
          there’s no account for anyone to look up or restore. If your progress has disappeared, it’s because
          the browser data for this site was cleared, or you’re on a different device or browser.{' '}
          <Link to="/privacy">How that works →</Link>
        </p>
      </>
    ),
  },
  privacy: {
    icon: ShieldCheck,
    title: 'Privacy',
    intro: 'The short version: we don’t collect anything.',
    body: () => (
      <>
        <h2>What we collect</h2>
        <p>
          Nothing. There is no account, no sign-up, no email capture and no analytics on this platform. We
          don’t know who you are, and we don’t have a server that could store it if we did.
        </p>
        <h2>What’s stored, and where</h2>
        <p>
          Your progress, XP, achievements, mission answers, checklists and favourited prompts are saved in
          your own browser’s local storage. They never leave your device. Nobody at STAIGE can read them.
        </p>
        <h2>What that means for you</h2>
        <ul>
          <li>Your work stays private by default.</li>
          <li>It doesn’t follow you to another device or browser.</li>
          <li>Clearing your browser data for this site erases it permanently.</li>
          <li>You can wipe it yourself any time from <Link to="/settings">Settings</Link>.</li>
        </ul>
        <h2>Third parties</h2>
        <p>
          The site loads its fonts from Google Fonts, which means your browser makes a request to Google when
          the page loads. Beyond that, the platform makes no external calls — the AI guidance in lessons runs
          locally in the page and never sends what you type anywhere.
        </p>
        <h2>Cookies</h2>
        <p>We don’t set any. Local storage isn’t a cookie and isn’t sent with requests.</p>
      </>
    ),
  },
  terms: {
    icon: ScrollText,
    title: 'Terms',
    intro: 'Plain-English terms for using STAIGE.',
    body: () => (
      <>
        <h2>What this is</h2>
        <p>
          STAIGE provides practical, educational courses about using AI in your work. The content is
          instructional material — it is not professional, legal, financial, career, tax or employment advice,
          and it isn’t a guarantee of any outcome such as income, interviews or a job offer.
        </p>
        <h2>Use your judgement</h2>
        <p>
          The AI guidance inside lessons is generated to help you improve your own work. It can be wrong. You
          are responsible for checking anything you act on — and for never using these tools to misrepresent
          your experience. Several lessons say this explicitly, and we mean it.
        </p>
        <h2>Your content</h2>
        <p>
          Anything you type into a mission, worksheet or checklist stays on your device and remains yours. We
          never receive it, so we make no claim to it.
        </p>
        <h2>Course material</h2>
        <p>
          The lessons, prompts, templates and downloads are provided for your personal use. Please don’t
          redistribute or resell them.
        </p>
        <h2>Availability</h2>
        <p>
          Courses may be updated, added or changed over time. Because your progress is stored locally, updates
          never overwrite it.
        </p>
      </>
    ),
  },
}

export default function Legal({ page = 'privacy' }) {
  const cfg = PAGES[page] || PAGES.privacy
  const Body = cfg.body
  const Icon = cfg.icon

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-3xl bg-brand-50 text-brand-600">
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">{cfg.title}</h1>
          <p className="mt-1 text-muted">{cfg.intro}</p>
        </div>
      </div>

      <Reveal>
        <div
          className="card space-y-4 p-6 text-ink-700 [&_a]:font-semibold [&_a]:text-brand-600 hover:[&_a]:underline [&_h2]:pt-2 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink-900 [&_li]:ml-5 [&_li]:list-disc [&_p]:leading-relaxed [&_ul]:space-y-1.5"
        >
          <Body />
        </div>
      </Reveal>

      <div className="flex flex-wrap gap-3 text-sm">
        {Object.keys(PAGES).filter((k) => k !== page).map((k) => (
          <Link key={k} to={`/${k}`} className="font-semibold text-brand-600 hover:underline">
            {PAGES[k].title}
          </Link>
        ))}
        <Link to="/" className="ml-auto inline-flex items-center gap-1.5 font-semibold text-muted hover:text-ink-900">
          Back to home <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
