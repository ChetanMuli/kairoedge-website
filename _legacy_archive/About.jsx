import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import CardImage from "../components/CardImage";
import { useCopy, useSite } from "../context/SiteData";

export default function About() {
  const { principles, team, stats } = useSite();
  const copy = useCopy("about");

  useEffect(() => {
    document.title = "About · KairoEdge Technologies";
  }, []);

  return (
    <>
      <PageHero
        kicker={copy.kicker}
        title={copy.title}
        text={copy.text}
      />
      <section className="section">
        <div className="container prose-grid">
          <div>
            <h2>{copy.heading}</h2>
            <p>{copy.paragraph1}</p>
            <p>{copy.paragraph2}</p>
          </div>
          <div className="stats stacked">
            {stats.map((stat) => (
              <article className="stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-tight">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{copy.rulesKicker}</p>
            <h2>{copy.rulesTitle}</h2>
          </div>
          <div className="card-grid two">
            {principles.map((item) => (
              <article className="text-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head split">
            <div>
              <p className="eyebrow">{copy.teamKicker}</p>
              <h2>{copy.teamTitle}</h2>
            </div>
            <Link className="text-link" to="/careers">{copy.teamLink}</Link>
          </div>
          <div className="card-grid four">
            {team.map((member) => (
              <article className="media-card compact" key={member.role}>
                <div className="media-visual short">
                  <CardImage src={member.image} alt={member.role} />
                </div>
                <div className="media-body">
                  <h3>{member.role}</h3>
                  <p>{member.focus}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
