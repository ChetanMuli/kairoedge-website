import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ContactForm from "../components/ContactForm";
import HeroLive from "../components/HeroLive";
import HorizontalScroll from "../components/HorizontalScroll";
import CardImage from "../components/CardImage";
import CredentialsMarquee from "../components/CredentialsMarquee";
import { useCopy, useSite } from "../context/SiteData";

export default function Home() {
  const { stats, services, industries, testimonials } = useSite();
  const copy = useCopy("home");

  useEffect(() => {
    document.title = "KairoEdge Technologies Pvt. Ltd.";
  }, []);

  return (
    <>
      <section className="hero page-hero">
        <div className="hero-lights" aria-hidden="true">
          <span className="hero-grid" />
          <span className="hero-aura" />
        </div>
        <div className="container hero-layout page-hero-inner">
          <div className="hero-content-col">
            <div className="hero-badge">
              <span className="hero-badge-pulse" />
              <span>{copy.kicker}</span>
            </div>
            <h1 className="hero-title">{copy.title}</h1>
            <p className="lead hero-lead">{copy.lead}</p>
            <div className="button-row">
              <Link className="button button-solid" to="/services">{copy.primaryButton}</Link>
              <a className="button" href="#contact-form">{copy.secondaryButton}</a>
            </div>
            <ul className="hero-trust">
              {copy.trust.map((item) => (
                <li key={item}>
                  <span className="hero-trust-check">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <HeroLive />
        </div>
      </section>

      {/* Enterprise Credentials & Ecosystem Marquee Ticker */}
      <CredentialsMarquee />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{copy.aboutKicker}</p>
            <h2>{copy.aboutTitle}</h2>
            <p className="lead">{copy.aboutLead}</p>
            <Link className="text-link" to="/about">{copy.aboutLink}</Link>
          </div>
          <div className="stats">
            {stats.map((stat) => (
              <article className="stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
          <div className="promise-grid">
            {copy.promises.map((item) => (
              <article className="promise-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <HorizontalScroll
        kicker={copy.servicesKicker}
        title={copy.servicesTitle}
        text={copy.servicesText}
        services={services}
      >
        {services.map((service) => (
          <Link className="media-card pin-card" to={`/services/${service.slug}`} key={service.slug}>
            <div className="media-visual">
              <CardImage src={service.image} alt={service.title} slugHint={service.slug} />
            </div>
            <div className="media-body">
              <small>{service.number} · {service.footer || "ENGINEERING"}</small>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <div className="tag-row">
                {service.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <div className="pin-card-cta">
                <span>View Practice & Deliverables →</span>
              </div>
            </div>
          </Link>
        ))}
      </HorizontalScroll>

      <section className="section">
        <div className="container">
          <div className="section-head split">
            <div>
              <p className="eyebrow">{copy.industriesKicker}</p>
              <h2>{copy.industriesTitle}</h2>
              <p className="lead">{copy.industriesLead}</p>
            </div>
            <Link className="text-link" to="/industries">{copy.industriesLink}</Link>
          </div>
          <div className="card-grid four industry-board">
            {industries.map((industry) => (
              <Link className="media-card compact industry-card" to={`/industries/${industry.slug}`} key={industry.slug}>
                <div className="media-visual short">
                  <CardImage src={industry.image} alt={industry.name} slugHint={industry.slug} />
                </div>
                <div className="media-body">
                  <h3>{industry.name}</h3>
                  <p>{industry.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{copy.clientsKicker}</p>
            <h2>{copy.clientsTitle}</h2>
          </div>
          <div className="card-grid three">
            {testimonials.map((item) => (
              <blockquote className="quote-card" key={item.attribution}>
                <p>{item.quote}</p>
                <footer>{item.attribution}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="contact-form">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{copy.contactKicker}</p>
            <h2>{copy.contactTitle}</h2>
            <p className="lead">{copy.contactLead}</p>
          </div>
          <div className="contact-layout">
            <ContactForm />
            <aside className="contact-aside">
              <h2>{copy.asideTitle}</h2>
              <a href={`mailto:${copy.asideEmail}`}>{copy.asideEmail}</a>
              <p>{copy.asidePlace}</p>
              <p>{copy.asideCompany}</p>
              <p>{copy.asideNote}</p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
