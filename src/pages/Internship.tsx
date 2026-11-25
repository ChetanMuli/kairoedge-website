import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Award, CheckCircle2, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import InternshipApplicationModal from "../components/InternshipApplicationModal";
import InternshipDetailsModal, { InternshipTrackItem } from "../components/InternshipDetailsModal";
import SectionHeroCard from "../components/SectionHeroCard";
import { useCopy } from "../context/SiteData";

const TRACKS: (InternshipTrackItem & { iconSvg?: React.ReactNode })[] = [
  {
    id: "cloud-devops",
    title: "Cloud & DevOps",
    color: "#0284c7",
    categoryLabel: "Cloud & Infrastructure",
    desc: "Learn AWS, Linux, and automation by running real deployments and CI/CD pipelines.",
    skills: ["AWS", "Terraform", "Docker", "CI/CD"],
    duration: "3 to 6 Months",
    highlights: [
      "Multi-tier AWS architecture & Docker container pipelines",
      "Recommendation letter + PPO for top performing candidates"
    ],
    curriculum: [
      "AWS core infrastructure: EC2 compute, S3 storage, VPC networking, IAM security, and RDS.",
      "Linux server administration, shell scripting, and service management.",
      "Docker container creation, multi-stage builds, and Docker Compose environments.",
      "Infrastructure as Code with Terraform and automated CI/CD deployment pipelines."
    ],
    liveProject: "Build an automated continuous integration and delivery pipeline for high-availability multi-tier cloud apps on AWS.",
    eligibility: "Students & freshers in Computer Science, IT, Cloud Computing, or E&TC."
  },
  {
    id: "full-stack",
    title: "Full-Stack Web Development",
    color: "#0d9488",
    categoryLabel: "Web Engineering",
    desc: "Build modern web features end to end, from database to responsive client interface.",
    skills: ["React 19", "TypeScript", "Node.js", "MySQL"],
    duration: "3 to 6 Months",
    highlights: [
      "React 19, TypeScript & Node.js production web applications",
      "Real client deliverables with senior code reviews"
    ],
    curriculum: [
      "Modern React 19 with TypeScript component architecture, hooks, and clean state handling.",
      "Node.js & Express RESTful API design, authentication, and validation middleware.",
      "Relational database design in MySQL/PostgreSQL, indexing, and performant query execution.",
      "Team Git workflows, code reviews, and production cloud deployments."
    ],
    liveProject: "Develop an end-to-end customer portal with authentication, live dashboards, and database persistence.",
    eligibility: "Students & graduates with core JavaScript, HTML/CSS, and database fundamentals."
  },
  {
    id: "mobile-apps",
    title: "Mobile App Development",
    color: "#8b5cf6",
    categoryLabel: "Mobile Engineering",
    desc: "Ship Android and iOS screens with a single shared high-performance Flutter codebase.",
    skills: ["Flutter", "Dart", "REST APIs", "State Mgmt"],
    duration: "3 to 6 Months",
    highlights: [
      "Cross-platform Flutter & Dart for Android and iOS",
      "Offline-first caching, REST APIs & release-ready bundles"
    ],
    curriculum: [
      "Flutter framework architecture, widget lifecycle, and reactive state management.",
      "Dart OOP concepts, asynchronous programming with Futures and Streams.",
      "Consuming backend REST APIs, caching, and handling offline device persistence.",
      "Building responsive layouts across Android and iOS phones and tablets."
    ],
    liveProject: "Build and test a cross-platform mobile app with offline-first caching and release-ready bundles.",
    eligibility: "Students passionate about mobile application development and Dart."
  },
  {
    id: "ai-data",
    title: "AI & Data Solutions",
    color: "#ec4899",
    categoryLabel: "AI & Intelligence",
    desc: "Build generative AI integrations, automate data pipelines, and connect vector databases.",
    skills: ["Python", "Gemini API", "FastAPI", "Data Modeling"],
    duration: "3 to 6 Months",
    highlights: [
      "Python pipelines, LLM APIs, embeddings & automated workflows",
      "Hands-on data modeling and production inference systems"
    ],
    curriculum: [
      "Python fundamentals for data manipulation, NumPy, and Pandas workflows.",
      "Integrating state-of-the-art LLM APIs, prompt engineering, and structured outputs.",
      "Vector embeddings, semantic search, and Retrieval-Augmented Generation (RAG).",
      "Containerizing AI microservices with FastAPI and deploying to cloud runtimes."
    ],
    liveProject: "Develop an intelligent search and summarization microservice using LLM embeddings and FastAPI.",
    eligibility: "Students with strong Python foundations and keen interest in AI/ML solutions."
  },
  {
    id: "uiux-design",
    title: "UI/UX & Product Design",
    color: "#f59e0b",
    categoryLabel: "Design & UX",
    desc: "Turn user research into wireframes, interactive prototypes, and design token systems.",
    skills: ["Figma", "Design Systems", "Prototyping", "WCAG AA"],
    duration: "3 to 6 Months",
    highlights: [
      "Figma design tokens, auto-layout & design system creation",
      "User research, interactive prototypes & developer handoffs"
    ],
    curriculum: [
      "User research, personas, information architecture, and user journey mapping.",
      "Wireframing, rapid paper-to-digital prototyping, and usability testing.",
      "Component design systems in Figma using auto-layout, variants, and design tokens.",
      "Accessibility (WCAG AA) standards, responsive grids, and developer handoff documentation."
    ],
    liveProject: "Design an entire SaaS web & mobile dashboard with interactive prototypes and an exhaustive design system.",
    eligibility: "Students & graduates interested in digital product design, Figma, and human-computer interaction."
  },
  {
    id: "backend-api",
    title: "Backend & Cloud Systems",
    color: "#10b981",
    categoryLabel: "Backend Systems",
    desc: "Architect performant microservices, relational databases, caching, and secure authentication.",
    skills: ["Node.js", "MySQL", "Redis", "REST APIs"],
    duration: "3 to 6 Months",
    highlights: [
      "High-throughput REST APIs with MySQL & Redis caching",
      "Secure JWT authentication, rate limiting & microservices"
    ],
    curriculum: [
      "Asynchronous server architecture, event loops, and microservices patterns.",
      "Relational schema normalization, complex SQL joins, indexing, and query optimization.",
      "Authentication patterns, OAuth2, JWT lifecycle, and cryptographic security.",
      "Caching strategies with Redis, rate limiting, and automated unit testing."
    ],
    liveProject: "Build a high-concurrency booking and notification backend service with role-based access control.",
    eligibility: "Students with solid data structures, algorithms, and backend programming fundamentals."
  }
];

