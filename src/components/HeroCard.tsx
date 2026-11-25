import React, { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const SV = [
  {
    k: "Web",
    c: "#8B5CF6",
    t: "Web apps",
    cmd: "npm run build",
    ls: ["React and Node.js app compiled", "All automated tests passed", "Released to production"],
    f1: "Web app <b>shipped</b>",
    f2: "React, Node.js"
  },
  {
    k: "Mobile",
    c: "#14B8A6",
    t: "Mobile apps",
    cmd: "flutter build release",
    ls: ["Android and iOS builds ready", "Tested on real devices", "Release candidate uploaded"],
    f1: "Mobile app <b>release ready</b>",
    f2: "Flutter, Dart"
  },
  {
    k: "Cloud",
    c: "#3B82F6",
    t: "Cloud & DevOps",
    cmd: "kairo deploy --env production",
    ls: ["Infrastructure ready on AWS", "Security scan: no issues found", "Zero-downtime release is live"],
    f1: "Deployed <b>to AWS</b>",
    f2: "AWS, Terraform"
  },
  {
    k: "AI",
    c: "#EC4899",
    t: "AI & automation",
    cmd: 'assistant.ask("Where is my order?")',
    ls: ["Answer found in your documents", "Reply drafted for the customer", "Ticket closed automatically"],
    f1: "AI assistant <b>is live</b>",
    f2: "Claude API, Python"
  },
  {
    k: "Design",
    c: "#F59E0B",
    t: "UI/UX design",
    cmd: "figma export --handoff",
    ls: ["Screens and design system ready", "Accessibility check passed", "Handed off to developers"],
    f1: "Design <b>handed off</b>",
    f2: "Figma, Prototypes"
  }
];

const IP: Record<string, string> = {
  Web: "m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14",
  Mobile: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2",
  Cloud: "M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z",
  AI: "M12 3v3M12 18v3M3 12h3M18 12h3M9 7h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z",
  Design: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"
};

export default function HeroCard() {
  const [activeTab, setActiveTab] = useState(0);
  const [typedCmd, setTypedCmd] = useState("");
  const [revealedLines, setRevealedLines] = useState<string[]>([]);
  const [status, setStatus] = useState("Ready");
  const [progress, setProgress] = useState(100);
  const termRef = useRef<HTMLDivElement | null>(null);
  const tokRef = useRef(0);
  const reducedMotion = useReducedMotion();

  const current = SV[activeTab];

  // 3D tilt tracking on hero
  useEffect(() => {
    if (reducedMotion) return;
    const heroEl = document.querySelector(".hero");
    if (!heroEl) return;

    const onPointerMove = (e: MouseEvent) => {
      const term = termRef.current;
      if (!term) return;
      const r = heroEl.getBoundingClientRect();
      const ry = ((e.clientX - r.left) / r.width - 0.5) * -14;
      const rx = ((e.clientY - r.top) / r.height - 0.5) * 10;
      term.style.setProperty("--ry", `${ry}deg`);
      term.style.setProperty("--rx", `${rx}deg`);
    };

    heroEl.addEventListener("mousemove", onPointerMove as any, { passive: true });
    return () => heroEl.removeEventListener("mousemove", onPointerMove as any);
  }, [reducedMotion]);

  // Animation cycle
  useEffect(() => {
    if (reducedMotion) {
      setTypedCmd(current.cmd);
      setRevealedLines(current.ls);
      setStatus("Ready");
      setProgress(100);
      return;
    }

    const tok = ++tokRef.current;
    let isCancelled = false;

    const runSequence = async () => {
      setStatus("Working...");
      setTypedCmd("");
      setRevealedLines([]);
      setProgress(0);

      // Type out command at 30ms/char
      for (let k = 1; k <= current.cmd.length; k++) {
        if (tokRef.current !== tok || isCancelled) return;
        setTypedCmd(current.cmd.slice(0, k));
        await new Promise((r) => setTimeout(r, 30));
      }

      // Reveal check lines staggered by 550ms
      for (let j = 0; j < current.ls.length; j++) {
        await new Promise((r) => setTimeout(r, 550));
        if (tokRef.current !== tok || isCancelled) return;
        setRevealedLines((prev) => [...prev, current.ls[j]]);
        setProgress(((j + 1) / current.ls.length) * 100);
      }

      setStatus("Ready");

      // Hold for 2.6s then move to next tab
      await new Promise((r) => setTimeout(r, 2600));
      if (tokRef.current !== tok || isCancelled) return;
      setActiveTab((prev) => (prev + 1) % SV.length);
    };

    runSequence();

    return () => {
      isCancelled = true;
    };
  }, [activeTab, reducedMotion]);

  return (
    <div className="hv" aria-hidden="true">
      {/* Floating badge f1 */}
      <div className="fc f1">
        <span className="dot" />
        <span dangerouslySetInnerHTML={{ __html: current.f1 }} />
      </div>

      {/* Floating badge f2 */}
      <div className="fc f2">
        <div className="sp">
          <i /><i /><i /><i /><i /><i /><i />
        </div>
        <div>
          <small>Built with</small>
          <b>{current.f2}</b>
        </div>
      </div>

      {/* Terminal window */}
      <div className="term" id="term" ref={termRef}>
        <div className="tb">
          <i /><i /><i />
          <b>kairoedge &middot; your project</b>
        </div>

        {/* Tab bar */}
        <div className="tabs" id="tabs" style={{ ["--ac" as any]: current.c }}>
          {SV.map((s, idx) => (
            <span
              key={s.k}
              className={idx === activeTab ? "on" : ""}
              onClick={() => {
                setActiveTab(idx);
              }}
            >
              {s.k}
            </span>
          ))}
        </div>

        {/* Content body */}
        <div className="pb">
          <div className="ph">
            <div
              className="pi"
              id="pi"
              style={{
                ["--ac" as any]: current.c,
                color: current.c,
                background: `color-mix(in srgb, ${current.c} 22%, transparent)`,
                border: `1px solid color-mix(in srgb, ${current.c} 42%, transparent)`
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={IP[current.k]} />
              </svg>
            </div>
            <div>
              <b id="pt">{current.t}</b>
              <small id="ps">{status}</small>
            </div>
          </div>

          <pre id="tl">
            {typedCmd && <div>$ {typedCmd}</div>}
            {revealedLines.map((line, i) => (
              <div key={i}>
                <span className="g">&#10004;</span> {line}
              </div>
            ))}
          </pre>
        </div>

        {/* Bottom progress bar */}
        <div className="bar">
          <i id="bar" style={{ width: `${progress}%`, transition: progress === 0 ? "none" : "width 0.5s" }} />
        </div>
      </div>
    </div>
  );
}
