import React, { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export type SectionVariant =
  | "services"
  | "work"
  | "industries"
  | "internship"
  | "careers"
  | "insights"
  | "about"
  | "contact";

interface TabItem {
  k: string;
  c: string;
  t: string;
  cmd: string;
  ls: string[];
  f1: string;
  f2: string;
  iconPath: string;
}

const SECTION_CONFIGS: Record<
  SectionVariant,
  {
    headerTitle: string;
    tabs: TabItem[];
  }
> = {
  services: {
    headerTitle: "kairoedge · services stack",
    tabs: [
      {
        k: "Cloud",
        c: "#3B82F6",
        t: "Cloud & DevOps",
        cmd: "kairo deploy --env prod --zero-downtime",
        ls: [
          "AWS VPC, EC2 & RDS infrastructure active",
          "Automated Terraform pipelines verified",
          "Zero-downtime rolling release live"
        ],
        f1: "Production SLA <b>99.9%</b>",
        f2: "AWS, Terraform, Docker",
        iconPath: "M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z"
      },
      {
        k: "Web",
        c: "#8B5CF6",
        t: "Full-Stack Web",
        cmd: "npm run test && npm run ship",
        ls: [
          "React 18 & TypeScript app compiled",
          "REST APIs & relational database connected",
          "Production bundle optimized & verified"
        ],
        f1: "Web app <b>shipped</b>",
        f2: "React, Node.js, MySQL",
        iconPath: "m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"
      },
      {
        k: "Mobile",
        c: "#14B8A6",
        t: "Mobile Apps",
        cmd: "flutter build ipa && flutter build apk",
        ls: [
          "Shared Flutter codebase for iOS & Android",
          "Device hardware & offline caching verified",
          "Release-ready packages generated"
        ],
        f1: "Mobile apps <b>ready</b>",
        f2: "Flutter, Dart, REST",
        iconPath: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2"
      },
      {
        k: "AI",
        c: "#EC4899",
        t: "AI & Automation",
        cmd: "agent.runWorkflow({ task: 'document_qa' })",
        ls: [
          "LLM pipeline connected to internal knowledge",
          "Automated data extraction & verification",
          "Fast sub-second response generated"
        ],
        f1: "AI system <b>live</b>",
        f2: "Claude API, Python",
        iconPath: "M12 3v3M12 18v3M3 12h3M18 12h3M9 7h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"
      },
      {
        k: "Design",
        c: "#F59E0B",
        t: "UI/UX Design",
        cmd: "figma.syncTokens({ tokens: 'tokens.json' })",
        ls: [
          "Responsive screens & design tokens validated",
          "WCAG AA contrast & accessibility approved",
          "Design specs handed off to developers"
        ],
        f1: "Design <b>system ready</b>",
        f2: "Figma, Tokens, UX",
        iconPath: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"
      }
    ]
  },

  work: {
    headerTitle: "kairoedge · shipped deliverables",
    tabs: [
      {
        k: "Logistics",
        c: "#3B82F6",
        t: "Fleet Management Portal",
        cmd: "fleet.track({ vehicles: 450, live: true })",
        ls: [
          "Live GPS telemetry & route optimization active",
          "Automated geofencing alerts delivering alerts",
          "Sub-100ms API response time under peak load"
        ],
        f1: "Live fleet <b>monitoring</b>",
        f2: "React, Node.js, AWS",
        iconPath: "M12 22s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
      },
      {
        k: "Fintech",
        c: "#10B981",
        t: "Reconciliation Platform",
        cmd: "reconcile.batch({ txns: 125000 })",
        ls: [
          "Daily bank feeds parsed & matched automatically",
          "PCI-DSS compliant data masking enforced",
          "Zero ledger mismatch across audit cycle"
        ],
        f1: "Bank-grade <b>security</b>",
        f2: "PostgreSQL, Express",
        iconPath: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
      },
      {
        k: "Health",
        c: "#EC4899",
        t: "Telehealth App",
        cmd: "consultation.startSession({ encrypted: true })",
        ls: [
          "HIPAA compliant end-to-end video consultation",
          "Digital prescription generation verified",
          "4.9 star rating from verified patients"
        ],
        f1: "HIPAA <b>compliant</b>",
        f2: "Flutter, WebRTC",
        iconPath: "M22 12h-4l-3 9L9 3l-3 9H2"
      },
      {
        k: "SaaS",
        c: "#8B5CF6",
        t: "Multi-Tenant Platform",
        cmd: "tenant.provision({ id: 'enterprise-09' })",
        ls: [
          "Isolated database schemas provisioned",
          "SSO integration with Google & Microsoft verified",
          "Automated monthly invoice billing active"
        ],
        f1: "Enterprise <b>SaaS ready</b>",
        f2: "React, Docker, AWS",
        iconPath: "M20 7h-9M14 17H5M12 12h8"
      }
    ]
  },

  industries: {
    headerTitle: "kairoedge · domain compliance",
    tabs: [
      {
        k: "Fintech",
        c: "#10B981",
        t: "Financial Technology",
        cmd: "security.audit({ standard: 'PCI-DSS' })",
        ls: [
          "End-to-end AES-256 data encryption active",
          "Tamper-proof audit logging enabled",
          "Real-time fraud anomaly detection active"
        ],
        f1: "PCI-DSS <b>standard</b>",
        f2: "Fintech Security",
        iconPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      },
      {
        k: "Healthcare",
        c: "#EC4899",
        t: "Healthcare & Life Sciences",
        cmd: "hipaa.verifyCompliance()",
        ls: [
          "Protected Health Information (PHI) isolated",
          "Encrypted doctor-patient communication tunnels",
          "Full regulatory audit trail confirmed"
        ],
        f1: "HIPAA <b>verified</b>",
        f2: "Health Systems",
        iconPath: "M22 12h-4l-3 9L9 3l-3 9H2"
      },
      {
        k: "Logistics",
        c: "#3B82F6",
        t: "Supply Chain & Logistics",
        cmd: "telemetry.stream({ latency_ms: 45 })",
        ls: [
          "Real-time GPS tracking stream connected",
          "Dispatch route optimization calculations",
          "Zero data loss failover system tested"
        ],
        f1: "Low latency <b>tracking</b>",
        f2: "IoT & Cloud",
        iconPath: "M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"
      },
      {
        k: "SaaS",
        c: "#8B5CF6",
        t: "B2B Software",
        cmd: "auth.enforceRBAC({ role: 'admin' })",
        ls: [
          "Multi-tenant data isolation verified",
          "Role-based access controls operational",
          "99.95% API service availability confirmed"
        ],
        f1: "Multi-tenant <b>cloud</b>",
        f2: "Scalable B2B",
        iconPath: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
      }
    ]
  },

  internship: {
    headerTitle: "kairoedge · pune intern cohort",
    tabs: [
      {
        k: "DevOps",
        c: "#3B82F6",
        t: "Cloud & DevOps Track",
        cmd: "terraform apply -auto-approve",
        ls: [
          "Hands-on AWS compute, storage & networking",
          "Docker container builds & Compose automation",
          "Senior engineer 1-on-1 code reviews"
        ],
        f1: "Live projects <b>only</b>",
        f2: "AWS, Linux, CI/CD",
        iconPath: "M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z"
      },
      {
        k: "Web",
        c: "#8B5CF6",
        t: "Full-Stack Web Track",
        cmd: "git push origin feature/user-dashboard",
        ls: [
          "Modern React 18 TypeScript component architecture",
          "Node.js Express RESTful APIs & MySQL schemas",
          "Weekly pull request reviews and mentorship"
        ],
        f1: "Real PRs <b>merged</b>",
        f2: "React, Node.js",
        iconPath: "m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"
      },
      {
        k: "Mobile",
        c: "#14B8A6",
        t: "Mobile Apps Track",
        cmd: "flutter run -d chrome --release",
        ls: [
          "Cross-platform Dart & Flutter state management",
          "Consuming backend APIs & offline device cache",
          "Shipping production-ready app builds"
        ],
        f1: "Android & iOS <b>apps</b>",
        f2: "Flutter, Dart",
        iconPath: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2"
      },
      {
        k: "UI/UX",
        c: "#F59E0B",
        t: "UI/UX Design Track",
        cmd: "figma.prototype.run()",
        ls: [
          "User research, wireframing & interaction design",
          "Design system token creation in Figma",
          "Developer handoff documentation practice"
        ],
        f1: "Design <b>mentorship</b>",
        f2: "Figma, Prototypes",
        iconPath: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"
      }
    ]
  },

  careers: {
    headerTitle: "kairoedge · engineering culture",
    tabs: [
      {
        k: "Speed",
        c: "#F59E0B",
        t: "Fast 2-Day Hiring",
        cmd: "interviews.schedule({ turnaround: '48h' })",
        ls: [
          "Direct conversations with senior technical leads",
          "No generic multiple-choice or trick questions",
          "Decisions and clear offers within two working days"
        ],
        f1: "2-Day <b>turnaround</b>",
        f2: "Direct Tech Chats",
        iconPath: "M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      },
      {
        k: "Ownership",
        c: "#3B82F6",
        t: "High Autonomy",
        cmd: "engineer.deployToProduction()",
        ls: [
          "Engineers own features from design to cloud deploy",
          "Zero bureaucracy or unnecessary meetings",
          "Focus on clean code and robust systems"
        ],
        f1: "Ship real <b>software</b>",
        f2: "High Autonomy",
        iconPath: "m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"
      },
      {
        k: "Pune HQ",
        c: "#10B981",
        t: "Pune Engineering Office",
        cmd: "office.checkIn({ location: 'Pune' })",
        ls: [
          "Collaborative engineering hub in Pune",
          "Modern developer hardware (M3 MacBooks)",
          "Balanced hours and supportive mentorship"
        ],
        f1: "Pune <b>engineering</b>",
        f2: "In-Person Hub",
        iconPath: "M12 22s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
      }
    ]
  },

  about: {
    headerTitle: "kairoedge · company values",
    tabs: [
      {
        k: "Mission",
        c: "#3B82F6",
        t: "Build the Right Thing",
        cmd: "standards.enforceQuality()",
        ls: [
          "Practical software architectures built to endure",
          "Zero vendor lock-in or proprietary traps",
          "100% accountable Pune engineering team"
        ],
        f1: "Engineering <b>standards</b>",
        f2: "Pune Tech Firm",
        iconPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      },
      {
        k: "Values",
        c: "#8B5CF6",
        t: "Direct & Transparent",
        cmd: "client.collaborate({ directToLead: true })",
        ls: [
          "Clients talk directly with engineers, not sales reps",
          "Fixed milestone delivery quotes and scopes",
          "Weekly production demos and transparent PRs"
        ],
        f1: "Direct <b>communication</b>",
        f2: "No Middlemen",
        iconPath: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
      },
      {
        k: "Pune",
        c: "#F59E0B",
        t: "Headquartered in Pune",
        cmd: "kairo.status({ hq: 'Pune, India' })",
        ls: [
          "Proudly founded and operating in Pune",
          "Serving growing startups and enterprise leaders",
          "Committed to local engineering talent"
        ],
        f1: "Engineered in <b>Pune</b>",
        f2: "Global Delivery",
        iconPath: "M12 22s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
      }
    ]
  },

  insights: {
    headerTitle: "kairoedge · tech radar",
    tabs: [
      {
        k: "Cloud",
        c: "#3B82F6",
        t: "Zero-Downtime AWS",
        cmd: "cat insights/cloud-zero-downtime.md",
        ls: [
          "Blue-green deployment strategies dissected",
          "Database connection pooling and RDS failovers",
          "Real cost savings from Terraform right-sizing"
        ],
        f1: "Production <b>lessons</b>",
        f2: "AWS, Architecture",
        iconPath: "M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z"
      },
      {
        k: "Web",
        c: "#8B5CF6",
        t: "React 18 Performance",
        cmd: "cat insights/react-concurrency.md",
        ls: [
          "Eliminating unnecessary re-renders in large lists",
          "SSR vs SPA considerations for SaaS apps",
          "Practical TypeScript strict-mode benefits"
        ],
        f1: "Technical <b>deep-dive</b>",
        f2: "React 18, Web",
        iconPath: "m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"
      },
      {
        k: "AI",
        c: "#EC4899",
        t: "Practical LLM Agents",
        cmd: "cat insights/agentic-workflows.md",
        ls: [
          "Reducing token costs with intelligent caching",
          "Deterministic guardrails on generative output",
          "Deploying resilient assistant backends"
        ],
        f1: "AI in <b>production</b>",
        f2: "LLMs, Agents",
        iconPath: "M12 3v3M12 18v3M3 12h3M18 12h3M9 7h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"
      }
    ]
  },

  contact: {
    headerTitle: "kairoedge · client consultation",
    tabs: [
      {
        k: "Response",
        c: "#10B981",
        t: "Fast 48-Hour Reply",
        cmd: "inquiry.assignToEngineer()",
        ls: [
          "Direct reply from a senior software engineer",
          "Technical feasibility review of your idea",
          "Clear next steps without sales pressure"
        ],
        f1: "Fast reply <b>< 48 hrs</b>",
        f2: "Pune Tech Lead",
        iconPath: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 6v6l4 2"
      },
      {
        k: "Discovery",
        c: "#3B82F6",
        t: "Free 30-Min Scoping",
        cmd: "consultation.bookDiscoveryCall()",
        ls: [
          "Review your product requirements & stack",
          "Estimate realistic timelines & cloud costs",
          "Identify critical technical risks early"
        ],
        f1: "Free <b>consultation</b>",
        f2: "Architecture Review",
        iconPath: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"
      },
      {
        k: "Proposal",
        c: "#F59E0B",
        t: "Fixed Milestone Quote",
        cmd: "proposal.generate({ fixedQuote: true })",
        ls: [
          "Transparent fixed-cost milestones",
          "No hidden fees or unexpected extras",
          "Clear deliverables and acceptance criteria"
        ],
        f1: "Fixed <b>quote</b>",
        f2: "Transparent Scope",
        iconPath: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6"
      }
    ]
  }
};

interface SectionHeroCardProps {
  variant: SectionVariant;
}

export default function SectionHeroCard({ variant }: SectionHeroCardProps) {
  const config = SECTION_CONFIGS[variant] || SECTION_CONFIGS.services;
  const tabs = config.tabs;

  const [activeTab, setActiveTab] = useState(0);
  const [typedCmd, setTypedCmd] = useState("");
  const [revealedLines, setRevealedLines] = useState<string[]>([]);
  const [status, setStatus] = useState("Ready");
  const [progress, setProgress] = useState(100);
  const termRef = useRef<HTMLDivElement | null>(null);
  const tokRef = useRef(0);
  const reducedMotion = useReducedMotion();

  const current = tabs[activeTab] || tabs[0];

  // 3D tilt tracking
  useEffect(() => {
    if (reducedMotion) return;
    const pheroEl = termRef.current?.closest(".phero") as HTMLElement | null;
    if (!pheroEl) return;

    const onPointerMove = (e: MouseEvent) => {
      const term = termRef.current;
      if (!term) return;
      const r = pheroEl.getBoundingClientRect();
      const ry = ((e.clientX - r.left) / r.width - 0.5) * -12;
      const rx = ((e.clientY - r.top) / r.height - 0.5) * 8;
      term.style.setProperty("--ry", `${ry}deg`);
      term.style.setProperty("--rx", `${rx}deg`);
    };

    pheroEl.addEventListener("mousemove", onPointerMove as any, { passive: true });
    return () => pheroEl.removeEventListener("mousemove", onPointerMove as any);
  }, [reducedMotion]);

  // Typing animation cycle
  useEffect(() => {
    if (reducedMotion) {
      setTypedCmd(current.cmd);
      setRevealedLines(current.ls);
      setStatus("Ready");
      setProgress(100);
      return;
    }

    const tok = ++tokRef.current;
    let isCancelled = false;

    const runSequence = async () => {
      setStatus("Working...");
      setTypedCmd("");
      setRevealedLines([]);
      setProgress(0);

      // Type out command at 28ms/char
      for (let k = 1; k <= current.cmd.length; k++) {
        if (tokRef.current !== tok || isCancelled) return;
        setTypedCmd(current.cmd.slice(0, k));
        await new Promise((r) => setTimeout(r, 28));
      }

      // Reveal check lines staggered by 450ms
      for (let j = 0; j < current.ls.length; j++) {
        await new Promise((r) => setTimeout(r, 450));
        if (tokRef.current !== tok || isCancelled) return;
        setRevealedLines((prev) => [...prev, current.ls[j]]);
        setProgress(((j + 1) / current.ls.length) * 100);
      }

      setStatus("Ready");

      // Hold for 3s then auto-cycle to next tab
      await new Promise((r) => setTimeout(r, 3000));
      if (tokRef.current !== tok || isCancelled) return;
      setActiveTab((prev) => (prev + 1) % tabs.length);
    };

    runSequence();

    return () => {
      isCancelled = true;
    };
  }, [activeTab, reducedMotion, tabs]);

  return (
    <div className="hv phero-card-wrap" aria-hidden="true">
      {/* Floating badge f1 */}
      <div className="fc f1">
        <span className="dot" />
        <span dangerouslySetInnerHTML={{ __html: current.f1 }} />
      </div>

      {/* Floating badge f2 */}
      <div className="fc f2">
        <div className="sp">
          <i /><i /><i /><i /><i /><i /><i />
        </div>
        <div>
          <small>Engineered with</small>
          <b>{current.f2}</b>
        </div>
      </div>

      {/* Terminal window */}
      <div className="term" ref={termRef}>
        <div className="tb">
          <i /><i /><i />
          <b>{config.headerTitle}</b>
        </div>

        {/* Tab bar */}
        <div className="tabs" style={{ ["--ac" as any]: current.c }}>
          {tabs.map((s, idx) => (
            <span
              key={s.k}
              className={idx === activeTab ? "on" : ""}
              onClick={() => setActiveTab(idx)}
            >
              {s.k}
            </span>
          ))}
        </div>

        {/* Content body */}
        <div className="pb">
          <div className="ph">
            <div
              className="pi"
              style={{
                ["--ac" as any]: current.c,
                color: current.c,
                background: `color-mix(in srgb, ${current.c} 22%, transparent)`,
                border: `1px solid color-mix(in srgb, ${current.c} 42%, transparent)`
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={current.iconPath} />
              </svg>
            </div>
            <div>
              <b>{current.t}</b>
              <small>{status}</small>
            </div>
          </div>

          <pre>
            {typedCmd && <div className={status === "Working..." ? "c" : ""}>$ {typedCmd}</div>}
            {revealedLines.map((line, i) => (
              <div key={i}>
                <span className="g">&#10004;</span> {line}
              </div>
            ))}
          </pre>
        </div>

        {/* Bottom progress bar */}
        <div className="bar">
          <i style={{ width: `${progress}%`, transition: progress === 0 ? "none" : "width 0.4s" }} />
        </div>
      </div>
    </div>
  );
}
