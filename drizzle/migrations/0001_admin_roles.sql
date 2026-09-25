create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.assign_admin_on_signup()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if lower(new.email) = 'sarinasadirovna@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users
for each row execute function public.assign_admin_on_signup();

insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where lower(email) = 'sarinasadirovna@gmail.com'
on conflict do nothing;

grant select, update on public.bookings to authenticated;
create policy "Admins read bookings" on public.bookings for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update bookings" on public.bookings for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Authenticated can read contact inquiries" on public.contact_messages;
grant select on public.contact_messages to authenticated;
create policy "Admins read contact inquiries" on public.contact_messages for select to authenticated using (public.has_role(auth.uid(), 'admin'));

grant select, insert, update, delete on public.tour_dates to authenticated;
create policy "Admins manage tour dates" on public.tour_dates for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));