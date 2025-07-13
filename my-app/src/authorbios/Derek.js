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
                            <span className="author-role">Managing Editor</span>
                            <div className="author-details">
                                <p><strong>2nd Year at UVA:</strong> Class of 2028</p>
                                <p><strong>Hometown:</strong> McLean, Virginia</p>
                                <p><strong>Major:</strong> History & Economics</p>
                                <p><strong>Research Interests:</strong> Corporate Law, Constitutional Law</p>
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
                            Derek Tsai is a second-year student at the University of Virginia, pursuing a double major in History and Economics. 
                            As the Managing Editor of the Undergraduate Journal of Law and Politics, Derek oversees day-to-day editorial operations 
                            and coordinates article workflows across departments.
                        </p>
                        <p>
                            Originally from McLean, Virginia, Derek has developed a deep interest in constitutional law and its intersection with
                            corporate governance. His research focuses on the implications of corporate personhood in democratic systems, 
                            particularly examining how legal frameworks shape political power structures.
                        </p>
                        <p>
                            Derek's work with UJLP reflects his commitment to fostering rigorous academic discourse and expanding opportunities 
                            for undergraduate legal research. He believes in the importance of connecting legal doctrine with broader humanistic 
                            perspectives, ensuring that legal scholarship remains accessible and impactful.
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