import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home-container">
            <section className="intro-section">
                <div className="intro-text">
                    <h2>Welcome</h2>
                    <p>
                        The Undergraduate Journal of Law and Politics (UJLP) is dedicated to fostering critical dialogue
                        and original scholarship on legal and political issues. We publish rigorous, thoughtful work by
                        undergraduate students at the University of Virginia and beyond.
                    </p>
                    <p>
                        Whether you're interested in publishing, editing, or exploring impactful commentary,
                        UJLP is a space for engaged, curious minds to contribute meaningfully to the discourse.
                    </p>
                </div>
            </section>

            <section className="highlight-section">
                <h2>Featured Articles</h2>
                <div className="articles-preview">
                    <div className="article-card">
                        <h3>This piece is coming soon.</h3>
                        <p>By John Doe • April 2025</p>
                        <p className="preview-snippet">
                            This piece is coming soon.
                        </p>
                        <Link to="/journal" className="read-more">Read more →</Link>  {/* Use Link instead of a */}
                    </div>
                    <div className="article-card">
                        <h3>This Article is in Progress</h3>
                        <p>By Jane Doe • April 2025</p>
                        <p className="preview-snippet">
                            This piece is coming soon.
                        </p>
                        <Link to="/journal" className="read-more">Read more →</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
