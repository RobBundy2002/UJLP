import { alumniDemoProfiles } from '../Data/alumniDemoData';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
const ALUMNI_ADMIN_EMAILS = (process.env.REACT_APP_ALUMNI_ADMIN_EMAILS || '')
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);
const PREVIEW_PROFILE_INVITE_CODE = (process.env.REACT_APP_ALUMNI_PREVIEW_INVITE_CODE || 'FREESPEECH').trim();
const SESSION_KEY = 'ujlp_alumni_session';
const PREVIEW_ACCOUNTS_KEY = 'ujlp_alumni_preview_accounts';
const PREVIEW_PROFILES_KEY = 'ujlp_alumni_preview_profiles';
export const ALUMNI_SESSION_EVENT = 'ujlp-alumni-session-change';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const getAlumniBackendMode = () => (isSupabaseConfigured ? 'supabase' : 'preview');
export const isAlumniAdmin = (session) => Boolean(
    session?.user?.email && ALUMNI_ADMIN_EMAILS.includes(session.user.email.toLowerCase())
);
export const isAlumniProfileInviteCodeValid = (inviteCode) => Boolean(
    PREVIEW_PROFILE_INVITE_CODE && inviteCode.trim() === PREVIEW_PROFILE_INVITE_CODE
);
export const isAlumniProfileInviteConfigured = Boolean(PREVIEW_PROFILE_INVITE_CODE);

const readJson = (key, fallback) => {
    try {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
};

const writeJson = (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
};

const notifyAlumniSessionChange = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(ALUMNI_SESSION_EVENT));
    }
};

