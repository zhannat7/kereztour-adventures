-- Allow flexible per-departure capacities from 1 to 25.
-- Drop the legacy 12–15 constraint and any older capacity checks that may
-- still exist in a deployed database. Existing capacity values are preserved.
ALTER TABLE public.tour_dates
  DROP CONSTRAINT IF EXISTS tour_dates_max_participants_check,
  DROP CONSTRAINT IF EXISTS tour_dates_economy_max_check,
  DROP CONSTRAINT IF EXISTS tour_dates_comfort_max_check;

ALTER TABLE public.tour_dates
  ADD CONSTRAINT tour_dates_max_participants_check
    CHECK (max_participants BETWEEN 1 AND 25),
  ADD CONSTRAINT tour_dates_economy_max_check
    CHECK (economy_max_participants BETWEEN 1 AND 25),
  ADD CONSTRAINT tour_dates_comfort_max_check
    CHECK (comfort_max_participants BETWEEN 1 AND 25);

NOTIFY pgrst, 'reload schema';
