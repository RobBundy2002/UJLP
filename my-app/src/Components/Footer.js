import React from 'react';
import '../Styling/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Undergraduate Journal of Law and Politics</h3>
                    <p>University of Virginia</p>
                    <p>Charlottesville, VA</p>
                </div>
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <a href="#/about">About Us</a>
                    <a href="#/journal">Journal</a>
                    <a href="#/announcements">Announcements</a>
                    <a href="#/contact">Contact</a>
                </div>
                <div className="footer-section">
                    <h3>Connect With Us</h3>
                    <a href="mailto:ujlawandpolitics@gmail.com">ujlawandpolitics@gmail.com</a>
                    <div className="social-links">
                        <a href="https://www.linkedin.com/company/undergraduate-journal-of-law-politics/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href="https://www.instagram.com/ujlawandpoliticsatuva/" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 Undergraduate Journal of Law and Politics at the University of Virginia. All Rights Reserved.</p>
                <p>Website designed by <a href="https://www.linkedin.com/in/rob-bundy-192035223/" target="_blank" rel="noopener noreferrer">Rob Bundy</a></p>
            </div>
        </footer>
    );
};

export default Footer;
