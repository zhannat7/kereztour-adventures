-- Increase private booking document uploads to support larger invoices and scans.
update storage.buckets
set file_size_limit = 52428800
where id = 'booking-documents';
