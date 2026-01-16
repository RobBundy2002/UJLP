import React, { useState, useEffect } from 'react';
import '../Styling/TypingText.css';

const TypingText = ({ text, speed = 100, pauseDelay = 2000, delay = 0 }) => {
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [index, setIndex] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    // Handle single string or array of strings
    const textArray = Array.isArray(text) ? text : [text];
    const currentText = textArray[index % textArray.length];

    useEffect(() => {
        // Start typing after initial delay
        const startTimer = setTimeout(() => {
            setHasStarted(true);
        }, delay);

        return () => clearTimeout(startTimer);
    }, [delay]);

    useEffect(() => {
        if (!hasStarted) return;

        const handleTyping = () => {
            if (!isDeleting) {
                // Typing
                if (displayText.length < currentText.length) {
                    setDisplayText(currentText.slice(0, displayText.length + 1));
                } else {
                    // Finished typing, pause before deleting
                    setTimeout(() => setIsDeleting(true), pauseDelay);
                }
            } else {
                // Deleting
                if (displayText.length > 0) {
                    setDisplayText(currentText.slice(0, displayText.length - 1));
                } else {
                    // Finished deleting, move to next text
                    setIsDeleting(false);
                    setIndex((prev) => (prev + 1) % textArray.length);
                }
            }
        };

        const timeout = setTimeout(handleTyping, isDeleting ? speed / 2 : speed);
        
        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentText, speed, pauseDelay, textArray, index, hasStarted]);

    return (
        <span className="typing-text">
            {displayText}
            <span className="cursor">|</span>
        </span>
    );
};

export default TypingText;
