CREATE OR REPLACE FUNCTION public.get_tour_date_availability()
 RETURNS TABLE(id uuid, tour text, start_date date, end_date date, max_participants integer, confirmed_participants bigint, available_places bigint, status text)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select
    td.id, td.tour, td.start_date, td.end_date, td.max_participants,
    coalesce(sum(case when b.status = 'confirmed' then b.persons else 0 end), 0)::bigint as confirmed_participants,
    case when td.status = 'full' then 0::bigint else greatest(
      td.max_participants - coalesce(sum(case when b.status = 'confirmed' then b.persons else 0 end), 0), 0
    )::bigint end as available_places,
    case
      when td.status = 'cancelled' then 'cancelled'
      when td.status = 'full' then 'full'
      when td.max_participants - coalesce(sum(case when b.status = 'confirmed' then b.persons else 0 end), 0) <= 0 then 'full'
      else 'open'
    end as status
  from public.tour_dates td
  left join public.bookings b on b.travel_date = td.start_date and b.tour = td.tour
  where td.status <> 'cancelled'
  group by td.id, td.tour, td.start_date, td.end_date, td.max_participants, td.status
  order by td.start_date;
$function$;