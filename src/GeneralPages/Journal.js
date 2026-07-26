import React from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../Components/ParticleBackground';
import '../Styling/Journal.css';
import '../Styling/Home.css';
import '../Styling/EditorialPages.css';
import ResearchConstellation from '../Components/ResearchConstellation';
import { AnimatedJournalSeal } from '../Components/JournalCinema';
import { articles, issues } from '../Data/journalData';

function Journal() {
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
                        <AnimatedJournalSeal />
                    </div>
                </div>
            </section>

            <section className="journal-articles">
                <div className="section-content">
                    <div className="journal-publication-ledger">
                        <div className="journal-ledger-heading">
                            <div>
                                <p>Published issues</p>
                                <h2>The Journal,<br /><em>in full.</em></h2>
                            </div>
                            <Link to="/journal/index">Open complete index <span>↗</span></Link>
                        </div>
                        {issues.filter(issue => issue.id !== 'all').map(issue => {
                            const issueArticles = articles.filter(article => article.issue === issue.id);
                            return (
                                <section className="journal-issue-group" key={issue.id}>
                                    <div className="journal-issue-label">
                                        <span>Volume 1</span>
                                        <strong>{issue.label}</strong>
                                        <em>{issue.publicationDate || 'Publication date forthcoming'}</em>
                                    </div>
                                    <div className="journal-issue-articles">
                                        {issueArticles.map((article, index) => (
                                            <article key={article.pageLink}>
                                                <span className="journal-article-number">{String(index + 1).padStart(2, '0')}</span>
                                                <div>
                                                    <div className="journal-article-topline"><span>{article.category}</span><span>pp. {article.pageRange}</span></div>
                                                    <h3><Link to={article.pageLink}>{article.title}</Link></h3>
                                                    <p>By <Link to={article.authorLink}>{article.author}</Link> · {article.date}</p>
                                                    <span className="journal-article-excerpt">{article.excerpt}</span>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </div>
            </section>

            <ResearchConstellation />
        </div>
    );
}

export default Journal;
