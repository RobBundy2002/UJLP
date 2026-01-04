import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styling/AuthorCarousel.css';
import derekImg from '../ProfilePictures/Derek.png';
import shelbyImg from '../ProfilePictures/Shelby.jpeg';
import robImg from '../ProfilePictures/Rob.jpg';
import evanImg from '../ProfilePictures/Evan.jpeg';
import richardImg from '../ProfilePictures/Richard.jpg';

const authors = [
    {
        id: 'derek',
        name: 'Derek Tsai',
        role: 'Executive Editor',
        image: derekImg,
        bio: 'History & Economics',
        link: '/author/derek'
    },
    {
        id: 'shelby',
        name: 'Shelby Eliasek',
        role: 'Director of Operations',
        image: shelbyImg,
        bio: 'Pre-Law Track with Studio Art Minor',
        link: '/author/shelby'
    },
    {
        id: 'rob',
        name: 'Rob Bundy',
        role: 'Director of Technology',
        image: robImg,
        bio: 'Computer Science & Religious Studies',
        link: '/author/rob'
    },
    {
        id: 'evan',
        name: 'Evan Proudkii',
        role: 'Managing Editor',
        image: evanImg,
        bio: 'Political Science & Economics',
        link: '/author/evan'
    },
    {
        id: 'richard',
        name: 'Richard Xu',
        role: 'Director of Legal Writing & Research',
        image: richardImg,
        bio: 'Political Philosophy, Policy, and Law',
        link: '/author/richard'
    },
    // {
    //     id: 'mikayla',
    //     name: 'Mikayla Grady',
    //     role: 'Staff Writer',
    //     image: null,
    //     bio: 'Criminal Law Specialist',
    //     link: '/author/mikayla'
    // }
];

function AuthorCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

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
                                                className="cta-button"
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