import React, { useEffect, useState } from 'react';

export function PrintingPressIntro() {
    const phrase = 'Ideas that move the world.';
    const keys = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M'];
    const [activeKey, setActiveKey] = useState('');

    useEffect(() => {
        let interval;
        let index = 0;
        const start = window.setTimeout(() => {
            interval = window.setInterval(() => {
                const character = phrase[index];
                setActiveKey(character === ' ' ? 'SPACE' : character?.toUpperCase() || '');
                index += 1;
                if (index >= phrase.length) {
                    window.clearInterval(interval);
                    window.setTimeout(() => setActiveKey(''), 90);
                }
            }, 85);
        }, 1200);

        return () => {
            window.clearTimeout(start);
            window.clearInterval(interval);
        };
    }, []);

    return <div className="printing-press-intro" aria-hidden="true">
        <div className="workstation-atmosphere" />
        <div className="editorial-workstation">
            <div className="workstation-monitor">
                <span className="monitor-camera" />
                <div className="monitor-screen">
                    <div className="screen-toolbar"><i /><i /><i /><span>UJLP_EDITORIAL_DESK — PUBLISHING</span><b>● LIVE</b></div>
                    <div className="screen-document">
                        <div className="screen-margin"><span>01</span><span>02</span><span>03</span><span>04</span><span>05</span></div>
                        <div className="screen-copy">
                            <small>UNIVERSITY OF VIRGINIA · EST. 2024</small>
                            <strong>UJLP</strong>
                            <div className="screen-typed-line"><span>Ideas that move the world.</span><i /></div>
                            <p>THE UNDERGRADUATE JOURNAL<br />OF LAW &amp; POLITICS</p>
                            <div className="screen-status"><span>ISSUE 02 / 2026</span><span>READY TO PUBLISH</span></div>
                        </div>
                    </div>
                    <span className="screen-scan" />
                </div>
                <div className="monitor-chin"><span>UJLP</span><i /></div>
            </div>
            <div className="monitor-stand"><span /><i /></div>
            <div className="workstation-desk">
                <div className="workstation-keyboard">
                    <div className="keyboard-status"><span>EDITORIAL / ONLINE</span><i /></div>
                    <div className="workstation-keys">
                        {keys.map(key => <span className={activeKey === key ? 'active' : ''} key={key}>{key}</span>)}
                    </div>
                    <div className={`workstation-spacebar ${activeKey === 'SPACE' ? 'active' : ''}`} />
                </div>
                <div className="workstation-mouse"><span /><i /></div>
                <div className="workstation-notecard"><small>NEXT EDITION</small><strong>Write.<br />Edit.<br />Publish.</strong><i /></div>
            </div>
        </div>
        <div className="workstation-progress"><span /></div>
    </div>;
}

export function AnimatedJournalSeal() {
    return <div className="animated-journal-seal" aria-label="Undergraduate Journal of Law and Politics seal">
        <div className="seal-graphic">
            <span className="seal-aura" aria-hidden="true" />
            <span className="seal-orbit seal-orbit-one" aria-hidden="true" />
            <span className="seal-orbit seal-orbit-two" aria-hidden="true" />
            <span className="seal-crosshair" aria-hidden="true" />
            <div className="seal-center">
                <small>University of Virginia</small>
                <strong>UJLP</strong>
                <span aria-hidden="true">◆</span>
                <em>Law · Politics · 2024</em>
            </div>
            <span className="seal-engraving seal-engraving-top">UNDERGRADUATE JOURNAL</span>
            <span className="seal-engraving seal-engraving-bottom">CHARLOTTESVILLE · VIRGINIA</span>
        </div>
        <div className="seal-companion">
            <span>Our editorial imprint</span>
            <h3>Rigorous work,<br /><em>distinctly ours.</em></h3>
            <p>The seal marks scholarship shaped by undergraduate curiosity, careful editing, and consequential legal questions.</p>
            <i aria-hidden="true" />
        </div>
    </div>;
}
