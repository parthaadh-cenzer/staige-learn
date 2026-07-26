-- ============================================================================
--  0004 · Register AI App Builder OS as a real, sellable course.
--
--  Additive and non-destructive. Safe to run on a live database. Idempotent.
--  Touches nothing that belongs to the three existing courses.
--
--  WHAT THIS DOES
--    1. Adds the `ai-app-builder-os` row to public.courses. Purchases,
--       entitlements and progress all point at courses.id, so the course must
--       exist here before /api/checkout will create a session for it.
--    2. Adds the `app-builder` product row, keyed to match
--       shared/catalog.mjs and the STRIPE_PRICE_APP_BUILDER_* env vars.
--
--  WHAT THIS DELIBERATELY DOES NOT DO
--    · It does not write Stripe Price IDs. The server reads those from the
--      ENVIRONMENT (api/_lib/pricing.mjs) and the environment is the single
--      authority — see the note on public.products in 0001.
--    · It does not grant anyone access. Entitlement comes from a verified
--      Stripe payment via the webhook, or from an explicit administrative grant
--      (supabase/scripts/grant_owner_access.sql). Nothing here fabricates one.
--
--  AFTER RUNNING THIS
--    · Create the two Stripe Prices for AI App Builder OS and set
--      STRIPE_PRICE_APP_BUILDER_REGULAR / STRIPE_PRICE_APP_BUILDER_INTRO in
--      Vercel. Until they exist, /api/checkout returns a clean 503 for this
--      product and every other course keeps working.
--    · Re-run supabase/scripts/grant_owner_access.sql to extend the owner's
--      entitlement to the new course (it now grants every active course, so no
--      edit is needed when the next one lands).
-- ============================================================================

insert into public.courses (slug, title, status) values
  ('ai-app-builder-os', 'AI App Builder OS', 'active')
on conflict (slug) do update set title = excluded.title, status = excluded.status;

insert into public.products (key, course_id, currency, active)
select 'app-builder', c.id, 'usd', true
from public.courses c
where c.slug = 'ai-app-builder-os'
on conflict (key) do update set course_id = excluded.course_id, active = excluded.active;

-- Verify: expect one course row and one product row, joined.
select c.slug, c.status, p.key, p.active
from public.courses c
join public.products p on p.course_id = c.id
where c.slug = 'ai-app-builder-os';
