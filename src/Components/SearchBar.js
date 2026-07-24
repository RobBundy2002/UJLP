import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styling/SearchBar.css';

const searchData = {
    articles: [
        {
            title: "Unequal Opportunity: Desegregation at the University of Virginia School of Law, 1950–1960",
            author: "Derek Tsai",
            category: "Civil Rights Law",
            link: "/unequalopportunity",
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
        { name: "Richard Xu", role: "Former Director of Legal Writing & Research", link: "/author/richard", type: "author" },
        { name: "Will Olszewski", role: "Director of Legal Writing & Research", link: "/author/will", type: "author" },
        { name: "Rishi Chandra", role: "Executive Editor", link: "/author/rishi", type: "author" },
        { name: "Mia Petersen", role: "Former Executive Editor", link: "/author/mia", type: "author" },
        { name: "Charlie", role: "Executive Editor", link: "/author/charlie", type: "author" },
        { name: "Rhett", role: "Staff Writer", link: "/author/rhett", type: "author" }
    ],
    pages: [
        { title: "About UJLP", link: "/about", type: "page" },
        { title: "Journal", link: "/journal", type: "page" },
        { title: "Announcements", link: "/announcements", type: "page" },
        { title: "Contact", link: "/contact", type: "page" },
        { title: "Join The Team", link: "/jointheteam", type: "page" },
    ]
};

const normalize = (value) => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const editDistance = (left, right) => {
    const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
        const current = [leftIndex];
        for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
            const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
            current[rightIndex] = Math.min(
                current[rightIndex - 1] + 1,
                previous[rightIndex] + 1,
                previous[rightIndex - 1] + cost
            );
        }
        previous.splice(0, previous.length, ...current);
    }

    return previous[right.length];
};

const tokenScore = (word, token) => {
    if (word === token) return 40;
    if (word.startsWith(token)) return 32;
    if (word.includes(token)) return 24;

    const distance = editDistance(word, token);
    const tolerance = token.length >= 7 ? 2 : token.length >= 4 ? 1 : 0;
    if (distance > tolerance) return -1;

    return 22 * (1 - distance / Math.max(word.length, token.length));
};

const fuzzyScore = (value, query) => {
    const text = normalize(value);
    const needle = normalize(query);
    if (!text || !needle) return -1;
    if (text === needle) return 150;
    if (text.startsWith(needle)) return 125;
    if (text.includes(needle)) return 105;

    const words = text.split(' ');
    const tokens = needle.split(' ');
    const scores = tokens.map(token => Math.max(...words.map(word => tokenScore(word, token))));
    if (scores.some(score => score < 0)) return -1;

    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
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

        const candidates = [
            ...searchData.articles.map(item => ({ ...item, fields: [[item.title, 1.25], [item.author, 1], [item.category, .9]] })),
            ...searchData.authors.map(item => ({ ...item, fields: [[item.name, 1.25], [item.role, .9]] })),
            ...searchData.pages.map(item => ({ ...item, fields: [[item.title, 1.25]] }))
        ];
        const searchResults = candidates
            .map(item => ({ ...item, score: Math.max(...item.fields.map(([field, weight]) => fuzzyScore(field, searchQuery) * weight)) }))
            .filter(item => item.score >= 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 6);

        setResults(searchResults);
        setIsOpen(true);
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
        } else if (e.key === 'Enter' && results.length > 0) {
            e.preventDefault();
            handleResultClick(results[selectedIndex >= 0 ? selectedIndex : 0]);
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

    const getTypeLabel = (type) => type === 'author' ? 'Person' : type[0].toUpperCase() + type.slice(1);

    const highlightText = (text, query) => {
        if (!query.trim()) return text;

        const queryTokens = normalize(query).split(' ');
        return text.split(/(\s+)/).map((part, index) => {
            const word = normalize(part);
            if (!word) return part;

            const matchedToken = queryTokens.find(token => tokenScore(word, token) >= 0);
            if (!matchedToken) return part;

            const matchIndex = word.indexOf(matchedToken);
            if (matchIndex >= 0) {
                return (
                    <React.Fragment key={index}>
                        {part.slice(0, matchIndex)}
                        <mark>{part.slice(matchIndex, matchIndex + matchedToken.length)}</mark>
                        {part.slice(matchIndex + matchedToken.length)}
                    </React.Fragment>
                );
            }

            return <mark key={index}>{part}</mark>;
        });
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
                    aria-label="Search UJLP"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={isOpen}
                    aria-controls="site-search-results"
                    autoComplete="off"
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

            {isOpen && (
                <div className="search-results" id="site-search-results">
                    <div className="search-results-header">
                        <span>Search results</span>
                        <b>{results.length}</b>
                    </div>
                    <div className="search-results-list" role="listbox">
                        {results.length === 0 && (
                            <div className="search-empty">
                                <span>No close matches</span>
                                <p>Try a title, author, topic, or page name.</p>
                            </div>
                        )}
                        {results.map((result, index) => (
                            <button
                                type="button"
                                key={result.link}
                                className={`search-result-item ${selectedIndex === index ? 'selected' : ''}`}
                                onClick={() => handleResultClick(result)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                role="option"
                                aria-selected={selectedIndex === index}
                            >
                                <span className={`result-type result-type-${result.type}`}>{getTypeLabel(result.type)}</span>
                                <div className="result-content">
                                    <div className="result-title">
                                        {result.title ? highlightText(result.title, query) : highlightText(result.name, query)}
                                    </div>
                                    <div className="result-subtitle">
                                        {result.type === 'article' && (
                                            <>
                                                <span className="result-category">{highlightText(result.category, query)}</span>
                                                <span className="result-separator">•</span>
                                                <span>{highlightText(result.author, query)}</span>
                                            </>
                                        )}
                                        {result.type === 'author' && highlightText(result.role, query)}
                                        {result.type === 'page' && 'Page'}
                                    </div>
                                </div>
                                <svg className="result-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6"/>
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchBar;
