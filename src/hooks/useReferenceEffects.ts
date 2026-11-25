import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * useReferenceEffects replicates the core interaction behaviors from the reference main.js:
 * 1. IntersectionObserver for '.rv' elements (staggered delay, adds '.in', clears delay after 1.3s)
 * 2. Animated counters for '[data-n]' numbers (1400ms ease-out cubic curve)
 * 3. Spotlight & 3D tilt on '.tile, .card' elements (--mx, --my, --rx, --ry)
 * 4. Magnetic hover on primary buttons ('.btn.pri')
 */
export function useReferenceEffects() {
  const location = useLocation();

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const countedSet = new WeakSet<HTMLElement>();

    // -----------------------------------------------------------------------
    // 1. Counter animation helper (1400ms ease-out cubic curve)
    // -----------------------------------------------------------------------
    const runCounter = (el: HTMLElement) => {
      if (countedSet.has(el)) return;
      countedSet.add(el);

      const target = parseFloat(el.dataset.n || "0");
      const decimals = parseInt(el.dataset.d || "0", 10);

      if (isNaN(target)) return;

      if (isReducedMotion) {
        el.textContent = target.toFixed(decimals);
        return;
      }

      const startTime = performance.now();
      const duration = 1400;

      const step = (now: number) => {
        const elapsed = Math.max(0, now - startTime);
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const value = target * easeOut;
        el.textContent = value.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toFixed(decimals);
        }
      };

      requestAnimationFrame(step);
    };

    // -----------------------------------------------------------------------
    // 2. Reveal helper
    // -----------------------------------------------------------------------
    const revealedSet = new WeakSet<HTMLElement>();

    const revealElement = (el: HTMLElement) => {
      if (revealedSet.has(el) || el.classList.contains("in")) return;
      revealedSet.add(el);
      el.classList.add("in");

      setTimeout(() => {
        el.style.transitionDelay = "";
      }, 1300);

      if (el.hasAttribute("data-n")) {
        runCounter(el);
      }
      el.querySelectorAll<HTMLElement>("[data-n]").forEach(runCounter);
    };

    let revealObserver: IntersectionObserver | null = null;
    let counterObserver: IntersectionObserver | null = null;

    if (isReducedMotion) {
      document.querySelectorAll<HTMLElement>(".rv").forEach(revealElement);
      document.querySelectorAll<HTMLElement>("[data-n]").forEach(runCounter);
    } else {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const targetEl = entry.target as HTMLElement;
            revealElement(targetEl);
            revealObserver?.unobserve(targetEl);
          });
        },
        { threshold: 0.15 }
      );

      counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const targetEl = entry.target as HTMLElement;
            runCounter(targetEl);
            counterObserver?.unobserve(targetEl);
          });
        },
        { threshold: 0.15 }
      );
    }

    const observeElements = () => {
      if (isReducedMotion) return;

      document.querySelectorAll<HTMLElement>(".rv").forEach((el, index) => {
        if (!revealedSet.has(el) && !el.classList.contains("in")) {
          if (!el.style.transitionDelay) {
            el.style.transitionDelay = `${(index % 3) * 90}ms`;
          }
          revealObserver?.observe(el);
        }
      });

      document.querySelectorAll<HTMLElement>("[data-n]").forEach((el) => {
        if (!countedSet.has(el)) {
          counterObserver?.observe(el);
        }
      });
    };

    observeElements();

    // Scroll safeguard: check elements that enter viewport without triggering offscreen elements
    const onScrollSafeguard = () => {
      if (isReducedMotion) return;
      const vh = window.innerHeight;

      document.querySelectorAll<HTMLElement>(".rv:not(.in)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh - 40 && rect.bottom > 40) {
          revealElement(el);
          revealObserver?.unobserve(el);
        }
      });

      document.querySelectorAll<HTMLElement>("[data-n]").forEach((el) => {
        if (!countedSet.has(el)) {
          const rect = el.getBoundingClientRect();
          if (rect.top < vh - 40 && rect.bottom > 40) {
            runCounter(el);
            counterObserver?.unobserve(el);
          }
        }
      });
    };

    window.addEventListener("scroll", onScrollSafeguard, { passive: true });
    window.addEventListener("resize", onScrollSafeguard, { passive: true });

    // -----------------------------------------------------------------------
    // 3. Card & Tile Spotlight + Tilt and Magnetic Buttons
    // -----------------------------------------------------------------------
    const attachedCards = new WeakSet<HTMLElement>();
    const attachedBtns = new WeakSet<HTMLElement>();

    const setupInteractiveElements = () => {
      // Cards spotlight and tilt
      document.querySelectorAll<HTMLElement>(".tile, .card").forEach((card) => {
        if (attachedCards.has(card)) return;
        attachedCards.add(card);

        const isFlat = card.classList.contains("role") || card.classList.contains("pan");

        card.addEventListener("pointermove", (e: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          card.style.setProperty("--mx", `${x}px`);
          card.style.setProperty("--my", `${y}px`);

          if (!isReducedMotion && !isFlat) {
            const ry = ((x / rect.width) - 0.5) * 7;
            const rx = ((y / rect.height) - 0.5) * -7;
            card.style.setProperty("--ry", `${ry}deg`);
            card.style.setProperty("--rx", `${rx}deg`);
          }
        });

        card.addEventListener("pointerleave", () => {
          card.style.setProperty("--rx", "0deg");
          card.style.setProperty("--ry", "0deg");
        });
      });

      // Magnetic buttons
      document.querySelectorAll<HTMLElement>(".btn.pri").forEach((btn) => {
        if (attachedBtns.has(btn)) return;
        attachedBtns.add(btn);

        btn.addEventListener("pointermove", (e: PointerEvent) => {
          const rect = btn.getBoundingClientRect();
          const tx = (e.clientX - rect.left - rect.width / 2) * 0.15;
          const ty = (e.clientY - rect.top - rect.height / 2) * 0.25 - 3;
          btn.style.transform = `translate(${tx}px, ${ty}px)`;
        });

        btn.addEventListener("pointerleave", () => {
          btn.style.transform = "";
        });
      });
    };

    setupInteractiveElements();

    // -----------------------------------------------------------------------
    // 4. MutationObserver for dynamic React DOM changes (tabs, filters)
    // -----------------------------------------------------------------------
    const mutationObserver = new MutationObserver(() => {
      observeElements();
      setupInteractiveElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScrollSafeguard);
      window.removeEventListener("resize", onScrollSafeguard);
      revealObserver?.disconnect();
      counterObserver?.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);
}
