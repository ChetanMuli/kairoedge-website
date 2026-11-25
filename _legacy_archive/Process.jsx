import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useCopy, useSite } from "../context/SiteData";

export default function Process() {
  const { process: steps } = useSite();
  const copy = useCopy("process");

  useEffect(() => {
    document.title = "Process · KairoEdge Technologies";
  }, []);

  return (
    <>
      <PageHero
        kicker={copy.kicker}
        title={copy.title}
        text={copy.text}
      />
      <section className="section">
        <div className="container process-list">
          {steps.map((step) => (
            <article className="process-row" key={step.number}>
              <span>{step.number}</span>
              <div>
                <h2>{step.title}</h2>
                <p>{step.summary}</p>
                <p>{step.details}</p>
              </div>
            </article>
          ))}
          <Link className="button button-light process-cta" to="/contact">{copy.button}</Link>
        </div>
      </section>
    </>
  );
}
