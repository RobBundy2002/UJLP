import React from 'react';
import './Journal.css';

function DangerousImplications() {
    return (
        <div className="article-page fade-in">
            <h1>
                Dangerous Implications: The application of corporate personhood and its threat to democracy
            </h1>
            <p className="article-meta">By Derek Tsai • June 2025 • International Law</p>

            <div className="pdf-container">
                <object
                    data="/dangerousimplications.pdf"
                    type="application/pdf"
                    width="600px"
                    height="600px"
                    style={{ border: 'none', borderRadius: '8px', overflow: 'auto' }}
                >
                    <p>
                        Your browser does not support PDFs.{' '}
                        <a href="/dangerousimplications.pdf" target="_blank" rel="noopener noreferrer">
                            Download PDF
                        </a>
                        .
                    </p>
                </object>
            </div>
        </div>
    );
}

export default DangerousImplications;
