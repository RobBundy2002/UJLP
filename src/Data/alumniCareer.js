// Preserve optional education and employment when a UVA member saves a profile.
export function undergraduateCareerDetails(profile, jobs) {
    const primaryJob = jobs[0] || {};
    const lawSchool = String(profile.lawSchool || '').trim();
    const gradSchool = String(profile.gradSchool || '').trim();
    return {
        currentTitle: primaryJob.title || (profile.status === 'current' ? 'Undergraduate Student' : 'UVA Alumni'),
        currentOrg: primaryJob.employer || lawSchool || gradSchool || 'University of Virginia',
        industry: primaryJob.industry || (profile.status === 'current' ? 'Current Student' : 'UVA Alumni'),
        lawSchool,
        gradSchool
    };
}
