import React, { useEffect } from "react";
import { X, GraduationCap, Clock, MapPin, Award, CheckCircle2, ArrowRight } from "lucide-react";

export interface InternshipTrackItem {
  id: string;
  title: string;
  desc: string;
  color?: string;
  skills: string[];
  duration?: string;
  overview?: string;
  curriculum?: string[];
  liveProject?: string;
  eligibility?: string;
}

interface InternshipDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: InternshipTrackItem | null;
  onApply: (trackTitle: string) => void;
}

export default function InternshipDetailsModal({
  isOpen,
  onClose,
  track,
  onApply
}: InternshipDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !track) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal-wrap" style={{ maxWidth: "720px" }}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="modal-header">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                className="fic"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "color-mix(in srgb, var(--sun) 18%, transparent)",
                  color: "var(--sun)"
                }}
              >
                <GraduationCap size={22} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <h3 style={{ margin: 0, fontSize: "1.4rem" }}>{track.title} Internship</h3>
                  <span
                    style={{
                      fontSize: "0.76rem",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "999px",
                      background: "color-mix(in srgb, var(--blue) 20%, transparent)",
                      color: "var(--ink)",
                      border: "1px solid var(--line)"
                    }}
                  >
                    Cohort 2026
                  </span>
                </div>
                <small style={{ color: "var(--mut)", fontSize: "0.85rem" }}>
                  Hands-on live product development at KairoEdge Pune
                </small>
              </div>
            </div>
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Info Grid */}
          <div className="details-spec-grid">
            <div className="details-spec-item">
              <span className="details-spec-label">Duration</span>
              <span className="details-spec-val" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Clock size={16} color="var(--sun)" /> {track.duration || "3 to 6 Months"}
              </span>
            </div>
            <div className="details-spec-item">
              <span className="details-spec-label">Location / Mode</span>
              <span className="details-spec-val" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={16} color="var(--sun)" /> Pune (In-Office / Hybrid)
              </span>
            </div>
            <div className="details-spec-item">
              <span className="details-spec-label">Benefits</span>
              <span className="details-spec-val" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Award size={16} color="var(--sun)" /> Stipend &amp; Certificate
              </span>
            </div>
          </div>

          {/* Track Overview */}
          <div className="details-section">
            <h4>Track Overview</h4>
            <p className="mut" style={{ fontSize: "0.96rem", lineHeight: 1.6, margin: 0 }}>
              {track.desc} This internship is designed for students and recent graduates who want to bridge the gap between classroom theory and production engineering. You will be paired with a senior mentor and ship real code to live systems.
            </p>
          </div>

          {/* What You'll Learn & Build */}
          <div className="details-section">
            <h4>What You Will Learn &amp; Practice</h4>
            <ul>
              {track.curriculum ? (
                track.curriculum.map((item, idx) => <li key={idx}>{item}</li>)
              ) : (
                <>
                  <li>Industry-standard architectural best practices for {track.title}.</li>
                  <li>Writing clean, modular code with version control (Git &amp; GitHub PR workflows).</li>
                  <li>Automated testing, debugging, and continuous integration pipelines.</li>
                  <li>Participating in sprint plannings, daily standups, and senior code reviews.</li>
                </>
              )}
            </ul>
          </div>

          {/* Live Project Experience */}
          <div className="details-section">
            <h4>Live Project Experience</h4>
            <p className="mut" style={{ fontSize: "0.94rem", lineHeight: 1.6, margin: 0 }}>
              {track.liveProject ||
                `Work on actual KairoEdge client platforms or internal product modules. Build scalable features, perform real deployments, and showcase the project in your portfolio upon completion.`}
            </p>
          </div>

          {/* Tools & Tech Stack */}
          <div className="details-section">
            <h4>Technologies &amp; Tools Covered</h4>
            <div className="tech-tag-wrap">
              {track.skills.map((s) => (
                <span key={s} className="tech-tag-pill">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Eligibility */}
          <div className="details-section">
            <h4>Eligibility &amp; Target Cohort</h4>
            <p className="mut" style={{ fontSize: "0.94rem", lineHeight: 1.6, margin: 0 }}>
              {track.eligibility ||
                "Open to 1st, 2nd, 3rd, 4th year students as well as recent graduates / post-graduates in B.E./B.Tech, B.Sc (Cloud Computing / Data Science / CS / IT), BCA, MCA, or related IT programs across Pune and Maharashtra."}
            </p>
          </div>

          {/* Bottom Action Footer */}
          <div className="details-modal-footer">
            <button
              type="button"
              className="btn"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn pri"
              onClick={() => {
                onClose();
                onApply(track.title);
              }}
            >
              <span>Apply for {track.title} Track</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
