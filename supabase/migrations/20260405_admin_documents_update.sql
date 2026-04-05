alter table public.registrations
  add column if not exists has_companion boolean not null default false;

alter table public.registrations
  add column if not exists personal_passport_path text;

alter table public.registrations
  add column if not exists companions jsonb not null default '[]'::jsonb;

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

drop policy if exists "admins can read registration documents" on storage.objects;
create policy "admins can read registration documents"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'registration-documents'
    and exists (
      select 1 from public.admin_users a where a.id = auth.uid()
    )
  );
