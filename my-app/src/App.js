import React from 'react';
import { HashRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import Home from './Home';
import About from './About';
import Journal from './Journal';
import Announcements from './Announcements';
import Contact from './Contact';
import Footer from './Footer';
import logo from "./Logo.png";

function App() {
    return (
        <Router>
            <div className="SiteWrapper">
                <main className="Content">
                    <header className="home-header">
                        <div className="home-header-top">
                            <div className="home-title">
                                <img src={logo} alt="Logo" className="home-logo"/>
                                <h1 className="home-title-text">Undergraduate Journal of Law and Politics</h1>
                            </div>
                            <nav className="home-nav">
                                <Link to="/" className="home-nav-link">Home</Link>
                                <Link to="/about" className="home-nav-link">About</Link>
                                <Link to="/journal" className="home-nav-link">Journal</Link>
                                <Link to="/announcements" className="home-nav-link">Announcements</Link>
                                <Link to="/contact" className="home-nav-link">Contact</Link>
                            </nav>
                        </div>
                    </header>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/journal" element={<Journal/>}/>
                        <Route path="/announcements" element={<Announcements/>}/>
                        <Route path="/contact" element={<Contact/>}/>
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </main>
                <Footer/>
            </div>
        </Router>
    );
}

export default App;
