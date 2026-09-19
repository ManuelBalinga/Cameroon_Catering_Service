-- 0007 — Row Level Security
--
-- Every rule in Documentation/ROLE_MODEL.md, expressed here rather than in
-- React. A filter in a component is one forgotten condition away from showing a
-- caterer another business's revenue, which is the worst leak this product has.
--
-- Two notes that matter when changing anything in this file:
--   * RLS fails silently. A wrong policy returns fewer rows, not an error, so a
--     broken permission looks like an empty page rather than a stack trace.
--   * The public half of the marketplace stays public. Requiring an account to
--     browse would be a product mistake dressed up as a security improvement.

-- ---------------------------------------------------------------------------
-- Helper
-- ---------------------------------------------------------------------------

-- Does the signed-in user own this caterer business? SECURITY DEFINER so a
-- policy on caterers can consult caterers without recursing.
create function owns_caterer(target text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.caterers
    where id = target and owner_id = auth.uid()
  )
$$;

-- ---------------------------------------------------------------------------
-- Least privilege: take everything away first, then hand back what is used
-- ---------------------------------------------------------------------------

revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

grant usage on schema public to anon, authenticated;

-- An unauthenticated caller has no business asking the database who is an
-- administrator, or who owns which business.
--
-- `authenticated` keeps EXECUTE on both, and must: the policies below call them,
-- and a policy is evaluated with the privileges of the role running the query,
-- so revoking here would deny every signed-in user their own rows. Both
-- functions answer only about auth.uid(), so they tell the caller nothing about
-- anybody else.
revoke execute on function is_admin() from anon, public;
revoke execute on function owns_caterer(text) from anon, public;
grant execute on function is_admin() to authenticated;
grant execute on function owns_caterer(text) to authenticated;

revoke execute on function handle_new_user() from anon, authenticated, public;
revoke execute on function next_booking_reference() from anon, authenticated, public;
revoke execute on function block_date_on_confirmation() from anon, authenticated, public;
revoke execute on function enforce_review_is_earned() from anon, authenticated, public;
revoke execute on function refresh_caterer_rating() from anon, authenticated, public;
revoke execute on function refresh_caterer_monetisation() from anon, authenticated, public;

-- The two aggregates are the application's own RPCs and run as the caller, so
-- the policies below decide what they can see.
grant execute on function platform_gmv() to authenticated;
grant execute on function platform_commission() to authenticated;

alter table profiles              enable row level security;
alter table caterers              enable row level security;
alter table event_packages        enable row level security;
alter table menu_items            enable row level security;
alter table caterer_blocked_dates enable row level security;
alter table add_on_services       enable row level security;
alter table quote_requests        enable row level security;
alter table bookings              enable row level security;
alter table reviews               enable row level security;
alter table payments              enable row level security;
alter table messages              enable row level security;
alter table featured_listings     enable row level security;
alter table subscriptions         enable row level security;

-- ---------------------------------------------------------------------------
-- The public marketplace — readable without an account, by design
-- ---------------------------------------------------------------------------

grant select on caterers, event_packages, menu_items, caterer_blocked_dates,
                add_on_services, reviews
  to anon, authenticated;

-- Two policies rather than one, because the anon version must not call a
-- function anon is not allowed to execute. Policies are OR'd, so a signed-in
-- owner or administrator still sees the unverified rows.
create policy caterers_public_read on caterers
  for select to anon
  using (verified);

create policy caterers_read on caterers
  for select to authenticated
  using (verified or owns_caterer(id) or is_admin());

create policy packages_public_read on event_packages
  for select to anon, authenticated using (true);

create policy menu_public_read on menu_items
  for select to anon, authenticated using (true);

create policy availability_public_read on caterer_blocked_dates
  for select to anon, authenticated using (true);

create policy addons_public_read on add_on_services
  for select to anon, authenticated using (true);

create policy reviews_public_read on reviews
  for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------

