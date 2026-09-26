import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ParticleBackground from '../Components/ParticleBackground';
import { articles, getIssueLabel, researchAreas } from '../Data/journalData';

function ResearchArea() {
    const { slug } = useParams();
    const area = researchAreas[slug];
    if (!area) return <Navigate to="/journal" replace />;
    const areaArticles = articles.filter(article => article.researchSlug === slug);
    const workflow = area.workflow || [];
    const topicDetails = area.topicDetails || area.relatedTopics.map(topic => ({ title: topic, detail: area.statement }));

    return <div className="research-area-page jh-page fade-in">
        <section className="research-area-hero"><ParticleBackground /><div className="section-content">
            <p>Research field · {String(areaArticles.length).padStart(2, '0')} published works</p><h1>{area.name}</h1><span>{area.kicker}</span>
        </div></section>
        <section className="research-area-intro"><div className="section-content">
            <p>Field notes</p>
            <div className="research-area-title-block">
                <h2>Questions shaping<br /><em>the conversation.</em></h2>
                <p>{area.statement}</p>
            </div>
            <div className="research-area-field-brief">
                <div className="research-area-compass" aria-hidden="true">
                    <span>{area.name}</span>
                    <strong>{String(areaArticles.length).padStart(2, '0')}</strong>
                    <small>published works</small>
                </div>
                <div className="research-area-brief-copy">
                    <span>{area.axis}</span>
                    <p>{area.signal}</p>
                    <ul>{area.relatedTopics.map(topic => <li key={topic}>{topic}</li>)}</ul>
                </div>
            </div>
        </div></section>
        <section className="research-area-workflow-section"><div className="section-content">
            <div className="research-area-heading"><span>Research workflow</span><Link to="/journal/index">Back to field index →</Link></div>
            <ol className="research-workflow-track">
                {workflow.map((step, index) => (
                    <li key={step.label}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <strong>{step.label}</strong>
                        <p>{step.description}</p>
                    </li>
                ))}
            </ol>
        </div></section>
        <section className="research-area-topics"><div className="section-content">
            <div className="research-area-heading"><span>Topic map</span><span>{topicDetails.length} active questions</span></div>
            <div className="research-topic-grid">
                {topicDetails.map((topic, index) => (
                    <article key={topic.title}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <h2>{topic.title}</h2>
                        <p>{topic.detail}</p>
                    </article>
                ))}
            </div>
        </div></section>
        <section className="research-area-works"><div className="section-content">
            <div className="research-area-heading"><span>Published in this field</span><Link to="/journal/index">Complete index →</Link></div>
            {areaArticles.map((article, index) => <article key={article.pageLink}>
                <Link className="research-area-work-hitbox" to={article.pageLink} aria-label={`Read ${article.title}`} />
                <span>{String(index + 1).padStart(2, '0')}</span><div><small>{getIssueLabel(article.issue)} · {article.date}</small><h2><Link to={article.pageLink}>{article.title}</Link></h2><p>By <Link to={article.authorLink}>{article.author}</Link></p></div>
            </article>)}
            {!areaArticles.length && <p className="research-area-empty">No published work is attached to this field yet.</p>}
        </div></section>
    </div>;
}

export default ResearchArea;
