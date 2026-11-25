export interface IndustryItem {
  id: string;
  name: string;
  description: string;
}

export const industriesData: IndustryItem[] = [
  { id: "fintech", name: "Fintech & Banking", description: "Payment gateways, ledger reconciliation, and secure compliance workflows." },
  { id: "healthcare", name: "Healthcare", description: "HIPAA-aligned patient portals, clinical record aggregation, and telemetry." },
  { id: "education", name: "Education", description: "Campus ERP, live interactive classroom tools, and assessment tracking." },
  { id: "retail", name: "Retail & eCommerce", description: "High-volume checkout flows, automated inventory syncing, and loyalty apps." },
  { id: "manufacturing", name: "Manufacturing", description: "Floor equipment telemetry, supply chain visibility, and preventative maintenance." },
  { id: "logistics", name: "Logistics", description: "Fleet GPS tracking, automated route dispatching, and warehouse handhelds." },
  { id: "real-estate", name: "Real Estate", description: "Property listing engines, digital lease workflows, and tenant payment apps." },
  { id: "government", name: "Government", description: "Citizen-facing digital services, access audits, and high-uptime data portals." }
];

export const valuesData = [
  {
    title: "We own the outcome",
    description: "We don't stop at committing code. We care about uptime, latency, and how your team operates the software."
  },
  {
    title: "Plain talk, no surprises",
    description: "Clear weekly sprint notes, transparent cost estimations, and no confusing technical jargon."
  },
  {
    title: "Craft over shortcuts",
    description: "Disciplined testing, modular architecture, and clean documentation your future developers will appreciate."
  },
  {
    title: "Always learning",
    description: "Constantly benchmarking modern AI models, cloud frameworks, and performance techniques to benefit your stack."
  }
];
