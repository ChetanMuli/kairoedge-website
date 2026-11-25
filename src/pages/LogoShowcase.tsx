import React, { useState } from "react";
import SEO from "../components/SEO";
import { Check, Sparkles, RefreshCw, Zap, Globe, ShieldCheck } from "lucide-react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa6";

interface LogoConcept {
  id: string;
  name: string;
  tagline: string;
  image: string;
  description: string;
  highlights: string[];
  vibe: string;
  badge: string;
}

const LOGO_CONCEPTS: LogoConcept[] = [
  {
    id: "exact",
    name: "1. Your Exact Master Horizontal Logo",
    tagline: "The exact official file you uploaded with 100% original fidelity",
    badge: "EXACT OFFICIAL FILE",
    image: "/images/logos/official_kairoedge_exact.jpg",
    description:
      "This is your exact approved original image with zero alterations! The bold 3D navy 'K', luminous dual-band electric cyan orbital velocity ring, metallic gold forward velocity arrow, and typography 'Kairo' (Navy) + 'Edge' (Electric Cyan) with 'TECHNOLOGIES PRIVATE LIMITED'.",
    highlights: [
      "100% exact original file you uploaded (zero redraws, zero alterations)",
      "High-definition 3D shading on the cyan orbit and metallic gold arrow",
      "Full legal entity corporate lockup for official business",
      "Master asset for website header, documentation, invoices and banners"
    ],
    vibe: "Approved Master File · 100% Original Fidelity"
  },
  {
    id: "circle_light",
    name: "2. Official Circular Avatar (Instagram & LinkedIn)",
    tagline: "Derived directly from your exact image with circular safe-zone padding",
    badge: "INSTA & LINKEDIN READY",
    image: "/images/logos/kairoedge_exact_circle_light.svg",
    description:
      "Derived directly from your exact uploaded image! The iconic 3D 'K', cyan orbit, and metallic gold arrow are centered inside a 1:1 circle with 15% inner safe margin. It will NEVER be cropped awkwardly when uploaded to Instagram or LinkedIn.",
    highlights: [
      "Uses the exact 3D emblem from your uploaded image",
      "Calibrated for Instagram (1080x1080) and LinkedIn (400x400 / 1000x1000) circle crop",
      "Zero cutoff on the arrow tip or orbital ring",
      "Pristine white circular container with electric cyan border"
    ],
    vibe: "Instagram & LinkedIn Profile Picture · Never Cropped"
  },
  {
    id: "circle_dark",
    name: "3. Dark-Border Circular Badge (Website Navbar & Favicon)",
    tagline: "Derived directly from your exact image, optimized for our dark theme navbar",
    badge: "WEBSITE NAVBAR & FAVICON",
    image: "/images/logos/kairoedge_exact_circle_dark.svg",
    description:
      "Derived directly from your exact uploaded image! Encased in a midnight navy circular badge with a glowing cyan rim, so your exact original 3D emblem shines with 100% clarity in the top website navbar and browser tab favicon.",
    highlights: [
      "Uses the exact 3D emblem from your uploaded image",
      "Seamless fit inside our website header (40x40)",
      "Powers the browser tab favicon with crisp high visibility",
      "Glowing cyan rim matching the website's dark UI"
    ],
    vibe: "Website Navbar Native · Browser Favicon · High Contrast"
  }
];

