import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ParticleBackground from '../Components/ParticleBackground';
import { pathTypeLabels } from '../Data/alumniDemoData';
import { alumniPhotoOptions, getAlumniPhoto } from '../Data/alumniPhotoRegistry';
import {
    createBlankAlumniProfile,
    fetchAlumniProfiles,
    getAlumniBackendMode,
    getStoredAlumniSession,
    isAlumniAdmin,
    isAlumniProfileInviteCodeValid,
    isAlumniProfileInviteConfigured,
    saveAlumniProfile,
    signInAlumni,
    signOutAlumni,
    signUpAlumni
} from '../Services/alumniApi';
import { deletePortalItem, fetchPortalContent, savePortalItem } from '../Services/alumniPortalApi';
import '../Styling/AlumniDirectory.css';
import '../Styling/EditorialPages.css';

const statusLabels = {
    all: 'All members',
    current: 'Current',
    alumni: 'Alumni'
};

const defaultFilters = {
    query: '',
    status: 'all',
    pathType: 'all',
    classYear: 'all',
    willingOnly: false
};

const profileFields = [
    ['fullName', 'Full name', 'text'],
    ['classYear', 'UVA class year', 'text'],
    ['ujlpRole', 'UJLP role', 'text'],
    ['undergradMajor', 'Major or program', 'text'],
    ['currentTitle', 'Current title', 'text'],
    ['currentOrg', 'Employer or school', 'text'],
    ['industry', 'Industry', 'text'],
    ['lawSchool', 'Law school', 'text'],
    ['gradSchool', 'Graduate school', 'text'],
    ['location', 'Location', 'text'],
    ['email', 'Preferred email', 'email'],
    ['linkedinUrl', 'LinkedIn URL', 'url']
];

const normalizeText = (value) => String(value || '').toLowerCase();

const toInterestText = (interests) => (Array.isArray(interests) ? interests.join(', ') : '');

const fromInterestText = (value) => value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