grant select on profiles to authenticated;
-- Note the column list: role is absent. A customer cannot make themselves an
-- administrator by updating their own row, because the privilege to write that
-- column was never granted.
grant update (name, phone, email, city) on profiles to authenticated;

create policy profiles_read_own on profiles
  for select to authenticated
  using (id = auth.uid() or is_admin());

create policy profiles_update_own on profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- Caterers manage their own business, and only the parts that are theirs
-- ---------------------------------------------------------------------------

grant insert on caterers to authenticated;
-- verified, featured, subscription_tier and rating are all absent here. A
-- caterer cannot verify, feature, upgrade or re-rate itself.
grant update (business_name, tagline, about, city, service_areas, cuisines,
              min_guests, price_from_per_guest, price_to_per_guest,
              response_time_hours, years_active, phone, whatsapp, brand_hue,
              gallery)
  on caterers to authenticated;

create policy caterers_insert_own on caterers
  for insert to authenticated
  with check (owner_id = auth.uid());

create policy caterers_update_own on caterers
  for update to authenticated
  using (owner_id = auth.uid() or is_admin())
  with check (owner_id = auth.uid() or is_admin());

create policy caterers_admin_all on caterers
  for all to authenticated
  using (is_admin())
  with check (is_admin());

-- Approval goes through these two functions rather than an UPDATE.
--
-- Column privileges belong to the role, not to the policy, and an administrator
-- is also `authenticated` — so widening the UPDATE grant to include
-- verification_status would hand it to every caterer as well, and a caterer
-- could then approve itself. Two named operations keep the grant narrow and
-- make approving and rejecting genuinely different things, which a shared
-- handler that just cleared the row never did.
create function approve_caterer(target text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'only an administrator can approve a caterer';
  end if;
  update public.caterers
     set verification_status = 'approved',
         rejection_reason = null,
         reviewed_at = now()
   where id = target;
  if not found then
    raise exception 'no such caterer: %', target;
  end if;
end;
$$;

create function reject_caterer(target text, reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'only an administrator can reject a caterer';
  end if;
  update public.caterers
     set verification_status = 'rejected',
         rejection_reason = reason,
         reviewed_at = now()
   where id = target;
  if not found then
    raise exception 'no such caterer: %', target;
  end if;
end;
$$;

revoke execute on function approve_caterer(text) from anon, public;
revoke execute on function reject_caterer(text, text) from anon, public;
grant execute on function approve_caterer(text) to authenticated;
grant execute on function reject_caterer(text, text) to authenticated;

grant insert, update, delete on event_packages, menu_items, caterer_blocked_dates
  to authenticated;

create policy packages_write_own on event_packages
  for all to authenticated
  using (owns_caterer(caterer_id) or is_admin())
  with check (owns_caterer(caterer_id) or is_admin());

create policy menu_write_own on menu_items
  for all to authenticated
  using (owns_caterer(caterer_id) or is_admin())
  with check (owns_caterer(caterer_id) or is_admin());

create policy availability_write_own on caterer_blocked_dates
  for all to authenticated
  using (owns_caterer(caterer_id) or is_admin())
  with check (owns_caterer(caterer_id) or is_admin());

-- ---------------------------------------------------------------------------
-- Quote requests — the customer who sent it, the caterer it names, admins
-- ---------------------------------------------------------------------------

grant select, insert on quote_requests to authenticated;
grant update (status, caterer_id) on quote_requests to authenticated;

create policy quotes_read_own on quote_requests
  for select to authenticated
  using (
    customer_id = auth.uid()
    or (caterer_id is not null and owns_caterer(caterer_id))
    or is_admin()
  );

create policy quotes_insert_own on quote_requests
  for insert to authenticated
  with check (customer_id = auth.uid());

create policy quotes_update_participants on quote_requests
  for update to authenticated
  using (
    customer_id = auth.uid()
    or (caterer_id is not null and owns_caterer(caterer_id))
    or is_admin()
  )
  with check (
    customer_id = auth.uid()
    or (caterer_id is not null and owns_caterer(caterer_id))
    or is_admin()
  );

-- ---------------------------------------------------------------------------
-- Bookings — the strongest rule on the list
-- ---------------------------------------------------------------------------

grant select, insert on bookings to authenticated;
-- total and commission_rate are absent: neither party can rewrite what was
-- agreed after the fact.
grant update (status, payment_method) on bookings to authenticated;

create policy bookings_read_own on bookings
  for select to authenticated
  using (customer_id = auth.uid() or owns_caterer(caterer_id) or is_admin());

create policy bookings_insert_own on bookings
  for insert to authenticated
  with check (customer_id = auth.uid());

create policy bookings_update_participants on bookings
  for update to authenticated
  using (customer_id = auth.uid() or owns_caterer(caterer_id) or is_admin())
  with check (customer_id = auth.uid() or owns_caterer(caterer_id) or is_admin());

-- ---------------------------------------------------------------------------
-- Reviews — insertable only by the customer whose booking it was
-- ---------------------------------------------------------------------------

grant insert on reviews to authenticated;

create policy reviews_insert_own_booking on reviews
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from bookings b
       where b.id = booking_id
         and b.customer_id = auth.uid()
         and b.status = 'completed'
    )
  );