const createId = () => {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normalizeJobs = (jobs) => {
    if (!Array.isArray(jobs)) return [];
    return jobs.map(job => ({
        employer: job?.employer || '',
        industry: job?.industry || '',
        title: job?.title || '',
        sector: job?.sector || ''
    }));
};

const normalizeProfile = (profile) => ({
    id: profile.id || createId(),
    userId: profile.userId || profile.user_id || '',
    profileType: profile.profileType || profile.profile_type || '',
    fullName: profile.fullName || profile.full_name || '',
    photoKey: profile.photoKey || profile.photo_key || 'blank',
    status: profile.status || 'alumni',
    classYear: profile.classYear || profile.class_year || '',
    ujlpRole: profile.ujlpRole || profile.ujlp_role || '',
    currentTitle: profile.currentTitle || profile.current_title || '',
    currentOrg: profile.currentOrg || profile.current_org || '',
    location: profile.location || '',
    industry: profile.industry || '',
    pathType: profile.pathType || profile.path_type || 'other',
    lawSchool: profile.lawSchool || profile.law_school || '',
    gradSchool: profile.gradSchool || profile.grad_school || '',
    undergraduateSchool: profile.undergraduateSchool || profile.undergraduate_school || '',
    undergradMajor: profile.undergradMajor || profile.undergrad_major || '',
    degreeTitle: profile.degreeTitle || profile.degree_title || '',
    email: profile.email || profile.preferred_email || '',
    linkedinUrl: profile.linkedinUrl || profile.linkedin_url || '',
    affiliatedWithUjlp: Boolean(profile.affiliatedWithUjlp ?? profile.affiliated_with_ujlp),
    jobs: normalizeJobs(profile.jobs),
    willingToChat: Boolean(profile.willingToChat ?? profile.willing_to_chat),
    interests: Array.isArray(profile.interests) ? profile.interests : [],
    bio: profile.bio || '',
    directoryVisible: profile.directoryVisible ?? profile.directory_visible ?? true,
    isExample: Boolean(profile.isExample || profile.is_example),
    updatedAt: profile.updatedAt || profile.updated_at || new Date().toISOString()
});

const toDatabaseProfile = (profile, session) => ({
    user_id: profile.userId || profile.user_id || session.user.id,
    profile_type: profile.profileType || '',
    full_name: profile.fullName,
    photo_key: profile.photoKey || 'blank',
    status: profile.status,
    class_year: profile.classYear,
    ujlp_role: profile.ujlpRole,
    current_title: profile.currentTitle,
    current_org: profile.currentOrg,
    location: profile.location,
    industry: profile.industry,
    path_type: profile.pathType,
    law_school: profile.lawSchool,
    grad_school: profile.gradSchool,
    undergraduate_school: profile.undergraduateSchool,
    undergrad_major: profile.undergradMajor,
    degree_title: profile.degreeTitle,
    preferred_email: profile.email,
    linkedin_url: profile.linkedinUrl,
    affiliated_with_ujlp: Boolean(profile.affiliatedWithUjlp),
    jobs: normalizeJobs(profile.jobs),
    willing_to_chat: profile.willingToChat,
    interests: profile.interests,
    bio: profile.bio,
    directory_visible: profile.directoryVisible,
    updated_at: new Date().toISOString()
});

const supabaseHeaders = (session) => ({
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${session?.access_token || SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
});

const supabaseRequest = async (path, options = {}, session = null) => {
    const response = await fetch(`${SUPABASE_URL}${path}`, {
        ...options,
        headers: {
            ...supabaseHeaders(session),
            ...(options.headers || {})
        }
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;

    if (!response.ok) {
        throw new Error(payload?.msg || payload?.message || 'The alumni service returned an error.');
    }

    return payload;
};

export const getStoredAlumniSession = () => {
    if (typeof window === 'undefined') return null;
    const session = readJson(SESSION_KEY, null);
    if (!session?.user?.email) return null;
    return session;
};

export const clearStoredAlumniSession = () => {
    window.localStorage.removeItem(SESSION_KEY);
    notifyAlumniSessionChange();
};

export const signInAlumni = async ({ email, password }) => {
    if (isSupabaseConfigured) {
        const session = await supabaseRequest('/auth/v1/token?grant_type=password', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        writeJson(SESSION_KEY, session);
        notifyAlumniSessionChange();
        return { session };
    }

    const accounts = readJson(PREVIEW_ACCOUNTS_KEY, []);
    const account = accounts.find(item => item.email.toLowerCase() === email.toLowerCase());
    if (!account || account.password !== password) {
        throw new Error('No preview account matches that email and password.');
    }

    const session = {
        access_token: 'preview-token',
        user: { id: account.id, email: account.email }
    };
    writeJson(SESSION_KEY, session);
    notifyAlumniSessionChange();
    return { session };
};

export const signUpAlumni = async ({ email, password }) => {
    if (isSupabaseConfigured) {
        const payload = await supabaseRequest('/auth/v1/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (payload.session) {
            writeJson(SESSION_KEY, payload.session);
            notifyAlumniSessionChange();
            return { session: payload.session };
        }

        return { session: null, needsEmailConfirmation: true };
    }

    const accounts = readJson(PREVIEW_ACCOUNTS_KEY, []);
    if (accounts.some(item => item.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('That preview account already exists.');
    }

    const account = { id: createId(), email, password };
    writeJson(PREVIEW_ACCOUNTS_KEY, [...accounts, account]);

    const session = {
        access_token: 'preview-token',
        user: { id: account.id, email: account.email }
    };
    writeJson(SESSION_KEY, session);
    notifyAlumniSessionChange();
    return { session };
};

export const signOutAlumni = async (session) => {
    if (isSupabaseConfigured && session?.access_token) {
        try {
            await supabaseRequest('/auth/v1/logout', { method: 'POST' }, session);
        } catch {
            // Local session cleanup should still happen even if the remote logout call fails.
        }
    }
    clearStoredAlumniSession();
};

export const fetchAlumniProfiles = async (session) => {
    if (isSupabaseConfigured) {
        const path = isAlumniAdmin(session)
            ? '/rest/v1/alumni_profiles?select=*&order=updated_at.desc'
            : `/rest/v1/alumni_profiles?select=*&or=(directory_visible.eq.true,user_id.eq.${session.user.id})&order=updated_at.desc`;
        const rows = await supabaseRequest(
            path,
            { method: 'GET' },
            session
        );
        return rows.map(normalizeProfile);
    }

    const localProfiles = readJson(PREVIEW_PROFILES_KEY, []);
    const localIds = new Set(localProfiles.map(profile => profile.id));
    return [
        ...localProfiles.map(normalizeProfile),
        ...alumniDemoProfiles.filter(profile => !localIds.has(profile.id)).map(normalizeProfile)
    ];
};

export const saveAlumniProfile = async (profile, session) => {
    if (!session?.user?.id) {
        throw new Error('You need to be signed in to save a profile.');
    }

    const targetUserId = profile.userId || profile.user_id || session.user.id;
    const editingAnotherMember = targetUserId !== session.user.id;
    if (editingAnotherMember && !isAlumniAdmin(session)) {
        throw new Error('You do not have permission to edit that profile.');
    }

    if (isSupabaseConfigured) {
        if (profile.isNewProfile && !editingAnotherMember && !isAlumniAdmin(session)) {
            const row = await supabaseRequest('/rest/v1/rpc/create_alumni_profile', {
                method: 'POST',
                body: JSON.stringify({
                    invite_code: profile.inviteCode || '',
                    profile_data: toDatabaseProfile(profile, session)
                })
            }, session);
            return normalizeProfile(row);
        }

        const rows = await supabaseRequest(`/rest/v1/alumni_profiles?user_id=eq.${encodeURIComponent(targetUserId)}&select=*`, {
            method: 'PATCH',
            headers: {
                Prefer: 'return=representation'
            },
            body: JSON.stringify(toDatabaseProfile(profile, session))
        }, session);

        const savedRow = Array.isArray(rows) ? rows[0] : rows;
        if (!savedRow) {
            throw new Error('No existing profile was found to update. Create the profile with the invite code first.');
        }

        return normalizeProfile(savedRow);
    }

    if (profile.isNewProfile && isAlumniProfileInviteConfigured && !isAlumniProfileInviteCodeValid(profile.inviteCode || '')) {
        throw new Error('That invite code is not valid.');
    }

    const profiles = readJson(PREVIEW_PROFILES_KEY, []);
    const saved = normalizeProfile({
        ...profile,
        isNewProfile: false,
        id: profile.id || `profile-${targetUserId}`,
        userId: targetUserId,
        email: profile.email || session.user.email,
        updatedAt: new Date().toISOString()
    });
    const withoutExisting = profiles.filter(item => item.userId !== targetUserId && item.id !== saved.id);
    writeJson(PREVIEW_PROFILES_KEY, [saved, ...withoutExisting]);
    return saved;
};

export const createBlankAlumniProfile = (session) => normalizeProfile({
    id: session?.user?.id ? `profile-${session.user.id}` : createId(),
    userId: session?.user?.id || '',
    fullName: '',
    photoKey: 'blank',
    status: 'alumni',
    classYear: '',
    ujlpRole: '',
    currentTitle: '',
    currentOrg: '',
    location: '',
    industry: '',
    pathType: 'other',
    lawSchool: '',
    gradSchool: '',
    undergraduateSchool: '',
    undergradMajor: '',
    degreeTitle: '',
    email: session?.user?.email || '',
    linkedinUrl: '',
    profileType: '',
    affiliatedWithUjlp: false,
    jobs: [],
    willingToChat: true,
    interests: [],
    bio: '',
    directoryVisible: true
});
