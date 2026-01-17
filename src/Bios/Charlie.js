import React from 'react';
import '../Styling/AuthorBio.css';
import charlieImg from '../ProfilePictures/Charlie.jpeg';

function Charlie() {
    return (
        <div className="author-bio-container fade-in">
            <section className="author-hero">
                <div className="section-content">
                    <div className="author-content">
                        <div className="author-image">
                            <img src={charlieImg} alt="Charlie Aghdami" />
                        </div>
                        <div className="author-info">
                            <h1>Charlie Aghdami</h1>
                            <span className="author-role">Executive Editor </span>
                            <div className="author-details">
                                <p><strong>2nd Year at UVA:</strong> Coming Here To You Shortly So Stay Tuned! </p>
                                <p><strong>Hometown:</strong> Coming Here To You Shortly! </p>
                                <p><strong>Major:</strong> Coming Here To You Shortly! </p>
                                <p><strong>Research Interests:</strong> Coming Here To You Shortly! </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-bio-section">
                <div className="section-content">
                    <h2>About Charlie </h2>
                    <div className="bio-content">
                        <p>
                            Charlie Aghdami is a second-year at the University of Virginia.
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

export default Charlie;