import React from 'react';
import '../Styling/Journal.css';
import profilePic from '../ProfilePictures/Derek.png';

function DangerousImplications() {
    return (
        <div className="article-page fade-in">
            <h1>
                Dangerous Implications: The application of corporate personhood and its threat to democracy
            </h1>
            <p className="article-meta">By Derek Tsai • June 2025 • International Law</p>

            <div className="article-summary">
                <h2>Summary</h2>
                <p>
                    This article explores the concept of corporate personhood and its influence on democratic processes.
                    It examines the legal and political implications of granting corporations rights similar to those of
                    individuals, and how this status can undermine democratic accountability and public interest.
                </p>
            </div>

            <div className="pdf-container">
                <object
                    data="/ArticlePDFs/dangerousimplications.pdf"
                    type="application/pdf"
                    width="100%"
                    height="70vh"
                    style={{ border: 'none', borderRadius: '8px', overflow: 'auto' }}
                >
                    <p>
                        Your browser does not support PDFs.{' '}
                        <a
                            href="/ArticlePDFs/dangerousimplications.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Download PDF
                        </a>
                        .
                    </p>
                </object>
            </div>

            <footer className="article-footer">
                <div className="author-info">
                    <img
                        src={profilePic}
                        alt="Derek Tsai"
                        className="author-profile-pic"
                    />
                    <span className="author-name">Derek Tsai</span>
                </div>
                <div className="author-details">
                    <span>Class of 2028 • International Law</span>
                </div>
            </footer>
        </div>
    );
}

export default DangerousImplications;
