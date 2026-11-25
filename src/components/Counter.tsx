import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface CounterProps {
  target: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

export default function Counter({
  target,
  decimals = 0,
  suffix = "",
  prefix = ""
}: CounterProps) {
  const [val, setVal] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    if (reducedMotion) {
      setVal(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted, reducedMotion, target]);

  useEffect(() => {
    if (!hasStarted || reducedMotion) return;

    let frame = 0;
    const start = performance.now();

    const step = (now: number) => {
      const p = Math.min((now - start) / 1400, 1);
      const v = target * (1 - Math.pow(1 - p, 3));
      setVal(v);

      if (p < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setVal(target);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [hasStarted, reducedMotion, target]);

  const display = reducedMotion
    ? target.toFixed(decimals)
    : val.toFixed(decimals);

  return (
    <span ref={spanRef} data-n={target} data-d={decimals}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
