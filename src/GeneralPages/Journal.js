import React, { useState } from 'react';
import '../Styling/Journal.css';
import '../Styling/Home.css';
import { Link } from 'react-router-dom';
import IssueFilter from '../Components/IssueFilter';
import TypingText from '../Components/TypingText';

const issues = [
    { id: 'all', label: 'All Issues' },
    { id: '2026-1', label: '2026 Issue 1' },
    { id: '2025-2', label: '2025 Issue 2' },
    { id: '2025-1', label: '2025 Issue 1' },
    { id: '2024-2', label: '2024 Issue 2' },
    { id: '2024-1', label: '2024 Issue 1' },
];

const articles = [
    {
        title: "Dangerous Implications: The application of corporate personhood and its threat to democracy",
        author: "Derek Tsai",
        authorLink: "/author/derek",
        category: "International Law",
        date: "January 2026",
        issue: "2026-1",
        excerpt: "An examination of how corporate personhood doctrines impact democratic governance and political power structures.",
        pageLink: "/dangerousimplications"
    },
    {
        title: "Schoolhouse Secrets: Parental Rights and Gender Identity Disclosure in the American Classroom",
        author: "Shelby Eliasek",
        authorLink: "/author/shelby",
        category: "Education Law",
        date: "January 2026",
        issue: "2026-1",
        excerpt: "An examination of cases on public school policies regarding the use of gender non-conforming names and pronouns for students, and the rights of parents to be notified of these changes.",
        pageLink: "/schoolhousesecrets"
    },
    {
        title: "From 'Wild Beasts' to Human Beings: Rethinking the Insanity Defense",
        author: "Mikayla Grady",
        authorLink: "/author/mikayla",
        category: "Criminal Law",
        date: "June 2025",
        issue: "2025-2",
        excerpt: "A critical analysis of how modern mental health understanding should reshape legal approaches to insanity defense.",
        pageLink: "/insanitydefense"
    },
    {
        title: "This Article is in Progress",
        author: "Sarah Johnson",
        category: "International Law",
        date: "Upcoming",
        issue: "2026-2",
        excerpt: "This piece is coming soon.",
        pageLink: "#"
    },
];

function Journal() {
    const [activeIssue, setActiveIssue] = useState('all');

    const filteredArticles = activeIssue === 'all' 
        ? articles 
        : articles.filter(article => article.issue === activeIssue);

    const getIssueLabel = (issueId) => {
        const issue = issues.find(i => i.id === issueId);
        return issue ? issue.label : 'Latest Issue';
    };

    return (
        <div className="journal-container fade-in">
            <section className="journal-hero">
                <div className="section-content">
                    <h1>The Journal</h1>
                    <p className="hero-content">
                        Publishing the best undergraduate research in both law and politics
                    </p>
                </div>
            </section>

            <section className="journal-intro">
                <div className="section-content">
                    <div className="intro-content">
                        <p>
                            Our journal publishes rigorous, peer-reviewed research that explores the intersection of law,
                            politics, and society. Each article represents the culmination of months of research,
                            analysis, and scholarly debate.
                        </p>
                    </div>
                </div>
            </section>

            <section className="journal-articles">
                <div className="section-content">
                    <IssueFilter 
                        issues={issues} 
                        activeIssue={activeIssue} 
                        onIssueChange={setActiveIssue} 
                    />
                    <h2>Latest Publications</h2>
                    {filteredArticles.length === 0 ? (
                        <div className="no-articles">
                            <p>No articles found for this issue.</p>
                        </div>
                    ) : (
                        <div className="articles-grid">
                            {filteredArticles.map((article, index) => (
                                <article className="article-card" key={index}>
                                    <div className="article-content">
                                        <span className="article-category">
                                            <TypingText text={article.category} speed={80} delay={index * 100} />
                                        </span>
                                        <div className="article-issue-badge">
                                            {getIssueLabel(article.issue)}
                                        </div>
                                        <h3>{article.title}</h3>
                                        <p className="article-meta">
                                            By {article.authorLink ? (
                                                <Link to={article.authorLink} className="author-link">{article.author}</Link>
                                            ) : (
                                                article.author
                                            )} • {article.date}
                                        </p>
                                        <p className="article-excerpt">{article.excerpt}</p>
                                        <Link to={article.pageLink} className="article-link">Read Article →</Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="journal-cta">
                <div className="section-content">
                    <h2>Contribute to Our Journal</h2>
                    <p>We welcome submissions from undergraduate students interested in legal and political research.</p>
                    <div className="cta-buttons">
                        <a href="#/jointheteam" className="cta-button">Submit Your Work</a>
                        <a href="#/about" className="cta-button">Learn More</a>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Journal;
