import React from 'react';
import './About.css';
import './Home.css';

function About() {
    return (
        <div className="TitleWrapper">
            <h1>About Us</h1>
            <div className="About">
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
                        <td>The Undergraduate Journal of Law and Politics is a group of writers, editors, and executives
                            that work to draft and publish undergraduate students’ writings of law reviews, political
                            interests, and opinion pieces. The UJLP provides members with the opportunity to write on both
                            law and politics.
                        </td>
                    </tr>
                    <tr>
                        <td>Leadership</td>
                        <td>
                            Editor-in-Chief: Sam Burnett |<br />
                            Director of Engagement: Shelby Eliasek |<br />
                            Managing Editor: Derek Tsai |<br />
                            Website Development Manager: Rob Bundy |
                        </td>
                    </tr>
                    <tr>
                        <td>History</td>
                        <td>Founded in 2024, the club aims to bring together students with an interest in legal and
                            political issues.
                        </td>
                    </tr>
                    <tr>
                        <td>Membership</td>
                        <td>Any undergraduate student at the University can apply for membership within the UJLP!
                            Additionally, if you are a graduate or law student interested in publishing anything with us,
                            we’d be happy to learn more about your piece and include you in a publication.
                        </td>
                    </tr>
                    <tr>
                        <td>Contact</td>
                        <td>
                            Email us at <a href="mailto:ujlawandpolitics@gmail.com" className="About-link">ujlawandpolitics@gmail.com</a>&nbsp;
                            or check us out on Instagram at <a href="https://www.instagram.com/ujlawandpoliticsatuva/"
                                                               target="_blank" rel="noopener noreferrer" className="About-link">UJLawAndPoliticsAtUVA</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default About;

