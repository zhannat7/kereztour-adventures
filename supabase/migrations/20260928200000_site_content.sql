-- Admin-editable website text overrides.
-- Images, layout and code remain outside this table.

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  content_key text not null,
  language text not null check (language in ('DE', 'EN', 'IT')),
  value text not null,
  updated_at timestamptz not null default now(),
  unique (content_key, language)
);

alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content
  for select
  using (true);

drop policy if exists "Admins can insert site content" on public.site_content;
create policy "Admins can insert site content"
  on public.site_content
  for insert
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can update site content" on public.site_content;
create policy "Admins can update site content"
  on public.site_content
  for update
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can delete site content" on public.site_content;
create policy "Admins can delete site content"
  on public.site_content
  for delete
  using (public.has_role(auth.uid(), 'admin'));
