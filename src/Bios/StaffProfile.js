import React from 'react';
import '../Styling/AuthorBio.css';

function StaffProfile({ member }) {
    return (
        <div className="author-bio-container fade-in">
            <section className="author-hero">
                <div className="section-content">
                    <div className="author-content">
                        <div className="author-image">
                            <img src={member.img} alt="" />
                        </div>
                        <div className="author-info">
                            <h1>{member.name}</h1>
                            <span className="author-role">{member.role}</span>
                            <div className="author-details">
                                <p><strong>Current Year at UVA:</strong>  </p>
                                <p><strong>Hometown:</strong>  </p>
                                <p><strong>Major:</strong>  </p>
                                <p><strong>Research Interests:</strong>  </p>
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
                            <p className="publication-meta"></p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-contact">
            </section>
        </div>
    );
}

export default StaffProfile;
