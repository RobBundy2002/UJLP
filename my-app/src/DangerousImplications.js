import React from 'react';
import './Journal.css';

function DangerousImplications() {
    return (
        <div className="article-page fade-in">
            <h1>Dangerous Implications: The application of corporate personhood and its threat to democracy</h1>
            <p className="article-meta">By Derek Tsai • June 2025 • International Law</p>
            <div className="pdf-container">
                <iframe
                    src="/dangerousimplications.pdf"
                    title="Dangerous Implications"
                    width="100%"
                    height="800px"
                ></iframe>
            </div>
        </div>
    );
}

export default DangerousImplications;
