-- UJLP Alumni Profile update
-- Run this once in Supabase SQL Editor before deploying the updated frontend.
-- It adds the new profile questionnaire fields, updates allowed path values,
-- updates the invite-code RPC, and enables FREESPEECH as a profile invite code.

create extension if not exists pgcrypto;

alter table public.alumni_profiles
add column if not exists profile_type text not null default '',
add column if not exists undergraduate_school text not null default '',
add column if not exists degree_title text not null default '',
add column if not exists affiliated_with_ujlp boolean not null default false,
add column if not exists jobs jsonb not null default '[]'::jsonb;

alter table public.alumni_profiles
drop constraint if exists alumni_profiles_path_type_check;

alter table public.alumni_profiles
add constraint alumni_profiles_path_type_check
check (
  path_type in (
    'current-student',
    'law-school',
    'law-firm',
    'government',
    'public-service',
    'private-sector',
    'finance',
    'consulting',
    'nonprofit',
    'graduate-school',
    'undecided',
    'other'
  )
);

insert into public.alumni_profile_invite_codes (code_hash, label, is_active)
values (
  encode(digest('FREESPEECH', 'sha256'), 'hex'),
  'FREESPEECH profile invite',
  true
)
on conflict (code_hash) do update
set is_active = true,
    label = excluded.label;

create or replace function public.create_alumni_profile(invite_code text, profile_data jsonb)
returns public.alumni_profiles
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  created_profile public.alumni_profiles;
begin
  if auth.uid() is null then
    raise exception 'You need to be signed in to create a profile.';
  end if;

  if not exists (
    select 1
    from public.alumni_profile_invite_codes
    where code_hash = encode(digest(invite_code, 'sha256'), 'hex')
      and is_active = true
  ) then
    raise exception 'That invite code is not valid.';
  end if;

  insert into public.alumni_profiles (
    user_id,
    profile_type,
    full_name,
    photo_key,
    status,
    class_year,
    ujlp_role,
    current_title,
    current_org,
    location,
    industry,
    path_type,
    law_school,
    grad_school,
    undergraduate_school,
    undergrad_major,
    degree_title,
    preferred_email,
    linkedin_url,
    affiliated_with_ujlp,
    jobs,
    willing_to_chat,
    interests,
    bio,
    directory_visible
  )
  values (
    auth.uid(),
    coalesce(profile_data ->> 'profile_type', ''),
    coalesce(profile_data ->> 'full_name', ''),
    coalesce(profile_data ->> 'photo_key', 'blank'),
    coalesce(profile_data ->> 'status', 'alumni'),
    coalesce(profile_data ->> 'class_year', ''),
    coalesce(profile_data ->> 'ujlp_role', ''),
    coalesce(profile_data ->> 'current_title', ''),
    coalesce(profile_data ->> 'current_org', ''),
    coalesce(profile_data ->> 'location', ''),
    coalesce(profile_data ->> 'industry', ''),
    coalesce(profile_data ->> 'path_type', 'other'),
    coalesce(profile_data ->> 'law_school', ''),
    coalesce(profile_data ->> 'grad_school', ''),
    coalesce(profile_data ->> 'undergraduate_school', ''),
    coalesce(profile_data ->> 'undergrad_major', ''),
    coalesce(profile_data ->> 'degree_title', ''),
    coalesce(profile_data ->> 'preferred_email', ''),
    coalesce(profile_data ->> 'linkedin_url', ''),
    coalesce((profile_data ->> 'affiliated_with_ujlp')::boolean, false),
    coalesce(profile_data -> 'jobs', '[]'::jsonb),
    coalesce((profile_data ->> 'willing_to_chat')::boolean, true),
    array(select jsonb_array_elements_text(coalesce(profile_data -> 'interests', '[]'::jsonb))),
    coalesce(profile_data ->> 'bio', ''),
    coalesce((profile_data ->> 'directory_visible')::boolean, true)
  )
  on conflict (user_id) do nothing
  returning * into created_profile;

  if created_profile.id is null then
    raise exception 'A profile already exists for this account.';
  end if;

  return created_profile;
end;
$$;

revoke all on function public.create_alumni_profile(text, jsonb) from public;
grant execute on function public.create_alumni_profile(text, jsonb) to authenticated;

-- Directory-admin policies for editing another member's existing profile.
-- Keep this email list in sync with REACT_APP_ALUMNI_ADMIN_EMAILS.
create or replace function public.is_alumni_directory_admin()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = any (
    array[
      'robbielbundy@gmail.com',
      'shelbyeliasek@gmail.com'
    ]
  );
$$;

alter table public.alumni_profiles enable row level security;

drop policy if exists "Directory admins can read all alumni profiles" on public.alumni_profiles;
drop policy if exists "Directory admins can create alumni profiles" on public.alumni_profiles;
drop policy if exists "Directory admins can update all alumni profiles" on public.alumni_profiles;

create policy "Directory admins can read all alumni profiles"
on public.alumni_profiles
for select
to authenticated
using (public.is_alumni_directory_admin());

create policy "Directory admins can create alumni profiles"
on public.alumni_profiles
for insert
to authenticated
with check (public.is_alumni_directory_admin());

create policy "Directory admins can update all alumni profiles"
on public.alumni_profiles
for update
to authenticated
using (public.is_alumni_directory_admin())
with check (public.is_alumni_directory_admin());