export default function Internship() {
  const copy = useCopy("internship");
  const [isInternModalOpen, setIsInternModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState("Cloud & DevOps");
  const [selectedDetailsTrack, setSelectedDetailsTrack] = useState<InternshipTrackItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleOpenTrackDetails = (track: InternshipTrackItem) => {
    setSelectedDetailsTrack(track);
    setIsDetailsModalOpen(true);
  };

  const handleOpenInternModal = (trackName: string) => {
    setSelectedTrack(trackName);
    setIsInternModalOpen(true);
  };

  return (
    <>
      <SEO
        title={copy?.title || "Internship Program"}
        description={copy?.text || "Hands-on experience on live projects, with mentors who review your work every week."}
      />

      {/* Page Header */}
      <div className="phero">
        <div className="wrap">
          <div className="phero-content">
            <nav className="crumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span>Internship</span>
            </nav>
            <h1>{copy?.title || "Internship program"}</h1>
            <p>{copy?.text || "Hands-on experience on live projects, with mentors who review your work every week."}</p>
          </div>
          <SectionHeroCard variant="internship" />
        </div>
      </div>

      {/* Tracks on Alt Section */}
      <section id="internship" className="alt">
        <div className="wrap">
          <div className="head rv">
            <h2>{copy?.subheading || "Choose your track"}</h2>
            <p className="mut">{copy?.subtext || "Our internship is built for students and fresh graduates who want hands-on experience, not just certificates."}</p>
          </div>

          <div className="roles rv">
            {TRACKS.map((track) => (
              <article
                key={track.id}
                className="role card"
                style={{ ["--ac" as any]: track.color || "#0284c7" }}
              >
                {/* Header row: Category Pill + Hiring Status */}
                <div className="role-top-row">
                  <span
                    className="role-cat-badge"
                    style={{
                      color: track.color || "#0284c7",
                      borderColor: `color-mix(in srgb, ${track.color || "#0284c7"} 30%, transparent)`,
                      background: `color-mix(in srgb, ${track.color || "#0284c7"} 10%, transparent)`
                    }}
                  >
                    <span className="role-cat-dot" style={{ background: track.color || "#0284c7" }} />
                    {track.categoryLabel || "Industry Track"}
                  </span>
                  <span className="role-hiring-status">
                    <span className="role-hiring-pulse" />
                    Applications Open
                  </span>
                </div>

                {/* Track Title */}
                <h3 className="role-card-title">{track.title}</h3>

                {/* Metadata Chips: Location, Duration, Credential */}
                <div className="role-meta-chips">
                  <span className="role-meta-chip">
                    <MapPin size={13} className="role-meta-icon" />
                    Pune &amp; Ahilyanagar
                  </span>
                  <span className="role-meta-chip">
                    <Clock size={13} className="role-meta-icon" />
                    {track.duration || "3 - 6 Months"}
                  </span>
                  <span className="role-meta-chip">
                    <Award size={13} className="role-meta-icon" />
                    Certificate + PPO
                  </span>
                </div>

                <p className="role-card-desc">{track.desc}</p>

                {/* Highlights Box */}
                <div className="role-card-highlights">
                  <div className="role-highlight-item">
                    <CheckCircle2 size={13} className="role-highlight-check" />
                    <span>{track.highlights?.[0] || "Live client project deliverables with senior code reviews"}</span>
                  </div>
                  <div className="role-highlight-item">
                    <CheckCircle2 size={13} className="role-highlight-check" />
                    <span>{track.highlights?.[1] || "Recommendation letter + full-time offer for top performers"}</span>
                  </div>
                </div>

                {/* Skills Pills */}
                <ul className="role-skills-pills">
                  {track.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>

                <div className="card-btn-group">
                  <button
                    type="button"
                    className="btn-card-secondary"
                    onClick={() => handleOpenTrackDetails(track)}
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    className="btn-card-primary"
                    onClick={() => handleOpenInternModal(track.title)}
                  >
                    <span>Apply now</span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Benefits Card */}
          <div className="ben card rv">
            <div className="bl">
              <h3>{copy?.benefitsTitle || "What every intern gets"}</h3>
              <p className="mut">
                <b>Duration:</b> {copy?.duration || "3 to 6 months"}
                <br />
                <b>Open to:</b> {copy?.eligibility || "final-year or recent BE, BTech, BCA, MCA or BSc (IT/CS/Cloud/AI) students"}
              </p>
              <button
                type="button"
                className="btn pri"
                onClick={() => handleOpenInternModal("Cloud & DevOps")}
              >
                Apply for internship &rarr;
              </button>
            </div>
            <ul className="ck">
              <li>A dedicated mentor and weekly one-to-one reviews</li>
              <li>Work on live projects, not practice exercises</li>
              <li>Internship certificate and recommendation letter</li>
              <li>Stipend, and a chance at a full-time offer for top performers</li>
              <li>Flexible schedule around college and exams</li>
              <li>Code reviews from senior engineers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="cta2">
        <div className="wrap">
          <div className="band rv">
            <div>
              <h3>Looking for a full-time role?</h3>
              <p className="mut">See our open positions in engineering, design and business.</p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link className="btn pri" to="/careers">
                View careers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <InternshipDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        track={selectedDetailsTrack}
        onApply={(trackTitle) => handleOpenInternModal(trackTitle)}
      />

      <InternshipApplicationModal
        isOpen={isInternModalOpen}
        onClose={() => setIsInternModalOpen(false)}
        initialTrack={selectedTrack}
      />
    </>
  );
}
