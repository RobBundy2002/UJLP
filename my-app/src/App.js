import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Home from './Home';
import About from './About';
import Journal from './Journal';
import Archives from './Archives';
import Announcements from './Announcements';
import Contact from './Contact';
import Footer from './Footer';
import Derek from './authorbios/Derek';
import Mikayla from './authorbios/Mikayla';
import Rob from './authorbios/Rob';
import Evan from './authorbios/Evan';
import Shelby from './authorbios/Shelby';
import Richard from './authorbios/Richard';
import Will from './authorbios/Will';
import Rishi from './authorbios/Rishi';
import Mia from './authorbios/Mia';
import logo from "./Logo.png";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Close mobile menu when location changes
        setIsMobileMenuOpen(false);
    }, [location]);

    useEffect(() => {
        // Prevent background scrolling when mobile menu is open
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className={`App-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
                <Link to="/" className="App-title">
                    <img src={logo} alt="UJLP Logo" />
                    <div className="title-text">
                        <span className="title-line-1">Undergraduate Journal</span>
                        <span className="title-line-2">of Law and Politics</span>
                    </div>
                </Link>
                <nav className={`App-nav-top ${isMobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className={`App-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMobileMenu}>Home</Link>
                    <Link to="/about" className={`App-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={closeMobileMenu}>About</Link>
                    <Link to="/journal" className={`App-link ${location.pathname === '/journal' ? 'active' : ''}`} onClick={closeMobileMenu}>Journal</Link>
                    <Link to="/archives" className={`App-link ${location.pathname === '/archives' ? 'active' : ''}`} onClick={closeMobileMenu}>Archives</Link>
                    <Link to="/announcements" className={`App-link ${location.pathname === '/announcements' ? 'active' : ''}`} onClick={closeMobileMenu}>Announcements</Link>
                    <Link to="/contact" className={`App-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={closeMobileMenu}>Contact</Link>
                </nav>
                <button className={`mobile-menu-button ${isMobileMenuOpen ? 'hidden' : ''}`} onClick={toggleMobileMenu}>
                    <svg className={`menu-icon ${isMobileMenuOpen ? 'active' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M3 12h18M3 18h18"/>
                    </svg>
                </button>
            </div>
        </header>
    );
}

function App() {
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
    }, []);

    return (
        <Router>
            <div className="App">
                <Navigation />
                <main className="fade-in">
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/journal" element={<Journal />} />
                        <Route path="/archives" element={<Archives />} />
                        <Route path="/announcements" element={<Announcements />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/author/derek" element={<Derek />} />
                        <Route path="/author/mikayla" element={<Mikayla />} />
                        <Route path="/author/rob" element={<Rob />} />
                        <Route path="/author/evan" element={<Evan />} />
                        <Route path="/author/shelby" element={<Shelby />} />
                        <Route path="/author/richard" element={<Richard />} />
                        <Route path="/author/will" element={<Will />} />
                        <Route path="/author/rishi" element={<Rishi />} />
                        <Route path="/author/mia" element={<Mia />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
