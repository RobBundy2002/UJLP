import { isAlumniAdmin, isSupabaseConfigured } from './alumniApi';

const baseUrl = process.env.REACT_APP_SUPABASE_URL;
const apiKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const previewMeetingsKey = 'ujlp_meeting_recaps_preview';

async function request(path, session, options = {}) {
    const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
        ...options,
        headers: {
            apikey: apiKey,
            Authorization: `Bearer ${session?.access_token || apiKey}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;
    if (!response.ok) throw new Error(payload?.message || 'The community service is unavailable.');
    return payload;
}

export function safeResourceUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' ? url.href : null;
    } catch {
        return null;
    }
}

export async function fetchMeetingRecaps(session) {
    if (!isSupabaseConfigured) {
        try { return JSON.parse(localStorage.getItem(previewMeetingsKey) || '[]'); }
        catch { return []; }
    }
    const filter = isAlumniAdmin(session) ? '' : '&published=eq.true';
    return request(`meeting_recaps?select=*&order=meeting_date.desc${filter}`, session);
}

export async function saveMeetingRecap(recap, session) {
    if (!isAlumniAdmin(session)) throw new Error('Only administrators can publish meeting recaps.');
    if (!recap.title.trim() || !recap.meeting_date || !recap.summary.trim()) {
        throw new Error('Add a title, date, and summary.');
    }
    const urls = [recap.recording_url, recap.slides_url, ...recap.resources.map(resource => resource.url)].filter(Boolean);
    if (urls.some(url => !safeResourceUrl(url))) throw new Error('Resource links must use a valid HTTPS address.');
    const data = {
        title: recap.title.trim(), meeting_date: recap.meeting_date, kind: recap.kind,
        summary: recap.summary.trim(), notes: recap.notes.trim(),
        open_questions: recap.open_questions.trim(), recording_url: recap.recording_url.trim(),
        slides_url: recap.slides_url.trim(), resources: recap.resources,
        published: Boolean(recap.published), uploaded_files: recap.uploaded_files || []
    };
    if (!isSupabaseConfigured) {
        const rows = await fetchMeetingRecaps(session);
        const saved = { ...data, id: recap.id || crypto.randomUUID() };
        localStorage.setItem(previewMeetingsKey, JSON.stringify([saved, ...rows.filter(row => row.id !== saved.id)]));
        return saved;
    }
    const rows = await request(`meeting_recaps${recap.id ? `?id=eq.${encodeURIComponent(recap.id)}` : ''}`, session, {
        method: recap.id ? 'PATCH' : 'POST',
        headers: { Prefer: 'return=representation' }, body: JSON.stringify(data)
    });
    return rows[0];
}

export const affiliationOptions = [
    { value: 'ujlp-current', label: 'Current UJLP member' },
    { value: 'ujlp-alumni', label: 'Former UJLP member' },
    { value: 'uva-law', label: 'UVA Law student' },
    { value: 'community', label: 'Community participant' }
];

export async function fetchAffiliationReviews(session) {
    if (!session?.access_token || !isSupabaseConfigured) return [];
    return request('alumni_affiliation_reviews?select=user_id,affiliation,status,requested_at,reviewed_at', session);
}

export async function requestAffiliationReview(affiliation, session) {
    if (!isSupabaseConfigured) throw new Error('Affiliation verification requires the server. Preview profiles cannot be verified.');
    if (!affiliationOptions.some(option => option.value === affiliation)) throw new Error('Choose an affiliation.');
    return request('rpc/request_affiliation_review', session, { method: 'POST', body: JSON.stringify({ requested_affiliation: affiliation }) });
}

export async function reviewAffiliation(userId, decision, session) {
    if (!isSupabaseConfigured || !isAlumniAdmin(session)) throw new Error('Administrator access is required.');
    return request('rpc/review_alumni_affiliation', session, { method: 'POST', body: JSON.stringify({ target_user_id: userId, decision }) });
}

export const meetingUploadTypes = {
    pdf: 'application/pdf',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain', mp4: 'video/mp4', webm: 'video/webm', mp3: 'audio/mpeg', wav: 'audio/wav'
};
export const maxMeetingUploadBytes = 50 * 1024 * 1024;
const storageBucket = 'meeting-materials';
const encodeStoragePath = path => path.split('/').map(encodeURIComponent).join('/');

async function storageRequest(path, session, options) {
    if (!isSupabaseConfigured) throw new Error('File uploads require the server storage setup.');
    const response = await fetch(`${baseUrl}/storage/v1/${path}`, {
        ...options,
        headers: { apikey: apiKey, Authorization: `Bearer ${session?.access_token || apiKey}`, ...options.headers }
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;
    if (!response.ok) throw new Error(payload?.message || payload?.error || 'The file request failed.');
    return payload;
}

export async function uploadMeetingFile(recapId, file, kind, session) {
    if (!isAlumniAdmin(session)) throw new Error('Only administrators can upload meeting materials.');
    if (!recapId) throw new Error('Save a draft before uploading files.');
    if (!['recording', 'slides', 'resource'].includes(kind)) throw new Error('Choose a file category.');
    const extension = file.name.split('.').pop().toLowerCase();
    const contentType = meetingUploadTypes[extension];
    if (!contentType) throw new Error('Choose a PDF, presentation, document, text, MP4, WebM, MP3, or WAV file.');
    if (!file.size || file.size > maxMeetingUploadBytes) throw new Error('Files must be nonempty and no larger than 50 MiB. Use a recording link for larger videos.');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100);
    const path = `${recapId}/${crypto.randomUUID()}-${safeName}`;
    await storageRequest(`object/${storageBucket}/${encodeStoragePath(path)}`, session, {
        method: 'POST', headers: { 'Content-Type': contentType, 'x-upsert': 'false' }, body: file
    });
    return { name: file.name, path, kind, size: file.size };
}

export async function getMeetingFileUrl(file, session) {
    const result = await storageRequest(`object/sign/${storageBucket}/${encodeStoragePath(file.path)}`, session, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expiresIn: 300 })
    });
    const signed = result?.signedURL || result?.signedUrl;
    if (!signed) throw new Error('A download link could not be created.');
    const storagePath = signed.startsWith('/storage/v1/') ? signed : `/storage/v1/${signed.replace(/^\//, '')}`;
    const url = new URL(storagePath, baseUrl);
    if (url.origin !== new URL(baseUrl).origin || url.protocol !== 'https:') throw new Error('Invalid download address.');
    url.searchParams.set('download', file.name);
    return url.href;
}
