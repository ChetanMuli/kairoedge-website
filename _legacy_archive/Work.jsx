import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import CardImage from "../components/CardImage";
import { useCopy, useSite } from "../context/SiteData";

export default function Work() {
  const { projects } = useSite();
  const copy = useCopy("work");

  useEffect(() => {
    document.title = "Work · KairoEdge Technologies";
  }, []);

  return (
    <>
      <PageHero
        kicker={copy.kicker}
        title={copy.title}
        text={copy.text}
      />
      <section className="section">
        <div className="container card-grid two">
          {projects.map((project) => (
            <Link className="media-card project-card" to={`/work/${project.slug}`} key={project.slug}>
              <div className="media-visual tall">
                <CardImage src={project.image} alt={project.title} slugHint={project.slug} />
                <span>{project.category}</span>
              </div>
              <div className="media-body">
                <small>{project.label}</small>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                {project.result && (
                  <div className="project-outcome-pill">
                    <strong>Impact:</strong> <span>{project.result}</span>
                  </div>
                )}
                <div className="card-action-bar">
                  <span>View Case Study &amp; Architecture →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
