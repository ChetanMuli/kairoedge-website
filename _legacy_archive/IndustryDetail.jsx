import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import CardImage from "../components/CardImage";
import { useSite } from "../context/SiteData";

export default function IndustryDetail() {
  const { slug } = useParams();
  const { industries } = useSite();
  const industry = industries.find((item) => item.slug === slug);

  useEffect(() => {
    document.title = industry ? `${industry.name} · KairoEdge` : "Industries · KairoEdge";
  }, [industry]);

  if (!industry) {
    return (
      <PageHero kicker="Industries" title="That industry page is not available.">
        <Link className="text-link" to="/industries">All industries</Link>
      </PageHero>
    );
  }

  return (
    <>
      <PageHero kicker="Industry" title={industry.name} text={industry.summary} />
      <section className="section">
        <div className="container detail-layout">
          <figure className="detail-visual">
            <CardImage src={industry.image} alt={`${industry.name} visual`} slugHint={industry.slug} />
          </figure>
          <div className="detail-copy">
            <p>{industry.description}</p>
            <h2>Where we usually start</h2>
            <ul>
              {industry.focus.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <Link className="button button-light" to="/contact">Talk about {industry.name}</Link>
          </div>
        </div>
        </section>
    </>
  );
}
