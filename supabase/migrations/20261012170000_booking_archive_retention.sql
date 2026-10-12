-- Soft archive bookings for 30 days before permanent cleanup.
alter table public.bookings
  add column if not exists archived_at timestamptz,
  add column if not exists purge_after timestamptz;

create index if not exists bookings_archived_purge_after_idx
  on public.bookings (purge_after)
  where archived_at is not null;

notify pgrst, 'reload schema';
