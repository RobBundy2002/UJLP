import React from 'react';
import './Announcements.css';

const announcements = [
    {
        title: "New Exec Team Members Announced",
        date: "April 13, 2025",
        content: "We’re excited to welcome our new exec team members for the 2025–2026 academic year. Check out the About page to meet the team."
    },
    {
        title: "Guest Speaker Event: Yumiao (Michael) Wang",
        date: "January 24, 2025",
        content: "The UJLP will be hosting a guest speaker event with S.J.D. Candidate and Double Hoo: Yumiao (Michael) Wang! Join us to hear his insights on law, politics, and his academic journey. Location: NewCab323. Time: 12:00 PM, January 24, 2025."
    },
    {
        title: "New Member Announcement: 2024-2025 Publication Cycle",
        date: "October 24, 2024",
        content: "The UJLP is excited to announce that we have formally accepted 10 new writers and 7 new editors for our 2024-2025 publication cycle! We look forward to the contributions these new members will bring to our journal."
    },
];

function Announcements() {
    return (
        <div className="announcements-page">
            <section className="announcements-header">
                <h1>Recent Announcements</h1>
                <p>Stay updated with our latest events, news, and activities at UJLP.</p>
            </section>

            <section className="announcement-cards">
                {announcements.map((announcement, index) => (
                    <div className="announcement-card" key={index}>
                        <h2>{announcement.title}</h2>
                        <p className="announcement-date">{announcement.date}</p>
                        <p>{announcement.content}</p>
                        <a href={announcement.link} className="announcement-link">Read More →</a>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default Announcements;;