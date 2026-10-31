process.env.REACT_APP_SUPABASE_URL = 'https://community.example.test';
const { fetchMeetingRecaps, getMeetingFileUrl, requestAffiliationReview, reviewAffiliation, safeResourceUrl, saveMeetingRecap, uploadMeetingFile } = require('./communityApi');

jest.mock('./alumniApi', () => ({
    isSupabaseConfigured: true,
    isAlumniAdmin: session => Boolean(session?.admin)
}));

const admin = { admin: true, access_token: 'test-admin' };
const member = { access_token: 'test-member' };
const recap = { title: 'Workshop recap', meeting_date: '2026-10-20', kind: 'Workshop', summary: 'Research notes', notes: '', open_questions: '', recording_url: '', slides_url: '', resources: [], published: false };

beforeEach(() => { global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => '[]' }); });
afterEach(() => jest.restoreAllMocks());

test('public archive requests only published recaps; admins may fetch drafts', async () => {
    await fetchMeetingRecaps(null);
    expect(fetch.mock.calls[0][0]).toContain('published=eq.true');
    await fetchMeetingRecaps(admin);
    expect(fetch.mock.calls[1][0]).not.toContain('published=eq.true');
});

test('resource links reject script, data, HTTP, and malformed URLs', () => {
    for (const value of ['javascript:alert(1)', 'data:text/html,test', 'http://example.com', '/private', 'not a url']) {
        expect(safeResourceUrl(value)).toBeNull();
    }
    expect(safeResourceUrl('https://example.com/notes')).toBe('https://example.com/notes');
});

test('recap publishing is checked and invalid resource URLs are blocked', async () => {
    await expect(saveMeetingRecap(recap, member)).rejects.toThrow('Only administrators');
    await expect(saveMeetingRecap({ ...recap, slides_url: 'javascript:alert(1)' }, admin)).rejects.toThrow('HTTPS');
    expect(fetch).not.toHaveBeenCalled();
});

test('verification uses dedicated checked RPCs rather than editable profile fields', async () => {
    await requestAffiliationReview('ujlp-current', member);
    expect(fetch.mock.calls[0][0]).toContain('rpc/request_affiliation_review');
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ requested_affiliation: 'ujlp-current' });
    await expect(reviewAffiliation('member-id', 'verified', member)).rejects.toThrow('Administrator');
    expect(fetch).toHaveBeenCalledTimes(1);
    await reviewAffiliation('member-id', 'verified', admin);
    expect(fetch.mock.calls[1][0]).toContain('rpc/review_alumni_affiliation');
});

test('empty RPC responses are supported and backend errors remain errors', async () => {
    fetch.mockResolvedValueOnce({ ok: true, text: async () => '' });
    await expect(requestAffiliationReview('uva-law', member)).resolves.toBeNull();
    fetch.mockResolvedValueOnce({ ok: false, text: async () => '{"message":"Administrator access is required."}' });
    await expect(reviewAffiliation('member-id', 'verified', admin)).rejects.toThrow('Administrator access');
});

test('only admins upload accepted, nonempty files within the size limit', async () => {
    Object.defineProperty(global, 'crypto', { configurable: true, value: { randomUUID: () => 'test-file-id' } });
    const file = new File(['example'], 'slides.pdf', { type: 'application/pdf' });
    await expect(uploadMeetingFile('recap-id', file, 'slides', member)).rejects.toThrow('Only administrators');
    await expect(uploadMeetingFile('', file, 'slides', admin)).rejects.toThrow('Save a draft');
    await expect(uploadMeetingFile('recap-id', { name: 'bad.html', size: 10 }, 'slides', admin)).rejects.toThrow('Choose a PDF');
    await expect(uploadMeetingFile('recap-id', { name: 'large.pdf', size: 52428801 }, 'slides', admin)).rejects.toThrow('50 MiB');
    expect(fetch).not.toHaveBeenCalled();
    const asset = await uploadMeetingFile('recap-id', file, 'slides', admin);
    expect(asset.path).toBe('recap-id/test-file-id-slides.pdf');
    expect(fetch.mock.calls[0][0]).toContain('/storage/v1/object/meeting-materials/');
    expect(fetch.mock.calls[0][1].body).toBe(file);
    expect(fetch.mock.calls[0][1].headers['x-upsert']).toBe('false');
});

test('private files get short-lived download links only when the server permits', async () => {
    fetch.mockResolvedValueOnce({ ok: true, text: async () => '{"signedURL":"/object/sign/meeting-materials/id/slides.pdf?token=test"}' });
    const url = await getMeetingFileUrl({ path: 'id/slides.pdf', name: 'slides.pdf' }, null);
    expect(url).toBe('https://community.example.test/storage/v1/object/sign/meeting-materials/id/slides.pdf?token=test&download=slides.pdf');
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ expiresIn: 300 });
    fetch.mockResolvedValueOnce({ ok: false, text: async () => '{"message":"Access denied"}' });
    await expect(getMeetingFileUrl({ path: 'id/private.pdf', name: 'private.pdf' }, null)).rejects.toThrow('Access denied');
});
