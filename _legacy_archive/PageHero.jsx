import React from "react";
import HeroLive from "./HeroLive";

const scenes = {
  about: {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=85",
    live: "Engineering Studio · Pune",
    chips: [
      { title: "Pune Tech Center", sub: "Core Engineering Team", tag: "HQ · Studio", pos: "a" },
      { title: "System Architecture", sub: "Cloud Native Stack", tag: "Arch · Core", pos: "b" },
      { title: "Quality Benchmarks", sub: "Production Standards", tag: "QA · ISO", pos: "c" }
    ]
  },
  services: {
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=85",
    live: "Client Delivery Center",
    chips: [
      { title: "Web Engineering", sub: "React 19 & TypeScript", tag: "Frontend", pos: "a" },
      { title: "Cloud & DevOps", sub: "AWS Container Workflows", tag: "DevOps", pos: "b" },
      { title: "Security & IAM", sub: "Enterprise Compliance", tag: "Security", pos: "c" }
    ]
  },
  service: {
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=85",
    live: "Practice Practice",
    chips: [
      { title: "Sprint Deliverables", sub: "Production Quality", tag: "Build", pos: "a" },
      { title: "Cloud Deployment", sub: "Zero-Downtime Rollout", tag: "Launch", pos: "b" },
      { title: "Long-term Support", sub: "SLA Guaranteed", tag: "Support", pos: "c" }
    ]
  },
  industries: {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=85",
    live: "Vertical Solutions",
    chips: [
      { title: "Healthcare & HIPAA", sub: "Clinical Data Integrity", tag: "HealthTech", pos: "a" },
      { title: "Fintech Platforms", sub: "Secure Ledger Systems", tag: "Fintech", pos: "b" },
      { title: "Supply Chain", sub: "Logistics Optimization", tag: "Logistics", pos: "c" }
    ]
  },
  industry: {
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=85",
    live: "Industry Practice",
    chips: [
      { title: "Domain Architecture", sub: "Tailored Data Models", tag: "Industry", pos: "a" },
      { title: "Regulatory Adherence", sub: "Audited & Verified", tag: "Compliance", pos: "b" },
      { title: "Enterprise Scalability", sub: "High Concurrency", tag: "Scale", pos: "c" }
    ]
  },
  technology: {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=85",
    live: "Modern Tech Stack",
    chips: [
      { title: "Frontend Stack", sub: "React 19 & Next.js", tag: "UI · Web", pos: "a" },
      { title: "Backend Systems", sub: "Node.js & Python FastAPI", tag: "APIs", pos: "b" },
      { title: "Cloud Infrastructure", sub: "AWS, Docker & PostgreSQL", tag: "Cloud", pos: "c" }
    ]
  },
  process: {
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=85",
    live: "Agile Delivery Flow",
    chips: [
      { title: "Sprint 0 Discovery", sub: "Architecture & Schema", tag: "Step 01", pos: "a" },
      { title: "Continuous Integration", sub: "Weekly Testable Builds", tag: "Step 02", pos: "b" },
      { title: "Production Launch", sub: "Load Testing & Monitoring", tag: "Step 03", pos: "c" }
    ]
  },
  careers: {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=85",
    live: "Talent Acquisition · Pune",
    chips: [
      { title: "Engineering Roles", sub: "Full-Time Full Stack & Cloud", tag: "Careers", pos: "a" },
      { title: "Hybrid Culture", sub: "Pune Office & Flexibility", tag: "Workplace", pos: "b" },
      { title: "Rapid Growth", sub: "Competitive Compensation", tag: "Benefits", pos: "c" }
    ]
  },
  contact: {
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=85",
    live: "Inquiries Desk · Pune",
    chips: [
      { title: "Direct Communication", sub: "info@kairoedge.com", tag: "Email", pos: "a" },
      { title: "Fast Response", sub: "Within 24 Business Hours", tag: "Turnaround", pos: "b" },
      { title: "Pune Office", sub: "Maharashtra, India", tag: "Location", pos: "c" }
    ]
  },
  work: {
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=85",
    live: "Shipped Deliverables",
    chips: [
      { title: "Enterprise Dashboards", sub: "Financial Ledger Platform", tag: "Fintech", pos: "a" },
      { title: "Fleet Management", sub: "Real-time Telemetry Control", tag: "Logistics", pos: "b" },
      { title: "Healthcare Analytics", sub: "Operational Metrics", tag: "MedTech", pos: "c" }
    ]
  }
};

export default function PageHero({ kicker, title, text, children }) {
  const key = (kicker || "").toLowerCase().split(/[\s·]/)[0];
  const scene = scenes[key] || scenes.about;

  return (
    <header className="page-hero">
      <div className="hero-lights" aria-hidden="true">
        <span className="hero-grid" />
        <span className="hero-aura" />
      </div>
      <div className="container hero-layout page-hero-inner">
        <div>
          <p className="eyebrow">{kicker}</p>
          <h1>{title}</h1>
          {text ? <p className="lead">{text}</p> : null}
          {children}
        </div>
        <HeroLive image={scene.image} live={scene.live} chips={scene.chips} />
      </div>
    </header>
  );
}
