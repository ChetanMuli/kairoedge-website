import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import SEO from "../components/SEO";
import NetworkCanvas from "../components/NetworkCanvas";
import HeroCard from "../components/HeroCard";
import TechTiles from "../components/TechTiles";
import SearchableSelect from "../components/SearchableSelect";
import MovableStats from "../components/MovableStats";
import { useSite, useCopy } from "../context/SiteData";

const HOME_SERVICES = [
  "Cloud & DevOps",
  "Custom software",
  "Website Development",
  "Mobile apps",
  "AI & automation",
  "Security & compliance",
  "UI/UX design",
  "Something else"
];

export default function Home() {
  const site = useSite();
  const copy = useCopy("home");

  const serviceOptions = useMemo(() => {
    if (Array.isArray(site?.services) && site.services.length > 0) {
      const dbTitles = site.services.map((s: any) => s.title);
      return Array.from(new Set([...dbTitles, "Something else"]));
    }
    return HOME_SERVICES;
  }, [site?.services]);

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

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactInterest, setContactInterest] = useState("Cloud & DevOps");
  const [contactMessage, setContactMessage] = useState("");
  const [contactHoneypot, setContactHoneypot] = useState("");
  const [contactError, setContactError] = useState("");
  const [contactSuccess, setContactSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${sectionId}`);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError("");
    setContactSuccess("");

    if (contactHoneypot) return;

    if (!contactName.trim()) {
      setContactError("Please enter your name.");
      return;
    }

    if (!contactPhone.trim() || contactPhone.trim().length < 8) {
      setContactError("Please enter your mobile / phone number (mandatory).");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(contactEmail)) {
      setContactError("Please enter a valid work email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: contactName.trim(),
        email: contactEmail.trim(),
        phone: contactPhone.trim(),
        service: contactInterest,
        interest: contactInterest,
        message: contactMessage.trim() || `Consultation request for ${contactInterest}.`
      };

      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => null);

      setContactSuccess("Thanks. We have your message and will reply within two working days.");
      setContactName("");
      setContactPhone("");
      setContactEmail("");
      setContactMessage("");
    } catch {
      setContactError("Sorry, we could not send your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO isHome />

      {/* =========================================================================
         1. HERO SECTION
         ========================================================================= */}
      <div className="hero" id="hero">
        <NetworkCanvas />
        <div className="edge" />
        <div className="wrap">
          <div className="hl">
            <div className="hero-kicker-group">
              <div className="hero-tagline-badge">
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
                <Sparkles size={13} className="hero-tagline-icon" />
                <span>YOUR BUSINESS, OUR TECHNOLOGY</span>
              </div>
            </div>
            <h1>
              <span><i>Build the</i></span>
              <span><i>right thing,</i></span>
              <span><i>right on time.</i></span>
            </h1>
            <p className="lead">
              We design, engineer, and run high-performance cloud platforms, custom enterprise software, mobile apps, and intelligent AI automation. Reliable delivery teams headquartered in Pune with regional operations in Ahilyanagar, Maharashtra.
            </p>
            <div className="cta">
              <Link className="btn pri" to="/contact">
                Book a consultation
              </Link>
              <a className="btn" href="#services" onClick={(e) => scrollToSection(e, "services")}>
                See what we build
              </a>
            </div>
          </div>
          <HeroCard />
        </div>
      </div>

      {/* =========================================================================
         2. MARQUEE TICKER
         ========================================================================= */}
      <div className="mq" aria-hidden="true">
        <div>
          <span>Cloud Migration</span>
          <span>Custom Software</span>
          <span>DevOps</span>
          <span>Mobile Apps</span>
          <span>AI &amp; Automation</span>
          <span>Cybersecurity</span>
          <span>Data Engineering</span>
          <span>UI/UX Design</span>
          <span>Cloud Migration</span>
          <span>Custom Software</span>
          <span>DevOps</span>
          <span>Mobile Apps</span>
          <span>AI &amp; Automation</span>
          <span>Cybersecurity</span>
          <span>Data Engineering</span>
          <span>UI/UX Design</span>
        </div>
      </div>

      {/* =========================================================================
         3. ABOUT SECTION
         ========================================================================= */}
      <section id="about">
        <div className="wrap ab">
          <div className="rv">
            <h2>An IT company with engineering delivery across Maharashtra</h2>
            <p className="mut" style={{ marginTop: "22px", maxWidth: "46ch" }}>
              KairoEdge Technologies Pvt. Ltd. is an information technology and cloud engineering company with its headquarters in Pune and a regional branch in Ahilyanagar, Maharashtra. Our engineers, architects, and cloud specialists work as one team, so you deal directly with the engineers building your systems.
            </p>
            <a className="btn" href="#contact" style={{ marginTop: "28px" }} onClick={(e) => scrollToSection(e, "contact")}>
              Talk to our team
            </a>
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

      {/* =========================================================================
         4. SERVICES SHOWCASE + ENGAGEMENT MODELS
         ========================================================================= */}
      <section id="services">
        <div className="wrap">
          <div className="head rv">
            <h2>Everything your product needs, under one roof</h2>
            <p className="mut">From the first wireframe to 24/7 production support, one team owns the outcome.</p>
          </div>
          <div className="svc">
            <article className="card rv" style={{ ["--ac" as any]: "#3B82F6" }}>
              <svg className="wm" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z" />
              </svg>
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z" />
                </svg>
              </div>
              <h3>Cloud &amp; DevOps</h3>
              <p className="mut">Move to AWS without downtime, automate releases and keep cloud costs under control.</p>
              <ul className="dl">
                <li>Zero-downtime migration to AWS</li>
                <li>Automated CI/CD pipelines</li>
                <li>Monitoring and cost alerts</li>
              </ul>
              <a
                className="lk"
                href="#contact"
                onClick={() => {
                  setContactInterest("Cloud & DevOps");
                  setContactMessage("I am interested in: Cloud & DevOps.\n");
                }}
              >
                Discuss this service <span aria-hidden="true">&rarr;</span>
              </a>
            </article>

            <article className="card rv" style={{ ["--ac" as any]: "#8B5CF6" }}>
              <svg className="wm" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14" />
              </svg>
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14" />
                </svg>
              </div>
              <h3>Custom software</h3>
              <p className="mut">Web platforms, APIs and internal tools shaped around how your team works.</p>
              <ul className="dl">
                <li>Web platforms and customer portals</li>
                <li>APIs and system integrations</li>
                <li>Internal tools and dashboards</li>
              </ul>
              <a
                className="lk"
                href="#contact"
                onClick={() => {
                  setContactInterest("Custom software");
                  setContactMessage("I am interested in: Custom software.\n");
                }}
              >
                Discuss this service <span aria-hidden="true">&rarr;</span>
              </a>
            </article>

            <article className="card rv" style={{ ["--ac" as any]: "#14B8A6" }}>
              <svg className="wm" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2" />
              </svg>
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2" />
                </svg>
              </div>
              <h3>Mobile apps</h3>
              <p className="mut">Fast Android and iOS apps your customers keep on their home screen.</p>
              <ul className="dl">
                <li>Android and iOS from one codebase</li>
                <li>Secure login and push notifications</li>
                <li>App store release support</li>
              </ul>
              <a
                className="lk"
                href="#contact"
                onClick={() => {
                  setContactInterest("Mobile app");
                  setContactMessage("I am interested in: Mobile apps.\n");
                }}
              >
                Discuss this service <span aria-hidden="true">&rarr;</span>
              </a>
            </article>

            <article className="card rv" style={{ ["--ac" as any]: "#EC4899" }}>
              <svg className="wm" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3M9 7h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
              </svg>
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3M9 7h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
                </svg>
              </div>
              <h3>AI &amp; automation</h3>
              <p className="mut">Assistants and automation that remove repetitive work from your team.</p>
              <ul className="dl">
                <li>Chat assistants on your documents</li>
                <li>Document and data processing</li>
                <li>Workflow automation</li>
              </ul>
              <a
                className="lk"
                href="#contact"
                onClick={() => {
                  setContactInterest("AI & automation");
                  setContactMessage("I am interested in: AI & automation.\n");
                }}
              >
                Discuss this service <span aria-hidden="true">&rarr;</span>
              </a>
            </article>

            <article className="card rv" style={{ ["--ac" as any]: "#22C55E" }}>
              <svg className="wm" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4" />
              </svg>
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4" />
                </svg>
              </div>
              <h3>Security &amp; compliance</h3>
              <p className="mut">Keep your data and your customers' trust safe with practical, ongoing protection.</p>
              <ul className="dl">
                <li>Access control and secure defaults</li>
                <li>Backups and recovery plans</li>
                <li>Audits and compliance checks</li>
              </ul>
              <a
                className="lk"
                href="#contact"
                onClick={() => {
                  setContactInterest("Something else");
                  setContactMessage("I am interested in: Security & compliance.\n");
                }}
              >
                Discuss this service <span aria-hidden="true">&rarr;</span>
              </a>
            </article>

            <article className="card rv" style={{ ["--ac" as any]: "#F59E0B" }}>
              <svg className="wm" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
              </svg>
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                </svg>
              </div>
              <h3>UI/UX design</h3>
              <p className="mut">Research-led interfaces that people find easy to use and your developers can build.</p>
              <ul className="dl">
                <li>User research and wireframes</li>
                <li>Clickable prototypes</li>
                <li>Design systems and handoff</li>
              </ul>
              <a
                className="lk"
                href="#contact"
                onClick={() => {
                  setContactInterest("Something else");
                  setContactMessage("I am interested in: UI/UX design.\n");
                }}
              >
                Discuss this service <span aria-hidden="true">&rarr;</span>
              </a>
            </article>
          </div>

          <div style={{ textAlign: "center", marginTop: "32px", marginBottom: "40px" }}>
            <Link className="btn" to="/services">
              View all services &amp; case studies
            </Link>
          </div>

          {/* Engagement models */}
          <div className="head rv" style={{ margin: "56px 0 28px" }}>
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
            <a className="btn pri" href="#contact" onClick={(e) => scrollToSection(e, "contact")}>
              Talk to an engineer
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
         5. STATS & KEY METRICS (Live from database or fallbacks) - Movable & Animated
         ========================================================================= */}
      <MovableStats statsList={statsList} />

      {/* =========================================================================
         6. HOW WE WORK / PROCESS
         ========================================================================= */}
      <section id="process">
        <div className="wrap">
          <div className="head rv">
            <h2>A clear path from idea to launch</h2>
            <p className="mut">Short sprints, weekly demos and no surprises on scope or cost.</p>
          </div>
          <div className="steps rv">
            <div className="step">
              <span>Step 1</span>
              <h3>Discover</h3>
              <p className="mut">We learn your goals, users and constraints, then agree on scope and success measures.</p>
            </div>
            <div className="step">
              <span>Step 2</span>
              <h3>Design</h3>
              <p className="mut">Wireframes and clickable prototypes you can test with real users before we write code.</p>
            </div>
            <div className="step">
              <span>Step 3</span>
              <h3>Build</h3>
              <p className="mut">Two-week sprints with a live demo at the end of each one and automated testing throughout.</p>
            </div>
            <div className="step">
              <span>Step 4</span>
              <h3>Launch &amp; run</h3>
              <p className="mut">Zero-downtime release, monitoring and a support team on call after go-live.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         7. INDUSTRIES WE SERVE (Reflected from user reference image)
         ========================================================================= */}
      <section id="industries" className="alt">
        <div className="wrap">
          <div className="head rv">
            <h2>Built for the way your industry works</h2>
            <p className="mut">
              We bring domain knowledge to every project so you spend less time explaining and more time shipping.
            </p>
          </div>
          <div className="ind rv">
            <span>Fintech &amp; Banking</span>
            <span>Healthcare</span>
            <span>Education</span>
            <span>Retail &amp; eCommerce</span>
            <span>Manufacturing</span>
            <span>Logistics</span>
            <span>Real Estate</span>
            <span>Government</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
         8. TECHNOLOGY STACK
         ========================================================================= */}
      <section id="stack">
        <div className="wrap">
          <div className="head rv">
            <h2>Tools we use every day</h2>
            <p className="mut">Proven, well-supported technology that your team can maintain for years.</p>
          </div>
          <TechTiles />
        </div>
      </section>

      {/* =========================================================================
         12. CONTACT SECTION & WORKING FORM (From index.html)
         ========================================================================= */}
      <section className="contact" id="contact">
        <div className="wrap cg">
          <div className="cl rv">
            <h2>Let's talk about your project</h2>
            <p className="mut" style={{ margin: "20px 0 30px", maxWidth: "44ch" }}>
              Share a few details and an engineer will reply within two working days. No sales pitch, just a practical plan.
            </p>

            <div className="facts" id="facts">
              <div className="fi">
                <span className="fic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                  </svg>
                </span>
                <div>
                  <small>Office</small>
                  <p>Pune, Maharashtra, India</p>
                </div>
              </div>

              <div className="fi">
                <span className="fic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 6v6l4 2" />
                  </svg>
                </span>
                <div>
                  <small>Working hours</small>
                  <p>Monday to Saturday, 10:00 to 19:00 IST</p>
                </div>
              </div>

              <div className="fi">
                <span className="fic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 5h18v14H3zM3 7l9 7 9-7" />
                  </svg>
                </span>
                <div>
                  <small>Email</small>
                  <p>
                    <a href="mailto:contact@kairoedge.com">contact@kairoedge.com</a>
                  </p>
                </div>
              </div>

              <div className="fi">
                <span className="fic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                  </svg>
                </span>
                <div>
                  <small>Phone</small>
                  <p>
                    <a href="tel:+912012345678">+91 20 1234 5678</a>
                  </p>
                </div>
              </div>
            </div>

            <ol className="nx">
              <li>
                <b>We reply</b>
                <span>Within two working days, from an engineer.</span>
              </li>
              <li>
                <b>We talk</b>
                <span>A short call to understand your goals and limits.</span>
              </li>
              <li>
                <b>We propose</b>
                <span>A clear scope, timeline and fixed quote.</span>
              </li>
            </ol>
          </div>

          <form className="card cform rv" id="f" noValidate onSubmit={handleContactSubmit}>
            <input
              className="hp"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={contactHoneypot}
              onChange={(e) => setContactHoneypot(e.target.value)}
              style={{ display: "none" }}
            />
            <h3>Send us a message</h3>
            <div className="two">
              <label>
                <span>Your name <b style={{ color: "var(--sun)" }}>*</b></span>
                <input
                  name="n"
                  required
                  autoComplete="name"
                  placeholder="e.g. Rahul Sharma"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </label>
              <label>
                <span>Mobile number <b style={{ color: "var(--sun)" }}>*</b></span>
                <input
                  name="p"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </label>
            </div>
            <label>
              <span>Work email <b style={{ color: "var(--sun)" }}>*</b></span>
              <input
                name="e"
                type="email"
                required
                autoComplete="email"
                placeholder="name@company.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </label>
            <div>
              <span style={{ display: "block", fontSize: "0.86rem", fontWeight: 600, color: "var(--ink)", marginBottom: "7px" }}>
                What do you need?
              </span>
              <SearchableSelect
                options={serviceOptions}
                value={contactInterest}
                onChange={(val) => setContactInterest(val)}
                searchPlaceholder="Search service..."
              />
            </div>
            <label>
              Tell us about your project
              <textarea
                rows={4}
                id="msg"
                placeholder="Tell us about your goals, timeline, or requirements..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
              />
            </label>

            {contactError && (
              <div className="err" id="err" role="alert" style={{ display: "block" }}>
                {contactError}
              </div>
            )}

            <button
              className="btn pri"
              type="submit"
              disabled={isSubmitting}
              style={{ width: "100%", justifyContent: "center", textAlign: "center" }}
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </button>

            <p className="mut" style={{ fontSize: ".85rem", margin: 0 }}>
              We use your details only to reply to your enquiry.
            </p>

            {contactSuccess && (
              <div className="ok" id="ok" role="status" style={{ display: "block" }}>
                {contactSuccess}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* =========================================================================
         13. FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="cta2">
        <div className="wrap">
          <div className="band rv">
            <div>
              <h3>Ready to build something great?</h3>
              <p className="mut">Tell us about your idea. An engineer will reply within two working days.</p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a className="btn pri" href="#contact" onClick={(e) => scrollToSection(e, "contact")}>
                Let's talk
              </a>
              <Link className="btn" to="/careers">
                See open positions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
