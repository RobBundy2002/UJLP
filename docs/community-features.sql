-- Apply after the alumni profile and directory-admin migrations.
-- Does not change existing directory access or administrator membership.
begin;

create table if not exists public.meeting_recaps (
    id uuid primary key default gen_random_uuid(),
    title text not null check (length(trim(title)) > 0),
    meeting_date date not null,
    kind text not null default 'Meeting' check (kind in ('Meeting', 'Workshop', 'Panel')),
    summary text not null check (length(trim(summary)) > 0),
    notes text not null default '',
    open_questions text not null default '',
    recording_url text not null default '' check (recording_url = '' or recording_url ~ '^https://'),
    slides_url text not null default '' check (slides_url = '' or slides_url ~ '^https://'),
    resources jsonb not null default '[]'::jsonb check (jsonb_typeof(resources) = 'array'),
    uploaded_files jsonb not null default '[]'::jsonb check (jsonb_typeof(uploaded_files) = 'array'),
    published boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.meeting_recaps add column if not exists uploaded_files jsonb not null default '[]'::jsonb check (jsonb_typeof(uploaded_files) = 'array');

alter table public.meeting_recaps enable row level security;
revoke all on public.meeting_recaps from anon, authenticated;
grant select on public.meeting_recaps to anon, authenticated;
grant insert, update on public.meeting_recaps to authenticated;

drop policy if exists "Published recaps are public" on public.meeting_recaps;
create policy "Published recaps are public" on public.meeting_recaps
    for select to anon, authenticated using (published);
drop policy if exists "Admins read recap drafts" on public.meeting_recaps;
create policy "Admins read recap drafts" on public.meeting_recaps
    for select to authenticated using (public.is_alumni_directory_admin());
drop policy if exists "Admins add recaps" on public.meeting_recaps;
create policy "Admins add recaps" on public.meeting_recaps
    for insert to authenticated with check (public.is_alumni_directory_admin());
drop policy if exists "Admins edit recaps" on public.meeting_recaps;
create policy "Admins edit recaps" on public.meeting_recaps
    for update to authenticated using (public.is_alumni_directory_admin())
    with check (public.is_alumni_directory_admin());

drop trigger if exists meeting_recap_updated_at on public.meeting_recaps;
create trigger meeting_recap_updated_at before update on public.meeting_recaps
    for each row execute function public.set_alumni_profile_updated_at();

create table if not exists public.alumni_affiliation_reviews (
    user_id uuid primary key references public.alumni_profiles(user_id) on delete cascade,
    affiliation text not null check (affiliation in ('ujlp-current', 'ujlp-alumni', 'uva-law', 'community')),
    status text not null default 'pending' check (status in ('pending', 'verified', 'declined')),
    requested_at timestamptz not null default now(),
    reviewed_at timestamptz,
    reviewed_by uuid references auth.users(id) on delete set null
);

alter table public.alumni_affiliation_reviews enable row level security;
-- Authenticated users can read permitted rows, but cannot write this table directly.
-- Only the two checked functions below can submit or approve a claim.
revoke all on public.alumni_affiliation_reviews from public, anon, authenticated;
grant select on public.alumni_affiliation_reviews to authenticated;
drop policy if exists "Read visible affiliation reviews" on public.alumni_affiliation_reviews;
create policy "Read visible affiliation reviews" on public.alumni_affiliation_reviews
    for select to authenticated using (
        user_id = auth.uid()
        or public.is_alumni_directory_admin()
        or (status = 'verified' and exists (
            select 1 from public.alumni_profiles profile
            where profile.user_id = alumni_affiliation_reviews.user_id
              and profile.directory_visible
        ))
    );

create or replace function public.request_affiliation_review(requested_affiliation text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
    if auth.uid() is null then raise exception 'Sign in to request a review.'; end if;
    if requested_affiliation is null or requested_affiliation not in ('ujlp-current', 'ujlp-alumni', 'uva-law', 'community') then
        raise exception 'Choose a valid affiliation.';
    end if;
    if not exists (select 1 from public.alumni_profiles where user_id = auth.uid()) then
        raise exception 'Create a profile before requesting a review.';
    end if;
    insert into public.alumni_affiliation_reviews (user_id, affiliation)
    values (auth.uid(), requested_affiliation)
    on conflict (user_id) do update set
        affiliation = excluded.affiliation, status = 'pending', requested_at = now(),
        reviewed_at = null, reviewed_by = null;
end;
$$;

create or replace function public.review_alumni_affiliation(target_user_id uuid, decision text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
    if auth.uid() is null or not coalesce(public.is_alumni_directory_admin(), false) then
        raise exception 'Administrator access is required.';
    end if;
    if decision is null or decision not in ('verified', 'declined') then
        raise exception 'Choose verified or declined.';
    end if;
    update public.alumni_affiliation_reviews set
        status = decision, reviewed_at = now(), reviewed_by = auth.uid()
    where user_id = target_user_id;
    if not found then raise exception 'No affiliation request exists for this member.'; end if;
end;
$$;

revoke all on function public.request_affiliation_review(text) from public, anon;
revoke all on function public.review_alumni_affiliation(uuid, text) from public, anon;
grant execute on function public.request_affiliation_review(text) to authenticated;
grant execute on function public.review_alumni_affiliation(uuid, text) to authenticated;

commit;
