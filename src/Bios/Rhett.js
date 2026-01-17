import React from 'react';
import '../Styling/AuthorBio.css';
import rhettImg from '../ProfilePictures/Rhett.jpg';

function Rhett() {
    return (
        <div className="author-bio-container fade-in">
            <section className="author-hero">
                <div className="section-content">
                    <div className="author-content">
                        <div className="author-image">
                            <img src={rhettImg} alt="Rhett Armentrout" />
                        </div>
                        <div className="author-info">
                            <h1>Rhett Armentrout</h1>
                            <span className="author-role">Staff Writer </span>
                            <div className="author-details">
                                <p><strong>2nd Year at UVA:</strong> Class of 2028 </p>
                                <p><strong>Hometown:</strong> Harrisonburg, Virginia </p>
                                <p><strong>Major:</strong> Materials Science Engineering </p>
                                <p><strong>Research Interests:</strong> Interests Coming Here Shortly! </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-bio-section">
                <div className="section-content">
                    <h2>About Rhett </h2>
                    <div className="bio-content">
                        <p>
                            Rhett Armentrout is a second-year at the University of Virginia.
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

export default Rhett;