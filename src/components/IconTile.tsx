import React from "react";
import {
  Cloud,
  Code2,
  Smartphone,
  Cpu,
  ShieldCheck,
  Palette,
  CheckCircle2,
  Briefcase,
  Sparkles,
  type LucideIcon
} from "lucide-react";

export const serviceIcons: Record<string, LucideIcon> = {
  Cloud,
  Code2,
  Smartphone,
  Cpu,
  ShieldCheck,
  Palette,
  CheckCircle2,
  Briefcase,
  Sparkles
};

interface IconTileProps {
  iconName: string;
  accent?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function IconTile({
  iconName,
  accent = "var(--blue)",
  size = 24,
  className = "",
  style = {}
}: IconTileProps) {
  const IconComponent = serviceIcons[iconName] || Sparkles;

  return (
    <div
      className={`icon-tile ${className}`}
      style={{
        ["--ac" as any]: accent,
        ...style
      }}
      aria-hidden="true"
    >
      <IconComponent size={size} strokeWidth={2.2} />
    </div>
  );
}
