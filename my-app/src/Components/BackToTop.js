import React, { useState, useEffect } from 'react';
import './BackToTop.css';
import { useSmoothScroll } from './SmoothScroll';

const BackToTop = ({ threshold = 300 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const { scrollToTop } = useSmoothScroll();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            // Show/hide button based on threshold
            setIsVisible(scrollTop > threshold);
            
            // Calculate progress (0 to 100)
            const scrollProgress = (scrollTop / scrollHeight) * 100;
            setProgress(Math.min(scrollProgress, 100));
        };

        // Add scroll listener with passive option for performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial check
        handleScroll();

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [threshold]);

    // Calculate circle circumference
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const handleClick = () => {
        scrollToTop();
    };

    if (!isVisible) return null;

    return (
        <button 
            className="back-to-top" 
            onClick={handleClick}
            aria-label="Back to top"
            title="Back to top"
        >
            <svg className="progress-ring" width="56" height="56">
                <circle
                    className="progress-ring-circle-bg"
                    stroke="#ff9f7c"
                    strokeWidth="3"
                    fill="transparent"
                    r={radius}
                    cx="28"
                    cy="28"
                />
                <circle
                    className="progress-ring-circle"
                    stroke="#ff6b35"
                    strokeWidth="3"
                    fill="transparent"
                    r={radius}
                    cx="28"
                    cy="28"
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: strokeDashoffset,
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                        transition: 'stroke-dashoffset 0.15s ease-out'
                    }}
                />
            </svg>
            <span className="back-to-top-arrow">↑</span>
        </button>
    );
};

export default BackToTop;
