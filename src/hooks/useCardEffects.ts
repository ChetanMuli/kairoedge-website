import { useCallback, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface CardEffectsOptions {
  tilt?: boolean;
  maxTilt?: number; // max tilt degrees (default 7)
}

export function useCardEffects<T extends HTMLElement = HTMLDivElement>(options: CardEffectsOptions = {}) {
  const { tilt = true, maxTilt = 7 } = options;
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update spotlight variables
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);

      if (!tilt || reducedMotion) return;

      // Calculate tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      const tiltX = -deltaY * maxTilt;
      const tiltY = deltaX * maxTilt;

      el.style.transform = `perspective(900px) translateY(-6px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
    },
    [tilt, maxTilt, reducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
    el.style.transform = "";
  }, []);

  return { ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave };
}
