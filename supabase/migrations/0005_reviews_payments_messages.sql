-- 0005 — Reviews, payments and messages

-- The platform's trust model in one table. A review exists only against a
-- completed booking, and only one per booking — the unique constraint and the
-- trigger below are what make the "verified booking" badge mean something.
create table reviews (
  id          uuid primary key default gen_random_uuid(),
  caterer_id  text not null references caterers (id) on delete cascade,
  booking_id  uuid not null unique references bookings (id) on delete cascade,
  author_id   uuid not null references profiles (id) on delete cascade,
  city        text not null,
  event_type  event_type not null,
  rating      smallint not null check (rating between 1 and 5),
  comment     localized not null,
  created_at  timestamptz not null default now()
);

create index reviews_caterer_idx on reviews (caterer_id, created_at desc);

comment on table reviews is
  'One review per completed booking, written by the customer who made it. Enforced here rather than in the UI, because the UI is a URL anyone can type.';

create function enforce_review_is_earned()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  b record;
begin
  select customer_id, caterer_id, status, event_type, city
    into b
    from public.bookings
   where id = new.booking_id;

  if b is null then
    raise exception 'review references a booking that does not exist';
  end if;
  if b.customer_id <> new.author_id then
    raise exception 'a review must be written by the customer who made the booking';
  end if;
  if b.status <> 'completed' then
    raise exception 'a booking can only be reviewed once it is completed';
  end if;
  if b.caterer_id <> new.caterer_id then
    raise exception 'review caterer does not match the booking';
  end if;
  return new;
end;
$$;

create trigger reviews_must_be_earned
  before insert or update on reviews
  for each row execute function enforce_review_is_earned();

-- Keep the denormalised rating on the caterer in step with reality.
create function refresh_caterer_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target text := coalesce(new.caterer_id, old.caterer_id);
begin
  update public.caterers c
     set rating = coalesce(r.avg_rating, 0),
         review_count = coalesce(r.n, 0)
    from (
      select round(avg(rating)::numeric, 1) as avg_rating, count(*) as n
        from public.reviews where caterer_id = target
    ) r
   where c.id = target;
  return null;
end;
$$;

create trigger reviews_refresh_rating
  after insert or update or delete on reviews
  for each row execute function refresh_caterer_rating();

-- Every payment attempt is a row, successes and failures alike. When a customer
-- says they paid and the platform says they did not, this table is the only
-- thing that settles it.
create table payments (
  id                  uuid primary key default gen_random_uuid(),
  booking_id          uuid not null references bookings (id) on delete cascade,
  method              payment_method not null,
  amount              fcfa not null,
  status              payment_status not null default 'pending',
  -- The reference handed to the provider, and what their webhook quotes back.
  external_reference  text not null,
  provider_txn_id     text,
  -- Provider payloads, kept verbatim for reconciliation.
  provider_payload    jsonb,
  failure_reason      text,
  created_at          timestamptz not null default now(),
  settled_at          timestamptz
);

create unique index payments_external_reference_idx on payments (external_reference);
create index payments_booking_idx on payments (booking_id, created_at desc);
create index payments_pending_idx on payments (status) where status = 'pending';

comment on table payments is
  'One row per attempt. Mobile Money is asynchronous: the customer approves a USSD prompt minutes later, or never, and the webhook is what decides.';

-- In-app messaging is out of the MVP in favour of WhatsApp, but the table is
-- here because bookings need somewhere to put a written record of what was
-- agreed when that changes.
create table messages (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings (id) on delete cascade,
  sender_id  uuid not null references profiles (id) on delete cascade,
  body       text not null check (length(trim(body)) > 0),
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index messages_booking_idx on messages (booking_id, created_at);
