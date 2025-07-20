import React from 'react';
import '../AuthorBio.css';

function Mikayla() {
    return (
        <div className="author-bio-container fade-in">
            <section className="author-hero">
                <div className="section-content">
                    <div className="author-content">
                        <div className="author-image">
                            <img src={null} alt="Mikayla Grady" />
                        </div>
                        <div className="author-info">
                            <h1>Mikayla Grady</h1>
                            <span className="author-role">Staff Writer</span>
                            <div className="author-details">
                                <p><strong>Bio:</strong> Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-bio-section">
                <div className="section-content">
                    <h2>About Mikayla</h2>
                    <div className="bio-content">
                        <p>Coming Soon</p>
                    </div>
                </div>
            </section>

            <section className="author-publications">
                <div className="section-content">
                    <h2>Publications</h2>
                    <div className="publications-list">
                        <div className="publication-item">
                            <h3>"From 'Wild Beasts' to Human Beings: Rethinking the Insanity Defense in the Age of Mental Health Awareness"</h3>
                            <p className="publication-meta">Criminal Law • June 2025</p>
                            <p className="publication-excerpt">
                                A critical analysis of how modern mental health understanding should reshape legal approaches to insanity defense.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-contact">
                <div className="section-content">
                    <h2>Contact</h2>
                    <div className="contact-info">
                        <p>Coming Soon</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Mikayla; 