-- 0002 — Profiles
--
-- Supabase Auth owns credentials in auth.users. Everything the marketplace needs
-- to know about a person lives here, keyed by the same id.

create table profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        user_role   not null default 'customer',
  name        text        not null check (length(trim(name)) > 0),
  -- Cameroonian mobile numbers, stored in international form: +237 6XX XXX XXX.
  phone       text        not null check (phone ~ '^\+237[0-9]{9}$'),
  email       text,
  city        text        not null,
  created_at  timestamptz not null default now()
);

comment on table profiles is
  'Marketplace identity for an authenticated user. Role decides which dashboard they land on; it is never writable by the user it describes.';

create index profiles_role_idx on profiles (role);

-- Created on sign-up so that a signed-in user always has a profile row. The
-- role and city come from the sign-up form via user metadata; anything the user
-- did not supply falls back to a safe default rather than failing the trigger
-- and blocking registration.
create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, role, name, phone, email, city)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'customer'),
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1)),
    coalesce(nullif(new.raw_user_meta_data ->> 'phone', ''), '+237600000000'),
    new.email,
    coalesce(nullif(new.raw_user_meta_data ->> 'city', ''), 'Douala')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- An admin check used by policies across the schema. SECURITY DEFINER because a
-- policy on profiles cannot read profiles without recursing; the search_path is
-- pinned and EXECUTE is revoked from anon in 0007, because an unauthenticated
-- caller has no business asking the database who is an administrator.
create function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
$$;
