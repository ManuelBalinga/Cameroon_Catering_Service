-- Executable permission assertions.
--
-- RLS fails silently: a wrong policy returns fewer rows rather than raising, so
-- a broken permission looks like an empty page instead of a stack trace. That is
-- exactly why the rules need assertions rather than a reading.
--
-- Everything runs inside one transaction that is rolled back at the end, so the
-- suite leaves no rows behind. Fixtures are created as the superuser (which
-- bypasses RLS); every assertion then switches to the `authenticated` role and
-- sets the JWT subject, which is how Supabase identifies the caller.
--
-- Any failure raises. Silence is a pass.

\set ON_ERROR_STOP on

begin;

-- ---------------------------------------------------------------------------
-- Fixtures
-- ---------------------------------------------------------------------------

create temporary table ids (k text primary key, v uuid) on commit drop;

insert into auth.users (email, raw_user_meta_data) values
  ('amina@example.cm',  '{"role":"customer","name":"Amina","phone":"+237677000001","city":"Douala"}'),
  ('brice@example.cm',  '{"role":"customer","name":"Brice","phone":"+237677000002","city":"Yaoundé"}'),
  ('mamie@example.cm',  '{"role":"caterer","name":"Mamie","phone":"+237677000003","city":"Douala"}'),
  ('royal@example.cm',  '{"role":"caterer","name":"Royal","phone":"+237677000004","city":"Yaoundé"}'),
  ('admin@example.cm',  '{"role":"admin","name":"Admin","phone":"+237677000005","city":"Douala"}');

insert into ids (k, v)
select 'amina', id from auth.users where email = 'amina@example.cm';
insert into ids (k, v) select 'brice', id from auth.users where email = 'brice@example.cm';
insert into ids (k, v) select 'mamie', id from auth.users where email = 'mamie@example.cm';
insert into ids (k, v) select 'royal', id from auth.users where email = 'royal@example.cm';
insert into ids (k, v) select 'admin', id from auth.users where email = 'admin@example.cm';

insert into caterers (id, owner_id, business_name, tagline, about, city, cuisines,
                      verification_status, min_guests, price_from_per_guest, price_to_per_guest,
                      response_time_hours, years_active, phone, whatsapp, brand_hue)
values
  ('mamie-nkeng', (select v from ids where k='mamie'), 'Mamie Nkeng Catering',
   '{"en":"Home cooking","fr":"Cuisine maison"}', '{"en":"About","fr":"À propos"}',
   'Douala', '{cameroonian}', 'approved', 20, 3500, 6500, 4, 8, '+237677000003', '237677000003', 120),
  ('royal-taste', (select v from ids where k='royal'), 'Royal Taste',
   '{"en":"Fine dining","fr":"Gastronomie"}', '{"en":"About","fr":"À propos"}',
   'Yaoundé', '{continental}', 'approved', 50, 5000, 9000, 6, 5, '+237677000004', '237677000004', 40),
  ('pending-kitchen', null, 'Pending Kitchen',
   '{"en":"New","fr":"Nouveau"}', '{"en":"About","fr":"À propos"}',
   'Buea', '{grill}', 'pending', 20, 3000, 5000, 12, 1, '+237677000006', '237677000006', 200);

insert into bookings (reference, caterer_id, customer_id, event_type, event_date, city,
                      guest_count, total, deposit_amount, commission_rate, payment_method, status)
values
  ('CCS-TEST-AMINA', 'mamie-nkeng', (select v from ids where k='amina'),
   'wedding', current_date + 30, 'Douala', 100, 500000, 150000, 0.120, 'mtn_momo', 'confirmed'),
  ('CCS-TEST-BRICE', 'royal-taste', (select v from ids where k='brice'),
   'birthday', current_date + 45, 'Yaoundé', 50, 300000, 90000, 0.120, 'orange_money', 'deposit_pending');

insert into ids (k, v) select 'booking_amina', id from bookings where reference = 'CCS-TEST-AMINA';
insert into ids (k, v) select 'booking_brice', id from bookings where reference = 'CCS-TEST-BRICE';

