import React from 'react';
import '../AuthorBio.css';
import derekImg from '../Derek.png';

function Derek() {
    return (
        <div className="author-bio-container fade-in">
            <section className="author-hero">
                <div className="section-content">
                    <div className="author-content">
                        <div className="author-image">
                            <img src={derekImg} alt="Derek Tsai" />
                        </div>
                        <div className="author-info">
                            <h1>Derek Tsai</h1>
                            <span className="author-role">Editor-in-Chief</span>
                            <div className="author-details">
                                <p><strong>2nd Year at UVA:</strong> Class of 2028</p>
                                <p><strong>Hometown:</strong> Great Falls, Virginia</p>
                                <p><strong>Major:</strong> History & Economics</p>
                                <p><strong>Research Interests:</strong> Corporate and Constitutional Law</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-bio-section">
                <div className="section-content">
                    <h2>About Derek</h2>
                    <div className="bio-content">
                        <p>
                            Derek Tsai is a second-year at the University of Virginia studying economics and history on the pre-law track. 
                            Derek is from Great Falls, Virginia, and attended Langley High School, where he developed his love for law.
                        </p>
                        <p>
                            After a meeting with the Clerk of the Supreme Court, Derek discovered his interest in constitutional law, 
                            which was strengthened through mock trial competitions. At the University of Virginia, Derek pivoted to 
                            authoring his original legal scholarship. His first article is about the Supreme Court's establishment 
                            of corporate personhood, integrating his interest in economics and history with constitutional legal analysis.
                        </p>
                        <p>
                            In his remaining time at UVA, Derek hopes to continue authoring scholarship on constitutional law that 
                            affects corporations. A fun fact about him is that he exclusively listens to the Suits theme song 
                            Greenback Boogie while working on anything related to law. Since he began his work at the Journal of 
                            Law & Politics, he has become the song's top listener on Spotify.
                        </p>
                    </div>
                </div>
            </section>

            <section className="author-publications">
                <div className="section-content">
                    <h2>Publications</h2>
                    <div className="publications-list">
                        <div className="publication-item">
                            <h3>"Dangerous Implications: The application of corporate personhood and its threat to democracy"</h3>
                            <p className="publication-meta">International Law • July 2025</p>
                            <p className="publication-excerpt">
                                An examination of how corporate personhood doctrines impact democratic governance and political power structures.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-contact">
                <div className="section-content">
                    <h2>Contact</h2>
                    <div className="contact-info">
                        <p><strong>Email:</strong> <a href="mailto:derektsai2006@gmail.com">derektsai2006@gmail.com</a></p>
                        <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/derek-tsai-a840752b3" target="_blank" rel="noopener noreferrer">Derek Tsai</a></p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Derek; 