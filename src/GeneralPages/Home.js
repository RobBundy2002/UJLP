import React from 'react';
import '../Styling/Home.css';
import { Link } from 'react-router-dom';
import ParticleBackground from '../Components/ParticleBackground';

function Home() {
    return (
        <div className="home-container jh-home fade-in">
            <section className="jh-hero">
                <ParticleBackground />
                <div className="jh-orbit jh-orbit-one" aria-hidden="true" />
                <div className="jh-orbit jh-orbit-two" aria-hidden="true" />
                <div className="jh-hero-content">
                    <p className="jh-eyebrow"><strong>UJLP</strong> · University of Virginia · Est. 2024</p>
                    <h1>Ideas that<br /><em>move the world.</em></h1>
                    <p className="jh-hero-subtitle">
                        Fostering critical dialogue and original scholarship on legal and political issues
                    </p>
                    <div className="jh-hero-actions">
                        <Link to="/journal" className="jh-button jh-button-light">Explore the Journal <span>↗</span></Link>
                        <Link to="/jointheteam" className="jh-text-link">Submit your work <span>→</span></Link>
                    </div>
                </div>
            </section>

            <section className="jh-introduction">
                <div className="jh-section-label">About the journal</div>
                <div className="jh-intro-grid">
                    <h2>Serious inquiry,<br />open horizons.</h2>
                    <div className="jh-intro-copy">
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
                </div>
                <div className="jh-stats" aria-label="Journal at a glance">
                    <div><strong>02</strong><span>Articles published</span></div>
                    <div><strong>06</strong><span>Team members</span></div>
                    <div><strong>04</strong><span>Research areas</span></div>
                </div>
            </section>

            <section className="jh-featured">
                <div className="jh-featured-heading">
                    <div><p className="jh-section-label">From the latest issues</p><h2>Featured<br /><em>research.</em></h2></div>
                    <Link to="/journal" className="jh-text-link">View the Journal <span>→</span></Link>
                </div>
                <div className="jh-articles">
                    <article className="jh-article jh-article-lead">
                        <div className="jh-article-number">01</div>
                        <div className="jh-article-content">
                            <div className="jh-article-topline"><span>Civil Rights Law</span><span>2026 · Issue 2</span></div>
                                <h3>Unequal Opportunity: Desegregation at the University of Virginia School of Law, 1950–1960
                                </h3>
                            <p className="jh-article-meta">By <Link to="/author/derek">Derek Tsai</Link> · January 2026</p>
                            <p className="jh-article-preview">
                                    This essay relies heavily on
                                    the case study of Gregory Swanson and John Merchant at the University of Virginia School of Law
                                    to expose the limitations of legal measures in achieving equal opportunity in higher education, and to
                                    highlight the importance of individual and social changes in bringing about a permanent pedagogical
                                    shift.
                                </p>
                            <Link to="/dangerousimplications" className="jh-read-link">Read article <span>→</span></Link>
                        </div>
                    </article>
                    <article className="jh-article jh-article-secondary">
                        <div className="jh-article-number">02</div>
                        <div className="jh-article-content">
                            <div className="jh-article-topline"><span>Education Law</span><span>2026 · Issue 1</span></div>
                                <h3>"Schoolhouse Secrets: Parental Rights and Gender Identity Disclosure in the American Classroom"</h3>
                            <p className="jh-article-meta">By <Link to="/author/shelby">Shelby Eliasek</Link> · January 2026</p>
                            <p className="jh-article-preview">
                                    An examination of cases on public school policies regarding the use of gender non-conforming names and pronouns for students, and the rights of parents to be notified of these changes.
                                </p>
                            <Link to="/schoolhousesecrets" className="jh-read-link">Read article <span>→</span></Link>
                        </div>
                    </article>
                    <article className="jh-article jh-article-tertiary">
                        <div className="jh-article-number">03</div>
                        <div className="jh-article-content">
                            <div className="jh-article-topline"><span>Criminal Law</span><span>2025 · Issue 2</span></div>
                            <h3>From 'Wild Beasts' to Human Beings: Rethinking the Insanity Defense in the Age of Mental Health Awareness</h3>
                            <p className="jh-article-meta">By Mikayla Grady · June 2025</p>
                            <p className="jh-article-preview">A critical analysis of how modern mental-health understanding should reshape legal approaches to the insanity defense.</p>
                            <Link to="/journal" className="jh-read-link">Explore the archive <span>→</span></Link>
                        </div>
                    </article>
                </div>
            </section>

            <section className="jh-join">
                <div className="jh-join-mark" aria-hidden="true">UJLP</div>
                <div className="jh-join-content">
                    <p className="jh-section-label">The next argument starts here</p>
                    <h2>Bring your<br /><em>perspective.</em></h2>
                    <p>Be part of the conversation. Submit your work, join our team, or explore our latest publications.</p>
                    <Link to="/jointheteam" className="jh-button jh-button-orange">Get involved <span>↗</span></Link>
                </div>
            </section>
        </div>
    );
}

export default Home;
