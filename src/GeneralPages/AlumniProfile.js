import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../Components/ParticleBackground';
import { pathTypeLabels } from '../Data/alumniDemoData';
import {
    getAlumniPrimaryOrg,
    getAlumniProfileLine,
    getAlumniProfileTypeLabel,
    getCompactAlumniName,
    getPrimaryAlumniJob
} from '../Data/alumniDisplay';
import { getAlumniPhoto } from '../Data/alumniPhotoRegistry';
import {
    anticipatedPathOptions,
    degreeTitleOptions,
    employerIndustryOptions,
    jobSectorOptions,
    locationSuggestions,
    profileTypeOptions,
    ujlpRoleOptions,
    uvaMajorOptions
} from '../Data/profileFormOptions';
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

const getPathLabel = (profile) => pathTypeLabels[profile?.pathType] || 'Other';

const emptyJob = () => ({
    employer: '',
    industry: '',
    title: '',
    sector: ''
});

const normalizeYearInput = (value) => String(value || '').replace(/\D/g, '').slice(0, 4);

const clampPercent = (value) => Math.min(Math.max(value, 0), 100);

const getSelectOptions = (options, currentValue = '') => {
    if (!currentValue || options.includes(currentValue)) return options;
    return [currentValue, ...options];
};

const getProfileDefaultsForType = (profileType) => {
    if (profileType === 'uva-undergraduate-alumni') {
        return {
            status: 'current',
            currentTitle: 'Undergraduate Student',
            currentOrg: 'University of Virginia',
            industry: 'Current Student',
            pathType: 'undecided',
            lawSchool: '',
            gradSchool: '',
            degreeTitle: '',
            undergraduateSchool: '',
            affiliatedWithUjlp: true,
            jobs: []
        };
    }

    if (profileType === 'uva-law-student') {
        return {
            status: 'current',
            currentTitle: 'UVA Law Student',
            currentOrg: 'University of Virginia School of Law',
            industry: 'Law School',
            pathType: 'law-school',
            lawSchool: 'University of Virginia School of Law',
            gradSchool: '',
            degreeTitle: 'Juris Doctor',
            affiliatedWithUjlp: false,
            jobs: [emptyJob()]
        };
    }

    if (profileType === 'unaffiliated') {
        return {
            status: 'alumni',
            currentTitle: '',
            currentOrg: '',
            industry: '',
            pathType: 'other',
            lawSchool: '',
            gradSchool: '',
            undergraduateSchool: '',
            undergradMajor: '',
            ujlpRole: '',
            affiliatedWithUjlp: false,
            jobs: [emptyJob()]
        };
    }

    return {};
};

const getJobsForDraft = (profileDraft) => {
    if (!profileDraft) return [];
    if (Array.isArray(profileDraft.jobs) && profileDraft.jobs.length > 0) return profileDraft.jobs;
    if (profileDraft.profileType === 'uva-law-student' || profileDraft.profileType === 'unaffiliated') return [emptyJob()];
    return [];
};

const jobSectorToPathType = (sector) => {
    const normalizedSector = String(sector || '').toLowerCase();
    if (normalizedSector.includes('government')) return 'government';
    if (normalizedSector.includes('nonprofit')) return 'nonprofit';
    if (normalizedSector.includes('public')) return 'public-service';
    if (normalizedSector.includes('finance')) return 'finance';
    if (normalizedSector.includes('consulting')) return 'consulting';
    if (normalizedSector.includes('legal')) return 'law-firm';
    if (normalizedSector.includes('private')) return 'private-sector';
    if (normalizedSector.includes('education') || normalizedSector.includes('academia')) return 'graduate-school';
    return 'other';
};

const cropPhotoToDataUrl = (source, { cropX, cropY, zoom }) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
        const outputSize = 512;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const layout = getPhotoCropLayout({
            width: image.naturalWidth,
            height: image.naturalHeight
        }, { cropX, cropY, zoom });

        canvas.width = outputSize;
        canvas.height = outputSize;
        context.drawImage(
            image,
            layout.left * outputSize,
            layout.top * outputSize,
            layout.width * outputSize,
            layout.height * outputSize
        );
        resolve(canvas.toDataURL('image/jpeg', 0.88));
    };
    image.onerror = () => reject(new Error('Could not read that image.'));
    image.src = source;
});

