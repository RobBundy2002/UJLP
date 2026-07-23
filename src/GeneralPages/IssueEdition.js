import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ParticleBackground from '../Components/ParticleBackground';
import { articles, issues } from '../Data/journalData';
import '../Styling/EditorialPages.css';
import '../Styling/Home.css';

function IssueEdition() {
    const { issueId } = useParams();
    const issue = issues.find(item => item.id === issueId);

    if (!issue) {
        return <Navigate to="/journal/index" replace />;
    }

    const issueArticles = articles.filter(article => article.issue === issueId);
    const featuredArticle = issueArticles[0];
    const issuePublished = featuredArticle?.date || issueArticles.find(article => article.date)?.date || issue.label;

    return (
        <div className="issue-edition-page jh-page jh-issue fade-in" style={{ '--issue-accent': issue.accent || '#f18c62' }}>
            <section className="issue-edition-hero">
                <ParticleBackground />
                <div className="section-content">
                    <p className="issue-edition-kicker"><strong>UJLP</strong> · University of Virginia · 2026</p>
                    <h1>Volume 1</h1>
                    <p className="issue-edition-subtitle">{issue.label}</p>
                    <div className="issue-edition-meta" aria-label="Issue details">
                        <span>{issuePublished}</span>
                        <span>{issueArticles.length} article{issueArticles.length === 1 ? '' : 's'}</span>
                    </div>
                </div>
            </section>

            <section className="issue-edition-body">
                <div className="section-content issue-edition-grid">
                    <article className="issue-edition-featured">
                        <p className="issue-section-kicker">Featured article</p>
                        {featuredArticle ? (
                            <>
                                <h2><Link to={featuredArticle.pageLink}>{featuredArticle.title}</Link></h2>
                                <p className="issue-edition-byline">
                                    By {featuredArticle.authorLink ? (
                                        <Link to={featuredArticle.authorLink}>{featuredArticle.author}</Link>
                                    ) : (
                                        featuredArticle.author
                                    )} · {featuredArticle.date}
                                </p>
                                <p className="issue-edition-excerpt">{featuredArticle.excerpt}</p>
                                <div className="issue-edition-actions">
                                    <Link to={featuredArticle.pageLink} className="issue-edition-button">Read article</Link>
                                    <Link to="/journal/index" className="issue-edition-button secondary">Browse archive</Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2>This issue is still being assembled.</h2>
                                <p className="issue-edition-excerpt">New work will appear here as the issue comes together.</p>
                                <div className="issue-edition-actions">
                                    <Link to="/journal/index" className="issue-edition-button">Browse archive</Link>
                                </div>
                            </>
                        )}
                    </article>

                    <aside className="issue-edition-contents">
                        <p className="issue-section-kicker">Contents</p>
                        <ol className="issue-edition-list">
                            {issueArticles.map((article, index) => (
                                <li key={article.pageLink || `${issueId}-${index}`}>
                                    <span className="issue-edition-number">{String(index + 1).padStart(2, '0')}</span>
                                    <div>
                                        <h3><Link to={article.pageLink}>{article.title}</Link></h3>
                                        <p>
                                            <span>
                                                {article.authorLink ? (
                                                    <Link to={article.authorLink}>{article.author}</Link>
                                                ) : (
                                                    article.author
                                                )}
                                            </span>
                                            <span>{article.date}</span>
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </aside>
                </div>
            </section>

            <section className="issue-edition-footer">
                <div className="section-content issue-edition-footer-links">
                    <Link to="/journal" className="issue-edition-footer-link">Back to Journal</Link>
                </div>
            </section>
        </div>
    );
}

export default IssueEdition;
