import React from 'react';
import '../Styling/Announcements.css';

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
        <div className="announcements-container fade-in">
            <section className="announcements-hero">
                <div className="section-content">
                    <h1>Announcements</h1>
                    <p className="hero-content">
                        Stay updated with our latest events, news, and activities at UJLP
                    </p>
                </div>
            </section>

            <section className="announcements-section">
                <div className="section-content">
                    <div className="announcements-grid">
                        {announcements.map((announcement, index) => (
                            <article className="announcement-card" key={index}>
                                <div className="announcement-content">
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

            <section className="subscribe-section">
                <div className="section-content">
                    <h2>Stay Connected</h2>
                    <p>Subscribe to our newsletter to receive updates about events, publications, and opportunities.</p>
                    <form className="subscribe-form">
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="subscribe-input"
                        />
                        <button 
                            type="submit" 
                            className="cta-button"
                            style={{ width: "100%" }}
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