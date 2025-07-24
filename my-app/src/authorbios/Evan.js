import React from 'react';
import '../AuthorBio.css';
import evanImg from '../Evan.jpeg';

function Evan() {
    return (
        <div className="author-bio-container fade-in">
            <section className="author-hero">
                <div className="section-content">
                    <div className="author-content">
                        <div className="author-image">
                            <img src={evanImg} alt="Evan Proudkii" />
                        </div>
                        <div className="author-info">
                            <h1>Evan Proudkii</h1>
                            <span className="author-role">Managing Editor</span>
                            <div className="author-details">
                                <p><strong>Class:</strong> 2028</p>
                                <p><strong>Majors:</strong> Public Policy & Economics</p>
                                <p><strong>Hometown:</strong> Tysons Corner, Virginia</p>
                                <p><strong>Research Interests:</strong> Constitutional Law, Politics & Law</p>
                                <p><strong>Heritage:</strong> Ukrainian & Russian</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-bio-section">
                <div className="section-content">
                    <h2>About Evan</h2>
                    <div className="bio-content">
                        <p>
                            Evan Proudkii is a second-year student at the University of Virginia pursuing a double major in public policy and economics on the pre-law track. Evan has lived in Tysons Corner, Virginia, his whole life, attending George C. Marshall High School, but his heritage is a blend of Ukrainian and Russian backgrounds.
                        </p>
                        <p>
                            Evan has spent his first year at UVA primarily involved in political advocacy, interning on the Jay Jones for Virginia Attorney General campaign and working alongside other students to lobby for equitable legislation with Students for Equity and Reform in Virginia (SERV). He now hopes to explore legal scholarship with a focus on constitutional law, aiming to bridge his interests in politics and law, especially in light of the recent challenges to the Constitution amid the current turbulent political atmosphere.
                        </p>
                        <p>
                            Outside of school and work, Evan enjoys spending time with friends, hiking, and playing piano. A fun fact about him is that he studied classical piano at the Levine School of Music, competing in several local and international competitions, such as the Ruth P. Cogen Concerto Competition and the Lancaster International Piano & Chamber Music Festival. He’s also a founding member of the Veyev Trio, a piano trio that has performed at several fundraising concerts, churches, and retirement homes, and most notably, in a showcase performance for the internationally acclaimed Emerson Quartet.
                        </p>
                    </div>
                </div>
            </section>

            <section className="author-publications">
                <div className="section-content">
                    <h2>Publications</h2>
                    <div className="publications-list">
                        <p>None yet.</p>
                    </div>
                </div>
            </section>

            <section className="author-contact">
                <div className="section-content">
                    <h2>Contact</h2>
                    <div className="contact-info">
                        <p><strong>Email:</strong> <a href="mailto:bsm3bd@virginia.edu">bsm3bd@virginia.edu</a></p>
                        <p><strong>LinkedIn:</strong> <a href="http://www.linkedin.com/in/evan-proudkii-b074b7352" target="_blank" rel="noopener noreferrer">Evan Proudkii</a></p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Evan; 