import React from 'react';
import '../Styling/AuthorBio.css';
import robImg from '../ProfilePictures/Rob.jpg';

function Rob() {
    return (
        <div className="author-bio-container fade-in">
            <section className="author-hero">
                <div className="section-content">
                    <div className="author-content">
                        <div className="author-image">
                            <img src={robImg} alt="Robert Lucas Bundy" />
                        </div>
                        <div className="author-info">
                            <h1>Rob Bundy</h1>
                            <span className="author-role">Director of Technology</span>
                            <div className="author-details">
                                <p><strong>Education:</strong> Bachelor of Arts in Computer Science with Minor in Religious Studies</p>
                                <p><strong>UVA Alum:</strong> Class of 2025</p>
                                <p><strong>Graduate Program:</strong> Online MS in Computer Science, Georgia Tech (Expected Dec 2028)</p>
                                <p><strong>Research Interests:</strong> Human Computer Interaction, Software Development, Cybersecurity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-bio-section">
                <div className="section-content">
                    <h2>About Rob</h2>
                    <div className="bio-content">
                        <p>
                            Rob Bundy serves as the Director of Technology for the Undergraduate Journal of Law and Politics, 
                            where he manages technical infrastructure and ensures seamless digital experiences for all platforms. 
                            His role is crucial in maintaining the Journal's online presence and digital operations.
                        </p>
                        <p>
                            As a Computer Science graduate of the University of Virginia, Rob brings
                            a unique interdisciplinary perspective to the intersection of technology and law. He is currently pursuing 
                            an online Master's degree in Computer Science with a concentration in Human Computer Interaction at 
                            Georgia Institute of Technology. Alongside this his Master's program, Rob still resides in Charlottesville post-grad,
                            and works full time as a software engineer at GA-Intelligence.
                        </p>
                        <p>
                            Rob's technical expertise spans multiple programming languages and technologies including Java, Python, 
                            JavaScript, React, Node.js, and various cloud technologies. His experience as a Software Engineer and
                            as a Teaching Assistant in UVA's Computer Science Department demonstrates his commitment to both technical
                            excellence and knowledge sharing.
                        </p>
                        <p>
                            Rob's technical leadership helps UJLP maintain a modern, accessible digital platform that supports 
                            the Journal's mission of expanding opportunities for undergraduate legal research and writing. 
                            He believes in leveraging technology to make legal scholarship more accessible and engaging for 
                            the broader community.
                        </p>
                    </div>
                </div>
            </section>

            <section className="author-experience">
                <div className="section-content">
                    <h2>Professional Experience</h2>
                    <div className="experience-list">
                        <div className="experience-item">
                            <h3>GA-Intelligence</h3>

                            <div className="ga-tabs">
                                <div className="ga-entry">
                                    <h4>Software Engineer II</h4>
                                    <p className="experience-meta">Mar 2026 - Present</p>
                                    <p className="experience-description">
                                        - Promoted to SE II; served as Lead Developer on the lowside analytics team, consistently delivering ~25 point sprints. <br />
                                        - Transitioned ownership of a critical repository to senior leadership, delivering a technical presentation to the schema subteam. <br />
                                        - Served as primary developer and repo authority for the schema subteam, acting as point of contact for leadership. <br />
                                        - Independently built a GitLab CI/CD pipeline that auto-generates schema documentation on every commit via GitLab Pages; replacing manual tag checkouts  with diff visualization, backwards compatibility checks, and a metrics dashboard
                                        for visibility into schema changes across formats. <br />
                                    </p>
                                </div>

                                <div className="ga-entry">
                                    <h4>Software Engineer I</h4>
                                    <p className="experience-meta">Jun 2025 - Mar 2026</p>
                                    <p className="experience-description">
                                        - Led migration of data converters into a centralized repository with strict validation and unit tests, improving data flow reliability. <br />
                                        - Owned release processes and MR queue for critical repositories, coordinating deployments end-to-end. <br />
                                        - Served as secondary technical lead for data and conversion repos — guiding schema decisions, code reviews, and releases. <br />
                                        - Drove strong team velocity averaging 16+ story points per sprint (79 merged MRs across 49 tickets in Q3–Q4 2025). <br />
                                        - Mentored junior developers through onboarding and mob sessions; led sprint ceremonies and technical training. <br />
                                        - Recognized with a Spotlight Award for contributions alongside a critical software release.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="experience-item">
                            <h3>Backend Software Engineering Intern</h3>
                            <p className="experience-meta">GA-I3 (formerly GA-CCRI) • June 2024 - August 2024</p>
                            <p className="experience-description">
                                - Improved stack data-flow by integrating new data sources in Java. <br />
                                - Prototyped and deployed Bash automation tools for project funding source allocation. <br />
                                - Expanded and redesigned CI/CD docker architecture for increased maintainability and usability.
                            </p>
                        </div>
                        <div className="experience-item">
                            <h3>Undergraduate Teaching Assistant</h3>
                            <p className="experience-meta">UVA Department of Computer Science • August 2023 - May 2025</p>
                            <p className="experience-description">
                                - Assisting the teaching of various CS courses including Intro to Programming, Data Structures and Algorithms I,
                                Human Computer Interaction, and Intro to Cybersecurity. <br />
                                - Served as Head Teaching Assistant for CS1112, managing Piazza discussions and course administration.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-projects">
                <div className="section-content">
                    <h2>Notable Projects</h2>
                    <div className="projects-list">
                        <div className="project-item">
                            <h3><a href="https://robbundy2002.github.io/Website/#/Website" target="_blank" rel="noopener noreferrer" className="project-link">Personal Website</a></h3>
                            <p className="project-meta">React.js • January 2024 - Present</p>
                            <p className="project-description">
                                Active personal website and portfolio for showcasing projects, education, and various academic papers.
                                Built with React and custom components; continuously developed and maintained since January 2024.
                            </p>
                        </div>

                        <div className="project-item">
                            <h3><a href="https://matrix-madness-frontend.onrender.com/" target="_blank" rel="noopener noreferrer" className="project-link">College Hoops Matrix Madness</a></h3>
                            <p className="project-meta">React.js • October 2023 - January 2024</p>
                            <p className="project-description">
                                Designed a modular component-based architecture in React.js, fostering code reusability 
                                and maintainability. Led UI design and development, delivering an appealing and responsive 
                                grid system.
                            </p>
                        </div>
                        <div className="project-item">
                            <h3><a href="https://robbundy2002.github.io/ResumeGPT/" target="_blank" rel="noopener noreferrer" className="project-link">Resume GPT</a></h3>
                            <p className="project-meta">AI Web Application • April 2025 - June 2025</p>
                            <p className="project-description">
                                Created an AI-powered web app using OpenAI's GPT API to analyze and optimize resumes, 
                                enhancing job search outcomes. Engineered an intuitive interface for personalized resume feedback.
                            </p>
                        </div>
                        <div className="project-item">
                            <h3>Proverbial Plates</h3>
                            <p className="project-meta">React Native • May 2024 - August 2024</p>
                            <p className="project-description">
                                Mobile application created using React Native and Tailwind.css. Backend combines Node.js 
                                alongside SQLite for user authentication and a current 500+ recipe log.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-contact">
                <div className="section-content">
                    <h2>Contact</h2>
                    <div className="contact-info">
                        <p><strong>Email:</strong> <a href="mailto:robbielbundy@gmail.com">robbielbundy@gmail.com</a></p>
                        <p><strong>Phone:</strong> <a href="tel:+12767915068">(276) 791-5068</a></p>
                        <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/rob-bundy-192035223" target="_blank" rel="noopener noreferrer">Rob Bundy</a></p>
                        <p><strong>GitHub:</strong> <a href="https://github.com/RobBundy2002" target="_blank" rel="noopener noreferrer">RobBundy2002</a></p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Rob; 