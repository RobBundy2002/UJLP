import React from 'react';
import '../AuthorBio.css';
import richardImg from '../Richard.jpg';

function Richard() {
    return (
        <div className="author-bio-container fade-in">
            <section className="author-hero">
                <div className="section-content">
                    <div className="author-content">
                        <div className="author-image">
                            <img src={richardImg} alt="Richard (Ruichong) Xu" />
                        </div>
                        <div className="author-info">
                            <h1>Richard (Ruichong) Xu</h1>
                            <span className="author-role">Director of Legal Writing & Research</span>
                            <div className="author-details">
                                <p><strong>3rd Year at UVA:</strong> Class of 2027</p>
                                <p><strong>Major:</strong> Political Philosophy, Policy, and Law (PPL)</p>
                                <p><strong>Research Interests:</strong> Philosophy, History, Politics, International Relations</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-bio-section">
                <div className="section-content">
                    <h2>About Richard</h2>
                    <div className="bio-content">
                        <p>
                            Richard (Ruichong) Xu is an Echols Scholar at the University of Virginia, Class of 2027,
                            majoring in Political Philosophy, Policy, and Law (PPL). He is a published author of two books:
                            <em> Principles of a Normative Constitution</em> (iUniverse, 2025) and
                            <em> 法律小谈</em> (<em>A Brief Talk About the Law</em>, Chinese Publishing Inc., 2023).
                        </p>
                        <p>
                            Richard’s intellectual interests span philosophy, history, politics and international relations,
                            economics, and psychology. In addition to these fields, he maintains a serious side interest in radar
                            and missile science, integrating technical analysis into his broader understanding of strategy and policy.
                        </p>
                        <p>
                            His academic essays and reflections are published regularly on
                            <a href="https://mrrichard6.academia.edu/" target="_blank" rel="noopener noreferrer"> Academia.edu</a>,
                            and he curates his portfolio and ongoing work at his
                            <a href="https://sites.google.com/view/richardrcxu-s-website/%E9%A6%96%E9%A1%B5" target="_blank" rel="noopener noreferrer"> personal website</a>.
                        </p>
                        <p>
                            With a commitment to interdisciplinary inquiry and public engagement, Richard seeks to bridge
                            theoretical insight with real-world challenges across law, policy, and global affairs.
                        </p>
                    </div>
                </div>
            </section>

            <section className="author-publications">
                <div className="section-content">
                    <h2>Publications</h2>

                    <div className="publications-list">
                        <div className="publication-item">
                            <h3>Principles of a Normative Constitution</h3>
                            <p className="publication-meta">iUniverse • 2025 • ISBN: 978-1-66327-1044</p>
                            <p className="publication-excerpt">
                                The book offers an insightful vision of an ideal constitution and a sound state system and the principles that every good constitution should staunchly embrace: preserving human dignity, constitutionalism, fundamental rights, separation of powers, democracy, and constitutional litigation system—and, more fundamentally, promoting Human Flourishing. The book also conducts a moderate comparative study on the constitutional systems of different countries—primarily the People's Republic of China , the United States, the Russian Federation, the Federal Republic of Germany, and the United Kingdom to support the author's view of the proper, concrete institutional design and enforcement of the principles that an ideal constitution upholds.
                            </p>
                            <p>
                                <a
                                    href="https://www.amazon.com/Principles-Normative-Constitution-Ruichong-Xu/dp/1663271046/ref=sr_1_1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="book-link"
                                >Buy on Amazon</a>
                            </p>
                        </div>

                        <div className="publication-item">
                            <h3>法律小谈 (A Brief Talk About the Law)</h3>
                            <p className="publication-meta">Chinese Publishing Inc. • 2023 • ISBN: 978-1-64695-308</p>
                            <p className="publication-excerpt">
                                The book is a concise yet insightful introduction to jurisprudence and legal studies. The book is divided into three parts —
                            </p>
                            <ul>
                                <li><strong>Part I: Legal Theories</strong> explores fundamental questions about the nature and purpose of law. Topics include the social origins of law, the rejection of anarchism and despotism, the effectiveness of legal systems, the principle of legal certainty, the debate between natural law theory and legal positivism, and an analysis of the concepts of legality and legitimacy.</li>
                                <li><strong>Part II: Constitutional Law and Constitutionalism</strong> examines the constitution as the “mother law,” introduces the principles of constitutionalism, and argues for the establishment of a constitutional litigation system to safeguard constitutional authority and protect citizens’ rights.</li>
                                <li><strong>Part III: Law and Society</strong> engages with pressing issues at the intersection of law and social life, including the debate over the abolition of the death penalty, the defense of property rights as essential to human dignity and economic development, and the moral rationale for lawyers representing unpopular clients.</li>
                            </ul>
                            <p>
                                Bridging theory and practice, <em>A Brief Talk About the Law</em> invites readers to think critically about the role of law in shaping a just and orderly society.
                            </p>
                            <p>
                                <a
                                    href="https://www.publishing.wang/product/%E6%B3%95%E5%BE%8B%E5%B0%8F%E8%B0%88"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="book-link"
                                >View on Publishing.wang</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="author-contact">
                <div className="section-content">
                    <h2>Contact</h2>
                    <div className="contact-info">
                        <p><strong>Email:</strong> <a href="mailto:richard.xu@virginia.edu">richard.xu@virginia.edu</a></p>
                        <p><strong>Academia.edu:</strong> <a href="https://mrrichard6.academia.edu/" target="_blank" rel="noopener noreferrer">Richard (Ruichong) Xu</a></p>
                        <p><strong>Personal Website:</strong> <a href="https://sites.google.com/view/richardrcxu-s-website/%E9%A6%96%E9%A1%B5" target="_blank" rel="noopener noreferrer">Richard Xu's Website</a></p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Richard;
