import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApplyModal from "../components/ApplyModal";
import { useSite } from "../context/SiteData";

// 6 Core Pillars inspired by Rakhsons Internship Portal
const pillars = [
  {
    step: "01",
    title: "Student Registration",
    desc: "Register with your name, active email, and mobile number. Receive a unique Application Reference ID to track your status at any time.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  },
  {
    step: "02",
    title: "College & Academic Profile",
    desc: "Connect your Pune or Indian university, select your degree (B.Tech, BCA, MCA, M.Tech, etc.) and your academic year of study.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    )
  },
  {
    step: "03",
    title: "Resume & Skill Review",
    desc: "Upload your resume in PDF/DOC format. Showcase your GitHub repositories, coding projects, and programming coursework.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )
  },
  {
    step: "04",
    title: "Domain Track Selection",
    desc: "Choose from 8 specialized IT engineering domains matching your career direction, with 3-month or 6-month hands-on durations.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    )
  },
  {
    step: "05",
    title: "Application Status Tracking",
    desc: "Monitor your review milestone live: Application Submitted → Technical Review → Shortlisted for Screening → Selected.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    )
  },
  {
    step: "06",
    title: "Live Sprints & PPO Pathway",
    desc: "Collaborate in Agile sprints with senior engineers on real production software. High performers earn direct Pre-Placement Offers.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    )
  }
];

// 8 Dedicated Internship Domains
const domainTracks = [
  {
    id: "full-stack",
    title: "Full-Stack Web Development",
    category: "web",
    duration: "3 Months / 6 Months",
    location: "Pune / Hybrid",
    summary: "Architect modern web platforms using React 19, TypeScript, and Node.js. Learn end-to-end API integration and state management.",
    skills: ["React 19", "TypeScript", "Node.js", "Express", "PostgreSQL", "REST APIs"],
    eligibility: "1st, 2nd, 3rd, 4th Year Students & Recent Graduates (B.Tech, BCA, MCA, B.Sc)",
    description: "In this track, you will be embedded directly in the engineering sprint team building full-stack responsive web applications for enterprise clients.",
    responsibilities: [
      "Develop reusable component libraries and stateful client views using React 19 and TypeScript.",
      "Write RESTful endpoints and schema validations in Node.js and Express.",
      "Perform database queries, migrations, and joins with PostgreSQL.",
      "Participate in weekly sprint reviews, pull request code reviews, and Git branching workflows."
    ],
    outcomes: [
      "Production-grade portfolio project deployed live on cloud hosting.",
      "Deep practical proficiency in React 19, TypeScript, and modern asynchronous JavaScript.",
      "Official KairoEdge Internship Certificate and PPO evaluation."
    ]
  },
  {
    id: "backend-python",
    title: "Python & Backend Systems",
    category: "backend",
    duration: "3 Months / 6 Months",
    location: "Pune / Hybrid",
    summary: "Engineer robust RESTful microservices, asynchronous workers, and database architectures using Python, FastAPI, and PostgreSQL.",
    skills: ["Python 3.12", "FastAPI", "Django", "PostgreSQL", "Redis", "Docker"],
    eligibility: "Students & Graduates with strong Python fundamentals and basic database familiarity",
    description: "Focus on server-side architecture, data structures, caching layers, and high-throughput background processing for high-volume applications.",
    responsibilities: [
      "Design and implement high-performance REST and GraphQL APIs with FastAPI and Pydantic.",
      "Build database models, relationships, and queries with SQLAlchemy and PostgreSQL.",
      "Implement authentication pipelines (JWT, OAuth2) and role-based access control.",
      "Write automated unit and integration tests using pytest."
    ],
    outcomes: [
      "Production-ready backend API service with full Swagger/OpenAPI documentation.",
      "Experience optimizing database queries and handling concurrency.",
      "Industry credential certificate and Pre-Placement Offer (PPO) consideration."
    ]
  },
  {
    id: "cloud-devops",
    title: "Cloud & DevOps Engineering",
    category: "cloud",
    duration: "3 Months / 6 Months",
    location: "Pune / Hybrid",
    summary: "Build CI/CD automation pipelines, manage AWS cloud infrastructure, containerize services with Docker, and configure cloud monitoring.",
    skills: ["AWS", "Docker", "Kubernetes", "GitHub Actions", "Terraform", "Linux"],
    eligibility: "Students interested in Linux, cloud systems, deployments, and automated pipelines",
    description: "Learn how global IT companies configure automated build, test, and release pipelines to maintain high uptime and scalable infrastructure.",
    responsibilities: [
      "Containerize multi-tier web applications using Docker and Docker Compose.",
      "Create automated GitHub Actions workflows for continuous integration and automated testing.",
      "Provision AWS infrastructure (EC2, S3, RDS, CloudFront) using Terraform.",
      "Configure log aggregation and health monitoring."
    ],
    outcomes: [
      "Real-world experience managing cloud staging and production environments.",
      "Solid portfolio of Infrastructure-as-Code (IaC) and CI/CD pipelines.",
      "KairoEdge Internship Certificate and PPO opportunity."
    ]
  },
  {
    id: "ai-automation",
    title: "AI & Machine Learning Automation",
    category: "cloud",
    duration: "3 Months / 6 Months",
    location: "Pune / Hybrid",
    summary: "Build generative AI applications, agentic workflows, document extractors, and automated business processes using Gemini API and Python.",
    skills: ["Gemini API", "Python", "LangChain", "Vector DBs", "PyTorch", "NLP"],
    eligibility: "Students with Python knowledge and interest in Artificial Intelligence, LLMs, and Automation",
    description: "Work on cutting-edge generative AI features, prompt chaining, retrieval-augmented generation (RAG), and agentic workflows for enterprise clients.",
    responsibilities: [
      "Implement multi-turn conversational agents and function calling with Google Gemini API.",
      "Build semantic search and document retrieval pipelines using embeddings and vector databases.",
      "Integrate AI workflows with internal APIs and business databases.",
      "Benchmark model outputs, prompt latencies, and accuracy metrics."
    ],
    outcomes: [
      "Shipped intelligent automation prototype addressing a real-world enterprise problem.",
      "Advanced hands-on understanding of modern LLM APIs and agent architectures.",
      "Certificate of Internship and PPO eligibility."
    ]
  },
  {
    id: "mobile-apps",
    title: "Mobile App Development",
    category: "web",
    duration: "3 Months / 6 Months",
    location: "Pune / Hybrid",
    summary: "Build high-performance, cross-platform mobile apps for Android and iOS using React Native or Flutter with clean architecture.",
    skills: ["React Native", "Flutter", "Dart", "TypeScript", "Mobile UI", "REST APIs"],
    eligibility: "Students interested in building responsive, modern mobile experiences on Android & iOS",
    description: "Develop user-friendly mobile applications featuring native device integrations, responsive layouts, offline caching, and push notifications.",
    responsibilities: [
      "Design smooth mobile user interfaces and touch interactions in React Native or Flutter.",
      "Connect mobile clients to cloud backend services via REST and WebSocket protocols.",
      "Implement local SQLite/AsyncStorage persistence and state management.",
      "Test apps across Android and iOS simulators and physical test devices."
    ],
    outcomes: [
      "Complete working mobile app portfolio project tested on physical devices.",
      "Proficiency in modern cross-platform mobile engineering standards.",
      "Official Certificate and PPO evaluation."
    ]
  },
  {
    id: "data-analytics",
    title: "Data Analytics & Engineering",
    category: "backend",
    duration: "3 Months / 6 Months",
    location: "Pune / Hybrid",
    summary: "Transform messy enterprise datasets into actionable business intelligence dashboards, SQL models, and automated reporting pipelines.",
    skills: ["Python", "SQL", "Power BI", "Pandas", "ETL Pipelines", "Data Viz"],
    eligibility: "Students with analytical mindset, SQL basics, or Python data science background",
    description: "Learn professional data handling, data cleaning, relational schema design, interactive Power BI dashboards, and statistical reporting.",
    responsibilities: [
      "Write complex SQL queries, window functions, and aggregations for reporting.",
      "Perform exploratory data analysis and automated cleansing scripts in Python (Pandas/NumPy).",
      "Build executive-level interactive business intelligence dashboards in Power BI.",
      "Document data dictionaries and metric definitions for business stakeholders."
    ],
    outcomes: [
      "Portfolio of production-grade business intelligence dashboards and data pipelines.",
      "Strong command of SQL analytics, ETL processes, and data visualization.",
      "KairoEdge Internship Certificate and PPO opportunity."
    ]
  },
  {
    id: "uiux-design",
    title: "UI/UX & Digital Product Design",
    category: "design",
    duration: "3 Months / 6 Months",
    location: "Pune / Hybrid",
    summary: "Craft intuitive, corporate product interfaces, wireframes, and design systems in Figma. Conduct user research and developer design handoffs.",
    skills: ["Figma", "Design Systems", "Wireframing", "Prototyping", "User Research", "Usability"],
    eligibility: "Students with design aptitude, Figma basics, or visual design background",
    description: "Collaborate with product managers and engineers to turn complex business requirements into clean, elegant, user-centric software interfaces.",
    responsibilities: [
      "Create high-fidelity interactive wireframes and prototypes in Figma.",
      "Maintain enterprise design system components, typography scales, and color tokens.",
      "Conduct heuristic usability audits and user flow optimizations.",
      "Deliver pixel-perfect design specifications and assets for engineering handoff."
    ],
    outcomes: [
      "Comprehensive product case study for your design portfolio.",
      "Real experience collaborating directly with software development teams.",
      "KairoEdge Internship Certificate and PPO consideration."
    ]
  },
  {
    id: "cyber-security",
    title: "Cyber Security & Cloud Systems",
    category: "cloud",
    duration: "3 Months / 6 Months",
    location: "Pune / Hybrid",
    summary: "Perform security assessments, identify OWASP vulnerabilities, audit cloud access policies, and establish defensive security practices.",
    skills: ["OWASP Top 10", "Linux Security", "Network Protocols", "Burp Suite", "IAM Audits"],
    eligibility: "Students with passion for network security, ethical hacking, and secure software development",
    description: "Focus on application security posture, static and dynamic vulnerability analysis, identity management, and secure coding practices.",
    responsibilities: [
      "Analyze web applications against OWASP Top 10 vulnerabilities.",
      "Review IAM policies, authentication mechanisms, and API endpoint protections.",
      "Conduct automated vulnerability scans and write detailed remediation notes.",
      "Assist in configuring firewall rules, SSL/TLS certificates, and safe headers."
    ],
    outcomes: [
      "Practical experience auditing and securing modern web applications.",
      "Portfolio of security audit reports and mitigation strategies.",
      "Certificate of Internship and PPO opportunity."
    ]
  }
];

export default function Internship() {
  const { jobs = [] } = useSite();
  const [filter, setFilter] = useState("all");
  const [selectedRole, setSelectedRole] = useState(null); // for MNC role info modal
  const [applyingJob, setApplyingJob] = useState(null); // for application popup modal

  // Tracking Widget State
  const [trackQuery, setTrackQuery] = useState("");
  const [trackStatus, setTrackStatus] = useState("idle");
  const [trackResults, setTrackResults] = useState(null);
  const [trackError, setTrackError] = useState("");

  useEffect(() => {
    document.title = "Internship Portal · KairoEdge Technologies Pune";
  }, []);

  // Filter available domains
  const filteredDomains = domainTracks.filter((track) => {
    if (filter === "all") return true;
    return track.category === filter;
  });

  // Pull database-managed internship jobs
  const dbInternships = jobs.filter(
    (j) => j.type.includes("Internship") || j.type.includes("Training")
  );

  async function handleTrackSubmit(e) {
    e.preventDefault();
    if (!trackQuery.trim()) {
      setTrackError("Please enter your Application Reference ID, email, or mobile number.");
      return;
    }
    setTrackStatus("loading");
    setTrackError("");
    setTrackResults(null);

    try {
      const res = await fetch(`/api/applications/track?q=${encodeURIComponent(trackQuery.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No matching application found.");
      }
      setTrackResults(data.applications);
      setTrackStatus("success");
    } catch (err) {
      setTrackStatus("error");
      setTrackError(err.message);
    }
  }

  function getStatusBadge(status) {
    const s = (status || "new").toLowerCase();
    switch (s) {
      case "new":
      case "submitted":
        return <span className="tracker-badge new">Application Submitted</span>;
      case "reviewing":
        return <span className="tracker-badge reviewing">Under Technical Review</span>;
      case "shortlisted":
      case "interviewed":
        return <span className="tracker-badge shortlisted">Shortlisted for Screening</span>;
      case "selected":
      case "hired":
        return <span className="tracker-badge selected">Selected · Offer Rolled Out</span>;
      case "rejected":
      case "archived":
        return <span className="tracker-badge rejected">Archived / Not Moving Forward</span>;
      default:
        return <span className="tracker-badge reviewing">{status}</span>;
    }
  }

  function getStepProgress(status) {
    const s = (status || "new").toLowerCase();
    if (s === "selected" || s === "hired") return 4;
    if (s === "shortlisted" || s === "interviewed") return 3;
    if (s === "reviewing") return 2;
    return 1;
  }

  return (
    <div className="intern-portal-wrapper">
      <div className="container">
        {/* ========================================================================= */}
        {/* HERO BANNER (RAKHSONS GRADIENT THEME) */}
        {/* ========================================================================= */}
        <section className="intern-hero-card">
          <div className="intern-hero-kicker">
            KairoEdge Tech Internship Program · Pune Center of Excellence
          </div>
          <h1 className="intern-hero-title">
            Engineering Internships &amp; Training at KairoEdge
          </h1>
          <p className="intern-hero-desc">
            Gain production experience working on enterprise client platforms. Complete your student profile, choose your specialized technology domain, and track your application status from one unified portal.
          </p>
          <div className="intern-hero-actions">
            <button
              type="button"
              className="btn-intern-primary"
              onClick={() =>
                setApplyingJob({
                  title: "Software Engineering Internship",
                  type: "Internship · 3-6 Months",
                  location: "Pune / Hybrid",
                  slug: "general-internship"
                })
              }
            >
              Apply for Internship
            </button>
            <a href="#track-status" className="btn-intern-outline">
              Track Application Status
            </a>
            <a href="#domains" className="btn-intern-outline">
              View All 8 Domains
            </a>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STATS & HIGHLIGHTS STRIP */}
        {/* ========================================================================= */}
        <section className="intern-stats-strip">
          <div className="intern-stat-item">
            <div className="intern-stat-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <div className="intern-stat-val">3 &amp; 6 Months</div>
              <div className="intern-stat-lbl">Structured Sprint Tracks</div>
            </div>
          </div>

          <div className="intern-stat-item">
            <div className="intern-stat-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="intern-stat-val">1-on-1 Mentorship</div>
              <div className="intern-stat-lbl">Senior Engineer Guidance</div>
            </div>
          </div>

          <div className="intern-stat-item">
            <div className="intern-stat-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div>
              <div className="intern-stat-val">Live Deliverables</div>
              <div className="intern-stat-lbl">Real Enterprise Codebase</div>
            </div>
          </div>

          <div className="intern-stat-item">
            <div className="intern-stat-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <div className="intern-stat-val">PPO &amp; Certificate</div>
              <div className="intern-stat-lbl">Full-Time Conversion Path</div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6-PILLAR APPLICATION WORKFLOW (RAKHSONS FLOW) */}
        {/* ========================================================================= */}
        <section className="section" style={{ paddingTop: 0, paddingBottom: "40px" }}>
          <div className="intern-section-header">
            <h2 className="intern-section-title">Internship Application Architecture</h2>
            <p className="intern-section-subtitle">
              Our transparent 6-step roadmap takes you from student registration to production sprint deployment and final pre-placement evaluation.
            </p>
          </div>

          <div className="intern-pillars-grid">
            {pillars.map((pillar) => (
              <div key={pillar.step} className="intern-pillar-card">
                <span className="intern-pillar-step">Step {pillar.step}</span>
                <div className="intern-pillar-icon">{pillar.icon}</div>
                <h3 className="intern-pillar-title">{pillar.title}</h3>
                <p className="intern-pillar-desc">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* AVAILABLE INTERNSHIP DOMAINS (MNC STYLE) */}
        {/* ========================================================================= */}
        <section id="domains" className="section" style={{ paddingTop: 0, paddingBottom: "40px" }}>
          <div className="intern-section-header">
            <h2 className="intern-section-title">Available Internship Domains &amp; Tracks</h2>
            <p className="intern-section-subtitle">
              Select your preferred engineering domain below. Click <strong>Role Info</strong> for comprehensive syllabus and eligibility, or click <strong>Apply Now</strong> to submit your application immediately.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="domain-filter-row">
            <button
              type="button"
              className={`domain-filter-btn ${filter === "all" ? "is-active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Domains ({domainTracks.length})
            </button>
            <button
              type="button"
              className={`domain-filter-btn ${filter === "web" ? "is-active" : ""}`}
              onClick={() => setFilter("web")}
            >
              Web &amp; Mobile
            </button>
            <button
              type="button"
              className={`domain-filter-btn ${filter === "backend" ? "is-active" : ""}`}
              onClick={() => setFilter("backend")}
            >
              Backend &amp; Data
            </button>
            <button
              type="button"
              className={`domain-filter-btn ${filter === "cloud" ? "is-active" : ""}`}
              onClick={() => setFilter("cloud")}
            >
              Cloud, AI &amp; Security
            </button>
            <button
              type="button"
              className={`domain-filter-btn ${filter === "design" ? "is-active" : ""}`}
              onClick={() => setFilter("design")}
            >
              UI/UX Design
            </button>
          </div>

          {/* Domain Cards Grid */}
          <div className="intern-domains-grid">
            {filteredDomains.map((track) => (
              <article key={track.id} className="intern-domain-card">
                <div>
                  <div className="domain-badge-row">
                    <span className="domain-duration-badge">{track.duration}</span>
                    <span className="domain-location-badge">{track.location}</span>
                  </div>

                  <h3 className="domain-card-title">{track.title}</h3>
                  <p className="domain-card-summary">{track.summary}</p>

                  <div className="domain-skills-wrap">
                    {track.skills.map((skill) => (
                      <span key={skill} className="domain-skill-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="domain-card-actions">
                  <button
                    type="button"
                    className="btn-domain-info"
                    onClick={() => setSelectedRole(track)}
                  >
                    Role Info
                  </button>
                  <button
                    type="button"
                    className="btn-domain-apply"
                    onClick={() =>
                      setApplyingJob({
                        title: track.title,
                        type: `Internship · ${track.duration}`,
                        location: track.location,
                        slug: track.id
                      })
                    }
                  >
                    Apply Now
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Database-Configured Extra Internships if any */}
          {dbInternships.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <h4 style={{ fontSize: "18px", color: "var(--dark)", marginBottom: "14px", fontWeight: 700 }}>
                Specialized Live Positions from Engineering Team
              </h4>
              <div className="intern-domains-grid">
                {dbInternships.map((job) => (
                  <article key={job.slug} className="intern-domain-card">
                    <div>
                      <div className="domain-badge-row">
                        <span className="domain-duration-badge">{job.type}</span>
                        <span className="domain-location-badge">{job.location}</span>
                      </div>
                      <h3 className="domain-card-title">{job.title}</h3>
                      <p className="domain-card-summary">{job.summary}</p>
                    </div>

                    <div className="domain-card-actions">
                      <Link className="btn-domain-info" to={`/careers/${job.slug}`}>
                        Role Info
                      </Link>
                      <button
                        type="button"
                        className="btn-domain-apply"
                        onClick={() => setApplyingJob(job)}
                      >
                        Apply Now
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* APPLICATION STATUS TRACKER WIDGET */}
        {/* ========================================================================= */}
        <section id="track-status" className="intern-tracker-box">
          <div className="intern-section-header" style={{ marginBottom: "12px" }}>
            <h2 className="intern-section-title" style={{ fontSize: "24px" }}>
              Track Application Status
            </h2>
            <p className="intern-section-subtitle">
              Enter your Application Reference ID (e.g. <code>KE-INT-2026-0011</code> or numeric ID), registered email, or mobile number to check your status live.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="tracker-form-row">
            <input
              type="text"
              className="tracker-input"
              placeholder="Enter Application ID, Email, or Mobile…"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
            />
            <button
              type="submit"
              className="tracker-btn"
              disabled={trackStatus === "loading"}
            >
              {trackStatus === "loading" ? "Checking Status…" : "Check Status"}
            </button>
          </form>

          {trackError && (
            <div style={{ marginTop: "16px", color: "#e11d48", fontSize: "14px", fontWeight: 600 }}>
              {trackError}
            </div>
          )}

          {trackResults && trackResults.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              {trackResults.map((app) => {
                const step = getStepProgress(app.status);
                return (
                  <div key={app.id} className="tracker-result-card">
                    <div className="tracker-header-line">
                      <div>
                        <span className="tracker-ref-code">{app.refId}</span>
                        <h4 style={{ margin: "4px 0 0", fontSize: "17px", color: "var(--dark)" }}>
                          {app.role_title}
                        </h4>
                        <span style={{ fontSize: "13px", color: "#64748b" }}>
                          Applicant: {app.name} · Submitted on {new Date(app.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div>{getStatusBadge(app.status)}</div>
                    </div>

                    {/* Progress Stepper */}
                    <div className="tracker-stepper">
                      <div className={`stepper-step ${step >= 1 ? (step === 1 ? "is-active" : "is-done") : ""}`}>
                        <div className="stepper-circle">{step > 1 ? "✓" : "1"}</div>
                        <div className="stepper-step-title">Application Received</div>
                        <div className="stepper-step-desc">Profile registered</div>
                      </div>

                      <div className={`stepper-step ${step >= 2 ? (step === 2 ? "is-active" : "is-done") : ""}`}>
                        <div className="stepper-circle">{step > 2 ? "✓" : "2"}</div>
                        <div className="stepper-step-title">Technical Review</div>
                        <div className="stepper-step-desc">Resume &amp; stack check</div>
                      </div>

                      <div className={`stepper-step ${step >= 3 ? (step === 3 ? "is-active" : "is-done") : ""}`}>
                        <div className="stepper-circle">{step > 3 ? "✓" : "3"}</div>
                        <div className="stepper-step-title">Interview / Screening</div>
                        <div className="stepper-step-desc">Technical discussion</div>
                      </div>

                      <div className={`stepper-step ${step >= 4 ? "is-active" : ""}`}>
                        <div className="stepper-circle">{step >= 4 ? "✓" : "4"}</div>
                        <div className="stepper-step-title">Offer &amp; Onboarding</div>
                        <div className="stepper-step-desc">Final selection letter</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* ELIGIBILITY & ACADEMIC YEAR BREAKDOWN */}
        {/* ========================================================================= */}
        <section className="section" style={{ paddingTop: 0, paddingBottom: "40px" }}>
          <div className="intern-section-header">
            <h2 className="intern-section-title">Eligibility &amp; Student Batches</h2>
            <p className="intern-section-subtitle">
              We welcome applications from students across all years of study and recent graduates.
            </p>
          </div>

          <div className="intern-stats-strip">
            <div className="intern-stat-item" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <div className="domain-duration-badge" style={{ marginBottom: "8px" }}>1st &amp; 2nd Year</div>
              <div className="intern-stat-val" style={{ fontSize: "16px", marginBottom: "6px" }}>Foundational Training</div>
              <div className="intern-stat-lbl">
                Focused on core programming constructs, Git branching, clean coding, and junior sprint tasks under guided mentorship.
              </div>
            </div>

            <div className="intern-stat-item" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <div className="domain-duration-badge" style={{ marginBottom: "8px" }}>3rd Year Students</div>
              <div className="intern-stat-val" style={{ fontSize: "16px", marginBottom: "6px" }}>Production Sprints</div>
              <div className="intern-stat-lbl">
                Participate in live feature sprints, REST API development, component libraries, and automated CI/CD unit testing.
              </div>
            </div>

            <div className="intern-stat-item" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <div className="domain-duration-badge" style={{ marginBottom: "8px" }}>4th / Final Year</div>
              <div className="intern-stat-val" style={{ fontSize: "16px", marginBottom: "6px" }}>Capstone &amp; PPO Path</div>
              <div className="intern-stat-lbl">
                Full-time capstone project completion, enterprise feature delivery, and fast-track evaluation for Pre-Placement Offers (PPOs).
              </div>
            </div>

            <div className="intern-stat-item" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <div className="domain-duration-badge" style={{ marginBottom: "8px" }}>Graduates &amp; Postgrads</div>
              <div className="intern-stat-val" style={{ fontSize: "16px", marginBottom: "6px" }}>Fast-Track Conversion</div>
              <div className="intern-stat-lbl">
                Immediate deployment on client enterprise projects with direct conversion pathway to full-time Associate Software Engineer roles.
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FREQUENTLY ASKED QUESTIONS */}
        {/* ========================================================================= */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="intern-section-header">
            <h2 className="intern-section-title">Frequently Asked Questions</h2>
            <p className="intern-section-subtitle">
              Everything you need to know about joining KairoEdge Technologies as an engineering intern in Pune.
            </p>
          </div>

          <div className="intern-faq-grid">
            <div className="intern-faq-card">
              <h3 className="intern-faq-question">Who is eligible to apply for the internship?</h3>
              <p className="intern-faq-answer">
                Students pursuing B.Tech, B.E., BCA, MCA, M.Tech, B.Sc (Computer Science / IT), Diploma, or recent graduates passionate about building real-world software are eligible.
              </p>
            </div>

            <div className="intern-faq-card">
              <h3 className="intern-faq-question">What is the duration of the internship program?</h3>
              <p className="intern-faq-answer">
                We offer both 3-month and 6-month tracks depending on your university semester schedule and career goals. Both tracks feature live sprint assignments.
              </p>
            </div>

            <div className="intern-faq-card">
              <h3 className="intern-faq-question">Is the internship on-site in Pune or remote?</h3>
              <p className="intern-faq-answer">
                We support flexible hybrid and on-site modes at our Pune Delivery Center. Students can balance academic college classes with structured team sprints.
              </p>
            </div>

            <div className="intern-faq-card">
              <h3 className="intern-faq-question">Will I receive a certificate and Pre-Placement Offer (PPO)?</h3>
              <p className="intern-faq-answer">
                Yes! Every intern who completes the program receives a recognized KairoEdge Internship Certificate. Top performers in 3rd/4th year and graduates are considered for full-time PPOs.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* MNC ROLE INFO POPUP MODAL */}
      {/* ========================================================================= */}
      {selectedRole && (
        <div
          className="role-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedRole(null);
          }}
        >
          <div className="role-modal-card" role="dialog" aria-modal="true">
            <button
              type="button"
              className="role-modal-close-btn"
              onClick={() => setSelectedRole(null)}
              aria-label="Close role details"
            >
              ✕
            </button>

            <div className="role-modal-header">
              <span className="role-modal-badge">{selectedRole.duration}</span>
              <h2 className="role-modal-title">{selectedRole.title}</h2>
              <div className="role-modal-meta">
                <span>{selectedRole.location}</span>
                <span>·</span>
                <span>Engineering Operations</span>
                <span>·</span>
                <span>Pune Delivery Center</span>
              </div>
            </div>

            <div className="role-modal-body">
              <div className="role-modal-section">
                <h3 className="role-modal-heading">Program Overview</h3>
                <p style={{ color: "#334155", fontSize: "14.5px", lineHeight: 1.65, margin: 0 }}>
                  {selectedRole.description}
                </p>
              </div>

              <div className="role-modal-section">
                <h3 className="role-modal-heading">Responsibilities &amp; Sprint Work</h3>
                <ul className="role-modal-list">
                  {selectedRole.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="role-modal-section">
                <h3 className="role-modal-heading">Key Technologies</h3>
                <div className="domain-skills-wrap" style={{ marginTop: "8px", marginBottom: 0 }}>
                  {selectedRole.skills.map((skill) => (
                    <span key={skill} className="domain-skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="role-modal-section">
                <h3 className="role-modal-heading">Candidate Eligibility</h3>
                <p style={{ color: "#334155", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  {selectedRole.eligibility}
                </p>
              </div>

              <div className="role-modal-section">
                <h3 className="role-modal-heading">Learning Outcomes &amp; Certification</h3>
                <ul className="role-modal-list">
                  {selectedRole.outcomes.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="role-modal-footer">
              <button
                type="button"
                className="btn-domain-info"
                onClick={() => setSelectedRole(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-domain-apply"
                onClick={() => {
                  const roleToApply = selectedRole;
                  setSelectedRole(null);
                  setApplyingJob({
                    title: roleToApply.title,
                    type: `Internship · ${roleToApply.duration}`,
                    location: roleToApply.location,
                    slug: roleToApply.id
                  });
                }}
              >
                Apply for this Internship
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* APPLICATION FORM MODAL (STUDENT SPECIFIC POPUP) */}
      {/* ========================================================================= */}
      <ApplyModal
        job={applyingJob}
        isOpen={Boolean(applyingJob)}
        onClose={() => setApplyingJob(null)}
      />
    </div>
  );
}
