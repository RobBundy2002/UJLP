import React from 'react';
import '../Styling/Journal.css';
import profilePic from '../ProfilePictures/Derek.png';
import editorPic from '../ProfilePictures/Will.jpg';
import PDFViewer from '../Components/PDFViewer';
import CiteShare from '../Components/CiteShare';

function UnequalOpportunity() {
    return (
        <div className="article-page fade-in">
            <h1>
                Unequal Opportunity:<br /><em>Desegregation at the University of Virginia School of Law, 1950–1960</em>
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
                pdfPath="/ArticlePDFs/Unequal Opportunity Draft 1.pdf"
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
                    Open Full PDF
                </a>
            </div>

            <CiteShare 
                title={"Unequal Opportunity: Desegregation at the University of Virginia School of Law, 1950–1960"}
                author={"Derek Tsai"}
                date={"2026-06-01"}
                url={window.location.href}
            />

            <footer className="article-footer">
                <div className="person-card">
                    <span className="person-label">Author</span>
                    <div className="person-info">
                        <img
                            src={profilePic}
                            alt="Derek Tsai"
                            className="person-pic"
                        />
                        <div>
                            <div className="person-name">Derek Tsai</div>
                            <div className="person-details">Class of 2027 • International Law</div>
                        </div>
                    </div>
                </div>

                <div className="person-card editor-card">
                    <span className="person-label">Editor</span>
                    <div className="person-info">
                        <img src={editorPic} alt="Will Olszewski" className="person-pic" />
                        <div>
                            <div className="person-name">Will Olszewski</div>
                            <div className="person-details">Editor • Journal Team</div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default UnequalOpportunity;
