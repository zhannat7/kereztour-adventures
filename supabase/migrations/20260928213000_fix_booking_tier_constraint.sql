-- Keep the booking tier constraint compatible with both Kultur packages
-- and the tier-less Intensiv-Trekking booking flow.
alter table public.bookings
  drop constraint if exists bookings_tier_check;

alter table public.bookings
  add constraint bookings_tier_check
  check (tier in ('economy', 'comfort', 'standard'));
