import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ParticleBackground from '../Components/ParticleBackground';
import { articles, getIssueLabel, issues } from '../Data/journalData';

function PublicationIndex() {
    const location = useLocation();
    const requestedIssue = new URLSearchParams(location.search).get('issue');
    const [query, setQuery] = useState('');
    const [issue, setIssue] = useState(issues.some(item => item.id === requestedIssue) ? requestedIssue : 'all');
    const normalizedQuery = query.trim().toLowerCase();
    const visibleArticles = useMemo(() => articles.filter(article => {
        const matchesIssue = issue === 'all' || article.issue === issue;
        const searchable = `${article.title} ${article.author} ${article.category}`.toLowerCase();
        return matchesIssue && (!normalizedQuery || searchable.includes(normalizedQuery));
    }), [issue, normalizedQuery]);

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
                <div className="index-count"><span>{String(visibleArticles.length).padStart(2, '0')}</span> published works</div>
                <div className="index-ledger">
                    {visibleArticles.map((article, index) => <article key={article.pageLink}>
                        <span className="index-number">{String(index + 1).padStart(2, '0')}</span>
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
