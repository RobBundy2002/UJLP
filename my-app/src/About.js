import React from 'react';
import './About.css';
import './Home.css';

function About() {
    return (
        <div className="AboutTop">
        <div className="About">
            <h1>About Us</h1>
            <table className="About-table">
                <thead>
                <tr>
                    <th>Aspect</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Mission</td>
                    <td>To provide a platform for undergraduate students to explore and engage in discussions on law and politics.</td>
                </tr>
                <tr>
                    <td>History</td>
                    <td>Founded in 2024, the club aims to bring together students with an interest in legal and political issues.</td>
                </tr>
                <tr>
                    <td>Activities</td>
                    <td>We host seminars, workshops, and discussions on current legal and political topics.</td>
                </tr>
                <tr>
                    <td>Membership</td>
                    <td>Open to all undergraduate students interested in law and politics.</td>
                </tr>
                <tr>
                    <td>Contact</td>
                    <td>Email us at <a href="mailto:ujlawandpolitics@gmail.com">ujlawandpolitics@gmail.com</a></td>
                </tr>
                </tbody>
            </table>
        </div>
        </div>
    );
}

export default About;
