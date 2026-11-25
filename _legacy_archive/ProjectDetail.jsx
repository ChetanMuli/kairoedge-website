import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import CardImage from "../components/CardImage";
import { useSite } from "../context/SiteData";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { projects, industries, services } = useSite();
  const project = projects.find((item) => item.slug === slug);
  const industry = industries.find((item) => item.slug === project?.industry);

  useEffect(() => {
    document.title = project ? `${project.title} · KairoEdge` : "Work · KairoEdge";
  }, [project]);

  if (!project) {
    return (
      <PageHero kicker="Work" title="That case study is not published.">
        <Link className="text-link" to="/work">Back to work</Link>
      </PageHero>
    );
  }

  const used = services.filter((service) => project.services?.includes(service.slug));

  return (
    <>
      <PageHero kicker={project.category} title={project.title} text={project.summary} />
      <section className="section">
        <div className="container">
          <figure className="detail-visual wide">
            <CardImage src={project.image} alt={`${project.title} product visual`} slugHint={project.slug} />
          </figure>
          <dl className="project-facts">
            <div>
              <dt>Engagement</dt>
              <dd>{project.category}</dd>
            </div>
            <div>
              <dt>Industry</dt>
              <dd>{industry ? industry.name : "Client operations"}</dd>
            </div>
            <div>
              <dt>What changed</dt>
              <dd>{project.result}</dd>
            </div>
          </dl>
          <div className="story-grid">
            <article>
              <h2>The situation</h2>
              <p>{project.description}</p>
            </article>
            <article>
              <h2>The constraint</h2>
              <p>{project.challenge}</p>
            </article>
            <article>
              <h2>What we built</h2>
              <p>{project.solution}</p>
            </article>
            <article>
              <h2>The result</h2>
              <p>{project.result}</p>
            </article>
          </div>
          <div className="meta-row">
            {industry && <Link to={`/industries/${industry.slug}`}>{industry.name}</Link>}
            {used.map((service) => (
              <Link key={service.slug} to={`/services/${service.slug}`}>{service.title}</Link>
            ))}
          </div>
          <Link className="button button-light" to="/contact">Start a similar project</Link>
        </div>
      </section>
    </>
  );
}
