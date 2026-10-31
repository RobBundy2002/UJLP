-- Run in your EXISTING Supabase project's SQL editor after community-features.sql.
-- The private bucket uses the existing directory-admin authorization function.
begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'meeting-materials', 'meeting-materials', false, 52428800,
    array[
        'application/pdf', 'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav'
    ]
)
on conflict (id) do update set
    public = false, file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

grant select on storage.objects to anon, authenticated;
grant insert on storage.objects to authenticated;

drop policy if exists "Admins upload meeting materials" on storage.objects;
create policy "Admins upload meeting materials" on storage.objects
    for insert to authenticated with check (
        bucket_id = 'meeting-materials'
        and public.is_alumni_directory_admin()
        and exists (
            select 1 from public.meeting_recaps recap
            where recap.id::text = split_part(name, '/', 1)
        )
    );

drop policy if exists "Admins read meeting materials" on storage.objects;
create policy "Admins read meeting materials" on storage.objects
    for select to authenticated using (
        bucket_id = 'meeting-materials' and public.is_alumni_directory_admin()
    );

drop policy if exists "Public reads published recap attachments" on storage.objects;
create policy "Public reads published recap attachments" on storage.objects
    for select to anon, authenticated using (
        bucket_id = 'meeting-materials'
        and exists (
            select 1 from public.meeting_recaps recap
            where recap.published
              and recap.id::text = split_part(name, '/', 1)
              and recap.uploaded_files @> jsonb_build_array(jsonb_build_object('path', name))
        )
    );

commit;
