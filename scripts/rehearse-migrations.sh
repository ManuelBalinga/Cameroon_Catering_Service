#!/usr/bin/env bash
#
# Apply every migration in order to a throwaway local Postgres database.
#
# This is the cheap rehearsal. It proves the SQL is valid, the constraints and
# triggers behave, the policies compile and the grants are accepted, before any
# of it touches a hosted Supabase project. It does NOT prove behaviour under
# PostgREST with Supabase's own roles — that still needs a development project.
#
# Requires a local PostgreSQL 16 and the ability to run psql as the postgres
# user. Never point this at a hosted database: it drops the target first.
set -euo pipefail

DB="${1:-ccs_rehearsal}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PSQL="psql -v ON_ERROR_STOP=1 -q"

run() { su postgres -c "$PSQL $*"; }

echo "==> dropping and recreating $DB"
run "-c 'drop database if exists $DB;'"
run "-c 'create database $DB;'"

echo "==> applying local Supabase stand-ins"
run "-d $DB -f $ROOT/db/local-rehearsal/00_supabase_stubs.sql"

for f in "$ROOT"/supabase/migrations/*.sql; do
  echo "==> $(basename "$f")"
  # -1 wraps each migration in a single transaction, as Supabase does, so a
  # failure leaves nothing half-applied behind it.
  run "-d $DB -1 -f $f"
done

echo "==> permission suite"
su postgres -c "psql -v ON_ERROR_STOP=1 -d $DB -f $ROOT/db/local-rehearsal/10_permission_suite.sql" \
  | tail -4

echo "==> schema summary"
su postgres -c "psql -d $DB -c \"
  select
    (select count(*) from pg_tables where schemaname = 'public') as tables,
    (select count(*) from pg_tables where schemaname = 'public' and rowsecurity) as rls_enabled,
    (select count(*) from pg_policies where schemaname = 'public') as policies,
    (select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public') as functions;
\""

echo "==> all migrations applied cleanly to $DB"
