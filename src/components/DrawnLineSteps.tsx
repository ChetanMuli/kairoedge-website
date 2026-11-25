import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export interface StepItem {
  step: string;
  title: string;
  desc?: string;
  deliverables?: string;
  description?: string;
}

interface DrawnLineStepsProps {
  steps: StepItem[];
}

export default function DrawnLineSteps({ steps }: DrawnLineStepsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className={`steps-line-container ${revealed ? "is-drawn" : ""}`}
      style={{
        position: "relative",
        width: "100%",
        marginTop: "32px",
        marginBottom: "16px"
      }}
    >
      {/* Horizontal drawn line behind steps (desktop) */}
      <div
        className="horizontal-drawn-line"
        style={{
          position: "absolute",
          top: "23px",
          left: "24px",
          right: "24px",
          height: "2px",
          backgroundColor: "var(--line)",
          zIndex: 0
        }}
      >
        <div
          style={{
            height: "100%",
            width: revealed ? "100%" : "0%",
            background: "linear-gradient(90deg, var(--sun) 0%, var(--blue) 100%)",
            transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        />
      </div>

      {/* Grid of steps */}
      <div
        className="steps-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
          gap: "28px",
          position: "relative",
          zIndex: 1
        }}
      >
        {steps.map((s, idx) => (
          <div
            key={s.step}
            className="step-card"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + idx * 0.15}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + idx * 0.15}s`
            }}
          >
            {/* Step circle / indicator with glowing saffron dot */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "50%",
                  backgroundColor: "var(--bg2)",
                  border: "2px solid var(--sun)",
                  boxShadow: "0 0 16px rgba(255, 181, 71, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "15px",
                  color: "var(--sun)",
                  flexShrink: 0
                }}
              >
                {s.step}
              </div>
            </div>

            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--ink)",
                margin: 0
              }}
            >
              {s.title}
            </h4>

            {s.deliverables && (
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--acc)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em"
                }}
              >
                {s.deliverables}
              </span>
            )}

            <p style={{ fontSize: "14.5px", color: "var(--mut)", lineHeight: 1.6, margin: 0 }}>
              {s.desc || s.description}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .horizontal-drawn-line {
            display: none !important;
          }
          .steps-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}
