-- Enable required extension
create extension if not exists pgcrypto;

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'nouvelle',
  full_name text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  telephone text,
  country text not null,
  birth_date date,
  elo text,
  fide_id text,
  tournament text not null check (tournament in ('magistral', 'challenge', 'blitz')),
  hotel text,
  message text,
  accept_rules boolean not null default false,
  has_companion boolean not null default false,
  personal_passport_path text,
  companions jsonb not null default '[]'::jsonb
);

alter table public.registrations
  add column if not exists has_companion boolean not null default false;
alter table public.registrations
  add column if not exists personal_passport_path text;
alter table public.registrations
  add column if not exists companions jsonb not null default '[]'::jsonb;

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'registration-documents',
  'registration-documents',
  false,
  8388608,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

alter table public.registrations enable row level security;
alter table public.admin_users enable row level security;

-- Public users can create registrations only.
drop policy if exists "public can insert registrations" on public.registrations;
create policy "public can insert registrations"
  on public.registrations
  for insert
  to anon, authenticated
  with check (true);

-- Admin users can read all registrations.
drop policy if exists "admins can read registrations" on public.registrations;
create policy "admins can read registrations"
  on public.registrations
  for select
  to authenticated
  using (exists (
    select 1 from public.admin_users a where a.id = auth.uid()
  ));

-- Admin users can update registrations if needed later.
drop policy if exists "admins can update registrations" on public.registrations;
create policy "admins can update registrations"
  on public.registrations
  for update
  to authenticated
  using (exists (
    select 1 from public.admin_users a where a.id = auth.uid()
  ))
  with check (exists (
    select 1 from public.admin_users a where a.id = auth.uid()
  ));

-- Admin users can read only their own admin row.
drop policy if exists "admins can read own admin row" on public.admin_users;
create policy "admins can read own admin row"
  on public.admin_users
  for select
  to authenticated
  using (id = auth.uid());
