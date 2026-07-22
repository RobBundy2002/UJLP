import React from 'react';
import ParticleBackground from '../Components/ParticleBackground';
import '../Styling/Journal.css';
import '../Styling/Home.css';
import '../Styling/EditorialPages.css';
import IssueShelf from '../Components/IssueShelf';
import ResearchConstellation from '../Components/ResearchConstellation';
import { AnimatedJournalSeal } from '../Components/JournalCinema';
import { articles, issues } from '../Data/journalData';

function Journal() {
    return (
        <div className="journal-container jh-page jh-journal fade-in">
            <section className="journal-hero">
                <ParticleBackground />
                <div className="section-content">
                    <p className="jh-journal-kicker"><strong>UJLP</strong> · University of Virginia · Est. 2024</p>
                    <h1>The Journal,<br /><em>in full.</em></h1>
                    <p className="hero-content">
                        Publishing the best undergraduate research in both law and politics
                    </p>
                </div>
            </section>

            <section className="journal-intro">
                <div className="section-content">
                    <div className="jh-journal-statement">
                        <div>
                            <p>What we publish</p>
                            <h2>Research with<br /><em>consequence.</em></h2>
                        </div>
                        <p>
                            Our journal publishes rigorous, peer-reviewed research that explores the intersection of law,
                            politics, and society. Each article represents the culmination of months of research,
                            analysis, and scholarly debate.
                        </p>
                        <AnimatedJournalSeal />
                    </div>
                </div>
            </section>

            <section className="journal-articles">
                <div className="section-content">
                    <IssueShelf
                        issues={issues}
                        articles={articles}
                    />
                </div>
            </section>

            <ResearchConstellation />
        </div>
    );
}

export default Journal;