-- Removal is an administrator action, for abuse. Nobody edits review text,
-- including the person who wrote it and the business it describes.
create policy reviews_admin_delete on reviews
  for delete to authenticated using (is_admin());

grant delete on reviews to authenticated;

-- ---------------------------------------------------------------------------
-- Payments — readable by the parties, writable by nobody through the API
-- ---------------------------------------------------------------------------

grant select on payments to authenticated;

create policy payments_read_own on payments
  for select to authenticated
  using (
    exists (
      select 1 from bookings b
       where b.id = payments.booking_id
         and (b.customer_id = auth.uid() or owns_caterer(b.caterer_id))
    )
    or is_admin()
  );

-- No insert or update grant at all: payment rows are written by the server with
-- the service role, from a provider webhook. A client that can write its own
-- payment row can mark a booking paid.

-- ---------------------------------------------------------------------------
-- Messages — only the two parties to a booking
-- ---------------------------------------------------------------------------

grant select, insert on messages to authenticated;
grant update (read_at) on messages to authenticated;

create policy messages_read_participants on messages
  for select to authenticated
  using (
    exists (
      select 1 from bookings b
       where b.id = messages.booking_id
         and (b.customer_id = auth.uid() or owns_caterer(b.caterer_id))
    )
    or is_admin()
  );

create policy messages_insert_participants on messages
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from bookings b
       where b.id = booking_id
         and (b.customer_id = auth.uid() or owns_caterer(b.caterer_id))
    )
  );

create policy messages_mark_read on messages
  for update to authenticated
  using (
    exists (
      select 1 from bookings b
       where b.id = messages.booking_id
         and (b.customer_id = auth.uid() or owns_caterer(b.caterer_id))
    )
  )
  with check (true);

-- ---------------------------------------------------------------------------
-- Monetisation — a caterer sees its own billing; nobody sells to themselves
-- ---------------------------------------------------------------------------

grant select on featured_listings, subscriptions to authenticated;

create policy featured_read_own on featured_listings
  for select to authenticated
  using (owns_caterer(caterer_id) or is_admin());

create policy featured_admin_write on featured_listings
  for all to authenticated
  using (is_admin()) with check (is_admin());

create policy subscriptions_read_own on subscriptions
  for select to authenticated
  using (owns_caterer(caterer_id) or is_admin());

create policy subscriptions_admin_write on subscriptions
  for all to authenticated
  using (is_admin()) with check (is_admin());

grant insert, update, delete on featured_listings, subscriptions to authenticated;
