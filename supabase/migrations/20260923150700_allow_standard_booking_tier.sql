-- Allow non-tier tours (Trekking and Kyrchyn) to use the standard booking tier.
-- Culture Tour continues to use economy/comfort.

alter table public.bookings
  drop constraint if exists bookings_tier_check;

alter table public.bookings
  add constraint bookings_tier_check
  check (tier in ('economy', 'comfort', 'standard'));
