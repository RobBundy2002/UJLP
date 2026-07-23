import React from 'react';

function BioFrame({ name, children }) {
    return <div className="bio-frame" style={{ '--bio-signature': `"${name}"` }}>
        {children}
        <aside className="bio-signature-dossier" aria-label={`Profile signature for ${name}`}>
            <span className="bio-signature-label">Profile signature</span>
            <strong className="bio-signature-mark">{name}</strong>
        </aside>
    </div>;
}

export default BioFrame;
