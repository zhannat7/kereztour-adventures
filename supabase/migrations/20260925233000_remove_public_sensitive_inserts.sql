-- Public forms now use server-side Edge Functions.
-- Remove direct Data API INSERT access to sensitive customer tables.

revoke insert on table public.bookings from anon, authenticated;
revoke insert on table public.contact_messages from anon, authenticated;
