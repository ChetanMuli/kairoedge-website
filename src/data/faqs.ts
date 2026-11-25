export interface FAQItem {
  question: string;
  answer: string;
}

export const faqsData: FAQItem[] = [
  {
    question: "How long does a typical project take?",
    answer: "Most MVP builds and initial production platforms take between 6 to 12 weeks from technical discovery to production release. We ship our first working release in sprint two (around week two) so your team can test early and guide the build."
  },
  {
    question: "Will we own the source code?",
    answer: "Yes, 100%. All repositories, cloud architectures, database schemas, and documentation belong completely to your company. We hand over Git rights, access keys, and operational documentation upon completion."
  },
  {
    question: "Do you support us after launch?",
    answer: "Yes. Every engagement includes a dedicated handover warranty period followed by flexible monthly SLA support for proactive monitoring, library updates, security checks, and continuous feature development."
  },
  {
    question: "Do you work with startups and small businesses?",
    answer: "Absolutely. We partner with funded startups, mid-market enterprises, and growing operational businesses. We adapt the engagement structure (fixed-scope MVP or dedicated sprint squad) to your stage and budget."
  },
  {
    question: "How do you price projects?",
    answer: "We offer transparent milestone-based fixed pricing for scoped projects and simple monthly sprint rates for dedicated engineering pods. We outline exact deliverables and timelines before any contract is signed, with no surprise costs."
  }
];
