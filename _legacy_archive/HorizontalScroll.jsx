import React, { useEffect, useRef, useState } from "react";

export default function HorizontalScroll({ kicker, title, text, services = [], children }) {
  const sectionRef = useRef(null);
  const items = React.Children.toArray(children);
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 1024px)").matches
      : false
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1024px)");
    const handler = (e) => setIsMobile(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isMobile) return undefined;
    const section = sectionRef.current;
    if (!section) return undefined;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = section.getBoundingClientRect();
        const totalScroll = rect.height - window.innerHeight;
        if (totalScroll <= 0) return;
        
        // Progress through the sticky section: 0 to 1
        const progress = Math.min(1, Math.max(0, -rect.top / totalScroll));
        const newIndex = Math.min(items.length - 1, Math.floor(progress * items.length));
        setActive((prev) => (prev !== newIndex ? newIndex : prev));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isMobile, items.length]);

  const selectService = (index) => {
    setActive(index);
    if (!isMobile && sectionRef.current) {
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const totalScroll = rect.height - window.innerHeight;
      const targetScrollTop = window.scrollY + rect.top + (index / (items.length - 1)) * totalScroll;
      window.scrollTo({ top: targetScrollTop, behavior: "smooth" });
    }
  };

  const nextService = () => {
    const nextIdx = (active + 1) % items.length;
    selectService(nextIdx);
  };

  const prevService = () => {
    const prevIdx = (active - 1 + items.length) % items.length;
    selectService(prevIdx);
  };

  // Build service tab items
  const serviceTabs = services.length
    ? services
    : items.map((_, i) => ({
        number: String(i + 1).padStart(2, "0"),
        title: `Service ${i + 1}`,
        slug: `service-${i}`
      }));

  return (
    <section
      className={`deck ${isMobile ? "is-mobile-view" : "is-desktop-sticky"}`}
      ref={sectionRef}
      style={
        isMobile
          ? undefined
          : { height: `calc(100vh + ${(items.length - 1) * 28}vh)` }
      }
    >
      <div className="deck-sticky">
        {/* Left Column: Interactive Navigation & Overview */}
        <div className="deck-copy">
          <div className="deck-copy-header">
            <span className="eyebrow">{kicker}</span>
            <h2>{title}</h2>
            {text && <p className="lead deck-lead">{text}</p>}
          </div>

          {/* Interactive Service Tab Rail */}
          <div className="deck-nav-rail" role="tablist" aria-label="Services List">
            {serviceTabs.map((svc, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={svc.slug || idx}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`deck-tab-item ${isActive ? "is-active" : ""}`}
                  onClick={() => selectService(idx)}
                >
                  <span className="deck-tab-num">{svc.number || String(idx + 1).padStart(2, "0")}</span>
                  <span className="deck-tab-title">{svc.title}</span>
                  {isActive && <span className="deck-tab-glow" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {/* Controller Bar: Arrows, Index & Progress Rail */}
          <div className="deck-controls">
            <div className="deck-counter">
              <strong>{String(active + 1).padStart(2, "0")}</strong>
              <span>/ {String(items.length).padStart(2, "0")}</span>
            </div>

            <div className="deck-progress-track">
              <span
                className="deck-progress-fill"
                style={{ width: `${((active + 1) / items.length) * 100}%` }}
              />
            </div>

            <div className="deck-arrows">
              <button
                type="button"
                className="deck-arrow-btn"
                onClick={prevService}
                aria-label="Previous Service"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                className="deck-arrow-btn"
                onClick={nextService}
                aria-label="Next Service"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Elegant Stage with Animated Cards */}
        <div className="deck-stage">
          {items.map((child, index) => {
            const isActive = index === active;
            return (
              <div
                className={`deck-card-wrapper ${isActive ? "is-active" : "is-hidden"}`}
                key={index}
                style={{
                  zIndex: isActive ? 20 : 10,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0) scale(1)" : "translateY(14px) scale(0.98)",
                  transition: "opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1), transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
                  pointerEvents: isActive ? "auto" : "none"
                }}
              >
                {child}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
