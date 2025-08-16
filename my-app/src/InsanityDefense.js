import React from 'react';
import './Journal.css';

function InsanityDefense() {
    return (
        <div className="article-page fade-in">
            <h1>From 'Wild Beasts' to Human Beings: Rethinking the Insanity Defense in the Age of Mental Health Awareness</h1>
            <p className="article-meta">By Mikayla Grady • June 2025 • Criminal Law</p>
            <div className="pdf-container">
                <iframe
                    src="/insanitydefense.pdf"
                    title="Rethinking the Insanity Defense"
                    width="100%"
                    height="900px"
                    style={{
                        border: '2px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                ></iframe>
            </div>
        </div>
    );
}

export default InsanityDefense;
