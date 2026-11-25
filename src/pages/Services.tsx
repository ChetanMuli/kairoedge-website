import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import TechTiles from "../components/TechTiles";
import SectionHeroCard from "../components/SectionHeroCard";
import { useSite, useCopy } from "../context/SiteData";

const SERVICE_ICONS: Record<string, string> = {
  cloud: "M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z",
  web: "m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14",
  custom: "m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14",
  mobile: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2",
  ai: "M12 3v3M12 18v3M3 12h3M18 12h3M9 7h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z",
  security: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4",
  design: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  data: "M12 20V10M18 20V4M6 20v-4"
};

const ACCENT_COLORS = ["#3B82F6", "#8B5CF6", "#14B8A6", "#EC4899", "#22C55E", "#F59E0B"];

function getServiceIcon(title: string, slug?: string): string {
  const text = `${title} ${slug || ""}`.toLowerCase();
  if (/cloud|devops|infra|aws/i.test(text)) return SERVICE_ICONS.cloud;
  if (/ai|automation|ml/i.test(text)) return SERVICE_ICONS.ai;
  if (/mobile|app|flutter|ios/i.test(text)) return SERVICE_ICONS.mobile;
  if (/security|compliance|cyber/i.test(text)) return SERVICE_ICONS.security;
  if (/design|ui|ux/i.test(text)) return SERVICE_ICONS.design;
  if (/data|analytics|bi|sql/i.test(text)) return SERVICE_ICONS.data;
  return SERVICE_ICONS.custom;
}

const DEFAULT_SERVICES = [
  {
    title: "Cloud & DevOps",
    summary: "Move to AWS without downtime, automate releases and keep cloud costs under control.",
    outcomes: ["Zero-downtime migration to AWS", "Automated CI/CD pipelines", "Monitoring and cost alerts"],
    color: "#3B82F6"
  },
  {
    title: "Custom software",
    summary: "Web platforms, APIs and internal tools shaped around how your team works.",
    outcomes: ["Web platforms and customer portals", "APIs and system integrations", "Internal tools and dashboards"],
    color: "#8B5CF6"
  },
  {
    title: "Mobile apps",
    summary: "Fast Android and iOS apps your customers keep on their home screen.",
    outcomes: ["Android and iOS from one codebase", "Secure login and push notifications", "App store release support"],
    color: "#14B8A6"
  },
  {
    title: "AI & automation",
    summary: "Assistants and automation that remove repetitive work from your team.",
    outcomes: ["Chat assistants on your documents", "Document and data processing", "Workflow automation"],
    color: "#EC4899"
  },
  {
    title: "Security & compliance",
    summary: "Keep your data and your customers' trust safe with practical, ongoing protection.",
    outcomes: ["Access control and secure defaults", "Backups and recovery plans", "Audits and compliance checks"],
    color: "#22C55E"
  },
  {
    title: "UI/UX design",
    summary: "Research-led interfaces that people find easy to use and your developers can build.",
    outcomes: ["User research and wireframes", "Clickable prototypes", "Design systems and handoff"],
    color: "#F59E0B"
  }
];

const DEFAULT_STEPS = [
  { step: "Step 1", title: "Discover", summary: "We learn your goals, users and constraints, then agree on scope and success measures." },
  { step: "Step 2", title: "Design", summary: "Wireframes and clickable prototypes you can test with real users before we write code." },
  { step: "Step 3", title: "Build", summary: "Two-week sprints with a live demo at the end of each one and automated testing throughout." },
  { step: "Step 4", title: "Launch & run", summary: "Zero-downtime release, monitoring and a support team on call after go-live." }
];

