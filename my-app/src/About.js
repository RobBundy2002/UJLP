import React from 'react';
import './About.css';
import './Home.css';

function About() {
    return (
        <div className="about-us-wrapper">
            <h1 className="about-title">About Us</h1>

            <div className="about-section">
                <h2 className="section-title">Mission</h2>
                <p className="about-text">
                    The Undergraduate Journal of Law and Politics is a group of writers, editors, and executives that
                    work to draft and publish undergraduate students’ writings of law reviews, political interests, and
                    opinion pieces. The UJLP provides members with the opportunity to write on both law and politics.
                </p>
            </div>

            <div className="about-section">
                <h2 className="section-title">Leadership</h2>
                <ul className="leadership-list">
                    <li><strong>Editor-in-Chief:</strong> Sam Burnett</li>
                    <li><strong>Director of Engagement:</strong> Shelby Eliasek</li>
                    <li><strong>Managing Editor:</strong> Derek Tsai</li>
                    <li><strong>Director of Legal Writing & Research:</strong> Ruichong Xu</li>
                    <li><strong>Director of Technology:</strong> Rob Bundy</li>
                </ul>
            </div>

            <div className="about-section">
                <h2 className="section-title">History</h2>
                <p className="about-text">
                    Founded in 2024, the club aims to bring together students with an interest in legal and political issues.
                </p>
            </div>

            <div className="about-section">
                <h2 className="section-title">Membership</h2>
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
