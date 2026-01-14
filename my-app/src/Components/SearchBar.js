import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styling/SearchBar.css';

const searchData = {
    articles: [
        {
            title: "Dangerous Implications: The application of corporate personhood and its threat to democracy",
            author: "Derek Tsai",
            category: "International Law",
            link: "/dangerousimplications",
            type: "article"
        },
        {
            title: "Schoolhouse Secrets: Parental Rights and Gender Identity Disclosure in the American Classroom",
            author: "Shelby Eliasek",
            category: "Education Law",
            link: "/schoolhousesecrets",
            type: "article"
        }
    ],
    authors: [
        { name: "Derek Tsai", role: "Editor-in-Chief", link: "/author/derek", type: "author" },
        { name: "Shelby Eliasek", role: "Director of Operations", link: "/author/shelby", type: "author" },
        { name: "Rob Bundy", role: "Director of Technology", link: "/author/rob", type: "author" },
        { name: "Evan Proudkii", role: "Managing Editor", link: "/author/evan", type: "author" },
        { name: "Richard Xu", role: "Director of Legal Writing & Research", link: "/author/richard", type: "author" },
        { name: "Will Olszewski", role: "Executive Editor", link: "/author/will", type: "author" },
        { name: "Rishi Chandra", role: "Executive Editor", link: "/author/rishi", type: "author" },
        { name: "Mia Petersen", role: "Executive Editor", link: "/author/mia", type: "author" }
    ],
    pages: [
        { title: "About UJLP", link: "/about", type: "page" },
        { title: "Journal", link: "/journal", type: "page" },
        { title: "Announcements", link: "/announcements", type: "page" },
        { title: "Contact", link: "/contact", type: "page" },
        { title: "Join The Team", link: "/jointheteam", type: "page" },
    ]
};

function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (searchQuery) => {
        setQuery(searchQuery);

        if (searchQuery.trim() === '') {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const lowerQuery = searchQuery.toLowerCase();
        const searchResults = [];

        searchData.articles.forEach(article => {
            if (
                article.title.toLowerCase().includes(lowerQuery) ||
                article.author.toLowerCase().includes(lowerQuery) ||
                article.category.toLowerCase().includes(lowerQuery)
            ) {
                searchResults.push(article);
            }
        });

        searchData.authors.forEach(author => {
            if (
                author.name.toLowerCase().includes(lowerQuery) ||
                author.role.toLowerCase().includes(lowerQuery)
            ) {
                searchResults.push(author);
            }
        });

        searchData.pages.forEach(page => {
            if (page.title.toLowerCase().includes(lowerQuery)) {
                searchResults.push(page);
            }
        });

        setResults(searchResults);
        setIsOpen(searchResults.length > 0);
        setSelectedIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev < results.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleResultClick(results[selectedIndex]);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const handleResultClick = (result) => {
        navigate(result.link);
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    const getIcon = (type) => {
        switch(type) {
            case 'article':
                return '📄';
            case 'author':
                return '👤';
            case 'page':
                return '📑';
            default:
                return '🔍';
        }
    };

    const highlightText = (text, query) => {
        if (!query.trim()) return text;

        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ?
                <mark key={i}>{part}</mark> : part
        );
    };

    return (
        <div className="search-container" ref={searchRef}>
            <div className="search-input-wrapper">
                <svg
                    className="search-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search articles, authors, pages..."
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query && setIsOpen(true)}
                />
                {query && (
                    <button
                        className="search-clear"
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                            setIsOpen(false);
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div className="search-results">
                    <div className="search-results-header">
                        {results.length} result{results.length !== 1 ? 's' : ''} found
                    </div>
                    <div className="search-results-list">
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className={`search-result-item ${selectedIndex === index ? 'selected' : ''}`}
                                onClick={() => handleResultClick(result)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <span className="result-icon">{getIcon(result.type)}</span>
                                <div className="result-content">
                                    <div className="result-title">
                                        {result.title ? highlightText(result.title, query) : highlightText(result.name, query)}
                                    </div>
                                    <div className="result-subtitle">
                                        {result.type === 'article' && (
                                            <>
                                                <span className="result-category">{result.category}</span>
                                                <span className="result-separator">•</span>
                                                <span>{result.author}</span>
                                            </>
                                        )}
                                        {result.type === 'author' && result.role}
                                        {result.type === 'page' && 'Page'}
                                    </div>
                                </div>
                                <svg className="result-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6"/>
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchBar;