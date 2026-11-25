export interface ProcessStep {
  step: string;
  title: string;
  deliverables: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Discover",
    deliverables: "Technical scope, architecture spec & milestone roadmap",
    description: "We audit your existing workflows, interview stakeholders, and create a concrete technical blueprint with clear deliverable boundaries."
  },
  {
    step: "02",
    title: "Design",
    deliverables: "Interactive Figma prototype, design system & API contracts",
    description: "We craft polished, accessible user experiences and finalize data models and interface contracts before writing production code."
  },
  {
    step: "03",
    title: "Build",
    deliverables: "Agile 2-week sprints, automated test coverage & staging preview",
    description: "Our engineers build features in short, testable cycles with continuous CI/CD integration, shipping the first working demo in sprint two."
  },
  {
    step: "04",
    title: "Launch & run",
    deliverables: "Production AWS release, full code handover & 24/7 monitoring",
    description: "We orchestrate zero-downtime production deployment, configure telemetry and error alerts, and hand over complete repositories and documentation."
  }
];
