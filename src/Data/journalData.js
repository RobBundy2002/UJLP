export const issues = [
    { id: 'all', label: 'All Issues' },
    { id: '2026-1', label: '2026 Issue 1', publicationDate: 'May 2026', accent: '#f18c62', tone: 'ember' },
];

export const articles = [
    {
        title: 'Schoolhouse Secrets: Parental Rights and Gender Identity Disclosure in the American Classroom',
        author: 'Shelby Eliasek',
        authorLink: '/author/shelby',
        category: 'Education Law',
        researchSlug: 'education-law',
        date: 'May 2026',
        issue: '2026-1',
        articleNumber: 2,
        pageRange: '15–24',
        excerpt: 'An examination of cases concerning public-school policies, gender-nonconforming names and pronouns, and the rights of parents to be informed of these changes.',
        pageLink: '/schoolhousesecrets'
    },
    {
        title: 'Unequal Opportunity: Desegregation at the University of Virginia School of Law',
        author: 'Derek Tsai',
        authorLink: '/author/derek',
        category: 'Civil Rights Law',
        researchSlug: 'civil-rights-law',
        date: 'May 2026',
        issue: '2026-1',
        articleNumber: 1,
        pageRange: '1–14',
        excerpt: 'This essay uses the experiences of Gregory Swanson and John Merchant at the University of Virginia School of Law to examine the limits of legal measures and the role of social change in achieving equal opportunity in higher education.',
        pageLink: '/unequalopportunity'
    },
];

export const getIssueLabel = (issueId) => {
    const issue = issues.find(item => item.id === issueId);
    if (!issue || issue.id === 'all') return issue?.label || 'Latest Issue';
    return `${issue.label.replace(/^(\d{4})\s+/, '$1 Volume 1 ')}`;
};

export const researchAreas = {
    'civil-rights-law': {
        name: 'Civil Rights Law',
        kicker: 'Equality, institutions, and the unfinished work of law',
        statement: 'Research examining how doctrine, institutions, and individual action shape the practical meaning of equal protection.',
        mapPosition: { left: '27%', top: '39%' },
        axis: 'Institutions and equal protection',
        signal: 'Tracks how formal legal victories move through universities, public systems, and civic life.',
        workflow: [
            { label: 'Archive', description: 'Recover institutional records, litigation history, and first-person accounts.' },
            { label: 'Doctrine', description: 'Place the claims beside equal protection principles and civil-rights enforcement.' },
            { label: 'Institution', description: 'Test how legal change becomes policy, custom, and lived opportunity.' }
        ],
        relatedTopics: ['Equal Opportunity', 'Higher Education', 'Desegregation', 'Institutional Change'],
        topicDetails: [
            { title: 'Equal Opportunity', detail: 'How open access differs from meaningful belonging.' },
            { title: 'Higher Education', detail: 'Universities as legal actors and civic institutions.' },
            { title: 'Desegregation', detail: 'The distance between admission, integration, and power.' },
            { title: 'Institutional Change', detail: 'Where doctrine meets culture, budgets, and governance.' }
        ]
    },
    'education-law': {
        name: 'Education Law',
        kicker: 'Rights and responsibilities inside American classrooms',
        statement: 'Scholarship exploring the legal relationships among students, parents, educators, institutions, and the state.',
        mapPosition: { left: '72%', top: '35%' },
        axis: 'Classrooms, privacy, and public authority',
        signal: 'Follows disputes where family authority, student privacy, and school governance collide.',
        workflow: [
            { label: 'Conflict', description: 'Identify the school policy, disclosure rule, or constitutional claim at stake.' },
            { label: 'Stakeholders', description: 'Map students, parents, educators, administrators, and courts.' },
            { label: 'Balance', description: 'Evaluate the legal standard and the practical classroom consequences.' }
        ],
        relatedTopics: ['Parental Rights', 'Student Privacy', 'Public Schools', 'Constitutional Rights'],
        topicDetails: [
            { title: 'Parental Rights', detail: 'The scope of notice, consent, and family decision-making.' },
            { title: 'Student Privacy', detail: 'How schools handle identity, safety, and confidential information.' },
            { title: 'Public Schools', detail: 'Local policy choices inside constitutional boundaries.' },
            { title: 'Constitutional Rights', detail: 'Claims that reshape the duties of educators and the state.' }
        ]
    }
};
