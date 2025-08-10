import React from 'react';
import '../AuthorBio.css';
import rishiImg from '../Rishi.jpg';

function Rishi() {
    return (
        <div className="author-bio-container fade-in">
            <section className="author-hero">
                <div className="section-content">
                    <div className="author-content">
                        <div className="author-image">
                            <img src={rishiImg} alt="Rishi Chandra" />
                        </div>
                        <div className="author-info">
                            <h1>Rishi Chandra</h1>
                            <span className="author-role">Executive Editor</span>
                            <div className="author-details">
                                <p><strong>2nd Year at UVA:</strong> Class of 2028</p>
                                <p><strong>Hometown:</strong> Reston, Virginia</p>
                                <p><strong>Major:</strong> Global Studies & American Studies</p>
                                <p><strong>Research Interests:</strong> International Law, Political Commentary</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-bio-section">
                <div className="section-content">
                    <h2>About Rishi</h2>
                    <div className="bio-content">
                        <p>
                            Rishi Chandra is a second-year student at the University of Virginia, pursuing a double major in global studies and American studies. Rishi is from Reston, Virginia, and attended South Lakes High School, where he grew his passion for political activism.
                        </p>
                        <p>
                            While at SLHS, he joined several advocacy organizations, including Team ENOUGH, the Pride Liberation Project, and SEALS, where he lobbied for gun reform, reproductive rights, and equity in Fairfax County Public Schools. Additionally, he founded and produced The WokeUp Podcast, dedicated to raising awareness of pressing international issues and political corruption.
                        </p>
                        <p>
                            During his first year at UVA, Rishi sharpened his journalism and political-writing skills through his roles as a staff writer and social media chair of the Virginia Review of Politics, a features writer for V Mag at UVA, and as a social media co-manager of UVA's bipartisan political podcast, Coup De Pod. By the end of his first year, he published three op-eds covering a range of political topics from the ethics of AI in politics to Cold War theory.
                        </p>
                        <p>
                            Rishi joined the Undergraduate Journal of Law and Politics as an editor, interested in exploring how law can promote progressive policy and human rights. During his remaining time at UVA, he hopes to continue writing political commentary and to create scholarship on how international law can both uplift and undermine democracies. As an executive editor, Rishi wants to bridge the divide between writers and editors to create cohesive and thought-provoking pieces.
                        </p>
                        <p>
                            A fun fact about Rishi is that he is incredibly interested in film. He is happy to chat about anything related to the MCU, the latest viral horror movies, or the cheesiest rom-coms on Netflix.
                        </p>
                    </div>
                </div>
            </section>

            <section className="author-publications">
                <div className="section-content">
                    <h2>Publications</h2>
                    <div className="publications-list">
                        <div className="publication-item">
                            <p className="publication-meta">Publications coming soon...</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-contact">
                <div className="section-content">
                    <h2>Contact</h2>
                    <div className="contact-info">
                        <p><strong>Email:</strong> <a href="mailto:dfz2vu@virginia.edu">dfz2vu@virginia.edu</a></p>
                        <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/rishi-chandra-7403b3329/" target="_blank" rel="noopener noreferrer">Rishi Chandra</a></p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Rishi; 