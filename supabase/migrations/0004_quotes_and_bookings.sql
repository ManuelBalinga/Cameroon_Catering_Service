-- 0004 — Quote requests and bookings
--
-- The funnel: a customer asks for a quote, caterers reply, one becomes a
-- booking, a deposit confirms it.

create table quote_requests (
  id               uuid primary key default gen_random_uuid(),
  customer_id      uuid not null references profiles (id) on delete cascade,
  -- Null when the request went to the marketplace rather than to one business.
  caterer_id       text references caterers (id) on delete set null,
  event_type       event_type not null,
  event_date       date not null,
  city             text not null,
  guest_count      integer not null check (guest_count > 0),
  cuisine          cuisine,
  budget_per_guest fcfa,
  add_ons          text[] not null default '{}',
  special_requests text,
  status           booking_status not null default 'quote_requested',
  created_at       timestamptz not null default now()
);

create index quote_requests_customer_idx on quote_requests (customer_id, created_at desc);
create index quote_requests_caterer_idx  on quote_requests (caterer_id, status);
create index quote_requests_open_idx     on quote_requests (status) where status = 'quote_requested';

comment on table quote_requests is
  'A customer asking for a price. Visible to the customer who sent it, the caterer it names, and administrators.';

-- Booking references are human-readable because people read them down a phone
-- line. Generated in the database so that the reference exists before any
-- payment provider is called, and so two customers cannot be handed the same
-- one — the browser generated CCS- plus four random digits, which collided at
-- roughly one in ten thousand.
create sequence booking_reference_seq start 1000;

create function next_booking_reference()
returns text
language sql
volatile
as $$
  select 'CCS-' || to_char(now(), 'YY') || '-' || lpad(nextval('booking_reference_seq')::text, 5, '0')
$$;

create table bookings (
  id              uuid primary key default gen_random_uuid(),
  reference       text unique not null default next_booking_reference(),
  caterer_id      text not null references caterers (id) on delete restrict,
  customer_id     uuid not null references profiles (id) on delete restrict,
  quote_request_id uuid references quote_requests (id) on delete set null,

  event_type      event_type not null,
  event_date      date not null,
  city            text not null,
  guest_count     integer not null check (guest_count > 0),

  total           fcfa not null,
  deposit_amount  fcfa not null,
  -- Stored per booking rather than derived, because the rate a caterer was on
  -- when they booked must not change retroactively if the platform's default
  -- moves or they upgrade to Premium.
  commission_rate numeric(4,3) not null check (commission_rate between 0.100 and 0.150),

  payment_method  payment_method not null,
  status          booking_status not null default 'deposit_pending',
  created_at      timestamptz not null default now(),

  constraint deposit_within_total check (deposit_amount <= total)
);

create index bookings_customer_idx on bookings (customer_id, event_date desc);
create index bookings_caterer_idx  on bookings (caterer_id, event_date desc);
create index bookings_status_idx   on bookings (status);

comment on column bookings.commission_rate is
  'The rate agreed at booking time. Never recomputed — a Premium upgrade does not rebate past bookings, and a platform-wide change does not touch them.';

-- Confirmed bookings consume the caterer's availability. Doing this in a trigger
-- means the calendar cannot drift from the bookings table, whichever code path
-- created the booking.
create function block_date_on_confirmation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status in ('confirmed', 'completed') then
    insert into public.caterer_blocked_dates (caterer_id, date, reason)
    values (new.caterer_id, new.event_date, 'booking ' || new.reference)
    on conflict (caterer_id, date) do nothing;
  end if;
  return new;
end;
$$;

create trigger bookings_block_date
  after insert or update of status on bookings
  for each row execute function block_date_on_confirmation();
