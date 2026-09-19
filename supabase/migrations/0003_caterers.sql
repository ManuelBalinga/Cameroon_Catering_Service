-- 0003 — Caterers, their packages, menus and availability

create table caterers (
  -- A slug, because it is the URL: /caterers/mamie-nkeng.
  id                    text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  owner_id              uuid references profiles (id) on delete set null,
  business_name         text not null check (length(trim(business_name)) > 0),
  tagline               localized not null,
  about                 localized not null,
  city                  text not null,
  service_areas         text[] not null default '{}',
  cuisines              cuisine[] not null default '{}',

  -- Admin-controlled. A caterer must never be able to verify or feature itself.
  -- verification_status is not in any UPDATE grant, so no signed-in role can
  -- write it directly; approve_caterer() and reject_caterer() in 0007 are the
  -- only way in, and both check is_admin() first.
  verification_status   verification_status not null default 'pending',
  rejection_reason      text,
  reviewed_at           timestamptz,
  -- Generated, so it cannot drift from the status and cannot be written at all.
  -- The application reads this as the boolean src/lib/types.ts already expects.
  verified              boolean generated always as (verification_status = 'approved') stored,
  featured              boolean not null default false,
  subscription_tier     subscription_tier not null default 'free',

  -- Derived from reviews and bookings; kept denormalised because browse sorts on
  -- them. 0008 keeps them in step.
  rating                numeric(2,1) not null default 0 check (rating between 0 and 5),
  review_count          integer not null default 0 check (review_count >= 0),
  completed_events      integer not null default 0 check (completed_events >= 0),

  min_guests            integer not null check (min_guests > 0),
  price_from_per_guest  fcfa not null,
  price_to_per_guest    fcfa not null,
  response_time_hours   integer not null check (response_time_hours > 0),
  years_active          integer not null check (years_active >= 0),

  phone                 text not null check (phone ~ '^\+237[0-9]{9}$'),
  -- International format without the plus, for wa.me links.
  whatsapp              text not null check (whatsapp ~ '^237[0-9]{9}$'),

  -- Seeds the placeholder gradient so a caterer's art is stable across renders.
  brand_hue             integer not null check (brand_hue between 0 and 360),
  gallery               text[] not null default '{}',

  created_at            timestamptz not null default now(),

  constraint price_range_is_ordered check (price_to_per_guest >= price_from_per_guest),
  constraint cuisines_not_empty check (array_length(cuisines, 1) >= 1)
);

comment on table caterers is
  'A catering business. verification_status, featured and subscription_tier are admin-controlled and are not writable by the owner.';

comment on column caterers.verified is
  'Generated from verification_status. Read-only everywhere, including for administrators, who move the status instead.';

create index caterers_city_idx     on caterers (city);
create index caterers_cuisines_idx on caterers using gin (cuisines);
create index caterers_browse_idx   on caterers (verified, featured, rating desc);
create index caterers_owner_idx    on caterers (owner_id);

-- Pre-built menu bundles sized to the guest counts people actually book.
create table event_packages (
  id               text primary key,
  caterer_id       text not null references caterers (id) on delete cascade,
  name             localized not null,
  guest_count      integer not null check (guest_count > 0),
  price_per_guest  fcfa not null,
  highlights       jsonb not null default '[]'::jsonb,
  includes_service boolean not null default false,
  created_at       timestamptz not null default now(),

  constraint highlights_is_array check (jsonb_typeof(highlights) = 'array')
);

create index event_packages_caterer_idx on event_packages (caterer_id, guest_count);

create table menu_items (
  id              text primary key,
  caterer_id      text not null references caterers (id) on delete cascade,
  name            text not null,
  description     localized not null,
  cuisine         cuisine not null,
  price_per_guest fcfa not null,
  created_at      timestamptz not null default now()
);

create index menu_items_caterer_idx on menu_items (caterer_id);

-- Dates a caterer cannot take. One row per blocked date keeps "is this date
-- free" a simple index lookup, and lets a caterer release a single date.
create table caterer_blocked_dates (
  caterer_id text not null references caterers (id) on delete cascade,
  date       date not null,
  reason     text,
  created_at timestamptz not null default now(),
  primary key (caterer_id, date)
);

-- Optional extras the platform earns commission on.
create table add_on_services (
  id         text primary key,
  name       localized not null,
  category   add_on_category not null,
  unit       localized not null,
  price_from fcfa not null,
  icon       text not null,
  -- Per-guest extras scale with headcount; cakes and décor do not. The quote
  -- estimate depends on this, so it belongs in the data rather than in a list
  -- of category names inside a React component.
  scales_with_guests boolean not null default false,
  created_at timestamptz not null default now()
);
