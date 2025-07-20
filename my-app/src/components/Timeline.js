import React from 'react';
import './Timeline.css';

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
    return (
        <section className="timeline-section">
            <div className="section-content">
                <h2>Our Journey</h2>
                <div className="timeline-container">
                    {timelineData.map((item, index) => (
                        <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                            <div className="timeline-content">
                                <div className="timeline-marker">
                                    <span className="timeline-year">{item.year}</span>
                                </div>
                                <div className="timeline-card">
                                    <span className="timeline-category">{item.category}</span>
                                    <h3 className="timeline-title">{item.title}</h3>
                                    <p className="timeline-description">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Timeline; 