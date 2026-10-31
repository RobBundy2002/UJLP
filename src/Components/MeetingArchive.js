import React, { useEffect, useMemo, useState } from 'react';
import { ALUMNI_SESSION_EVENT, getStoredAlumniSession, isAlumniAdmin } from '../Services/alumniApi';
import { fetchMeetingRecaps, getMeetingFileUrl, safeResourceUrl } from '../Services/communityApi';
import MeetingRecapEditor, { emptyMeetingRecap } from './MeetingRecapEditor';
import '../Styling/Community.css';

function ResourceLink({ url, children }) {
    const safeUrl = safeResourceUrl(url);
    return safeUrl ? <a href={safeUrl} target="_blank" rel="noopener noreferrer">{children} <span aria-hidden="true">↗</span></a> : null;
}

function MeetingAttachment({ file, session }) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    async function download() {
        setBusy(true);
        setError('');
        try {
            const url = await getMeetingFileUrl(file, session);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (failure) { setError(failure.message); }
        finally { setBusy(false); }
    }
    return <li><button type="button" disabled={busy} onClick={download}>{busy ? 'Preparing download…' : `Download ${file.kind}: ${file.name}`}</button>{error && <p role="alert">{error}</p>}</li>;
}

function MeetingCard({ meeting, onEdit, session }) {
    const date = new Date(`${meeting.meeting_date}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return <article className="meeting-card">
        <div className="meeting-meta"><span>{meeting.kind}</span><time dateTime={meeting.meeting_date}>{date}</time>{!meeting.published && <strong>Draft · admin only</strong>}</div>
        <h2>{meeting.title}</h2>
        <p>{meeting.summary}</p>
        <div className="meeting-links"><ResourceLink url={meeting.recording_url}>Watch recording</ResourceLink><ResourceLink url={meeting.slides_url}>View slides</ResourceLink></div>
        {meeting.uploaded_files?.length > 0 && <ul className="meeting-attachments" aria-label="Uploaded materials">{meeting.uploaded_files.map(file => <MeetingAttachment key={file.path} file={file} session={session} />)}</ul>}
        {(meeting.notes || meeting.open_questions || meeting.resources?.length > 0) && <details><summary>Notes, resources &amp; follow-up</summary>
            {meeting.notes && <section><h3>Meeting notes</h3><p className="meeting-notes">{meeting.notes}</p></section>}
            {meeting.resources?.length > 0 && <section><h3>Related resources</h3><ul>{meeting.resources.map((resource, index) => <li key={index}><ResourceLink url={resource.url}>{resource.title}</ResourceLink></li>)}</ul></section>}
            {meeting.open_questions && <section><h3>Follow-up questions</h3><p className="meeting-notes">{meeting.open_questions}</p></section>}
        </details>}
        {onEdit && <button type="button" onClick={onEdit}>Edit recap</button>}
    </article>;
}

export default function MeetingArchive() {
    const [session, setSession] = useState(getStoredAlumniSession);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [kind, setKind] = useState('All');
    const [editing, setEditing] = useState(null);
    const [revision, setRevision] = useState(0);
    const isAdmin = isAlumniAdmin(session);
    useEffect(() => {
        const sync = () => setSession(getStoredAlumniSession());
        window.addEventListener(ALUMNI_SESSION_EVENT, sync);
        window.addEventListener('storage', sync);
        window.addEventListener('focus', sync);
        return () => {
            window.removeEventListener(ALUMNI_SESSION_EVENT, sync);
            window.removeEventListener('storage', sync);
            window.removeEventListener('focus', sync);
        };
    }, []);
    useEffect(() => {
        let active = true;
        setLoading(true);
        setError('');
        setMeetings([]);
        fetchMeetingRecaps(session).then(rows => {
            if (active) setMeetings(rows);
        }).catch(() => {
            if (active) setError('Meeting recaps are unavailable right now. Please try again later.');
        }).finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [session, revision]);
    useEffect(() => { setEditing(null); }, [session]);
    const visible = useMemo(() => meetings.filter(meeting => (isAdmin || meeting.published)
        && (kind === 'All' || meeting.kind === kind)
        && `${meeting.title} ${meeting.summary} ${meeting.notes}`.toLowerCase().includes(query.toLowerCase().trim()))
        .sort((a, b) => b.meeting_date.localeCompare(a.meeting_date)), [meetings, isAdmin, kind, query]);

    return <section className="meetings-page meeting-archive" id="meeting-recaps" aria-labelledby="meeting-archive-heading">
        <header className="meetings-heading"><p className="jh-section-label">Past meetings &amp; materials</p><h2 id="meeting-archive-heading">Meeting recaps</h2><p>Recordings, slides, notes, and follow-up questions from UJLP meetings, workshops, and panels.</p></header>
        {isAdmin && <div className="meeting-admin"><button type="button" onClick={() => setEditing(emptyMeetingRecap)}>Add recap</button><span>Drafts are visible only to administrators.</span></div>}
        {isAdmin && editing && <MeetingRecapEditor key={editing.id || 'new'} initial={editing} session={session} onCancel={() => setEditing(null)} onSave={() => { setEditing(null); setRevision(value => value + 1); }} />}
        {meetings.length > 0 && <div className="meeting-filters"><label>Search recaps<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Topic, title, or notes" /></label><label>Event type<select value={kind} onChange={event => setKind(event.target.value)}>{['All', 'Meeting', 'Workshop', 'Panel'].map(value => <option key={value}>{value}</option>)}</select></label></div>}
        {loading ? <p role="status">Loading meeting recaps…</p> : error ? <div className="meeting-empty"><h2>We couldn’t load the archive.</h2><p role="status">{error}</p><button type="button" onClick={() => setRevision(value => value + 1)}>Try again</button></div> : visible.length === 0 ? <div className="meeting-empty"><span aria-hidden="true">01 / THE ARCHIVE</span><h2>{meetings.length ? 'No matching recaps.' : 'No meeting recaps published yet.'}</h2><p>{meetings.length ? 'Try another search or event type.' : 'Meeting materials will appear here after a recap is published. Recordings and notes will stay together, so you can revisit them later.'}</p></div> : <div className="meeting-list">{visible.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} session={session} onEdit={isAdmin ? () => setEditing(meeting) : null} />)}</div>}
    </section>;
}
