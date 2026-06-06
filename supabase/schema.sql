-- RageMotorSport — Supabase schema for admin-managed car listings.
--
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query → Run).
--
-- Notes:
--  * Seed cars in src/lib/data.ts stay in code; only admin-created cars live here.
--    getAllCars() merges DB rows over the seed list (admin wins on id collision).
--  * Admin ids keep the 'adm_' prefix so the app can tell seed vs admin apart.
--  * Nested Car fields (seller, images, features) are stored as JSONB.
--  * RLS: anyone may read; only authenticated users may write.

create table if not exists public.cars (
  id          text primary key,
  make        text not null,
  model       text not null,
  year        integer not null,
  price       integer not null,
  mileage     integer not null default 0,
  fuel_type   text not null,
  transmission text not null,
  seats       integer not null default 5,
  condition   text not null,
  image       text not null default '',
  images      jsonb not null default '[]'::jsonb,
  description text not null default '',
  features    jsonb not null default '[]'::jsonb,
  seller      jsonb not null default '{}'::jsonb,
  location    text not null default '',
  rating      numeric not null default 0,
  engine      text not null default '',
  drivetrain  text not null default '',
  color       text not null default '',
  category    text not null default '',
  badge       text,
  is_vault    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Keep updated_at fresh on every write.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cars_set_updated_at on public.cars;
create trigger cars_set_updated_at
  before update on public.cars
  for each row execute function public.set_updated_at();

-- Row Level Security: public read, authenticated write.
alter table public.cars enable row level security;

drop policy if exists "cars_public_read" on public.cars;
create policy "cars_public_read"
  on public.cars for select
  to anon, authenticated
  using (true);

drop policy if exists "cars_auth_insert" on public.cars;
create policy "cars_auth_insert"
  on public.cars for insert
  to authenticated
  with check (true);

drop policy if exists "cars_auth_update" on public.cars;
create policy "cars_auth_update"
  on public.cars for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "cars_auth_delete" on public.cars;
create policy "cars_auth_delete"
  on public.cars for delete
  to authenticated
  using (true);
