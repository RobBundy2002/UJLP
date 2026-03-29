import React from 'react';
import '../Styling/Journal.css';
import profilePic from '../ProfilePictures/Derek.png';
import PDFViewer from '../Components/PDFViewer';
import CiteShare from '../Components/CiteShare';

function DangerousImplications() {
    return (
        <div className="article-page fade-in">
            <div id="article-content">
                <h1>
                    Dangerous Implications: The application of corporate personhood and its threat to democracy
                </h1>
                <p className="article-meta">By Derek Tsai • January 2026 • International Law • 2026 Issue 1</p>

                <div className="article-summary">
                    <h2>Summary</h2>
                    <p>
                        This article explores the concept of corporate personhood and its influence on democratic processes.
                        It examines the legal and political implications of granting corporations rights similar to those of
                        individuals, and how this status can undermine democratic accountability and public interest.
                    </p>
                </div>

                <PDFViewer 
                    pdfPath="/ArticlePDFs/Untitled document.pdf"
                    title="Dangerous Implications: The application of corporate personhood and its threat to democracy"
                    author="Derek Tsai"
                />

                <div className="pdf-actions">
                    <a
                        href="/ArticlePDFs/Untitled%20document.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta-button pdf-button"
                    >
                        📄 Open Full PDF
                    </a>
                </div>

                <CiteShare 
                    title={"Dangerous Implications: The application of corporate personhood and its threat to democracy"}
                    author={"Derek Tsai"}
                    date={"2026-01-01"}
                    url={window.location.href}
                />

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
        </div>
    );
}

export default DangerousImplications;
