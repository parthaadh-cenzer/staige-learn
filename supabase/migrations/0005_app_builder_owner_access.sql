-- ============================================================================
--  0005 · AI App Builder OS — register the course AND grant the owner access.
--
--  WHY THIS EXISTS
--  0004 registers the course; supabase/scripts/grant_owner_access.sql grants the
--  owner. Both are manual steps, and in production NEITHER had been run — a
--  query against the live database showed public.courses holding only
--  ai-side-hustle-os, ai-marketing-os and ai-job-hunter-os. With no course row
--  there is nothing for course_access to point at, so the owner grant could not
--  have worked even if it had been run: it selects `from public.courses where
--  status = 'active'`, which matched nothing for this course.
--
--  The frontend was behaving correctly the whole time. `ownsCourse()` asks
--  course_access through RLS, found no row, and showed the paywall. The data was
--  missing, not the logic.
--
--  So this migration is deliberately SELF-SUFFICIENT: run this one file and the
--  owner has access, whether or not 0004 ever ran. It is additive, idempotent,
--  and safe to run repeatedly.
--
--  WHAT IT DOES NOT DO
--    · No purchases row. An administrative grant is recorded as what it is
--      (source = 'owner_access', purchase_id = null). Inventing a purchase would
--      put revenue in the books that Stripe has never heard of.
--    · Touches no other user. Every write is scoped to the owner's user_id.
--    · Revokes nothing, deletes nothing, alters no schema.
--    · Does not fail if the owner has not signed up yet — it raises a NOTICE and
--      leaves the course/product rows in place, so it can simply be re-run.
--
--  VERIFY AFTER RUNNING: the SELECT at the bottom must show one row with
--  source = 'owner_access', purchase_id = null, revoked_at = null,
--  is_admin = true, purchase_rows_should_be_zero = 0.
-- ============================================================================

-- ── 1 · The course ──────────────────────────────────────────────────────────
-- Must exist before anything can reference it. Matches src/data/courses/
-- ai-app-builder-os.js (slug) and 0001's status check constraint.
insert into public.courses (slug, title, status) values
  ('ai-app-builder-os', 'AI App Builder OS', 'active')
on conflict (slug) do update
  set title = excluded.title,
      status = excluded.status;

-- ── 2 · The product ─────────────────────────────────────────────────────────
-- `key` must match shared/catalog.mjs ('app-builder') and the
-- STRIPE_PRICE_APP_BUILDER_{REGULAR,INTRO} env var names. Price IDs are
-- deliberately NOT written here — the server reads those from the environment,
-- which is the single authority (see the note on public.products in 0001).
insert into public.products (key, course_id, currency, active)
select 'app-builder', c.id, 'usd', true
from public.courses c
where c.slug = 'ai-app-builder-os'
on conflict (key) do update
  set course_id = excluded.course_id,
      active = excluded.active;

-- ── 3 · Owner admin role + entitlement ──────────────────────────────────────
do $$
declare
  v_email   text := 'partha.adh@gmail.com';
  v_user_id uuid;
  v_course  uuid;
begin
  select id into v_user_id from auth.users where lower(email) = lower(v_email);
  select id into v_course  from public.courses where slug = 'ai-app-builder-os';

  if v_user_id is null then
    -- Not an error: the course and product above are still registered, which is
    -- the half of this migration that does not depend on a person existing.
    raise notice 'No auth.users row for %. Course and product are registered; re-run this file after that account signs up to grant it access.', v_email;
    return;
  end if;

  -- Server-enforced admin role (0003). RLS lets a user READ their own row so the
  -- UI can reflect it, and there is no insert/update/delete policy — only the
  -- service-role key (i.e. this script) can write it. Admin can therefore never
  -- be conferred from the browser, by an email string, or by client state.
  insert into public.admins (user_id, note)
  values (v_user_id, 'owner')
  on conflict (user_id) do nothing;

  -- The entitlement itself. `revoked_at = null` also re-activates a previously
  -- revoked grant. The refund handler in api/stripe-webhook.mjs only revokes
  -- rows with source = 'purchase', so this grant is immune to refund events.
  -- `granted_at` is deliberately absent from the DO UPDATE: it is NOT NULL with
  -- a default, so an existing row always has a real value, and leaving it alone
  -- preserves when access was FIRST granted instead of resetting it on every
  -- re-run. (It also avoids the schema-qualified excluded/target reference that
  -- makes ON CONFLICT clauses fragile.)
  insert into public.course_access (user_id, course_id, source, purchase_id, granted_at, revoked_at)
  values (v_user_id, v_course, 'owner_access', null, now(), null)
  on conflict (user_id, course_id) do update
    set source     = 'owner_access',
        revoked_at = null;

  raise notice 'Granted AI App Builder OS to % (user_id %) with source=owner_access, no purchase row.', v_email, v_user_id;
end $$;

-- ── Verify ──────────────────────────────────────────────────────────────────
-- Expect exactly one row. purchase_rows_should_be_zero MUST read 0.
select
  u.email,
  c.slug,
  ca.source,
  ca.purchase_id,
  ca.revoked_at,
  exists (select 1 from public.admins a where a.user_id = u.id) as is_admin,
  (select count(*) from public.purchases p where p.user_id = u.id) as purchase_rows_should_be_zero
from public.course_access ca
join auth.users u     on u.id = ca.user_id
join public.courses c on c.id = ca.course_id
where lower(u.email) = lower('partha.adh@gmail.com')
  and c.slug = 'ai-app-builder-os';
