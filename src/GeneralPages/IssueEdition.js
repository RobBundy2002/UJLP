import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ParticleBackground from '../Components/ParticleBackground';
import { articles, issues } from '../Data/journalData';
import '../Styling/EditorialPages.css';
import '../Styling/Home.css';
import '../Styling/IssueLanding.css';

function IssueEdition() {
    const { issueId } = useParams();
    const issue = issues.find(item => item.id === issueId && item.id !== 'all');

    if (!issue) {
        return <Navigate to="/journal/index" replace />;
    }

    const issueArticles = articles
        .filter(article => article.issue === issueId)
        .sort((left, right) => left.articleNumber - right.articleNumber);
    const featuredArticle = issueArticles[0];
    const issuePublished = issue.publicationDate || issue.label;

    return (
        <div className="issue-edition-page jh-page jh-issue fade-in" style={{ '--issue-accent': issue.accent || '#f18c62' }}>
            <section className="issue-edition-hero">
                <ParticleBackground />
                <div className="section-content">
                    <p className="issue-edition-kicker"><strong>UJLP</strong> · University of Virginia</p>
                    <h1>Volume {issue.volume || 1}</h1>
                    <p className="issue-edition-subtitle">{issue.label}</p>
                    <div className="issue-edition-meta" aria-label="Issue details">
                        <span>{issuePublished}</span>
                        <span>{issueArticles.length} article{issueArticles.length === 1 ? '' : 's'}</span>
                    </div>
                    <div className="issue-landing-intro">
                        <div className="issue-landing-cover" role="img" aria-label={`Journal cover: Volume ${issue.volume}, Issue ${issue.number}, ${issuePublished}`}>
                            <span>University of Virginia</span>
                            <strong>Undergraduate<br />Journal of<br /><em>Law &amp; Politics</em></strong>
                            <div className="issue-cover-monogram" aria-hidden="true">UJLP</div>
                            <div><span>Volume {issue.volume} · Issue {issue.number}</span><span>{issuePublished}</span></div>
                        </div>
                        <div className="issue-landing-overview">
                            <p className="issue-section-kicker">In this issue</p>
                            <h2>Two inquiries.<br /><em>A wider perspective.</em></h2>
                            <p>{issue.overview}</p>
                            {issue.pdfPath && <a href={issue.pdfPath} download className="issue-edition-button">Download complete issue <span aria-hidden="true">↓</span></a>}
                            <a href="#issue-contents" onClick={event => { event.preventDefault(); const contents = document.getElementById('issue-contents'); if (contents) { window.scrollTo({ top: contents.getBoundingClientRect().top + window.scrollY - 110, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); contents.focus({ preventScroll: true }); } }} className="issue-browse-contents">Explore the contents ↓</a>
                        </div>
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

                    <aside className="issue-edition-contents" id="issue-contents" tabIndex={-1}>
                        <p className="issue-section-kicker">Contents</p>
                        <ol className="issue-edition-list">
                            {issueArticles.map((article) => (
                                <li key={article.pageLink || `${issueId}-${article.articleNumber}`}>
                                    <span className="issue-edition-number">{String(article.articleNumber).padStart(2, '0')}</span>
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
                                            <span>pp. {article.pageRange}</span>
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
