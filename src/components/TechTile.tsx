import React from "react";
import { FaAws } from "react-icons/fa";
import {
  SiKubernetes,
  SiDocker,
  SiTerraform,
  SiGithubactions,
  SiLinux,
  SiGit,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiFlutter,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiAnthropic
} from "react-icons/si";
import { Coffee } from "lucide-react";
import { TechItem } from "../data/tech";

const iconMap: Record<string, any> = {
  aws: FaAws,
  kubernetes: SiKubernetes,
  docker: SiDocker,
  terraform: SiTerraform,
  githubactions: SiGithubactions,
  linux: SiLinux,
  git: SiGit,
  react: SiReact,
  nextdotjs: SiNextdotjs,
  nodedotjs: SiNodedotjs,
  python: SiPython,
  java: Coffee,
  flutter: SiFlutter,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  mongodb: SiMongodb,
  claude: SiAnthropic
};

interface TechTileProps {
  item: TechItem;
}

export default function TechTile({ item }: TechTileProps) {
  const IconComponent = iconMap[item.id] || SiReact;

  return (
    <div
      className="tech-tile"
      style={{
        ["--brand-color" as any]: item.color,
        minWidth: "140px",
        height: "120px",
        borderRadius: "18px",
        backgroundColor: "var(--card)",
        border: "1px solid var(--line)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "16px",
        cursor: "default",
        userSelect: "none",
        transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease"
      }}
    >
      <div
        className="tech-icon-wrap"
        style={{
          fontSize: "34px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: item.isNearBlack ? "var(--ink)" : item.color,
          transition: "transform 0.25s ease"
        }}
      >
        <IconComponent />
      </div>

      <span
        style={{
          fontSize: "13.5px",
          fontWeight: 600,
          color: "var(--ink)",
          textAlign: "center"
        }}
      >
        {item.name}
      </span>

      <style>{`
        .tech-tile:hover {
          transform: translateY(-5px) scale(1.04);
          border-color: color-mix(in srgb, var(--brand-color) 45%, var(--line));
          box-shadow: 0 16px 36px -12px var(--brand-color);
        }
        .tech-tile:hover .tech-icon-wrap {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
