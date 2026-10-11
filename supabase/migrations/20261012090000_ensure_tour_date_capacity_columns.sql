-- Ensure Kultur Tour capacity columns exist in the deployed database.
-- Safe to run more than once; existing capacity values are preserved.
ALTER TABLE public.tour_dates
  ADD COLUMN IF NOT EXISTS economy_max_participants integer,
  ADD COLUMN IF NOT EXISTS comfort_max_participants integer;

UPDATE public.tour_dates
SET
  economy_max_participants = COALESCE(economy_max_participants, max_participants, 12),
  comfort_max_participants = COALESCE(comfort_max_participants, max_participants, 4);

ALTER TABLE public.tour_dates
  ALTER COLUMN economy_max_participants SET DEFAULT 12,
  ALTER COLUMN comfort_max_participants SET DEFAULT 4,
  ALTER COLUMN economy_max_participants SET NOT NULL,
  ALTER COLUMN comfort_max_participants SET NOT NULL;

ALTER TABLE public.tour_dates
  DROP CONSTRAINT IF EXISTS tour_dates_economy_max_check,
  DROP CONSTRAINT IF EXISTS tour_dates_comfort_max_check;

ALTER TABLE public.tour_dates
  ADD CONSTRAINT tour_dates_economy_max_check CHECK (economy_max_participants >= 1),
  ADD CONSTRAINT tour_dates_comfort_max_check CHECK (comfort_max_participants >= 1);

-- Refresh PostgREST's schema cache so the Admin form can use the new columns.
NOTIFY pgrst, 'reload schema';
