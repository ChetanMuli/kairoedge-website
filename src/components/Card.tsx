import React from "react";
import { useCardEffects } from "../hooks/useCardEffects";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: string;
  tilt?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}

export default function Card({
  accent = "var(--blue)",
  tilt = true,
  wide = false,
  className = "",
  style = {},
  children,
  ...props
}: CardProps) {
  // If wide card, skip the tilt effect as specified in the prompt
  const shouldTilt = tilt && !wide;
  const { ref, onMouseMove, onMouseLeave } = useCardEffects<HTMLDivElement>({ tilt: shouldTilt, maxTilt: 7 });

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`card ${wide ? "card-wide" : ""} ${className}`}
      style={{
        ["--ac" as any]: accent,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
