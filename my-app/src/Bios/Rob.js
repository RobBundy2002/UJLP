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
                            As a Computer Science major with a minor in Religious Studies at the University of Virginia, Rob brings 
                            a unique interdisciplinary perspective to the intersection of technology and law. He is currently pursuing 
                            an online Master's degree in Computer Science with a concentration in Human Computer Interaction at 
                            Georgia Institute of Technology.
                        </p>
                        <p>
                            Rob's technical expertise spans multiple programming languages and technologies including Java, Python, 
                            JavaScript, React, Node.js, and various cloud technologies. His experience as a Software Developer at
                            GA-I3 and as a Teaching Assistant in UVA's Computer Science Department demonstrates his commitment to 
                            both technical excellence and knowledge sharing.
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
                            <h3>Software Developer</h3>
                            <p className="experience-meta">GA-I3 • June 2025 - Present</p>
                            <p className="experience-description">
                                Collaborated with team members to design and implement backend solutions in Java. 
                                Utilized version control and CI/CD pipelines to streamline development workflows. 
                                Identified and mitigated security vulnerabilities in core company projects.
                            </p>
                        </div>
                        <div className="experience-item">
                            <h3>Backend Software Engineering Intern</h3>
                            <p className="experience-meta">GA-I3 (formerly GA-CCRI) • June 2024 - August 2024</p>
                            <p className="experience-description">
                                Improved stack data-flow by integrating new data sources in Java. Prototyped and deployed 
                                Bash automation tools for project funding source allocation. Expanded and redesigned CI/CD 
                                docker architecture for increased maintainability and usability.
                            </p>
                        </div>
                        <div className="experience-item">
                            <h3>Undergraduate Teaching Assistant</h3>
                            <p className="experience-meta">UVA Department of Computer Science • August 2023 - May 2025</p>
                            <p className="experience-description">
                                Taught courses including Intro to Programming, Data Structures and Algorithms I, 
                                Human Computer Interaction, and Intro to Cybersecurity. Served as Head Teaching Assistant 
                                for CS1112, managing Piazza discussions and course administration.
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