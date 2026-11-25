import React, { useEffect } from "react";
import { X, Briefcase, MapPin, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export interface JobDetailItem {
  id: string;
  category: "eng" | "des" | "biz";
  categoryLabel: string;
  title: string;
  desc: string;
  color: string;
  tags: string[];
  roleParam: string;
  iconPath?: string;
  experience?: string;
  location?: string;
  responsibilities?: string[];
  requirements?: string[];
  whatWeOffer?: string[];
}

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: JobDetailItem | null;
  onApply: (roleTitle: string) => void;
}

export default function JobDetailsModal({
  isOpen,
  onClose,
  role,
  onApply
}: JobDetailsModalProps) {
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

  if (!isOpen || !role) return null;

  const defaultResponsibilities = [
    `Lead technical design and hands-on execution for the ${role.title} discipline.`,
    "Collaborate directly with cross-functional engineers, product designers, and client stakeholders in Pune.",
    "Write reliable, well-tested, production-ready code with continuous automated integration and testing.",
    "Participate in daily standups, code reviews, architectural discussions, and sprint retrospectives.",
    "Help mentor junior developers and contribute to KairoEdge engineering best practices."
  ];

  const defaultRequirements = [
    "Bachelor's or Master's degree in Computer Science, IT, Engineering, or demonstrable equivalent industry experience.",
    "Proven track record or strong portfolio of shipped applications / production deployments.",
    "Deep understanding of core engineering principles, security standards, and modern development tools.",
    "Strong verbal and written technical communication skills."
  ];

  const defaultOffers = [
    "Competitive salary benchmarked to Pune technology standards.",
    "Direct mentorship from senior technical leads and architects.",
    "Live client deployments across India, UAE, and international markets.",
    "Annual certification and professional learning budget.",
    "Flexible hybrid working environment with healthy work-life balance."
  ];

  const responsibilities = role.responsibilities || defaultResponsibilities;
  const requirements = role.requirements || defaultRequirements;
  const whatWeOffer = role.whatWeOffer || defaultOffers;

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
                  background: `color-mix(in srgb, ${role.color} 18%, transparent)`,
                  color: role.color
                }}
              >
                <Briefcase size={22} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <h3 style={{ margin: 0, fontSize: "1.4rem" }}>{role.title}</h3>
                  <span
                    style={{
                      fontSize: "0.76rem",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "999px",
                      background: `color-mix(in srgb, ${role.color} 20%, transparent)`,
                      color: role.color,
                      border: `1px solid color-mix(in srgb, ${role.color} 35%, transparent)`
                    }}
                  >
                    {role.categoryLabel}
                  </span>
                </div>
                <small style={{ color: "var(--mut)", fontSize: "0.85rem" }}>
                  KairoEdge Technologies Pvt Ltd &bull; Job Description &amp; Specifications
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
              <span className="details-spec-label">Location</span>
              <span className="details-spec-val" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={16} color="var(--sun)" /> Pune, India (Hybrid)
              </span>
            </div>
            <div className="details-spec-item">
              <span className="details-spec-label">Employment Type</span>
              <span className="details-spec-val" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Clock size={16} color="var(--sun)" /> Full-Time
              </span>
            </div>
            <div className="details-spec-item">
              <span className="details-spec-label">Experience</span>
              <span className="details-spec-val">
                {role.experience || "1 - 4 Years (Freshers with strong skills welcome)"}
              </span>
            </div>
          </div>

          {/* About the Role */}
          <div className="details-section">
            <h4>About the Position</h4>
            <p className="mut" style={{ fontSize: "0.96rem", lineHeight: 1.6, margin: 0 }}>
              {role.desc} At KairoEdge, our engineers and specialists take direct ownership of real-world products, working closely with senior leadership to deliver measurable customer impact from day one.
            </p>
          </div>

          {/* Key Responsibilities */}
          <div className="details-section">
            <h4>Key Responsibilities</h4>
            <ul>
              {responsibilities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Requirements & Skills */}
          <div className="details-section">
            <h4>Candidate Profile &amp; Qualifications</h4>
            <ul>
              {requirements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Tech Stack / Tags */}
          <div className="details-section">
            <h4>Core Technologies &amp; Tools</h4>
            <div className="tech-tag-wrap">
              {role.tags.map((t) => (
                <span key={t} className="tech-tag-pill">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* What We Offer */}
          <div className="details-section">
            <h4>What We Offer</h4>
            <ul>
              {whatWeOffer.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
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
                onApply(role.title);
              }}
            >
              <span>Apply for {role.title}</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
