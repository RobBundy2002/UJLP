import React, { useState } from 'react';
import { newStaffMembers, willStaffMember } from '../Data/staffData';
import { Link } from 'react-router-dom';
import '../Styling/About.css';
import '../Styling/Home.css';
import '../Styling/EditorialPages.css';
import Timeline from '../Components/Timeline';
import Portrait from '../Components/Portrait';
import { PrintingPressIntro } from '../Components/JournalCinema';
import ParticleBackground from '../Components/ParticleBackground';
import shelbyImg from '../ProfilePictures/Shelby.jpeg';
import derekImg from '../ProfilePictures/Derek.png';
import robImg from '../ProfilePictures/Rob.jpg';
import evanImg from '../ProfilePictures/Evan.jpeg';

const teamRoleOrder = [
    'executive-editor',
    'editor',
    'submission-writer',
    'event-coordinator',
    'internal-writer',
    'alumni'
];

const getTeamRoleRank = (member) => {
    const ranks = (member.types || [])
        .map(type => teamRoleOrder.indexOf(type))
        .filter(rank => rank >= 0);

    return ranks.length ? Math.min(...ranks) : teamRoleOrder.length;
};

const compareTeamMembers = (left, right) => {
    const roleDifference = getTeamRoleRank(left) - getTeamRoleRank(right);
    if (roleDifference !== 0) return roleDifference;

    const lastName = member => member.lastName || member.name.trim().split(/\s+/).pop();
    const lastNameDifference = lastName(left).localeCompare(lastName(right), undefined, { sensitivity: 'base' });
    if (lastNameDifference !== 0) return lastNameDifference;

    const nameDifference = left.name.localeCompare(right.name, undefined, { sensitivity: 'base' });
    if (nameDifference !== 0) return nameDifference;

    return String(left.id).localeCompare(String(right.id), undefined, { sensitivity: 'base' });
};

const caseyStaffMember = newStaffMembers.find(member => member.id === 'casey-pita');