const formatUpdatedDate = (value) => {
    if (!value) return 'Not saved yet';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not saved yet';
    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const getProfileName = (profile) => profile?.fullName || 'Unnamed member';

const getProfileLine = (profile) => {
    const pieces = [
        profile?.ujlpRole || 'UJLP member',
        profile?.classYear ? `Class of ${profile.classYear}` : '',
        profile?.currentOrg || profile?.lawSchool || profile?.gradSchool || ''
    ].filter(Boolean);
    return pieces.join(' / ');
};

const getPathLabel = (profile) => pathTypeLabels[profile?.pathType] || 'Other';

const portalTabs = [
    ['home', 'Home', 'M6 10.5 12 5l6 5.5v7.5a1 1 0 0 1-1 1h-3.5v-5h-3v5H7a1 1 0 0 1-1-1v-7.5Z'],
    ['feed', 'Feed', 'M5 6h14M5 12h14M5 18h9'],
    ['directory', 'Directory', 'M8 7a3 3 0 1 0 0 .1M4 19a4 4 0 0 1 8 0M17 8a2.5 2.5 0 1 0 0 .1M14 19a3.5 3.5 0 0 1 6 0'],
    ['resources', 'Resources', 'M6 5h12v14H6zM9 8h6M9 12h6M9 16h4'],
    ['tasks', 'Weekly Tasks', 'M7 7h10M7 12h10M7 17h6M4 7l1 1 2-2M4 12l1 1 2-2M4 17l1 1 2-2'],
    ['notifications', 'Notifications', 'M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16zM10 20h4']
];

const Icon = ({ path }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={path} />
    </svg>
);

const formatShortDate = (value) => {
    if (!value) return 'Date pending';
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const toTags = (value) => value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

function AlumniDirectory() {
    const location = useLocation();
    const [session, setSession] = useState(() => getStoredAlumniSession());
    const [authMode, setAuthMode] = useState('signin');
    const [authForm, setAuthForm] = useState({ email: '', password: '' });
    const [showAuthPassword, setShowAuthPassword] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [filters, setFilters] = useState(defaultFilters);
    const [activeView, setActiveView] = useState('home');
    const [profileMode, setProfileMode] = useState('view');
    const [editingProfileUserId, setEditingProfileUserId] = useState(null);
    const [profileDraft, setProfileDraft] = useState(null);
    const [profileMessage, setProfileMessage] = useState('');
    const [profileInviteCode, setProfileInviteCode] = useState('');
    const [profileInviteMessage, setProfileInviteMessage] = useState('');
    const [portalContent, setPortalContent] = useState({ feedPosts: [], announcements: [], tasks: [] });
    const [feedDraft, setFeedDraft] = useState({
        title: '',
        body: '',
        category: 'Network',
        postType: 'update',
        eventDate: '',
        deadlineDate: '',
        tagsText: ''
    });
    const [feedMessage, setFeedMessage] = useState('');
    const [editorType, setEditorType] = useState('announcements');
    const [editorMessage, setEditorMessage] = useState('');
    const [editorDraft, setEditorDraft] = useState({
        title: '',
        body: '',
        category: 'Update',
        postType: 'update',
        eventDate: '',
        deadlineDate: '',
        publishDate: '',
        role: 'Writers',
        dueDate: '',
        priority: 'medium',
        tagsText: '',
        pinned: false
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const backendMode = getAlumniBackendMode();
    const isAdmin = isAlumniAdmin(session);

    const loadProfiles = async (activeSession = session) => {
        if (!activeSession) return;
        setLoading(true);
        setAuthMessage('');
        try {
            const rows = await fetchAlumniProfiles(activeSession);
            setProfiles(rows);
        } catch (error) {
            setAuthMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            loadProfiles(session);
            fetchPortalContent(session).then(setPortalContent);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.id]);

    const ownProfile = useMemo(() => {
        if (!session?.user?.id) return null;
        return profiles.find(profile => profile.userId === session.user.id) || null;
    }, [profiles, session]);

    const activeProfile = useMemo(() => {
        if (!session?.user?.id) return null;
        const targetUserId = editingProfileUserId || session.user.id;
        if (targetUserId === session.user.id) return ownProfile;
        return profiles.find(profile => profile.userId === targetUserId) || null;
    }, [editingProfileUserId, ownProfile, profiles, session]);

    useEffect(() => {
        if (profileMode === 'edit' && activeProfile) {
            setProfileDraft({ ...activeProfile, interestsText: toInterestText(activeProfile.interests) });
        }
    }, [profileMode, activeProfile?.id, activeProfile?.userId, activeProfile?.updatedAt, activeProfile]);

    const classYears = useMemo(() => {
        const values = profiles
            .map(profile => profile.classYear)
            .filter(Boolean)
            .sort((left, right) => right.localeCompare(left));
        return ['all', ...Array.from(new Set(values))];
    }, [profiles]);

    const filteredProfiles = useMemo(() => {
        const query = normalizeText(filters.query);
        return profiles.filter(profile => {
            const searchable = [
                profile.fullName,
                profile.ujlpRole,
                profile.currentTitle,
                profile.currentOrg,
                profile.location,
                profile.industry,
                profile.lawSchool,
                profile.gradSchool,
                profile.undergradMajor,
                profile.email,
                ...(profile.interests || [])
            ].map(normalizeText).join(' ');

            const matchesQuery = !query || searchable.includes(query);
            const matchesStatus = filters.status === 'all' || profile.status === filters.status;
            const matchesPath = filters.pathType === 'all' || profile.pathType === filters.pathType;
            const matchesClass = filters.classYear === 'all' || profile.classYear === filters.classYear;
            const matchesAvailability = !filters.willingOnly || profile.willingToChat;

            return matchesQuery && matchesStatus && matchesPath && matchesClass && matchesAvailability;
        });
    }, [profiles, filters]);

    const metrics = useMemo(() => {
        const classYearCount = new Set(profiles.map(profile => profile.classYear).filter(Boolean)).size;
        const pathCount = new Set(
            profiles
                .map(profile => profile.pathType)
                .filter(pathType => pathType && pathType !== 'current-student' && pathType !== 'other')
        ).size;
        const schoolOrgCount = new Set(
            profiles
                .map(profile => profile.lawSchool || profile.gradSchool || profile.currentOrg)
                .filter(Boolean)
        ).size;
        const values = [
            ['Profiles', profiles.length],
            ['Alumni', profiles.filter(profile => profile.status === 'alumni').length],
            ['Class years', classYearCount],
            ['Paths listed', pathCount],
            ['Schools / orgs', schoolOrgCount]
        ];

        if (isAdmin) {
            values.push(['Hidden', profiles.filter(profile => !profile.directoryVisible).length]);
        }

        return values;
    }, [profiles, isAdmin]);

    const handleAuthSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setAuthMessage('');
        try {
            const action = authMode === 'signin' ? signInAlumni : signUpAlumni;
            const result = await action(authForm);
            if (result.needsEmailConfirmation) {
                setAuthMessage('Check your inbox to confirm the account before signing in.');
                return;
            }
            setSession(result.session);
            setEditingProfileUserId(result.session?.user?.id || null);
            setAuthForm({ email: '', password: '' });
        } catch (error) {
            setAuthMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOutAlumni(session);
        setSession(null);
        setProfiles([]);
        setProfileDraft(null);
        setEditingProfileUserId(null);
        setActiveView('home');
        setProfileMode('view');
        setPortalContent({ feedPosts: [], announcements: [], tasks: [] });
    };

    const updateFilter = (key, value) => {
        setFilters(current => ({ ...current, [key]: value }));
    };

    const updateDraft = (key, value) => {
        setProfileDraft(current => ({ ...current, [key]: value }));
    };

    const canEditProfile = (profile) => Boolean(
        session?.user?.id && profile?.userId && (profile.userId === session.user.id || isAdmin)
    );

    const openDirectory = () => {
        setActiveView('directory');
        setProfileMode('view');
        setProfileMessage('');
        setProfileInviteMessage('');
    };

    const openOwnProfile = (mode = 'view') => {
        setEditingProfileUserId(session?.user?.id || null);
        setActiveView('profile');
        setProfileMode(mode);
        setProfileMessage('');
        setProfileInviteMessage('');
    };

    const openProfileView = (profile) => {
        setEditingProfileUserId(profile.userId);
        setActiveView('profile');
        setProfileMode('view');
        setProfileMessage('');
        setProfileInviteMessage('');
    };

    const openProfileEditor = (profile) => {
        if (!canEditProfile(profile)) return;
        setEditingProfileUserId(profile.userId);
        setProfileDraft({ ...profile, interestsText: toInterestText(profile.interests) });
        setActiveView('profile');
        setProfileMode('edit');
        setProfileMessage('');
        setProfileInviteMessage('');
    };

    useEffect(() => {
        if (!session?.user?.id) return;
        const params = new URLSearchParams(location.search);
        if (params.get('profile') !== 'edit') return;

        setEditingProfileUserId(session.user.id);
        setActiveView('profile');
        setProfileMode(ownProfile ? 'edit' : 'view');
        setProfileMessage('');
        setProfileInviteMessage('');
    }, [location.search, ownProfile, session?.user?.id]);

    const handleCreateProfileRequest = (event) => {
        event.preventDefault();
        setProfileInviteMessage('');

        if (!profileInviteCode.trim()) {
            setProfileInviteMessage('Enter the alumni invite code to create a profile.');
            return;
        }

        if (backendMode === 'preview' && isAlumniProfileInviteConfigured && !isAlumniProfileInviteCodeValid(profileInviteCode)) {
            setProfileInviteMessage('That invite code is not valid.');
            return;
        }

        const draft = createBlankAlumniProfile(session);
        setProfileDraft({
            ...draft,
            inviteCode: profileInviteCode.trim(),
            interestsText: '',
            isNewProfile: true
        });
        setEditingProfileUserId(session.user.id);
        setProfileMode('edit');
        setProfileInviteCode('');
    };

    const handleProfileSave = async (event) => {
        event.preventDefault();
        if (!profileDraft) return;

        setSaving(true);
        setProfileMessage('');
        try {
            const saved = await saveAlumniProfile({
                ...profileDraft,
                interests: fromInterestText(profileDraft.interestsText || '')
            }, session);
            setProfiles(current => [saved, ...current.filter(profile => profile.id !== saved.id && profile.userId !== saved.userId)]);
            setEditingProfileUserId(saved.userId);
            setProfileDraft({ ...saved, interestsText: toInterestText(saved.interests) });
            setProfileMode('view');
            setProfileMessage('Profile saved.');
        } catch (error) {
            setProfileMessage(error.message);
        } finally {
            setSaving(false);
        }
    };

    const resetEditorDraft = () => {
        setEditorDraft({
            title: '',
            body: '',
            category: 'Update',
            postType: 'update',
            eventDate: '',
            deadlineDate: '',
            publishDate: '',
            role: 'Writers',
            dueDate: '',
            priority: 'medium',
            tagsText: '',
            pinned: false
        });
    };

    const handleEditorSave = async (event) => {
        event.preventDefault();
        if (!isAdmin) return;

        setEditorMessage('');
        try {
            const baseItem = {
                title: editorDraft.title,
                body: editorDraft.body,
                category: editorDraft.category,
                pinned: editorDraft.pinned
            };
            const itemByType = {
                announcements: {
                    ...baseItem,
                    tags: toTags(editorDraft.tagsText),
                    publishDate: editorDraft.publishDate,
                    audience: 'public',
                    taggedUserIds: []
                },
                tasks: {
                    title: editorDraft.title,
                    details: editorDraft.body,
                    role: editorDraft.role,
                    dueDate: editorDraft.dueDate,
                    priority: editorDraft.priority,
                    status: 'open'
                }
            };
            const saved = await savePortalItem(editorType, itemByType[editorType], session);
            setPortalContent(current => ({
                ...current,
                [editorType]: [saved, ...current[editorType].filter(item => item.id !== saved.id)]
            }));
            setEditorMessage('Saved.');
            resetEditorDraft();
        } catch (error) {
            setEditorMessage(error.message);
        }
    };

    const handleEditorDelete = async (collection, id) => {
        if (!isAdmin) return;
        setEditorMessage('');
        try {
            await deletePortalItem(collection, id, session);
            setPortalContent(current => ({
                ...current,
                [collection]: current[collection].filter(item => item.id !== id)
            }));
            setEditorMessage('Deleted.');
        } catch (error) {
            setEditorMessage(error.message);
        }
    };

    const handleFeedSave = async (event) => {
        event.preventDefault();
        if (!session) return;

        setFeedMessage('');
        try {
            const saved = await savePortalItem('feedPosts', {
                title: feedDraft.title,
                body: feedDraft.body,
                category: feedDraft.category,
                postType: feedDraft.postType,
                eventDate: feedDraft.eventDate,
                deadlineDate: feedDraft.deadlineDate,
                authorUserId: session.user.id,
                authorName: ownProfile?.fullName || session.user.email,
                authorPhotoKey: ownProfile?.photoKey || 'blank',
                pinned: false,
                tags: toTags(feedDraft.tagsText)
            }, session);
            setPortalContent(current => ({
                ...current,
                feedPosts: [saved, ...current.feedPosts.filter(item => item.id !== saved.id)]
            }));
            setFeedDraft({
                title: '',
                body: '',
                category: 'Network',
                postType: 'update',
                eventDate: '',
                deadlineDate: '',
                tagsText: ''
            });
            setFeedMessage('Posted to the alumni feed.');
        } catch (error) {
            setFeedMessage(error.message);
        }
    };

    const renderAuthPanel = () => (
        <section className="alumni-auth-section">
            <div className="section-content alumni-auth-layout">
                <div className="alumni-auth-copy">
                    <p className="jh-section-label">Member access</p>
                    <h2>Private member network</h2>
                    <div className="alumni-lock-list">
                        <span>Verified accounts</span>
                        <span>Member profiles</span>
                        <span>Career paths</span>
                        <span>Contact preferences</span>
                    </div>
                </div>
                <form className="alumni-auth-panel" onSubmit={handleAuthSubmit}>
                    <div className="alumni-auth-tabs" aria-label="Authentication mode">
                        <button type="button" className={authMode === 'signin' ? 'active' : ''} onClick={() => setAuthMode('signin')}>Sign in</button>
                        <button type="button" className={authMode === 'signup' ? 'active' : ''} onClick={() => setAuthMode('signup')}>Create account</button>
                    </div>
                    <label>
                        <span>Email</span>
                        <input
                            type="email"
                            value={authForm.email}
                            onChange={(event) => setAuthForm(current => ({ ...current, email: event.target.value }))}
                            required
                        />
                    </label>
                    <label>
                        <span>Password</span>
                        <div className="alumni-password-field">
                            <input
                                type={showAuthPassword ? 'text' : 'password'}
                                value={authForm.password}
                                onChange={(event) => setAuthForm(current => ({ ...current, password: event.target.value }))}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowAuthPassword(current => !current)}
                                aria-label={showAuthPassword ? 'Hide password' : 'Show password'}
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    {showAuthPassword ? (
                                        <path d="M4 4l16 16M10.6 10.6a2 2 0 0 0 2.8 2.8M8.3 5.9A10.7 10.7 0 0 1 12 5c5 0 8.5 4.5 9.5 7a13.3 13.3 0 0 1-3 4.2M6.1 7.8A13.2 13.2 0 0 0 2.5 12c1 2.5 4.5 7 9.5 7 1.4 0 2.7-.35 3.8-.95" />
                                    ) : (
                                        <path d="M2.5 12c1-2.5 4.5-7 9.5-7s8.5 4.5 9.5 7c-1 2.5-4.5 7-9.5 7S3.5 14.5 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </label>
                    <button type="submit" className="alumni-primary-action" disabled={loading}>
                        {loading ? 'Working...' : authMode === 'signin' ? 'Sign in' : 'Create account'}
                    </button>
                    {backendMode === 'preview' && (
                        <p className="alumni-system-note">Preview mode is local to this browser. Supabase env vars switch this to real Postgres/Auth.</p>
                    )}
                    {authMessage && <p className="alumni-form-message">{authMessage}</p>}
                </form>
            </div>
        </section>
    );

    const renderDashboard = () => (
        <section className="alumni-dashboard">
            <div className="section-content">
                <div className="alumni-metrics" aria-label="Directory summary">
                    {metrics.map(([label, value]) => (
                        <div key={label}><strong>{value}</strong><span>{label}</span></div>
                    ))}
                </div>
            </div>
        </section>
    );

    const renderProfileCard = (profile) => (
        <article className="alumni-profile-row" key={profile.userId || profile.id}>
            <div className="alumni-profile-photo" aria-hidden="true">
                <img src={getAlumniPhoto(profile.photoKey)} alt="" />
            </div>
            <div className="alumni-profile-main">
                <div className="alumni-profile-title">
                    <span>{profile.status === 'current' ? 'Current member' : 'Alumni'}</span>
                    <span>{getPathLabel(profile)}</span>
                    {profile.isExample && <b>Preview</b>}
                    {!profile.directoryVisible && <b>Hidden</b>}
                </div>
                <h3>{getProfileName(profile)}</h3>
                <p>{getProfileLine(profile) || 'Profile details pending'}</p>
            </div>
            <div className="alumni-profile-details">
                <div><span>Employer / school</span><strong>{profile.currentOrg || profile.lawSchool || profile.gradSchool || 'Not provided'}</strong></div>
                <div><span>Role</span><strong>{profile.currentTitle || profile.industry || 'Not provided'}</strong></div>
                <div><span>Location</span><strong>{profile.location || 'Not provided'}</strong></div>
                <div><span>Updated</span><strong>{formatUpdatedDate(profile.updatedAt)}</strong></div>
            </div>
            <div className="alumni-profile-footer">
                <div className="alumni-tags">
                    {(profile.interests || []).slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}
                    {(!profile.interests || profile.interests.length === 0) && <span>No interests listed</span>}
                </div>
                <div className="alumni-contact-actions">
                    {profile.email ? (
                        <a href={`mailto:${profile.email}`}>{profile.email}</a>
                    ) : (
                        <span>Email pending</span>
                    )}
                    {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                    <button type="button" className="alumni-secondary-action" onClick={() => openProfileView(profile)}>View</button>
                    {canEditProfile(profile) && (
                        <button type="button" className="alumni-secondary-action alumni-edit-action" onClick={() => openProfileEditor(profile)}>Edit</button>
                    )}
                </div>
            </div>
        </article>
    );

    const renderDirectory = () => (
        <section className="alumni-directory-section">
            <div className="section-content">
                <div className="alumni-tools">
                    <label className="alumni-search">
                        <span>Search</span>
                        <input
                            type="search"
                            placeholder="Company, law school, name, city, role..."
                            value={filters.query}
                            onChange={(event) => updateFilter('query', event.target.value)}
                        />
                    </label>
                    <label>
                        <span>Status</span>
                        <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
                            {Object.entries(statusLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span>Path</span>
                        <select value={filters.pathType} onChange={(event) => updateFilter('pathType', event.target.value)}>
                            {Object.entries(pathTypeLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span>Class</span>
                        <select value={filters.classYear} onChange={(event) => updateFilter('classYear', event.target.value)}>
                            {classYears.map(value => (
                                <option key={value} value={value}>{value === 'all' ? 'All years' : value}</option>
                            ))}
                        </select>
                    </label>
                    <label className="alumni-checkbox">
                        <input
                            type="checkbox"
                            checked={filters.willingOnly}
                            onChange={(event) => updateFilter('willingOnly', event.target.checked)}
                        />
                        <span>Open to outreach</span>
                    </label>
                </div>

                <div className="alumni-results-heading">
                    <p>{loading ? 'Loading profiles...' : `${filteredProfiles.length} result${filteredProfiles.length === 1 ? '' : 's'}`}</p>
                    <button type="button" onClick={() => setFilters(defaultFilters)}>Clear filters</button>
                </div>

                <div className="alumni-results">
                    {filteredProfiles.map(renderProfileCard)}
                </div>
            </div>
        </section>
    );

    const renderProfileView = () => {
        if (!activeProfile) {
            return (
                <section className="alumni-profile-section">
                    <div className="section-content">
                        {editingProfileUserId === session?.user?.id || !editingProfileUserId ? (
                            <div className="alumni-empty-profile">
                                <p className="jh-section-label">My profile</p>
                                <h2>You do not have a profile yet.</h2>
                                <p>
                                    Use the UJLP alumni invite code to create your directory profile.
                                </p>
                                <form className="alumni-invite-form" onSubmit={handleCreateProfileRequest}>
                                    <label>
                                        <span>Invite code</span>
                                        <input
                                            type="password"
                                            value={profileInviteCode}
                                            onChange={(event) => setProfileInviteCode(event.target.value)}
                                            placeholder="Enter invite code"
                                        />
                                    </label>
                                    <button type="submit" className="alumni-primary-action">Create profile</button>
                                </form>
                                {profileInviteMessage && <p className="alumni-form-message">{profileInviteMessage}</p>}
                            </div>
                        ) : (
                            <p className="alumni-form-message">Profile unavailable.</p>
                        )}
                    </div>
                </section>
            );
        }

        const canEdit = canEditProfile(activeProfile);
        const isOwnProfile = activeProfile.userId === session?.user?.id;
        const facts = [
            ['UJLP role', activeProfile.ujlpRole],
            ['Class year', activeProfile.classYear],
            ['Path', getPathLabel(activeProfile)],
            ['Current title', activeProfile.currentTitle],
            ['Employer / school', activeProfile.currentOrg || activeProfile.lawSchool || activeProfile.gradSchool],
            ['Major or program', activeProfile.undergradMajor],
            ['Location', activeProfile.location],
            ['Updated', formatUpdatedDate(activeProfile.updatedAt)]
        ];

        return (
            <section className="alumni-profile-section">
                <div className="section-content">
                    <div className="alumni-profile-view">
                        <div className="alumni-profile-view-header">
                            <div className="alumni-profile-photo alumni-profile-photo-large" aria-hidden="true">
                                <img src={getAlumniPhoto(activeProfile.photoKey)} alt="" />
                            </div>
                            <div>
                                <div className="alumni-profile-title">
                                    <span>{activeProfile.status === 'current' ? 'Current member' : 'Alumni'}</span>
                                    <span>{activeProfile.willingToChat ? 'Open to outreach' : 'Not currently open'}</span>
                                    {!activeProfile.directoryVisible && <b>Hidden</b>}
                                    {isAdmin && !isOwnProfile && <b>Admin view</b>}
                                </div>
                                <h2>{getProfileName(activeProfile)}</h2>
                                <p>{getProfileLine(activeProfile) || 'Profile details pending'}</p>
                            </div>
                            <div className="alumni-profile-view-actions">
                                {canEdit && (
                                    <button type="button" className="alumni-primary-action" onClick={() => openProfileEditor(activeProfile)}>
                                        {isOwnProfile ? 'Edit my profile' : 'Edit profile'}
                                    </button>
                                )}
                                <button type="button" className="alumni-secondary-action" onClick={openDirectory}>Back to directory</button>
                            </div>
                        </div>

                        {profileMessage && <p className="alumni-form-message alumni-profile-save-message">{profileMessage}</p>}

                        <div className="alumni-profile-view-grid">
                            <div className="alumni-profile-bio">
                                <span>Bio</span>
                                <p>{activeProfile.bio || 'No bio has been added yet.'}</p>
                            </div>
                            <div className="alumni-profile-facts">
                                {facts.map(([label, value]) => (
                                    <div key={label}>
                                        <span>{label}</span>
                                        <strong>{value || 'Not provided'}</strong>
                                    </div>
                                ))}
                            </div>
                            <div className="alumni-profile-contact">
                                <span>Contact</span>
                                <div>
                                    {activeProfile.email ? <a href={`mailto:${activeProfile.email}`}>{activeProfile.email}</a> : <strong>Email pending</strong>}
                                    {activeProfile.linkedinUrl && <a href={activeProfile.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                                </div>
                            </div>
                            <div className="alumni-tags alumni-profile-tags">
                                {(activeProfile.interests || []).map(tag => <span key={tag}>{tag}</span>)}
                                {(!activeProfile.interests || activeProfile.interests.length === 0) && <span>No interests listed</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const renderProfileEditor = () => (
        <section className="alumni-profile-section">
            <div className="section-content">
                <div className="alumni-editor-heading">
                    <p className="jh-section-label">{profileDraft?.userId === session?.user?.id ? 'My profile' : 'Admin edit'}</p>
                    <h2>{profileDraft?.fullName ? `Editing ${profileDraft.fullName}` : 'Build the member profile'}</h2>
                </div>
                {profileDraft && (
                    <form className="alumni-profile-form" onSubmit={handleProfileSave}>
                        <div className="alumni-form-grid">
                            <label>
                                <span>Status</span>
                                <select value={profileDraft.status} onChange={(event) => updateDraft('status', event.target.value)}>
                                    <option value="current">Current member</option>
                                    <option value="alumni">Alumni</option>
                                </select>
                            </label>
                            <label>
                                <span>Path</span>
                                <select value={profileDraft.pathType} onChange={(event) => updateDraft('pathType', event.target.value)}>
                                    {Object.entries(pathTypeLabels).filter(([value]) => value !== 'all').map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                <span>Profile image</span>
                                <select value={profileDraft.photoKey || 'blank'} onChange={(event) => updateDraft('photoKey', event.target.value)}>
                                    {alumniPhotoOptions.map(option => (
                                        <option key={option.key} value={option.key}>{option.label}</option>
                                    ))}
                                </select>
                            </label>
                            {profileFields.map(([key, label, type]) => (
                                <label key={key}>
                                    <span>{label}</span>
                                    <input
                                        type={type}
                                        value={profileDraft[key] || ''}
                                        onChange={(event) => updateDraft(key, event.target.value)}
                                    />
                                </label>
                            ))}
                            <label className="alumni-wide">
                                <span>Interests</span>
                                <input
                                    type="text"
                                    value={profileDraft.interestsText || ''}
                                    onChange={(event) => updateDraft('interestsText', event.target.value)}
                                    placeholder="Law school admissions, litigation, campaigns..."
                                />
                            </label>
                            <label className="alumni-wide">
                                <span>Bio</span>
                                <textarea
                                    value={profileDraft.bio || ''}
                                    onChange={(event) => updateDraft('bio', event.target.value)}
                                    rows="4"
                                />
                            </label>
                            <label className="alumni-checkbox alumni-wide">
                                <input
                                    type="checkbox"
                                    checked={profileDraft.willingToChat}
                                    onChange={(event) => updateDraft('willingToChat', event.target.checked)}
                                />
                                <span>Open to outreach from UJLP members</span>
                            </label>
                            <label className="alumni-checkbox alumni-wide">
                                <input
                                    type="checkbox"
                                    checked={profileDraft.directoryVisible}
                                    onChange={(event) => updateDraft('directoryVisible', event.target.checked)}
                                />
                                <span>Show this profile in the member directory</span>
                            </label>
                        </div>
                        <div className="alumni-form-actions">
                            <button type="submit" className="alumni-primary-action" disabled={saving}>
                                {saving ? 'Saving...' : 'Save profile'}
                            </button>
                            <button type="button" className="alumni-secondary-action" onClick={() => setProfileMode('view')}>Cancel</button>
                        </div>
                        {profileMessage && <p className="alumni-form-message">{profileMessage}</p>}
                    </form>
                )}
            </div>
        </section>
    );

    const upcomingItems = useMemo(() => (
        [...portalContent.feedPosts]
            .filter(post => post.eventDate || post.deadlineDate)
            .sort((left, right) => String(left.eventDate || left.deadlineDate).localeCompare(String(right.eventDate || right.deadlineDate)))
            .slice(0, 4)
    ), [portalContent.feedPosts]);

    const renderFeedCard = (post) => (
        <article className="alumni-feed-card" key={post.id}>
            <div className="alumni-feed-author">
                <img src={getAlumniPhoto(post.authorPhotoKey)} alt="" />
                <div>
                    <span>{post.category}</span>
                    <strong>{post.authorName || 'UJLP'}</strong>
                </div>
                {post.pinned && <b>Pinned</b>}
            </div>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <div className="alumni-tags">
                {(post.tags || []).map(tag => <span key={tag}>{tag}</span>)}
                {post.eventDate && <span>Event {formatShortDate(post.eventDate)}</span>}
                {post.deadlineDate && <span>Due {formatShortDate(post.deadlineDate)}</span>}
            </div>
        </article>
    );

    const renderHome = () => (
        <div className="alumni-portal-stack">
            {renderDashboard()}
            <div className="alumni-home-grid">
                <section className="alumni-home-feed">
                    <div className="alumni-panel-heading">
                        <span>Feed</span>
                        <strong>Latest from the network</strong>
                    </div>
                    {portalContent.feedPosts.slice(0, 3).map(renderFeedCard)}
                </section>
                <aside className="alumni-home-rail">
                    <div className="alumni-panel-heading">
                        <span>Upcoming</span>
                        <strong>Events and deadlines</strong>
                    </div>
                    {upcomingItems.map(item => (
                        <article className="alumni-upcoming-card" key={item.id}>
                            <span>{item.postType === 'deadline' ? 'Deadline' : 'Event'}</span>
                            <strong>{item.title}</strong>
                            <time>{formatShortDate(item.eventDate || item.deadlineDate)}</time>
                        </article>
                    ))}
                    {upcomingItems.length === 0 && <p className="alumni-system-note">No dated items are posted.</p>}
                </aside>
            </div>
        </div>
    );

    const renderFeed = () => (
        <div className="alumni-home-grid">
            <section className="alumni-home-feed">
                <div className="alumni-panel-heading">
                    <span>Alumni network</span>
                    <strong>Member updates and opportunities</strong>
                </div>
                <form className="alumni-feed-composer" onSubmit={handleFeedSave}>
                    <div className="alumni-form-grid">
                        <label>
                            <span>Title</span>
                            <input value={feedDraft.title} onChange={(event) => setFeedDraft(current => ({ ...current, title: event.target.value }))} required />
                        </label>
                        <label>
                            <span>Category</span>
                            <input value={feedDraft.category} onChange={(event) => setFeedDraft(current => ({ ...current, category: event.target.value }))} />
                        </label>
                        <label className="alumni-wide">
                            <span>Post</span>
                            <textarea value={feedDraft.body} onChange={(event) => setFeedDraft(current => ({ ...current, body: event.target.value }))} required rows="3" />
                        </label>
                        <label>
                            <span>Type</span>
                            <select value={feedDraft.postType} onChange={(event) => setFeedDraft(current => ({ ...current, postType: event.target.value }))}>
                                <option value="update">Update</option>
                                <option value="event">Event</option>
                                <option value="deadline">Deadline</option>
                            </select>
                        </label>
                        <label>
                            <span>Event date</span>
                            <input type="date" value={feedDraft.eventDate} onChange={(event) => setFeedDraft(current => ({ ...current, eventDate: event.target.value }))} />
                        </label>
                        <label>
                            <span>Deadline date</span>
                            <input type="date" value={feedDraft.deadlineDate} onChange={(event) => setFeedDraft(current => ({ ...current, deadlineDate: event.target.value }))} />
                        </label>
                        <label>
                            <span>Tags</span>
                            <input value={feedDraft.tagsText} onChange={(event) => setFeedDraft(current => ({ ...current, tagsText: event.target.value }))} placeholder="jobs, events, alumni" />
                        </label>
                    </div>
                    <button type="submit" className="alumni-primary-action">Post to feed</button>
                    {feedMessage && <p className="alumni-form-message">{feedMessage}</p>}
                </form>
                {portalContent.feedPosts.map(renderFeedCard)}
            </section>
            <aside className="alumni-home-rail">
                <div className="alumni-panel-heading">
                    <span>Calendar</span>
                    <strong>Coming up</strong>
                </div>
                {upcomingItems.map(item => (
                    <article className="alumni-upcoming-card" key={item.id}>
                        <span>{item.category}</span>
                        <strong>{item.title}</strong>
                        <time>{formatShortDate(item.eventDate || item.deadlineDate)}</time>
                    </article>
                ))}
            </aside>
        </div>
    );

    const renderPortalAccountBar = () => (
        <div className="alumni-portal-account-bar">
            <div className="alumni-portal-context">
                <span>Alumni network</span>
                <strong>Member workspace</strong>
            </div>
            <div className="alumni-account-actions">
                <button type="button" className={activeView === 'profile' && editingProfileUserId === session.user.id ? 'active' : ''} onClick={() => openOwnProfile('view')}>
                    <img src={getAlumniPhoto(ownProfile?.photoKey || 'blank')} alt="" />
                    <span>{ownProfile?.fullName || session.user.email}</span>
                </button>
                <button type="button" onClick={handleSignOut}>Sign out</button>
            </div>
        </div>
    );

    const renderResources = () => (
        <div className="alumni-resource-grid">
            {[
                ['Career Development', 'Law school applications, clerkship paths, internships, government service, and recruiting notes.'],
                ['Club Resources', 'Editorial standards, source collection, article development, and publication workflow materials.'],
                ['Alumni Outreach', 'Shared contacts, mentorship preferences, and tagged profiles from the private directory.'],
                ['UJLP Inbox', 'Use the contact button to email the Journal account for private questions and portal issues.']
            ].map(([title, body]) => (
                <article className="alumni-resource-card" key={title}>
                    <span>{title}</span>
                    <p>{body}</p>
                </article>
            ))}
            <a className="alumni-mail-action" href="mailto:ujlawandpolitics@gmail.com">Email UJLP</a>
        </div>
    );

    const renderTasks = () => (
        <div className="alumni-task-list">
            <div className="alumni-panel-heading">
                <span>Weekly tasks</span>
                <strong>For writers and editors</strong>
            </div>
            {portalContent.tasks.map(task => (
                <article className="alumni-task-card" key={task.id}>
                    <div>
                        <span>{task.role}</span>
                        <h3>{task.title}</h3>
                        <p>{task.details}</p>
                    </div>
                    <time>{formatShortDate(task.dueDate)}</time>
                </article>
            ))}
        </div>
    );

    const renderNotifications = () => (
        <div className="alumni-notification-list">
            <div className="alumni-panel-heading">
                <span>Notifications</span>
                <strong>Portal activity</strong>
            </div>
            {portalContent.announcements.slice(0, 4).map(announcement => (
                <article className="alumni-notification-card" key={announcement.id}>
                    <span>{announcement.category}</span>
                    <strong>{announcement.title}</strong>
                    <time>{formatShortDate(announcement.publishDate)}</time>
                </article>
            ))}
        </div>
    );

    const renderAdminEditor = () => {
        if (!isAdmin) return renderHome();

        const currentItems = portalContent[editorType] || [];
        return (
            <div className="alumni-admin-grid">
                <form className="alumni-admin-form" onSubmit={handleEditorSave}>
                    <div className="alumni-panel-heading">
                        <span>Internal team</span>
                        <strong>Create announcements and tasks</strong>
                    </div>
                    <div className="alumni-auth-tabs" aria-label="Editor type">
                        <button type="button" className={editorType === 'announcements' ? 'active' : ''} onClick={() => setEditorType('announcements')}>Announcements</button>
                        <button type="button" className={editorType === 'tasks' ? 'active' : ''} onClick={() => setEditorType('tasks')}>Tasks</button>
                    </div>
                    <label>
                        <span>Title</span>
                        <input value={editorDraft.title} onChange={(event) => setEditorDraft(current => ({ ...current, title: event.target.value }))} required />
                    </label>
                    <label>
                        <span>{editorType === 'tasks' ? 'Details' : 'Body'}</span>
                        <textarea value={editorDraft.body} onChange={(event) => setEditorDraft(current => ({ ...current, body: event.target.value }))} required rows="4" />
                    </label>
                    {editorType !== 'tasks' && (
                        <>
                            <label>
                                <span>Category</span>
                                <input value={editorDraft.category} onChange={(event) => setEditorDraft(current => ({ ...current, category: event.target.value }))} />
                            </label>
                            <label>
                                <span>Publish date</span>
                                <input type="date" value={editorDraft.publishDate} onChange={(event) => setEditorDraft(current => ({ ...current, publishDate: event.target.value }))} />
                            </label>
                            <label>
                                <span>Tags</span>
                                <input value={editorDraft.tagsText} onChange={(event) => setEditorDraft(current => ({ ...current, tagsText: event.target.value }))} placeholder="writers, events, alumni" />
                            </label>
                        </>
                    )}
                    {editorType === 'tasks' && (
                        <>
                            <label>
                                <span>Role</span>
                                <select value={editorDraft.role} onChange={(event) => setEditorDraft(current => ({ ...current, role: event.target.value }))}>
                                    <option>Writers</option>
                                    <option>Editors</option>
                                    <option>Leadership</option>
                                </select>
                            </label>
                            <label>
                                <span>Due date</span>
                                <input type="date" value={editorDraft.dueDate} onChange={(event) => setEditorDraft(current => ({ ...current, dueDate: event.target.value }))} />
                            </label>
                        </>
                    )}
                    <label className="alumni-checkbox">
                        <input type="checkbox" checked={editorDraft.pinned} onChange={(event) => setEditorDraft(current => ({ ...current, pinned: event.target.checked }))} />
                        <span>Pin this item</span>
                    </label>
                    <button type="submit" className="alumni-primary-action">Save item</button>
                    {editorMessage && <p className="alumni-form-message">{editorMessage}</p>}
                </form>

                <div className="alumni-admin-list">
                    <div className="alumni-panel-heading">
                        <span>Manage</span>
                        <strong>{editorType === 'announcements' ? 'Announcements' : 'Tasks'}</strong>
                    </div>
                    {currentItems.map(item => (
                        <article className="alumni-admin-item" key={item.id}>
                            <div>
                                <span>{item.category || item.role || 'Item'}</span>
                                <strong>{item.title}</strong>
                            </div>
                            <button type="button" className="alumni-secondary-action" onClick={() => handleEditorDelete(editorType, item.id)}>Delete</button>
                        </article>
                    ))}
                </div>
            </div>
        );
    };

    const renderActivePortalView = () => {
        if (activeView === 'home') return renderHome();
        if (activeView === 'feed') return renderFeed();
        if (activeView === 'directory') return renderDirectory();
        if (activeView === 'resources') return renderResources();
        if (activeView === 'tasks') return renderTasks();
        if (activeView === 'notifications') return renderNotifications();
        if (activeView === 'admin') return renderAdminEditor();
        if (activeView === 'profile') return profileMode === 'edit' ? renderProfileEditor() : renderProfileView();
        return renderHome();
    };

    const renderPortalShell = () => (
        <section className="alumni-portal-section">
            <div className="section-content alumni-portal-shell">
                <aside className="alumni-portal-sidebar">
                    <nav className="alumni-portal-nav" aria-label="Alumni portal">
                        {portalTabs.map(([key, label, iconPath]) => (
                            <button key={key} type="button" className={activeView === key ? 'active' : ''} onClick={() => setActiveView(key)}>
                                <Icon path={iconPath} />
                                <span>{label}</span>
                            </button>
                        ))}
                    </nav>
                    <a className="alumni-sidebar-mail" href="mailto:ujlawandpolitics@gmail.com">Contact UJLP</a>
                </aside>
                <div className="alumni-portal-main">
                    {renderPortalAccountBar()}
                    {renderActivePortalView()}
                </div>
            </div>
        </section>
    );

    return (
        <div className="alumni-directory jh-page fade-in">
            <section className="alumni-hero">
                <ParticleBackground />
                <div className="section-content alumni-hero-grid">
                    <div className="alumni-hero-copy">
                        <p className="jh-eyebrow"><strong>UJLP</strong> / Members Network</p>
                        <h1>Alumni Directory</h1>
                        <p>
                            A private workspace for member profiles, career paths, law school information, and alumni contact preferences.
                        </p>
                    </div>
                    <div className="alumni-hero-panel">
                        <span>{session ? 'Active session' : 'Member access'}</span>
                        <strong>{session ? session.user.email : 'Sign in to continue'}</strong>
                        <p>{session ? `${profiles.length} profiles available${isAdmin ? ' with admin access' : ''}.` : 'Accounts are protected by Supabase Auth and UJLP directory permissions.'}</p>
                    </div>
                </div>
            </section>

            {!session ? (
                renderAuthPanel()
            ) : (
                renderPortalShell()
            )}
        </div>
    );
}

export default AlumniDirectory;
