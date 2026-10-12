-- Confirm bookings only when capacity remains, atomically with a row lock on the tour date.
-- This prevents concurrent admin confirmations from taking the same final places.

create or replace function public.confirm_booking_if_capacity_available(p_booking_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_booking public.bookings%rowtype;
  v_date public.tour_dates%rowtype;
  v_confirmed integer;
begin
  select *
    into v_booking
    from public.bookings
   where id = p_booking_id
   for update;

  if not found then
    raise exception 'Buchung nicht gefunden oder keine Berechtigung.';
  end if;

  if v_booking.status = 'confirmed' then
    return;
  end if;

  if v_booking.status <> 'pending' then
    raise exception 'Nur offene Buchungsanfragen können bestätigt werden.';
  end if;

  if coalesce(v_booking.notes, '') not like '%[[DEPOSIT_PAID_150_EUR]]%' then
    raise exception 'Bitte zuerst die Anzahlung als bezahlt markieren.';
  end if;

  select *
    into v_date
    from public.tour_dates
   where tour = v_booking.tour
     and start_date = v_booking.travel_date
     and status = 'open'
   for update;

  if not found then
    raise exception 'Der Reisetermin ist nicht mehr geöffnet.';
  end if;

  if v_booking.tour = 'Kultur Tour' then
    if v_booking.tier = 'comfort' then
      select coalesce(sum(persons), 0)::integer
        into v_confirmed
        from public.bookings
       where tour = v_booking.tour
         and travel_date = v_booking.travel_date
         and tier = 'comfort'
         and status = 'confirmed'
         and id <> v_booking.id;

      if v_confirmed + v_booking.persons > v_date.comfort_max_participants then
        raise exception 'Nicht genügend freie Plätze für die Comfort-/Jeep-Option.';
      end if;
    elsif v_booking.tier = 'economy' then
      select coalesce(sum(persons), 0)::integer
        into v_confirmed
        from public.bookings
       where tour = v_booking.tour
         and travel_date = v_booking.travel_date
         and tier = 'economy'
         and status = 'confirmed'
         and id <> v_booking.id;

      if v_confirmed + v_booking.persons > v_date.economy_max_participants then
        raise exception 'Nicht genügend freie Plätze für die Economy-/Minibus-Option.';
      end if;
    else
      raise exception 'Ungültige Reiseoption für die Kultur Tour.';
    end if;
  else
    select coalesce(sum(persons), 0)::integer
      into v_confirmed
      from public.bookings
     where tour = v_booking.tour
       and travel_date = v_booking.travel_date
       and status = 'confirmed'
       and id <> v_booking.id;

    if v_confirmed + v_booking.persons > v_date.max_participants then
      raise exception 'Nicht genügend freie Plätze für diesen Reisetermin.';
    end if;
  end if;

  update public.bookings
     set status = 'confirmed'
   where id = v_booking.id;
end;
$$;

revoke execute on function public.confirm_booking_if_capacity_available(uuid) from public, anon;
grant execute on function public.confirm_booking_if_capacity_available(uuid) to authenticated;

notify pgrst, 'reload schema';
