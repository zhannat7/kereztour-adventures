alter table public.bookings drop constraint if exists bookings_tier_check;
alter table public.bookings add constraint bookings_tier_check check (tier in ('economy', 'comfort', 'standard'));

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles ur
    join auth.users au on au.id = ur.user_id
    where ur.user_id = _user_id and ur.role = _role
      and lower(coalesce(au.email, '')) = lower('sarinasadirovna@gmail.com')
  );
$$;
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

alter table public.bookings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.user_roles enable row level security;
alter table public.tour_dates enable row level security;

do $$
declare p record;
begin
  for p in select schemaname, tablename, policyname from pg_policies
    where schemaname = 'public' and tablename in ('bookings','contact_messages','user_roles','tour_dates')
  loop
    execute format('drop policy if exists %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end $$;

revoke all on table public.bookings from anon, authenticated;
revoke all on table public.contact_messages from anon, authenticated;
revoke all on table public.user_roles from anon, authenticated;
revoke all on table public.tour_dates from anon, authenticated;

grant select, update, delete on table public.bookings to authenticated;
grant all on table public.bookings to service_role;
create policy "Admin can read bookings" on public.bookings for select to authenticated
  using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
create policy "Admin can update bookings" on public.bookings for update to authenticated
  using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)))
  with check ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
create policy "Admin can delete bookings" on public.bookings for delete to authenticated
  using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));

grant select, update, delete on table public.contact_messages to authenticated;
grant all on table public.contact_messages to service_role;
create policy "Admin can read contact messages" on public.contact_messages for select to authenticated
  using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
create policy "Admin can update contact messages" on public.contact_messages for update to authenticated
  using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)))
  with check ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
create policy "Admin can delete contact messages" on public.contact_messages for delete to authenticated
  using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));

grant all on table public.user_roles to service_role;

grant select on table public.tour_dates to anon, authenticated;
grant insert, update, delete on table public.tour_dates to authenticated;
grant all on table public.tour_dates to service_role;
create policy "Public can read active tour dates" on public.tour_dates for select to anon, authenticated
  using (status <> 'cancelled');
create policy "Admin can create tour dates" on public.tour_dates for insert to authenticated
  with check ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
create policy "Admin can update tour dates" on public.tour_dates for update to authenticated
  using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)))
  with check ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
create policy "Admin can delete tour dates" on public.tour_dates for delete to authenticated
  using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));

grant execute on function public.get_tour_date_availability() to anon, authenticated;