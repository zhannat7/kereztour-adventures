-- Private invoice and receipt attachments for booking profiles.
create table if not exists public.booking_documents (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  file_name text not null,
  storage_path text not null unique,
  mime_type text,
  file_size bigint,
  document_type text not null default 'invoice',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists booking_documents_booking_created_idx
  on public.booking_documents (booking_id, created_at desc);

alter table public.booking_documents enable row level security;
revoke all on table public.booking_documents from anon, authenticated;
grant select, insert, delete on table public.booking_documents to authenticated;

drop policy if exists "Admins can read booking documents" on public.booking_documents;
create policy "Admins can read booking documents"
  on public.booking_documents for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can add booking documents" on public.booking_documents;
create policy "Admins can add booking documents"
  on public.booking_documents for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can delete booking documents" on public.booking_documents;
create policy "Admins can delete booking documents"
  on public.booking_documents for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('booking-documents', 'booking-documents', false, 15728640,
  array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = 15728640,
  allowed_mime_types = array['application/pdf','image/jpeg','image/png','image/webp'];

drop policy if exists "Admins can read booking document files" on storage.objects;
create policy "Admins can read booking document files"
  on storage.objects for select to authenticated
  using (bucket_id = 'booking-documents' and public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can upload booking document files" on storage.objects;
create policy "Admins can upload booking document files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'booking-documents' and public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can delete booking document files" on storage.objects;
create policy "Admins can delete booking document files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'booking-documents' and public.has_role(auth.uid(), 'admin'));
