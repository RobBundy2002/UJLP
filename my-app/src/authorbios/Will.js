import React from 'react';
import '../AuthorBio.css';
import willImg from '../Will.jpg';

function Will() {
    return (
        <div className="author-bio-container fade-in">
            <section className="author-hero">
                <div className="section-content">
                    <div className="author-content">
                        <div className="author-image">
                            <img src={willImg} alt="Will Olszewski" />
                        </div>
                        <div className="author-info">
                            <h1>Will Olszewski</h1>
                            <span className="author-role">Executive Editor</span>
                            <div className="author-details">
                                <p><strong>2nd Year at UVA:</strong> Class of 2028</p>
                                <p><strong>Hometown:</strong> Hershey, Pennsylvania</p>
                                <p><strong>Major:</strong> Pre-Law</p>
                                <p><strong>Research Interests:</strong> Constitutional Law, Legal Writing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-bio-section">
                <div className="section-content">
                    <h2>About Will</h2>
                    <div className="bio-content">
                        <p>
                            Will Olszewski is a second-year pre-law student at the University of Virginia. He is from Hershey, Pennsylvania, and graduated from Hershey High School.
                        </p>
                        <p>
                            Will discovered his passion for law in high school as a member of Pennsylvania's Youth and Government club. From teaching confused 7th graders how to write a legal brief to calmly responding to justices in the Pennsylvania Supreme Court, YAG exposed Will to many aspects of the judicial system that inspired his current path.
                        </p>
                        <p>
                            At the University of Virginia, Will continues to refine his argumentative skills as a member of the Honor Committee and Charlottesville Debate League. These organizations provide him the opportunity to craft compelling arguments, elevate his public speaking skills, and engage with moral questions that intersect with the law's foundation.
                        </p>
                        <p>
                            As a member of the Undergraduate Journal of Law and Politics, he is excited to delve into legal issues of great importance to American society. In his executive editor position, he hopes to encourage every staff editor's legal interests and bring out the best publication from every staff writer.
                        </p>
                        <p>
                            In his free time, Will is a massive Philly sports fan (Go Birds!), loves playing tennis, and is always down to watch an interesting movie!
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
                        <p><strong>Email:</strong> <a href="mailto:jug3sc@virginia.edu">jug3sc@virginia.edu</a></p>
                        <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/will-olszewski-881870343/" target="_blank" rel="noopener noreferrer">Will Olszewski</a></p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Will; 