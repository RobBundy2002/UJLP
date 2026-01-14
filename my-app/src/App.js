import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import './Styling/App.css';
import Home from './GeneralPages/Home';
import About from './GeneralPages/About';
import Journal from './GeneralPages/Journal';
import Archives from './GeneralPages/Archives';
import Announcements from './GeneralPages/Announcements';
import Contact from './GeneralPages/Contact';
import Footer from './Components/Footer';
import Derek from './Bios/Derek';
import Mikayla from './Bios/Mikayla';
import Rob from './Bios/Rob';
import Evan from './Bios/Evan';
import Shelby from './Bios/Shelby';
import Richard from './Bios/Richard';
import Will from './Bios/Will';
import Rishi from './Bios/Rishi';
import Mia from './Bios/Mia';
import Charlie from './Bios/Charlie'
import Rhett from './Bios/Rhett';
import logo from "./ProfilePictures/HeaderLogo.png";
import DangerousImplications from "./ArticlePages/DangerousImplications";
import SchoolhouseSecrets from "./ArticlePages/SchoolhouseSecrets";
import JoinTheTeam from "./GeneralPages/JoinTheTeam";
import ComingSoon1 from "./Bios/ComingSoon1";
import ComingSoon2 from "./Bios/ComingSoon2";
import ComingSoon3 from "./Bios/ComingSoon3";
import ComingSoon4 from "./Bios/ComingSoon4";
import ComingSoon5 from "./Bios/ComingSoon5";
import ComingSoon6 from "./Bios/ComingSoon6";
import ComingSoon7 from "./Bios/ComingSoon7";
import ComingSoon8 from "./Bios/ComingSoon8";
import SearchBar from "./Components/SearchBar";

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

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

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
                    <img src={logo} alt="UJLP Logo"/>
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

                <div className="header-search">
                    <SearchBar />
                </div>

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
                        <Route path="/author/rhett" element={<Rhett />} />
                        <Route path="/author/comingsoon1" element={<ComingSoon1 />} />
                        <Route path="/author/comingsoon2" element={<ComingSoon2 />} />
                        <Route path="/author/comingsoon3" element={<ComingSoon3 />} />
                        <Route path="/author/comingsoon4" element={<ComingSoon4 />} />
                        <Route path="/author/comingsoon5" element={<ComingSoon5 />} />
                        <Route path="/author/comingsoon6" element={<ComingSoon6 />} />
                        <Route path="/author/comingsoon7" element={<ComingSoon7 />} />
                        <Route path="/author/comingsoon8" element={<ComingSoon8 />} />
                        <Route path="/dangerousimplications" element={<DangerousImplications />} />
                        <Route path="/schoolhousesecrets" element={<SchoolhouseSecrets />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
