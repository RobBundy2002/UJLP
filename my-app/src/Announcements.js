import React from 'react';
import './Announcements.css';

function Announcements() {
    const announcements = [
        { title: "New Member Announcement", date: "2024-10-24", description:" The UJLP formally accepted 10 new writers and 7 new editors for our 2024-2025 publication cycle! " },
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
