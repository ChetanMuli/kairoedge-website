import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import CursorFx from "./CursorFx";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const canView = window.CSS?.supports?.("animation-timeline", "view()");
    if (canView) return undefined;
    const root = document.querySelector("main");
    if (!root) return undefined;
    const selector = ".media-card:not(.pin-card), .deck.is-plain .pin-card, .text-card, .quote-card, .stat, .process-row, .job-card, .promise-card, .project-row";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );
    const watch = () => {
      root.querySelectorAll(selector).forEach((element) => {
        if (!element.classList.contains("is-in")) observer.observe(element);
      });
    };
    watch();
    const changes = new MutationObserver(watch);
    changes.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    return () => {
      observer.disconnect();
      changes.disconnect();
    };
  }, [pathname]);

  return (
    <>
      <CursorFx />
      <TopBar />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
