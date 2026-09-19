-- Local rehearsal stubs — NOT a migration, never applied to Supabase.
--
-- Supabase supplies an `auth` schema, the `auth.uid()` helper and the anon /
-- authenticated / service_role database roles. Plain Postgres does not. These
-- stubs create just enough of them that every file in supabase/migrations/
-- applies unchanged against a local Postgres 16, which is how the schema gets
-- rehearsed somewhere cheap before it touches a hosted project.
--
-- What this proves: the SQL is valid, the constraints hold, the policies
-- compile and the grants are accepted. What it does NOT prove: that the
-- policies behave the same under PostgREST with Supabase's own role grants.
-- That still needs a hosted development project.

create schema if not exists auth;

-- Only the columns the migrations actually touch. raw_user_meta_data is where
-- Supabase puts whatever the sign-up form passed as user metadata, and the
-- profile trigger reads it, so the rehearsal needs it to exercise that path.
create table if not exists auth.users (
  id                 uuid primary key default gen_random_uuid(),
  email              text unique,
  raw_user_meta_data jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now()
);

-- Supabase reads the signed-in user from the request JWT. Locally we read it
-- from a session setting, so a rehearsal can "become" a user with
-- `set local request.jwt.claim.sub = '<uuid>'`.
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;

create or replace function auth.role()
returns text
language sql
stable
as $$
  select coalesce(nullif(current_setting('request.jwt.claim.role', true), ''), 'anon')
$$;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin bypassrls;
  end if;
end
$$;

-- Supabase grants these to both API roles; the stubs must too, or a query that
-- calls auth.uid() directly is refused for a reason that would not happen in
-- production.
grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
grant execute on function auth.role() to anon, authenticated;
grant select on auth.users to authenticated;
