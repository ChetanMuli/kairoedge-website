import React from "react";

interface SectionHeadProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function SectionHead({
  eyebrow,
  title,
  description,
  action,
  className = ""
}: SectionHeadProps) {
  return (
    <div
      className={`section-head ${className}`}
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "24px",
        marginBottom: "44px",
        flexWrap: "wrap"
      }}
    >
      <div style={{ maxWidth: "640px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {eyebrow && (
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--acc)",
              display: "inline-block"
            }}
          >
            {eyebrow}
          </span>
        )}
        <h2>{title}</h2>
      </div>

      {(description || action) && (
        <div style={{ maxWidth: "420px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {description && <p style={{ fontSize: "16px", color: "var(--mut)", margin: 0 }}>{description}</p>}
          {action}
        </div>
      )}
    </div>
  );
}
