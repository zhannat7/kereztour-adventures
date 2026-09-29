-- Kereztour: make the booking storage schema match the public booking Edge Function.
-- Idempotent so it can safely be applied to projects created before the latest booking changes.

alter table public.bookings
  add column if not exists tour text,
  add column if not exists tier text,
  add column if not exists notes text,
  add column if not exists total_price numeric,
  add column if not exists status text;

update public.bookings
set status = 'pending'
where status is null;

alter table public.bookings
  alter column status set default 'pending';

alter table public.bookings
  drop constraint if exists bookings_status_check;

alter table public.bookings
  add constraint bookings_status_check
  check (status in ('pending', 'confirmed', 'cancelled'));

alter table public.bookings
  drop constraint if exists bookings_tier_check;

alter table public.bookings
  add constraint bookings_tier_check
  check (tier is null or tier in ('economy', 'comfort', 'standard'));

alter table public.bookings
  drop constraint if exists bookings_tour_check;

alter table public.bookings
  add constraint bookings_tour_check
  check (
    tour is null
    or tour in ('Kultur Tour', 'Intensiv-Trekking', 'Kyrchyn Tour')
  );

create index if not exists bookings_tour_travel_date_idx
  on public.bookings (tour, travel_date);
