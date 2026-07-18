// ============================================================================
//  Contact · Privacy · Terms — one component, three routes.
//
//  These describe what STAIGE ACTUALLY does now: real accounts (Supabase auth),
//  email sign-in and recovery, one-time payments through Stripe, per-course
//  paid access, and cross-device progress sync. The earlier "no account, no
//  email, nothing on a server" copy predated the paid platform and was rewritten
//  when payments went in — shipping the old text would have been a false privacy
//  claim.
//
//  CONTACT_EMAIL comes from VITE_CONTACT_EMAIL at build time (see .env.example).
//  It is null until set, and while null the Contact page and footer say so
//  plainly rather than inventing an address.
//
//  ⚠️ OWNER APPROVAL NEEDED before publishing: the refund wording below
//  (REFUND_POLICY) is a reasonable, non-aggressive default, not a lawyer's
//  final policy. Confirm or replace it, and have Terms + Privacy reviewed.
// ============================================================================
import { Link } from 'react-router-dom'
import { Mail, ShieldCheck, ScrollText, ArrowRight } from 'lucide-react'
import { Reveal } from '../components/ui'

// Public, build-time. Never a secret. `null` → "not published yet" copy.
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || null

// One place for the refund stance, so checkout, Terms and the sales-page FAQ can
// all agree. ⚠️ Owner must confirm this exact wording before launch.
export const REFUND_POLICY =
  'Each Operating System is a one-time purchase that unlocks immediately and includes downloadable materials, so purchases are generally final. If something goes wrong — a double charge, or you can’t access what you paid for — contact us and we’ll put it right.'

const PAGES = {
  contact: {
    icon: Mail,
    title: 'Contact',
    intro: 'Questions, feedback, or a problem with your account or a purchase?',
    body: () => (
      <>
        {CONTACT_EMAIL ? (
          <p>
            Email <a className="font-semibold text-brand-600 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and
            you’ll get a reply from a person. For anything about a payment, include the email address on your account.
          </p>
        ) : (
          <p>
            A contact address for STAIGE hasn’t been published yet. It will appear here once it’s live. If you have a
            billing question in the meantime, the receipt Stripe emailed you has a support link.
          </p>
        )}
        <h2>Account &amp; purchase help</h2>
        <p>
          Your progress and the Operating Systems you own are tied to your account, not to one device — sign in on any
          device and they’ll be there. If a course you bought isn’t showing up, give it a moment to confirm after
          payment, then refresh; if it still doesn’t appear, write in with your account email and we’ll sort it.
        </p>
      </>
    ),
  },
  privacy: {
    icon: ShieldCheck,
    title: 'Privacy',
    intro: 'What we collect, why, and what we never do with it.',
    body: () => (
      <>
        <h2>What we collect</h2>
        <p>
          To give you an account and sell you a course, we collect the minimum needed to run the service: your email
          address, a password (stored only as a secure hash we can’t read), an optional display name, your course
          progress, and a record of what you’ve purchased. That’s it — no tracking or advertising profiles.
        </p>

        <h2>How we use your email</h2>
        <p>
          Your email address is used for account verification, authentication, password recovery, purchase receipts,
          access delivery, and essential security or service communications. STAIGE does not sell your email address
          or use it for unrelated marketing without your consent. These essential, transactional messages are separate
          from any optional marketing email, which you would have to opt into.
        </p>

        <h2>Payments</h2>
        <p>
          Payments are processed by <strong>Stripe</strong>. When you buy an Operating System, your card details go
          directly to Stripe — <strong>STAIGE never sees or stores your full card number</strong>. We keep a record of
          the purchase (which course, amount, date and the Stripe identifiers) so we can grant access and support you.
          Stripe processes your payment and billing information under its own privacy practices.
        </p>

        <h2>Where your data lives</h2>
        <p>
          Accounts, progress and purchase records are stored in our database (Supabase) and are protected by row-level
          security so that you can only read your own. Your progress syncs across the devices you sign in on. You can
          sign out on any device at any time.
        </p>

        <h2>What we don’t do</h2>
        <ul>
          <li>We don’t sell your data or share it for advertising.</li>
          <li>We don’t store your full card details — Stripe handles payment data.</li>
          <li>We don’t add you to marketing email without your explicit consent.</li>
        </ul>

        <h2>Third parties</h2>
        <p>
          We rely on Stripe (payments), Supabase (accounts and database) and Google Fonts (typography, loaded by your
          browser). The AI guidance inside lessons runs in the page and isn’t sent anywhere.
        </p>

        <h2>Your choices</h2>
        <p>
          You can update your display name in your profile, reset your password by email, and request account or data
          deletion by contacting us. Deleting your account removes your profile, progress and access records.
        </p>
      </>
    ),
  },
  terms: {
    icon: ScrollText,
    title: 'Terms',
    intro: 'Plain-English terms for using STAIGE and buying an Operating System.',
    body: () => (
      <>
        <h2>What this is</h2>
        <p>
          STAIGE provides practical, educational “Operating Systems” for using AI in your work. The content is
          instructional — it is not professional, legal, financial, career, tax or employment advice, and it isn’t a
          guarantee of any outcome such as income, interviews or a job offer.
        </p>

        <h2>Accounts</h2>
        <p>
          You need an account to buy and access a paid Operating System. Keep your login details secure and use a real
          email address you control — it’s how you sign in, recover your password, and receive receipts and essential
          service notices. You’re responsible for activity under your account.
        </p>

        <h2>Purchases &amp; access</h2>
        <p>
          Each Operating System is sold individually as a <strong>one-time payment</strong>. There is{' '}
          <strong>no subscription</strong> and no bundle at launch. Buying one Operating System unlocks{' '}
          <strong>only that Operating System</strong> — it does not unlock the others. Access is granted only after a
          successful, verified payment, and is tied to your account.
        </p>

        <h2>Refunds</h2>
        <p>{REFUND_POLICY}</p>

        <h2>Use your judgement</h2>
        <p>
          The AI guidance inside lessons is generated to help you improve your own work. It can be wrong. You’re
          responsible for checking anything you act on — and for never using these tools to misrepresent your
          experience. Several lessons say this explicitly, and we mean it.
        </p>

        <h2>Your content &amp; ours</h2>
        <p>
          Anything you type into a mission, worksheet or checklist remains yours. The lessons, prompts, templates and
          downloads are licensed to you for personal use — please don’t redistribute or resell them.
        </p>

        <h2>Availability &amp; changes</h2>
        <p>
          Operating Systems may be updated or added over time; updates to a course you own are included at no extra
          cost. We may update these terms as the service changes, and we’ll reflect the current version here.
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