export default function Services() {
  const site = useSite();
  const copy = useCopy("services");

  const servicesList = useMemo(() => {
    if (Array.isArray(site?.services) && site.services.length > 0) {
      return site.services.map((svc: any, idx: number) => {
        let outcomes: string[] = [];
        if (Array.isArray(svc.outcomes) && svc.outcomes.length > 0) {
          outcomes = svc.outcomes;
        } else if (Array.isArray(svc.tags) && svc.tags.length > 0) {
          outcomes = svc.tags;
        } else {
          outcomes = ["Production-ready engineering", "Clean architecture and tests", "Continuous support and handover"];
        }
        return {
          title: svc.title,
          summary: svc.summary || svc.description || "",
          outcomes,
          color: ACCENT_COLORS[idx % ACCENT_COLORS.length],
          iconPath: getServiceIcon(svc.title, svc.slug)
        };
      });
    }
    return DEFAULT_SERVICES.map((s, idx) => ({
      ...s,
      iconPath: getServiceIcon(s.title)
    }));
  }, [site?.services]);

  const processSteps = useMemo(() => {
    if (Array.isArray(site?.process) && site.process.length > 0) {
      return site.process.map((step: any, idx: number) => ({
        step: `Step ${idx + 1}`,
        title: step.title,
        summary: step.summary || step.details || ""
      }));
    }
    return DEFAULT_STEPS;
  }, [site?.process]);

  return (
    <>
      <SEO
        title="Services"
        description="Web, mobile, cloud, AI and design under one roof, delivered by one accountable team."
      />

      {/* Page Header */}
      <div className="phero">
        <div className="wrap">
          <div className="phero-content">
            <nav className="crumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span>Services</span>
            </nav>
            <h1>{copy?.title || "Our services"}</h1>
            <p>{copy?.text || "Web, mobile, cloud, AI and design under one roof, delivered by one accountable team."}</p>
          </div>
          <SectionHeroCard variant="services" />
        </div>
      </div>

      {/* Services Grid */}
      <section id="services">
        <div className="wrap">
          <div className="head rv">
            <h2>Everything your product needs, under one roof</h2>
            <p className="mut">From the first wireframe to 24/7 production support, one team owns the outcome.</p>
          </div>

          <div className="svc">
            {servicesList.map((svc) => (
              <article key={svc.title} className="card rv" style={{ ["--ac" as any]: svc.color }}>
                <svg className="wm" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d={svc.iconPath} />
                </svg>
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={svc.iconPath} />
                  </svg>
                </div>
                <h3>{svc.title}</h3>
                <p className="mut">{svc.summary}</p>
                <ul className="dl">
                  {svc.outcomes.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <Link className="lk" to={`/contact?type=${encodeURIComponent(svc.title)}&role=${encodeURIComponent(svc.title)}`}>
                  Discuss this service <span aria-hidden="true">&rarr;</span>
                </Link>
              </article>
            ))}
          </div>

          <div className="head rv" style={{ margin: "72px 0 28px" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)", maxWidth: "22ch" }}>
              Choose how we work with you
            </h2>
            <p className="mut">Start small or build a long-term partnership. You can switch models as you grow.</p>
          </div>

          <div className="eng">
            <article className="card rv" style={{ ["--ac" as any]: "var(--blue)" }}>
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                </svg>
              </div>
              <h3>Fixed-scope project</h3>
              <p className="mut">A defined scope, timeline and fixed quote. Best for new products, migrations and redesigns.</p>
            </article>

            <article className="card rv" style={{ ["--ac" as any]: "var(--blue)" }}>
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
                </svg>
              </div>
              <h3>Dedicated team</h3>
              <p className="mut">Engineers and designers who work as an extension of your team, on a simple monthly plan.</p>
            </article>

            <article className="card rv" style={{ ["--ac" as any]: "var(--blue)" }}>
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
                </svg>
              </div>
              <h3>Support and maintenance</h3>
              <p className="mut">Monitoring, updates and on-call help that keep your live systems fast and secure.</p>
            </article>
          </div>

          <div className="band rv">
            <div>
              <h3>Not sure where to start?</h3>
              <p className="mut">Tell us the problem. We will suggest a plan and a rough budget within two working days.</p>
            </div>
            <Link className="btn pri" to="/contact">
              Talk to an engineer
            </Link>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section id="process">
        <div className="wrap">
          <div className="head rv">
            <h2>A clear path from idea to launch</h2>
            <p className="mut">Short sprints, weekly demos and no surprises on scope or cost.</p>
          </div>
          <div className="steps rv">
            {processSteps.map((s, idx) => (
              <div key={idx} className="step">
                <span>{s.step}</span>
                <h3>{s.title}</h3>
                <p className="mut">{s.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section id="stack">
        <div className="wrap">
          <div className="head rv">
            <h2>Tools we use every day</h2>
            <p className="mut">Proven, well-supported technology that your team can maintain for years.</p>
          </div>
          <TechTiles />
        </div>
      </section>
    </>
  );
}
