import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const topics = [
    {
        id: 'civil-rights',
        label: 'Civil Rights Law',
        short: 'Civil Rights',
        article: 'Unequal Opportunity',
        author: 'Derek Tsai',
        to: '/dangerousimplications',
        researchTo: '/research/civil-rights-law',
        position: { left: '14%', top: '23%' }
    },
    {
        id: 'education',
        label: 'Education Law',
        short: 'Education',
        article: 'Schoolhouse Secrets',
        author: 'Shelby Eliasek',
        to: '/schoolhousesecrets',
        researchTo: '/research/education-law',
        position: { left: '72%', top: '18%' }
    },
    {
        id: 'equal-opportunity',
        label: 'Equal Opportunity',
        short: 'Equality',
        article: 'Unequal Opportunity',
        author: 'Derek Tsai',
        to: '/dangerousimplications',
        researchTo: '/research/civil-rights-law',
        position: { left: '8%', top: '67%' }
    },
    {
        id: 'parental-rights',
        label: 'Parental Rights',
        short: 'Parental Rights',
        article: 'Schoolhouse Secrets',
        author: 'Shelby Eliasek',
        to: '/schoolhousesecrets',
        researchTo: '/research/education-law',
        position: { left: '77%', top: '66%' }
    }
];

function ResearchConstellation() {
    const navigate = useNavigate();
    const [departingTopic, setDepartingTopic] = useState(null);

    const enterField = (topic) => {
        if (departingTopic) return;
        setDepartingTopic(topic);
        window.setTimeout(() => navigate(topic.researchTo), 1450);
    };

    return (
        <section className="research-constellation" aria-labelledby="research-constellation-title">
            <div className="section-content">
                <div className="constellation-heading">
                    <div>
                        <p>Research constellation</p>
                        <h2 id="research-constellation-title">Ideas in<br /><em>conversation.</em></h2>
                    </div>
                    <p>Explore the legal questions connecting our published scholarship. Select a research area to follow its path into the Journal.</p>
                </div>

                <div className={`constellation-stage ${departingTopic ? 'departing' : ''}`}>
                    <svg className="constellation-lines" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
                        <line x1="500" y1="280" x2="190" y2="135" />
                        <line x1="500" y1="280" x2="790" y2="110" />
                        <line x1="500" y1="280" x2="135" y2="390" />
                        <line x1="500" y1="280" x2="830" y2="385" />
                        <line x1="190" y1="135" x2="135" y2="390" className="constellation-line-secondary" />
                        <line x1="790" y1="110" x2="830" y2="385" className="constellation-line-secondary" />
                    </svg>

                    <div className="constellation-core" aria-hidden="true">
                        <span>UJLP</span>
                        <strong>02</strong>
                        <small>published works</small>
                    </div>

                    {topics.map((topic, index) => (
                        <button
                            key={topic.id}
                            type="button"
                            className="constellation-node"
                            style={topic.position}
                            onClick={() => enterField(topic)}
                            aria-label={`Explore ${topic.label}`}
                        >
                            <span>0{index + 1}</span>
                            <strong>{topic.short}</strong>
                        </button>
                    ))}

                    <div className="constellation-transition" aria-hidden="true"><span>{departingTopic?.label}</span></div>

                </div>
            </div>
        </section>
    );
}

export default ResearchConstellation;
