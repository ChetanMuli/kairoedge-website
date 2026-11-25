import React, { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScale(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="pg"
      role="progressbar"
      aria-valuenow={Math.round(scale * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ transform: `scaleX(${scale})` }}
    />
  );
}
