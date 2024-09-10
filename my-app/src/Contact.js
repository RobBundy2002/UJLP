import React from 'react';
import './Contact.css';

function Contact() {
    return (
        <div className="Contact">
            <div className="Contact-header">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you! Please fill out the form below or reach out through our social media channels.</p>
            </div>
            <div className="Contact-form">
                <form>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" rows="4" required></textarea>
                    </div>
                    <button type="submit">Send</button>
                </form>
            </div>
            <div className="Contact-social">
                <a href="https://www.instagram.com" className="Contact-instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="mailto:example@example.com" className="Contact-email">Email Us</a>
            </div>
        </div>
    );
}

export default Contact;
