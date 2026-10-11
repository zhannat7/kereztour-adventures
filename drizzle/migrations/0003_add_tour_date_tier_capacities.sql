ALTER TABLE public.tour_dates
  ADD COLUMN economy_max_participants integer NOT NULL DEFAULT 12,
  ADD COLUMN comfort_max_participants integer NOT NULL DEFAULT 4;

UPDATE public.tour_dates
SET economy_max_participants = 12, comfort_max_participants = 4
WHERE tour = 'Kultur Tour';