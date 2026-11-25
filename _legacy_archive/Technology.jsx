import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useCopy, useSite } from "../context/SiteData";

export default function Technology() {
  const { technologies, architecture } = useSite();
  const copy = useCopy("technology");

  const distinctGroups = [...new Set((technologies || []).map((item) => item.category))].filter(Boolean);
  const groups = distinctGroups.length > 0 ? distinctGroups : ["Cloud", "Product", "Data", "Security"];

  useEffect(() => {
    document.title = "Technology · KairoEdge Technologies";
  }, []);

  return (
    <>
      <PageHero
        kicker={copy.kicker}
        title={copy.title}
        text={copy.text}
      />
      <section className="section">
        <div className="container">
          <div className="stack-groups">
            {groups.map((group) => (
              <article key={group}>
                <h2>{group}</h2>
                <ul>
                  {(technologies || [])
                    .filter((item) => item.category === group)
                    .map((item) => (
                      <li key={item.name}>{item.name}</li>
                    ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="card-grid four arch-grid">
            {(architecture || []).map((item) => (
              <article className="text-card" key={item.title}>
                <small>{item.number}</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <Link className="text-link" to="/process">{copy.link}</Link>
        </div>
      </section>
    </>
  );
}
