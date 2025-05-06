import React from 'react';
import './About.css';
import './Home.css';
import samImg from './Sam.png';
import shelbyImg from './Shelby.jpeg';
import derekImg from './Derek.png';
import ruichongImg from './Richard.jpeg';
import robImg from './Rob.jpg';
// import evanImg from './Evan.jpg';
function About() {
    return (
        <div className="about-us-wrapper">
            <div className="about-section">
                <h2 className="section-title">THE MISSION</h2>
                <p className="about-text">
                    The Undergraduate Journal of Law & Politics aims to expand opportunities for undergraduate legal research and writing at the University of Virginia. We publish long-form legal articles that explore the intersection of law and politics, including philosophy, economics, and history. Our goal is to foster academic inquiry and connect legal doctrine with broader humanistic perspectives.
                </p>
            </div>

            <div className="about-section">
                <h2 className="section-title">THE LEADERSHIP</h2>
                <div className="leadership-cards">
                    <div className="leader-card">
                        <img src={samImg} alt="Sam Burnett" className="leader-img"/>
                        <p><strong>Editor-in-Chief</strong><br/>Sam Burnett</p>
                    </div>
                    <div className="leader-card">
                        <img src={derekImg} alt="Derek Tsai" className="leader-img"/>
                        <p><strong>Managing Editor</strong><br/>Derek Tsai</p>
                    </div>
                    <div className="leader-card">
                        <img src={shelbyImg} alt="Shelby Eliasek" className="leader-img"/>
                        <p><strong>Director of Media</strong><br/>Shelby Eliasek</p>
                    </div>
                    <div className="leader-card">
                        <img src={robImg} alt="Rob Bundy" className="leader-img"/>
                        <p><strong>Director of Technology</strong><br/>Rob Bundy</p>
                    </div>
                    <div className="leader-card">
                        <img src={ruichongImg} alt="Richard (Ruichong) Xu" className="leader-img"/>
                        <p><strong>Director of Legal Writing & Research</strong><br/>Richard Xu</p>
                    </div>
                    <div className="leader-card">
                        <img  alt="" className="leader-img"/>
                        <p><strong>Director of Communications</strong><br/>Evan Proudkii</p>
                    </div>
                </div>
            </div>
            <div className="about-section">
                <h2 className="section-title">THE TEAM</h2>
                <p className="about-text">
                    Our group is composed of executive leaders, writers, and editors. Leaders plan events, manage the
                    budget, assist writers and editors, monitor the quality of the Journal, and promote research. Writers
                    and editors pair up to work on one law review together. Writers complete the majority of the outlining,
                    research, and drafting, while editors fact-check court cases and historical details, manage citations,
                    and review drafts. By working together, the Journal maintains accurate and high-quality content.
                </p>
            </div>

            <div className="about-section">
                <h2 className="section-title">THE HISTORY</h2>
                <p className="about-text">
                    The Undergraduate Journal of Law and Politics began in 2024 under the leadership of Sam Burnett,
                    Derek Tsai, and Shelby Eliasek. They desired to expand legal research opportunities and collaborate
                    with other interested students at the University of Virginia. Since they began the group, the Journal
                    has published work for many new writers and editors, and the legally interested undergraduate community
                    has grown closer.
                </p>
            </div>

            <div className="about-section">
                <h2 className="section-title">THE WORK</h2>
                <p className="about-text">
                    We publish student-produced, long-form law reviews that offer an in-depth analysis of contemporary
                    and historical legal issues. Our writers present their research in public symposiums and discussions,
                    often in collaboration with law school students and legal scholars. Beyond publishing, we support
                    our writers through personalized editorial mentorship and writing guidance to help them grow as legal
                    thinkers and scholars. We also maintain an active website and social media presence to promote our
                    work and share pressing legal and political research with the public.
                </p>
            </div>

            <div className="about-section">
                <h2 className="section-title">THE APPLICATION</h2>
                <p className="about-text">
                    Any undergraduate student at the University can apply for membership within the UJLP! Additionally,
                    if you are a graduate or law student interested in publishing anything with us, we’d be happy to
                    learn more about your piece and include you in a publication.
                </p>
            </div>
        </div>

    );
}

export default About;
