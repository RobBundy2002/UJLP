import React, { useEffect, useMemo, useState } from 'react';
import '../Styling/Announcements.css';
import '../Styling/EditorialPages.css';
import ParticleBackground from '../Components/ParticleBackground';
import { ALUMNI_SESSION_EVENT, getStoredAlumniSession, isAlumniAdmin } from '../Services/alumniApi';
import { deletePortalItem, fetchPortalContent, fetchPublicAnnouncements, savePortalItem } from '../Services/alumniPortalApi';

const defaultAnnouncementDraft = {
    id: '',
    title: '',
    body: '',
    category: 'Update',
    publishDate: '',
    pinned: false
};

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
    const [session, setSession] = useState(() => getStoredAlumniSession());
    const [announcements, setAnnouncements] = useState([]);
    const [announcementDraft, setAnnouncementDraft] = useState(defaultAnnouncementDraft);
    const [adminMessage, setAdminMessage] = useState('');
    const isAdmin = isAlumniAdmin(session);

    useEffect(() => {
        let isMounted = true;
        const load = isAdmin && session
            ? fetchPortalContent(session).then(content => {
                if (!isMounted) return;
                setAnnouncements(content.announcements);
            })
            : fetchPublicAnnouncements().then(rows => {
                if (!isMounted) return;
                setAnnouncements(rows);
            });
        load.catch(() => {
            if (isMounted) {
                setAnnouncements([]);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [isAdmin, session]);

    useEffect(() => {
        const syncSession = () => setSession(getStoredAlumniSession());
        window.addEventListener(ALUMNI_SESSION_EVENT, syncSession);
        window.addEventListener('storage', syncSession);
        window.addEventListener('focus', syncSession);
        return () => {
            window.removeEventListener(ALUMNI_SESSION_EVENT, syncSession);
            window.removeEventListener('storage', syncSession);
            window.removeEventListener('focus', syncSession);
        };
    }, []);

    const [leadAnnouncement, secondaryAnnouncements] = useMemo(() => {
        const sorted = [...announcements].sort((left, right) => {
            if (left.pinned !== right.pinned) return left.pinned ? -1 : 1;
            return String(right.publishDate).localeCompare(String(left.publishDate));
        });
        return [sorted[0], sorted.slice(1, 3)];
    }, [announcements]);

    const handleAnnouncementSave = async (event) => {
        event.preventDefault();
        if (!isAdmin) return;

        setAdminMessage('');
        try {
            const saved = await savePortalItem('announcements', {
                id: announcementDraft.id || undefined,
                title: announcementDraft.title,
                body: announcementDraft.body,
                category: announcementDraft.category,
                publishDate: announcementDraft.publishDate,
                audience: 'public',
                taggedUserIds: [],
                pinned: announcementDraft.pinned
            }, session);
            setAnnouncements(current => [saved, ...current.filter(item => item.id !== saved.id)]);
            setAnnouncementDraft(defaultAnnouncementDraft);
            setAdminMessage('Announcement saved.');
        } catch (error) {
            setAdminMessage(error.message);
        }
    };

    const handleAdminDelete = async (id) => {
        if (!isAdmin) return;

        setAdminMessage('');
        try {
            await deletePortalItem('announcements', id, session);
            setAnnouncements(current => current.filter(item => item.id !== id));
            setAdminMessage('Deleted.');
        } catch (error) {
            setAdminMessage(error.message);
        }
    };

    const renderAdminTools = () => {
        if (!isAdmin) return null;

        return (
            <section className="announcements-admin-section">
                <div className="section-content announcements-admin-grid">
                    <div className="announcements-admin-form">
                        <div className="announcement-admin-heading">
                            <span>Admin publishing</span>
                            <strong>Edit public announcements</strong>
                        </div>
                        <form onSubmit={handleAnnouncementSave}>
                            <label>
                                <span>Title</span>
                                <input value={announcementDraft.title} onChange={(event) => setAnnouncementDraft(current => ({ ...current, title: event.target.value }))} required />
                            </label>
                            <label>
                                <span>Body</span>
                                <textarea value={announcementDraft.body} onChange={(event) => setAnnouncementDraft(current => ({ ...current, body: event.target.value }))} required rows="5" />
                            </label>
                            <div className="announcement-admin-fields">
                                <label>
                                    <span>Category</span>
                                    <input value={announcementDraft.category} onChange={(event) => setAnnouncementDraft(current => ({ ...current, category: event.target.value }))} />
                                </label>
                                <label>
                                    <span>Publish date</span>
                                    <input type="date" value={announcementDraft.publishDate} onChange={(event) => setAnnouncementDraft(current => ({ ...current, publishDate: event.target.value }))} />
                                </label>
                            </div>
                            <label className="announcement-admin-checkbox">
                                <input type="checkbox" checked={announcementDraft.pinned} onChange={(event) => setAnnouncementDraft(current => ({ ...current, pinned: event.target.checked }))} />
                                <span>Pin announcement</span>
                            </label>
                            <div className="announcement-admin-actions">
                                <button type="submit">Save announcement</button>
                                <button type="button" onClick={() => setAnnouncementDraft(defaultAnnouncementDraft)}>New</button>
                            </div>
                        </form>
                        {adminMessage && <p className="announcement-admin-message">{adminMessage}</p>}
                    </div>

                    <aside className="announcements-admin-list">
                        <div className="announcement-admin-heading">
                            <span>Manage</span>
                            <strong>Announcements</strong>
                        </div>
                        {announcements.map(item => (
                            <article className="announcement-admin-item" key={item.id}>
                                <div>
                                    <span>{item.category || 'Announcement'}</span>
                                    <strong>{item.title}</strong>
                                    <time>{formatDate(item.publishDate)}</time>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setAnnouncementDraft({
                                            id: item.id,
                                            title: item.title,
                                            body: item.body,
                                            category: item.category,
                                            publishDate: item.publishDate,
                                            pinned: item.pinned
                                        })}
                                    >
                                        Edit
                                    </button>
                                    <button type="button" onClick={() => handleAdminDelete(item.id)}>Delete</button>
                                </div>
                            </article>
                        ))}
                    </aside>
                </div>
            </section>
        );
    };

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

            {renderAdminTools()}
        </div>
    );
}

export default Announcements;
