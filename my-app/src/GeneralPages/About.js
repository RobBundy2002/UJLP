import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styling/About.css';
import '../Styling/Home.css';
import Timeline from '../Components/Timeline';
import samImg from '../ProfilePictures/Sam.png';
import shelbyImg from '../ProfilePictures/Shelby.jpeg';
import derekImg from '../ProfilePictures/Derek.png';
import ruichongImg from '../ProfilePictures/Richard.jpg';
import robImg from '../ProfilePictures/Rob.jpg';
import evanImg from '../ProfilePictures/Evan.jpeg';

function About() {
    const [activeFilter, setActiveFilter] = useState('all');

    return (
        <div className="about-container fade-in">
            <section className="about-hero">
                <div className="section-content">
                    <div className="hero-content">
                        <h1>About UJLP</h1>
                        <p>Discover our mission, our team, and our commitment to excellence in legal journalism.</p>
                        <div className="cta-buttons">
                            <a href="#/journal" className="cta-button">View Our Work</a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mission-section">
                <div className="section-content">
                    <h2>Our Mission</h2>
                    <div className="mission-content">
                        <p>
                            The Undergraduate Journal of Law & Politics aims to expand opportunities for undergraduate legal research and writing at the University of Virginia. We publish long-form legal articles that explore the intersection of law and politics, including philosophy, economics, and history. Our goal is to foster academic inquiry and connect legal doctrine with broader humanistic perspectives.
                        </p>
                    </div>
                </div>
            </section>

            <section className="leadership-section">
                <div className="section-content">
                    <h2>Leadership Team</h2>
                    <div className="leadership-grid">
                        <div className="leader-card">
                            <div className="leader-image">
                                <img src={derekImg} alt="Derek Tsai" />
                            </div>
                            <div className="leader-info">
                                <h3><Link to="/author/derek" className="author-link">Derek Tsai</Link></h3>
                                <span className="leader-role">Editor-in-Chief</span>
                                <p>Derek Tsai leads the Undergraduate Journal of Law and Politics, setting editorial vision, overseeing all operations, and representing the organization in official capacities.</p>
                            </div>
                        </div>
                        <div className="leader-card">
                            <div className="leader-image">
                                <img src={shelbyImg} alt="Shelby Eliasek" />
                            </div>
                            <div className="leader-info">
                                <h3><Link to="/author/shelby" className="author-link">Shelby Eliasek</Link></h3>
                                <span className="leader-role">Director of Operations</span>
                                <p>Shelby Eliasek manages logistics, events, and organizational strategy, ensuring the smooth day-to-day functioning of the Journal.</p>
                            </div>
                        </div>
                        <div className="leader-card">
                            <div className="leader-image">
                                <img src={evanImg} alt="Evan Proudkii" />
                            </div>
                            <div className="leader-info">
                                <h3><Link to="/author/evan" className="author-link">Evan Proudkii</Link></h3>
                                <span className="leader-role">Managing Editor</span>
                                <p>Evan Proudkii coordinates editorial workflows, supports writers and editors, and ensures the quality and timely publication of all articles.</p>
                            </div>
                        </div>
                        <div className="leader-card">
                            <div className="leader-image">
                                <img src={ruichongImg} alt="Richard (Ruichong) Xu" />
                            </div>
                            <div className="leader-info">
                                <h3><Link to="/author/richard" className="author-link">Richard Xu</Link></h3>
                                <span className="leader-role">Director of Legal Writing & Research</span>
                                <p>Richard Xu leads legal research initiatives and ensures the accuracy and integrity of legal content.</p>
                            </div>
                        </div>
                        <div className="leader-card">
                            <div className="leader-image">
                                <img src={robImg} alt="Rob Bundy" />
                            </div>
                            <div className="leader-info">
                                <h3><Link to="/author/rob" className="author-link">Rob Bundy</Link></h3>
                                <span className="leader-role">Director of Technology</span>
                                <p>Rob Bundy manages technical infrastructure and ensures seamless digital experiences for all platforms.</p>
                            </div>
                        </div>
                        <div className="leader-card">
                            <div className="leader-image">
                                <img src={samImg} alt="Sam Burnett" />
                            </div>
                            <div className="leader-info">
                                <h3>Sam Burnett</h3>
                                <span className="leader-role">Editor Emeritus</span>
                                <p>Sam Burnett is a journalist with years of editorial experience, now serving as Editor Emeritus after leading the team as Editor-in-Chief.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="team-section">
                <div className="section-content">
                    <h2>Our Team</h2>
                    <div className="team-content">
                        <p>
                            Our group is composed of executive leaders, writers, and editors. Leaders plan events, manage the
                            budget, assist writers and editors, monitor the quality of the Journal, and promote research. Writers
                            and editors pair up to work on one law review together. Writers complete the majority of the outlining,
                            research, and drafting, while editors fact-check court cases and historical details, manage citations,
                            and review drafts. By working together, the Journal maintains accurate and high-quality content.
                        </p>
                    </div>

                    {/* Filter Buttons */}
                    <div className="filter-container">
                        <button 
                            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            All
                        </button>
                        <button 
                            className={`filter-button ${activeFilter === 'executive-editor' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('executive-editor')}
                        >
                            Executive Editors
                        </button>
                        <button 
                            className={`filter-button ${activeFilter === 'staff-editor' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('staff-editor')}
                        >
                            Staff Editors
                        </button>
                        <button 
                            className={`filter-button ${activeFilter === 'internal-writer' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('internal-writer')}
                        >
                            Internal Writers
                        </button>
                        <button 
                            className={`filter-button ${activeFilter === 'submission-writer' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('submission-writer')}
                        >
                            Submission Writers
                        </button>
                        <button 
                            className={`filter-button ${activeFilter === 'event-coordinator' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('event-coordinator')}
                        >
                            Event Coordinators
                        </button>
                    </div>
                    <div className="team-members-grid">
                        <div className={`team-member-card ${activeFilter === 'all' || activeFilter === 'executive-editor' ? 'visible' : 'hidden'}`}>
                            <img src={require('../ProfilePictures/Will.jpg')} alt="Will" className="team-member-photo"/>
                            <div className="team-member-info">
                                <h3><Link to="/author/will" className="author-link">Will Olszewski</Link></h3>
                                <span className="team-member-role">Executive Editor</span>
                            </div>
                        </div>

                        <div className={`team-member-card ${activeFilter === 'all' || activeFilter === 'executive-editor' ? 'visible' : 'hidden'}`}>
                            <img src={require('../ProfilePictures/Rishi.jpg')} alt="Rishi" className="team-member-photo"/>
                            <div className="team-member-info">
                                <h3><Link to="/author/rishi" className="author-link">Rishi Chandra</Link></h3>
                                <span className="team-member-role">Executive Editor</span>
                            </div>
                        </div>

                        <div className={`team-member-card ${activeFilter === 'all' || activeFilter === 'executive-editor' ? 'visible' : 'hidden'}`}>
                            <img src={require('../ProfilePictures/Mia.jpg')} alt="Mia" className="team-member-photo"/>
                            <div className="team-member-info">
                                <h3><Link to="/author/mia" className="author-link">Mia Petersen</Link></h3>
                                <span className="team-member-role">Executive Editor</span>
                            </div>
                        </div>
                        {/* Executive Editor (Coming Soon) */}
                        <div className={`team-member-card ${activeFilter === 'all' || activeFilter === 'executive-editor' ? 'visible' : 'hidden'}`}>
                            <img src={require('../ProfilePictures/ComingSoon.jpg')} alt="Coming Soon" className="team-member-photo"/>
                            <div className="team-member-info">
                                <h3><Link to="/author/comingsoon1" className="author-link">Coming Soon</Link></h3>
                                <span className="team-member-role">Executive Editor</span>
                            </div>
                        </div>

                        {/* Staff Editor */}
                        <div className={`team-member-card ${activeFilter === 'all' || activeFilter === 'staff-editor' ? 'visible' : 'hidden'}`}>
                            <img src={require('../ProfilePictures/ComingSoon.jpg')} alt="Coming Soon" className="team-member-photo"/>
                            <div className="team-member-info">
                                <h3><Link to="/author/comingsoon2" className="author-link">Coming Soon</Link></h3>
                                <span className="team-member-role">Staff Editor</span>
                            </div>
                        </div>

                        {/* Internal Writers */}
                        <div className={`team-member-card ${activeFilter === 'all' || activeFilter === 'internal-writer' ? 'visible' : 'hidden'}`}>
                            <img src={require('../ProfilePictures/ComingSoon.jpg')} alt="Coming Soon" className="team-member-photo"/>
                            <div className="team-member-info">
                                <h3><Link to="/author/comingsoon3" className="author-link">Coming Soon</Link></h3>
                                <span className="team-member-role">Internal Writer</span>
                            </div>
                        </div>

                        <div className={`team-member-card ${activeFilter === 'all' || activeFilter === 'internal-writer' ? 'visible' : 'hidden'}`}>
                            <img src={require('../ProfilePictures/ComingSoon.jpg')} alt="Coming Soon" className="team-member-photo"/>
                            <div className="team-member-info">
                                <h3><Link to="/author/comingsoon4" className="author-link">Coming Soon</Link></h3>
                                <span className="team-member-role">Internal Writer</span>
                            </div>
                        </div>

                        {/* Submission Writers */}
                        <div className={`team-member-card ${activeFilter === 'all' || activeFilter === 'submission-writer' ? 'visible' : 'hidden'}`}>
                            <img src={require('../ProfilePictures/ComingSoon.jpg')} alt="Coming Soon" className="team-member-photo"/>
                            <div className="team-member-info">
                                <h3><Link to="/author/comingsoon5" className="author-link">Coming Soon</Link></h3>
                                <span className="team-member-role">Submission Writer</span>
                            </div>
                        </div>

                        <div className={`team-member-card ${activeFilter === 'all' || activeFilter === 'submission-writer' ? 'visible' : 'hidden'}`}>
                            <img src={require('../ProfilePictures/ComingSoon.jpg')} alt="Coming Soon" className="team-member-photo"/>
                            <div className="team-member-info">
                                <h3><Link to="/author/comingsoon6" className="author-link">Coming Soon</Link></h3>
                                <span className="team-member-role">Submission Writer</span>
                            </div>
                        </div>

                        {/* Event Coordinators */}
                        <div className={`team-member-card ${activeFilter === 'all' || activeFilter === 'event-coordinator' ? 'visible' : 'hidden'}`}>
                            <img src={require('../ProfilePictures/ComingSoon.jpg')} alt="Coming Soon" className="team-member-photo"/>
                            <div className="team-member-info">
                                <h3><Link to="/author/comingsoon7" className="author-link">Coming Soon</Link></h3>
                                <span className="team-member-role">Event Coordinator</span>
                            </div>
                        </div>

                        <div className={`team-member-card ${activeFilter === 'all' || activeFilter === 'event-coordinator' ? 'visible' : 'hidden'}`}>
                            <img src={require('../ProfilePictures/ComingSoon.jpg')} alt="Coming Soon" className="team-member-photo"/>
                            <div className="team-member-info">
                                <h3><Link to="/author/comingsoon8" className="author-link">Coming Soon</Link></h3>
                                <span className="team-member-role">Event Coordinator</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Timeline />

            <section className="history-section">
                <div className="section-content">
                    <h2>Our History</h2>
                    <div className="history-content">
                        <p>
                            The Undergraduate Journal of Law and Politics began in 2024 under the leadership of Sam Burnett,
                            Derek Tsai, and Shelby Eliasek. They desired to expand legal research opportunities and collaborate
                            with other interested students at the University of Virginia. Since they began the group, the Journal
                            has published work for many new writers and editors, and the legally interested undergraduate community
                            has grown closer.
                        </p>
                    </div>
                </div>
            </section>

            <section className="work-section">
                <div className="section-content">
                    <h2>Our Work</h2>
                    <div className="work-content">
                        <p>
                            We publish student-produced, long-form law reviews that offer an in-depth analysis of contemporary
                            and historical legal issues. Our writers present their research in public symposiums and discussions,
                            often in collaboration with law school students and legal scholars. Beyond publishing, we support
                            our writers through personalized editorial mentorship and writing guidance to help them grow as legal
                            thinkers and scholars. We also maintain an active website and social media presence to promote our
                            work and share pressing legal and political research with the public.
                        </p>
                    </div>
                </div>
            </section>

            <section className="join-section">
                <div className="section-content">
                    <div className="cta-content">
                        <h2>Join Our Team</h2>
                        <p>We're always looking for talented individuals to join our team. If you're passionate about journalism and want to make a difference, we'd love to hear from you.</p>
                        <a href="#/jointheteam" className="cta-button ">Join Our Team</a>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;