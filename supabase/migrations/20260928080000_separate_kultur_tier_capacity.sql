-- Kereztour: separate capacities for Kultur Tour Economy and Comfort options

alter table public.tour_dates
  add column if not exists economy_max_participants integer,
  add column if not exists comfort_max_participants integer;

update public.tour_dates
set
  economy_max_participants = coalesce(economy_max_participants, max_participants),
  comfort_max_participants = coalesce(comfort_max_participants, max_participants);

alter table public.tour_dates
  alter column economy_max_participants set default 12,
  alter column comfort_max_participants set default 4,
  alter column economy_max_participants set not null,
  alter column comfort_max_participants set not null;

alter table public.tour_dates
  drop constraint if exists tour_dates_economy_max_check,
  drop constraint if exists tour_dates_comfort_max_check;

alter table public.tour_dates
  add constraint tour_dates_economy_max_check check (economy_max_participants >= 1),
  add constraint tour_dates_comfort_max_check check (comfort_max_participants >= 1);

create or replace function public.get_tour_date_availability()
returns table (
  id uuid,
  tour text,
  start_date date,
  end_date date,
  max_participants integer,
  economy_max_participants integer,
  comfort_max_participants integer,
  confirmed_participants bigint,
  available_places bigint,
  economy_confirmed_participants bigint,
  economy_available_places bigint,
  comfort_confirmed_participants bigint,
  comfort_available_places bigint,
  status text
)
language sql
security definer
set search_path = public
as $$
  select
    td.id,
    td.tour,
    td.start_date,
    td.end_date,
    td.max_participants,
    td.economy_max_participants,
    td.comfort_max_participants,
    coalesce(sum(case when b.status = 'confirmed' then b.persons else 0 end), 0)::bigint,
    greatest(
      td.max_participants - coalesce(sum(case when b.status = 'confirmed' then b.persons else 0 end), 0),
      0
    )::bigint,
    coalesce(sum(case when b.status = 'confirmed' and b.tier = 'economy' then b.persons else 0 end), 0)::bigint,
    greatest(
      td.economy_max_participants - coalesce(sum(case when b.status = 'confirmed' and b.tier = 'economy' then b.persons else 0 end), 0),
      0
    )::bigint,
    coalesce(sum(case when b.status = 'confirmed' and b.tier = 'comfort' then b.persons else 0 end), 0)::bigint,
    greatest(
      td.comfort_max_participants - coalesce(sum(case when b.status = 'confirmed' and b.tier = 'comfort' then b.persons else 0 end), 0),
      0
    )::bigint,
    case
      when td.status = 'cancelled' then 'cancelled'
      when td.tour = 'Kultur Tour'
        and td.economy_max_participants - coalesce(sum(case when b.status = 'confirmed' and b.tier = 'economy' then b.persons else 0 end), 0) <= 0
        and td.comfort_max_participants - coalesce(sum(case when b.status = 'confirmed' and b.tier = 'comfort' then b.persons else 0 end), 0) <= 0 then 'full'
      when td.tour <> 'Kultur Tour'
        and td.max_participants - coalesce(sum(case when b.status = 'confirmed' then b.persons else 0 end), 0) <= 0 then 'full'
      else 'open'
    end
  from public.tour_dates td
  left join public.bookings b
    on b.travel_date = td.start_date
    and b.tour = td.tour
  where td.status <> 'cancelled'
  group by
    td.id, td.tour, td.start_date, td.end_date, td.max_participants,
    td.economy_max_participants, td.comfort_max_participants, td.status
  order by td.start_date;
$$;

grant execute on function public.get_tour_date_availability() to anon, authenticated;
