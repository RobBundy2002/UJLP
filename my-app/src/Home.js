import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import AuthorCarousel from './components/AuthorCarousel';

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
                        <a href="#/journal" className="cta-button primary">View Our Work</a>
                        <a href="#/contact" className="cta-button primary">Submit Your Work</a>
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
                                <span className="stat-number">12</span>
                                <span className="stat-label">Team Members</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">5</span>
                                <span className="stat-label">Research Areas</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <AuthorCarousel />

            <section className="featured-section">
                <div className="section-content">
                    <h2>Featured Articles</h2>
                    <div className="articles-grid">
                        <article className="article-card">
                            <div className="article-content">
                                <span className="article-category">International Law</span>
                                <h3>"Dangerous Implications: The application of corporate personhood and its threat to democracy"</h3>
                                <p className="article-meta">By <Link to="/author/derek" className="author-link">Derek Tsai</Link> • July 2025</p>
                                <p className="article-preview">
                                    An examination of how corporate personhood doctrines impact democratic governance and political power structures.
                                </p>
                                <Link to="/dangerousimplications" className="article-link">Read more →</Link>
                            </div>
                        </article>
                        <article className="article-card">
                            <div className="article-content">
                                <span className="article-category">Criminal Law</span>
                                <h3>"From 'Wild Beasts' to Human Beings: Rethinking the Insanity Defense in the Age of Mental Health Awareness"</h3>
                                <p className="article-meta">By <Link to="/author/mikayla" className="author-link">Mikayla Grady</Link> • June 2025</p>
                                <p className="article-preview">
                                    A critical analysis of how modern mental health understanding should reshape legal approaches to insanity defense.
                                </p>
                                <Link to="/insanitydefense" className="article-link">Read more →</Link>
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
                    <p>Be part of the conversation. Submit your work, join our team, or explore our latest publications.</p>
                    <div className="cta-buttons">
                        <Link to="/journal" className="cta-button primary">View Journal</Link>
                        <Link to="/contact" className="cta-button primary">Get Involved</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
