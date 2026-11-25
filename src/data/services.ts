export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  accent: string;
  iconName: string;
  description: string;
  checklist: string[];
}

export const servicesData: ServiceItem[] = [
  {
    id: "cloud-devops",
    title: "Cloud & DevOps",
    slug: "cloud-devops",
    accent: "var(--accent-cloud)",
    iconName: "Cloud",
    description: "Move to AWS without downtime, automate releases and keep cloud costs under control.",
    checklist: [
      "Zero-downtime migration to AWS",
      "Automated CI/CD pipelines",
      "Monitoring and cost alerts"
    ]
  },
  {
    id: "custom-software",
    title: "Custom software",
    slug: "custom-software",
    accent: "var(--accent-software)",
    iconName: "Code2",
    description: "Web platforms, APIs and internal tools shaped around how your team works.",
    checklist: [
      "Web platforms and customer portals",
      "APIs and system integrations",
      "Internal tools and dashboards"
    ]
  },
  {
    id: "mobile-apps",
    title: "Mobile apps",
    slug: "mobile-apps",
    accent: "var(--accent-mobile)",
    iconName: "Smartphone",
    description: "Fast Android and iOS apps your customers keep on their home screen.",
    checklist: [
      "Android and iOS from one codebase",
      "Secure login and push notifications",
      "App store release support"
    ]
  },
  {
    id: "ai-automation",
    title: "AI & automation",
    slug: "ai-automation",
    accent: "var(--accent-ai)",
    iconName: "Cpu",
    description: "Assistants and automation that remove repetitive work from your team.",
    checklist: [
      "Chat assistants on your documents",
      "Document and data processing",
      "Workflow automation"
    ]
  },
  {
    id: "security-compliance",
    title: "Security & compliance",
    slug: "security-compliance",
    accent: "var(--accent-security)",
    iconName: "ShieldCheck",
    description: "Keep your data and your customers' trust safe with practical, ongoing protection.",
    checklist: [
      "Access control and secure defaults",
      "Backups and recovery plans",
      "Audits and compliance checks"
    ]
  },
  {
    id: "ui-ux-design",
    title: "UI/UX design",
    slug: "ui-ux-design",
    accent: "var(--accent-design)",
    iconName: "Palette",
    description: "Research-led interfaces that people find easy to use and your developers can build.",
    checklist: [
      "User research and wireframes",
      "Clickable prototypes",
      "Design systems and handoff"
    ]
  }
];

export interface EngagementModel {
  title: string;
  description: string;
  highlights: string[];
}

export const engagementModels: EngagementModel[] = [
  {
    title: "Fixed-scope project",
    description: "Clearly defined deliverables, schedule and budget for a specific product or migration release.",
    highlights: ["Fixed timeline & cost", "Written milestone plan", "Full source code handover"]
  },
  {
    title: "Dedicated team",
    description: "Full-time engineers, cloud architects and designers embedded directly alongside your team.",
    highlights: ["Agile weekly sprints", "Direct Slack / Git access", "Scalable team size"]
  },
  {
    title: "Support and maintenance",
    description: "Proactive uptime monitoring, security patching, library upgrades and ongoing feature polish.",
    highlights: ["SLA uptime guarantee", "24/7 critical issue response", "Routine security audits"]
  }
];
