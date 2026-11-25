import React from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export default function Accordion({ items, className = "" }: AccordionProps) {
  return (
    <div className={`accordion-wrap ${className}`} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {items.map((item, idx) => (
        <details
          key={idx}
          className="faq-details"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: "18px",
            padding: "24px 28px",
            boxShadow: "var(--sh)",
            transition: "border-color 0.2s ease, background-color 0.2s ease",
            overflow: "hidden"
          }}
        >
          <summary
            style={{
              listStyle: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              fontWeight: 700,
              fontSize: "17.5px",
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.015em",
              color: "var(--ink)",
              userSelect: "none"
            }}
          >
            <span>{item.question}</span>
            <span
              className="faq-icon"
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "color-mix(in srgb, var(--blue) 12%, transparent)",
                color: "var(--blue)",
                fontSize: "20px",
                fontWeight: 600,
                flexShrink: 0,
                transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease"
              }}
            >
              +
            </span>
          </summary>
          <div
            style={{
              paddingTop: "16px",
              marginTop: "12px",
              borderTop: "1px solid var(--line)",
              color: "var(--mut)",
              fontSize: "16px",
              lineHeight: 1.65
            }}
          >
            <p style={{ margin: 0, maxWidth: "none" }}>{item.answer}</p>
          </div>
        </details>
      ))}

      <style>{`
        details summary::-webkit-details-marker {
          display: none;
        }
        details[open] {
          border-color: color-mix(in srgb, var(--blue) 40%, var(--line));
        }
        details[open] .faq-icon {
          transform: rotate(45deg);
          background-color: var(--blue);
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