function About() {
    const [activeFilter, setActiveFilter] = useState('all');

    return (
        <div className="about-container jh-page jh-about fade-in">
            <section className="about-hero">
                <ParticleBackground />
                <div className="section-content">
                    <div className="hero-content">
                        <p className="jh-eyebrow jh-about-kicker"><strong>UJLP</strong> · University of Virginia · Est. 2024</p>
                        <h1>Where questions<br /><em>become scholarship.</em></h1>
                        <p>Discover our mission, our team, and our commitment to excellence in legal journalism.</p>
                        <div className="cta-buttons">
                            <a href="#/journal" className="cta-button">View Our Work</a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mission-section">
                <div className="section-content">
                    <div className="mission-copy">
                        <p className="jh-section-label">What guides us</p>
                        <h2>Our<br /><em>Mission</em></h2>
                        <div className="mission-content">
                            <p>
                                The Undergraduate Journal of Law & Politics aims to expand opportunities for undergraduate legal research and writing at the University of Virginia. We publish long-form legal articles that explore the intersection of law and politics, including philosophy, economics, and history. Our goal is to foster academic inquiry and connect legal doctrine with broader humanistic perspectives.
                            </p>
                        </div>
                    </div>
                    <PrintingPressIntro embedded />
                </div>
            </section>

            <section className="leadership-section">
                <div className="section-content">
                    <div className="jh-people-heading">
                        <p>Executive Leadership</p>
                        <h2>The people<br /><em>setting the course.</em></h2>
                        <span>Meet the students guiding the Journal’s editorial vision, operations, research, and digital work.</span>
                    </div>
                    <div className="leadership-grid jh-leadership-grid">
                        <div className="leader-card">
                            <div className="jh-leader-thumbnail">
                                <Portrait src={derekImg} name="Derek Tsai" />
                            </div>
                            <div className="leader-info">
                                <h3><Link to="/author/derek" className="author-link">Derek Tsai</Link></h3>
                                <span className="leader-role">Editor-in-Chief</span>
                                <p>Derek Tsai leads the Undergraduate Journal of Law and Politics, setting editorial vision, overseeing all operations, and representing the organization in official capacities.</p>
                            </div>
                        </div>
                        <div className="leader-card">
                            <div className="jh-leader-thumbnail">
                                <Portrait src={shelbyImg} name="Shelby Eliasek" />
                            </div>
                            <div className="leader-info">
                                <h3><Link to="/author/shelby" className="author-link">Shelby Eliasek</Link></h3>
                                <span className="leader-role">Director of Operations</span>
                                <p>Shelby Eliasek manages logistics, events, and organizational strategy, ensuring the smooth day-to-day functioning of the Journal.</p>
                            </div>
                        </div>
                        <div className="leader-card">
                            <div className="jh-leader-thumbnail">
                                <Portrait src={evanImg} name="Evan Proudkii" />
                            </div>
                            <div className="leader-info">
                                <h3><Link to="/author/evan" className="author-link">Evan Proudkii</Link></h3>
                                <span className="leader-role">Managing Editor</span>
                                <p>Evan Proudkii coordinates editorial workflows, supports writers and editors, and ensures the quality and timely publication of all articles.</p>
                            </div>
                        </div>
                        <div className="leader-card">
                            <div className="jh-leader-thumbnail">
                                <Portrait src={willStaffMember.img} name="Will Olszewski" />
                            </div>
                            <div className="leader-info">
                                <h3><Link to="/author/will" className="author-link">Will Olszewski</Link></h3>
                                <span className="leader-role">{willStaffMember.role}</span>
                                <p>Will Olszewski leads legal research initiatives and ensures the accuracy and integrity of legal content.</p>
                            </div>
                        </div>
                        <div className="leader-card">
                            <div className="jh-leader-thumbnail">
                                <Portrait src={caseyStaffMember.img} name={caseyStaffMember.name} />
                            </div>
                            <div className="leader-info">
                                <h3><Link to={caseyStaffMember.link} className="author-link">{caseyStaffMember.name}</Link></h3>
                                <span className="leader-role">{caseyStaffMember.role}</span>
                            </div>
                        </div>
                        <div className="leader-card">
                            <div className="jh-leader-thumbnail">
                                <Portrait src={robImg} name="Rob Bundy" />
                            </div>
                            <div className="leader-info">
                                <h3><Link to="/author/rob" className="author-link">Rob Bundy</Link></h3>
                                <span className="leader-role">Director of Technology</span>
                                <p>Rob Bundy manages technical infrastructure and ensures seamless digital experiences for all platforms.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="team-section">
                <div className="section-content">
                    <div className="jh-people-heading jh-roster-heading">
                        <p>Our wider team</p>
                        <h2>A room full of<br /><em>sharp minds.</em></h2>
                    </div>
                    <div className="team-content">
                        <p>
                            Our group is composed of executive leaders, writers, and editors. Leaders plan events, manage the
                            budget, assist writers and editors, monitor the quality of the Journal, and promote research. Writers
                            and editors pair up to work on one law review together. Writers complete the majority of the outlining,
                            research, and drafting, while editors fact-check court cases and historical details, manage citations,
                            and review drafts. By working together, the Journal maintains accurate and high-quality content.
                        </p>
                    </div>

                    <div className="filter-container" aria-label="Filter team members by role">
                        <button 
                            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            All
                        </button>
                        <button 
                            className={`filter-button ${activeFilter === 'editor' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('editor')}
                        >
                            Editors
                        </button>
                        <button 
                            className={`filter-button ${activeFilter === 'submission-writer' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('submission-writer')}
                        >
                            Submission Writers
                        </button>
                        <button 
                            className={`filter-button ${activeFilter === 'event-coordinator' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('event-coordinator')}
                        >
                            Event Coordinators
                        </button>
                        <button
                            className={`filter-button ${activeFilter === 'internal-writer' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('internal-writer')}
                        >
                            Internal Writers
                        </button>
                        <button 
                            className={`filter-button ${activeFilter === 'alumni' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('alumni')}
                        >
                            Alumni
                        </button>
                    </div>
                    <div>
                        {(() => {
                            const teamMembers = [
                                ...newStaffMembers.filter(member => member.id !== caseyStaffMember.id),
                                // { id: 'comingsoon1', img: require('../ProfilePictures/ComingSoon.jpg'), name: 'Coming Soon', link: '/author/comingsoon1', types: ['executive-editor'], role: 'Executive Editor' },
                                // { id: 'comingsoon5', img: require('../ProfilePictures/ComingSoon.jpg'), name: 'Coming Soon', link: '/author/comingsoon5', types: ['submission-writer'], role: 'Submission Writer' },
                                // { id: 'comingsoon6', img: require('../ProfilePictures/ComingSoon.jpg'), name: 'Coming Soon', link: '/author/comingsoon6', types: ['submission-writer'], role: 'Submission Writer' },
                                // { id: 'comingsoon7', img: require('../ProfilePictures/ComingSoon.jpg'), name: 'Coming Soon', link: '/author/comingsoon7', types: ['event-coordinator'], role: 'Event Coordinator' },
                                // { id: 'comingsoon8', img: require('../ProfilePictures/ComingSoon.jpg'), name: 'Coming Soon', link: '/author/comingsoon8', types: ['event-coordinator'], role: 'Event Coordinator' },
                                // { id: 'comingsoon14', img: require('../ProfilePictures/ComingSoon.jpg'), name: 'Coming Soon', link: '/author/comingsoon8', types: ['event-coordinator'], role: 'Event Coordinator' },
                                // { id: 'comingsoon10', img: require('../ProfilePictures/ComingSoon.jpg'), name: 'Coming Soon', link: '/author/comingsoon10', types: ['submission-writer'], role: 'Submission Writer' },
                                // { id: 'comingsoon11', img: require('../ProfilePictures/ComingSoon.jpg'), name: 'Coming Soon', link: '/author/comingsoon11', types: ['event-coordinator'], role: 'Event Coordinator' },
                            ];

                            const filtered = teamMembers
                                .filter(m => activeFilter === 'all' || m.types.includes(activeFilter))
                                .sort(compareTeamMembers);
                            const gridClass = `team-members-grid ${filtered.length === 2 ? 'two-up' : ''}`.trim();

                            return (
                                <div className={`${gridClass} jh-roster-grid`}>
                                    {filtered.map((m) => (
                                        <div key={m.id} className={`team-member-card jh-roster-member visible`}>
                                            <Portrait src={m.img} name={m.name} className="team-member-photo" />
                                            <div className="team-member-info">
                                                {m.link ? (
                                                    <h3><Link to={m.link} className="author-link">{m.name}</Link></h3>
                                                ) : (
                                                    <h3>{m.name}</h3>
                                                )}
                                                <span className="team-member-role">{m.role}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </section>

            <Timeline />
        </div>
    );
}

export default About;
