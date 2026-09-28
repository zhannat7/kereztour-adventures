-- Fix Data API permissions for admin-editable website text.
-- RLS policies control which rows are allowed; explicit table grants are
-- also required so the browser can access the tables through Supabase.

grant select on table public.site_content to anon, authenticated;
grant insert, update, delete on table public.site_content to authenticated;

grant select, insert on table public.site_content_versions to authenticated;
