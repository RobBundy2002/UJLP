import { articles, issues, researchAreas, getIssueLabel } from './journalData';

describe('journal metadata', () => {
    test('published articles reference known issues and research areas', () => {
        const issueIds = new Set(issues.map(issue => issue.id));
        const researchSlugs = new Set(Object.keys(researchAreas));

        articles.forEach(article => {
            expect(issueIds).toContain(article.issue);
            expect(researchSlugs).toContain(article.researchSlug);
        });
    });

    test('article page and author links use internal routes', () => {
        articles.forEach(article => {
            expect(article.pageLink).toMatch(/^\/[a-z0-9/-]+$/);
            expect(article.authorLink).toMatch(/^\/author\/[a-z0-9-]+$/);
        });
    });

    test('article numbers are unique within each issue', () => {
        const seen = new Set();

        articles.forEach(article => {
            const key = `${article.issue}:${article.articleNumber}`;
            expect(seen.has(key)).toBe(false);
            seen.add(key);
        });
    });

    test('research areas include public-facing labels and related topics', () => {
        Object.values(researchAreas).forEach(area => {
            expect(area.name).toBeTruthy();
            expect(area.kicker).toBeTruthy();
            expect(area.statement).toBeTruthy();
            expect(area.relatedTopics.length).toBeGreaterThan(0);
        });
    });

    test('issue labels render publication volume text', () => {
        expect(getIssueLabel('2026-1')).toBe('2026 Volume 1 Issue 1');
        expect(getIssueLabel('missing')).toBe('Latest Issue');
    });
});
