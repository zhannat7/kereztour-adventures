
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  persons INTEGER NOT NULL,
  travel_date DATE NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('economy', 'comfort')),
  notes TEXT,
  total_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert bookings"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "No one can read bookings from client"
  ON public.bookings
  FOR SELECT
  TO anon, authenticated
  USING (false);
