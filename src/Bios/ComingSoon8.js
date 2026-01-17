import React from 'react';
import '../Styling/AuthorBio.css';
import comingSoonImg from '../ProfilePictures/ComingSoon.jpg';

function ComingSoon8() {
    return (
        <div className="author-bio-container fade-in">
            <section className="author-hero">
                <div className="section-content">
                    <div className="author-content">
                        <div className="author-image">
                            <img src={comingSoonImg} alt="Coming Soon 8" />
                        </div>
                        <div className="author-info">
                            <h1>Coming Soon 8</h1>
                            <span className="author-role">Event Coordinator </span>
                            <div className="author-details">
                                <p><strong>Year at UVA:</strong> Coming Here To You Shortly So Stay Tuned! </p>
                                <p><strong>Hometown:</strong> Coming Here Shortly! </p>
                                <p><strong>Major:</strong> Coming Here Shortly! </p>
                                <p><strong>Research Interests:</strong> Coming Here Shortly! </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-bio-section">
                <div className="section-content">
                    <h2>About</h2>
                    <div className="bio-content">
                        <p>
                            Coming Here Shortly!
                        </p>
                        <p>
                        </p>
                        <p>
                        </p>
                    </div>
                </div>
            </section>

            <section className="author-publications">
                <div className="section-content">
                    <h2>Publications</h2>
                    <div className="publications-list">
                        <div className="publication-item">
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-contact">
            </section>
        </div>
    );
}

export default ComingSoon8;