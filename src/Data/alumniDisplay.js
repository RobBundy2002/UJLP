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
