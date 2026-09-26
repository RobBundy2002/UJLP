import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articles, researchAreas } from '../Data/journalData';

const topics = [
    {
        id: 'civil-rights',
        label: 'Civil Rights',
        short: 'Civil Rights',
        lens: 'Field',
        fieldSlug: 'civil-rights-law',
        article: 'Unequal Opportunity',
        author: 'Derek Tsai',
        to: '/unequalopportunity',
        researchTo: '/research/civil-rights-law',
        position: { left: '17%', top: '25%' }
    },
    {
        id: 'education',
        label: 'Education Law',
        short: 'Education',
        lens: 'Field',
        fieldSlug: 'education-law',
        article: 'Schoolhouse Secrets',
        author: 'Shelby Eliasek',
        to: '/schoolhousesecrets',
        researchTo: '/research/education-law',
        position: { left: '83%', top: '25%' }
    },
    {
        id: 'equal-opportunity',
        label: 'Equality',
        short: 'Equality',
        lens: 'Topic',
        fieldSlug: 'civil-rights-law',
        article: 'Unequal Opportunity',
        author: 'Derek Tsai',
        to: '/unequalopportunity',
        researchTo: '/research/civil-rights-law',
        position: { left: '17%', top: '76%' }
    },
    {
        id: 'parental-rights',
        label: 'Parental Rights',
        short: 'Parental Rights',
        lens: 'Topic',
        fieldSlug: 'education-law',
        article: 'Schoolhouse Secrets',
        author: 'Shelby Eliasek',
        to: '/schoolhousesecrets',
        researchTo: '/research/education-law',
        position: { left: '83%', top: '76%' }
    }
];

const getPanelTopicLabel = (topic) => topic === 'Equal Opportunity' ? 'Equality' : topic;

function ResearchConstellation() {
    const navigate = useNavigate();
    const [activeTopicId, setActiveTopicId] = useState(topics[0].id);
    const [departingTopic, setDepartingTopic] = useState(null);
    const activeTopic = topics.find(topic => topic.id === activeTopicId) || topics[0];
    const activeArea = researchAreas[activeTopic.fieldSlug];
    const activeFieldArticles = articles.filter(article => article.researchSlug === activeTopic.fieldSlug);

    const enterField = (topic) => {
        if (departingTopic) return;
        setActiveTopicId(topic.id);
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
                    <div className="constellation-map-shell">
                        <svg className="constellation-lines" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
                            <defs>
                                <linearGradient id="fieldLinePrimary" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#f18c62" stopOpacity=".86" />
                                    <stop offset="48%" stopColor="#d7c1a6" stopOpacity=".5" />
                                    <stop offset="100%" stopColor="#9cb3c7" stopOpacity=".46" />
                                </linearGradient>
                            </defs>
                            <g className="constellation-spokes">
                                <path d="M500 310 L240 180" />
                                <path d="M500 310 L740 174" />
                                <path d="M500 310 L210 446" />
                                <path d="M500 310 L780 440" />
                            </g>
                            <g className="constellation-bridges">
                                <path d="M240 180 C 370 238, 604 232, 740 174" />
                                <path d="M210 446 C 348 383, 636 382, 780 440" />
                                <path d="M240 180 C 184 274, 176 360, 210 446" className="constellation-line-secondary" />
                                <path d="M740 174 C 812 278, 820 362, 780 440" className="constellation-line-secondary" />
                            </g>
                            <g className="constellation-pin-lines">
                                <circle cx="500" cy="310" r="5" />
                                <circle cx="240" cy="180" r="4" />
                                <circle cx="740" cy="174" r="4" />
                                <circle cx="210" cy="446" r="4" />
                                <circle cx="780" cy="440" r="4" />
                            </g>
                        </svg>

                        <div className="constellation-core" aria-hidden="true">
                            <span>UJLP</span>
                            <strong>{String(articles.length).padStart(2, '0')}</strong>
                            <small>published works</small>
                        </div>
                        <div className="constellation-orbit-plane" aria-hidden="true" />

                        {topics.map((topic, index) => {
                            const fieldArticleCount = articles.filter(article => article.researchSlug === topic.fieldSlug).length;
                            return (
                                <button
                                    key={topic.id}
                                    type="button"
                                    className={`constellation-node ${activeTopic.id === topic.id ? 'active' : ''}`}
                                    style={topic.position}
                                    onMouseEnter={() => setActiveTopicId(topic.id)}
                                    onFocus={() => setActiveTopicId(topic.id)}
                                    onClick={() => enterField(topic)}
                                    aria-label={`Explore ${topic.label}`}
                                >
                                    <span className="constellation-node-index">{String(index + 1).padStart(2, '0')}</span>
                                    <small>{topic.lens}</small>
                                    <strong>{topic.short}</strong>
                                    <em>{fieldArticleCount} work{fieldArticleCount === 1 ? '' : 's'}</em>
                                </button>
                            );
                        })}

                    </div>

                    <aside className="constellation-intel" aria-live="polite">
                        <span>{activeTopic.lens} signal</span>
                        <h3>{activeTopic.label}</h3>
                        <p>{activeArea.signal}</p>
                        <dl>
                            <div><dt>Field</dt><dd>{activeArea.name}</dd></div>
                            <div><dt>Field works</dt><dd>{activeFieldArticles.length}</dd></div>
                            <div><dt>Published work</dt><dd>{activeTopic.article}</dd></div>
                            <div><dt>Author</dt><dd>{activeTopic.author}</dd></div>
                        </dl>
                        <button
                            type="button"
                            onClick={() => enterField(activeTopic)}
                        >
                            Open field route
                        </button>
                        <div>{activeArea.relatedTopics.slice(0, 3).map(topic => <small key={topic}>{getPanelTopicLabel(topic)}</small>)}</div>
                    </aside>

                    <div className="constellation-transition" aria-hidden="true">
                        <div className="constellation-transition-card">
                            <span>Opening field route</span>
                            <strong>{departingTopic?.label}</strong>
                            <em>UJLP Research Index</em>
                        </div>
                        <i />
                    </div>

                </div>
            </div>
        </section>
    );
}

export default ResearchConstellation;
