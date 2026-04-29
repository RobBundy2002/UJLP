import React, { useState, useRef, useEffect } from 'react';
import '../Styling/CiteShare.css';
import { emitToast } from './Toast';

function formatAPA({ title, author, date, url }) {
  const authorStr = author || 'UJLP';
  const year = (date && new Date(date).getFullYear()) || new Date().getFullYear();
  return `${authorStr} (${year}). ${title}. Retrieved from ${url}`;
}

function formatMLA({ title, author, date, url }) {
  const authorStr = author || 'UJLP';
  const year = (date && new Date(date).getFullYear()) || new Date().getFullYear();
  return `${authorStr}. "${title}." ${year}. ${url}`;
}

function formatChicago({ title, author, date, url }) {
  const authorStr = author || 'UJLP';
  const year = (date && new Date(date).getFullYear()) || new Date().getFullYear();
  return `${authorStr}. "${title}." ${year}. ${url}`;
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((res, rej) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      res();
    } catch (e) {
      rej(e);
    }
  });
}

function CiteShare({ title, author, date, url }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const meta = { title, author, date, url };

  useEffect(() => {
    const onDocClick = (e) => {
      if (open && wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const onCopy = async (format) => {
    let text;
    if (format === 'apa') text = formatAPA(meta);
    else if (format === 'mla') text = formatMLA(meta);
    else if (format === 'chicago') text = formatChicago(meta);
    else text = url;

    try {
      await copyToClipboard(text);
      emitToast('Copied to clipboard');
    } catch (e) {
      emitToast('Copy failed — please copy manually');
      console.error(e);
    }
  };

  return (
    <div className="cite-popover-wrapper" ref={wrapperRef}>
      <button ref={buttonRef} className="cite-trigger large" onClick={() => setOpen(o => !o)}>Quick Citations Here!</button>

      {open && (
        <div className="cite-popover" role="dialog" aria-label="Citation options">
          <div className="cite-popover-header"><strong>Cite this article</strong></div>
          <div className="cite-popover-body">
            <div className="cite-actions center">
              <button onClick={() => onCopy('apa')} className="cite-btn orange">Copy APA</button>
              <button onClick={() => onCopy('mla')} className="cite-btn orange">Copy MLA</button>
              <button onClick={() => onCopy('chicago')} className="cite-btn orange">Copy Chicago</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CiteShare;
