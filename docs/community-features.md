# Meeting recaps and affiliation verification

## Public meeting archive

`/announcements#meeting-recaps` collects recordings, slides, notes, related resources, and follow-up questions. It is a section of the existing Announcements page, reached through the main navigation or the “Browse meeting recaps” link. Upcoming notices and past meeting materials stay on one page. Search covers titles, summaries, and notes; visitors can filter by meeting, workshop, or panel.

Administrators use **Add recap** to create a draft, then check **Publish on the public archive** when the materials are approved. Edit an existing recap and uncheck that box to withdraw it from public view. Admins can upload files directly in the recap editor, or use existing HTTPS links. Recordings are downloaded or linked rather than embedded; external video players do not load automatically.

There are no seeded or invented meeting recaps. An empty archive is intentional until someone adds actual materials. Existing member-network calendar entries remain separate; private meeting details are not automatically published.

## Direct uploads in Announcements

1. Open **Announcements**, sign in as an admin, and choose **Add recap**.
2. Enter a title, date, and summary. Choose **Save draft & enable uploads**.
3. Select **Slides**, **Recording**, or **Related resource**, then choose a file.
4. Uploads are private immediately. Save the recap to attach them to the record.
5. Check **Publish on the public archive** and save to make the recap and its attached files available to visitors.

Supported files: PDF, PPT/PPTX, DOC/DOCX, TXT, MP4, WebM, MP3, and WAV. The configured limit is **50 MiB per file**; the Supabase project's global limit can be lower. Use the recording URL field for larger recordings. Uploads use standard transfers; resumable uploads are not included in this version.

Files go to the private `meeting-materials` bucket in your existing Supabase project, not Git. Storage policies allow only existing administrators to upload. A visitor can obtain a five-minute download URL only for a file explicitly attached to a published recap. The filename and download link appear on the recap automatically; there is no repo editing required for each file.

Unpublishing a recap prevents new public download URLs. Previously issued signed links can remain valid for up to five minutes. Removing an attachment and saving the recap also removes its public availability. Removing/canceling an unsaved attachment does not delete the physical upload; it stays private and can be cleaned up in Supabase Storage by an admin.

## Affiliation review

Profile categories are self-reported. Checking “affiliated with UJLP,” using a UVA email, or entering an editorial role does **not** create a verified badge.

1. Sign in, open **Alumni → Directory**, and view your own profile.
2. Choose the affiliation to review and select **Request review**.
3. An administrator filters the directory by **Affiliation review → Pending review**.
4. Open a profile and confirm or decline the claim after checking the organization's records.
5. Confirmed profiles display the exact reviewed affiliation. Administrators can revoke it.

Available affiliations: current UJLP member, former UJLP member, UVA Law student, and community participant. A confirmed community participant is not labeled as a UJLP member. This feature verifies affiliation only; it does not verify employment, endorse a person, or grant additional network access.

If someone submits a different affiliation after being verified, the existing verification is replaced by a pending claim. Their badge disappears until the new claim is reviewed. Hidden profiles do not expose verified affiliations to other regular members. Pending and declined requests are visible only to their owner and administrators.

## Database rollout — required before production use

The migration is prepared in this repository; it has **not** been applied to a live database by this change.

1. Complete [the alumni database setup](alumni-database-setup.md), including the `is_alumni_directory_admin()` function and update timestamp trigger function.
2. Confirm the backend administrator allowlist is correct. The React `REACT_APP_ALUMNI_ADMIN_EMAILS` list controls UI visibility only; it must agree with server authorization.
3. In your existing Supabase project, run [community-features.sql](community-features.sql), then [community-storage.sql](community-storage.sql) in the SQL editor. No new project or credentials are required. It creates the two tables, policies, and checked RPC functions. It does not add administrators or change existing directory access.
4. Sign in as a regular member. Confirm the claim can be submitted but not approved or directly updated.
5. Sign in as an admin. Approve a test claim, revoke it, and confirm the badge changes.
6. Save a draft recap and check that a signed-out browser cannot see it. Publish approved materials and check the public archive.

Without the migration, the archive and verification panel display service-unavailable messages and do not fabricate data or verification. Other directory features continue to work.

## Development modes

With Supabase configured, all persistence uses the server. Row Level Security restricts recap writes to admins, and the verification table has no direct write grants for regular users. Approval happens only inside a server function that checks administrator permission. See [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) and [database function permissions](https://supabase.com/docs/guides/database/functions).

Without Supabase, meeting recaps can be previewed in browser localStorage by a configured preview admin. That local preview is not a production permission boundary. Verification is deliberately disabled in preview mode; examples cannot acquire trusted badges.

## Tests

```bash
CI=true npm test -- --watchAll=false
npm run build
npm run test:community
```

The community browser suite creates a separate temporary build using fake backend settings. All community requests are intercepted with synthetic fixtures. It tests request/approval/revocation, direct file uploads/downloads, draft visibility, publishing, resources, search, and mobile layout without contacting production.

Database policies can be tested with a temporary PGlite install, without adding a dependency to this app:

```bash
npm install --prefix /tmp/ujlp-sql-check @electric-sql/pglite
PGLITE_MODULE=/tmp/ujlp-sql-check/node_modules/@electric-sql/pglite node scripts/test-community-sql.cjs
```

This executes the migration in local Postgres-compatible storage with test users and roles. It checks that regular members cannot directly write verification rows, approve themselves, see someone else's pending/private review, or publish recaps. It also checks migration reruns, approval, revocation via new claims, anonymous published-only reads, admin-only file uploads, and the rule that an attachment must be saved on a published recap to be publicly readable. Production's existing administrator function and profile policies still need their own rollout checks.
