import React from 'react';
import {BrowserRouter as Router, Route, Routes, Link, Navigate} from 'react-router-dom';
import './App.css';
import Home from './Home';
import About from './About';
import Journal from './Journal';
import Announcements from './Announcements';
import Contact from './Contact';
import logo from './Logo.png'

function App() {
  return (
      <Router>
        <div className="App">
          <header className="App-header">
            <div className="App-header-top">
              <div className="App-title">
                <img src={logo} alt="Logo" className=""/>
                &emsp;  &emsp;  &emsp;  &emsp;  Undergraduate Journal of Law and Politics
              </div>
            </div>
            <nav className="App-nav">
            <nav className="App-nav-top">
                <Link to="/" className="App-link">Home</Link>
                <Link to="/about" className="App-link">About</Link>
                <Link to="/journal" className="App-link">Journal</Link>
                <Link to="/announcements" className="App-link">Announcements</Link>
                <Link to="/contact" className="App-link">Contact</Link>
              </nav>
            </nav>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/about" element={<About/>}/>
              <Route path="/journal" element={<Journal/>}/>
              <Route path="/announcements" element={<Announcements/>}/>
              <Route path="/contact" element={<Contact/>}/>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <a href="https://www.instagram.com/ujlawandpolitics/?hl=en" className="App-link App-instagram" target="_blank"
             rel="noopener noreferrer">Instagram</a>
          <a href="mailto:ujlawandpolitics@gmail.com" className="App-email">Email Us</a> {}
          <footer className="App-footer">
          </footer>
        </div>
      </Router>
  );
}

export default App;
