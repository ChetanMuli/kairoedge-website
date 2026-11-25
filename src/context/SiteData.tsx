import React, { createContext, useContext, useEffect, useState } from "react";
// @ts-ignore
import * as content from "../../shared/siteContent.js";
// @ts-ignore
import { mergeCopy, pageCopy } from "../../shared/pageCopy.js";

export interface SiteDataState {
  stats: any[];
  services: any[];
  projects: any[];
  industries: any[];
  technologies: any[];
  architecture: any[];
  process: any[];
  principles: any[];
  team: any[];
  testimonials: any[];
  insights: any[];
  jobs: any[];
  copy: any;
  status?: string;
  refreshSite: () => Promise<void>;
}

const fallback = {
  stats: content.stats || [],
  services: content.services || [],
  projects: content.projects || [],
  industries: content.industries || [],
  technologies: content.technologies || [],
  architecture: content.architecture || [],
  process: content.processSteps || [],
  principles: content.principles || [],
  team: content.team || [],
  testimonials: content.testimonials || [],
  insights: content.insights || [],
  jobs: content.jobs || [],
  copy: pageCopy || {},
  status: "fallback",
  refreshSite: async () => {}
};

const SiteContext = createContext<SiteDataState>(fallback);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [site, setSite] = useState<any>(fallback);
  const [status, setStatus] = useState("loading");

  const refreshSite = async () => {
    try {
      const response = await fetch("/api/site");
      if (!response.ok) throw new Error("API unavailable");
      const data = await response.json();
      setSite({
        ...data,
        jobs: Array.isArray(data.jobs) ? data.jobs : fallback.jobs,
        copy: mergeCopy(pageCopy, data.copy)
      });
      setStatus("live");
    } catch {
      setStatus("offline");
    }
  };

  useEffect(() => {
    refreshSite();
  }, []);

  return (
    <SiteContext.Provider value={{ ...site, status, refreshSite }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite(): SiteDataState {
  const value = useContext(SiteContext);
  if (!value) return fallback;
  return value;
}

export function useCopy(section: string): any {
  const site = useSite();
  return (site?.copy && site.copy[section]) || (pageCopy && (pageCopy as any)[section]) || {};
}
