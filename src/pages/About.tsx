import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import SectionHeroCard from "../components/SectionHeroCard";
import MovableStats from "../components/MovableStats";
import { useSite, useCopy } from "../context/SiteData";

const DEFAULT_INDUSTRIES = [
  "Fintech & Banking",
  "Healthcare",
  "Education",
  "Retail & eCommerce",
  "Manufacturing",
  "Logistics",
  "Real Estate",
  "Government"
];

export default function About() {
  const site = useSite();
  const copy = useCopy("about");

  const statsList = useMemo(() => {
    if (Array.isArray(site?.stats) && site.stats.length > 0) {
      return site.stats;
    }
    return [
      { value: "24/7", label: "Monitoring and support for production systems" },
      { value: "99.9%", label: "Uptime target on managed cloud platforms" },
      { value: "2 weeks", label: "From kickoff to your first working release" },
      { value: "100%", label: "Source code and cloud accounts owned by you" }
    ];
  }, [site?.stats]);

  const industriesList = useMemo(() => {
    if (Array.isArray(site?.industries) && site.industries.length > 0) {
      return site.industries.map((ind: any) => ind.name || ind.title);
    }
    return DEFAULT_INDUSTRIES;
  }, [site?.industries]);

  return (
    <>
      <SEO
        title="About Us"
        description="An enterprise IT and cloud company headquartered in Pune with a regional branch in Ahilyanagar, Maharashtra."
      />

      {/* Page Header */}
      <div className="phero">
        <div className="wrap">
          <div className="phero-content">
            <nav className="crumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span>About</span>
            </nav>
            <h1>{copy?.title || "An IT company with engineering delivery across Maharashtra."}</h1>
            <p>{copy?.text || "KairoEdge Technologies is an enterprise IT company headquartered in Pune with a regional branch in Ahilyanagar, Maharashtra. We build and run custom software, cloud platforms, and AI systems."}</p>
          </div>
          <SectionHeroCard variant="about" />
        </div>
      </div>

      {/* About Section */}
      <section id="about">
        <div className="wrap ab">
          <div className="rv">
            <h2>{copy?.heading || "Engineering teams across Pune & Ahilyanagar"}</h2>
            <p className="mut" style={{ marginTop: "22px", maxWidth: "46ch" }}>
              {copy?.paragraph1 ||
                "KairoEdge Technologies Pvt. Ltd. is an enterprise IT and software engineering company. Headquartered in Pune with a regional branch in Ahilyanagar, Maharashtra, our engineers, architects, and cloud specialists work as one team to build software your organization can rely on."}
            </p>
            {copy?.paragraph2 && (
              <p className="mut" style={{ marginTop: "14px", maxWidth: "46ch" }}>
                {copy.paragraph2}
              </p>
            )}
            <Link className="btn" to="/contact" style={{ marginTop: "28px" }}>
              Talk to our team
            </Link>
          </div>

          <div className="vgrid">
            <article className="card rv">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                </svg>
              </div>
              <h3>We own the outcome</h3>
              <p className="mut">We plan around your business goal, not just a task list.</p>
            </article>

            <article className="card rv">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4" />
                </svg>
              </div>
              <h3>Plain talk, no surprises</h3>
              <p className="mut">Fixed scope, weekly demos and honest status updates.</p>
            </article>

            <article className="card rv">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12M8.2 13.9 7 23l5-3 5 3-1.2-9.1" />
                </svg>
              </div>
              <h3>Craft over shortcuts</h3>
              <p className="mut">Clean code, automated tests and secure defaults on every project.</p>
            </article>

            <article className="card rv">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM20 17v4H6.5A2.5 2.5 0 0 1 4 18.5" />
                </svg>
              </div>
              <h3>Always learning</h3>
              <p className="mut">Regular training keeps our team current on cloud, security and AI.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Stats Numbers - Movable & Animated */}
      <MovableStats statsList={statsList} />

      {/* Industries */}
      <section id="industries">
        <div className="wrap">
          <div className="head rv">
            <h2>Built for the way your industry works</h2>
            <p className="mut">We bring domain knowledge to every project so you spend less time explaining and more time shipping.</p>
          </div>
          <div className="ind rv">
            {industriesList.map((indName: string, idx: number) => (
              <span key={idx}>{indName}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="cta2">
        <div className="wrap">
          <div className="band rv">
            <div>
              <h3>Want to work with us?</h3>
              <p className="mut">Start a project with our team, or join us and build products for real clients.</p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link className="btn pri" to="/contact">
                Let's talk
              </Link>
              <Link className="btn" to="/careers">
                View careers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
