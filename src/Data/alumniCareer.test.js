import { undergraduateCareerDetails } from './alumniCareer';

test('saving a UVA profile preserves entered schools and a company', () => {
    const result = undergraduateCareerDetails({ status: 'alumni', gradSchool: ' Georgetown ', lawSchool: ' UVA Law ' }, [{ employer: 'Example Company', title: 'Analyst', industry: 'Consulting' }]);
    expect(result).toEqual({ currentTitle: 'Analyst', currentOrg: 'Example Company', industry: 'Consulting', lawSchool: 'UVA Law', gradSchool: 'Georgetown' });
});

test('education-only and empty profiles have sensible organization fallbacks', () => {
    expect(undergraduateCareerDetails({ status: 'alumni', gradSchool: 'Example Graduate School' }, []).currentOrg).toBe('Example Graduate School');
    expect(undergraduateCareerDetails({ status: 'current' }, []).currentOrg).toBe('University of Virginia');
    expect(undergraduateCareerDetails({ status: 'current' }, []).currentTitle).toBe('Undergraduate Student');
});
