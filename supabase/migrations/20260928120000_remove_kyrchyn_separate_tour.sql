-- Kyrchyn Jailoo is part of the Culture Tour, not a separate bookable tour.
-- Migrate any existing Kyrchyn tour dates/bookings to the Culture Tour.
update public.tour_dates
set tour = 'Kultur Tour'
where tour = 'Kyrchyn Tour';

update public.bookings
set tour = 'Kultur Tour'
where tour = 'Kyrchyn Tour';

-- Keep the booking table aligned with the two real bookable tours.
alter table public.bookings
  drop constraint if exists bookings_tour_check;

alter table public.bookings
  add constraint bookings_tour_check
  check (tour is null or tour in ('Kultur Tour', 'Intensiv-Trekking'));
