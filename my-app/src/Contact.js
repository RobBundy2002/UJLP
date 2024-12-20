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
        <div className="Contact">
            <div className="Contact-header">
                <h1>Contact Us</h1>
            </div>
            <div className="Contacts-list">
                {contacts.map((contact, index) => (
                    <div className="Contact-item" key={index}>
                        <h2>{contact.title}</h2>
                        <p>{contact.description}</p>
                        <a href={contact.link} target="_blank" rel="noopener noreferrer">{contact.linkText}</a>
                    </div>
                ))}
                <p>We will get back to you as soon as possible! Thank you for your patience and interest in our
                    work.</p>
            </div>
        </div>
    );
}

export default Contact;
