const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { startBuildServer } = require('./build-preview-server');

const output = fs.mkdtempSync(path.join(os.tmpdir(), 'ujlp-community-build-'));
const memberId = '00000000-0000-4000-8000-000000000001';
const adminId = '00000000-0000-4000-8000-000000000003';
const profile = { id: 'profile-example', user_id: memberId, full_name: 'Example Member', status: 'current', profile_type: 'uva-undergraduate-alumni', directory_visible: true, affiliated_with_ujlp: true, verification_status: 'verified', photo_key: 'blank' };
const adminProfile = { ...profile, id: 'profile-admin', user_id: adminId, full_name: 'Example Administrator' };
let reviews = [];
let meetings = [];
const uploadedFiles = new Map();

async function setupPage(browser, base, role) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    if (role !== 'public') {
        const id = role === 'admin' ? adminId : memberId;
        const token = `test.${Buffer.from(JSON.stringify({ sub: id, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.signature`;
        await page.addInitScript(session => localStorage.setItem('ujlp_alumni_session', JSON.stringify(session)), { access_token: token, user: { id, email: role === 'admin' ? 'preview-admin@example.test' : 'member@example.test' } });
    }
    await page.route('https://community.example.test/**', async route => {
        const request = route.request();
        const url = new URL(request.url());
        if (url.pathname.startsWith('/storage/v1/')) {
            const signing = '/storage/v1/object/sign/meeting-materials/';
            const uploading = '/storage/v1/object/meeting-materials/';
            const filePath = decodeURIComponent(url.pathname.slice((url.pathname.startsWith(signing) ? signing : uploading).length));
            if (url.pathname.startsWith(uploading) && request.method() === 'POST') {
                if (role !== 'admin') return route.fulfill({ status: 403, json: { message: 'Admin required' } });
                uploadedFiles.set(filePath, request.postDataBuffer());
                return route.fulfill({ json: { Key: filePath } });
            }
            const permitted = role === 'admin' || meetings.some(item => item.published && item.uploaded_files?.some(file => file.path === filePath));
            if (!permitted || !uploadedFiles.has(filePath)) return route.fulfill({ status: 403, json: { message: 'Private file' } });
            if (request.method() === 'POST') return route.fulfill({ json: { signedURL: `/object/sign/meeting-materials/${filePath}?token=fixture` } });
            return route.fulfill({ body: uploadedFiles.get(filePath), headers: { 'content-type': 'application/pdf', 'content-disposition': 'attachment; filename="test-slides.pdf"' } });
        }
        const body = request.method() === 'GET' ? null : request.postDataJSON();
        let result = [];
        if (url.pathname.endsWith('/meeting_recaps')) {
            if (request.method() === 'GET') result = role === 'admin' ? meetings : meetings.filter(item => item.published);
            else if (role !== 'admin') return route.fulfill({ status: 403, json: { message: 'Admin required' } });
            else {
                const id = url.searchParams.get('id')?.replace('eq.', '') || 'example-recap';
                const saved = { ...body, id };
                meetings = [saved, ...meetings.filter(item => item.id !== id)];
                result = [saved];
            }
        } else if (url.pathname.endsWith('/alumni_profiles')) {
            const id = url.searchParams.get('user_id')?.replace('eq.', '');
            result = [profile, adminProfile].filter(item => !id || item.user_id === id);
        } else if (url.pathname.endsWith('/alumni_affiliation_reviews')) result = reviews;
        else if (url.pathname.endsWith('/rpc/request_affiliation_review')) {
            reviews = [{ user_id: memberId, affiliation: body.requested_affiliation, status: 'pending' }];
            result = null;
        } else if (url.pathname.endsWith('/rpc/review_alumni_affiliation')) {
            if (role !== 'admin') return route.fulfill({ status: 403, json: { message: 'Admin required' } });
            reviews = reviews.map(item => item.user_id === body.target_user_id ? { ...item, status: body.decision } : item);
            result = null;
        }
        return route.fulfill({ json: result });
    });
    await page.goto(base + '/announcements', { waitUntil: 'domcontentloaded' });
    return { page, context };
}

