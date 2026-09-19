create extension if not exists pgcrypto;

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

create table if not exists public.alumni_feed_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  body text not null default '',
  category text not null default 'Update',
  post_type text not null default 'update' check (post_type in ('update', 'event', 'deadline')),
  event_date date,
  deadline_date date,
  author_user_id uuid references auth.users(id) on delete set null,
  author_name text not null default 'UJLP',
  author_photo_key text not null default 'blank',
  pinned boolean not null default false,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.public_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  body text not null default '',
  category text not null default 'Update',
  publish_date date,
  audience text not null default 'public' check (audience in ('public', 'portal')),
  tagged_user_ids text[] not null default '{}',
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.alumni_weekly_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  details text not null default '',
  role text not null default 'Writers',
  due_date date,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists alumni_feed_posts_feed_idx
on public.alumni_feed_posts (pinned desc, created_at desc);

create index if not exists public_announcements_feed_idx
on public.public_announcements (audience, pinned desc, publish_date desc);

create index if not exists alumni_weekly_tasks_due_date_idx
on public.alumni_weekly_tasks (due_date, priority);

alter table public.alumni_feed_posts enable row level security;
alter table public.public_announcements enable row level security;
alter table public.alumni_weekly_tasks enable row level security;

drop policy if exists "Authenticated members can read feed posts" on public.alumni_feed_posts;
drop policy if exists "Authenticated members can create feed posts" on public.alumni_feed_posts;
drop policy if exists "Members can update their own feed posts" on public.alumni_feed_posts;
drop policy if exists "Members can delete their own feed posts" on public.alumni_feed_posts;
drop policy if exists "Directory admins can manage feed posts" on public.alumni_feed_posts;
drop policy if exists "Anyone can read public announcements" on public.public_announcements;
drop policy if exists "Authenticated members can read portal announcements" on public.public_announcements;
drop policy if exists "Directory admins can manage announcements" on public.public_announcements;
drop policy if exists "Authenticated members can read weekly tasks" on public.alumni_weekly_tasks;
drop policy if exists "Directory admins can manage weekly tasks" on public.alumni_weekly_tasks;

create policy "Authenticated members can read feed posts"
on public.alumni_feed_posts for select to authenticated using (true);

create policy "Authenticated members can create feed posts"
on public.alumni_feed_posts for insert to authenticated
with check (auth.uid() = author_user_id);

create policy "Members can update their own feed posts"
on public.alumni_feed_posts for update to authenticated
using (auth.uid() = author_user_id)
with check (auth.uid() = author_user_id);

create policy "Members can delete their own feed posts"
on public.alumni_feed_posts for delete to authenticated
using (auth.uid() = author_user_id);

create policy "Directory admins can manage feed posts"
on public.alumni_feed_posts for all to authenticated
using (public.is_alumni_directory_admin())
with check (public.is_alumni_directory_admin());

create policy "Anyone can read public announcements"
on public.public_announcements for select to anon, authenticated
using (audience = 'public');

create policy "Authenticated members can read portal announcements"
on public.public_announcements for select to authenticated
using (audience in ('public', 'portal'));

create policy "Directory admins can manage announcements"
on public.public_announcements for all to authenticated
using (public.is_alumni_directory_admin())
with check (public.is_alumni_directory_admin());

create policy "Authenticated members can read weekly tasks"
on public.alumni_weekly_tasks for select to authenticated using (true);

create policy "Directory admins can manage weekly tasks"
on public.alumni_weekly_tasks for all to authenticated
using (public.is_alumni_directory_admin())
with check (public.is_alumni_directory_admin());
