import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ParticleBackground from '../Components/ParticleBackground';
import { articles, getIssueLabel, issues, researchAreas } from '../Data/journalData';

const editorialWorkflow = [
    ['Intake', 'Published work is tagged by issue, author, and research field.'],
    ['Field map', 'Topics are connected to the legal questions they share.'],
    ['Reader path', 'Each field page becomes a guided route into the scholarship.']
];

function PublicationIndex() {
    const location = useLocation();
    const requestedIssue = new URLSearchParams(location.search).get('issue');
    const [query, setQuery] = useState('');
    const [issue, setIssue] = useState(issues.some(item => item.id === requestedIssue) ? requestedIssue : 'all');
    const normalizedQuery = query.trim().toLowerCase();
    const visibleArticles = useMemo(() => articles
        .filter(article => {
            const matchesIssue = issue === 'all' || article.issue === issue;
            const searchable = `${article.title} ${article.author} ${article.category}`.toLowerCase();
            return matchesIssue && (!normalizedQuery || searchable.includes(normalizedQuery));
        })
        .sort((left, right) => left.articleNumber - right.articleNumber), [issue, normalizedQuery]);
    const fieldEntries = useMemo(() => Object.entries(researchAreas).map(([slug, area]) => ({
        slug,
        area,
        articles: articles
            .filter(article => article.researchSlug === slug)
            .sort((left, right) => left.articleNumber - right.articleNumber)
    })), []);

    return (
        <div className="publication-index-page jh-page fade-in">
            <section className="publication-index-hero"><ParticleBackground /><div className="section-content">
                <p>UJLP · Permanent archive</p><h1>Every article,<br /><em>carefully indexed.</em></h1>
                <span>A complete record of published undergraduate scholarship, its authors, fields, and journal issues.</span>
            </div></section>
            <section className="publication-index-body"><div className="section-content">
                <div className="index-tools">
                    <label><span>Search the index</span><input value={query} onChange={event => setQuery(event.target.value)} type="search" placeholder="Title, author, or research area" /></label>
                    <div className="index-issue-tabs" aria-label="Filter complete index by issue">
                        {issues.map(item => <button key={item.id} type="button" className={issue === item.id ? 'active' : ''} onClick={() => setIssue(item.id)}>{item.label}</button>)}
                    </div>
                </div>
                <div className="field-index-console" aria-label="Research field visual index">
                    <div className="field-index-map">
                        <div className="field-index-panel-heading">
                            <span>Research field map</span>
                            <strong>{fieldEntries.length} active fields</strong>
                        </div>
                        <div className="field-index-map-stage">
                            <svg viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
                                <path d="M180 290 C 330 150, 570 145, 820 260" />
                                <path d="M240 360 C 405 460, 610 455, 780 345" />
                                <path d="M500 92 L500 430" className="field-index-axis" />
                                <path d="M130 260 L870 260" className="field-index-axis" />
                            </svg>
                            <div className="field-index-core">
                                <span>UJLP</span>
                                <strong>{String(articles.length).padStart(2, '0')}</strong>
                                <small>published works</small>
                            </div>
                            {fieldEntries.map(({ slug, area, articles: fieldArticles }, index) => (
                                <Link
                                    key={slug}
                                    className={`field-map-node field-map-node-${index + 1}`}
                                    style={area.mapPosition}
                                    to={`/research/${slug}`}
                                >
                                    <span>{String(index + 1).padStart(2, '0')}</span>
                                    <strong>{area.name}</strong>
                                    <small>{fieldArticles.length} work{fieldArticles.length === 1 ? '' : 's'}</small>
                                </Link>
                            ))}
                            <div className="field-map-coordinate field-map-coordinate-left">Law</div>
                            <div className="field-map-coordinate field-map-coordinate-right">Politics</div>
                        </div>
                    </div>
                    <div className="field-index-workflow">
                        <div className="field-index-panel-heading">
                            <span>Index workflow</span>
                            <strong>From article to field route</strong>
                        </div>
                        <ol>
                            {editorialWorkflow.map(([label, description], index) => (
                                <li key={label}>
                                    <span>{String(index + 1).padStart(2, '0')}</span>
                                    <div>
                                        <strong>{label}</strong>
                                        <p>{description}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className="field-topic-board">
                        <div className="field-index-panel-heading">
                            <span>Topic matrix</span>
                            <strong>Questions behind the archive</strong>
                        </div>
                        <div className="field-topic-grid">
                            {fieldEntries.map(({ slug, area }) => (
                                <article key={slug}>
                                    <span>{area.axis}</span>
                                    <h2><Link to={`/research/${slug}`}>{area.name}</Link></h2>
                                    <p>{area.signal}</p>
                                    <div>{area.relatedTopics.map(topic => <small key={topic}>{topic}</small>)}</div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="index-count"><span>{String(visibleArticles.length).padStart(2, '0')}</span> published works</div>
                <div className="index-ledger">
                    {visibleArticles.map(article => <article key={article.pageLink}>
                        <span className="index-number">{String(article.articleNumber).padStart(2, '0')}</span>
                        <div className="index-entry-main"><div><Link to={`/research/${article.researchSlug}`}>{article.category}</Link><span>{getIssueLabel(article.issue)}</span></div><h2><Link to={article.pageLink}>{article.title}</Link></h2></div>
                        <div className="index-byline"><small>Published by</small><Link to={article.authorLink}>{article.author}</Link><span>{article.date}</span></div>
                    </article>)}
                </div>
                {!visibleArticles.length && <p className="index-empty">No published work matches this search.</p>}
            </div></section>
        </div>
    );
}

export default PublicationIndex;
