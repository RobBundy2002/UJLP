import React, { useEffect, useState } from 'react';
import { affiliationOptions, fetchAffiliationReviews, requestAffiliationReview, reviewAffiliation } from '../Services/communityApi';
import '../Styling/Community.css';

export function useAffiliationReviews(session) {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState('');
    const [revision, setRevision] = useState(0);
    useEffect(() => {
        let active = true;
        setReviews([]);
        setError('');
        fetchAffiliationReviews(session).then(rows => {
            if (active) setReviews(rows);
        }).catch(() => {
            if (active) setError('Affiliation reviews are unavailable. Please try again later.');
        });
        return () => { active = false; };
    }, [session, revision]);
    return { reviews, error, reload: () => setRevision(current => current + 1) };
}

export function AffiliationBadge({ review }) {
    if (review?.status !== 'verified') return <span className="affiliation-unverified">Affiliation self-reported</span>;
    const label = affiliationOptions.find(option => option.value === review.affiliation)?.label;
    if (!label) return null;
    return <span className="affiliation-badge" title="An administrator reviewed this affiliation. It does not verify employment or grant additional access.">✓ {label} · verified</span>;
}

export function AffiliationReviewPanel({ profile, review, session, isAdmin, error, onChange }) {
    const [affiliation, setAffiliation] = useState(affiliationOptions[0].value);
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);
    useEffect(() => { setAffiliation(review?.affiliation || affiliationOptions[0].value); }, [review?.affiliation]);
    const isOwner = profile.userId === session?.user?.id;
    if ((!isOwner && !isAdmin) || profile.isExample) return null;

    async function submit(action) {
        setBusy(true);
        setMessage('');
        try {
            if (action === 'request') await requestAffiliationReview(affiliation, session);
            else await reviewAffiliation(profile.userId, action, session);
            setMessage(action === 'request' ? 'Review requested. Your affiliation stays self-reported until approved.' : 'Review saved.');
            onChange();
        } catch (failure) { setMessage(failure.message); }
        finally { setBusy(false); }
    }

    return <section className="affiliation-review" aria-label="Affiliation verification">
        <h3>Affiliation verification</h3>
        <p>UJLP administrators confirm affiliation separately from the details you enter in your profile.</p>
        {review && <p>Status: <strong>{review.status === 'declined' ? 'Not confirmed' : review.status}</strong> · {affiliationOptions.find(option => option.value === review.affiliation)?.label}</p>}
        {error && <p role="status">{error}</p>}
        {isOwner && review?.status === 'verified' && <p>A new request replaces the current verification while it is reviewed.</p>}
        {isOwner && <form onSubmit={event => { event.preventDefault(); submit('request'); }}>
            <label>Affiliation to review<select value={affiliation} onChange={event => setAffiliation(event.target.value)}>{affiliationOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <button type="submit" disabled={busy || Boolean(error) || review?.status === 'pending'}>{review?.status === 'pending' ? 'Review pending' : review?.status === 'verified' ? 'Request updated affiliation' : 'Request review'}</button>
        </form>}
        {isAdmin && review && <div className="community-actions">
            {review.status !== 'verified' && <button type="button" disabled={busy || Boolean(error)} onClick={() => submit('verified')}>Confirm affiliation</button>}
            {review.status !== 'declined' && <button type="button" disabled={busy || Boolean(error)} onClick={() => submit('declined')}>{review.status === 'verified' ? 'Revoke verification' : 'Decline request'}</button>}
        </div>}
        {message && <p role="status">{message}</p>}
    </section>;
}
