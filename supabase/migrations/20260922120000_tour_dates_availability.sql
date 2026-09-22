-- Kereztour: dynamic tour dates and booking availability
-- Run this migration in the connected Supabase project.

create table if not exists public.tour_dates (
  id uuid primary key default gen_random_uuid(),
  tour text not null,
  start_date date not null,
  end_date date not null,
  max_participants integer not null default 15,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  constraint tour_dates_max_participants_check check (max_participants between 12 and 15),
  constraint tour_dates_status_check check (status in ('open', 'full', 'cancelled')),
  constraint tour_dates_date_order_check check (end_date >= start_date),
  constraint tour_dates_unique_start unique (tour, start_date)
);

alter table public.bookings
  add column if not exists status text not null default 'pending';

alter table public.bookings
  drop constraint if exists bookings_status_check;

alter table public.bookings
  add constraint bookings_status_check
  check (status in ('pending', 'confirmed', 'cancelled'));

create index if not exists tour_dates_tour_start_idx
  on public.tour_dates (tour, start_date);

create index if not exists bookings_travel_date_status_idx
  on public.bookings (travel_date, status);

alter table public.tour_dates enable row level security;

drop policy if exists "Public can read open tour dates" on public.tour_dates;

create policy "Public can read open tour dates"
on public.tour_dates
for select
to anon, authenticated
using (status <> 'cancelled');

create or replace function public.get_tour_date_availability()
returns table (
  id uuid,
  tour text,
  start_date date,
  end_date date,
  max_participants integer,
  confirmed_participants bigint,
  available_places bigint,
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
    coalesce(sum(
      case
        when b.status = 'confirmed' then b.persons
        else 0
      end
    ), 0)::bigint as confirmed_participants,
    greatest(
      td.max_participants - coalesce(sum(
        case
          when b.status = 'confirmed' then b.persons
          else 0
        end
      ), 0),
      0
    )::bigint as available_places,
    case
      when td.status = 'cancelled' then 'cancelled'
      when td.max_participants - coalesce(sum(
        case
          when b.status = 'confirmed' then b.persons
          else 0
        end
      ), 0) <= 0 then 'full'
      else 'open'
    end as status
  from public.tour_dates td
  left join public.bookings b
    on b.travel_date = td.start_date
  where td.status <> 'cancelled'
  group by td.id, td.tour, td.start_date, td.end_date, td.max_participants, td.status
  order by td.start_date;
$$;

grant execute on function public.get_tour_date_availability() to anon, authenticated;

insert into public.tour_dates (tour, start_date, end_date, max_participants)
values
  ('Kultur Tour', '2026-09-25', '2026-10-04', 15),
  ('Kultur Tour', '2026-10-09', '2026-10-18', 15),
  ('Kultur Tour', '2026-10-23', '2026-11-01', 15)
on conflict (tour, start_date) do update
set
  end_date = excluded.end_date,
  max_participants = excluded.max_participants;
