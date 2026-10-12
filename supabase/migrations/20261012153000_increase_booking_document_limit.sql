-- Ensure the private bucket exists and supports invoice files up to 50 MB.
-- This also repairs environments where the earlier bucket migration was not applied.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('booking-documents', 'booking-documents', false, 52428800,
  array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = 52428800,
  allowed_mime_types = array['application/pdf','image/jpeg','image/png','image/webp'];
