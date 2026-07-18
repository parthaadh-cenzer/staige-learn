-- ============================================================================
--  Grant administrative access to the owner account.
--
--  RUN THIS ONLY AFTER partha.adh@gmail.com has signed up at
--  https://learn.staige.world/signup — the account must exist in auth.users
--  first. Creating an auth user requires setting a password, which is the
--  account owner's job, not something to script.
--
--  WHY NO PURCHASE ROW: this grants access WITHOUT fabricating a Stripe
--  purchase. A fake `purchases` row with an invented payment_intent id would
--  put $5 of revenue in the books that does not exist in Stripe, would never
--  reconcile, and would quietly corrupt every revenue query forever. The
--  entitlement instead records what actually happened: an administrative grant.
--
--  `purchase_id` stays null — 0001 makes it nullable precisely so this is
--  possible honestly. `source = 'owner_access'` is a real, checked value.
--
--  The refund handler in api/stripe-webhook.mjs only revokes rows with
--  `source = 'purchase'`, so this grant is immune to refund events.
--
--  Idempotent: re-running re-activates the grant and changes nothing else.
--  Coming Soon courses are not in `public.courses`, so they cannot be granted
--  here even by mistake.
-- ============================================================================

do $$
declare
  v_user_id uuid;
  v_granted int;
begin
  select id into v_user_id from auth.users where lower(email) = lower('partha.adh@gmail.com');

  if v_user_id is null then
    raise exception 'No auth user for partha.adh@gmail.com. Sign up at https://learn.staige.world/signup first, then re-run this script.';
  end if;

  insert into public.course_access (user_id, course_id, source, purchase_id, granted_at, revoked_at)
  select v_user_id, c.id, 'owner_access', null, now(), null
  from public.courses c
  where c.status = 'active'
    and c.slug in ('ai-side-hustle-os', 'ai-marketing-os', 'ai-job-hunter-os')
  on conflict (user_id, course_id) do update
    set source     = 'owner_access',
        revoked_at = null,
        granted_at = coalesce(public.course_access.granted_at, now());

  get diagnostics v_granted = row_count;

  -- Server-enforced admin role (migration 0003), separate from course access.
  -- A user cannot write this table from the browser; only this service-role
  -- script (or another server path) can. Idempotent.
  insert into public.admins (user_id, note)
  values (v_user_id, 'owner')
  on conflict (user_id) do nothing;

  raise notice 'Granted/refreshed % owner entitlements + admin role for % (user_id %)', v_granted, 'partha.adh@gmail.com', v_user_id;
end $$;

-- Verify. Expect exactly 3 rows, all source=owner_access, purchase_id null,
-- revoked_at null, is_admin = true — and no purchases row for this user.
select
  u.email,
  c.slug,
  ca.source,
  ca.purchase_id,
  ca.granted_at,
  ca.revoked_at,
  exists (select 1 from public.admins a where a.user_id = u.id) as is_admin,
  (select count(*) from public.purchases p where p.user_id = u.id) as purchase_rows_should_be_zero
from public.course_access ca
join auth.users u    on u.id = ca.user_id
join public.courses c on c.id = ca.course_id
where lower(u.email) = lower('partha.adh@gmail.com')
order by c.slug;
