-- UJLP alumni feed comments and likes
-- Run this in Supabase SQL Editor before deploying the feed social frontend.

create extension if not exists pgcrypto;

create table if not exists public.alumni_feed_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.alumni_feed_posts(id) on delete cascade,
  author_user_id uuid references auth.users(id) on delete set null,
  author_name text not null default 'UJLP member',
  author_photo_key text not null default 'blank',
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.alumni_feed_likes (
  post_id uuid not null references public.alumni_feed_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null default 'UJLP member',
  user_photo_key text not null default 'blank',
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists alumni_feed_comments_post_idx
on public.alumni_feed_comments (post_id, created_at asc);

create index if not exists alumni_feed_likes_post_idx
on public.alumni_feed_likes (post_id, created_at asc);

create or replace function public.set_alumni_feed_comment_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_alumni_feed_comment_updated_at on public.alumni_feed_comments;

create trigger set_alumni_feed_comment_updated_at
before update on public.alumni_feed_comments
for each row
execute function public.set_alumni_feed_comment_updated_at();

alter table public.alumni_feed_comments enable row level security;
alter table public.alumni_feed_likes enable row level security;

drop policy if exists "Authenticated members can read feed comments" on public.alumni_feed_comments;
drop policy if exists "Authenticated members can create feed comments" on public.alumni_feed_comments;
drop policy if exists "Members can update their own feed comments" on public.alumni_feed_comments;
drop policy if exists "Members can delete their own feed comments" on public.alumni_feed_comments;
drop policy if exists "Directory admins can manage feed comments" on public.alumni_feed_comments;
drop policy if exists "Authenticated members can read feed likes" on public.alumni_feed_likes;
drop policy if exists "Authenticated members can create feed likes" on public.alumni_feed_likes;
drop policy if exists "Members can update their own feed likes" on public.alumni_feed_likes;
drop policy if exists "Members can delete their own feed likes" on public.alumni_feed_likes;
drop policy if exists "Directory admins can manage feed likes" on public.alumni_feed_likes;

create policy "Authenticated members can read feed comments"
on public.alumni_feed_comments for select to authenticated using (true);

create policy "Authenticated members can create feed comments"
on public.alumni_feed_comments for insert to authenticated
with check (auth.uid() = author_user_id);

create policy "Members can update their own feed comments"
on public.alumni_feed_comments for update to authenticated
using (auth.uid() = author_user_id)
with check (auth.uid() = author_user_id);

create policy "Members can delete their own feed comments"
on public.alumni_feed_comments for delete to authenticated
using (auth.uid() = author_user_id);

create policy "Directory admins can manage feed comments"
on public.alumni_feed_comments for all to authenticated
using (public.is_alumni_directory_admin())
with check (public.is_alumni_directory_admin());

create policy "Authenticated members can read feed likes"
on public.alumni_feed_likes for select to authenticated using (true);

create policy "Authenticated members can create feed likes"
on public.alumni_feed_likes for insert to authenticated
with check (auth.uid() = user_id);

create policy "Members can update their own feed likes"
on public.alumni_feed_likes for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Members can delete their own feed likes"
on public.alumni_feed_likes for delete to authenticated
using (auth.uid() = user_id);

create policy "Directory admins can manage feed likes"
on public.alumni_feed_likes for all to authenticated
using (public.is_alumni_directory_admin())
with check (public.is_alumni_directory_admin());
