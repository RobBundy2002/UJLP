import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../Components/ParticleBackground';
import { pathTypeLabels } from '../Data/alumniDemoData';
import { getCompactAlumniName } from '../Data/alumniDisplay';
import { alumniPhotoOptions, getAlumniPhoto } from '../Data/alumniPhotoRegistry';
import {
    ALUMNI_SESSION_EVENT,
    createBlankAlumniProfile,
    fetchAlumniProfiles,
    getAlumniBackendMode,
    getStoredAlumniSession,
    isAlumniProfileInviteCodeValid,
    isAlumniProfileInviteConfigured,
    saveAlumniProfile
} from '../Services/alumniApi';
import '../Styling/AlumniDirectory.css';
import '../Styling/EditorialPages.css';

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

function AlumniProfile() {
    const [session, setSession] = useState(() => getStoredAlumniSession());
    const [profiles, setProfiles] = useState([]);
    const [profileDraft, setProfileDraft] = useState(null);
    const [profileInviteCode, setProfileInviteCode] = useState('');
    const [profileMessage, setProfileMessage] = useState('');
    const [profileInviteMessage, setProfileInviteMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const backendMode = getAlumniBackendMode();

    useEffect(() => {
        const syncSession = () => setSession(getStoredAlumniSession());
        window.addEventListener(ALUMNI_SESSION_EVENT, syncSession);
        window.addEventListener('storage', syncSession);
        window.addEventListener('focus', syncSession);
        return () => {
            window.removeEventListener(ALUMNI_SESSION_EVENT, syncSession);
            window.removeEventListener('storage', syncSession);
            window.removeEventListener('focus', syncSession);
        };
    }, []);

    useEffect(() => {
        if (!session) {
            setProfiles([]);
            setProfileDraft(null);
            return;
        }

        let isMounted = true;
        setLoading(true);
        setProfileMessage('');
        fetchAlumniProfiles(session)
            .then(rows => {
                if (isMounted) setProfiles(rows);
            })
            .catch(error => {
                if (isMounted) setProfileMessage(error.message);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [session]);

    const ownProfile = useMemo(() => {
        if (!session?.user?.id) return null;
        return profiles.find(profile => profile.userId === session.user.id) || null;
    }, [profiles, session]);

    useEffect(() => {
        if (!ownProfile) return;
        setProfileDraft({ ...ownProfile, interestsText: toInterestText(ownProfile.interests) });
    }, [ownProfile?.id, ownProfile?.updatedAt, ownProfile]);

    const accountName = getCompactAlumniName(ownProfile, session?.user);
    const previewProfile = profileDraft || ownProfile;

    const updateDraft = (key, value) => {
        setProfileDraft(current => ({ ...current, [key]: value }));
    };

    const handleCreateProfileRequest = (event) => {
        event.preventDefault();
        setProfileInviteMessage('');

        if (!profileInviteCode.trim()) {
            setProfileInviteMessage('Enter the alumni invite code to create your profile.');
            return;
        }

        if (backendMode === 'preview' && isAlumniProfileInviteConfigured && !isAlumniProfileInviteCodeValid(profileInviteCode)) {
            setProfileInviteMessage('That invite code is not valid.');
            return;
        }

        setProfileDraft({
            ...createBlankAlumniProfile(session),
            inviteCode: profileInviteCode.trim(),
            interestsText: '',
            isNewProfile: true
        });
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
            setProfileDraft({ ...saved, interestsText: toInterestText(saved.interests) });
            setProfileMessage('Profile saved.');
        } catch (error) {
            setProfileMessage(error.message);
        } finally {
            setSaving(false);
        }
    };

    const facts = previewProfile ? [
        ['UJLP role', previewProfile.ujlpRole],
        ['Class year', previewProfile.classYear],
        ['Path', getPathLabel(previewProfile)],
        ['Current title', previewProfile.currentTitle],
        ['Employer / school', previewProfile.currentOrg || previewProfile.lawSchool || previewProfile.gradSchool],
        ['Major or program', previewProfile.undergradMajor],
        ['Location', previewProfile.location],
        ['Updated', formatUpdatedDate(previewProfile.updatedAt)]
    ] : [];

    const renderSignedOut = () => (
        <section className="alumni-profile-section">
            <div className="section-content">
                <div className="alumni-empty-profile">
                    <p className="jh-section-label">Profile access</p>
                    <h2>Sign in to manage your profile.</h2>
                    <p>Your profile manager is connected to your alumni account.</p>
                    <Link to="/alumni" className="alumni-primary-action">Go to alumni sign in</Link>
                </div>
            </div>
        </section>
    );

    const renderCreateProfile = () => (
        <section className="alumni-profile-section">
            <div className="section-content">
                <div className="alumni-empty-profile">
                    <p className="jh-section-label">My profile</p>
                    <h2>Create your member profile.</h2>
                    <p>Use the UJLP alumni invite code to start your directory profile.</p>
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
            </div>
        </section>
    );

    const renderProfileWorkspace = () => (
        <section className="alumni-profile-section">
            <div className="section-content alumni-profile-page-workspace">
                <aside className="alumni-profile-view alumni-profile-page-preview">
                    <div className="alumni-profile-view-header">
                        <div className="alumni-profile-photo alumni-profile-photo-large" aria-hidden="true">
                            <img src={getAlumniPhoto(previewProfile.photoKey)} alt="" />
                        </div>
                        <div>
                            <div className="alumni-profile-title">
                                <span>{previewProfile.status === 'current' ? 'Current member' : 'Alumni'}</span>
                                <span>{previewProfile.willingToChat ? 'Open to outreach' : 'Not currently open'}</span>
                                {!previewProfile.directoryVisible && <b>Hidden</b>}
                            </div>
                            <h2>{getProfileName(previewProfile)}</h2>
                            <p>{getProfileLine(previewProfile) || 'Profile details pending'}</p>
                        </div>
                    </div>

                    <div className="alumni-profile-view-grid">
                        <div className="alumni-profile-bio">
                            <span>Bio</span>
                            <p>{previewProfile.bio || 'No bio has been added yet.'}</p>
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
                                {previewProfile.email ? <a href={`mailto:${previewProfile.email}`}>{previewProfile.email}</a> : <strong>Email pending</strong>}
                                {previewProfile.linkedinUrl && <a href={previewProfile.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                            </div>
                        </div>
                        <div className="alumni-tags alumni-profile-tags">
                            {(previewProfile.interests || []).map(tag => <span key={tag}>{tag}</span>)}
                            {(!previewProfile.interests || previewProfile.interests.length === 0) && <span>No interests listed</span>}
                        </div>
                    </div>
                </aside>

                <form className="alumni-profile-form" onSubmit={handleProfileSave}>
                    <div className="alumni-editor-heading">
                        <p className="jh-section-label">Manage profile</p>
                        <h2>{previewProfile.fullName ? `Editing ${previewProfile.fullName}` : 'Build the member profile'}</h2>
                    </div>
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
                        <Link to="/alumni" className="alumni-secondary-action">Back to alumni network</Link>
                    </div>
                    {profileMessage && <p className="alumni-form-message">{profileMessage}</p>}
                </form>
            </div>
        </section>
    );

    return (
        <div className="alumni-directory alumni-profile-page jh-page fade-in">
            <section className="alumni-hero alumni-profile-page-hero">
                <ParticleBackground />
                <div className="section-content alumni-hero-grid">
                    <div className="alumni-hero-copy">
                        <p className="jh-eyebrow"><strong>UJLP</strong> / Member Profile</p>
                        <h1>Manage Profile</h1>
                        <p>
                            Edit the profile attached to your alumni account without leaving this dedicated profile workspace.
                        </p>
                    </div>
                    <div className="alumni-hero-panel">
                        <span>{session ? 'Signed in as' : 'Member access'}</span>
                        <strong>{session ? accountName : 'Sign in required'}</strong>
                        <p>{session ? 'Changes update your member profile and directory listing.' : 'Use your alumni account to open the profile manager.'}</p>
                    </div>
                </div>
            </section>

            {!session && renderSignedOut()}
            {session && loading && !profileDraft && (
                <section className="alumni-profile-section">
                    <div className="section-content">
                        <div className="alumni-empty-profile">
                            <p className="jh-section-label">Loading</p>
                            <h2>Opening your profile.</h2>
                            <p>Fetching your member record.</p>
                        </div>
                    </div>
                </section>
            )}
            {session && !loading && !profileDraft && renderCreateProfile()}
            {session && profileDraft && renderProfileWorkspace()}
        </div>
    );
}

export default AlumniProfile;
