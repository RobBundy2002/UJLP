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
                <div><span>The digital reading room</span><strong>Select a volume from the archive</strong></div>
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
                                        <i>{issue.label}</i>
                                        <strong>{issueArticles[0]?.title || 'Journal issue'}</strong>
                                        <em>Published by {issueArticles[0]?.author || 'UJLP'}</em>
                                        <span>Click again to enter this issue&nbsp; <u>→</u></span>
                                        <b>University of Virginia · 2026</b>
                                    </span>
                                    <span className="issue-book-cover">
                                        <span className="issue-cover-face">
                                        <span className="issue-cover-frame" aria-hidden="true" />
                                        <span className="issue-volume-copy">
                                            <small>University of Virginia · 2026</small>
                                            <span className="issue-cover-mark" aria-hidden="true">UJLP</span>
                                            <strong>Volume 1</strong>
                                            <em>Issue {publishedIssues.length - index}</em>
                                            {issueArticles.length > 1 ? (
                                                <span className="issue-volume-count">{issueArticles.length} articles</span>
                                            ) : null}
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
