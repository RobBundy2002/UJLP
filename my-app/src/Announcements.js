import React from 'react';
import './Announcements.css';

function Announcements() {
    const announcements = [
        { title: "Guest Speaker Event", date: "1/24/2025", description:" The UJLP will be hosting a guest speaker event with S.J.D. Candidate and Double Hoo: Yumiao (Michael) Wang!" },
        { title: "New Member Announcement", date: "10/24/2024", description:" The UJLP formally accepted 10 new writers and 7 new editors for our 2024-2025 publication cycle! " },
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
