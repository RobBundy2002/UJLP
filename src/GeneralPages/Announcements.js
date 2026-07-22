import React from 'react';
import '../Styling/Announcements.css';
import '../Styling/EditorialPages.css';
import ParticleBackground from '../Components/ParticleBackground';

const announcements = [
    {
        title: "UJLP Reorganizes Under a New Leadership Team",
        date: "July 13, 2025",
        content: "In preparation for the upcoming semester, UJLP restructured its leadership team and publishing pathways. Effective immediately, Derek Tsai is promoted to Editor-in-Chief, Shelby Eliasek is promoted to Director of Operations, and Evan Proudkii is promoted to Managing Editor.",
        category: "Team Updates"
    },
];

function Announcements() {
    return (
        <div className="announcements-container jh-page jh-announcements fade-in">
            <section className="announcements-hero">
                <ParticleBackground />
                <div className="section-content">
                    <p className="jh-eyebrow jh-announcements-kicker"><strong>UJLP</strong> · University of Virginia · Est. 2024</p>
                    <h1>The latest<br /><em>from UJLP.</em></h1>
                    <p className="hero-content">
                        Stay updated with our latest events, news, and activities at UJLP
                    </p>
                </div>
            </section>

            <section className="announcements-section">
                <div className="section-content">
                    <div className="jh-announcement-intro">
                        <span>Latest signal</span>
                        <p>News, milestones, and opportunities from the Journal.</p>
                    </div>
                    <div className="jh-announcement-feed">
                        {announcements.map((announcement, index) => (
                            <article className="jh-announcement" key={index}>
                                <span className="jh-announcement-number">0{index + 1}</span>
                                <div>
                                    <span className="announcement-category">{announcement.category}</span>
                                    <h2>{announcement.title}</h2>
                                    <time className="announcement-date">{announcement.date}</time>
                                    <p className="announcement-text">{announcement.content}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="subscribe-section jh-subscribe">
                <div className="section-content">
                    <div><p className="jh-announcements-kicker">Don’t miss a signal</p><h2>Stay in the<br /><em>loop.</em></h2></div>
                    <p>Subscribe to receive updates about events, publications, and opportunities.</p>
                    <form className="subscribe-form">
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="subscribe-input"
                        />
                        <button 
                            type="submit" 
                            className="cta-button"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default Announcements;
