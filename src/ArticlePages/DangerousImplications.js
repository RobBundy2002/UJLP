import React from 'react';
import '../Styling/Journal.css';
import profilePic from '../ProfilePictures/Derek.png';
import PDFViewer from '../Components/PDFViewer';

function DangerousImplications() {
    return (
        <div className="article-page fade-in">
            <h1>
                Unequal Opportunity: Desegregation at the University of Virginia School of Law, 1950–1960
            </h1>
            <p className="article-meta">By Derek Tsai • June 2026 • Civil Rights Law • 2026 Issue 2</p>

            <div className="article-summary">
                <h2>Summary</h2>
                <p>
                    In the battle for equal educational opportunity, the law plays a major role in protecting the rights of minority populations; however,
                    scholars often overemphasize the importance of legal progress since it is more concrete and easier to
                    analyze. Indeed, it is the often-neglected history of social change and individuals’ perception that
                    produces lasting improvements. This article aims to accurately document legal history while properly
                    including the social and individual components of the Civil Rights Movement that played a major role
                    in altering the landscape of American higher education. More specifically, this essay relies heavily on
                    the case study of Gregory Swanson and John Merchant at the University of Virginia School of Law
                    to expose the limitations of legal measures in achieving equal opportunity in higher education, and to
                    highlight the importance of individual and social changes in bringing about a permanent pedagogical
                    shift.
                </p>
            </div>

            <PDFViewer 
                pdfPath="/ArticlePDFs/Untitled document.pdf"
                title="Unequal Opportunity: Desegregation at the University of Virginia School of Law, 1950–1960"
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
