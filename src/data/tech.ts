export interface TechItem {
  id: string;
  name: string;
  category: "Cloud & DevOps" | "Frontend" | "Backend & Languages" | "Databases" | "AI";
  color: string;
  isNearBlack?: boolean;
}

export const techStack: TechItem[] = [
  { id: "aws", name: "AWS", category: "Cloud & DevOps", color: "#FF9900" },
  { id: "kubernetes", name: "Kubernetes", category: "Cloud & DevOps", color: "#326CE5" },
  { id: "docker", name: "Docker", category: "Cloud & DevOps", color: "#2496ED" },
  { id: "terraform", name: "Terraform", category: "Cloud & DevOps", color: "#844FBA" },
  { id: "githubactions", name: "GitHub Actions", category: "Cloud & DevOps", color: "#2088FF" },
  { id: "linux", name: "Linux", category: "Cloud & DevOps", color: "#FCC624" },
  { id: "git", name: "Git", category: "Cloud & DevOps", color: "#F05032" },
  { id: "react", name: "React", category: "Frontend", color: "#61DAFB" },
  { id: "nextdotjs", name: "Next.js", category: "Frontend", color: "#000000", isNearBlack: true },
  { id: "nodedotjs", name: "Node.js", category: "Backend & Languages", color: "#5FA04E" },
  { id: "python", name: "Python", category: "Backend & Languages", color: "#3776AB" },
  { id: "java", name: "Java", category: "Backend & Languages", color: "#ED8B00" },
  { id: "flutter", name: "Flutter", category: "Frontend", color: "#02569B" },
  { id: "postgresql", name: "PostgreSQL", category: "Databases", color: "#4169E1" },
  { id: "mysql", name: "MySQL", category: "Databases", color: "#4479A1" },
  { id: "mongodb", name: "MongoDB", category: "Databases", color: "#47A248" },
  { id: "claude", name: "Claude API", category: "AI", color: "#D97706" }
];
