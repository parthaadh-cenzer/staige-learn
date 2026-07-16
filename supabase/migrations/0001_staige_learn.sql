-- ============================================================================
--  STAIGE Learning Platform · initial schema
--  Target: a NEW, EMPTY Supabase project (staige-learn).
--  Do NOT run this against the existing STAIGE video-platform project — that
--  project has its own `profiles` table with a different shape and 11 live users.
--
--  Run once, in the SQL Editor, top to bottom. It is idempotent.
--
--  Security model, in one paragraph:
--    Learners may read their own rows and write only their own PROGRESS and
--    PROFILE. Nobody — not even a logged-in user with the anon key — can insert,
--    update or delete `purchases`, `course_access` or `webhook_events`. Those
--    tables are written exclusively by the Stripe webhook using the service-role
--    key, which lives only in Vercel's server environment. Entitlement therefore
--    cannot be forged from the browser: it exists only if Stripe told us it does.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── profiles ────────────────────────────────────────────────────────────────
-- One row per auth user. Created automatically by the trigger at the bottom.
create table if not exists public.profiles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null unique references auth.users (id) on delete cascade,
  display_name text,
  email        text,
  avatar_url   text,
  -- Lets a returning learner reuse their Stripe customer instead of creating a
  -- duplicate on every purchase. Written by the server only; harmless if read.
  stripe_customer_id text unique,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── courses ─────────────────────────────────────────────────────────────────
-- Mirrors the code registry (src/data/courses/index.js). The app still reads
-- course CONTENT from code; this table exists so purchases/access/progress have
-- a real foreign key to point at.
create table if not exists public.courses (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  title      text not null,
  status     text not null default 'active' check (status in ('active', 'coming-soon', 'locked')),
  created_at timestamptz not null default now()
);

-- ── products ────────────────────────────────────────────────────────────────
-- A sellable thing. `key` matches the product keys in shared/catalog.mjs and the
-- STRIPE_PRICE_<KEY>_{REGULAR,INTRO} environment variable names.
--
-- NOTE ON AUTHORITY: the Stripe Price IDs used to create a Checkout Session and
-- to validate a webhook are read from ENVIRONMENT VARIABLES on the server, not
-- from this table. The columns below are a convenience mirror for reporting and
-- may be left null. If they are populated and disagree with the environment, the
-- ENVIRONMENT WINS. Keeping one authority is deliberate — see docs/LAUNCH.md.
create table if not exists public.products (
  id                    uuid primary key default gen_random_uuid(),
  key                   text not null unique,
  course_id             uuid not null references public.courses (id) on delete cascade,
  stripe_price_id_regular text,
  stripe_price_id_intro   text,
  currency              text not null default 'usd',
  active                boolean not null default true,
  created_at            timestamptz not null default now()
);

-- ── purchases ───────────────────────────────────────────────────────────────
-- The verified payment record. Written by the webhook only.
create table if not exists public.purchases (
  id                         uuid primary key default gen_random_uuid(),
  user_id                    uuid not null references auth.users (id) on delete cascade,
  course_id                  uuid not null references public.courses (id) on delete restrict,
  product_key                text,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id   text,
  stripe_price_id            text,
  amount_paid_cents          integer,
  currency                   text not null default 'usd',
  status                     text not null default 'pending'
                             check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);
create index if not exists purchases_user_idx on public.purchases (user_id);
create index if not exists purchases_pi_idx   on public.purchases (stripe_payment_intent_id);

-- ── course_access ───────────────────────────────────────────────────────────
-- The entitlement itself. Written by the webhook only. THIS is what unlocks a
-- course; a purchase row alone does not.
create table if not exists public.course_access (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  course_id   uuid not null references public.courses (id) on delete cascade,
  -- How this entitlement came to exist. 'purchase' is the only value the webhook
  -- ever writes. The administrative values exist so an owner/support grant is
  -- recorded HONESTLY rather than by fabricating a Stripe purchase that never
  -- happened — a fake purchase row would corrupt revenue reporting and reconcile
  -- against nothing in Stripe.
  source      text not null default 'purchase'
              check (source in ('purchase', 'manual', 'gift', 'admin_grant', 'owner_access')),
  -- Deliberately nullable: an administrative grant has no purchase to point at,
  -- and inventing a purchase id to satisfy a NOT NULL would be the same lie in a
  -- different column. `on delete set null` keeps the entitlement alive if a
  -- purchase row is ever removed.
  purchase_id uuid references public.purchases (id) on delete set null,
  granted_at  timestamptz not null default now(),
  revoked_at  timestamptz,
  unique (user_id, course_id)
);
create index if not exists course_access_user_idx on public.course_access (user_id);