const getPhotoCropLayout = (imageSize, crop) => {
    const imageWidth = imageSize?.width || 1;
    const imageHeight = imageSize?.height || 1;
    const zoom = crop.zoom || 1;
    const width = Math.max(1, imageWidth / imageHeight) * zoom;
    const height = Math.max(1, imageHeight / imageWidth) * zoom;
    const left = Math.min(Math.max(0.5 - (crop.cropX / 100) * width, 1 - width), 0);
    const top = Math.min(Math.max(0.5 - (crop.cropY / 100) * height, 1 - height), 0);

    return { width, height, left, top };
};

const getPhotoCropImageStyle = (imageSize, crop) => {
    const layout = getPhotoCropLayout(imageSize, crop);
    return {
        width: `${layout.width * 100}%`,
        height: `${layout.height * 100}%`,
        left: `${layout.left * 100}%`,
        top: `${layout.top * 100}%`
    };
};

function AlumniProfile() {
    const [session, setSession] = useState(() => getStoredAlumniSession());
    const [profiles, setProfiles] = useState([]);
    const [profileDraft, setProfileDraft] = useState(null);
    const [profileInviteCode, setProfileInviteCode] = useState('');
    const [profileMessage, setProfileMessage] = useState('');
    const [profileInviteMessage, setProfileInviteMessage] = useState('');
    const [photoCropSource, setPhotoCropSource] = useState('');
    const [photoCropImageSize, setPhotoCropImageSize] = useState(null);
    const [photoCrop, setPhotoCrop] = useState({ cropX: 50, cropY: 50, zoom: 1 });
    const [photoDragStart, setPhotoDragStart] = useState(null);
    const [photoMessage, setPhotoMessage] = useState('');
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

    const selectProfileType = (profileType) => {
        setProfileDraft(current => {
            const defaults = current?.profileType === profileType ? {} : getProfileDefaultsForType(profileType);
            return {
                ...current,
                ...defaults,
                profileType,
                email: current?.email || session?.user?.email || '',
                fullName: current?.fullName || '',
                classYear: current?.classYear || '',
                interestsText: current?.interestsText || '',
                photoKey: current?.photoKey || 'blank',
                bio: current?.bio || '',
                directoryVisible: current?.directoryVisible ?? true,
                willingToChat: current?.willingToChat ?? true,
                inviteCode: current?.inviteCode || profileInviteCode.trim()
            };
        });
        setProfileMessage('');
    };

    const updateYearField = (value) => {
        updateDraft('classYear', normalizeYearInput(value));
    };

    const updateJob = (index, key, value) => {
        setProfileDraft(current => {
            const jobs = getJobsForDraft(current).map(job => ({ ...job }));
            jobs[index] = { ...(jobs[index] || emptyJob()), [key]: value };
            return { ...current, jobs };
        });
    };

    const addJob = () => {
        setProfileDraft(current => ({
            ...current,
            jobs: [...getJobsForDraft(current), emptyJob()]
        }));
    };

    const removeJob = (index) => {
        setProfileDraft(current => {
            const nextJobs = getJobsForDraft(current).filter((job, jobIndex) => jobIndex !== index);
            return { ...current, jobs: nextJobs.length > 0 ? nextJobs : [emptyJob()] };
        });
    };

    const handlePhotoFileChange = (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        setPhotoMessage('');

        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setPhotoMessage('Choose an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const source = String(reader.result || '');
            const image = new Image();
            image.onload = () => {
                setPhotoCropImageSize({
                    width: image.naturalWidth,
                    height: image.naturalHeight
                });
            };
            image.src = source;
            setPhotoCropSource(source);
            setPhotoCrop({ cropX: 50, cropY: 50, zoom: 1 });
        };
        reader.onerror = () => setPhotoMessage('Could not read that image.');
        reader.readAsDataURL(file);
    };

    const handlePhotoDragStart = (event) => {
        if (!photoCropSource) return;
        event.currentTarget.setPointerCapture?.(event.pointerId);
        setPhotoDragStart({
            clientX: event.clientX,
            clientY: event.clientY,
            cropX: photoCrop.cropX,
            cropY: photoCrop.cropY,
            zoom: photoCrop.zoom,
            imageSize: photoCropImageSize
        });
    };

    const handlePhotoDragMove = (event) => {
        if (!photoDragStart) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const horizontalDelta = ((event.clientX - photoDragStart.clientX) / rect.width) * 100;
        const verticalDelta = ((event.clientY - photoDragStart.clientY) / rect.height) * 100;
        const startLayout = getPhotoCropLayout(photoDragStart.imageSize, photoDragStart);

        setPhotoCrop(current => ({
            ...current,
            cropX: clampPercent(photoDragStart.cropX - (horizontalDelta / startLayout.width)),
            cropY: clampPercent(photoDragStart.cropY - (verticalDelta / startLayout.height))
        }));
    };

    const handlePhotoDragEnd = (event) => {
        event.currentTarget.releasePointerCapture?.(event.pointerId);
        setPhotoDragStart(null);
    };

    const handleApplyPhotoCrop = async () => {
        if (!photoCropSource) return;

        try {
            const croppedPhoto = await cropPhotoToDataUrl(photoCropSource, photoCrop);
            updateDraft('photoKey', croppedPhoto);
            setPhotoCropSource('');
            setPhotoCropImageSize(null);
            setPhotoMessage('Profile photo updated. Save the profile to keep it.');
        } catch (error) {
            setPhotoMessage(error.message);
        }
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

    const buildProfileForSave = () => {
        const jobs = getJobsForDraft(profileDraft)
            .map(job => ({
                employer: String(job.employer || '').trim(),
                industry: String(job.industry || '').trim(),
                title: String(job.title || '').trim(),
                sector: String(job.sector || '').trim()
            }))
            .filter(job => job.employer || job.industry || job.title || job.sector);
        const primaryJob = jobs[0] || emptyJob();
        const baseProfile = {
            ...profileDraft,
            fullName: String(profileDraft.fullName || '').trim(),
            classYear: normalizeYearInput(profileDraft.classYear),
            email: String(profileDraft.email || '').trim(),
            linkedinUrl: String(profileDraft.linkedinUrl || '').trim(),
            location: String(profileDraft.location || '').trim(),
            bio: String(profileDraft.bio || '').trim(),
            interests: fromInterestText(profileDraft.interestsText || ''),
            jobs
        };

        if (profileDraft.profileType === 'uva-undergraduate-alumni') {
            return {
                ...baseProfile,
                currentTitle: profileDraft.status === 'current' ? 'Undergraduate Student' : 'UVA Alumni',
                currentOrg: 'University of Virginia',
                industry: profileDraft.status === 'current' ? 'Current Student' : 'UVA Alumni',
                lawSchool: '',
                gradSchool: '',
                undergraduateSchool: '',
                degreeTitle: '',
                affiliatedWithUjlp: true
            };
        }

        if (profileDraft.profileType === 'uva-law-student') {
            return {
                ...baseProfile,
                status: 'current',
                currentTitle: primaryJob.title || 'UVA Law Student',
                currentOrg: primaryJob.employer || 'University of Virginia School of Law',
                industry: primaryJob.industry || 'Law School',
                pathType: 'law-school',
                lawSchool: 'University of Virginia School of Law',
                degreeTitle: 'Juris Doctor',
                ujlpRole: profileDraft.affiliatedWithUjlp ? profileDraft.ujlpRole : ''
            };
        }

        if (profileDraft.profileType === 'unaffiliated') {
            return {
                ...baseProfile,
                status: 'alumni',
                currentTitle: primaryJob.title || '',
                currentOrg: primaryJob.employer || '',
                industry: primaryJob.industry || primaryJob.sector || '',
                pathType: jobSectorToPathType(primaryJob.sector),
                ujlpRole: '',
                classYear: ''
            };
        }

        return baseProfile;
    };

    const getProfileValidationMessage = () => {
        if (!profileDraft.profileType) return 'Select a profile type before saving.';
        if (!String(profileDraft.fullName || '').trim()) return 'Full name is required.';
        if (!String(profileDraft.email || '').trim()) return 'Preferred email is required.';
        if (!profileDraft.photoKey || profileDraft.photoKey === 'blank') return 'Profile image is required.';
        if (!String(profileDraft.bio || '').trim()) return 'Bio is required.';

        if (profileDraft.profileType === 'uva-undergraduate-alumni') {
            if (!normalizeYearInput(profileDraft.classYear)) return 'UVA class year is required.';
            if (!profileDraft.status) return 'Club status is required.';
            if (!profileDraft.ujlpRole) return 'Highest UJLP role is required.';
            if (!profileDraft.undergradMajor) return 'Major is required.';
            if (!profileDraft.pathType) return 'Anticipated path is required.';
        }

        if (profileDraft.profileType === 'uva-law-student') {
            if (!normalizeYearInput(profileDraft.classYear)) return 'UVA Law class year is required.';
            if (!String(profileDraft.undergraduateSchool || '').trim()) return 'Undergraduate school is required.';
            if (!String(profileDraft.undergradMajor || '').trim()) return 'Undergraduate major is required.';
            if (profileDraft.affiliatedWithUjlp && !profileDraft.ujlpRole) return 'Highest UJLP role is required.';
        }

        if (profileDraft.profileType === 'unaffiliated' && !profileDraft.degreeTitle) {
            return 'Title of highest degree is required.';
        }

        return '';
    };

    const handleProfileSave = async (event) => {
        event.preventDefault();
        if (!profileDraft) return;

        const validationMessage = getProfileValidationMessage();
        if (validationMessage) {
            setProfileMessage(validationMessage);
            return;
        }

        setSaving(true);
        setProfileMessage('');
        try {
            const saved = await saveAlumniProfile(buildProfileForSave(), session);
            setProfiles(current => [saved, ...current.filter(profile => profile.id !== saved.id && profile.userId !== saved.userId)]);
            setProfileDraft({ ...saved, interestsText: toInterestText(saved.interests) });
            setProfileMessage('Profile saved.');
            window.dispatchEvent(new Event(ALUMNI_SESSION_EVENT));
        } catch (error) {
            setProfileMessage(error.message);
        } finally {
            setSaving(false);
        }
    };

    const facts = previewProfile ? [
        ['Profile type', getAlumniProfileTypeLabel(previewProfile)],
        ['UJLP role', previewProfile.ujlpRole],
        [previewProfile.profileType === 'uva-law-student' ? 'Law class year' : 'Class year', previewProfile.classYear],
        ['Path', getPathLabel(previewProfile)],
        ['Current title', getPrimaryAlumniJob(previewProfile)?.title || previewProfile.currentTitle],
        ['Employer / school', getAlumniPrimaryOrg(previewProfile)],
        ['Major or program', previewProfile.undergradMajor],
        ['Highest degree', previewProfile.degreeTitle],
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
                                type="text"
                                value={profileInviteCode}
                                onChange={(event) => setProfileInviteCode(event.target.value)}
                                placeholder="Enter invite code"
                                autoCapitalize="characters"
                            />
                        </label>
                        <button type="submit" className="alumni-primary-action">Create profile</button>
                    </form>
                    {profileInviteMessage && <p className="alumni-form-message">{profileInviteMessage}</p>}
                </div>
            </div>
        </section>
    );

    const renderProfileTypeQuestionnaire = () => (
        <div className="alumni-profile-type alumni-wide">
            <div>
                <span>Questionnaire</span>
                <strong>Please select one option.</strong>
            </div>
            <div className="alumni-profile-type-grid">
                {profileTypeOptions.map(option => (
                    <button
                        type="button"
                        key={option.value}
                        className={profileDraft.profileType === option.value ? 'active' : ''}
                        onClick={() => selectProfileType(option.value)}
                    >
                        <strong>{option.title}</strong>
                        <span>{option.summary}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderRoleSelect = (required = true) => (
        <label>
            <span>Highest UJLP Role{required ? '*' : ''}</span>
            <select
                value={profileDraft.ujlpRole || ''}
                onChange={(event) => updateDraft('ujlpRole', event.target.value)}
                required={required}
            >
                <option value="">Select role</option>
                {getSelectOptions(ujlpRoleOptions, profileDraft.ujlpRole).map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>
        </label>
    );

    const renderPhotoManager = () => (
        <div className="alumni-photo-manager">
            <div className="alumni-photo-current">
                <img src={getAlumniPhoto(profileDraft.photoKey || 'blank')} alt="" />
            </div>
            <div className="alumni-photo-controls">
                <span>Profile Image*</span>
                <p>Upload an image, then drag or adjust it inside the circle.</p>
                <label className="alumni-photo-upload">
                    <input type="file" accept="image/*" onChange={handlePhotoFileChange} />
                    <span>Choose image</span>
                </label>
                {profileDraft.photoKey !== 'blank' && (
                    <button type="button" className="alumni-secondary-action" onClick={() => updateDraft('photoKey', 'blank')}>Remove photo</button>
                )}
            </div>
            {photoCropSource && (
                <div className="alumni-photo-cropper">
                    <div
                        className={`alumni-photo-crop-preview${photoDragStart ? ' is-dragging' : ''}`}
                        role="img"
                        aria-label="Profile image crop preview"
                        onPointerDown={handlePhotoDragStart}
                        onPointerMove={handlePhotoDragMove}
                        onPointerUp={handlePhotoDragEnd}
                        onPointerCancel={handlePhotoDragEnd}
                    >
                        <img
                            src={photoCropSource}
                            alt=""
                            draggable="false"
                            style={getPhotoCropImageStyle(photoCropImageSize, photoCrop)}
                        />
                    </div>
                    <div className="alumni-photo-sliders">
                        <label>
                            <span>Zoom</span>
                            <input
                                type="range"
                                min="1"
                                max="3"
                                step="0.05"
                                value={photoCrop.zoom}
                                onChange={(event) => setPhotoCrop(current => ({ ...current, zoom: Number(event.target.value) }))}
                            />
                        </label>
                        <label>
                            <span>Horizontal position</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={photoCrop.cropX}
                                onChange={(event) => setPhotoCrop(current => ({ ...current, cropX: Number(event.target.value) }))}
                            />
                        </label>
                        <label>
                            <span>Vertical position</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={photoCrop.cropY}
                                onChange={(event) => setPhotoCrop(current => ({ ...current, cropY: Number(event.target.value) }))}
                            />
                        </label>
                        <div className="alumni-photo-crop-actions">
                            <button type="button" className="alumni-primary-action" onClick={handleApplyPhotoCrop}>Use cropped photo</button>
                            <button type="button" className="alumni-secondary-action" onClick={() => {
                                setPhotoCropSource('');
                                setPhotoCropImageSize(null);
                            }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {photoMessage && <p className="alumni-form-message">{photoMessage}</p>}
        </div>
    );

    const renderContactFields = () => (
        <>
            <div className="alumni-image-email-row alumni-wide">
                <label>
                    <span>Preferred Email*</span>
                    <input
                        type="email"
                        value={profileDraft.email || ''}
                        onChange={(event) => updateDraft('email', event.target.value)}
                        required
                    />
                </label>
                {renderPhotoManager()}
            </div>
            <label>
                <span>Location</span>
                <input
                    type="text"
                    list="alumni-location-suggestions"
                    value={profileDraft.location || ''}
                    onChange={(event) => updateDraft('location', event.target.value)}
                    placeholder="City, ST"
                />
            </label>
            <label>
                <span>LinkedIn URL</span>
                <input
                    type="url"
                    value={profileDraft.linkedinUrl || ''}
                    onChange={(event) => updateDraft('linkedinUrl', event.target.value)}
                    placeholder="https://www.linkedin.com/in/..."
                />
            </label>
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
                <span>Bio*</span>
                <textarea
                    value={profileDraft.bio || ''}
                    onChange={(event) => updateDraft('bio', event.target.value)}
                    rows="4"
                    required
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
            <datalist id="alumni-location-suggestions">
                {locationSuggestions.map(location => <option key={location} value={location} />)}
            </datalist>
        </>
    );

    const renderUndergraduateAlumniFields = () => {
        const selectedPath = anticipatedPathOptions.some(([value]) => value === profileDraft.pathType)
            ? anticipatedPathOptions
            : [[profileDraft.pathType, getPathLabel(profileDraft)], ...anticipatedPathOptions].filter(([value]) => value);

        return (
            <>
                <label>
                    <span>Full Name*</span>
                    <input value={profileDraft.fullName || ''} onChange={(event) => updateDraft('fullName', event.target.value)} required />
                </label>
                <label>
                    <span>UVA Class Year*</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength="4"
                        value={profileDraft.classYear || ''}
                        onChange={(event) => updateYearField(event.target.value)}
                        required
                    />
                </label>
                <label>
                    <span>Club Status*</span>
                    <select value={profileDraft.status || 'current'} onChange={(event) => updateDraft('status', event.target.value)} required>
                        <option value="current">Current UJLP member</option>
                        <option value="alumni">UVA alumni</option>
                    </select>
                </label>
                {renderRoleSelect(true)}
                <label>
                    <span>Major*</span>
                    <select value={profileDraft.undergradMajor || ''} onChange={(event) => updateDraft('undergradMajor', event.target.value)} required>
                        <option value="">Select major</option>
                        {getSelectOptions(uvaMajorOptions, profileDraft.undergradMajor).map(major => (
                            <option key={major} value={major}>{major}</option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>Anticipated Path*</span>
                    <select value={profileDraft.pathType || ''} onChange={(event) => updateDraft('pathType', event.target.value)} required>
                        <option value="">Select path</option>
                        {selectedPath.map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </label>
                {renderContactFields()}
            </>
        );
    };

    const renderLawStudentFields = () => {
        const jobs = getJobsForDraft(profileDraft);

        return (
            <>
                <label>
                    <span>Full Name*</span>
                    <input value={profileDraft.fullName || ''} onChange={(event) => updateDraft('fullName', event.target.value)} required />
                </label>
                <label>
                    <span>UVA Law Class Year*</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength="4"
                        value={profileDraft.classYear || ''}
                        onChange={(event) => updateYearField(event.target.value)}
                        required
                    />
                </label>
                <label>
                    <span>Undergraduate School*</span>
                    <input value={profileDraft.undergraduateSchool || ''} onChange={(event) => updateDraft('undergraduateSchool', event.target.value)} required />
                </label>
                <label>
                    <span>Undergraduate Major*</span>
                    <input value={profileDraft.undergradMajor || ''} onChange={(event) => updateDraft('undergradMajor', event.target.value)} required />
                </label>
                <label className="alumni-checkbox alumni-wide">
                    <input
                        type="checkbox"
                        checked={profileDraft.affiliatedWithUjlp}
                        onChange={(event) => updateDraft('affiliatedWithUjlp', event.target.checked)}
                    />
                    <span>I am affiliated with the UJLP</span>
                </label>
                {profileDraft.affiliatedWithUjlp && (
                    <div className="alumni-wide alumni-nested-field">
                        {renderRoleSelect(true)}
                    </div>
                )}
                <div className="alumni-job-list alumni-wide">
                    {jobs.map((job, index) => (
                        <div className="alumni-job-entry" key={`law-job-${index}`}>
                            <label>
                                <span>Employer</span>
                                <input value={job.employer || ''} onChange={(event) => updateJob(index, 'employer', event.target.value)} />
                            </label>
                            <label>
                                <span>Employer Industry</span>
                                <select value={job.industry || ''} onChange={(event) => updateJob(index, 'industry', event.target.value)}>
                                    <option value="">Select industry</option>
                                    {getSelectOptions(employerIndustryOptions, job.industry).map(industry => (
                                        <option key={industry} value={industry}>{industry}</option>
                                    ))}
                                </select>
                            </label>
                            {jobs.length > 1 && (
                                <button type="button" className="alumni-secondary-action alumni-job-remove" onClick={() => removeJob(index)}>Remove job</button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="alumni-secondary-action alumni-add-job" onClick={addJob}>+ Add another job</button>
                </div>
                {renderContactFields()}
            </>
        );
    };

    const renderUnaffiliatedFields = () => {
        const jobs = getJobsForDraft(profileDraft);

        return (
            <>
                <label>
                    <span>Full Name*</span>
                    <input value={profileDraft.fullName || ''} onChange={(event) => updateDraft('fullName', event.target.value)} required />
                </label>
                <label>
                    <span>Title of Highest Degree*</span>
                    <select value={profileDraft.degreeTitle || ''} onChange={(event) => updateDraft('degreeTitle', event.target.value)} required>
                        <option value="">Select degree</option>
                        {getSelectOptions(degreeTitleOptions, profileDraft.degreeTitle).map(degree => (
                            <option key={degree} value={degree}>{degree}</option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>Undergraduate School</span>
                    <input value={profileDraft.undergraduateSchool || ''} onChange={(event) => updateDraft('undergraduateSchool', event.target.value)} />
                </label>
                <label>
                    <span>Graduate or Law School</span>
                    <input value={profileDraft.gradSchool || ''} onChange={(event) => updateDraft('gradSchool', event.target.value)} />
                </label>
                <div className="alumni-job-list alumni-wide">
                    {jobs.map((job, index) => (
                        <div className="alumni-job-entry alumni-job-entry-wide" key={`unaffiliated-job-${index}`}>
                            <label>
                                <span>Employer</span>
                                <input value={job.employer || ''} onChange={(event) => updateJob(index, 'employer', event.target.value)} />
                            </label>
                            <label>
                                <span>Employer Industry</span>
                                <select value={job.industry || ''} onChange={(event) => updateJob(index, 'industry', event.target.value)}>
                                    <option value="">Select industry</option>
                                    {getSelectOptions(employerIndustryOptions, job.industry).map(industry => (
                                        <option key={industry} value={industry}>{industry}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                <span>Job Title</span>
                                <input value={job.title || ''} onChange={(event) => updateJob(index, 'title', event.target.value)} />
                            </label>
                            <label>
                                <span>Job Sector</span>
                                <select value={job.sector || ''} onChange={(event) => updateJob(index, 'sector', event.target.value)}>
                                    <option value="">Select sector</option>
                                    {getSelectOptions(jobSectorOptions, job.sector).map(sector => (
                                        <option key={sector} value={sector}>{sector}</option>
                                    ))}
                                </select>
                            </label>
                            {jobs.length > 1 && (
                                <button type="button" className="alumni-secondary-action alumni-job-remove" onClick={() => removeJob(index)}>Remove job</button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="alumni-secondary-action alumni-add-job" onClick={addJob}>+ Add another job</button>
                </div>
                {renderContactFields()}
            </>
        );
    };

    const renderProfileFields = () => {
        if (profileDraft.profileType === 'uva-undergraduate-alumni') return renderUndergraduateAlumniFields();
        if (profileDraft.profileType === 'uva-law-student') return renderLawStudentFields();
        if (profileDraft.profileType === 'unaffiliated') return renderUnaffiliatedFields();
        return <p className="alumni-system-note alumni-wide">Choose a profile type to continue.</p>;
    };

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
                                <span>{getAlumniProfileTypeLabel(previewProfile)}</span>
                                <span>{previewProfile.willingToChat ? 'Open to outreach' : 'Not currently open'}</span>
                                {!previewProfile.directoryVisible && <b>Hidden</b>}
                            </div>
                            <h2>{getProfileName(previewProfile)}</h2>
                            <p>{getAlumniProfileLine(previewProfile) || 'Profile details pending'}</p>
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
                        {renderProfileTypeQuestionnaire()}
                        {renderProfileFields()}
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
