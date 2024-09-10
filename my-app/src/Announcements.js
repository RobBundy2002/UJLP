import React from 'react';
import './Announcements.css';

function Announcements() {
    const announcements = [
        { title: "New Club Meeting", date: "2024-09-15", description: "Join us for our next club meeting where we'll discuss upcoming events and activities." },
        { title: "Annual Conference", date: "2024-10-05", description: "Our annual conference is just around the corner. Don't miss out on the exciting keynote speakers and sessions." },
        { title: "Volunteer Opportunity", date: "2024-11-01", description: "Looking for volunteers for our community outreach program. Get involved and make a difference!" },
    ];

    return (
        <div className="Announcements">
            <h1>Announcements</h1>
            <div className="Announcements-list">
                {announcements.map((announcement, index) => (
                    <div className="Announcement-item" key={index}>
                        <h2>{announcement.title}</h2>
                        <p><strong>Date:</strong> {announcement.date}</p>
                        <p>{announcement.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Announcements;
