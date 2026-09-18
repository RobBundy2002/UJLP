import React, { useEffect, useMemo, useState } from 'react';
import ParticleBackground from '../Components/ParticleBackground';
import { pathTypeLabels } from '../Data/alumniDemoData';
import { alumniPhotoOptions, getAlumniPhoto } from '../Data/alumniPhotoRegistry';
import {
    createBlankAlumniProfile,
    fetchAlumniProfiles,
    getAlumniBackendMode,
    getStoredAlumniSession,
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

function AlumniDirectory() {
    const [session, setSession] = useState(() => getStoredAlumniSession());
    const [authMode, setAuthMode] = useState('signin');
    const [authForm, setAuthForm] = useState({ email: '', password: '' });
    const [authMessage, setAuthMessage] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [filters, setFilters] = useState(defaultFilters);
    const [activeView, setActiveView] = useState('directory');
    const [profileDraft, setProfileDraft] = useState(null);
    const [profileMessage, setProfileMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const backendMode = getAlumniBackendMode();

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
        return profiles.find(profile => profile.userId === session.user.id) || createBlankAlumniProfile(session);
    }, [profiles, session]);

    useEffect(() => {
        if (ownProfile) {
            setProfileDraft({ ...ownProfile, interestsText: toInterestText(ownProfile.interests) });
        }
    }, [ownProfile]);

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

    const metrics = useMemo(() => ({
        total: profiles.length,
        alumni: profiles.filter(profile => profile.status === 'alumni').length,
        current: profiles.filter(profile => profile.status === 'current').length,
        reachable: profiles.filter(profile => profile.email && profile.willingToChat).length
    }), [profiles]);

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
        setActiveView('directory');
    };

    const updateFilter = (key, value) => {
        setFilters(current => ({ ...current, [key]: value }));
    };

    const updateDraft = (key, value) => {
        setProfileDraft(current => ({ ...current, [key]: value }));
    };

    const handleProfileSave = async (event) => {
        event.preventDefault();
        setSaving(true);
        setProfileMessage('');
        try {
            const saved = await saveAlumniProfile({
                ...profileDraft,
                interests: fromInterestText(profileDraft.interestsText || '')
            }, session);
            setProfiles(current => [saved, ...current.filter(profile => profile.id !== saved.id && profile.userId !== saved.userId)]);
            setProfileMessage('Profile saved.');
        } catch (error) {
            setProfileMessage(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="alumni-directory jh-page fade-in">
            <section className="alumni-hero">
                <ParticleBackground />
                <div className="section-content">
                    <p className="jh-eyebrow"><strong>UJLP</strong> · Members Network</p>
                    <h1>Alumni<br /><em>directory.</em></h1>
                    <p className="alumni-hero-copy">
                        A private, searchable network for UJLP members, alumni, law-school paths, employers, and self-reported contact details.
                    </p>
                </div>
            </section>

            {!session ? (
                <section className="alumni-auth-section">
                    <div className="section-content alumni-auth-layout">
                        <div className="alumni-auth-copy">
                            <p className="jh-section-label">Member access</p>
                            <h2>Locked until<br /><em>sign-in.</em></h2>
                            <div className="alumni-lock-list">
                                <span>Private directory</span>
                                <span>Email/password accounts</span>
                                <span>Self-reported profiles</span>
                                <span>Postgres-ready data model</span>
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
            ) : (
                <>
                    <section className="alumni-dashboard">
                        <div className="section-content">
                            <div className="alumni-session-bar">
                                <div>
                                    <span>Signed in</span>
                                    <strong>{session.user.email}</strong>
                                </div>
                                <div className="alumni-session-actions">
                                    <button type="button" className={activeView === 'directory' ? 'active' : ''} onClick={() => setActiveView('directory')}>Directory</button>
                                    <button type="button" className={activeView === 'profile' ? 'active' : ''} onClick={() => setActiveView('profile')}>My profile</button>
                                    <button type="button" onClick={handleSignOut}>Sign out</button>
                                </div>
                            </div>

                            <div className="alumni-metrics" aria-label="Directory summary">
                                <div><strong>{metrics.total}</strong><span>Profiles</span></div>
                                <div><strong>{metrics.alumni}</strong><span>Alumni</span></div>
                                <div><strong>{metrics.current}</strong><span>Current</span></div>
                                <div><strong>{metrics.reachable}</strong><span>Open to email</span></div>
                            </div>
                        </div>
                    </section>

                    {activeView === 'directory' ? (
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
                                    {filteredProfiles.map(profile => (
                                        <article className="alumni-profile-row" key={profile.id}>
                                            <div className="alumni-profile-photo" aria-hidden="true">
                                                <img src={getAlumniPhoto(profile.photoKey)} alt="" />
                                            </div>
                                            <div className="alumni-profile-main">
                                                <div className="alumni-profile-title">
                                                    <span>{profile.status === 'current' ? 'Current member' : 'Alumni'}</span>
                                                    {profile.isExample && <b>Preview</b>}
                                                </div>
                                                <h3>{profile.fullName || 'Unnamed member'}</h3>
                                                <p>{profile.ujlpRole || 'UJLP member'}{profile.classYear ? ` · Class of ${profile.classYear}` : ''}</p>
                                            </div>
                                            <div className="alumni-profile-details">
                                                <div><span>Employer / school</span><strong>{profile.currentOrg || profile.lawSchool || profile.gradSchool || 'Not provided'}</strong></div>
                                                <div><span>Role</span><strong>{profile.currentTitle || profile.industry || 'Not provided'}</strong></div>
                                                <div><span>Location</span><strong>{profile.location || 'Not provided'}</strong></div>
                                                <div><span>Law school</span><strong>{profile.lawSchool || 'Not provided'}</strong></div>
                                            </div>
                                            <div className="alumni-profile-footer">
                                                <div className="alumni-tags">
                                                    {(profile.interests || []).slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}
                                                </div>
                                                <div className="alumni-contact-actions">
                                                    {profile.email ? (
                                                        <a href={`mailto:${profile.email}`}>{profile.email}</a>
                                                    ) : (
                                                        <span>Email pending</span>
                                                    )}
                                                    {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ) : (
                        <section className="alumni-profile-editor">
                            <div className="section-content">
                                <div className="alumni-editor-heading">
                                    <p className="jh-section-label">Self reported</p>
                                    <h2>Keep your<br /><em>profile current.</em></h2>
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
                                                <span>Show my profile in the member directory</span>
                                            </label>
                                        </div>
                                        <button type="submit" className="alumni-primary-action" disabled={saving}>
                                            {saving ? 'Saving...' : 'Save profile'}
                                        </button>
                                        {profileMessage && <p className="alumni-form-message">{profileMessage}</p>}
                                    </form>
                                )}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}

export default AlumniDirectory;
