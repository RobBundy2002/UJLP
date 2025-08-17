import React from 'react';
import './Journal.css';

function InsanityDefense() {
    return (
        <div className="article-page fade-in">
            <h1>
                From 'Wild Beasts' to Human Beings: Rethinking the Insanity Defense in the Age of Mental Health Awareness
            </h1>
            <p className="article-meta">By Mikayla Grady • June 2025 • Criminal Law</p>

            <div className="pdf-container">
                <object
                    data="/insanitydefense.pdf"
                    type="application/pdf"
                    width= "600px"
                    height="600px"
                    style={{ border: 'none', borderRadius: '8px', overflow: 'auto' }}
                >
                    <p>
                        Your browser does not support PDFs.{' '}
                        <a href="/insanitydefense.pdf" target="_blank" rel="noopener noreferrer">
                            Download PDF
                        </a>
                        .
                    </p>
                </object>
            </div>
        </div>
    );
}

export default InsanityDefense;
