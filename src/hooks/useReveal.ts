import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useReveal<T extends HTMLElement = HTMLDivElement>(index: number = 0) {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      el.classList.add("is-revealed");
      return;
    }

    const staggerMs = (index % 3) * 90;
    el.style.transitionDelay = `${staggerMs}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-revealed");

          // Clear delay after 1.3s so hover stays snappy
          const timer = setTimeout(() => {
            el.style.transitionDelay = "0ms";
          }, 1300);

          observer.unobserve(el);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [index, reducedMotion]);

  return ref;
}
