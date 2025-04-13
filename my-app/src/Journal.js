import React from 'react';
import './Journal.css';

const articles = [
    {
        title: "This Article is in Progress",
        author: "Jane Doe",
        excerpt: "",
        link: "#"
    },
    {
        title: "This Article is in Progress",
        author: "John Doe",
        excerpt: "",
        link: "#"
    },
    {
        title: "This Article is in Progress",
        author: "John Smith",
        excerpt: "",
        link: "#"
    },
];

function Journal() {
    return (
        <div className="journal-page">
            <section className="journal-hero">
                <h1 className="journal-title">The Journal</h1>
                <p className="journal-subtitle">
                    Publishing the best of undergraduate research in law and politics.
                </p>
            </section>

            <section className="journal-articles">
                {articles.map((article, index) => (
                    <div className="journal-article-card" key={index}>
                        <h2 className="article-title">{article.title}</h2>
                        <p className="article-author">By {article.author}</p>
                        <p className="article-excerpt">{article.excerpt}</p>
                        <a href={article.link} className="article-read-more">Read More</a>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default Journal;
