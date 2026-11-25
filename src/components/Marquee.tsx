import React from "react";

const marqueeItems = [
  "Cloud & DevOps on AWS",
  "React 19 & Next.js Platforms",
  "Flutter iOS & Android Apps",
  "AI Assistants & Document LLMs",
  "Zero-Downtime Releases",
  "Automated CI/CD Pipelines",
  "Security Audits & ISO/IEC 27001",
  "Figma Design Systems & UI/UX",
  "High-Availability PostgreSQL"
];

export default function Marquee() {
  return (
    <div
      className="marquee-container"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        padding: "24px 0",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        backgroundColor: "var(--bg)",
        userSelect: "none",
        maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)"
      }}
      aria-label="Core Engineering Practices"
    >
      <div
        className="marquee-track"
        style={{
          display: "flex",
          gap: "48px",
          width: "max-content",
          animation: "marqueeScroll 38s linear infinite"
        }}
      >
        {marqueeItems.concat(marqueeItems).map((text, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              fontFamily: "var(--font-heading)",
              fontSize: "19px",
              fontWeight: 700,
              letterSpacing: "-0.015em",
              color: "var(--mut)",
              whiteSpace: "nowrap"
            }}
          >
            <span>{text}</span>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "var(--sun)",
                opacity: 0.85
              }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      <style>{`
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
