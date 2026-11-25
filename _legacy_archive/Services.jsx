import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import CardImage from "../components/CardImage";
import { useCopy, useSite } from "../context/SiteData";

export default function Services() {
  const { services } = useSite();
  const copy = useCopy("services");

  useEffect(() => {
    document.title = "Services · KairoEdge Technologies";
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
          {services.map((service) => (
            <Link className="media-card" to={`/services/${service.slug}`} key={service.slug}>
              <div className="media-visual">
                <CardImage src={service.image} alt={service.title} slugHint={service.slug} />
              </div>
              <div className="media-body">
                <small>{service.number} · {service.footer}</small>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <div className="tag-row">
                  {service.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="card-action-bar">
                  <span>Explore Practice &amp; Deliverables →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
