import React from 'react';
import './About.css';
import './Home.css';
import samImg from './SamBurnett.jpeg';
import shelbyImg from './Shelby.jpeg';
import derekImg from './DerekTsai.JPG';
import ruichongImg from './Richard.jpeg';
import robImg from './Rob.jpg';
// import evanImg from './Evan.jpg';
function About() {
    return (
        <div className="about-us-wrapper">
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
                    {/*<div className="leader-card">*/}
                    {/*    <img src={evanImg} alt="Evan Proudkii" className="leader-img"/>*/}
                    {/*    <p><strong>Director of Communications</strong><br/>Evan Proudkii</p>*/}
                    {/*</div>*/}
                </div>
            </div>

            <div className="about-section">
                <h2 className="section-title">History</h2>
                <p className="about-text">
                    Founded in 2024, the club aims to bring together students with an interest in legal and political
                    issues.
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
