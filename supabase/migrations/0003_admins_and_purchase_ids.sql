-- ============================================================================
--  0003 · A real, server-enforced admin role + richer purchase records.
--
--  Additive and non-destructive. Safe to run on a live database. Idempotent.
--
--  TWO things:
--
--  1. public.admins — a server-enforced admin role, SEPARATE from course_access.
--     owner_access entitlements say "this account may READ these courses";
--     admin says "this account may run administrative functions". Keeping them
--     apart means an owner grant never accidentally confers admin power, and a
--     future admin who owns nothing still works.
--
--     SECURITY: RLS lets a user READ their own admin row (so the UI can reflect
--     it) but there is NO insert/update/delete policy — exactly like
--     course_access. A user therefore cannot make themselves an admin from the
--     browser; only the service-role key (server) can write this table. Admin
--     authority never depends on client state, email text, or a hidden element.
--
--  2. purchases gains stripe_customer_id + stripe_product_id, so a paid record
--     stores the full Stripe identifier set (customer, session, payment intent,
--     product, price) the reporting/reconciliation code wants.
-- ============================================================================

-- ── admins ──────────────────────────────────────────────────────────────────
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  note       text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Read your own admin row; write nothing. Service-role bypasses RLS and is the
-- only thing that can grant admin (see supabase/scripts/grant_owner_access.sql).
drop policy if exists "admins_select_own" on public.admins;
create policy "admins_select_own" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

-- ── purchases · full Stripe identifier set ──────────────────────────────────
alter table public.purchases add column if not exists stripe_customer_id text;
alter table public.purchases add column if not exists stripe_product_id  text;
