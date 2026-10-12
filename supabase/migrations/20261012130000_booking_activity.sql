-- Kereztour CRM: audit trail for important booking changes.
create table if not exists public.booking_activity (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  activity_type text not null,
  description text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists booking_activity_booking_created_idx
  on public.booking_activity (booking_id, created_at desc);

alter table public.booking_activity enable row level security;
revoke all on table public.booking_activity from anon, authenticated;
grant select, insert on table public.booking_activity to authenticated;

drop policy if exists "Admins can read booking activity" on public.booking_activity;
create policy "Admins can read booking activity"
  on public.booking_activity for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can add booking activity" on public.booking_activity;
create policy "Admins can add booking activity"
  on public.booking_activity for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
