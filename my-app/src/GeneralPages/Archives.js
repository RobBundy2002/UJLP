import React, { useState } from 'react';
import '../Styling/Archives.css';
import '../Styling/Home.css';
import { Link } from 'react-router-dom';
import IssueFilter from '../Components/IssueFilter';
import '../Styling/IssueFilter.css';

const issues = [
    { id: 'all', label: 'All Issues' },
    { id: '2026-1', label: '2026 Issue 1' },
    { id: '2025-2', label: '2025 Issue 2' },
    { id: '2025-1', label: '2025 Issue 1' },
    { id: '2024-2', label: '2024 Issue 2' },
    { id: '2024-1', label: '2024 Issue 1' },
];

const allArticles = [
    {
        title: "Dangerous Implications: The application of corporate personhood and its threat to democracy",
        author: "Derek Tsai",
        authorLink: "/author/derek",
        category: "International Law",
        date: "January 2026",
        issue: "2026-1",
        excerpt: "An examination of how corporate personhood doctrines impact democratic governance and political power structures.",
        link: "/dangerousimplications"
    },
    {
        title: "From 'Wild Beasts' to Human Beings: Rethinking the Insanity Defense in the Age of Mental Health Awareness",
        author: "Mikayla Grady",
        authorLink: "/author/mikayla",
        category: "Criminal Law",
        date: "June 2025",
        issue: "2025-2",
        excerpt: "A critical analysis of how modern mental health understanding should reshape legal approaches to insanity defense.",
        link: "/insanitydefense"
    },
    {
        title: "This Article is in Progress",
        author: "Sarah Johnson",
        category: "International Law",
        date: "Upcoming",
        issue: "2026-2",
        excerpt: "This piece is coming soon.",
        link: "#"
    },
    {
        title: "This Article is in Progress",
        author: "John Smith",
        category: "Environmental Law",
        date: "Upcoming",
        issue: "2026-2",
        excerpt: "This piece is coming soon.",
        link: "#"
    },
    {
        title: "This Article is in Progress",
        author: "Jane Doe",
        category: "Constitutional Law",
        date: "Upcoming",
        issue: "2026-2",
        excerpt: "This piece is coming soon.",
        link: "#"
    }
];

const categories = ["All", "International Law", "Criminal Law", "Constitutional Law", "Environmental Law"];

function Archives() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeIssue, setActiveIssue] = useState('all');

    const filteredArticles = allArticles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
        const matchesIssue = activeIssue === 'all' || article.issue === activeIssue;
        return matchesSearch && matchesCategory && matchesIssue;
    });

    const getIssueLabel = (issueId) => {
        const issue = issues.find(i => i.id === issueId);
        return issue ? issue.label : 'Latest Issue';
    };

    return (
        <div className="archives-container fade-in">
            <section className="archives-hero">
                <div className="section-content">
                    <h1>Article Archives</h1>
                    <p className="hero-content">
                        Search and explore all published articles from the Undergraduate Journal of Law and Politics
                    </p>
                </div>
            </section>

            <section className="search-section">
                <div className="section-content">
                    <IssueFilter 
                        issues={issues} 
                        activeIssue={activeIssue} 
                        onIssueChange={setActiveIssue} 
                    />
                    <div className="search-controls">
                        <div className="search-input-container">
                            <input
                                type="text"
                                placeholder="Search articles, authors, or topics..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <div className="category-filter">
                            <select 
                                value={selectedCategory} 
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="category-select"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="search-results">
                        <p className="results-count">
                            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                </div>
            </section>

            <section className="articles-section">
                <div className="section-content">
                    <div className="articles-grid">
                        {filteredArticles.map((article, index) => (
                            <article className="article-card" key={index}>
                                <div className="article-content">
                                    <span className="article-category">{article.category}</span>
                                    {article.issue && (
                                        <div className="article-issue-badge">
                                            {getIssueLabel(article.issue)}
                                        </div>
                                    )}
                                    <h3>{article.title}</h3>
                                    <p className="article-meta">
                                        By {article.authorLink ? (
                                            <Link to={article.authorLink} className="author-link">{article.author}</Link>
                                        ) : (
                                            article.author
                                        )} • {article.date}
                                    </p>
                                    <p className="article-excerpt">{article.excerpt}</p>
                                    <Link to={article.link} className="article-link">Read Article →</Link>
                                </div>
                            </article>
                        ))}
                    </div>
                    {filteredArticles.length === 0 && (
                        <div className="no-results">
                            <p>No articles found matching your search criteria.</p>
                            <p>Try adjusting your search terms or category filter.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Archives; 