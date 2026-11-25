import React from "react";
import { Link } from "react-router-dom";

interface PageHeroProps {
  pageName: string;
  title: string;
  lead: string;
  breadcrumb?: string;
}

export default function PageHero({
  pageName,
  title,
  lead,
  breadcrumb
}: PageHeroProps) {
  return (
    <section
      className="page-hero-section"
      style={{
        position: "relative",
        paddingTop: "150px",
        paddingBottom: "72px",
        borderBottom: "1px solid var(--line)",
        overflow: "hidden",
        backgroundColor: "var(--bg)"
      }}
    >
      {/* 56px grid pattern masked with radial fade */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(var(--line) 1px, transparent 1px),
            linear-gradient(90deg, var(--line) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)",
          opacity: 0.6,
          pointerEvents: "none"
        }}
      />

      {/* Two soft radial glows: blue top right, saffron bottom left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--blue) 0%, transparent 70%)",
          opacity: "var(--hg)",
          filter: "blur(60px)",
          pointerEvents: "none"
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-5%",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--sun) 0%, transparent 70%)",
          opacity: "var(--hg2)",
          filter: "blur(50px)",
          pointerEvents: "none"
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--mut)" }}>
            <Link to="/" style={{ color: "var(--mut)", textDecoration: "none", transition: "color 0.2s" }} className="hover-ink">
              Home
            </Link>
            <span>/</span>
            <span style={{ color: "var(--acc)", fontWeight: 600 }}>{breadcrumb || pageName}</span>
          </div>
        </nav>

        {/* H1 */}
        <h1
          style={{
            fontSize: "clamp(2.4rem, 5.6vw, 4.4rem)",
            fontWeight: 800,
            maxWidth: "22ch",
            marginBottom: "20px",
            lineHeight: 1.05
          }}
        >
          {title}
        </h1>

        {/* Lead */}
        <p
          style={{
            fontSize: "18.5px",
            lineHeight: 1.65,
            color: "var(--mut)",
            maxWidth: "58ch",
            margin: 0
          }}
        >
          {lead}
        </p>
      </div>

      <style>{`
        .hover-ink:hover {
          color: var(--ink) !important;
        }
      `}</style>
    </section>
  );
}
