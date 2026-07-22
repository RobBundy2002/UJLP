import React, { useState } from 'react';
import ParticleBackground from '../Components/ParticleBackground';
import '../Styling/Journal.css';
import '../Styling/Home.css';
import '../Styling/EditorialPages.css';
import { Link } from 'react-router-dom';
import IssueFilter from '../Components/IssueFilter';

const issues = [
    { id: 'all', label: 'All Issues' },
    { id: '2026-2', label: '2026 Issue 2' },
    { id: '2026-1', label: '2026 Issue 1' },
];

const articles = [
    {
        title: "Unequal Opportunity: Desegregation at the University of Virginia School of Law, 1950–1960",
        author: "Derek Tsai",
        authorLink: "/author/derek",
        category: "Civil Rights Law",
        date: "June 2026",
        issue: "2026-2",
        excerpt: "This essay relies heavily on\n" +
            "                    the case study of Gregory Swanson and John Merchant at the University of Virginia School of Law\n" +
            "                    to expose the limitations of legal measures in achieving equal opportunity in higher education, and to\n" +
            "                    highlight the importance of individual and social changes in bringing about a permanent pedagogical\n" +
            "                    shift.",
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
        <div className="journal-container jh-page jh-journal fade-in">
            <section className="journal-hero">
                <ParticleBackground />
                <div className="section-content">
                    <p className="jh-journal-kicker"><strong>UJLP</strong> · University of Virginia · Est. 2024</p>
                    <h1>The Journal,<br /><em>in full.</em></h1>
                    <p className="hero-content">
                        Publishing the best undergraduate research in both law and politics
                    </p>
                </div>
            </section>

            <section className="journal-intro">
                <div className="section-content">
                    <div className="jh-journal-statement">
                        <div>
                            <p>What we publish</p>
                            <h2>Research with<br /><em>consequence.</em></h2>
                        </div>
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
                    <p className="jh-issue-label">Browse the archive</p>
                    <IssueFilter 
                        issues={issues} 
                        activeIssue={activeIssue} 
                        onIssueChange={setActiveIssue} 
                    />
                    <div className="jh-journal-heading">
                        <div>
                            <p>The publication index</p>
                            <h2>Every issue.<br /><em>Every argument.</em></h2>
                        </div>
                        <span>A growing record of undergraduate scholarship in law, politics, and public life.</span>
                    </div>
                    {filteredArticles.length === 0 ? (
                        <div className="no-articles">
                            <p>No articles found for this issue.</p>
                        </div>
                    ) : (
                        <div className="articles-grid jh-publications-grid">
                            {filteredArticles.map((article, index) => (
                                <article className="article-card jh-publication" key={index}>
                                    <span className="jh-publication-number">0{index + 1}</span>
                                    <div className="article-content">
                                        <div className="jh-publication-topline"><span>{article.category}</span><span>{getIssueLabel(article.issue)}</span></div>
                                        <h3>{article.title}</h3>
                                        <p className="article-meta">
                                            By {article.authorLink ? (
                                                <Link to={article.authorLink} className="author-link">{article.author}</Link>
                                            ) : (
                                                article.author
                                            )} • {article.date}
                                        </p>
                                        <p className="article-excerpt">{article.excerpt}</p>
                                        <Link to={article.pageLink} className="article-link">Read article <span>→</span></Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Journal;
