import React from 'react';
import './Announcements.css';

// Array with announcement data stored as strings
const announcements = [
    "Guest Speaker Event | 1/24/2025 | 12:00PM | NewCab323 | The UJLP will be hosting a guest speaker event with S.J.D. Candidate and Double Hoo: Yumiao (Michael) Wang!",
    "New Member Announcement | 10/24/2024 |  |  | The UJLP formally accepted 10 new writers and 7 new editors for our 2024-2025 publication cycle!"
];

function Announcements() {
    return (
        <div className="Announcements">
            <h1>Announcements</h1>
            <div className="Announcements-list">
                {announcements.map((announcement, index) => {
                    const [title, date, time, location, description] = announcement.split(" | ");

                    return (
                        <div className="Announcement-item" key={index}>
                            <h2>{title}</h2>
                            <p><strong>Date:</strong> {date}</p>
                            {time && <p><strong>Time:</strong> {time}</p>}
                            {location && <p><strong>Location:</strong> {location}</p>}
                            <p>{description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Announcements;
