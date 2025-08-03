import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AuthorCarousel.css';
import derekImg from '../Derek.png';

const authors = [
    {
        id: 'derek',
        name: 'Derek Tsai',
        role: 'Executive Editor',
        image: derekImg,
        bio: 'Class of 2028',
        link: '/author/derek'
    },
    {
        id: 'mikayla',
        name: 'Mikayla Grady',
        role: 'Staff Writer',
        image: null,
        bio: 'Criminal Law Specialist',
        link: '/author/mikayla'
    },
    {
        id: 'sarah',
        name: 'Sarah Chen',
        role: 'Executive Editor',
        image: null,
        bio: 'Constitutional Law Expert',
        link: '/author/sarah'
    },
    {
        id: 'michael',
        name: 'Michael Rodriguez',
        role: 'Staff Editor',
        image: null,
        bio: 'International Relations Focus',
        link: '/author/michael'
    },
    {
        id: 'emma',
        name: 'Emma Thompson',
        role: 'Executive Editor',
        image: null,
        bio: 'Environmental Law Specialist',
        link: '/author/emma'
    }
];

function AuthorCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % authors.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Reset to top when component mounts or authors change
    useEffect(() => {
        setCurrentIndex(0);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % authors.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + authors.length) % authors.length);
    };

    return (
        <section className="author-spotlight">
            <div className="section-content">
                <h2>{authors[currentIndex].name} - {authors[currentIndex].role}</h2>
                <div className="carousel-container">
                    <button 
                        className="carousel-button prev" 
                        onClick={prevSlide}
                        aria-label="Previous author"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </button>
                    
                    <div className="carousel-track">
                        {authors.map((author, index) => (
                            <div
                                key={author.id}
                                className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
                                style={{
                                    transform: `translateX(${(index - currentIndex) * 100}%)`
                                }}
                            >
                                <div className="author-card">
                                    <div className="author-image">
                                        {author.image ? (
                                            <img src={author.image} alt={author.name} className="author-photo" />
                                        ) : (
                                            <div className="placeholder-image">
                                                <span>{author.name.charAt(0)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="author-info">
                                        <h3>{author.name}</h3>
                                        <p className="author-bio">{author.bio}</p>
                                        <div className="author-actions">
                                            <Link 
                                                className="view-profile-btn"
                                                to={author.link}
                                            >
                                                About Author
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        className="carousel-button next" 
                        onClick={nextSlide}
                        aria-label="Next author"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>
                </div>

                <div className="carousel-indicators">
                    {authors.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Modal */}
            {/* Modal removed as per user request */}
        </section>
    );
}

export default AuthorCarousel; 