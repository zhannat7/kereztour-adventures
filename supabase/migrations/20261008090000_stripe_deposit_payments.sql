-- Kereztour: payment tracking for Stripe deposit + remaining cash payment.
alter table public.bookings
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists deposit_amount numeric not null default 0,
  add column if not exists remaining_amount numeric not null default 0,
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id text;

alter table public.bookings
  drop constraint if exists bookings_payment_status_check;

alter table public.bookings
  add constraint bookings_payment_status_check
  check (payment_status in ('unpaid', 'checkout_open', 'deposit_paid', 'refunded'));

create index if not exists bookings_payment_status_idx
  on public.bookings (payment_status);

create unique index if not exists bookings_stripe_checkout_session_idx
  on public.bookings (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

create unique index if not exists bookings_stripe_payment_intent_idx
  on public.bookings (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;
