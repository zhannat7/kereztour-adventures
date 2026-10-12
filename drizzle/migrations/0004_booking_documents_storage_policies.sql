create policy "Admin can read booking documents"
on storage.objects for select to authenticated
using (bucket_id = 'booking-documents' and public.has_role(auth.uid(), 'admin'));

create policy "Admin can upload booking documents"
on storage.objects for insert to authenticated
with check (bucket_id = 'booking-documents' and public.has_role(auth.uid(), 'admin'));

create policy "Admin can update booking documents"
on storage.objects for update to authenticated
using (bucket_id = 'booking-documents' and public.has_role(auth.uid(), 'admin'));

create policy "Admin can delete booking documents"
on storage.objects for delete to authenticated
using (bucket_id = 'booking-documents' and public.has_role(auth.uid(), 'admin'));