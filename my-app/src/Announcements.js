import React from 'react';
import './Announcements.css';

const announcements = [
    {
        title: "New Exec Team Members Announced",
        date: "April 13, 2025",
        content: "We're excited to welcome our new exec team members for the 2025–2026 academic year. Check out the About page to meet the team.",
        category: "Team Updates"
    },
    {
        title: "Guest Speaker Event: Yumiao (Michael) Wang",
        date: "January 24, 2025",
        content: "The UJLP will be hosting a guest speaker event with S.J.D. Candidate and Double Hoo: Yumiao (Michael) Wang! Join us to hear his insights on law, politics, and his academic journey. Location: NewCab323. Time: 12:00 PM, January 24, 2025.",
        category: "Events"
    },
    {
        title: "New Member Announcement: 2024-2025 Publication Cycle",
        date: "October 24, 2024",
        content: "The UJLP is excited to announce that we have formally accepted 10 new writers and 7 new editors for our 2024-2025 publication cycle! We look forward to the contributions these new members will bring to our journal.",
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
                            className="cta-button primary"
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