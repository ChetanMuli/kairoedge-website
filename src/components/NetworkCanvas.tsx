import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement || document.body;
    const R = document.documentElement;
    let W = 0;
    let H = 0;
    let P: Particle[] = [];
    const m = { x: -999, y: -999 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const size = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const n = Math.round(Math.min(90, (W * H) / 14000));
      P = [];
      for (let i = 0; i < n; i++) {
        P.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4
        });
      }
    };

    size();
    window.addEventListener("resize", size);

    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      m.x = e.clientX - r.left;
      m.y = e.clientY - r.top;
    };

    const onPointerLeave = () => {
      m.x = -999;
      m.y = -999;
    };

    parent.addEventListener("pointermove", onPointerMove as any);
    parent.addEventListener("pointerleave", onPointerLeave as any);

    const col = (v: string) => getComputedStyle(R).getPropertyValue(v).trim();
    let fr = 0;
    let b = col("--blue") || "#5B7BFF";
    let s = col("--acc") || "#FFB547";
    let vis = true;

    const observer = new IntersectionObserver((entries) => {
      vis = entries[0].isIntersecting;
    });
    observer.observe(parent);

    let animationId = 0;
    const draw = () => {
      if (!vis && !reducedMotion) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      if (!(fr++ % 30)) {
        b = col("--blue") || "#5B7BFF";
        s = col("--acc") || "#FFB547";
      }

      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < P.length; i++) {
        const p = P[i];
        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        }

        const dx = m.x - p.x;
        const dy = m.y - p.y;
        const dm = Math.hypot(dx, dy);

        if (dm < 170 && !reducedMotion) {
          p.x += dx * 0.012;
          p.y += dy * 0.012;
          ctx.strokeStyle = s;
          ctx.globalAlpha = (1 - dm / 170) * 0.9;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }

        for (let j = i + 1; j < P.length; j++) {
          const q = P[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 125) {
            ctx.strokeStyle = b;
            ctx.globalAlpha = (1 - d / 125) * 0.55;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        ctx.globalAlpha = 0.9;
        ctx.fillStyle = dm < 170 ? s : b;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dm < 170 ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reducedMotion) {
        animationId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", size);
      parent.removeEventListener("pointermove", onPointerMove as any);
      parent.removeEventListener("pointerleave", onPointerLeave as any);
      observer.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} id="net" aria-hidden="true" />;
}
