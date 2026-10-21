import React from 'react';
import '../Styling/AuthorBio.css';

function StaffProfile({ member }) {
    return (
        <div className="author-bio-container fade-in">
            <section className="author-hero">
                <div className="section-content">
                    <div className="author-content">
                        <div className="author-image">
                            <img src={member.img} alt={member.name} />
                        </div>
                        <div className="author-info">
                            <h1>{member.name}</h1>
                            <span className="author-role">{member.role}</span>
                            {member.year && (
                                <div className="author-details">
                                    <p><strong>Current Year at UVA:</strong> {member.year} Year</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default StaffProfile;
