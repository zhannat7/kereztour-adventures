-- Store the selected tour on every booking request.
-- Older schema versions only stored the tier and date.
alter table public.bookings
  add column if not exists tour text;

alter table public.bookings
  drop constraint if exists bookings_tour_check;

alter table public.bookings
  add constraint bookings_tour_check
  check (
    tour is null
    or tour in ('Kultur Tour', 'Intensiv-Trekking', 'Kyrchyn Tour')
  );
