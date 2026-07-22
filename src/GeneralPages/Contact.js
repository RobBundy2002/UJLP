import React from 'react';
import '../Styling/Contact.css';
import '../Styling/EditorialPages.css';
import ParticleBackground from '../Components/ParticleBackground';

const contacts = [
    {
        title: "See Updates",
        description: "Check out our latest news, announcements, and upcoming events on our Announcements page.",
        link: "/#/announcements",
        linkText: "View Announcements"
    },
    {
        title: "Follow Us",
        description: "Stay updated with our latest news, events, and announcements by following us on Instagram.",
        link: "https://www.instagram.com/ujlawandpoliticsatuva/",
        linkText: "@ujlawandpoliticsatuva"
    },
    {
        title: "Email Us",
        description: "For direct inquiries about UJLP, our programs, or upcoming events, send us an email.",
        link: "mailto:ujlawandpolitics@gmail.com",
        linkText: "ujlawandpolitics@gmail.com"
    }
];

function Contact() {
    return (
        <div className="contact-container jh-page jh-contact fade-in">
            <section className="contact-hero">
                <ParticleBackground />
                <div className="section-content">
                    <p className="jh-eyebrow jh-contact-kicker"><strong>UJLP</strong> · University of Virginia · Est. 2024</p>
                    <h1>Contact<br /><em>us.</em></h1>
                    <p className="hero-content">
                        We're here to help! Whether you have questions about our programs,
                        want to get involved, or just want to say hello, we'd love to hear from you.
                    </p>
                </div>
            </section>

            <section className="contact-redesign">
                <div className="contact-redesign-heading">
                    <p className="jh-contact-kicker">Start a conversation</p>
                    <h2>Find the right<br /><em>way in.</em></h2>
                    <span>Choose the channel that works best for you.</span>
                </div>
                <div className="contact-route-grid">
                    {contacts.map((contact, index) => (
                        <article className="contact-route" key={index}>
                            <span className="contact-route-number">0{index + 1}</span>
                            <span className={`contact-route-mark mark-${index + 1}`} aria-hidden="true" />
                            <h3>{contact.title}</h3>
                            <p>{contact.description}</p>
                            <a
                                href={contact.link}
                                target={contact.link.startsWith('http') ? "_blank" : "_self"}
                                rel={contact.link.startsWith('http') ? "noopener noreferrer" : undefined}
                            >
                                <span>{contact.linkText}</span><b aria-hidden="true">↗</b>
                            </a>
                        </article>
                    ))}
                </div>
            </section>

            <section className="contact-details-redesign">
                <article>
                    <h3>Office Hours</h3>
                    <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p>Saturday - Sunday: Closed</p>
                </article>
                <article>
                    <h3>Location</h3>
                    <p>University of Virginia</p>
                    <p>Charlottesville, VA 22903</p>
                </article>
            </section>
        </div>
    );
}

export default Contact;
