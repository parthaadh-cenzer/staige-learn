-- ============================================================================
--  0002 · Allow honest administrative entitlements.
--
--  Only needed if 0001 was applied BEFORE this change; a fresh 0001 already
--  includes it. Safe to run either way — it is idempotent.
--
--  WHY: the owner and any future support/comp grants need a `course_access` row
--  with no Stripe purchase behind it. The alternative — fabricating a purchase
--  with a made-up payment intent id — would put revenue in the books that does
--  not exist in Stripe and would never reconcile. So the entitlement records what
--  actually happened: someone was granted access administratively.
--
--  `purchase_id` is already nullable in 0001, so an admin grant needs no fake
--  purchase to point at. This migration only widens the `source` check.
--
--  The refund path in api/stripe-webhook.mjs revokes access only when
--  `source = 'purchase'`, so an admin grant is unaffected by any refund.
-- ============================================================================

alter table public.course_access
  drop constraint if exists course_access_source_check;

alter table public.course_access
  add constraint course_access_source_check
  check (source in ('purchase', 'manual', 'gift', 'admin_grant', 'owner_access'));

-- Belt and braces: prove purchase_id really is nullable, and fail loudly here
-- rather than at 2am when someone tries to grant access.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'course_access'
      and column_name = 'purchase_id' and is_nullable = 'NO'
  ) then
    raise exception 'course_access.purchase_id is NOT NULL — administrative grants would require a fabricated purchase. Make it nullable.';
  end if;
end $$;
