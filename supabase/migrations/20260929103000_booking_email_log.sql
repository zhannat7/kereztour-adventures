create table if not exists public.booking_email_log (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  sent_by uuid references auth.users(id) on delete set null,
  recipient text not null,
  subject text not null,
  message text not null,
  sent_at timestamptz not null default now()
);

alter table public.booking_email_log enable row level security;

drop policy if exists "Admins can read booking email logs" on public.booking_email_log;
create policy "Admins can read booking email logs"
  on public.booking_email_log for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

grant select on table public.booking_email_log to authenticated;