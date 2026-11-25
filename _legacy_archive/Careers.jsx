import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import ApplyModal from "../components/ApplyModal";
import { useCopy, useSite } from "../context/SiteData";

const filters = [
  { id: "jobs", label: "Full-Time Roles", text: "jobsText", match: (job) => job.type.startsWith("Full-time") },
  { id: "internship", label: "Internships", text: "internshipText", match: (job) => job.type.includes("Internship") }
];

export default function Careers() {
  const { jobs = [] } = useSite();
  const copy = useCopy("careers");
  const [active, setActive] = useState("jobs");
  const [search, setSearch] = useState("");
  const [applyingJob, setApplyingJob] = useState(null);

  const section = filters.find((item) => item.id === active) || filters[0];

  const filteredItems = jobs
    .filter(section.match)
    .filter((job) => {
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return (
        job.title.toLowerCase().includes(term) ||
        job.summary.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term)
      );
    });

  const fullTimeCount = jobs.filter((j) => j.type.startsWith("Full-time")).length;
  const internCount = jobs.filter((j) => j.type.includes("Internship")).length;

  useEffect(() => {
    document.title = "Careers & Internships · KairoEdge Technologies";
  }, []);

  return (
    <>
      <PageHero
        kicker={copy.kicker || "Careers & Opportunities"}
        title={copy.title || "Build the future of digital engineering with us."}
        text={copy.text || "Explore impactful software engineering roles and hands-on internships in Pune."}
      />
      <section className="section">
        <div className="container">
          {/* Specialized Banner for Student Internships */}
          <div
            style={{
              background: "linear-gradient(135deg, #071522 0%, #0284c7 100%)",
              color: "#ffffff",
              borderRadius: "16px",
              padding: "24px 28px",
              marginBottom: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
              boxShadow: "0 10px 30px -6px rgba(2, 132, 199, 0.28)"
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#bae6fd",
                  marginBottom: "4px"
                }}
              >
                University Students &amp; Graduates
              </span>
              <h3 style={{ margin: "0 0 4px", fontSize: "20px", color: "#ffffff", fontWeight: 700 }}>
                Looking for 3-Month or 6-Month Engineering Internships?
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "rgba(255, 255, 255, 0.88)", maxWidth: "640px", lineHeight: 1.5 }}>
                Visit our dedicated Internship Portal featuring 8 technology tracks, college registration, real-time application tracking, and Pre-Placement Offer (PPO) opportunities.
              </p>
            </div>
            <Link
              to="/internship"
              className="btn-intern-primary"
              style={{ whiteSpace: "nowrap", padding: "12px 24px", fontSize: "14px" }}
            >
              Explore Internship Portal →
            </Link>
          </div>

          {/* Controls: Category Switcher & Search Bar */}
          <div className="careers-toolbar">
            <div className="career-switch" role="tablist" aria-label="Career paths" style={{ marginBottom: 0 }}>
              {filters.map((item) => {
                const count = item.id === "jobs" ? fullTimeCount : internCount;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    className={active === item.id ? "is-on" : ""}
                    aria-selected={active === item.id}
                    onClick={() => setActive(item.id)}
                  >
                    {item.label} ({count})
                  </button>
                );
              })}
            </div>

            <div className="careers-search-box">
              <input
                type="search"
                placeholder="Search roles by title, skills, or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <p className="lead career-note">{copy[section.text]}</p>

          {/* Modern Job Cards Grid */}
          <div className="jobs-modern-grid">
            {filteredItems.map((job) => {
              const isIntern = job.type.includes("Internship");
              const perks = isIntern
                ? ["Live Client Projects", "1-on-1 Mentorship", "Certificate & PPO Opportunity", "Flexible Schedule"]
                : ["Hybrid Office & Remote", "Rapid Growth & Equity", "React 19 & Cloud Native Stack", "Team Retreats"];

              return (
                <article className="job-card-modern" key={job.slug}>
                  <div>
                    <div className="job-card-top">
                      <div className="job-pill-row">
                        <span className={`job-kind-badge ${isIntern ? "internship" : "job"}`}>
                          {isIntern ? "Internship" : "Full-Time Position"}
                        </span>
                        <span className="job-location-badge">{job.location}</span>
                      </div>
                    </div>

                    <h2 className="job-card-title">{job.title}</h2>
                    <p className="job-card-summary">{job.summary}</p>

                    <div className="job-perks-row">
                      {perks.map((perk) => (
                        <span key={perk} className="job-perk-pill">{perk}</span>
                      ))}
                    </div>
                  </div>

                  <div className="job-card-bottom">
                    <div className="job-card-bottom-actions">
                      <button
                        type="button"
                        className="btn-job-apply"
                        onClick={() => setApplyingJob(job)}
                      >
                        Apply Now
                      </button>
                      <Link
                        className="btn-job-details"
                        to={`/careers/${job.slug}`}
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}

            {!filteredItems.length ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: "48px 24px",
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px dashed rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px"
                }}
              >
                <p className="lead" style={{ opacity: 0.8, marginBottom: "12px" }}>
                  No active openings match your current search.
                </p>
                <button
                  type="button"
                  className="btn-job-details"
                  style={{ width: "auto" }}
                  onClick={() => {
                    setSearch("");
                  }}
                >
                  Clear Search
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Standalone MNC-Style Popup Application Modal */}
      <ApplyModal
        job={applyingJob}
        isOpen={Boolean(applyingJob)}
        onClose={() => setApplyingJob(null)}
      />
    </>
  );
}
