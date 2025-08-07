import React from 'react';
import '../AuthorBio.css';
import richardImg from '../Richard.jpeg';

function Richard() {
    return (
        <div className="author-bio-container fade-in">
            <section className="author-hero">
                <div className="section-content">
                    <div className="author-content">
                        <div className="author-image">
                            <img src={richardImg} alt="Richard (Ruichong) Xu" />
                        </div>
                        <div className="author-info">
                            <h1>Richard (Ruichong) Xu</h1>
                            <span className="author-role">Director of Legal Writing & Research</span>
                            <div className="author-details">
                                <p><strong>3rd Year at UVA:</strong> Class of 2027</p>
                                <p><strong>Hometown:</strong> Virginia</p>
                                <p><strong>Major:</strong> Political Philosophy, Policy, and Law (PPL)</p>
                                <p><strong>Research Interests:</strong> Philosophy, History, Politics, International Relations</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-bio-section">
                <div className="section-content">
                    <h2>About Richard</h2>
                    <div className="bio-content">
                        <p>
                            Richard (Ruichong) Xu is an Echols Scholar at the University of Virginia, Class of 2027, 
                            majoring in Political Philosophy, Policy, and Law (PPL). He is a published author of two books: 
                            <em> The Philosophy of History: A Comprehensive Introduction</em> and 
                            <em> The Art of Political Philosophy: A Beginner's Guide</em>, both published by Routledge.
                        </p>
                        <p>
                            Richard's intellectual interests span philosophy, history, politics and international relations, 
                            economics, and psychology. In addition to these fields, he maintains a serious side interest in radar and 
                            aerospace engineering, having worked on projects at the University of Virginia's Aerospace Research Laboratory.
                        </p>
                        <p>
                            His academic work is published on 
                            <a href="https://mrrichard6.academia.edu/" target="_blank" rel="noopener noreferrer"> Academia.edu</a>,
                            and he curates his portfolio and ongoing work at his 
                            <a href="https://sites.google.com/view/richardrcxu-s-website/%E9%A6%96%E9%A1%B5" target="_blank" rel="noopener noreferrer"> personal website</a>.
                        </p>
                        <p>
                            With a commitment to interdisciplinary inquiry and public engagement, Richard seeks to bridge 
                            theoretical insight with real-world challenges across law, policy, and global affairs. His work 
                            at the Undergraduate Journal of Law and Politics reflects his dedication to advancing rigorous 
                            legal scholarship and fostering meaningful dialogue on pressing contemporary issues.
                        </p>
                    </div>
                </div>
            </section>

            <section className="author-publications">
                <div className="section-content">
                    <h2>Publications</h2>
                    <div className="publications-list">
                        <div className="publication-item">
                            <h3>"The Philosophy of History: A Comprehensive Introduction"</h3>
                            <p className="publication-meta">Routledge • 2023</p>
                            <p className="publication-excerpt">
                                A comprehensive introduction to the philosophy of history, exploring key concepts and methodologies.
                            </p>
                        </div>
                        <div className="publication-item">
                            <h3>"The Art of Political Philosophy: A Beginner's Guide"</h3>
                            <p className="publication-meta">Routledge • 2023</p>
                            <p className="publication-excerpt">
                                An accessible guide to political philosophy for students and general readers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-contact">
                <div className="section-content">
                    <h2>Contact</h2>
                    <div className="contact-info">
                        <p><strong>Email:</strong> <a href="mailto:richard.xu@virginia.edu">richard.xu@virginia.edu</a></p>
                        <p><strong>Academia.edu:</strong> <a href="https://mrrichard6.academia.edu/" target="_blank" rel="noopener noreferrer">Richard (Ruichong) Xu</a></p>
                        <p><strong>Personal Website:</strong> <a href="https://sites.google.com/view/richardrcxu-s-website/%E9%A6%96%E9%A1%B5" target="_blank" rel="noopener noreferrer">Richard Xu's Website</a></p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Richard; 