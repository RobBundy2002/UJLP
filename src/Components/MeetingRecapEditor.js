import React, { useState } from 'react';
import { meetingUploadTypes, saveMeetingRecap, uploadMeetingFile } from '../Services/communityApi';

export const emptyMeetingRecap = {
    title: '', meeting_date: '', kind: 'Meeting', summary: '', notes: '',
    open_questions: '', recording_url: '', slides_url: '', resources: [], uploaded_files: [], published: false
};

export default function MeetingRecapEditor({ initial, session, onSave, onCancel }) {
    const [draft, setDraft] = useState(initial || emptyMeetingRecap);
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);
    const [uploadKind, setUploadKind] = useState('slides');
    const update = (field, value) => setDraft(current => ({ ...current, [field]: value }));

    async function submit(event) {
        event.preventDefault();
        setBusy(true);
        setMessage('');
        try { await saveMeetingRecap(draft, session); onSave(); }
        catch (error) { setMessage(error.message); }
        finally { setBusy(false); }
    }

    async function saveDraft() {
        setBusy(true);
        setMessage('');
        try {
            const saved = await saveMeetingRecap({ ...draft, published: false }, session);
            setDraft(saved);
            setMessage('Draft saved. You can now upload files.');
        } catch (error) { setMessage(error.message); }
        finally { setBusy(false); }
    }

    async function upload(event) {
        const file = event.target.files[0];
        if (!file) return;
        event.target.value = '';
        setBusy(true);
        setMessage('Uploading file…');
        try {
            const asset = await uploadMeetingFile(draft.id, file, uploadKind, session);
            setDraft(current => ({ ...current, uploaded_files: [...(current.uploaded_files || []), asset] }));
            setMessage('File uploaded privately. Save the recap to attach it; publish the recap to make it available to visitors.');
        } catch (error) { setMessage(error.message); }
        finally { setBusy(false); }
    }

    return <form className="meeting-editor" onSubmit={submit}>
        <h2>{draft.id ? 'Edit recap' : 'Add a meeting recap'}</h2>
        <p>Publish only materials approved for public sharing. Leave unavailable links blank.</p>
        <div className="meeting-form-grid">
            <label>Title<input required value={draft.title} onChange={event => update('title', event.target.value)} /></label>
            <label>Date<input required type="date" value={draft.meeting_date} onChange={event => update('meeting_date', event.target.value)} /></label>
            <label>Type<select value={draft.kind} onChange={event => update('kind', event.target.value)}>{['Meeting', 'Workshop', 'Panel'].map(kind => <option key={kind}>{kind}</option>)}</select></label>
        </div>
        <label>Summary<textarea required rows={3} value={draft.summary} onChange={event => update('summary', event.target.value)} /></label>
        <label>Meeting notes<textarea rows={5} value={draft.notes} onChange={event => update('notes', event.target.value)} /></label>
        <label>Follow-up questions<textarea rows={3} value={draft.open_questions} onChange={event => update('open_questions', event.target.value)} /></label>
        <fieldset><legend>Related resources</legend>{draft.resources.map((resource, index) => <div className="meeting-resource-row" key={index}>
            <label>Resource title<input required value={resource.title} onChange={event => update('resources', draft.resources.map((item, i) => i === index ? { ...item, title: event.target.value } : item))} /></label>
            <label>Resource URL<input required type="url" placeholder="https://" value={resource.url} onChange={event => update('resources', draft.resources.map((item, i) => i === index ? { ...item, url: event.target.value } : item))} /></label>
            <button type="button" aria-label={`Remove resource ${index + 1}`} onClick={() => update('resources', draft.resources.filter((_, i) => i !== index))}>Remove</button>
        </div>)}<button type="button" onClick={() => update('resources', [...draft.resources, { title: '', url: '' }])}>Add resource</button></fieldset>
        <fieldset className="meeting-upload"><legend>Upload materials</legend>
            {!draft.id ? <><p>Save the title, date, and summary as a draft first. Then add files here.</p><button type="button" disabled={busy} onClick={saveDraft}>Save draft &amp; enable uploads</button></> : <>
                <p>PDFs, presentations, documents, text, MP4, WebM, MP3, or WAV. Maximum 50 MiB per file. Larger recordings can use the recording URL above.</p>
                <label>File category<select disabled={busy} value={uploadKind} onChange={event => setUploadKind(event.target.value)}><option value="slides">Slides</option><option value="recording">Recording</option><option value="resource">Related resource</option></select></label>
                <label>Choose a file<input type="file" disabled={busy} accept={Object.keys(meetingUploadTypes).map(extension => `.${extension}`).join(',')} onChange={upload} /></label>
            </>}
            {(draft.uploaded_files || []).length > 0 && <ul>{draft.uploaded_files.map(file => <li key={file.path}><span>{file.name} · {file.kind}</span><button type="button" disabled={busy} aria-label={`Remove attachment ${file.name}`} onClick={() => update('uploaded_files', draft.uploaded_files.filter(item => item.path !== file.path))}>Remove attachment</button></li>)}</ul>}
        </fieldset>
        <details className="meeting-external-links">
            <summary>Use existing recording or slide links instead (optional)</summary>
            <p>For example, an existing YouTube recording or a shared Google Slides presentation. You can upload files above without using these fields.</p>
            <label>Recording URL<input type="url" placeholder="https://" value={draft.recording_url} onChange={event => update('recording_url', event.target.value)} /></label>
            <label>Slides URL<input type="url" placeholder="https://" value={draft.slides_url} onChange={event => update('slides_url', event.target.value)} /></label>
        </details>
        <label className="community-checkbox"><input type="checkbox" checked={draft.published} onChange={event => update('published', event.target.checked)} />Publish on the public archive</label>
        <div className="community-actions"><button disabled={busy} type="submit">{busy ? 'Saving…' : 'Save recap'}</button><button disabled={busy} type="button" onClick={onCancel}>Cancel</button></div>
        {message && <p role="alert">{message}</p>}
    </form>;
}
