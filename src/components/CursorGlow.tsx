import React, { useEffect, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -400, y: -400 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let frame = 0;
    const handleMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handleMove);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      id="glow"
      aria-hidden="true"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`
      }}
    />
  );
}
