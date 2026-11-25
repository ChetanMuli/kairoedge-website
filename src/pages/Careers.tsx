import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import SEO from "../components/SEO";
import JobApplicationModal from "../components/JobApplicationModal";
import JobDetailsModal, { JobDetailItem } from "../components/JobDetailsModal";
import InternshipApplicationModal from "../components/InternshipApplicationModal";
import SectionHeroCard from "../components/SectionHeroCard";
import { useSite, useCopy } from "../context/SiteData";

const DEFAULT_ROLES: JobDetailItem[] = [
  {
    id: "cloud-devops",
    category: "eng",
    categoryLabel: "Engineering",
    title: "Cloud & DevOps Engineer",
    desc: "Design and run secure, automated AWS infrastructure, container pipelines and cloud platforms.",
    color: "#3B82F6",
    tags: ["AWS", "Docker", "Terraform", "CI/CD"],
    roleParam: "Cloud & DevOps Engineer",
    iconPath: "M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z",
    experience: "1 - 3 Years",
    type: "Full-Time",
    location: "Pune (HQ) · Hybrid",
    highlights: [
      "Production AWS cloud architectures & serverless workloads",
      "Automated CI/CD pipelines & zero-downtime deployments"
    ]
  },
  {
    id: "full-stack",
    category: "eng",
    categoryLabel: "Engineering",
    title: "Full-Stack Software Engineer",
    desc: "Build scalable web platforms, customer dashboards and resilient APIs end-to-end.",
    color: "#0070F3",
    tags: ["React", "TypeScript", "Node.js", "MySQL"],
    roleParam: "Full-Stack Developer",
    iconPath: "m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14",
    experience: "1 - 3 Years",
    type: "Full-Time",
    location: "Pune (HQ) · Hybrid",
    highlights: [
      "High-performance React & Vite enterprise interfaces",
      "Robust Node.js REST services & database optimizations"
    ]
  },
  {
    id: "mobile-dev",
    category: "eng",
    categoryLabel: "Engineering",
    title: "Mobile App Developer (Flutter)",
    desc: "Ship polished cross-platform Android & iOS apps with fluid native-feel animations and offline sync.",
    color: "#14B8A6",
    tags: ["Flutter", "Dart", "REST APIs", "State Mgmt"],
    roleParam: "Mobile App Developer",
    iconPath: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2",
    experience: "1 - 2 Years",
    type: "Full-Time",
    location: "Pune (HQ) / Ahilyanagar",
    highlights: [
      "Cross-platform Flutter codebases for iOS & Android",
      "RESTful API integration & responsive mobile UX"
    ]
  },
  {
    id: "qa-eng",
    category: "eng",
    categoryLabel: "Engineering",
    title: "QA Automation Engineer",
    desc: "Keep production releases reliable through end-to-end regression suites and API test automation.",
    color: "#22C55E",
    tags: ["Test Automation", "Postman", "Cypress", "CI/CD"],
    roleParam: "QA Automation Engineer",
    iconPath: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4",
    experience: "1 - 2 Years",
    type: "Full-Time",
    location: "Pune (HQ) · Hybrid",
    highlights: [
      "Automated test suites & continuous regression testing",
      "API payload validation & load benchmark reporting"
    ]
  },
  {
    id: "uiux-designer",
    category: "des",
    categoryLabel: "Design",
    title: "Product & UI/UX Designer",
    desc: "Translate complex business logic into intuitive, accessible web and mobile design systems.",
    color: "#F59E0B",
    tags: ["Figma", "Design Systems", "Prototyping", "UX Research"],
    roleParam: "UI/UX Designer",
    iconPath: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
    experience: "1 - 3 Years",
    type: "Full-Time",
    location: "Pune (HQ) · Hybrid",
    highlights: [
      "High-fidelity Figma prototypes & tokenized design systems",
      "Direct developer handoffs with component specifications"
    ]
  },
  {
    id: "bde",
    category: "biz",
    categoryLabel: "Business",
    title: "Business Development Executive",
    desc: "Connect with prospective enterprise clients, manage discovery consultations and close deals.",
    color: "#EC4899",
    tags: ["Client Outreach", "Proposals", "B2B Sales", "CRM"],
    roleParam: "Business Development Executive",
    iconPath: "M3 17l6-6 4 4 8-8M15 7h6v6",
    experience: "1 - 3 Years",
    type: "Full-Time",
    location: "Pune (HQ) / Ahilyanagar",
    highlights: [
      "Enterprise software sales pipeline & discovery sessions",
      "Client proposals, negotiation & relationship management"
    ]
  }
];

