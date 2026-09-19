const titleCaseToken = (value) => {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
};

export const getCompactAlumniName = (profile, user, fallback = 'Member') => {
    const profileName = String(profile?.fullName || '').trim();
    if (profileName) return profileName.split(/\s+/)[0];

    const emailName = String(user?.email || '')
        .split('@')[0]
        .replace(/[._-]+/g, ' ')
        .trim();

    if (!emailName) return fallback;

    return emailName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(titleCaseToken)
        .join(' ');
};

export const getPrimaryAlumniJob = (profile) => {
    if (!Array.isArray(profile?.jobs)) return null;
    return profile.jobs.find(job => (
        job?.employer ||
        job?.title ||
        job?.industry ||
        job?.sector
    )) || null;
};

export const getAlumniProfileTypeLabel = (profile) => {
    if (profile?.profileType === 'uva-law-student') return 'UVA Law Student';
    if (profile?.profileType === 'unaffiliated') return 'Unaffiliated';
    if (profile?.status === 'current') return 'Current member';
    if (profile?.status === 'alumni') return 'UVA Alumni';
    return 'Member';
};

export const getAlumniPrimaryOrg = (profile) => {
    const primaryJob = getPrimaryAlumniJob(profile);
    return (
        primaryJob?.employer ||
        profile?.currentOrg ||
        profile?.lawSchool ||
        profile?.gradSchool ||
        profile?.undergraduateSchool ||
        ''
    );
};

export const getAlumniProfileLine = (profile) => {
    const primaryJob = getPrimaryAlumniJob(profile);
    const roleOrTitle = profile?.ujlpRole || primaryJob?.title || profile?.currentTitle || getAlumniProfileTypeLabel(profile);
    const classLabel = profile?.classYear
        ? profile?.profileType === 'uva-law-student'
            ? `Law Class of ${profile.classYear}`
            : `Class of ${profile.classYear}`
        : '';
    const org = getAlumniPrimaryOrg(profile);

    return [roleOrTitle, classLabel, org].filter(Boolean).join(' / ');
};
