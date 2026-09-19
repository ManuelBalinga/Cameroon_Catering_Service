-- 0006 — Featured listings and subscriptions
--
-- Two of the four revenue streams. Both were buttons with no handler until the
-- dashboard learned to put a caterer into a "requested" state; this is where
-- those requests will land once billing exists.

create table featured_listings (
  id          uuid primary key default gen_random_uuid(),
  caterer_id  text not null references caterers (id) on delete cascade,
  starts_at   timestamptz not null default now(),
  ends_at     timestamptz not null,
  price_paid  fcfa not null,
  payment_id  uuid references payments (id) on delete set null,
  created_at  timestamptz not null default now(),

  constraint featured_window_is_ordered check (ends_at > starts_at)
);

create index featured_listings_active_idx on featured_listings (caterer_id, ends_at desc);

create table subscriptions (
  id            uuid primary key default gen_random_uuid(),
  caterer_id    text not null references caterers (id) on delete cascade,
  tier          subscription_tier not null default 'premium',
  monthly_price fcfa not null,
  started_at    timestamptz not null default now(),
  ends_at       timestamptz,
  cancelled_at  timestamptz,
  created_at    timestamptz not null default now()
);

-- A caterer has at most one uncancelled subscription at a time. The predicate
-- deliberately does not mention now(): an index predicate must be IMMUTABLE, and
-- a row that has lapsed is closed by setting cancelled_at rather than by the
-- clock moving underneath the index.
create unique index subscriptions_one_live_per_caterer
  on subscriptions (caterer_id)
  where cancelled_at is null;

create index subscriptions_caterer_idx on subscriptions (caterer_id, started_at desc);

-- The featured flag and the tier on caterers are a cache of these two tables.
-- Keeping them in a trigger means browse can sort on a column while the truth
-- stays in the billing record.
create function refresh_caterer_monetisation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target text := coalesce(new.caterer_id, old.caterer_id);
begin
  update public.caterers c
     set featured = exists (
           select 1 from public.featured_listings f
            where f.caterer_id = target and f.ends_at > now()
         ),
         subscription_tier = case when exists (
           select 1 from public.subscriptions s
            where s.caterer_id = target
              and s.cancelled_at is null
              and (s.ends_at is null or s.ends_at > now())
         ) then 'premium'::subscription_tier else 'free'::subscription_tier end
   where c.id = target;
  return null;
end;
$$;

create trigger featured_listings_refresh
  after insert or update or delete on featured_listings
  for each row execute function refresh_caterer_monetisation();

create trigger subscriptions_refresh
  after insert or update or delete on subscriptions
  for each row execute function refresh_caterer_monetisation();

-- Platform totals. These run as the caller, so an ordinary signed-in customer
-- asking for platform GMV gets their own bookings and nothing else — the
-- policies do the filtering rather than a WHERE clause somebody can forget.
create function platform_gmv()
returns bigint
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(sum(total), 0)::bigint
    from public.bookings
   where status in ('confirmed', 'completed')
$$;

create function platform_commission()
returns bigint
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(sum(round(total * commission_rate)), 0)::bigint
    from public.bookings
   where status in ('confirmed', 'completed')
$$;
