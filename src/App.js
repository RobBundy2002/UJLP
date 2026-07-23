import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import './Styling/App.css';
import './Styling/GlobalOverhaul.css';
import Home from './GeneralPages/Home';
import About from './GeneralPages/About';
import Journal from './GeneralPages/Journal';
import Announcements from './GeneralPages/Announcements';
import Contact from './GeneralPages/Contact';
import Footer from './Components/Footer';
import Toast from './Components/Toast';
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
import BackToTop from "./Components/BackToTop";
import PublicationIndex from './GeneralPages/PublicationIndex';
import IssueEdition from './GeneralPages/IssueEdition';
import ResearchArea from './GeneralPages/ResearchArea';
import BioFrame from './Components/BioFrame';
import { PrintingPressIntro } from './Components/JournalCinema';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        const scrollToTop = () => {
            const startPosition = window.pageYOffset;
            const duration = 500;
            let startTime = null;

            const animation = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = currentTime - startTime;
                const easeInOutQuad = (t) => {
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                };

                if (progress < duration) {
                    const newPosition = startPosition * (1 - easeInOutQuad(progress / duration));
                    window.scrollTo(0, newPosition);
                    requestAnimationFrame(animation);
                } else {
                    window.scrollTo(0, 0);
                }
            };

            requestAnimationFrame(animation);
        };

        scrollToTop();
    }, [pathname]);

    return null;
}

function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const menuRef = useRef(null);

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
                menuRef.current.scrollTop = 0;
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
    const heroRoutes = ['/', '/about', '/journal', '/announcements', '/contact', '/jointheteam'];
    const isHeroRoute = heroRoutes.includes(location.pathname);

    return (
        <header className={`App-header ${isHeroRoute ? 'over-hero' : ''} ${isScrolled ? 'scrolled' : ''}`}>
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
                    id="primary-navigation"
                    className={`App-nav-top ${isMobileMenuOpen ? 'active' : ''}`}
                >
                    <div className="mobile-nav-header">
                        <div><strong>UJLP</strong><span>Site index</span></div>
                        <button type="button" className="mobile-nav-close" onClick={closeMobileMenu} aria-label="Close navigation">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M5 5l14 14M19 5L5 19" />
                            </svg>
                        </button>
                    </div>
                    <p className="mobile-nav-kicker">Explore the Journal</p>
                    <Link to="/" className={`App-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMobileMenu}>Home</Link>
                    <Link to="/about" className={`App-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={closeMobileMenu}>About</Link>
                    <Link to="/journal" className={`App-link ${location.pathname === '/journal' ? 'active' : ''}`} onClick={closeMobileMenu}>Journal</Link>
                    <Link to="/announcements" className={`App-link ${location.pathname === '/announcements' ? 'active' : ''}`} onClick={closeMobileMenu}>Announcements</Link>
                    <Link to="/contact" className={`App-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={closeMobileMenu}>Contact</Link>
                    <Link to="/jointheteam" className={`App-link ${location.pathname === '/jointheteam' ? 'active' : ''}`} onClick={closeMobileMenu}>Apply</Link>
                    <div className="mobile-nav-footer"><span>University of Virginia</span><span>Est. 2024</span></div>
                </nav>

                <div className="header-search">
                    <SearchBar />
                </div>

                <button className={`mobile-menu-button ${isMobileMenuOpen ? 'hidden' : ''}`} onClick={toggleMobileMenu} aria-label="Open navigation" aria-expanded={isMobileMenuOpen} aria-controls="primary-navigation">
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
                <PrintingPressIntro />
                <Navigation />
                <Toast />
                <main className="fade-in">
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/journal" element={<Journal />} />
                        <Route path="/journal/index" element={<PublicationIndex />} />
                        <Route path="/journal/issue/:issueId" element={<IssueEdition />} />
                        <Route path="/research/:slug" element={<ResearchArea />} />
                        <Route path="/announcements" element={<Announcements />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/jointheteam" element={<JoinTheTeam />} />
                        <Route path="/author/derek" element={<BioFrame name="Derek Tsai"><Derek /></BioFrame>} />
                        <Route path="/author/mikayla" element={<BioFrame name="Mikayla Grady"><Mikayla /></BioFrame>} />
                        <Route path="/author/rob" element={<BioFrame name="Rob Bundy"><Rob /></BioFrame>} />
                        <Route path="/author/evan" element={<BioFrame name="Evan Proudkii"><Evan /></BioFrame>} />
                        <Route path="/author/shelby" element={<BioFrame name="Shelby Eliasek"><Shelby /></BioFrame>} />
                        <Route path="/author/richard" element={<BioFrame name="Richard Xu"><Richard /></BioFrame>} />
                        <Route path="/author/will" element={<BioFrame name="Will Olszewski"><Will /></BioFrame>} />
                        <Route path="/author/rishi" element={<BioFrame name="Rishi Chandra"><Rishi /></BioFrame>} />
                        <Route path="/author/mia" element={<BioFrame name="Mia Petersen"><Mia /></BioFrame>} />
                        <Route path="/author/charlie" element={<BioFrame name="Charlie Houck"><Charlie /></BioFrame>} />
                        <Route path="/author/rhett" element={<BioFrame name="Rhett Deitz"><Rhett /></BioFrame>} />
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
                <BackToTop />
            </div>
        </Router>
    );
}

export default App;
