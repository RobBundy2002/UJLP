import React from 'react';
import './Contact.css';

function Contact() {
    return (
        <div className="Contact">
            <div className="Contact-header">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you! Please fill out our Google Form to get in touch.</p>
            </div>
            <div className="Contact-form">
                <a href="https://forms.gle/your-google-form-id" target="_blank" rel="noopener noreferrer" className="button-link">
                    Fill Out Our Form
                </a>
            </div>
        </div>
    );
}

export default Contact;