(async () => {
    execFileSync('npm', ['run', 'build'], { stdio: 'inherit', env: {
        ...process.env, BUILD_PATH: output, REACT_APP_SUPABASE_URL: 'https://community.example.test',
        REACT_APP_SUPABASE_ANON_KEY: 'test-placeholder', REACT_APP_ALUMNI_ADMIN_EMAILS: 'preview-admin@example.test'
    } });
    const server = await startBuildServer(output);
    const browser = await chromium.launch();
    try {
        const member = await setupPage(browser, server.url, 'member');
        await member.page.getByText('No meeting recaps published yet.').waitFor();
        assert.equal(await member.page.getByRole('button', { name: 'Add recap', exact: true }).count(), 0);
        await member.page.goto(server.url + '/alumni');
        await member.page.getByRole('button', { name: 'Directory', exact: true }).click();
        const memberRow = member.page.locator('.alumni-profile-row').filter({ hasText: 'Example Member' });
        assert.equal(await memberRow.locator('.affiliation-badge').count(), 0, 'Editable profile claims must not create badges');
        await memberRow.getByRole('button', { name: 'View', exact: true }).click();
        await member.page.getByLabel('Affiliation to review').selectOption('ujlp-current');
        await member.page.getByRole('button', { name: 'Request review', exact: true }).click();
        await member.page.getByRole('button', { name: 'Review pending', exact: true }).waitFor();
        assert.equal(await member.page.getByRole('button', { name: 'Confirm affiliation' }).count(), 0);
        await member.context.close();

        const admin = await setupPage(browser, server.url, 'admin');
        await admin.page.getByRole('button', { name: 'Add recap', exact: true }).click();
        await admin.page.locator('.meeting-editor').getByLabel('Title', { exact: true }).fill('Example workshop — browser test');
        await admin.page.locator('.meeting-editor').getByLabel('Date', { exact: true }).fill('2026-10-20');
        await admin.page.locator('.meeting-editor').getByLabel('Summary', { exact: true }).fill('Synthetic test content; never published to the real backend.');
        await admin.page.locator('.meeting-editor').getByLabel('Meeting notes', { exact: true }).fill('Example notes for testing.');
        await admin.page.locator('.meeting-editor').getByLabel('Follow-up questions', { exact: true }).fill('What should the next workshop cover?');
        await admin.page.locator('.meeting-editor').getByLabel('Slides URL').fill('https://example.com/slides');
        await admin.page.getByRole('button', { name: 'Add resource', exact: true }).click();
        await admin.page.locator('.meeting-editor').getByLabel('Resource title').fill('Example reading');
        await admin.page.locator('.meeting-editor').getByLabel('Resource URL').fill('https://example.com/reading');
        await admin.page.getByRole('button', { name: 'Save draft & enable uploads', exact: true }).click();
        await admin.page.getByLabel('Choose a file').waitFor();
        await admin.page.getByLabel('Choose a file').setInputFiles({ name: 'test-slides.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\nSynthetic test fixture') });
        await admin.page.getByText('File uploaded privately.', { exact: false }).waitFor();
        await admin.page.getByRole('button', { name: 'Save recap', exact: true }).click();
        await admin.page.getByText('Draft · admin only').waitFor();
        const visitor = await setupPage(browser, server.url, 'public');
        await visitor.page.getByText('No meeting recaps published yet.').waitFor();
        await admin.page.getByRole('button', { name: 'Edit recap', exact: true }).click();
        await admin.page.locator('.meeting-editor').getByLabel('Publish on the public archive').check();
        await admin.page.getByRole('button', { name: 'Save recap', exact: true }).click();
        await admin.page.locator('.meeting-editor').waitFor({ state: 'hidden' });
        await visitor.page.reload();
        await visitor.page.getByRole('heading', { name: 'Example workshop — browser test' }).waitFor();
        await visitor.page.getByText('Notes, resources & follow-up', { exact: true }).click();
        await visitor.page.getByText('Example notes for testing.').waitFor();
        const downloadEvent = visitor.page.waitForEvent('download');
        await visitor.page.getByRole('button', { name: 'Download slides: test-slides.pdf', exact: true }).click();
        const attachment = await downloadEvent;
        assert.equal(attachment.suggestedFilename(), 'test-slides.pdf');
        assert.equal(await attachment.failure(), null);

        assert.equal(await visitor.page.getByRole('link', { name: 'Example reading' }).getAttribute('href'), 'https://example.com/reading');
        await visitor.page.getByLabel('Search recaps').fill('does not exist');
        await visitor.page.getByText('No matching recaps.').waitFor();
        await visitor.page.getByLabel('Search recaps').fill('');
        for (const width of [320, 390, 768]) {
            await visitor.page.setViewportSize({ width, height: 844 });
            assert(await visitor.page.locator('.meetings-page').evaluate(el => el.scrollWidth <= el.clientWidth + 1 && el.getBoundingClientRect().right <= window.innerWidth + 1));
        }
        await visitor.context.close();
        await admin.page.goto(server.url + '/alumni');
        await admin.page.getByRole('button', { name: 'Directory', exact: true }).click();
        await admin.page.getByLabel('Affiliation review', { exact: true }).selectOption('pending');
        const pendingRow = admin.page.locator('.alumni-profile-row').filter({ hasText: 'Example Member' });
        await pendingRow.getByRole('button', { name: 'View', exact: true }).click();
        await admin.page.getByRole('button', { name: 'Confirm affiliation', exact: true }).click();
        await admin.page.locator('.alumni-profile-view .affiliation-badge').waitFor();
        await admin.page.getByRole('button', { name: 'Revoke verification', exact: true }).click();
        await admin.page.locator('.alumni-profile-view .affiliation-badge').waitFor({ state: 'hidden' });
        await admin.context.close();
        console.log('PASS: member request, no self-approval, admin confirmation/revocation, draft privacy, direct file uploads/downloads, recap publishing, resources, search, mobile layout. All backend requests used isolated fixtures.');
    } finally { await browser.close(); await server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
