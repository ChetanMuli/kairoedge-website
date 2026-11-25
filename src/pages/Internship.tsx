import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import InternshipApplicationModal from "../components/InternshipApplicationModal";
import InternshipDetailsModal, { InternshipTrackItem } from "../components/InternshipDetailsModal";
import SectionHeroCard from "../components/SectionHeroCard";
import { useCopy } from "../context/SiteData";

const TRACKS: (InternshipTrackItem & { iconSvg: React.ReactNode })[] = [
  {
    id: "cloud-devops",
    title: "Cloud & DevOps",
    desc: "Learn AWS, Linux and automation by running real deployments.",
    skills: ["AWS", "Terraform", "CI/CD"],
    duration: "3 to 6 Months",
    curriculum: [
      "AWS core infrastructure: EC2 compute, S3 storage, VPC networking, IAM security, and RDS.",
      "Linux server administration, shell scripting, and service management.",
      "Docker container creation, multi-stage builds, and Docker Compose environments.",
      "Infrastructure as Code with Terraform and automated CI/CD deployment pipelines."
    ],
    liveProject: "Build an automated continuous integration and delivery pipeline for high-availability multi-tier cloud apps on AWS.",
    eligibility: "Students & freshers in Computer Science, IT, Cloud Computing, or E&TC.",
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z" />
      </svg>
    )
  },
  {
    id: "full-stack",
    title: "Full-stack web",
    desc: "Build features end to end, from database to responsive interface.",
    skills: ["React", "Node.js", "MySQL"],
    duration: "3 to 6 Months",
    curriculum: [
      "Modern React 18 with TypeScript component architecture, hooks, and clean state handling.",
      "Node.js & Express RESTful API design, authentication, and validation middleware.",
      "Relational database design in MySQL/PostgreSQL, indexing, and performant query execution.",
      "Team Git workflows, code reviews, and production cloud deployments."
    ],
    liveProject: "Develop an end-to-end customer portal with authentication, live dashboards, and database persistence.",
    eligibility: "Students & graduates with core JavaScript, HTML/CSS, and database fundamentals.",
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14" />
      </svg>
    )
  },
  {
    id: "mobile-apps",
    title: "Mobile apps",
    desc: "Ship Android and iOS screens with a shared Flutter codebase.",
    skills: ["Flutter", "Dart", "REST APIs"],
    duration: "3 to 6 Months",
    curriculum: [
      "Flutter framework architecture, widget lifecycle, and reactive state management.",
      "Dart OOP concepts, asynchronous programming with Futures and Streams.",
      "Consuming backend REST APIs, caching, and handling offline device persistence.",
      "Building responsive layouts across Android and iOS phones and tablets."
    ],
    liveProject: "Build and test a cross-platform mobile app with offline-first caching and release-ready bundles.",
    eligibility: "Students passionate about mobile application development and Dart.",
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2" />
      </svg>
    )
  },
  {
    id: "uiux-design",
    title: "UI/UX design",
    desc: "Turn user research into wireframes, prototypes and design systems.",
    skills: ["Figma", "Wireframes", "Design Systems"],
    duration: "3 to 6 Months",
    curriculum: [
      "User research, personas, information architecture, and user journey mapping.",
      "Wireframing, rapid paper-to-digital prototyping, and usability testing.",
      "Component design systems in Figma using auto-layout, variants, and design tokens.",
      "Accessibility (WCAG AA) standards, responsive grids, and developer handoff documentation."
    ],
    liveProject: "Design an entire SaaS web & mobile dashboard with interactive prototypes and an exhaustive design system.",
    eligibility: "Students & graduates interested in digital product design, Figma, and human-computer interaction.",
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
      </svg>
    )
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

          <div className="tracks">
            {TRACKS.map((track) => (
              <article key={track.id} className="card rv">
                <div className="ic">
                  {track.iconSvg}
                </div>
                <h3>{track.title}</h3>
                <p className="mut">{track.desc}</p>
                <ul>
                  {track.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
                <div className="track-card-footer">
                  <button
                    type="button"
                    className="btn-card-primary"
                    onClick={() => handleOpenInternModal(track.title)}
                  >
                    <span>Apply for track</span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                  <button
                    type="button"
                    className="btn-card-secondary"
                    onClick={() => handleOpenTrackDetails(track)}
                  >
                    View Details
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
