import React from 'react';
import './Timeline.css';

const timelineData = [
    {
        year: 'Sept. 2024',
        title: 'Foundation',
        description: 'UJLP was established as a platform for undergraduate legal scholarship at the University of Virginia.',
        category: 'Establishment'
    },
    {
        year: 'Oct. 2024',
        title: 'Digital Platform',
        description: 'Launched our digital platform to increase accessibility and reach of our publications.',
        category: 'Innovation'
    },
    {
        year: 'Nov 8, 2024',
        title: 'First round of writers and editors selected',
        description: 'After a competitive application season, the UJLP selected its first round of writers and editors, consisting of 14 uniquely qualified undergraduate students.',
        category: 'Milestone'
    },
    {
        year: 'Jan. 2025',
        title: 'Guest speakers',
        description: 'S.J.D Candidates from UVA Law spoke to the team, UJLP Executives taught legal citation techniques to the editors, and UVA undergraduate students presented their research articles.',
        category: 'Growth'
    },
    {
        year: 'Aug 28-29, 2025',
        title: 'UJLP Interest Meetings',
        description: 'Hosted interest meetings to introduce UJLP to potential new members and share our mission.',
        category: 'Recruitment'
    },
    {
        year: 'Sept 5, 2025',
        title: 'Interest Forms Due',
        description: 'Deadline for students to submit their interest forms to join UJLP.',
        category: 'Recruitment'
    },
    {
        year: 'Fall 2025',
        title: 'Form Editing Groups',
        description: 'Established editing groups and began collaborative work on publications.',
        category: 'Development'
    },
    {
        year: 'Dec 5, 2025',
        title: 'Publication Release',
        description: 'Release of our inaugural publication featuring groundbreaking undergraduate legal scholarship.',
        category: 'Milestone'
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