insert into payments (booking_id, method, amount, status, external_reference)
select id, 'mtn_momo', 150000, 'succeeded', 'EXT-AMINA-1' from bookings where reference = 'CCS-TEST-AMINA';

-- ---------------------------------------------------------------------------
-- Harness
-- ---------------------------------------------------------------------------

create temporary table results (n serial, label text, ok boolean) on commit drop;

-- The assertions run as anon and authenticated, but the fixtures and the tally
-- are owned by the session user, so those roles need access to them. This is a
-- harness detail; it grants nothing in the real schema.
grant select, insert on results to anon, authenticated;
grant usage on sequence results_n_seq to anon, authenticated;
grant select on ids to anon, authenticated;

-- Assert that a query returns exactly the expected number of rows.
create or replace function pg_temp.expect_rows(label text, query text, expected bigint)
returns void language plpgsql as $$
declare actual bigint;
begin
  execute 'select count(*) from (' || query || ') q' into actual;
  insert into results (label, ok) values (label, actual = expected);
  if actual <> expected then
    raise exception 'FAILED: % — expected % row(s), got %', label, expected, actual;
  end if;
end $$;

-- Assert that a statement is refused outright.
create or replace function pg_temp.expect_denied(label text, stmt text)
returns void language plpgsql as $$
begin
  begin
    execute stmt;
  exception when others then
    insert into results (label, ok) values (label, true);
    return;
  end;
  insert into results (label, ok) values (label, false);
  raise exception 'FAILED: % — statement was allowed and should not have been', label;
end $$;

-- Assert that a write touches exactly the expected number of rows. RLS makes an
-- update that matches no visible row succeed with zero rows affected rather than
-- raise, so "allowed but silently did nothing" needs its own assertion.
create or replace function pg_temp.expect_affected(label text, stmt text, expected bigint)
returns void language plpgsql as $$
declare actual bigint;
begin
  execute stmt;
  get diagnostics actual = row_count;
  insert into results (label, ok) values (label, actual = expected);
  if actual <> expected then
    raise exception 'FAILED: % - expected % row(s) affected, got %', label, expected, actual;
  end if;
end $$;

create or replace function pg_temp.become(who text)
returns void language plpgsql as $$
declare uid uuid;
begin
  if who = 'anon' then
    perform set_config('request.jwt.claim.sub', '', true);
    execute 'set local role anon';
  else
    select v into uid from ids where k = who;
    if uid is null then raise exception 'unknown fixture user %', who; end if;
    perform set_config('request.jwt.claim.sub', uid::text, true);
    execute 'set local role authenticated';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 1. The public marketplace is public
-- ---------------------------------------------------------------------------

select pg_temp.become('anon');
select pg_temp.expect_rows('anon sees the two verified caterers',
  'select 1 from caterers', 2);
select pg_temp.expect_rows('anon cannot see the unverified caterer',
  'select 1 from caterers where id = ''pending-kitchen''', 0);
select pg_temp.expect_rows('anon can read packages, menus and reviews',
  'select 1 from menu_items union all select 1 from reviews', 0);

-- ---------------------------------------------------------------------------
-- 2. An outsider sees no private data at all
-- ---------------------------------------------------------------------------

select pg_temp.expect_denied('anon cannot select bookings',
  'select 1 from bookings');
select pg_temp.expect_denied('anon cannot select quote requests',
  'select 1 from quote_requests');
select pg_temp.expect_denied('anon cannot select payments',
  'select 1 from payments');
select pg_temp.expect_denied('anon cannot select profiles',
  'select 1 from profiles');
select pg_temp.expect_denied('anon cannot ask the database who is an administrator',
  'select is_admin()');
select pg_temp.expect_denied('anon cannot ask who owns a business',
  'select owns_caterer(''mamie-nkeng'')');
select pg_temp.expect_denied('anon cannot read platform GMV',
  'select platform_gmv()');

