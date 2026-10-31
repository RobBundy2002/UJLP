import React from 'react';
import framing from '../Data/portraitFraming.json';
import '../Styling/Portrait.css';

// The build keeps the original filename before the content hash.
function Portrait({ src, name, className = '' }) {
    const key = src.split('/').pop().split('.')[0];
    const crop = framing[key];
    const style = crop?.fit ? {
        objectFit: crop.fit,
        objectPosition: 'center top',
    } : crop ? {
        width: `${crop.width}%`,
        left: `${crop.left}%`,
        top: `${crop.top}%`,
    } : undefined;

    return (
        <span className={`portrait-frame ${className}`}>
            <img src={src} alt={name} style={style} className={crop && !crop.fit ? 'portrait-framed-image' : 'portrait-default-image'} />
        </span>
    );
}

export default Portrait;
