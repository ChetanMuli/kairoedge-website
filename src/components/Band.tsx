import React from "react";
import { Link } from "react-router-dom";

interface BandProps {
  title: string;
  description: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  className?: string;
}

export default function Band({
  title,
  description,
  primaryBtnText = "Let's talk",
  primaryBtnLink = "/contact",
  secondaryBtnText,
  secondaryBtnLink,
  className = ""
}: BandProps) {
  return (
    <div
      className={`cta-band card ${className}`}
      style={{
        background: "linear-gradient(135deg, color-mix(in srgb, var(--blue) 22%, var(--bg2)) 0%, var(--bg2) 100%)",
        borderColor: "color-mix(in srgb, var(--blue) 35%, var(--line))",
        borderRadius: "var(--card-radius)",
        padding: "48px 44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "32px",
        flexWrap: "wrap"
      }}
    >
      <div style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3 style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
          {title}
        </h3>
        <p style={{ fontSize: "16px", color: "var(--mut)", margin: 0, maxWidth: "54ch" }}>
          {description}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
        {primaryBtnText && (
          <Link to={primaryBtnLink} className="btn btn-primary">
            {primaryBtnText}
          </Link>
        )}
        {secondaryBtnText && secondaryBtnLink && (
          <Link to={secondaryBtnLink} className="btn btn-secondary">
            {secondaryBtnText}
          </Link>
        )}
      </div>
    </div>
  );
}
