export const issues = [
    { id: 'all', label: 'All Issues' },
    { id: '2026-2', label: '2026 Issue 2', accent: '#8faec8', tone: 'blue' },
    { id: '2026-1', label: '2026 Issue 1', accent: '#f18c62', tone: 'ember' },
];

export const articles = [
    {
        title: 'Unequal Opportunity: Desegregation at the University of Virginia School of Law, 1950–1960',
        author: 'Derek Tsai',
        authorLink: '/author/derek',
        category: 'Civil Rights Law',
        researchSlug: 'civil-rights-law',
        date: 'June 2026',
        issue: '2026-2',
        excerpt: 'This essay uses the experiences of Gregory Swanson and John Merchant at the University of Virginia School of Law to examine the limits of legal measures and the role of social change in achieving equal opportunity in higher education.',
        pageLink: '/dangerousimplications'
    },
    {
        title: 'Schoolhouse Secrets: Parental Rights and Gender Identity Disclosure in the American Classroom',
        author: 'Shelby Eliasek',
        authorLink: '/author/shelby',
        category: 'Education Law',
        researchSlug: 'education-law',
        date: 'January 2026',
        issue: '2026-1',
        excerpt: 'An examination of cases concerning public-school policies, gender-nonconforming names and pronouns, and the rights of parents to be informed of these changes.',
        pageLink: '/schoolhousesecrets'
    },
];

export const getIssueLabel = (issueId) => issues.find(issue => issue.id === issueId)?.label || 'Latest Issue';

export const researchAreas = {
    'civil-rights-law': {
        name: 'Civil Rights Law',
        kicker: 'Equality, institutions, and the unfinished work of law',
        statement: 'Research examining how doctrine, institutions, and individual action shape the practical meaning of equal protection.',
        relatedTopics: ['Equal Opportunity', 'Higher Education', 'Desegregation', 'Institutional Change']
    },
    'education-law': {
        name: 'Education Law',
        kicker: 'Rights and responsibilities inside American classrooms',
        statement: 'Scholarship exploring the legal relationships among students, parents, educators, institutions, and the state.',
        relatedTopics: ['Parental Rights', 'Student Privacy', 'Public Schools', 'Constitutional Rights']
    }
};
