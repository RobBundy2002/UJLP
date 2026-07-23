import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ParticleBackground from '../Components/ParticleBackground';
import { articles, getIssueLabel, researchAreas } from '../Data/journalData';

function ResearchArea() {
    const { slug } = useParams();
    const area = researchAreas[slug];
    if (!area) return <Navigate to="/journal" replace />;
    const areaArticles = articles.filter(article => article.researchSlug === slug);

    return <div className="research-area-page jh-page fade-in">
        <section className="research-area-hero"><ParticleBackground /><div className="section-content">
            <p>Research field · {String(areaArticles.length).padStart(2, '0')} published works</p><h1>{area.name}</h1><span>{area.kicker}</span>
        </div></section>
        <section className="research-area-intro"><div className="section-content">
            <p>Field notes</p><h2>Questions shaping<br /><em>the conversation.</em></h2>
            <div><p>{area.statement}</p><ul>{area.relatedTopics.map(topic => <li key={topic}>{topic}</li>)}</ul></div>
        </div></section>
        <section className="research-area-works"><div className="section-content">
            <div className="research-area-heading"><span>Published in this field</span><Link to="/journal/index">Complete index →</Link></div>
            {areaArticles.map((article, index) => <article key={article.pageLink}>
                <span>{String(index + 1).padStart(2, '0')}</span><div><small>{getIssueLabel(article.issue)} · {article.date}</small><h2><Link to={article.pageLink}>{article.title}</Link></h2><p>By <Link to={article.authorLink}>{article.author}</Link></p></div>
            </article>)}
        </div></section>
    </div>;
}

export default ResearchArea;
