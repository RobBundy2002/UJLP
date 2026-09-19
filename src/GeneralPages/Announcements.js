import React, { useEffect, useMemo, useState } from 'react';
import '../Styling/Announcements.css';
import '../Styling/EditorialPages.css';
import ParticleBackground from '../Components/ParticleBackground';
import { fetchPublicAnnouncements } from '../Services/alumniPortalApi';

const formatDate = (value) => {
    if (!value) return 'Date pending';
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};

function Announcements() {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        let isMounted = true;
        fetchPublicAnnouncements().then(rows => {
            if (isMounted) setAnnouncements(rows);
        });
        return () => {
            isMounted = false;
        };
    }, []);

    const [leadAnnouncement, secondaryAnnouncements] = useMemo(() => {
        const sorted = [...announcements].sort((left, right) => {
            if (left.pinned !== right.pinned) return left.pinned ? -1 : 1;
            return String(right.publishDate).localeCompare(String(left.publishDate));
        });
        return [sorted[0], sorted.slice(1, 3)];
    }, [announcements]);

    return (
        <div className="announcements-container jh-page jh-announcements fade-in">
            <section className="announcements-hero">
                <ParticleBackground />
                <div className="section-content announcements-hero-layout">
                    <div>
                        <p className="jh-eyebrow jh-announcements-kicker"><strong>UJLP</strong> / Newsroom</p>
                        <h1>Announcements</h1>
                        <p className="hero-content">
                            Updates, events, deadlines, and opportunities from the Undergraduate Journal of Law and Politics.
                        </p>
                    </div>
                    <div className="announcements-hero-panel">
                        <span>Latest bulletin</span>
                        <strong>{leadAnnouncement?.title || 'Updates coming soon'}</strong>
                        <p>{leadAnnouncement ? formatDate(leadAnnouncement.publishDate) : 'Check back for the next public update.'}</p>
                    </div>
                </div>
            </section>

            <section className="announcements-section">
                <div className="section-content announcements-board">
                    {leadAnnouncement && (
                        <article className="announcement-lead">
                            <span>{leadAnnouncement.category}</span>
                            <h2>{leadAnnouncement.title}</h2>
                            <time>{formatDate(leadAnnouncement.publishDate)}</time>
                            <p>{leadAnnouncement.body}</p>
                        </article>
                    )}

                    <aside className="announcement-rail" aria-label="Recent announcements">
                        <div className="announcement-rail-heading">
                            <span>Recent</span>
                            <strong>{secondaryAnnouncements.length}</strong>
                        </div>
                        {secondaryAnnouncements.map(announcement => (
                            <article key={announcement.id} className="announcement-brief">
                                <span>{announcement.category}</span>
                                <h3>{announcement.title}</h3>
                                <time>{formatDate(announcement.publishDate)}</time>
                            </article>
                        ))}
                        {secondaryAnnouncements.length === 0 && (
                            <p className="announcement-empty">No additional public announcements are posted.</p>
                        )}
                    </aside>
                </div>
            </section>
        </div>
    );
}

export default Announcements;
