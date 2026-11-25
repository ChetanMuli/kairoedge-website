import React, { useState, useEffect, useRef, useCallback } from "react";
import { Layers, Briefcase, Zap, MapPin, Sparkles, ShieldCheck } from "lucide-react";

interface StatItem {
  id?: number | string;
  value: string;
  label: string;
  sort_order?: number;
}

interface MovableStatsProps {
  statsList: StatItem[];
}

// Visual icons and subtitle metadata corresponding to the default metrics
const STAT_META: {
  [key: number]: {
    icon: React.ElementType;
    badge: string;
    subtext: string;
  };
} = {
  0: {
    icon: Layers,
    badge: "Core Practices",
    subtext: "Cloud, AI, Mobile & Enterprise Web platforms"
  },
  1: {
    icon: Briefcase,
    badge: "Domain Expertise",
    subtext: "Fintech, Health, Retail & Supply Chain sectors"
  },
  2: {
    icon: Zap,
    badge: "Agile Sprints",
    subtext: "From architecture to production launch & 24/7 SLA"
  },
  3: {
    icon: MapPin,
    badge: "Pune HQ · Ahilyanagar",
    subtext: "Main Office in Pune (HQ) & Branch in Ahilyanagar, MH"
  }
};

export default function MovableStats({ statsList }: MovableStatsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<{ [key: number]: string }>({});

  // Tilt and magnetic movement state for each card
  const [tiltStyles, setTiltStyles] = useState<{
    [key: number]: {
      rotateX: number;
      rotateY: number;
      shiftX: number;
      shiftY: number;
      lightX: number;
      lightY: number;
      isHovered: boolean;
    };
  }>({});

  // Sanitize stats: Absolutely ensure no stale 'HYD', 'Hyderabad', or 'studio' can ever appear
  const sanitizedStats = statsList.map((st, idx) => {
    let cleanVal = (st.value || "").trim();
    let cleanLabel = (st.label || "").trim();

    if (/^hyd$/i.test(cleanVal) || cleanVal.toUpperCase().includes("HYD")) {
      cleanVal = "2";
      cleanLabel = "Offices in Maharashtra";
    }
    if (/studio/i.test(cleanLabel) || /hyderabad/i.test(cleanLabel)) {
      cleanLabel = "Offices in Maharashtra";
      cleanVal = "2";
    }
    if (idx === 3 && (cleanVal === "PUNE" || cleanVal === "PUN")) {
      cleanVal = "2";
      cleanLabel = "Offices in Maharashtra";
    }

    return {
      ...st,
      value: cleanVal,
      label: cleanLabel
    };
  });

  // IntersectionObserver to trigger smooth count-up once in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Number count-up animation when visible
  useEffect(() => {
    if (!isVisible) return;

    sanitizedStats.forEach((stat, index) => {
      const rawVal = stat.value.trim();

      // Location or word strings (e.g. "PUNE", "Pune")
      const isWordOnly = /^[A-Za-z]+$/.test(rawVal);
      if (isWordOnly) {
        setAnimatedValues((prev) => ({ ...prev, [index]: rawVal }));
        return;
      }

      // Extract number part and any prefix/suffix
      // Examples: "7", "8", "6", "99.9%", "24/7", "2 weeks"
      const match = rawVal.match(/^([^0-9.]*)([0-9.]+)(.*)$/);

      if (!match) {
        setAnimatedValues((prev) => ({ ...prev, [index]: rawVal }));
        return;
      }

      const prefix = match[1] || "";
      const targetNum = parseFloat(match[2]);
      const suffix = match[3] || "";
      const isDecimal = match[2].includes(".");
      const duration = 1500 + index * 180;
      const startTime = performance.now();

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth cubic ease-out curve
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = targetNum * easeOut;

        const formatted = isDecimal
          ? currentVal.toFixed(1)
          : Math.floor(currentVal).toString();

        setAnimatedValues((prev) => ({
          ...prev,
          [index]: `${prefix}${progress >= 1 ? match[2] : formatted}${suffix}`
        }));

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };

      requestAnimationFrame(updateCounter);
    });
  }, [isVisible, statsList]);

  // Handle magnetic parallax movement on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-12 to +12 deg)
    const rotateY = ((x - centerX) / centerX) * 12;
    const rotateX = -((y - centerY) / centerY) * 12;

    // Internal depth shifting for the big number (-16 to +16 px)
    const shiftX = ((x - centerX) / centerX) * 16;
    const shiftY = ((y - centerY) / centerY) * 16;

    // Light spotlight position in percentage
    const lightX = (x / rect.width) * 100;
    const lightY = (y / rect.height) * 100;

    setTiltStyles((prev) => ({
      ...prev,
      [index]: {
        rotateX,
        rotateY,
        shiftX,
        shiftY,
        lightX,
        lightY,
        isHovered: true
      }
    }));
  }, []);

  // Reset card on mouse leave with smooth transition
  const handleMouseLeave = useCallback((index: number) => {
    setTiltStyles((prev) => ({
      ...prev,
      [index]: {
        rotateX: 0,
        rotateY: 0,
        shiftX: 0,
        shiftY: 0,
        lightX: 50,
        lightY: 50,
        isHovered: false
      }
    }));
  }, []);

  return (
    <section className="stats movable-stats-section" id="numbers" ref={containerRef}>
      {/* Background radial lighting */}
      <div className="movable-stats-glow" aria-hidden="true" />

      <div className="wrap">
        {/* Professional Section Header */}
        <div className="movable-stats-header rv in">
          <div className="movable-stats-kicker">
            <Sparkles size={14} className="movable-stats-kicker-icon" />
            <span>MEASURABLE IMPACT &amp; ENGINEERING DISCIPLINE</span>
          </div>
          <h2 className="movable-stats-title">
            Numbers that underpin our software delivery.
          </h2>
          <p className="movable-stats-subtitle">
            Reliable engineering cadences, proven cloud architectures, and dedicated product teams based in Pune (HQ) and Ahilyanagar, MH.
          </p>
        </div>

        {/* 4-Card Movable Grid */}
        <div className="movable-stats-grid">
          {sanitizedStats.map((st, idx) => {
            const tilt = tiltStyles[idx] || {
              rotateX: 0,
              rotateY: 0,
              shiftX: 0,
              shiftY: 0,
              lightX: 50,
              lightY: 50,
              isHovered: false
            };

            const meta = STAT_META[idx] || {
              icon: Layers,
              badge: "Capability",
              subtext: "Designed, engineered, and maintained in-house"
            };
            const IconComp = meta.icon;

            const isLocationCard =
              idx === 3 ||
              st.label.toLowerCase().includes("office") ||
              st.label.toLowerCase().includes("pune") ||
              st.label.toLowerCase().includes("ahilyanagar");

            // Display value (animated during scroll-in, fallback to raw)
            const displayVal = animatedValues[idx] || (isVisible ? st.value : "0");

            return (
              <div
                key={st.id || idx}
                className={`movable-stat-tile ${isLocationCard ? "is-pune-tile" : ""}`}
                style={{
                  animationDelay: `${idx * 0.18}s`,
                  transform: tilt.isHovered
                    ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) translateY(-8px)`
                    : undefined
                }}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
              >
                {/* Dynamic radial spotlight reflection */}
                <div
                  className="movable-stat-sheen"
                  style={{
                    background: tilt.isHovered
                      ? `radial-gradient(circle 220px at ${tilt.lightX}% ${tilt.lightY}%, rgba(0, 210, 255, 0.22), transparent 75%)`
                      : "transparent"
                  }}
                  aria-hidden="true"
                />

                {/* Top Bar with Icon and Badge */}
                <div className="movable-stat-top">
                  <div className="movable-stat-icon-wrap">
                    <IconComp size={18} className="movable-stat-icon" />
                  </div>
                  <div className="movable-stat-badge">
                    {isLocationCard && <span className="pune-beacon-dot" />}
                    <span>{meta.badge}</span>
                  </div>
                </div>

                {/* Floating Movable Number / Value */}
                <div
                  className="movable-number-wrap"
                  style={{
                    transform: tilt.isHovered
                      ? `translate3d(${tilt.shiftX.toFixed(1)}px, ${tilt.shiftY.toFixed(1)}px, 28px)`
                      : undefined
                  }}
                >
                  <b className={`movable-number-text ${isLocationCard ? "movable-location-text" : ""}`}>
                    {displayVal}
                  </b>
                </div>

                {/* Primary Metric Label */}
                <h3 className="movable-stat-heading">{st.label}</h3>

                {/* Subtext Context */}
                <p className="movable-stat-subtext">{meta.subtext}</p>

                {/* Hover Accent Border */}
                <div className="movable-tile-bar" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
