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
                Unequal Opportunity:<br /><em>Desegregation at the University of Virginia School of Law</em>
            </h1>
            <p className="article-meta">Derek Tsai • Volume 1 · Issue 1 • May 2026</p>

            <div className="article-summary">
                <div className="article-summary-heading">
                    <h2>Abstract</h2>
                    <div className="article-topics"><span>Topics</span><div className="article-topic-list"><strong>Civil Rights Law</strong><strong>Education Law</strong><strong>Law and Society</strong></div></div>
                </div>
                <p>
                    From its founding in 1819 until 1950, the University of Virginia remained a segregated, white-only institution. The judiciary played a crucial role in the desegregation of the University and other historically segregated schools. Indeed, legal precedent and the courts forced the University to admit its first black student, Gregory Swanson; however, the law is limited in its effect, as Swanson left the school due to the substantial social barriers that remained. Five years later, John Merchant entered the University and became the first black student to earn a Juris Doctor from the School of Law. This essay analyzes the legal history that led to Swanson’s matriculation at the University of Virginia and compares the two case studies of Swanson and Merchant that illustrate the limitations of the judiciary and highlight the necessity of a “dual approach” through legal and social change to achieve equal opportunity in education.
                </p>
            </div>

            <PDFViewer 
                pdfPath="/ArticlePDFs/Unequal Opportunity Final Manuscript.pdf"
                title="Unequal Opportunity: Desegregation at the University of Virginia School of Law"
                author="Derek Tsai"
            />

            <div className="pdf-actions">
                <a
                    href="/ArticlePDFs/Unequal%20Opportunity%20Final%20Manuscript.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-button pdf-button"
                >
                    Open Full PDF
                </a>
            </div>

            <CiteShare 
                title={"Unequal Opportunity: Desegregation at the University of Virginia School of Law"}
                author={"Derek Tsai"}
                date={"2026-05-01"}
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
                            <div className="person-details">Editor-in-Chief • Executive Team</div>
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
