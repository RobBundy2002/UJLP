import React from 'react';
import './Archives.css';
import './Home.css';
import { Link } from 'react-router-dom';

function JoinTheTeam() {
    return (
        <div className="archives-container fade-in">
            {/* Hero Section */}
            <section className="archives-hero">
                <div className="section-content">
                    <h1>Join the Team</h1>
                    <p className="hero-content">
                        The Undergraduate Journal of Law & Politics seeks to recruit passionate undergraduate students each semester.
                        We welcome applicants from all majors & backgrounds who are eager to engage with the legal realm through research and writing.
                    </p>
                </div>
            </section>

            {/* Info Section */}
            <section className="articles-section">
                <div className="section-content">
                    <h2>Recruitment Overview</h2>
                    <p>
                        Recruitment occurs every semester for <strong>Staff Editors</strong>, <strong>Staff Writers</strong>,
                        and <strong>Submission Writers</strong>. Details about these positions can be found below.
                        Information about open leadership and executive positions will be available on our <Link to="/announcements">Announcements</Link> page.
                    </p>

                    {/* Staff Editor */}
                    <article className="article-card">
                        <div className="article-content">
                            <h3>Staff Editor</h3>
                            <p>
                                Staff Editors work in an editorial cohort and help writers by conducting research, improving argumentation,
                                and enforcing the Journal’s editorial standards. We look for detail-oriented students with strong analytical
                                and logical reasoning skills.
                            </p>
                            <h4>Responsibilities:</h4>
                            <ul>
                                <li>Attend and contribute to weekly editorial cohort meetings</li>
                                <li>Review article drafts for structure and argument strength</li>
                                <li>Enforce the Journal’s editorial standards</li>
                                <li>Assist writers in legal research</li>
                                <li>Cite sources using the Bluebook</li>
                            </ul>
                            <h4>Application Components:</h4>
                            <ul>
                                <li>Relevant Experience</li>
                                <li>Resume (optional)</li>
                                <li>List of legal and scholarly interests</li>
                            </ul>
                            <a href="https://forms.gle/anwNuRKKupevNakG7" target="_blank" rel="noopener noreferrer" className="article-link">
                                Apply Here →
                            </a>
                        </div>
                    </article>

                    {/* Staff Writer */}
                    <article className="article-card">
                        <div className="article-content">
                            <h3>Staff Writer</h3>
                            <p>
                                Staff Writers produce original law review articles with the support of an editorial cohort.
                                We look for disciplined, driven students with a passion for their chosen topic and strong research and writing skills.
                            </p>
                            <h4>Responsibilities:</h4>
                            <ul>
                                <li>Draft and revise a 5–15 page law review article</li>
                                <li>Meet strict editorial deadlines</li>
                                <li>Incorporate editorial feedback</li>
                                <li>Conduct scholarly research using primary and secondary sources</li>
                                <li>Attend weekly editorial cohort meetings with proper preparation</li>
                            </ul>
                            <h4>Application Components:</h4>
                            <ul>
                                <li>Relevant Experience</li>
                                <li>Resume (optional)</li>
                                <li>Writing Sample (optional)</li>
                                <li>Proposed Thesis</li>
                                <li>Proposed Abstract (~150 words)</li>
                                <li>Proposed Outline (with section titles and bullet points)</li>
                            </ul>
                            <a href="https://forms.gle/ds2EUWvnHh5xa1Et9" target="_blank" rel="noopener noreferrer" className="article-link">
                                Apply Here →
                            </a>
                        </div>
                    </article>

                    {/* Submission Writers */}
                    <article className="article-card">
                        <div className="article-content">
                            <h3>Submission Writers</h3>
                            <p>
                                Submission Writers submit an independently-produced law review article, research paper,
                                or coursework paper for publication. Submissions must have explicit permission from the proper authority
                                if based on prior academic work. Once accepted, the Submission Writer will revise with an editorial cohort.
                            </p>
                            <h4>Responsibilities:</h4>
                            <ul>
                                <li>Draft and revise a 5–15 page law review article</li>
                                <li>Meet strict editorial deadlines</li>
                                <li>Incorporate editorial feedback</li>
                                <li>Conduct scholarly research using primary and secondary sources</li>
                                <li>Attend weekly editorial cohort meetings with proper preparation</li>
                            </ul>
                            <h4>Application Components:</h4>
                            <ul>
                                <li>Proper publication release (if applicable)</li>
                                <li>Thesis Statement</li>
                                <li>Copy of Article</li>
                            </ul>
                            <a href="https://forms.gle/rNBdf16vNDMYUCRM9" target="_blank" rel="noopener noreferrer" className="article-link">
                                Apply Here →
                            </a>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default JoinTheTeam;
