# Launching STAIGE at learn.staige.world

Everything that could be done in code is done. What remains needs an account
password, a billing dashboard or a DNS record — things I deliberately don't touch.
Work through this top to bottom; it takes about 30 minutes.

**Nothing below is optional.** Until every step is done, the platform runs in its
signed-out state: courses stay readable and nothing can be purchased.

---

## 1 · Create the Supabase project

The existing **STAIGE** Supabase project (`rkxnqlhkgyiuewyzocgj`) hosts your video
platform: 13 tables, RLS on all of them, 11 real users, and a `public.profiles`
table whose shape (`username`, `role`, `onboarded`) is incompatible with what the
learning platform needs. **Do not run the migration there.** You chose a separate
project; this keeps learner accounts and creator accounts independent and means a
mistake here can never touch live user data.

1. https://supabase.com/dashboard/org/ldxminzqjsozfiiqgeev → **New project**
2. Name: `staige-learn` · Region: **East US (North Virginia)** (matches your other
   project and Vercel's default) · Plan: Free
3. Set a database password and save it in your password manager. You won't need it
   again for this setup — the app connects with API keys, not the DB password.
4. Wait for provisioning (~2 min).

## 2 · Run the migration

1. Open the new project → **SQL Editor** → **New query**
2. Paste the entire contents of [`supabase/migrations/0001_staige_learn.sql`](../supabase/migrations/0001_staige_learn.sql)
3. **Run**

Then confirm it worked — this is the check that proves the paywall has a floor:

1. **Table Editor** → you should see 7 tables: `profiles`, `courses`, `products`,
   `purchases`, `course_access`, `course_progress`, `webhook_events`.
2. `courses` should already contain 3 rows, `products` 3 rows.
3. **Authentication → Policies** → every one of the 7 tables must show
   **RLS enabled**. `webhook_events` correctly shows RLS enabled with **no
   policies** — that's intentional: only the service-role key may touch it.

## 3 · Configure auth

**Authentication → URL Configuration**

- **Site URL**: `https://learn.staige.world`
- **Redirect URLs** — add all of these:
  - `https://learn.staige.world/login`
  - `https://learn.staige.world/reset-password`
  - `http://localhost:5180/login`
  - `http://localhost:5180/reset-password`

Password reset and email confirmation links will silently fail without these.

**Authentication → Sign In / Providers → Email**: leave **Confirm email** on. The
signup page already handles the "check your inbox" state.

> Supabase's built-in email sender is rate-limited to a few messages an hour and is
> not meant for production. Before you promote this widely, set up SMTP under
> **Project Settings → Auth → SMTP Settings** (Resend, Postmark, SES). Without it,
> signups will start bouncing the moment you get real traffic.

## 4 · Collect the Supabase keys

**Project Settings → API**:

| Value | Goes into |
|---|---|
| Project URL | `VITE_SUPABASE_URL` **and** `SUPABASE_URL` |
| `anon` `public` key | `VITE_SUPABASE_ANON_KEY` **and** `SUPABASE_ANON_KEY` |
| `service_role` `secret` key | `SUPABASE_SERVICE_ROLE_KEY` — **server only** |

The service-role key bypasses RLS entirely. It belongs in Vercel's environment and
nowhere else: not in the repo, not in a `VITE_` variable, not in a screenshot.

---

## 5 · Create the Stripe products

Your Stripe account (`acct_1Ttdkv7CH9GgD85m`, "Staige") is currently a **test
sandbox with zero products**, and the dashboard shows **"Review in progress — we're
reviewing your account information. This takes 2–3 days."** Until that review
clears you cannot accept live payments. Test mode works now, so build and test
today and flip to live when Stripe approves you.

For **each** of the three courses, in **Product catalog → Create product**:

| Product name | Price 1 (Regular) | Price 2 (Introductory) |
|---|---|---|
| AI Side Hustle OS | $10.00 USD, One-off | $5.00 USD, One-off |
| AI Marketing OS | $10.00 USD, One-off | $5.00 USD, One-off |
| AI Job Hunter OS | $10.00 USD, One-off | $5.00 USD, One-off |

For each product: create it with the **$10** price first, then open the product and
**+ Add another price** for **$5**. Both must be **One-off**, not recurring — the
code uses `mode: 'payment'` and a recurring price would fail the session.

Then copy the six **Price IDs** (they start `price_…`, found on each price row —
*not* the product id, which starts `prod_…`):

```
STRIPE_PRICE_SIDE_HUSTLE_REGULAR = price_…   ($10)
STRIPE_PRICE_SIDE_HUSTLE_INTRO   = price_…   ($5)
STRIPE_PRICE_MARKETING_REGULAR   = price_…   ($10)
STRIPE_PRICE_MARKETING_INTRO     = price_…   ($5)
STRIPE_PRICE_JOB_HUNTER_REGULAR  = price_…   ($10)
STRIPE_PRICE_JOB_HUNTER_INTRO    = price_…   ($5)
```

Getting a regular/intro pair backwards charges $10 while the page advertises $5.
Double-check the amount next to each id.

## 6 · Create the webhook

**Developers → Webhooks → Add endpoint**

- URL: `https://learn.staige.world/api/stripe-webhook`
- Events to send:
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded`
  - `checkout.session.async_payment_failed`
  - `payment_intent.payment_failed`
  - `charge.refunded`

Copy the **Signing secret** (`whsec_…`) → `STRIPE_WEBHOOK_SECRET`.

> Test mode and live mode have **different** signing secrets and **different**
> Price IDs. When you switch to live, every one of these values changes.

**API keys → Secret key** (`sk_test_…`) → `STRIPE_SECRET_KEY`.

---

## 7 · Set the Vercel environment variables

**Project → Settings → Environment Variables.** All 12, for Production (and
Preview, if you want previews to work):

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_SIDE_HUSTLE_REGULAR
STRIPE_PRICE_SIDE_HUSTLE_INTRO
STRIPE_PRICE_MARKETING_REGULAR
STRIPE_PRICE_MARKETING_INTRO
STRIPE_PRICE_JOB_HUNTER_REGULAR
STRIPE_PRICE_JOB_HUNTER_INTRO
APP_URL = https://learn.staige.world
```

`VITE_`-prefixed variables are compiled into the browser bundle and are public by
design. The rest are read only by `api/`. **Redeploy after adding them** — Vite
inlines the `VITE_` ones at build time, so an existing build won't pick them up.

## 8 · Test the payment path (test mode)

Do this before pointing the domain at anything.

1. Sign up at `/signup` with a real address you can read.
2. Confirm the email, sign in. Refresh — **you should stay signed in**.
3. Open a course. Lesson 1 reads; lesson 2 shows the lock and `$5` / ~~$10~~.
4. Click buy. Pay with `4242 4242 4242 4242`, any future expiry, any CVC.
5. You should land on `/checkout/success`, see "Confirming your payment…" briefly,
   then "You're in."
6. **Supabase → Table Editor** — verify:
   - `webhook_events` has a row, `status = processed`
   - `purchases` has a row, `status = paid`, `amount_paid_cents = 500`
   - `course_access` has a row with `revoked_at = null`
7. Sign in on a second device/browser — the course should be unlocked there too.
8. **Try to break it**: open `/checkout/success?course=ai-job-hunter-os` while
   owning only Marketing. It must keep saying "confirming", never unlock. That URL
   grants nothing; only the webhook does.

Watch **Stripe → Developers → Webhooks → your endpoint** for delivery attempts. A
`400` means the signing secret is wrong; a `500` means the handler threw — check
the Vercel function logs.

## 9 · Go live

1. Wait for Stripe's account review to clear.
2. Switch the dashboard to **live mode** and redo **step 5** and **step 6** there —
   new products, new prices, new webhook, new signing secret.
3. Update `STRIPE_SECRET_KEY` (`sk_live_…`), `STRIPE_WEBHOOK_SECRET`, and all six
   Price IDs in Vercel. Redeploy.
4. Point `learn.staige.world` at Vercel (**Project → Settings → Domains**) and add
   the DNS record at your registrar. *I haven't touched DNS.*
5. Make one real £/$5 purchase with your own card, confirm it lands, then refund it
   from the Stripe dashboard and confirm `course_access.revoked_at` gets set.

---

## Ending the introductory offer

One edit, one file. In [`shared/catalog.mjs`](../shared/catalog.mjs), for each product:

```js
introductoryOfferActive: false,
```

Redeploy. Every surface follows automatically: the card, the course panel and the
lock all switch to `$10` with nothing struck through and no offer badge, and
`/api/checkout` starts resolving `STRIPE_PRICE_*_REGULAR` instead of `*_INTRO`.
The displayed price and the charged price are computed by the same function
(`activeTier`), so they cannot drift apart.

To end it on a date instead, set a real ISO date and leave the flag on:

```js
introductoryOfferEndsAt: '2026-08-31',
```

The offer then retires itself when that date passes, and **only then** does the UI
mention a date ("Offer ends August 31, 2026"). There is no countdown timer and no
invented deadline anywhere — with `introductoryOfferEndsAt: null` (the current
setting) the UI claims no end date at all.

Don't change prices in Stripe alone. Stripe decides what a customer is *charged*;
`catalog.mjs` decides what they're *shown*. Both must move together — new Price IDs
in Vercel, new numbers in `catalog.mjs`.

---

## How access actually works

Worth knowing before you change anything here.

- **The webhook is the only thing that grants access.** Not the success page, not
  the client, not `/api/checkout`. `course_access` has RLS enabled and *no* insert
  or update policy for any user, so the browser cannot write an entitlement even
  with a valid session. Only the service-role key can, and only `api/` holds it.
- **The browser cannot name a price.** `/api/checkout` accepts a product key
  (`'marketing'`) and nothing else. The Price ID comes from the server environment.
- **The webhook grants based on the Price actually paid**, looked up against the
  approved list from the environment — not on session metadata. Tampered metadata
  cannot unlock a course.
- **Frontend locks are presentation only.** Someone who patches the JS gets lesson
  markup. They still can't create a purchase, sync progress into another account,
  or keep access after a refund.
- **Progress only ever merges upward.** Completed lessons union in both directions;
  nothing in the sync path can reduce them. A device whose local copy belongs to a
  *different* account is replaced rather than merged, so two people sharing a
  laptop don't inherit each other's progress.

## Before you publish: two copy decisions

- **`src/pages/Legal.jsx` exports `CONTACT_EMAIL = null`.** The contact page has no
  address on it. Set this before you take money — a paid product needs a support
  route, and several jurisdictions require one.
- **Nothing currently promises "lifetime access"**, and I haven't added it. The
  purchase copy says "One payment. Every lesson, prompt, template and download in
  the course." If you *do* intend perpetual access, say so explicitly in
  `src/pages/Legal.jsx` (Terms) and it can go in the purchase panel. If you don't —
  or if you're not sure — leave it as is. Don't put the phrase on the page until
  the Terms actually back it.
