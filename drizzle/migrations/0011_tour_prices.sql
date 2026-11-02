create table public.tour_prices (
  price_key text primary key,
  amount integer not null check (amount > 0 and amount <= 100000),
  updated_at timestamptz not null default now()
);
grant select on public.tour_prices to anon, authenticated;
grant insert, update on public.tour_prices to authenticated;
grant all on public.tour_prices to service_role;
alter table public.tour_prices enable row level security;
create policy "Public can read tour prices" on public.tour_prices for select using (true);
create policy "Admin can insert tour prices" on public.tour_prices for insert to authenticated with check ((select public.has_role((select auth.uid()), 'admin')));
create policy "Admin can update tour prices" on public.tour_prices for update to authenticated using ((select public.has_role((select auth.uid()), 'admin'))) with check ((select public.has_role((select auth.uid()), 'admin')));
insert into public.tour_prices (price_key, amount) values
  ('kultur_2', 2700), ('kultur_3_4', 1700), ('kultur_5plus', 1690),
  ('trekking', 1490), ('trekking_original', 1750);