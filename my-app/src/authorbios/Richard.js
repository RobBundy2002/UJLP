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
                                <p><strong>Major:</strong> Political Philosophy, Policy, and Law (PPL)</p>
                                <p><strong>Scholarship:</strong> Echols Scholar</p>
                                <p><strong>Research Interests:</strong> Constitutional Law, Political Philosophy, International Relations</p>
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
                            <em>Principles of a Normative Constitution</em> (iUniverse, 2025, ISBN: 978-1-66327-1044), 
                            which presents a theory of constitutional design grounded in political philosophy and comparative 
                            constitutional law, and <em>法律小谈</em> (A Brief Talk About the Law, Chinese Publishing Inc., 
                            2023, ISBN: 978-1-64695-308), a concise and yet insightful introduction to legal thought 
                            written during his final year of high school.
                        </p>
                        <p>
                            Richard's intellectual interests span philosophy, history, politics and international relations, 
                            economics, and psychology. In addition to these fields, he maintains a serious side interest in 
                            radar and missile science, integrating technical analysis into his broader understanding of strategy 
                            and policy. His academic essays and reflections are published regularly on 
                            <a href="https://mrrichard6.academia.edu/" target="_blank" rel="noopener noreferrer"> Academia.edu</a>,
                            and he curates his portfolio and ongoing work at his 
                            <a href="https://sites.google.com/view/richardrcxu-s-website/%E9%A6%96%E9%A1%B5" target="_blank" rel="noopener noreferrer"> personal website</a>.
                        </p>
                        <p>
                            With a commitment to interdisciplinary inquiry and public engagement, Richard seeks to bridge 
                            theoretical insight with real-world challenges across law, policy, and global affairs. His work 
                            at the Undergraduate Journal of Law and Politics reflects his dedication to advancing legal 
                            scholarship and fostering meaningful dialogue on constitutional and political issues.
                        </p>
                    </div>
                </div>
            </section>

            <section className="author-publications">
                <div className="section-content">
                    <h2>Publications</h2>
                    <div className="publications-list">
                        <div className="publication-item">
                            <h3>"Principles of a Normative Constitution"</h3>
                            <p className="publication-meta">Constitutional Law • iUniverse, 2025</p>
                            <p className="publication-excerpt">
                                A theory of constitutional design grounded in political philosophy and comparative constitutional law.
                            </p>
                        </div>
                        <div className="publication-item">
                            <h3>"法律小谈 (A Brief Talk About the Law)"</h3>
                            <p className="publication-meta">Legal Theory • Chinese Publishing Inc., 2023</p>
                            <p className="publication-excerpt">
                                A concise and yet insightful introduction to legal thought written during his final year of high school.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-contact">
                <div className="section-content">
                    <h2>Contact</h2>
                                         <div className="contact-info">
                         <p><strong>Email:</strong> <a href="mailto:pjj8fy@virginia.edu">pjj8fy@virginia.edu</a></p>
                         <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/ruichong-xu" target="_blank" rel="noopener noreferrer">Richard (Ruichong) Xu</a></p>
                     </div>
                </div>
            </section>
        </div>
    );
}

export default Richard; 