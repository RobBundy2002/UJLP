import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home-container fade-in">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Undergraduate Journal of Law and Politics</h1>
                    <p className="hero-subtitle">
                        Fostering critical dialogue and original scholarship on legal and political issues
                    </p>
                    <div className="cta-buttons">
                        <a href="#/journal" className="cta-button-home">View Our Work</a>
                        <a href="#/contact" className="cta-button-home">Submit Your Work</a>
                    </div>
                </div>
            </section>

            <section className="intro-section">
                <div className="section-content">
                    <h2>Welcome to UJLP</h2>
                    <div className="intro-grid">
                        <div className="intro-text">
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
                        <div className="intro-stats">
                            <div className="stat-item">
                                <span className="stat-number">+</span>
                                <span className="stat-label">Articles Published</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">+</span>
                                <span className="stat-label">Contributors</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">+</span>
                                <span className="stat-label">Years of Excellence</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="featured-section">
                <div className="section-content">
                    <h2>Featured Articles</h2>
                    <div className="articles-grid">
                        <article className="article-card">
                            <div className="article-content">
                                <span className="article-category">Politics</span>
                                <h3>This Article is in Progress</h3>
                                <p className="article-meta">By John Doe • June 2025</p>
                                <p className="article-preview">
                                    This piece is coming soon.
                                </p>
                                <Link to="/journal" className="article-link">Read more →</Link>
                            </div>
                        </article>
                        <article className="article-card">
                            <div className="article-content">
                                <span className="article-category">Law</span>
                                <h3>This Article is in Progress</h3>
                                <p className="article-meta">By Jane Doe • June 2025</p>
                                <p className="article-preview">
                                    This piece is coming soon.
                                </p>
                                <Link to="/journal" className="article-link">Read more →</Link>
                            </div>
                        </article>
                    </div>
                    <div className="section-footer">
                        <Link to="/journal" className="view-all-link">View All Articles →</Link>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="section-content">
                    <h2>Join Our Community</h2>
                    <p>Be part of the conversation. Submit your work or join our editorial team.</p>
                    <div className="cta-buttons">
                        <Link to="/contact" className="cta-button-home">Submit Your Work</Link>
                        <Link to="/about" className="cta-button-home">Join Our Team</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
