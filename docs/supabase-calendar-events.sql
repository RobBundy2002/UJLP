-- UJLP alumni calendar events
-- Run this after the alumni portal setup SQL. It adds editable calendar
-- events for the private alumni portal.

create extension if not exists pgcrypto;

create table if not exists public.alumni_calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  details text not null default '',
  category text not null default 'Event',
  event_date date,
  start_time text not null default '',
  end_time text not null default '',
  location text not null default '',
  link_url text not null default '',
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists alumni_calendar_events_date_idx
on public.alumni_calendar_events (pinned desc, event_date asc, start_time asc);

alter table public.alumni_calendar_events enable row level security;

drop policy if exists "Authenticated members can read calendar events" on public.alumni_calendar_events;
drop policy if exists "Directory admins can manage calendar events" on public.alumni_calendar_events;

create policy "Authenticated members can read calendar events"
on public.alumni_calendar_events
for select
to authenticated
using (true);

create policy "Directory admins can manage calendar events"
on public.alumni_calendar_events
for all
to authenticated
using (public.is_alumni_directory_admin())
with check (public.is_alumni_directory_admin());
