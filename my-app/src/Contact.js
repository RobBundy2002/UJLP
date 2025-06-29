import React from 'react';
import './Contact.css';

const contacts = [
    {
        title: "Get in Touch",
        description: "Have questions or want to get involved? Fill out our form and we'll get back to you as soon as possible.",
        link: "https://forms.office.com/r/ZpWdDuEQyt",
        linkText: "Contact Form",
        icon: "📝"
    },
    {
        title: "Follow Us",
        description: "Stay updated with our latest news, events, and announcements by following us on Instagram.",
        link: "https://www.instagram.com/ujlawandpoliticsatuva/",
        linkText: "@ujlawandpoliticsatuva",
        icon: "📸"
    },
    {
        title: "Email Us",
        description: "For direct inquiries about UJLP, our programs, or upcoming events, send us an email.",
        link: "mailto:ujlawandpolitics@gmail.com",
        linkText: "ujlawandpolitics@gmail.com",
        icon: "✉️"
    }
];

function Contact() {
    return (
        <div className="contact-container">
            <section className="contact-hero">
                <h1>Contact Us</h1>
                <p className="hero-content">
                    We're here to help! Whether you have questions about our programs, 
                    want to get involved, or just want to say hello, we'd love to hear from you.
                </p>
            </section>

            <section className="contact-section">
                <div className="contact-grid">
                    {contacts.map((contact, index) => (
                        <div className="contact-card" key={index}>
                            <div className="contact-icon">{contact.icon}</div>
                            <div className="contact-content">
                                <h2>{contact.title}</h2>
                                <p>{contact.description}</p>
                                <a 
                                    href={contact.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="cta-button-contact"
                                    style={{ width: '80%' }}
                                >
                                    {contact.linkText}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="contact-info">
                <div className="info-card">
                    <h3>Office Hours</h3>
                    <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p>Saturday - Sunday: Closed</p>
                </div>
                <div className="info-card">
                    <h3>Location</h3>
                    <p>University of Virginia</p>
                    <p>Charlottesville, VA 22903</p>
                </div>
            </section>
        </div>
    );
}

export default Contact;
