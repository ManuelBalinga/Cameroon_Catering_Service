-- 0001 — Enumerations and shared domains
--
-- These mirror the union types in src/lib/types.ts one for one. Keeping them as
-- Postgres enums rather than free text means a typo in application code is a
-- database error rather than a row nobody ever finds again.

create type user_role as enum ('customer', 'caterer', 'admin');

create type event_type as enum (
  'wedding', 'birthday', 'funeral', 'office',
  'church', 'school', 'private_dinner', 'bulk_order'
);

create type cuisine as enum (
  'cameroonian', 'continental', 'grill', 'pastry',
  'nigerian', 'asian', 'vegetarian', 'seafood'
);

create type payment_method as enum (
  'mtn_momo', 'orange_money', 'bank_transfer', 'cash'
);

create type booking_status as enum (
  'quote_requested', 'quoted', 'deposit_pending',
  'confirmed', 'completed', 'cancelled', 'disputed'
);

create type subscription_tier as enum ('free', 'premium');

-- Approving and rejecting a caterer application are different outcomes, and a
-- business nobody has looked at yet is a third. A boolean cannot hold three
-- states, and "rejected" silently looking like "not yet reviewed" is how an
-- application gets reviewed twice.
create type verification_status as enum ('pending', 'approved', 'rejected');

create type payment_status as enum (
  'pending', 'succeeded', 'failed', 'cancelled', 'refunded'
);

create type add_on_category as enum (
  'cake', 'drinks', 'waitstaff', 'chairs', 'tables', 'decoration', 'rentals'
);

-- Cameroon is officially bilingual, so a string the customer can read has to
-- exist in both languages. This domain makes that a constraint rather than a
-- convention: a row with only English in it cannot be inserted.
create domain localized as jsonb
  check (
    value ? 'en' and value ? 'fr'
    and jsonb_typeof(value -> 'en') = 'string'
    and jsonb_typeof(value -> 'fr') = 'string'
    and length(value ->> 'en') > 0
    and length(value ->> 'fr') > 0
  );

-- Amounts are whole FCFA. There are no centimes in everyday Cameroonian
-- pricing, and floating-point money is a bug waiting to be written.
create domain fcfa as integer check (value >= 0);
