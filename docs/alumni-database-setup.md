# Alumni Directory Database Setup

The alumni directory is built so the public site can stay on GitHub Pages. GitHub Pages cannot host Postgres or securely handle passwords, so production should use a managed Postgres/Auth service. The frontend currently expects Supabase-compatible Auth and PostgREST endpoints through:

```bash
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-public-publishable-or-anon-key
```

Without those variables, `/alumni` runs in local preview mode using browser `localStorage` and placeholder profiles.

## Hidden Production URL

The page is intentionally not linked from the main navigation, footer, or site search. With the current `HashRouter`, the direct production URL will be:

```text
https://ujlawandpolitics.org/#/alumni
```

This is not a security boundary. Anyone with the URL can load the locked page, but the directory data remains protected by Supabase Auth and Row Level Security.

## Schema

Run this SQL in Supabase.

```sql
create extension if not exists pgcrypto;

create table if not exists public.alumni_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null default '',
  photo_key text not null default 'blank',
  status text not null default 'alumni' check (status in ('current', 'alumni')),
  class_year text not null default '',
  ujlp_role text not null default '',
  current_title text not null default '',
  current_org text not null default '',
  location text not null default '',
  industry text not null default '',
  path_type text not null default 'other' check (
    path_type in (
      'current-student',
      'law-school',
      'law-firm',
      'government',
      'public-service',
      'private-sector',
      'nonprofit',
      'graduate-school',
      'other'
    )
  ),
  law_school text not null default '',
  grad_school text not null default '',
  undergrad_major text not null default '',
  preferred_email text not null default '',
  linkedin_url text not null default '',
  willing_to_chat boolean not null default true,
  interests text[] not null default '{}',
  bio text not null default '',
  directory_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists alumni_profiles_status_idx on public.alumni_profiles(status);
create index if not exists alumni_profiles_class_year_idx on public.alumni_profiles(class_year);
create index if not exists alumni_profiles_path_type_idx on public.alumni_profiles(path_type);
create index if not exists alumni_profiles_current_org_idx on public.alumni_profiles using gin (to_tsvector('english', current_org));
create index if not exists alumni_profiles_law_school_idx on public.alumni_profiles using gin (to_tsvector('english', law_school));
create index if not exists alumni_profiles_full_name_idx on public.alumni_profiles using gin (to_tsvector('english', full_name));

create or replace function public.set_alumni_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_alumni_profile_updated_at on public.alumni_profiles;

create trigger set_alumni_profile_updated_at
before update on public.alumni_profiles
for each row
execute function public.set_alumni_profile_updated_at();
```

If you created the table before profile images were added, run this migration:

```sql
alter table public.alumni_profiles
add column if not exists photo_key text not null default 'blank';
```

## Row Level Security

These policies lock the directory to signed-in users. Any authenticated member can read visible profiles, and members can always read their own profile even if they hide it from the directory. Each member can create or edit only their own profile.

```sql
alter table public.alumni_profiles enable row level security;

drop policy if exists "Authenticated members can read visible alumni profiles" on public.alumni_profiles;
drop policy if exists "Members can create their own alumni profile" on public.alumni_profiles;
drop policy if exists "Members can update their own alumni profile" on public.alumni_profiles;
drop policy if exists "Members can delete their own alumni profile" on public.alumni_profiles;

create policy "Authenticated members can read visible alumni profiles"
on public.alumni_profiles
for select
to authenticated
using (directory_visible = true or auth.uid() = user_id);

create policy "Members can create their own alumni profile"
on public.alumni_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Members can update their own alumni profile"
on public.alumni_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Members can delete their own alumni profile"
on public.alumni_profiles
for delete
to authenticated
using (auth.uid() = user_id);
```

## Auth Settings

- Use Supabase Email Auth.
- Keep the publishable/anon key public; it is designed for browser use when RLS is enabled.
- Do not put the service role key in GitHub Pages, React env vars, or the repository.
- If you want only UJLP-approved members to create accounts, disable open signup and invite users from Supabase, or add an approval table and Edge Function later.

## Profile Images

Images are code-managed for now, not uploaded to Supabase Storage.

1. Add the image file to `src/ProfilePictures/`.
2. Import it in `src/Data/alumniPhotoRegistry.js`.
3. Add a registry entry with a stable key, label, and image source.
4. In the alumni profile editor, choose that image from the Profile image dropdown.

The database stores only `photo_key`, such as `derek-tsai` or `blank`. This keeps GitHub Pages simple and avoids storing user-uploaded files in Postgres.

## Deployment Notes

GitHub Pages will only serve the static React build. Before building for production, add these variables to the build environment:

```bash
REACT_APP_SUPABASE_URL=...
REACT_APP_SUPABASE_ANON_KEY=...
npm run build
```

The GitHub Pages deploy workflow reads these values from repository secrets:

```text
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY
```

Set them in GitHub under Settings -> Secrets and variables -> Actions -> Repository secrets before pushing a deploy commit. If those secrets are missing, the deployed build will fall back to local preview mode and will not persist profile changes to Postgres.

For local testing without Supabase, leave the variables unset and create a preview account on `/alumni`.
