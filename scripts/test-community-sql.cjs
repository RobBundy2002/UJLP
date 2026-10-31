// Run with PGLITE_MODULE pointing to a temporary @electric-sql/pglite install.
// This test never connects to Supabase or uses production credentials.
const { PGlite } = require(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const fs = require('fs');
const assert = require('assert/strict');
const db = new PGlite();
const member = '00000000-0000-4000-8000-000000000001';
const other = '00000000-0000-4000-8000-000000000002';
const admin = '00000000-0000-4000-8000-000000000003';
const hidden = '00000000-0000-4000-8000-000000000004';

async function asUser(id, sql, params = [], role = 'authenticated') {
    await db.exec(`begin; set local role ${role};`);
    try {
        await db.query("select set_config('request.jwt.claim.sub', $1, true)", [id || '']);
        return await db.query(sql, params);
    } finally { await db.exec('rollback'); }
}
// Same role context, but commit requests and reviews for the following checks.
async function change(id, sql, params = []) {
    await db.exec('begin; set local role authenticated;');
    try {
        await db.query("select set_config('request.jwt.claim.sub', $1, true)", [id]);
        await db.query(sql, params);
        await db.exec('commit');
    } catch (error) { await db.exec('rollback'); throw error; }
}
(async () => {
    await db.exec(`
        create role anon; create role authenticated;
        create schema auth;
        create table auth.users (id uuid primary key);
        create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
        grant usage on schema auth to anon, authenticated;
        grant execute on function auth.uid() to anon, authenticated;
        create function public.is_alumni_directory_admin() returns boolean language sql stable as $$ select auth.uid() = '${admin}'::uuid $$;
        create table public.alumni_profiles (user_id uuid unique references auth.users(id), directory_visible boolean default true);
        alter table public.alumni_profiles enable row level security;
        grant select on public.alumni_profiles to authenticated;
        create policy profiles_read on public.alumni_profiles for select to authenticated using (directory_visible or user_id=auth.uid() or public.is_alumni_directory_admin());
        create function public.set_alumni_profile_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
        insert into auth.users values ('${member}'), ('${other}'), ('${admin}'), ('${hidden}');
        insert into public.alumni_profiles values ('${member}',true), ('${other}',true), ('${admin}',true), ('${hidden}',false);
    `);
    const migration = fs.readFileSync('docs/community-features.sql', 'utf8');
    await db.exec(migration);
    await db.exec(migration);
    await assert.rejects(asUser(null, "select public.request_affiliation_review('ujlp-current')", [], 'anon'));
    await change(member, "select public.request_affiliation_review('ujlp-current')");
    await assert.rejects(asUser(member, "update public.alumni_affiliation_reviews set status='verified' where user_id=$1", [member]));
    await assert.rejects(asUser(member, "insert into public.alumni_affiliation_reviews(user_id,affiliation,status) values($1,'ujlp-current','verified')", [other]));
    await assert.rejects(asUser(member, "select public.review_alumni_affiliation($1,'verified')", [member]));
    await assert.rejects(asUser(admin, "select public.review_alumni_affiliation($1,null)", [member]));
    assert.equal((await asUser(other, 'select * from public.alumni_affiliation_reviews')).rows.length, 0);
    await change(admin, "select public.review_alumni_affiliation($1,'verified')", [member]);
    assert.equal((await asUser(other, 'select status from public.alumni_affiliation_reviews')).rows[0].status, 'verified');
    await change(hidden, "select public.request_affiliation_review('uva-law')");
    await change(admin, "select public.review_alumni_affiliation($1,'verified')", [hidden]);
    assert.equal((await asUser(other, 'select * from public.alumni_affiliation_reviews where user_id=$1', [hidden])).rows.length, 0);
    assert.equal((await asUser(admin, 'select * from public.alumni_affiliation_reviews')).rows.length, 2);
    await change(member, "select public.request_affiliation_review('ujlp-alumni')");
    assert.equal((await asUser(member, 'select status from public.alumni_affiliation_reviews where user_id=$1', [member])).rows[0].status, 'pending');
    assert.equal((await asUser(other, 'select * from public.alumni_affiliation_reviews')).rows.length, 0);
    await change(admin, "insert into public.meeting_recaps(title,meeting_date,summary,published) values('Public recap','2026-10-15','Approved materials',true),('Draft recap','2026-10-16','Private draft',false)");
    assert.equal((await asUser(null, 'select * from public.meeting_recaps', [], 'anon')).rows.length, 1);
    assert.equal((await asUser(admin, 'select * from public.meeting_recaps')).rows.length, 2);
    await assert.rejects(asUser(member, "insert into public.meeting_recaps(title,meeting_date,summary) values('Forged','2026-10-15','Bad')"));
    assert.equal((await asUser(member, "update public.meeting_recaps set published=true where not published returning id")).rows.length, 0);
    // Model the existing Supabase Storage schema; test our bucket policies only.
    await db.exec(`
        create schema storage;
        create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
        create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text);
        alter table storage.objects enable row level security;
        grant usage on schema storage to anon, authenticated;
    `);
    const storageMigration = fs.readFileSync('docs/community-storage.sql', 'utf8');
    await db.exec(storageMigration);
    await db.exec(storageMigration);
    const recapId = (await db.query("select id from public.meeting_recaps where title='Draft recap'")).rows[0].id;
    const attachmentPath = `${recapId}/test-slides.pdf`;
    await assert.rejects(asUser(member, 'insert into storage.objects(bucket_id,name) values($1,$2)', ['meeting-materials', attachmentPath]));
    await change(admin, 'insert into storage.objects(bucket_id,name) values($1,$2)', ['meeting-materials', attachmentPath]);
    assert.equal((await asUser(null, 'select * from storage.objects', [], 'anon')).rows.length, 0);
    await change(admin, 'update public.meeting_recaps set published=true where id=$1', [recapId]);
    assert.equal((await asUser(null, 'select * from storage.objects', [], 'anon')).rows.length, 0, 'Unattached uploads must stay private even in a published recap folder');
    await change(admin, 'update public.meeting_recaps set uploaded_files=$1::jsonb where id=$2', [JSON.stringify([{path:attachmentPath,name:'test-slides.pdf',kind:'slides'}]),recapId]);
    assert.equal((await asUser(null, 'select * from storage.objects', [], 'anon')).rows.length, 1);
    await change(admin, 'update public.meeting_recaps set published=false where id=$1', [recapId]);
    assert.equal((await asUser(null, 'select * from storage.objects', [], 'anon')).rows.length, 0);
    assert.equal((await asUser(admin, 'select * from storage.objects')).rows.length, 1);
    console.log('PASS: migration reruns, self-verification blocked, admin approval, pending/private row visibility, changed claims lose verification, public published recaps only, non-admin writes blocked, admin-only uploads, unattached/private files protected, published attachment reads, unpublishing removes file access.');
})().finally(() => db.close()).catch(error => { console.error(error); process.exitCode = 1; });
