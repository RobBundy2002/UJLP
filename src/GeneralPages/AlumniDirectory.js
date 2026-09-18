import React, { useEffect, useMemo, useState } from 'react';
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

function AlumniDirectory() {
    const [session, setSession] = useState(() => getStoredAlumniSession());
    const [authMode, setAuthMode] = useState('signin');
    const [authForm, setAuthForm] = useState({ email: '', password: '' });
    const [authMessage, setAuthMessage] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [filters, setFilters] = useState(defaultFilters);
    const [activeView, setActiveView] = useState('directory');
    const [profileMode, setProfileMode] = useState('view');
    const [editingProfileUserId, setEditingProfileUserId] = useState(null);
    const [profileDraft, setProfileDraft] = useState(null);
    const [profileMessage, setProfileMessage] = useState('');
    const [profileInviteCode, setProfileInviteCode] = useState('');
    const [profileInviteMessage, setProfileInviteMessage] = useState('');
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
        setActiveView('directory');
        setProfileMode('view');
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
                        <input
                            type="password"
                            value={authForm.password}
                            onChange={(event) => setAuthForm(current => ({ ...current, password: event.target.value }))}
                            required
                            minLength={6}
                        />
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
                <div className="alumni-session-bar">
                    <div>
                        <span>Signed in</span>
                        <strong>{session.user.email}</strong>
                        {isAdmin && <b>Admin</b>}
                    </div>
                    <div className="alumni-session-actions">
                        <button type="button" className={activeView === 'directory' ? 'active' : ''} onClick={openDirectory}>Directory</button>
                        <button type="button" className={activeView === 'profile' && editingProfileUserId === session.user.id ? 'active' : ''} onClick={() => openOwnProfile('view')}>My profile</button>
                        <button type="button" onClick={handleSignOut}>Sign out</button>
                    </div>
                </div>

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
                <>
                    {renderDashboard()}
                    {activeView === 'directory' && renderDirectory()}
                    {activeView === 'profile' && (profileMode === 'edit' ? renderProfileEditor() : renderProfileView())}
                </>
            )}
        </div>
    );
}

export default AlumniDirectory;
