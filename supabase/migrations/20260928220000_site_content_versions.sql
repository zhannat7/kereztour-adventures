-- Version history for admin-editable website text.

create table if not exists public.site_content_versions (
  id uuid primary key default gen_random_uuid(),
  content_key text not null,
  language text not null check (language in ('DE', 'EN', 'IT')),
  previous_value text not null,
  new_value text not null,
  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now()
);

alter table public.site_content_versions enable row level security;

drop policy if exists "Admins can read site content versions" on public.site_content_versions;
create policy "Admins can read site content versions"
  on public.site_content_versions for select
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can insert site content versions" on public.site_content_versions;
create policy "Admins can insert site content versions"
  on public.site_content_versions for insert
  with check (public.has_role(auth.uid(), 'admin'));

create index if not exists site_content_versions_lookup_idx
  on public.site_content_versions (content_key, language, changed_at desc);
