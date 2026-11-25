import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ApplyModal from "../components/ApplyModal";
import { useSite } from "../context/SiteData";

export default function CareerDetail() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { jobs = [] } = useSite();
  const job = jobs.find((item) => item.slug === slug);

  const [isModalOpen, setIsModalOpen] = useState(
    searchParams.get("apply") === "true"
  );

  useEffect(() => {
    document.title = job ? `${job.title} · KairoEdge Careers` : "Careers · KairoEdge";
  }, [job]);

  if (!job) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2>Opening Not Found</h2>
          <p className="lead" style={{ marginTop: "12px", marginBottom: "24px" }}>
            The job or internship position you are looking for is no longer active.
          </p>
          <Link className="btn-job-apply" to="/careers" style={{ display: "inline-flex", width: "auto" }}>
            ← View All Openings
          </Link>
        </div>
      </div>
    );
  }

  const isInternship = job.type.includes("Internship");
  const blocks = (job.description || "").split("\n\n");

  return (
    <>
      {/* MNC Breadcrumb & Hero */}
      <section className="mnc-detail-hero">
        <div className="container">
          <div className="mnc-detail-breadcrumb">
            <Link to="/careers">← Careers</Link>
            <span>/</span>
            <span>{isInternship ? "Internships" : "Engineering"}</span>
            <span>/</span>
            <span style={{ color: "#ffffff" }}>{job.title}</span>
          </div>

          <div className="mnc-hero-content">
            <div className="mnc-hero-title-group">
              <div className="mnc-hero-meta-row">
                <span className={`job-kind-badge ${isInternship ? "internship" : "job"}`}>
                  {isInternship ? "Internship" : "Full-Time Position"}
                </span>
                <span className="mnc-hero-meta-item">{job.location}</span>
                <span className="mnc-hero-meta-item">Hybrid (Office + Remote)</span>
                <span className="mnc-hero-meta-item">Pune Delivery Center</span>
              </div>
              <h1>{job.title}</h1>
              <p style={{ color: "#94a3b8", fontSize: "16px", maxWidth: "780px", lineHeight: 1.6, margin: 0 }}>
                {job.summary}
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                type="button"
                className="btn-job-apply"
                style={{ width: "auto", minWidth: "180px", padding: "12px 26px", fontSize: "14px" }}
                onClick={() => setIsModalOpen(true)}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main MNC Content Grid */}
      <section className="section" style={{ paddingTop: "20px" }}>
        <div className="container">
          <div className="mnc-role-grid">
            {/* Left Column: Role Details */}
            <main className="mnc-role-main">
              {/* Dynamic Description Blocks */}
              {blocks.map((block, idx) => {
                const lines = block.split("\n").filter(Boolean);
                if (lines.length > 1) {
                  const heading = lines[0];
                  const items = lines.slice(1);
                  return (
                    <article className="mnc-content-card" key={idx}>
                      <h2>{heading}</h2>
                      <ul>
                        {items.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </article>
                  );
                }
                return (
                  <article className="mnc-content-card" key={idx}>
                    <h2>About this Position</h2>
                    <p>{block}</p>
                  </article>
                );
              })}

              {/* What We Offer / MNC Perks */}
              <article className="mnc-content-card">
                <h2>What We Offer & Culture</h2>
                <p>
                  At KairoEdge Technologies, we build operational software for healthcare, fintech, logistics, and enterprise. You will work alongside experienced system architects in Pune and build features that directly impact client operations.
                </p>
                <div className="mnc-perks-grid">
                  <div className="mnc-perk-box">
                    Live Production Workloads
                  </div>
                  <div className="mnc-perk-box">
                    1-on-1 Senior Mentorship
                  </div>
                  <div className="mnc-perk-box">
                    Certificate & PPO Opportunities
                  </div>
                  <div className="mnc-perk-box">
                    React 19 & Cloud Native Stack
                  </div>
                  <div className="mnc-perk-box">
                    Modern Pune Tech Lab
                  </div>
                  <div className="mnc-perk-box">
                    Transparent Engineering Reviews
                  </div>
                </div>
              </article>

              {/* Bottom Apply Card */}
              <div
                style={{
                  padding: "32px",
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, rgba(29, 111, 224, 0.12) 0%, rgba(2, 132, 199, 0.08) 100%)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "20px"
                }}
              >
                <div>
                  <h3 style={{ fontSize: "20px", color: "#ffffff", margin: "0 0 6px" }}>
                    Ready to make an impact?
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                    Applications are reviewed on a rolling basis. Quick 1-minute form with instant confirmation.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button
                    type="button"
                    className="btn-job-apply"
                    style={{ width: "auto", minWidth: "160px", padding: "12px 22px" }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Apply for this Role
                  </button>
                  <Link
                    to="/careers"
                    className="btn-job-details"
                    style={{ width: "auto", padding: "12px 18px" }}
                  >
                    All Openings
                  </Link>
                </div>
              </div>
            </main>

            {/* Right Column: Sticky Sidebar Snapshot */}
            <aside className="mnc-role-sidebar">
              {/* Snapshot Card */}
              <div className="mnc-snapshot-card">
                <div className="mnc-snapshot-header">
                  <span>Job Snapshot</span>
                  <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: 600 }}>Actively Hiring</span>
                </div>

                <div className="mnc-snapshot-list">
                  <div className="mnc-snapshot-item">
                    <span className="mnc-snapshot-label">Requisition ID</span>
                    <span className="mnc-snapshot-value">KE-PUN-{job.slug.toUpperCase().slice(0, 10)}</span>
                  </div>
                  <div className="mnc-snapshot-item">
                    <span className="mnc-snapshot-label">Employment Type</span>
                    <span className="mnc-snapshot-value">{job.type}</span>
                  </div>
                  <div className="mnc-snapshot-item">
                    <span className="mnc-snapshot-label">Location</span>
                    <span className="mnc-snapshot-value">{job.location}</span>
                  </div>
                  <div className="mnc-snapshot-item">
                    <span className="mnc-snapshot-label">Work Model</span>
                    <span className="mnc-snapshot-value">Hybrid (Office + Remote)</span>
                  </div>
                  <div className="mnc-snapshot-item">
                    <span className="mnc-snapshot-label">Department</span>
                    <span className="mnc-snapshot-value">Digital Engineering</span>
                  </div>
                  <div className="mnc-snapshot-item">
                    <span className="mnc-snapshot-label">Experience</span>
                    <span className="mnc-snapshot-value">{isInternship ? "Students / Freshers" : "0–2 Years"}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-job-apply"
                  style={{ width: "100%", height: "44px", fontSize: "14px" }}
                  onClick={() => setIsModalOpen(true)}
                >
                  Apply for this Role
                </button>
              </div>

              {/* Selection Process Card */}
              <div className="mnc-process-card">
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                  Selection Process
                </div>
                <div className="mnc-process-steps">
                  <div className="mnc-process-step">
                    <div className="mnc-step-num">1</div>
                    <div className="mnc-step-content">
                      <div className="mnc-step-title">Online Application</div>
                      <div className="mnc-step-desc">Fill out basic details, optional college info & attach resume.</div>
                    </div>
                  </div>
                  <div className="mnc-process-step">
                    <div className="mnc-step-num">2</div>
                    <div className="mnc-step-content">
                      <div className="mnc-step-title">Profile Screening</div>
                      <div className="mnc-step-desc">Our talent team reviews your GitHub, projects, and coursework.</div>
                    </div>
                  </div>
                  <div className="mnc-process-step">
                    <div className="mnc-step-num">3</div>
                    <div className="mnc-step-content">
                      <div className="mnc-step-title">Technical Discussion</div>
                      <div className="mnc-step-desc">Hands-on problem solving and code review with a senior lead.</div>
                    </div>
                  </div>
                  <div className="mnc-process-step">
                    <div className="mnc-step-num">4</div>
                    <div className="mnc-step-content">
                      <div className="mnc-step-title">Offer & Onboarding</div>
                      <div className="mnc-step-desc">Formal offer letter, mentor assignment, and project onboarding.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campus Relations Callout */}
              <div
                style={{
                  background: "rgba(56, 189, 248, 0.05)",
                  border: "1px solid rgba(56, 189, 248, 0.2)",
                  borderRadius: "14px",
                  padding: "16px",
                  fontSize: "13px",
                  color: "#cbd5e1",
                  lineHeight: 1.5
                }}
              >
                <div style={{ fontWeight: 600, color: "#38bdf8", marginBottom: "4px" }}>
                  College & Campus Hiring
                </div>
                Are you an engineering student? We accept applications across affiliated colleges. Select your campus in the apply popup or enter your college name!
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Standalone Popup Application Modal */}
      <ApplyModal
        job={job}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
