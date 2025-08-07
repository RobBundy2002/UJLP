import React from 'react';
import '../AuthorBio.css';
import miaImg from '../MiaImage.jpg';

function Mia() {
    return (
        <div className="author-bio-container fade-in">
            <section className="author-hero">
                <div className="section-content">
                    <div className="author-content">
                        <div className="author-image">
                            <img src={miaImg} alt="Mia Petersen" />
                        </div>
                        <div className="author-info">
                            <h1>Mia Petersen</h1>
                            <span className="author-role">Executive Editor</span>
                            <div className="author-details">
                                <p><strong>4th Year at UVA:</strong> Class of 2026</p>
                                <p><strong>Hometown:</strong> Arlington, TX</p>
                                <p><strong>Major:</strong> Mechanical Engineering</p>
                                <p><strong>Research Interests:</strong> Privacy Law, Technology Law, National Security Law</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-bio-section">
                <div className="section-content">
                    <h2>About Mia</h2>
                    <div className="bio-content">
                        <p>
                            Mia Petersen is a fourth year student at the University of Virginia with a strong interest in the intersection of technology, national security, and law.
                        </p>
                        <p>
                            She has worked in various capacities at Lockheed Martin, including as a Cybersecurity and Systems Engineer Intern and as a Systems, Integration, and Test Intern, contributing to mission-critical defense projects across multiple programs. At UVA, Mia serves as a Research Assistant to Professor Danielle Citron at the School of Law, where she examines legal and policy frameworks governing digital privacy and security.
                        </p>
                        <p>
                            In her free time, Mia enjoys spending time with friends, baking, and trying new foods. In her final year at UVA, she is excited to launch Hoos on the Case, a club dedicated to helping undergraduate students gain direct legal exposure through pro bono work.
                        </p>
                    </div>
                </div>
            </section>

            <section className="author-publications">
                <div className="section-content">
                    <h2>Publications</h2>
                    <div className="publications-list">
                        <div className="publication-item">
                            <p className="publication-meta">Publications coming soon...</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-contact">
                <div className="section-content">
                    <h2>Contact</h2>
                    <div className="contact-info">
                        <p><strong>Email:</strong></p>
                        <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/mia-petersen11" target="_blank" rel="noopener noreferrer">Mia Petersen</a></p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Mia; 