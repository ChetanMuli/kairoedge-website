import React, { useState } from "react";

const fallbackHeroMap = {
  about: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=85",
  product: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=85",
  services: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=85",
  web: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=85",
  cloud: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=85",
  industries: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=85",
  healthcare: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=85",
  fintech: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=85",
  data: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=85",
  technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=85",
  process: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=85",
  careers: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=85",
  contact: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=85",
  work: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=85",
  delivery: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=85",
  default: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=85"
};

export default function HeroLive({
  image = "",
  live = "Operations Live · Pune",
  chips = null
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Resolve image if it's an svg or empty
  let targetImage = image;
  if (!image || image.endsWith(".svg") || error) {
    const foundKey = Object.keys(fallbackHeroMap).find((k) => image && image.toLowerCase().includes(k));
    targetImage = foundKey ? fallbackHeroMap[foundKey] : fallbackHeroMap.default;
  }

  // Default chips if not passed
  const displayChips = chips || [
    { title: "Cloud & DevOps", sub: "Automated CI/CD Pipelines", tag: "AWS · Cloud", pos: "a" },
    { title: "AI & Automation", sub: "Intelligent Workflows", tag: "AI · ML", pos: "b" },
    { title: "Security First", sub: "Role-Based Access Control", tag: "SEC · IAM", pos: "c" }
  ];

  return (
    <div className="hero-stage">
      {!imageLoaded && <div className="hero-stage-shimmer" />}
      <img
        src={targetImage}
        alt="KairoEdge Software Engineering Operations Console"
        onLoad={() => setImageLoaded(true)}
        onError={() => setError(true)}
        className={imageLoaded ? "is-loaded" : "is-loading"}
      />
      <div className="hero-scan" aria-hidden="true" />

      {/* Live Status Badge */}
      <div className="hero-live">
        <i /> {live}
      </div>

      {/* Floating Glassmorphism Metric Chips */}
      {displayChips.map((chip, idx) => {
        const posClass = chip.pos || ["a", "b", "c"][idx % 3];
        const tag = chip.tag || (Array.isArray(chip) ? chip[0] : "TECH");
        const title = chip.title || (Array.isArray(chip) ? chip[0] : "Engineering");
        const sub = chip.sub || (Array.isArray(chip) ? "Enterprise Stack" : "Production Grade");

        return (
          <div key={idx} className={`float-chip ${posClass}`}>
            <div className="float-chip-icon">{tag}</div>
            <div className="float-chip-text">
              <strong>{title}</strong>
              <small>{sub}</small>
            </div>
          </div>
        );
      })}

      {/* Bottom telemetry overlay */}
      <div className="hero-telemetry">
        <div className="telemetry-item">
          <strong>99.98%</strong>
          <span>System Uptime</span>
        </div>
        <div className="telemetry-divider" />
        <div className="telemetry-item">
          <strong>100%</strong>
          <span>Client Code Ownership</span>
        </div>
        <div className="telemetry-divider" />
        <div className="telemetry-item">
          <strong>SOC-2</strong>
          <span>Standard Practices</span>
        </div>
      </div>
    </div>
  );
}
