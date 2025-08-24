import React, { useState, useEffect, useRef } from 'react';
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
import Charlie from './authorbios/Charlie'
import logo from "./Logo.png";
import DangerousImplications from "./DangerousImplications";
import InsanityDefense from "./InsanityDefense";
import JoinTheTeam from "./JoinTheTeam";

// Scroll to top on route change
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
    const menuRef = useRef(null); // Ref to mobile menu for auto-scroll

    // Track scroll for header style
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when navigating
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    // Prevent background scroll and auto-scroll menu to top
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            if (menuRef.current) {
                menuRef.current.scrollTop = 0; // auto-scroll to top
            }
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
                <nav
                    ref={menuRef}
                    className={`App-nav-top ${isMobileMenuOpen ? 'active' : ''}`}
                >
                    <Link to="/" className={`App-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMobileMenu}>Home</Link>
                    <Link to="/about" className={`App-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={closeMobileMenu}>About</Link>
                    <Link to="/journal" className={`App-link ${location.pathname === '/journal' ? 'active' : ''}`} onClick={closeMobileMenu}>Journal</Link>
                    <Link to="/announcements" className={`App-link ${location.pathname === '/announcements' ? 'active' : ''}`} onClick={closeMobileMenu}>Announcements</Link>
                    <Link to="/contact" className={`App-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={closeMobileMenu}>Contact</Link>
                    <Link to="/jointheteam" className={`App-link ${location.pathname === '/jointheteam' ? 'active' : ''}`} onClick={closeMobileMenu}>Apply</Link>
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
                        <Route path="/announcements" element={<Announcements />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/jointheteam" element={<JoinTheTeam />} />
                        <Route path="/author/derek" element={<Derek />} />
                        <Route path="/author/mikayla" element={<Mikayla />} />
                        <Route path="/author/rob" element={<Rob />} />
                        <Route path="/author/evan" element={<Evan />} />
                        <Route path="/author/shelby" element={<Shelby />} />
                        <Route path="/author/richard" element={<Richard />} />
                        <Route path="/author/will" element={<Will />} />
                        <Route path="/author/rishi" element={<Rishi />} />
                        <Route path="/author/mia" element={<Mia />} />
                        <Route path="/author/charlie" element={<Charlie />} />
                        <Route path="/dangerousimplications" element={<DangerousImplications />} />
                        <Route path="/insanitydefense" element={<InsanityDefense />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
