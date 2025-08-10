import React from 'react';
import './Journal.css';
import './Home.css';
import { Link } from 'react-router-dom';

const articles = [
    {
        title: "Dangerous Implications: The application of corporate personhood and its threat to democracy",
        author: "Derek Tsai",
        authorLink: "/author/derek",
        category: "International Law",
        date: "June 2025",
        excerpt: "",
        link: "#"
    },
    {
        title: "From 'Wild Beasts' to Human Beings: Rethinking the Insanity Defense in the Age of Mental Health Awareness",
        author: "Mikayla Grady",
        authorLink: "/author/mikayla",
        category: "Criminal Law",
        date: "June 2025",
        excerpt: "",
        link: "#"
    },
    {
        title: "This Article is in Progress",
        author: "Sarah Johnson",
        category: "International Law",
        date: "June 2025",
        excerpt: "",
        link: "#"
    },
];

function Journal() {
    return (
        <div className="journal-container fade-in">
            <section className="journal-hero">
                <div className="section-content">
                    <h1>The Journal</h1>
                    <p className="hero-content">
                        Publishing the best undergraduate research in both law and politics
                    </p>
                </div>
            </section>

            <section className="journal-intro">
                <div className="section-content">
                    <div className="intro-content">
                        <p>
                            Our journal publishes rigorous, peer-reviewed research that explores the intersection of law, 
                            politics, and society. Each article represents the culmination of months of research, 
                            analysis, and scholarly debate.
                        </p>
                    </div>
                </div>
            </section>

            <section className="journal-articles">
                <div className="section-content">
                    <h2>Latest Publications</h2>
                    <div className="articles-grid">
                        {articles.map((article, index) => (
                            <article className="article-card" key={index}>
                                <div className="article-content">
                                    <span className="article-category">{article.category}</span>
                                    <h3>{article.title}</h3>
                                    <p className="article-meta">
                                        By {article.authorLink ? (
                                            <Link to={article.authorLink} className="author-link">{article.author}</Link>
                                        ) : (
                                            article.author
                                        )} • {article.date}
                                    </p>
                                    <p className="article-excerpt">{article.excerpt}</p>
                                    <a href={article.link} className="article-link">Read Article →</a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="journal-cta">
                <div className="section-content">
                    <h2>Contribute to Our Journal</h2>
                    <p>We welcome submissions from undergraduate students interested in legal and political research.</p>
                    <div className="cta-buttons">
                        <a href="#/contact" className="cta-button">Submit Your Work</a>
                        <a href="#/about" className="cta-button">Learn More</a>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Journal;
