export interface InternshipTrack {
  id: string;
  title: string;
  roleParam: string;
  accent: string;
  iconName: string;
  description: string;
  skills: string[];
}

export const internshipTracks: InternshipTrack[] = [
  {
    id: "cloud-devops",
    title: "Cloud & DevOps",
    roleParam: "Cloud & DevOps internship",
    accent: "var(--accent-cloud)",
    iconName: "Cloud",
    description: "Learn automated infrastructure deployment, AWS services, Docker containers, and CI/CD pipelines.",
    skills: ["AWS", "Docker", "CI/CD", "Linux"]
  },
  {
    id: "full-stack-web",
    title: "Full-stack web",
    roleParam: "Full-stack web internship",
    accent: "var(--accent-software)",
    iconName: "Code2",
    description: "Build modern web applications, RESTful services, and stateful interfaces with React, Node.js and SQL.",
    skills: ["React", "TypeScript", "Node.js", "MySQL"]
  },
  {
    id: "mobile-apps",
    title: "Mobile apps",
    roleParam: "Mobile apps internship",
    accent: "var(--accent-mobile)",
    iconName: "Smartphone",
    description: "Develop native and cross-platform mobile apps using Flutter and Dart with polished user interactions.",
    skills: ["Flutter", "Dart", "REST APIs", "Mobile UI"]
  },
  {
    id: "ui-ux-design",
    title: "UI/UX design",
    roleParam: "UI/UX design internship",
    accent: "var(--accent-design)",
    iconName: "Palette",
    description: "Master design thinking, user persona journeys, Figma interactive prototypes, and design systems.",
    skills: ["Figma", "User flows", "Wireframing", "Prototypes"]
  }
];

export const internBenefits = [
  "Dedicated mentor and weekly one-to-one reviews",
  "Live client production projects",
  "Certificate and recommendation letter",
  "Stipend and a chance at a full-time offer for top performers",
  "Flexible schedule around college exams",
  "Code reviews and architecture tips from senior engineers"
];