function parseJobDescription(desc: string) {
  if (!desc) return { responsibilities: undefined, requirements: undefined };
  const lines = desc.split("\n").map((l) => l.trim()).filter(Boolean);
  const resp: string[] = [];
  const reqs: string[] = [];
  let currentSection: "resp" | "reqs" | "none" = "none";

  for (const line of lines) {
    if (/what you will do|responsibilities|tasks/i.test(line)) {
      currentSection = "resp";
      continue;
    }
    if (/who should apply|who you are|requirements|qualifications|candidate profile/i.test(line)) {
      currentSection = "reqs";
      continue;
    }
    const cleanLine = line.replace(/^[-*•\d.]+\s*/, "");
    if (cleanLine) {
      if (currentSection === "resp") resp.push(cleanLine);
      else if (currentSection === "reqs") reqs.push(cleanLine);
    }
  }

  return {
    responsibilities: resp.length > 0 ? resp : undefined,
    requirements: reqs.length > 0 ? reqs : undefined
  };
}

function mapDatabaseJobToDetailItem(job: any, index: number): JobDetailItem {
  const title = job.title || "Software Specialist";
  const desc = job.summary || job.description || "";
  const lower = title.toLowerCase();

  let category: "eng" | "des" | "biz" = "eng";
  let categoryLabel = "Engineering";
  let color = "#8B5CF6";
  let iconPath = "m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14";

  if (/design|ui|ux|creative/i.test(lower)) {
    category = "des";
    categoryLabel = "Design";
    color = "#F59E0B";
    iconPath = "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z";
  } else if (/business|bde|sales|marketing|account|client/i.test(lower)) {
    category = "biz";
    categoryLabel = "Business";
    color = "#EC4899";
    iconPath = "M3 17l6-6 4 4 8-8M15 7h6v6";
  } else if (/cloud|devops|infra|aws|docker/i.test(lower)) {
    category = "eng";
    categoryLabel = "Engineering";
    color = "#3B82F6";
    iconPath = "M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z";
  } else if (/qa|test|automation|quality/i.test(lower)) {
    category = "eng";
    categoryLabel = "Engineering";
    color = "#22C55E";
    iconPath = "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4";
  } else if (/mobile|flutter|android|ios/i.test(lower)) {
    category = "eng";
    categoryLabel = "Engineering";
    color = "#14B8A6";
    iconPath = "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2";
  }

  let tags: string[] = [];
  if (/full-stack|web|react|node/i.test(lower)) tags = ["React", "Node.js", "MySQL"];
  else if (/cloud|devops|infra/i.test(lower)) tags = ["AWS", "Terraform", "CI/CD"];
  else if (/mobile|flutter/i.test(lower)) tags = ["Flutter", "Dart", "REST APIs"];
  else if (/qa|test/i.test(lower)) tags = ["Test automation", "API testing", "CI"];
  else if (/design|ui|ux/i.test(lower)) tags = ["Figma", "Prototyping", "Design systems"];
  else if (/business|bde/i.test(lower)) tags = ["Outreach", "Proposals", "CRM"];
  else tags = ["Software Engineering", "Product", "Pune (HQ) / Ahilyanagar"];

  const parsed = parseJobDescription(job.description);

  return {
    id: job.slug || `job-${index}`,
    category,
    categoryLabel,
    title,
    desc: desc.length > 130 ? desc.slice(0, 130) + "…" : desc,
    color,
    tags,
    roleParam: title,
    iconPath,
    location: job.location || "Pune (HQ) · Hybrid",
    experience: job.experience || "1 - 3 Years",
    type: "Full-Time",
    highlights: [
      "Mentorship & enterprise code review cadences",
      "Real production architectures deployed on AWS/Cloud"
    ],
    responsibilities: parsed.responsibilities,
    requirements: parsed.requirements
  };
}

