import React from 'react';
import './Contact.css';

const contacts = [
    {
        title: "We'd love to hear from you!",
        description: "Please fill out our Google Form to get in touch.",
        link: "https://forms.office.com/r/ZpWdDuEQyt",
        linkText: "Google Form"
    },
    {
        title: "Check out our Instagram",
        description: "Follow us on Instagram for updates.",
        link: "https://www.instagram.com/ujlawandpoliticsatuva/",
        linkText: "Instagram"
    },
    {
        title: "Questions about UJLP?",
        description: "If you have any questions about the UJLP, please email us.",
        link: "mailto:ujlawandpolitics@gmail.com",
        linkText: "ujlawandpolitics@gmail.com"
    }
];

function Contact() {
    return (
        <div className="contact-page">
            <section className="contact-header">
                <h1>Contact Us</h1>
                <p>We’d love to hear from you! Whether you have a question, suggestion, or want to get involved, feel free to reach out to us via the links below.</p>
            </section>

            <section className="contact-cards">
                {contacts.map((contact, index) => (
                    <div className="contact-card" key={index}>
                        <h2>{contact.title}</h2>
                        <p>{contact.description}</p>
                        <a href={contact.link} target="_blank" rel="noopener noreferrer" className="contact-link">
                            {contact.linkText}
                        </a>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default Contact;