-- ── course_progress ─────────────────────────────────────────────────────────
-- One row per user per course. `completed_lesson_ids` is the durable spine; the
-- rest of the learner's answers ride along in `state` so migrating the existing
-- localStorage store is lossless.
create table if not exists public.course_progress (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users (id) on delete cascade,
  course_slug          text not null,
  completed_lesson_ids text[] not null default '{}',
  last_lesson_id       text,
  state                jsonb not null default '{}'::jsonb,
  updated_at           timestamptz not null default now(),
  unique (user_id, course_slug)
);
create index if not exists course_progress_user_idx on public.course_progress (user_id);

-- ── webhook_events ──────────────────────────────────────────────────────────
-- Idempotency ledger. Stripe retries; this table makes a replay a no-op.
create table if not exists public.webhook_events (
  id              uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  type            text not null,
  status          text not null default 'processing'
                  check (status in ('processing', 'processed', 'failed')),
  error           text,
  received_at     timestamptz not null default now(),
  processed_at    timestamptz
);

-- ============================================================================
--  ROW LEVEL SECURITY
--  Enabled on every table. The service-role key used by the webhook bypasses
--  RLS by design; the anon key the browser holds does not.
-- ============================================================================
alter table public.profiles        enable row level security;
alter table public.courses         enable row level security;
alter table public.products        enable row level security;
alter table public.purchases       enable row level security;
alter table public.course_access   enable row level security;
alter table public.course_progress enable row level security;
alter table public.webhook_events  enable row level security;

-- profiles · a user reads and edits exactly their own.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- courses / products · the public catalogue. Read-only to everyone, including
-- signed-out visitors browsing the homepage. No write policy exists for anyone.
drop policy if exists "courses_select_all" on public.courses;
create policy "courses_select_all" on public.courses
  for select to anon, authenticated using (true);

drop policy if exists "products_select_active" on public.products;
create policy "products_select_active" on public.products
  for select to anon, authenticated using (active);

-- purchases · readable by their owner, writable by nobody. The webhook uses the
-- service-role key and bypasses this.
drop policy if exists "purchases_select_own" on public.purchases;
create policy "purchases_select_own" on public.purchases
  for select to authenticated using (user_id = (select auth.uid()));

-- course_access · the entitlement. Same rule: read your own, write never.
-- A user forging a row here is what would break the paywall, so there is
-- deliberately no insert/update/delete policy on this table at all.
drop policy if exists "course_access_select_own" on public.course_access;
create policy "course_access_select_own" on public.course_access
  for select to authenticated using (user_id = (select auth.uid()));

-- course_progress · the one table a learner genuinely owns and writes.
drop policy if exists "course_progress_select_own" on public.course_progress;
create policy "course_progress_select_own" on public.course_progress
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "course_progress_insert_own" on public.course_progress;
create policy "course_progress_insert_own" on public.course_progress
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "course_progress_update_own" on public.course_progress;
create policy "course_progress_update_own" on public.course_progress
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "course_progress_delete_own" on public.course_progress;
create policy "course_progress_delete_own" on public.course_progress
  for delete to authenticated using (user_id = (select auth.uid()));

-- webhook_events · RLS on, zero policies. Nothing reachable by anon or
-- authenticated can touch it; only the service-role key can.

-- ============================================================================
--  TRIGGERS
-- ============================================================================

-- Keep updated_at honest.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists purchases_touch on public.purchases;
create trigger purchases_touch before update on public.purchases
  for each row execute function public.touch_updated_at();

drop trigger if exists course_progress_touch on public.course_progress;
create trigger course_progress_touch before update on public.course_progress
  for each row execute function public.touch_updated_at();

-- Every new auth user gets a profile, without the client having to ask.
-- SECURITY DEFINER because the row is created before the user has a session.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
--  SEED · the three courses that are on sale, and their products.
--  Slugs and product keys must match shared/catalog.mjs exactly.
--  The three Coming Soon courses are deliberately NOT seeded — they are not
--  sellable and must not appear as products.
-- ============================================================================
insert into public.courses (slug, title, status) values
  ('ai-side-hustle-os', 'AI Side Hustle OS', 'active'),
  ('ai-marketing-os',   'AI Marketing OS',   'active'),
  ('ai-job-hunter-os',  'AI Job Hunter OS',  'active')
on conflict (slug) do update set title = excluded.title, status = excluded.status;

insert into public.products (key, course_id, currency, active)
select v.key, c.id, 'usd', true
from (values
  ('side-hustle', 'ai-side-hustle-os'),
  ('marketing',   'ai-marketing-os'),
  ('job-hunter',  'ai-job-hunter-os')
) as v (key, slug)
join public.courses c on c.slug = v.slug
on conflict (key) do update set course_id = excluded.course_id, active = excluded.active;
