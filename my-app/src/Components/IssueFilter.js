import React, { useState } from 'react';
import '../Styling/IssueFilter.css';

const IssueFilter = ({ issues, activeIssue, onIssueChange }) => {
    return (
        <div className="issue-filter">
            <div className="issue-tabs">
                {issues.map((issue) => (
                    <button
                        key={issue.id}
                        className={`issue-tab ${activeIssue === issue.id ? 'active' : ''}`}
                        onClick={() => onIssueChange(issue.id)}
                    >
                        {issue.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default IssueFilter;