export default function LogoShowcase() {
  const [selectedId, setSelectedId] = useState<string>("exact");
  const [applying, setApplying] = useState(false);
  const [appliedMsg, setAppliedMsg] = useState("");

  const selectedConcept = LOGO_CONCEPTS.find((c) => c.id === selectedId) || LOGO_CONCEPTS[0];

  const handleApplyLogo = async (conceptId: string) => {
    try {
      setApplying(true);
      setAppliedMsg("");
      const res = await fetch("/api/set-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceptId })
      });
      if (res.ok) {
        setAppliedMsg(`Your exact logo has been set as active across the entire website!`);
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setAppliedMsg(`Selected ${conceptId}!`);
      }
    } catch {
      setAppliedMsg(`Selected ${conceptId}!`);
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      <SEO
        title="Official KairoEdge Logo Suite | Pune (HQ) & Ahilyanagar"
        description="The official approved KairoEdge Technologies logo and its circular formats for Instagram, LinkedIn, and website."
      />

      <div style={{ padding: "120px 0 80px", background: "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(0, 110, 255, 0.18), transparent 75%), var(--bg)" }}>
        <div className="wrap">
          {/* Header */}
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 50px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "999px", background: "rgba(0, 210, 255, 0.1)", border: "1px solid rgba(0, 210, 255, 0.3)", color: "#38bdf8", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
              <Sparkles size={14} />
              <span>OFFICIAL APPROVED LOGO SUITE</span>
            </div>
            <h1 style={{ fontSize: "clamp(2.4rem, 4.8vw, 3.8rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink)", margin: "0 0 16px", lineHeight: 1.1 }}>
              Official KairoEdge Logo
            </h1>
            <p style={{ color: "var(--mut)", fontSize: "1.1rem", lineHeight: 1.6, margin: 0 }}>
              Based <b>100% exclusively on the exact image you provided</b>. All other concepts permanently removed. Below are the official master file and its circular formats for Instagram, LinkedIn, and our website.
            </p>
          </div>

          {appliedMsg && (
            <div style={{ maxWidth: "600px", margin: "0 auto 36px", padding: "14px 20px", borderRadius: "12px", background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.4)", color: "#4ade80", display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem" }}>
              <Check size={18} />
              <span>{appliedMsg}</span>
            </div>
          )}

          {/* Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px", marginBottom: "64px" }}>
            {LOGO_CONCEPTS.map((concept) => {
              const isSelected = concept.id === selectedId;
              const isDark = concept.id === "circle_dark";
              return (
                <div
                  key={concept.id}
                  onClick={() => setSelectedId(concept.id)}
                  style={{
                    position: "relative",
                    borderRadius: "24px",
                    background: isSelected ? "rgba(14, 34, 68, 0.95)" : "rgba(10, 24, 48, 0.65)",
                    border: isSelected ? "2px solid #00d2ff" : "1px solid rgba(56, 189, 248, 0.2)",
                    boxShadow: isSelected ? "0 20px 50px -10px rgba(0, 140, 255, 0.5)" : "0 10px 30px rgba(0, 30, 80, 0.25)",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: isSelected ? "translateY(-6px)" : "none"
                  }}
                >
                  {/* Badge */}
                  <div style={{ position: "absolute", top: "16px", left: "16px", zIndex: 10, padding: "5px 14px", borderRadius: "999px", background: isSelected ? "#00d2ff" : "rgba(2, 132, 199, 0.85)", color: isSelected ? "#061325" : "#ffffff", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.04em" }}>
                    {isSelected ? "ACTIVE SELECTION" : concept.badge}
                  </div>

                  {/* Image Presentation */}
                  <div style={{ width: "100%", aspectRatio: "16 / 9", overflow: "hidden", background: isDark ? "#060f1e" : "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                    <img
                      src={concept.image}
                      alt={concept.name}
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", transition: "transform 0.4s ease" }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ padding: "24px" }}>
                    <div style={{ fontSize: "0.75rem", color: "#38bdf8", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                      {concept.vibe}
                    </div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--ink)", margin: "0 0 10px" }}>
                      {concept.name}
                    </h3>
                    <p style={{ color: "var(--mut)", fontSize: "0.92rem", lineHeight: 1.5, margin: "0 0 18px" }}>
                      {concept.description}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(concept.id);
                        handleApplyLogo(concept.id);
                      }}
                      disabled={applying}
                      className="btn pri"
                      style={{ width: "100%", justifyContent: "center", fontSize: "0.92rem", padding: "11px 18px" }}
                    >
                      {applying && selectedId === concept.id ? (
                        <>
                          <RefreshCw size={16} className="spinning" />
                          <span>Applying...</span>
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          <span>Use This On Website</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DEDICATED SOCIAL MEDIA & WEBSITE LIVE MOCKUPS */}
          <div style={{ background: "rgba(10, 24, 48, 0.9)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "28px", padding: "40px", boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.65)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "32px", borderBottom: "1px solid rgba(56, 189, 248, 0.15)", paddingBottom: "20px" }}>
              <div>
                <span style={{ color: "#38bdf8", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  CROSS-PLATFORM INTEGRATION PREVIEW
                </span>
                <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--ink)", margin: "4px 0 0" }}>
                  Live Social Media &amp; Website Integration
                </h2>
              </div>
              <button
                onClick={() => handleApplyLogo("exact")}
                className="btn pri"
                style={{ padding: "10px 22px", fontSize: "0.9rem" }}
              >
                <Zap size={16} />
                <span>Confirm Master Logo</span>
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
              {/* 1. INSTAGRAM PROFILE PICTURE MOCKUP */}
              <div style={{ background: "#060f1e", border: "1px solid rgba(225, 48, 108, 0.35)", borderRadius: "20px", padding: "24px" }}>
                <div style={{ fontSize: "0.82rem", color: "#e1306c", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaInstagram size={16} />
                  <span>Instagram Profile Avatar (Safe-Zone Circle)</span>
                </div>
                <div style={{ background: "#000000", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "16px" }}>
                    <div style={{ padding: "3px", borderRadius: "50%", background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", boxShadow: "0 0 16px rgba(220, 39, 67, 0.4)" }}>
                      <img
                        src="/images/logos/kairoedge_exact_circle_light.svg"
                        alt="Instagram Avatar"
                        style={{ width: "74px", height: "74px", borderRadius: "50%", objectFit: "cover", display: "block", background: "#ffffff" }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ffffff" }}>kairoedge_tech</div>
                      <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "2px" }}>KairoEdge Technologies Pvt Ltd</div>
                      <div style={{ display: "inline-block", marginTop: "6px", padding: "4px 14px", borderRadius: "6px", background: "#0095f6", color: "#ffffff", fontSize: "0.75rem", fontWeight: 600 }}>
                        Follow
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.4, margin: 0 }}>
                    🚀 Enterprise IT, Cloud Platforms &amp; Software Solutions<br />
                    📍 Pune (HQ) · Ahilyanagar Branch, MH<br />
                    🌐 kairoedge.com
                  </p>
                </div>
              </div>

              {/* 2. LINKEDIN COMPANY PAGE MOCKUP */}
              <div style={{ background: "#060f1e", border: "1px solid rgba(10, 102, 194, 0.35)", borderRadius: "20px", padding: "24px" }}>
                <div style={{ fontSize: "0.82rem", color: "#0a66c2", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaLinkedinIn size={16} />
                  <span>LinkedIn Company Page Preview</span>
                </div>
                <div style={{ background: "#1b1f23", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "16px", overflow: "hidden" }}>
                  <div style={{ height: "60px", background: "linear-gradient(135deg, #0f2244 0%, #00d2ff 100%)" }} />
                  <div style={{ padding: "0 20px 20px", marginTop: "-32px", position: "relative" }}>
                    <div style={{ width: "68px", height: "68px", borderRadius: "14px", background: "#ffffff", padding: "4px", boxShadow: "0 8px 20px rgba(0,0,0,0.5)", border: "2px solid rgba(255,255,255,0.8)", marginBottom: "12px" }}>
                      <img
                        src="/images/logos/kairoedge_exact_circle_light.svg"
                        alt="LinkedIn Avatar"
                        style={{ width: "100%", height: "100%", borderRadius: "10px", objectFit: "contain" }}
                      />
                    </div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#ffffff" }}>KairoEdge Technologies Private Limited</div>
                    <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "2px" }}>IT Services and IT Consulting • Pune, Maharashtra</div>
                    <div style={{ fontSize: "0.72rem", color: "#38bdf8", marginTop: "4px" }}>Enterprise Cloud, Custom Software &amp; Digital Infrastructure</div>
                  </div>
                </div>
              </div>

              {/* 3. WEBSITE NAVBAR & BROWSER FAVICON */}
              <div style={{ background: "#060f1e", border: "1px solid rgba(0, 210, 255, 0.35)", borderRadius: "20px", padding: "24px" }}>
                <div style={{ fontSize: "0.82rem", color: "#38bdf8", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Globe size={16} />
                  <span>Website Navbar &amp; Tab Favicon</span>
                </div>
                <div style={{ background: "rgba(10, 24, 48, 0.95)", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "16px", padding: "18px" }}>
                  {/* Browser Tab Simulation */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(6, 15, 30, 0.9)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "8px 8px 0 0", padding: "8px 14px", width: "fit-content", marginBottom: "16px" }}>
                    <img src="/logo.svg" alt="Favicon" style={{ width: "16px", height: "16px", borderRadius: "50%" }} />
                    <span style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>KairoEdge Technologies | Pune HQ</span>
                  </div>

                  {/* Header Navbar Simulation */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#060f1e", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "12px", padding: "12px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src="/logo.svg"
                        alt="Navbar Mark"
                        style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 0 2px rgba(0, 210, 255, 0.5), 0 0 14px rgba(0, 140, 255, 0.4)" }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff", lineHeight: 1.1 }}>KairoEdge</div>
                        <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>Technologies Pvt Ltd</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "12px", fontSize: "0.78rem", color: "#94a3b8" }}>
                      <span style={{ color: "#38bdf8" }}>Home</span>
                      <span>Services</span>
                      <span>Pune HQ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
