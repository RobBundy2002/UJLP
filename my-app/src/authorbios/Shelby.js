import React from 'react';
import '../AuthorBio.css';
import shelbyImg from '../Shelby.jpeg';

function Shelby() {
    return (
        <div className="author-bio-container fade-in">
            <section className="author-hero">
                <div className="section-content">
                    <div className="author-content">
                        <div className="author-image">
                            <img src={shelbyImg} alt="Shelby Eliasek" />
                        </div>
                        <div className="author-info">
                            <h1>Shelby Eliasek</h1>
                            <span className="author-role">Director of Operations</span>
                            <div className="author-details">
                                <p><strong>2nd Year at UVA:</strong> Class of 2028</p>
                                <p><strong>Hometown:</strong> Charlotte, North Carolina</p>
                                <p><strong>Major:</strong> Pre-Law Track with Studio Art Minor</p>
                                <p><strong>Research Interests:</strong> Constitutional Law, Separation of Powers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-bio-section">
                <div className="section-content">
                    <h2>About Shelby</h2>
                    <div className="bio-content">
                        <p>
                            Shelby Eliasek is a second-year student at the University of Virginia on the pre-law track, 
                            and pursuing a minor in Studio Art. She is from Charlotte, North Carolina and attended 
                            Charlotte Country Day School (CCDS). While at CCDS, Shelby competed and led the Mock Trial 
                            team during their 2022 and 2023 seasons, placing twice at regionals, advancing once to states, 
                            and personally receiving the Outstanding Attorney Award.
                        </p>
                        <p>
                            Now at UVA, Shelby continues to hone her public speaking and research skills on the UVA 
                            Undergraduate Moot Court team. During her first season (2024-25), Shelby was the D.C Regional 
                            Moot Court Tournament quarter-finalist, and she advanced to compete at the University of Houston 
                            Nationals Preliminary Round Tournament, held at the University of Houston Law Center. Through 
                            Moot Court, she learned how to write case outlines, read and summarize court decisions effectively, 
                            and collaborate with her fellow teammates. She currently serves as Moot Court's Assistant Treasurer 
                            for the 2025-26 season.
                        </p>
                        <p>
                            In addition to Moot Court at UVA, Shelby pursues her love for reading, writing, and law through 
                            her work with the Undergraduate Journal of Law and Politics. As a founding member of the Journal, 
                            Shelby helped build the program, recruited writers and editors, and established a stable vision 
                            for the club. She served as the Director of Engagement during the Journal's first year, working 
                            diligently to spread word about the club to any interested undergraduates. Now, Shelby is the 
                            Director of Operations, and she works personally with writers and editors to maintain the Journal's 
                            publication schedule, to communicate important updates, and to organize club events. She also runs 
                            the Journal's social media pages and aided in the initial creative design for the website.
                        </p>
                        <p>
                            Shelby is currently writing her own piece for the Journal, which will focus on the separation 
                            of powers within the United States, specifically Chevron Deference, the Loper Bright case, and 
                            the intent of the founding fathers on the Supreme Court's involvement in such decisions. When 
                            taking a break from writing, Shelby is an avid painter, runner, and reader.
                        </p>
                    </div>
                </div>
            </section>

            <section className="author-publications">
                <div className="section-content">
                    <h2>Publications</h2>
                    <div className="publications-list">
                        <div className="publication-item">
                            <h3>"Chevron Deference and the Separation of Powers: A Constitutional Analysis"</h3>
                            <p className="publication-meta">Constitutional Law • In Progress</p>
                            <p className="publication-excerpt">
                                An examination of Chevron Deference, the Loper Bright case, and the founding fathers' 
                                intent regarding the Supreme Court's role in administrative law decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-contact">
                <div className="section-content">
                    <h2>Contact</h2>
                    <div className="contact-info">
                        <p><strong>Email:</strong> <a href="mailto:vua7tx@virginia.edu">vua7tx@virginia.edu</a></p>
                        <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/shelby-eliasek-1a2b93240" target="_blank" rel="noopener noreferrer">Shelby Eliasek</a></p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Shelby; 