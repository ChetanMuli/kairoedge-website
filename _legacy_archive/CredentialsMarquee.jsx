import React from "react";

const credentials = [
  {
    badge: "AWS CLOUD",
    title: "AWS Solutions Architecture",
    desc: "Cloud-native microservices, ECS, RDS, and automated CI/CD infrastructure"
  },
  {
    badge: "SECURITY",
    title: "ISO/IEC 27001 Certified Practice",
    desc: "Enterprise-grade data encryption, access control, and privacy standards"
  },
  {
    badge: "COMPLIANCE",
    title: "SOC-2 Type II Framework",
    desc: "Strict operational security, availability, and audit logging compliance"
  },
  {
    badge: "MICROSOFT",
    title: "Azure & Enterprise Integration",
    desc: "Active Directory, enterprise SSO, and scalable cloud workload deployment"
  },
  {
    badge: "FULL-STACK",
    title: "React 19 & TypeScript Stack",
    desc: "High-performance reactive frontend interfaces with type-safe state systems"
  },
  {
    badge: "SERVICES",
    title: "Node.js & Python Microservices",
    desc: "High-throughput REST/GraphQL APIs, Redis caching, and async pipelines"
  },
  {
    badge: "DEVOPS",
    title: "Docker & Kubernetes Clusters",
    desc: "Zero-downtime rolling deployments, container orchestration, and telemetry"
  },
  {
    badge: "DATABASES",
    title: "PostgreSQL & Scalable Data",
    desc: "ACID-compliant relational architectures, query optimization, and backups"
  },
  {
    badge: "SLA",
    title: "99.98% High Availability SLA",
    desc: "Production-grade uptime guarantee with 24/7 proactive monitoring"
  },
  {
    badge: "IP OWNERSHIP",
    title: "100% Client Code Ownership",
    desc: "Complete handover of source repositories, cloud infrastructure, and docs"
  },
  {
    badge: "LOCATION",
    title: "Pune Engineering Center",
    desc: "Direct in-house engineering team headquartered in Pune, Maharashtra"
  }
];

export default function CredentialsMarquee() {
  return (
    <section className="creds-section" aria-label="Enterprise Credentials and Production Ecosystem">
      <div className="container creds-header">
        <div className="creds-eyebrow-wrap">
          <span className="creds-dot" aria-hidden="true" />
          <span className="creds-eyebrow">Enterprise Credentials &amp; Technology Ecosystem</span>
        </div>
        <p className="creds-subtitle">
          Engineered to institutional standards with verified cloud architecture, security frameworks, and strict delivery governance.
        </p>
      </div>

      <div className="creds-marquee-track-outer">
        <div className="creds-marquee-track">
          {/* First loop of credentials */}
          {credentials.map((cred, idx) => (
            <div key={`c1-${idx}`} className="cred-card">
              <div className="cred-card-top">
                <span className="cred-badge">{cred.badge}</span>
                <span className="cred-indicator" aria-hidden="true" />
              </div>
              <h4 className="cred-title">{cred.title}</h4>
              <p className="cred-desc">{cred.desc}</p>
            </div>
          ))}

          {/* Mirrored loop for seamless continuous scrolling */}
          {credentials.map((cred, idx) => (
            <div key={`c2-${idx}`} className="cred-card" aria-hidden="true">
              <div className="cred-card-top">
                <span className="cred-badge">{cred.badge}</span>
                <span className="cred-indicator" aria-hidden="true" />
              </div>
              <h4 className="cred-title">{cred.title}</h4>
              <p className="cred-desc">{cred.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
