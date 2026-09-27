-- Allow the admin to choose the capacity for each tour date.
-- Keep only a basic safety rule: capacity must be at least 1.

alter table public.tour_dates
  drop constraint if exists tour_dates_max_participants_check;

alter table public.tour_dates
  add constraint tour_dates_max_participants_check
  check (max_participants >= 1);
