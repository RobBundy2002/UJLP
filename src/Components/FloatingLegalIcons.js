import React, { useEffect, useRef } from 'react';
import './FloatingLegalIcons.css';

const FloatingLegalIcons = ({ count = 15 }) => {
    const containerRef = useRef(null);

    const icons = [
        '⚖️',
        '⚖️',
        '⚖️',
        '⚖️',
        '📜',
        '📜',
        '📜',
        '📚',
        '📚',
        '🖋️',
        '🖋️',
        '📝',
        '📝',
        '⚡',
        '⚡',
        '🏛️',
        '🏛️',
        '📄',
        '📄',
        '🌍',
        '🌍',
    ];

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const floatingElements = container.querySelectorAll('.floating-icon');

        floatingElements.forEach((element) => {

            const startLeft = Math.random() * 100;
            const startTop = Math.random() * 100;
            element.style.left = `${startLeft}%`;
            element.style.top = `${startTop}%`;

            const duration = 15 + Math.random() * 20;
            const delay = Math.random() * -20;
            element.style.animationDuration = `${duration}s`;
            element.style.animationDelay = `${delay}s`;

            const fontSize = 1 + Math.random() * 1.5;
            element.style.fontSize = `${fontSize}rem`;
        });
    }, [count]);

    return (
        <div className="floating-legal-icons" ref={containerRef}>
            {Array.from({ length: count }).map((_, index) => {
                const iconIndex = index % icons.length;
                return (
                    <span
                        key={index}
                        className="floating-icon"
                        style={{ opacity: 0.1 + Math.random() * 0.15 }}
                    >
                        {icons[iconIndex]}
                    </span>
                );
            })}
        </div>
    );
};

export default FloatingLegalIcons;
