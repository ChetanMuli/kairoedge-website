export interface StatItem {
  value: string;
  targetNumber: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description: string;
}

export const statsData: StatItem[] = [
  {
    value: "24/7",
    targetNumber: 24,
    suffix: "/7",
    label: "Monitoring & support",
    description: "Round-the-clock telemetry, automated error alerting, and standby engineering"
  },
  {
    value: "99.9%",
    targetNumber: 99.9,
    suffix: "%",
    label: "Uptime target",
    description: "High-availability multi-AZ AWS cloud deployments and resilient failovers"
  },
  {
    value: "2 weeks",
    targetNumber: 2,
    suffix: " wks",
    label: "To first release",
    description: "Working software demoed in production by the end of sprint two"
  },
  {
    value: "100%",
    targetNumber: 100,
    suffix: "%",
    label: "Client code ownership",
    description: "You own all source repositories, cloud accounts, and architecture documentation"
  }
];