export default function Careers() {
  const [filter, setFilter] = useState<string>("all");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Cloud & DevOps Engineer");
  const [selectedDetailsRole, setSelectedDetailsRole] = useState<JobDetailItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isInternModalOpen, setIsInternModalOpen] = useState(false);
  const [selectedInternTrack, setSelectedInternTrack] = useState("Cloud & DevOps");

  const site = useSite();
  const copy = useCopy("careers");

  const rolesList: JobDetailItem[] = useMemo(() => {
    if (Array.isArray(site?.jobs) && site.jobs.length > 0) {
      return site.jobs.map((job: any, index: number) => mapDatabaseJobToDetailItem(job, index));
    }
    return DEFAULT_ROLES;
  }, [site?.jobs]);

  const handleOpenDetails = (role: JobDetailItem) => {
    setSelectedDetailsRole(role);
    setIsDetailsModalOpen(true);
  };

  const handleOpenApply = (roleTitle: string) => {
    setSelectedRole(roleTitle);
    setIsApplyModalOpen(true);
  };

  const filteredRoles = rolesList.filter(
    (r) => filter === "all" || r.category === filter
  );

  return (
    <>
      <SEO
        title="Careers"
        description="Join a Pune team that ships real products, learns together and grows at your pace."
      />

      {/* Page Header */}
      <div className="phero">
        <div className="wrap">
          <div className="phero-content">
            <nav className="crumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span>Careers</span>
            </nav>
            <h1>{copy?.title || "Careers"}</h1>
            <p>{copy?.text || "Join a Pune team that ships real products, learns together and grows at your pace."}</p>
          </div>
          <SectionHeroCard variant="careers" />
        </div>
      </div>

      {/* Why Join */}
      <section id="careers">
        <div className="wrap">
          <div className="head rv">
            <h2>Why people join KairoEdge</h2>
            <p className="mut">Work on real client projects, learn from senior engineers and grow at your own pace.</p>
          </div>

          <div className="vgrid v3">
            <article className="card rv">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
                </svg>
              </div>
              <h3>Mentorship from day one</h3>
              <p className="mut">Every new joiner is paired with a senior engineer for code reviews and career advice.</p>
            </article>

            <article className="card rv">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
                </svg>
              </div>
              <h3>Real projects, real impact</h3>
              <p className="mut">Ship features that customers use within your first month.</p>
            </article>

            <article className="card rv">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
                </svg>
              </div>
              <h3>Clear growth paths</h3>
              <p className="mut">Defined levels, regular feedback and paid training budgets for certifications.</p>
            </article>

            <article className="card rv">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11l9-8 9 8M5 10v10h14V10" />
                </svg>
              </div>
              <h3>Hybrid and flexible</h3>
              <p className="mut">Work from our Pune office or from home, with flexible hours that respect your time.</p>
            </article>

            <article className="card rv">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12M8.2 13.9 7 23l5-3 5 3-1.2-9.1" />
                </svg>
              </div>
              <h3>Recognition</h3>
              <p className="mut">Quarterly awards and shout-outs for the work that moves the team forward.</p>
            </article>

            <article className="card rv">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
                </svg>
              </div>
              <h3>Wellbeing first</h3>
              <p className="mut">Paid leave, health cover and a team that values rest as much as results.</p>
            </article>
          </div>

          {/* Open Positions Filter */}
          <div className="head rv" style={{ margin: "80px 0 28px" }}>
            <h2>Open positions</h2>
            <div className="fl" role="group" aria-label="Filter roles">
              <button
                className={filter === "all" ? "on" : ""}
                onClick={() => setFilter("all")}
                data-f="all"
              >
                All
              </button>
              <button
                className={filter === "eng" ? "on" : ""}
                onClick={() => setFilter("eng")}
                data-f="eng"
              >
                Engineering
              </button>
              <button
                className={filter === "des" ? "on" : ""}
                onClick={() => setFilter("des")}
                data-f="des"
              >
                Design
              </button>
              <button
                className={filter === "biz" ? "on" : ""}
                onClick={() => setFilter("biz")}
                data-f="biz"
              >
                Business
              </button>
            </div>
          </div>

          {/* Roles list */}
          <div className="roles rv">
            {filteredRoles.map((role) => (
              <article
                key={role.id}
                className="role card"
                data-c={role.category}
                style={{ ["--ac" as any]: role.color }}
              >
                {/* Header row: Category Pill + Actively Hiring */}
                <div className="role-top-row">
                  <span
                    className="role-cat-badge"
                    style={{
                      color: role.color,
                      borderColor: `color-mix(in srgb, ${role.color} 30%, transparent)`,
                      background: `color-mix(in srgb, ${role.color} 10%, transparent)`
                    }}
                  >
                    <span className="role-cat-dot" style={{ background: role.color }} />
                    {role.categoryLabel}
                  </span>
                  <span className="role-hiring-status">
                    <span className="role-hiring-pulse" />
                    Actively Hiring
                  </span>
                </div>

                <h3 className="role-card-title">{role.title}</h3>

                {/* Metadata Row: Location, Work Type, Experience */}
                <div className="role-meta-chips">
                  <span className="role-meta-chip">
                    <MapPin size={13} className="role-meta-icon" />
                    {role.location || "Pune (HQ) · Hybrid"}
                  </span>
                  <span className="role-meta-chip">
                    <Briefcase size={13} className="role-meta-icon" />
                    {role.type || "Full-time"}
                  </span>
                  <span className="role-meta-chip">
                    <Clock size={13} className="role-meta-icon" />
                    {role.experience || "1 - 3 Years"}
                  </span>
                </div>

                <p className="role-card-desc">{role.desc}</p>

                {/* Key Deliverables / Highlights */}
                <div className="role-card-highlights">
                  <div className="role-highlight-item">
                    <CheckCircle2 size={13} className="role-highlight-check" />
                    <span>{role.highlights?.[0] || "Mentorship & code review cadences"}</span>
                  </div>
                  <div className="role-highlight-item">
                    <CheckCircle2 size={13} className="role-highlight-check" />
                    <span>{role.highlights?.[1] || "Production cloud systems & real client deliverables"}</span>
                  </div>
                </div>

                {/* Skill Pills */}
                <ul className="role-skills-pills">
                  {role.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>

                <div className="card-btn-group">
                  <button
                    type="button"
                    className="btn-card-secondary"
                    onClick={() => handleOpenDetails(role)}
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    className="btn-card-primary"
                    onClick={() => handleOpenApply(role.title)}
                  >
                    <span>Apply now</span>
                    <ArrowRight size={14} style={{ marginLeft: "4px" }} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div
            className="rv"
            style={{
              marginTop: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              padding: "20px 24px",
              borderRadius: "18px",
              border: "1px dashed var(--line)",
              background: "color-mix(in srgb, var(--card) 60%, transparent)"
            }}
          >
            <div>
              <b style={{ display: "block", fontSize: "1.05rem", marginBottom: "4px" }}>
                Don't see your specific role?
              </b>
              <p className="mut" style={{ fontSize: "0.92rem", margin: 0, maxWidth: "50ch" }}>
                Send us your resume anyway! We are always looking for passionate engineers and designers in Pune.
              </p>
            </div>
            <button
              type="button"
              className="btn pri general-apply-btn"
              onClick={() => handleOpenApply("General Application / Other")}
            >
              Submit General Application &rarr;
            </button>
          </div>

          {/* Hiring Process */}
          <div className="head rv" style={{ margin: "80px 0 28px" }}>
            <h2>How hiring works</h2>
          </div>
          <div className="steps rv">
            <div className="step">
              <span>Step 1</span>
              <h3>Apply</h3>
              <p className="mut">Send your resume or portfolio through the form below.</p>
            </div>
            <div className="step">
              <span>Step 2</span>
              <h3>Intro call</h3>
              <p className="mut">A short chat about your goals, skills and what you want to learn.</p>
            </div>
            <div className="step">
              <span>Step 3</span>
              <h3>Skills round</h3>
              <p className="mut">A practical task or technical discussion based on your role.</p>
            </div>
            <div className="step">
              <span>Step 4</span>
              <h3>Offer</h3>
              <p className="mut">A clear offer and onboarding plan, usually within a week.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Internship CTA */}
      <section className="cta2">
        <div className="wrap">
          <div className="band rv">
            <div>
              <h3>Still studying?</h3>
              <p className="mut">Our internship program gives students and fresh graduates hands-on experience on live projects.</p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn pri"
                onClick={() => {
                  setSelectedInternTrack("Cloud & DevOps");
                  setIsInternModalOpen(true);
                }}
              >
                Apply for internship &rarr;
              </button>
              <Link className="btn" to="/internship" style={{ border: "1px solid var(--line)" }}>
                View internship tracks
              </Link>
            </div>
          </div>
        </div>
      </section>

      <JobDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        role={selectedDetailsRole}
        onApply={(roleTitle) => handleOpenApply(roleTitle)}
      />

      <JobApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        initialRole={selectedRole}
      />

      <InternshipApplicationModal
        isOpen={isInternModalOpen}
        onClose={() => setIsInternModalOpen(false)}
        initialTrack={selectedInternTrack}
      />
    </>
  );
}
