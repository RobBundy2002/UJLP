import React from 'react';
import './Announcements.css';

function Announcements() {
    const announcements = [
        { title: "New Club Meeting", date: "2024-09-15", description:" UJLP Interest meetings: Friday, September 20 and 27, 5:00pm, New Cabell Hall 027. We will be discussing the membership process, applications, club functions, and more! Demonstrating interest in joining our group is important, so make attendance a priority (or shoot us an email and we’ll get you caught up). " },
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
