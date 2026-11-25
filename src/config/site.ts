export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  location: string;
  address: string;
  email: string;
  phone: string;
  hours: string;
  formEndpoint: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "KairoEdge",
  legalName: "KairoEdge Technologies Pvt Ltd",
  tagline: "Build the right thing, right on time.",
  description:
    "KairoEdge Technologies Pvt. Ltd. is an enterprise IT company headquartered in Pune with a regional branch in Ahilyanagar, Maharashtra. We engineer cloud platforms, custom software, mobile apps, and AI automation.",
  location: "Pune (HQ) & Ahilyanagar, Maharashtra, India",
  address: "Pune (Headquarters) & Ahilyanagar (Branch), Maharashtra, India",
  email: import.meta.env.VITE_CONTACT_EMAIL || "hello@kairoedge.com",
  phone: import.meta.env.VITE_CONTACT_PHONE || "+91 (020) 7100 2400",
  hours: "Monday to Saturday, 10:00 to 19:00 IST",
  formEndpoint: import.meta.env.VITE_FORM_ENDPOINT || "/api/inquiries",
  social: {
    github: "https://github.com/kairoedge",
    linkedin: "https://linkedin.com/company/kairoedge",
    twitter: "https://x.com/kairoedge"
  }
};
