import React from 'react';
import '../Styling/Journal.css';
import profilePic from "../ProfilePictures/Shelby.jpeg";
import PDFViewer from '../Components/PDFViewer';

function SchoolhouseSecrets() {
    return (
        <div className="article-page fade-in">
            <h1>
                Schoolhouse Secrets: Parental Rights and Gender Identity Disclosure in the American Classroom
            </h1>
            <p className="article-meta">By Shelby Eliasek • January 2026 • Education Law • 2026 Issue 1</p>

            <div className="article-summary">
                <h2>Summary</h2>
                <p>
                    In 2025, two key cases reviewed school policies on a parent's right to be informed of
                    their student's use of a gender-nonconforming name or pronoun. The first case, Foote v. Ludlow School
                    Committee (2025), was dismissed by the United States Court of Appeals for the First Circuit after the
                    court found no violation of a fundamental right. The second case, Mirabelli et al. v. Olson et al. (2025),
                    yielded an entirely opposite result; the United States District Court for the Southern District of
                    California found that the parents' rights were violated, and the school's policy faced a permanent
                    injunction. These contrasting results highlight ongoing disagreements about gender identity, parental
                    authority, the right to privacy, the right to freedom of religious expression, and the government's
                    ability to control and protect students within public institutions. This review examines the
                    jurisdictional and doctrinal differences underlying these decisions, the constitutional rights
                    implicated, and state and federal statutes currently shaping this area of law.
                </p>
            </div>

            <PDFViewer 
                pdfPath="/ArticlePDFs/Eliasek_Fall2025_Classroom_Gender.pdf"
                title="Schoolhouse Secrets: Parental Rights and Gender Identity Disclosure in the American Classroom"
                author="Shelby Eliasek"
            />

            <div className="pdf-actions">
                <a
                    href="/ArticlePDFs/Eliasek_Fall2025_Classroom_Gender.pdf"
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
                        alt="Shelby Eliasek"
                        className="author-profile-pic"
                    />
                    <span className="author-name">Shelby Eliasek</span>
                </div>
                <div className="author-details">
                    <span>Class of 2028 • Education Law</span>
                </div>
            </footer>
        </div>
    );
}

export default SchoolhouseSecrets;