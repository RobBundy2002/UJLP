import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function IssueShelf({ issues, articles }) {
    const publishedIssues = issues.filter(issue => issue.id !== 'all');
    const navigate = useNavigate();
    const [activeIssueId, setActiveIssueId] = useState(null);

    const isMobileViewport = () => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(max-width: 760px)').matches;
    };

    const openIssue = (issueId) => {
        if (isMobileViewport()) {
            navigate(`/journal/issue/${issueId}`);
            return;
        }

        if (activeIssueId === issueId) {
            navigate(`/journal/issue/${issueId}`);
            return;
        }

        setActiveIssueId(issueId);
    };

    return (
        <div className="issue-shelf reading-room" aria-label="Published journal issues">
            <div className="issue-shelf-heading">
                <div><span>The digital reading room</span><strong>Enter the current issue</strong></div>
                <Link to="/journal/index">Open complete index <span>↗</span></Link>
            </div>
            <div className="reading-room-atmosphere" aria-hidden="true"><span>UJLP</span><i /><b>Est. 2024</b></div>
            <div className="issue-volumes">
                {publishedIssues.map((issue, index) => {
                    const issueArticles = articles.filter(article => article.issue === issue.id);
                    return (
                        <button
                            type="button"
                            className={`issue-volume issue-${issue.tone || 'blue'} ${activeIssueId === issue.id ? 'opening' : ''}`}
                            key={issue.id}
                            onClick={() => openIssue(issue.id)}
                            aria-pressed={activeIssueId === issue.id}
                            style={{ '--issue-accent': issue.accent || '#f18c62' }}
                            >
                                    <span className="issue-book-pages">
                                        <small>Undergraduate Journal<br />of Law &amp; Politics</small>
                                        <i>Volume 1 · {issue.label.replace(/^\d{4}\s*/, '')}</i>
                                        <strong>Table of Contents</strong>
                                        <ol className="issue-book-contents">
                                            {issueArticles.map((article) => (
                                                <li key={article.pageLink || article.title}>
                                                    <span>{String(article.articleNumber).padStart(2, '0')}</span>
                                                    <strong>{article.title}</strong>
                                                    <em>{article.author} · pp. {article.pageRange}</em>
                                                </li>
                                            ))}
                                        </ol>
                                        <span>Click again to enter this issue&nbsp; <u>→</u></span>
                                        <b>University of Virginia · 2026</b>
                                    </span>
                                    <span className="issue-book-cover">
                                        <span className="issue-cover-face">
                                        <span className="issue-cover-frame" aria-hidden="true" />
                                        <span className="issue-volume-copy">
                                            <span className="issue-cover-mark" aria-hidden="true">
                                                <span className="issue-logo-kicker">THE</span>
                                                <strong>UJLP</strong>
                                                <i />
                                                <span className="issue-logo-footer">LAW · POLITICS</span>
                                            </span>
                                            <strong>Volume 1</strong>
                                            <em>Issue {publishedIssues.length - index}</em>
                                            {issueArticles.length > 1 ? (
                                                <span className="issue-volume-count">{issueArticles.length} articles</span>
                                            ) : null}
                                            <small className="issue-cover-university">University of Virginia · 2026</small>
                                        </span>
                                        <span className="issue-volume-arrow">↗</span>
                                    </span>
                                </span>
                            </button>
                        );
                })}
            </div>
            <div className="issue-shelf-base" aria-hidden="true"><span>Undergraduate Journal of Law &amp; Politics</span></div>
        </div>
    );
}

export default IssueShelf;