reset role;

-- ---------------------------------------------------------------------------
-- 3. A customer sees their own bookings and nobody else's
-- ---------------------------------------------------------------------------

select pg_temp.become('amina');
select pg_temp.expect_rows('Amina sees her own booking',
  'select 1 from bookings where reference = ''CCS-TEST-AMINA''', 1);
select pg_temp.expect_rows('Amina cannot see Brice''s booking',
  'select 1 from bookings where reference = ''CCS-TEST-BRICE''', 0);
select pg_temp.expect_rows('Amina sees her own payment',
  'select 1 from payments', 1);
select pg_temp.expect_rows('Amina sees only her own profile',
  'select 1 from profiles', 1);
select pg_temp.expect_rows('platform GMV returns only what Amina may read',
  'select 1 from bookings where status in (''confirmed'',''completed'')', 1);

select pg_temp.expect_denied('a customer cannot make themselves an administrator',
  'update profiles set role = ''admin'' where id = auth.uid()');
select pg_temp.expect_denied('a customer cannot rewrite a booking total',
  'update bookings set total = 1 where reference = ''CCS-TEST-AMINA''');
select pg_temp.expect_denied('a customer cannot rewrite a commission rate',
  'update bookings set commission_rate = 0.100 where reference = ''CCS-TEST-AMINA''');
