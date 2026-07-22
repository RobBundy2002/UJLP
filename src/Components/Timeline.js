import React, { useRef, useState } from 'react';
import '../Styling/Timeline.css';

const timelineData = [
    {
        year: 'Oct. 1983',
        title: 'Founding of the Journal of Law & Politics',
        description: 'The Journal of Law & Politics is founded under the guidance of Supreme Court Justice Antonin Scalia.',
        category: 'Legacy'
    },
    {
        year: 'Sep. 2024',
        title: 'UJLP Founded',
        description: 'UJLP is founded as the undergraduate affiliate of the Journal of Law & Politics.',
        category: 'Establishment'
    },
    {
        year: 'Oct. 2024',
        title: 'Digital Platform Launch',
        description: 'UJLP launches its digital platform to improve accessibility and work towards its mission of expanding undergraduate legal scholarship.',
        category: 'Innovation'
    },
    {
        year: 'Nov. 2024',
        title: 'Founding Members Selected',
        description: 'UJLP selects its founding members and begins developing the publication infrastructure.',
        category: 'Milestone'
    },
    {
        year: 'Jan. 2025',
        title: 'First Speaker Event',
        description: 'UJLP hosts its first speaker event featuring an S.J.D. candidate from the UVA School of Law.',
        category: 'Events'
    },
    {
        year: 'Jul. 2025',
        title: 'Reorganization and New Leadership',
        description: 'UJLP reorganizes under a new leadership team and begins working to publish the Journal\'s inaugural edition.',
        category: 'Leadership'
    },
    {
        year: 'Dec. 2025',
        title: 'Inaugural Edition Published',
        description: 'UJLP publishes its inaugural edition.',
        category: 'Publication'
    },
    {
        year: 'Jan. 2026',
        title: 'First UJLP Symposium',
        description: 'The first UJLP Symposium features the research of undergraduates published in the Journal\'s inaugural edition.',
        category: 'Symposium'
    }
];

function Timeline() {
    const [activeIndex, setActiveIndex] = useState(1);
    const trackRef = useRef(null);
    const activeItem = timelineData[activeIndex];

    const selectChapter = (index) => {
        setActiveIndex(index);
        const track = trackRef.current;
        const item = track?.children[index];
        if (track && item) {
            const targetLeft = item.offsetLeft - (track.clientWidth - item.clientWidth) / 2;
            track.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
        }
    };

    const moveChapter = (direction) => {
        const nextIndex = Math.min(Math.max(activeIndex + direction, 0), timelineData.length - 1);
        selectChapter(nextIndex);
    };

    return (
        <section className="timeline-section timeline-chapters">
            <div className="section-content">
                <div className="timeline-intro">
                    <p>Our story</p>
                    <h2>Built by<br /><em>curious people.</em></h2>
                    <div>
                        <p>The Undergraduate Journal of Law and Politics began in 2024 under the leadership of Sam Burnett, Derek Tsai, and Shelby Eliasek. Since then, the Journal has grown an undergraduate community committed to thoughtful legal research, writing, and conversation.</p>
                        <p>We publish long-form legal scholarship, bring writers and editors together, and carry that work into public discussions, symposiums, and the wider UVA community.</p>
                    </div>
                </div>

                <div className="timeline-chapter-display">
                    <div className="timeline-chapter-count">
                        <span>{String(activeIndex + 1).padStart(2, '0')}</span>
                        <small>/ {String(timelineData.length).padStart(2, '0')}</small>
                    </div>
                    <div className="timeline-chapter-copy" aria-live="polite">
                        <span>{activeItem.category} · {activeItem.year}</span>
                        <h3>{activeItem.title}</h3>
                        <p>{activeItem.description}</p>
                    </div>
                    <div className="timeline-chapter-controls">
                        <button type="button" onClick={() => moveChapter(-1)} disabled={activeIndex === 0} aria-label="Previous chapter">←</button>
                        <button type="button" onClick={() => moveChapter(1)} disabled={activeIndex === timelineData.length - 1} aria-label="Next chapter">→</button>
                    </div>
                </div>

                <div className="timeline-chapter-track" ref={trackRef} aria-label="Journal history chapters">
                    {timelineData.map((item, index) => (
                        <button
                            type="button"
                            key={`${item.year}-${item.title}`}
                            className={`timeline-chapter-tab ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => selectChapter(index)}
                            aria-pressed={activeIndex === index}
                        >
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <strong>{item.year}</strong>
                            <small>{item.category}</small>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Timeline;
