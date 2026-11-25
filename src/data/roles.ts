export interface RoleItem {
  id: string;
  title: string;
  department: "Engineering" | "Design" | "Business";
  accent: string;
  iconName: string;
  description: string;
  skills: string[];
  type: string;
  location: string;
}

export const rolesData: RoleItem[] = [
  {
    id: "cloud-devops-engineer",
    title: "Cloud & DevOps Engineer",
    department: "Engineering",
    accent: "var(--accent-cloud)",
    iconName: "Cloud",
    description: "Design automated CI/CD release pipelines and resilient AWS cloud infrastructure.",
    skills: ["AWS", "Terraform", "CI/CD"],
    type: "Full-time",
    location: "Pune (hybrid)"
  },
  {
    id: "full-stack-developer",
    title: "Full-Stack Developer",
    department: "Engineering",
    accent: "var(--accent-software)",
    iconName: "Code2",
    description: "Architect high-performance web applications and backend APIs using React and Node.js.",
    skills: ["React", "Node.js", "MySQL"],
    type: "Full-time",
    location: "Pune (hybrid)"
  },
  {
    id: "mobile-app-developer",
    title: "Mobile App Developer",
    department: "Engineering",
    accent: "var(--accent-mobile)",
    iconName: "Smartphone",
    description: "Engineer smooth cross-platform iOS and Android apps with offline caching and clean UI.",
    skills: ["Flutter", "Dart", "REST APIs"],
    type: "Full-time",
    location: "Pune (hybrid)"
  },
  {
    id: "qa-automation-engineer",
    title: "QA Automation Engineer",
    department: "Engineering",
    accent: "var(--accent-security)",
    iconName: "CheckCircle2",
    description: "Build robust automated end-to-end and regression test suites for cloud products.",
    skills: ["Cypress", "Playwright", "Jest"],
    type: "Full-time",
    location: "Pune (hybrid)"
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    department: "Design",
    accent: "var(--accent-design)",
    iconName: "Palette",
    description: "Translate complex product requirements into intuitive wireframes and Figma design systems.",
    skills: ["Figma", "Prototyping", "Design systems"],
    type: "Full-time",
    location: "Pune (hybrid)"
  },
  {
    id: "business-development-executive",
    title: "Business Development Executive",
    department: "Business",
    accent: "var(--sun)",
    iconName: "Briefcase",
    description: "Lead enterprise outreach, client discovery calls, and technical project proposals.",
    skills: ["Outreach", "Proposals", "CRM"],
    type: "Full-time",
    location: "Pune (hybrid)"
  }
];

export const whyJoinUs = [
  {
    title: "Mentorship from day one",
    description: "Work directly with senior cloud architects and engineering leaders who invest in your mastery."
  },
  {
    title: "Real projects, real impact",
    description: "Your code runs production platforms for healthcare, finance and international enterprise clients."
  },
  {
    title: "Clear growth paths",
    description: "Transparent engineering levels, bi-annual reviews, and fast promotions tied to skill and delivery."
  },
  {
    title: "Hybrid and flexible",
    description: "Modern Pune office with flexible work-from-home days so you can manage your best creative rhythm."
  },
  {
    title: "Recognition and rewards",
    description: "Competitive salaries, project delivery bonuses, and direct equity opportunities for high impact."
  },
  {
    title: "Wellbeing first",
    description: "Comprehensive medical coverage, generous leave policies, and zero weekend crunch culture."
  }
];

export const hiringSteps = [
  { step: "01", title: "Apply", desc: "Submit your resume and code samples through our contact portal." },
  { step: "02", title: "Intro call", desc: "A 25-minute chat about your background, interests and our team culture." },
  { step: "03", title: "Skills round", desc: "A practical live coding session or architecture discussion on real problems." },
  { step: "04", title: "Offer", desc: "Written offer letter with clear compensation, benefits and start date." }
];
