import React, { useEffect, useRef, useState } from 'react';
import PDFViewer from './PDFViewer';
import unequalOpportunity from '../Data/articleTexts/unequalopportunity.json';
import schoolhouseSecrets from '../Data/articleTexts/schoolhousesecrets.json';
import '../Styling/ArticleReader.css';

const manuscripts = { unequalopportunity: unequalOpportunity, schoolhousesecrets: schoolhouseSecrets };

function CitationText({ text }) {
    // Only link explicit source URLs; abbreviated citations remain as published.
    return text.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
        if (!/^https?:\/\//.test(part)) return part;
        const url = part.replace(/[.,;]+$/, '');
        return <React.Fragment key={index}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a>{part.slice(url.length)}</React.Fragment>;
    });
}

function ArticleReader({ articleId, title, author }) {
    const manuscript = manuscripts[articleId];
    const [mode, setMode] = useState('pdf');
    const [activeSection, setActiveSection] = useState(manuscript.sections[0].id);
    const [activeNote, setActiveNote] = useState(null);
    const dialogRef = useRef(null);
    const triggerRef = useRef(null);
    const mobileContentsRef = useRef(null);
    const sectionRefs = useRef({});

    useEffect(() => {
        if (mode !== 'online') return undefined;
        let pending = false;
        const update = () => {
            pending = false;
            let current = manuscript.sections[0].id;
            manuscript.sections.forEach(section => {
                if (sectionRefs.current[section.id]?.getBoundingClientRect().top <= 180) current = section.id;
            });
            setActiveSection(current);
        };
        let frame;
        const onScroll = () => {
            if (!pending) { pending = true; frame = requestAnimationFrame(update); }
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
    }, [mode, manuscript]);

    useEffect(() => {
        if (activeNote !== null && !dialogRef.current.open) dialogRef.current.showModal();
    }, [activeNote]);

    const jumpTo = id => {
        if (mobileContentsRef.current) mobileContentsRef.current.open = false;
        const heading = document.getElementById(`${articleId}-${id}`);
        if (heading) window.scrollTo({ top: heading.getBoundingClientRect().top + window.scrollY - 130, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        heading?.focus({ preventScroll: true });
        setActiveSection(id);
    };
    const openNote = (number, event) => {
        triggerRef.current = event.currentTarget;
        setActiveNote(number);
    };
    const contents = () => (
        <ol>{manuscript.sections.map(section => (
            <li key={section.id}><button type="button" aria-current={activeSection === section.id ? 'location' : undefined} onClick={() => jumpTo(section.id)}>{section.title}</button></li>
        ))}<li><button type="button" onClick={() => jumpTo('footnotes')}>Footnotes</button></li></ol>
    );

    return (
        <section className="article-reading-room" aria-label="Read the article">
            <div className="article-reader-tabs" role="tablist" aria-label="Article format">
                {['online', 'pdf'].map(format => <button key={format} id={`${articleId}-tab-${format}`} type="button" role="tab" aria-selected={mode === format} aria-controls={`${articleId}-panel`} tabIndex={mode === format ? 0 : -1} onClick={() => setMode(format)} onKeyDown={event => {
                    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                        event.preventDefault();
                        const next = event.key === 'Home' ? 'online' : event.key === 'End' ? 'pdf' : mode === 'online' ? 'pdf' : 'online';
                        setMode(next);
                        document.getElementById(`${articleId}-tab-${next}`)?.focus();
                    }
                }}>{format === 'online' ? 'Read online' : 'Original PDF'}</button>)}
            </div>
            <div id={`${articleId}-panel`} role="tabpanel" aria-labelledby={`${articleId}-tab-${mode}`} tabIndex={0}>
                {mode === 'pdf' ? <PDFViewer pdfPath={manuscript.sourcePdf} title={title} author={author} /> : <>
                    <details className="article-mobile-contents" ref={mobileContentsRef}>
                        <summary>On this page</summary><nav aria-label="Article sections on mobile">{contents()}</nav>
                    </details>
                    <div className="article-reader-layout">
                        <nav className="article-desktop-contents" aria-label="Article sections"><p>On this page</p>{contents()}<a href={manuscript.sourcePdf} target="_blank" rel="noopener noreferrer">Open published PDF ↗</a></nav>
                        <div className="article-reader-text">
                            <p className="article-reader-note">Published May 2026 · Footnote numbers open citation previews.</p>
                            {manuscript.sections.map(section => <section key={section.id} ref={element => { sectionRefs.current[section.id] = element; }} aria-labelledby={`${articleId}-${section.id}`}>
                                <h2 id={`${articleId}-${section.id}`} tabIndex={-1}>{section.title}</h2>
                                {section.paragraphs.map((tokens, paragraphIndex) => <p key={paragraphIndex}>{tokens.map((token, tokenIndex) => {
                                    if (token.note) return <sup key={tokenIndex}><button type="button" className="article-footnote-reference" id={`${articleId}-ref-${token.note}`} aria-label={`Read footnote ${token.note}`} aria-haspopup="dialog" onClick={event => openNote(token.note, event)}>{token.note}</button></sup>;
                                    return token.italic ? <em key={tokenIndex}>{token.text}</em> : <React.Fragment key={tokenIndex}>{token.text}</React.Fragment>;
                                })}</p>)}
                            </section>)}
                            <section className="article-endnotes" aria-labelledby={`${articleId}-footnotes`}>
                                <h2 id={`${articleId}-footnotes`} tabIndex={-1}>Footnotes</h2>
                                <ol>{Object.entries(manuscript.footnotes).map(([number, text]) => <li key={number} id={`${articleId}-note-${number}`} value={Number(number)}><CitationText text={text} /> <button type="button" aria-label={`Return to footnote ${number} in the article`} onClick={() => { const ref = document.getElementById(`${articleId}-ref-${number}`); ref?.scrollIntoView({ block: 'center' }); ref?.focus({ preventScroll: true }); }}>↩</button></li>)}</ol>
                            </section>
                        </div>
                    </div>
                </>}
            </div>
            <dialog ref={dialogRef} className="article-citation-dialog" aria-labelledby={`${articleId}-citation-title`} onClick={event => { if (event.target === dialogRef.current) dialogRef.current.close(); }} onClose={() => { setActiveNote(null); triggerRef.current?.focus({ preventScroll: true }); }}>
                <div className="article-citation-panel">
                    <div><h2 id={`${articleId}-citation-title`}>Footnote {activeNote}</h2><button type="button" autoFocus aria-label="Close citation preview" onClick={() => dialogRef.current.close()}>Close ×</button></div>
                    <p>{activeNote && <CitationText text={manuscript.footnotes[activeNote]} />}</p>
                </div>
            </dialog>
        </section>
    );
}

export default ArticleReader;
