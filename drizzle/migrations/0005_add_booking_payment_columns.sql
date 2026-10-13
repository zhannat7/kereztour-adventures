-- Add payment tracking fields required by the create-booking Edge Function.
-- IF NOT EXISTS keeps this migration safe if a column was already added manually.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS deposit_amount numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS remaining_amount numeric(10,2) NOT NULL DEFAULT 0;

-- Ask PostgREST to refresh its schema cache after the table definition changes.
NOTIFY pgrst, 'reload schema';