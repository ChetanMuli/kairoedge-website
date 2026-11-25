import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import CardImage from "../components/CardImage";
import { useSite } from "../context/SiteData";

export default function ServiceDetail() {
  const { slug } = useParams();
  const { services } = useSite();
  const service = services.find((item) => item.slug === slug);

  useEffect(() => {
    document.title = service ? `${service.title} · KairoEdge` : "Service · KairoEdge";
  }, [service]);

  if (!service) {
    return (
      <PageHero kicker="Services" title="That service is not on the list.">
        <Link className="text-link" to="/services">Back to services</Link>
      </PageHero>
    );
  }

  return (
    <>
      <PageHero kicker={`Service ${service.number}`} title={service.title} text={service.summary} />
      <section className="section">
        <div className="container detail-layout">
          <figure className="detail-visual">
            <CardImage src={service.image} alt={`${service.title} visual`} slugHint={service.slug} />
          </figure>
          <div className="detail-copy">
            <p>{service.description}</p>
            <h2>What changes</h2>
            <ul>
              {service.outcomes.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className="tag-row">
              {service.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <Link className="button button-light" to="/contact">Discuss this service</Link>
          </div>
        </div>
        </section>
    </>
  );
}
