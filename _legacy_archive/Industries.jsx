import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import CardImage from "../components/CardImage";
import { useCopy, useSite } from "../context/SiteData";

export default function Industries() {
  const { industries } = useSite();
  const copy = useCopy("industries");

  useEffect(() => {
    document.title = "Industries · KairoEdge Technologies";
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
          {industries.map((industry) => (
            <Link className="media-card" to={`/industries/${industry.slug}`} key={industry.slug}>
              <div className="media-visual">
                <CardImage src={industry.image} alt={industry.name} slugHint={industry.slug} />
              </div>
              <div className="media-body">
                <h3>{industry.name}</h3>
                <p>{industry.summary}</p>
                <div className="card-action-bar">
                  <span>View Industry Solutions →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