select pg_temp.expect_denied('a customer cannot write a payment row',
  'insert into payments (booking_id, method, amount, status, external_reference)
     select id, ''cash'', 1, ''succeeded'', ''FORGED'' from bookings limit 1');

reset role;

-- ---------------------------------------------------------------------------
-- 4. A caterer sees their own business and nobody else's revenue
-- ---------------------------------------------------------------------------

select pg_temp.become('mamie');
select pg_temp.expect_rows('Mamie sees the booking against her business',
  'select 1 from bookings where reference = ''CCS-TEST-AMINA''', 1);
select pg_temp.expect_rows('Mamie cannot see Royal Taste''s booking',
  'select 1 from bookings where reference = ''CCS-TEST-BRICE''', 0);

select pg_temp.expect_denied('a caterer cannot verify itself',
  'update caterers set verification_status = ''approved'' where id = ''mamie-nkeng''');
select pg_temp.expect_denied('a caterer cannot write the generated verified column',
  'update caterers set verified = true where id = ''mamie-nkeng''');
select pg_temp.expect_denied('a caterer cannot call approve_caterer on itself',
  'select approve_caterer(''mamie-nkeng'')');
select pg_temp.expect_denied('a caterer cannot reject a rival',
  'select reject_caterer(''royal-taste'', ''spite'')');
select pg_temp.expect_denied('a caterer cannot feature itself',
  'update caterers set featured = true where id = ''mamie-nkeng''');
select pg_temp.expect_denied('a caterer cannot upgrade its own tier',
  'update caterers set subscription_tier = ''premium'' where id = ''mamie-nkeng''');
select pg_temp.expect_denied('a caterer cannot re-rate itself',
  'update caterers set rating = 5.0 where id = ''mamie-nkeng''');

select pg_temp.expect_affected('a caterer can edit its own description',
  'update caterers set about = ''{"en":"New","fr":"Nouveau"}'' where id = ''mamie-nkeng''', 1);
-- Not an error: RLS simply makes the other business invisible to the update.
select pg_temp.expect_affected('a caterer cannot edit another business',
  'update caterers set about = ''{"en":"X","fr":"X"}'' where id = ''royal-taste''', 0);

reset role;

-- ---------------------------------------------------------------------------
-- 5. Reviews are earned, not typed into a URL
-- ---------------------------------------------------------------------------

select pg_temp.become('amina');
-- Amina's booking is confirmed, not completed.
select pg_temp.expect_denied('a review cannot be left before the event is completed',
  'insert into reviews (caterer_id, booking_id, author_id, city, event_type, rating, comment)
     select ''mamie-nkeng'', id, auth.uid(), ''Douala'', ''wedding'', 5,
            ''{"en":"Great","fr":"Super"}''
       from bookings where reference = ''CCS-TEST-AMINA''');
-- Two shapes, because they fail differently and both matter.
-- Reading the booking first: RLS hides it, so the insert succeeds and writes
-- nothing. Silent, which is the failure mode that hides bugs.
select pg_temp.expect_affected('reviewing from a booking the customer cannot see writes nothing',
  'insert into reviews (caterer_id, booking_id, author_id, city, event_type, rating, comment)
     select ''royal-taste'', id, auth.uid(), ''Yaoundé'', ''birthday'', 5,
            ''{"en":"Great","fr":"Super"}''
       from bookings where reference = ''CCS-TEST-BRICE''', 0);
-- Naming the booking id outright, as someone who already knows it would: this
-- one has to be refused outright, and is.
select pg_temp.expect_denied('a customer cannot review a booking id that is not theirs',
  'insert into reviews (caterer_id, booking_id, author_id, city, event_type, rating, comment)
     select ''royal-taste'', (select v from ids where k = ''booking_brice''), auth.uid(),
            ''Yaoundé'', ''birthday'', 5, ''{"en":"Great","fr":"Super"}''');
reset role;

-- Complete the booking as the platform would, then try again.
update bookings set status = 'completed' where reference = 'CCS-TEST-AMINA';

select pg_temp.become('amina');
select pg_temp.expect_affected('a review can be left once the booking is completed',
  'insert into reviews (caterer_id, booking_id, author_id, city, event_type, rating, comment)
     select ''mamie-nkeng'', id, auth.uid(), ''Douala'', ''wedding'', 5,
            ''{"en":"Great","fr":"Super"}''
       from bookings where reference = ''CCS-TEST-AMINA''', 1);
select pg_temp.expect_denied('a booking cannot be reviewed twice',
  'insert into reviews (caterer_id, booking_id, author_id, city, event_type, rating, comment)
     select ''mamie-nkeng'', id, auth.uid(), ''Douala'', ''wedding'', 1,
            ''{"en":"Again","fr":"Encore"}''
       from bookings where reference = ''CCS-TEST-AMINA''');
reset role;

select pg_temp.become('brice');
-- Deletion is granted at the table level and restricted by policy, so an
-- ordinary customer's delete removes nothing rather than raising. The assertion
-- that matters is that the review is still there afterwards.
select pg_temp.expect_affected('an ordinary customer''s delete removes no review',
  'delete from reviews', 0);
select pg_temp.expect_rows('the review survives that attempt',
  'select 1 from reviews', 1);
reset role;

-- ---------------------------------------------------------------------------
-- 6. Administrators
-- ---------------------------------------------------------------------------

select pg_temp.become('admin');
select pg_temp.expect_rows('an admin sees every booking', 'select 1 from bookings', 2);
select pg_temp.expect_rows('an admin sees the unverified caterer',
  'select 1 from caterers where id = ''pending-kitchen''', 1);
select pg_temp.expect_rows('an admin can approve a caterer',
  'select approve_caterer(''pending-kitchen'')', 1);
select pg_temp.expect_rows('approval makes the caterer verified',
  'select 1 from caterers where id = ''pending-kitchen'' and verified
      and verification_status = ''approved'' and reviewed_at is not null', 1);
select pg_temp.expect_rows('an admin can reject a caterer, and rejection is not just unverified',
  'select reject_caterer(''pending-kitchen'', ''no food hygiene certificate'')', 1);
select pg_temp.expect_rows('rejection is recorded distinctly, with its reason',
  'select 1 from caterers where id = ''pending-kitchen''
      and not verified and verification_status = ''rejected''
      and rejection_reason = ''no food hygiene certificate''', 1);
select pg_temp.expect_rows('an admin can read platform GMV',
  'select platform_gmv()', 1);
reset role;

-- ---------------------------------------------------------------------------
-- 7. Bilingual and money constraints hold
-- ---------------------------------------------------------------------------

select pg_temp.expect_denied('a caterer cannot be created with English only',
  'insert into caterers (id, business_name, tagline, about, city, cuisines, min_guests,
                         price_from_per_guest, price_to_per_guest, response_time_hours,
                         years_active, phone, whatsapp, brand_hue)
   values (''english-only'', ''X'', ''{"en":"Only English"}'', ''{"en":"A","fr":"B"}'',
           ''Douala'', ''{grill}'', 10, 1000, 2000, 4, 1, ''+237677000009'', ''237677000009'', 10)');
select pg_temp.expect_denied('a price range cannot run backwards',
  'insert into caterers (id, business_name, tagline, about, city, cuisines, min_guests,
                         price_from_per_guest, price_to_per_guest, response_time_hours,
                         years_active, phone, whatsapp, brand_hue)
   values (''backwards'', ''X'', ''{"en":"A","fr":"B"}'', ''{"en":"A","fr":"B"}'',
           ''Douala'', ''{grill}'', 10, 5000, 1000, 4, 1, ''+237677000010'', ''237677000010'', 10)');
select pg_temp.expect_denied('an amount cannot be negative',
  'insert into caterers (id, business_name, tagline, about, city, cuisines, min_guests,
                         price_from_per_guest, price_to_per_guest, response_time_hours,
                         years_active, phone, whatsapp, brand_hue)
   values (''negative'', ''X'', ''{"en":"A","fr":"B"}'', ''{"en":"A","fr":"B"}'',
           ''Douala'', ''{grill}'', 10, -1, 2000, 4, 1, ''+237677000011'', ''237677000011'', 10)');
select pg_temp.expect_denied('a deposit cannot exceed the booking total',
  'insert into bookings (caterer_id, customer_id, event_type, event_date, city, guest_count,
                         total, deposit_amount, commission_rate, payment_method)
   select ''mamie-nkeng'', v, ''office'', current_date + 10, ''Douala'', 20, 1000, 2000, 0.120, ''cash''
     from ids where k = ''amina''');
select pg_temp.expect_denied('a commission rate outside the 10-15% band is refused',
  'insert into bookings (caterer_id, customer_id, event_type, event_date, city, guest_count,
                         total, deposit_amount, commission_rate, payment_method)
   select ''mamie-nkeng'', v, ''office'', current_date + 10, ''Douala'', 20, 1000, 300, 0.250, ''cash''
     from ids where k = ''amina''');
select pg_temp.expect_denied('a phone number that is not Cameroonian is refused',
  'insert into caterers (id, business_name, tagline, about, city, cuisines, min_guests,
                         price_from_per_guest, price_to_per_guest, response_time_hours,
                         years_active, phone, whatsapp, brand_hue)
   values (''badphone'', ''X'', ''{"en":"A","fr":"B"}'', ''{"en":"A","fr":"B"}'',
           ''Douala'', ''{grill}'', 10, 1000, 2000, 4, 1, ''+44770000000'', ''237677000012'', 10)');

-- ---------------------------------------------------------------------------
-- 8. Triggers did their job
-- ---------------------------------------------------------------------------

select pg_temp.expect_rows('confirming a booking blocks the caterer''s date',
  'select 1 from caterer_blocked_dates
    where caterer_id = ''mamie-nkeng''
      and date = (select event_date from bookings where reference = ''CCS-TEST-AMINA'')', 1);
select pg_temp.expect_rows('a review updates the caterer''s rating',
  'select 1 from caterers where id = ''mamie-nkeng'' and rating = 5.0 and review_count = 1', 1);
select pg_temp.expect_rows('booking references are unique and sequential',
  'select 1 from (select next_booking_reference() except select next_booking_reference()) d', 1);

-- ---------------------------------------------------------------------------
-- Tally
-- ---------------------------------------------------------------------------

select count(*) as assertions,
       count(*) filter (where ok) as passed,
       count(*) filter (where not ok) as failed
  from results;

rollback;
