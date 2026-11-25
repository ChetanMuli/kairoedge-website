import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "images");

const scenes = [
  ["services/cloud-devops.svg", "cloud", ["#10161d", "#163456", "#4aa3ff"], "CLOUD"],
  ["services/web-engineering.svg", "web", ["#121a26", "#1a3d68", "#7ec0ff"], "WEB"],
  ["services/ai-automation.svg", "ai", ["#101820", "#123e58", "#5ec8e8"], "AI"],
  ["services/mobile-products.svg", "mobile", ["#121624", "#1c3470", "#8eb0ff"], "APP"],
  ["services/cybersecurity.svg", "security", ["#121624", "#1a2e58", "#6aa6ff"], "SEC"],
  ["services/data-analytics.svg", "data", ["#101820", "#143a5c", "#49d0ff"], "DATA"],
  ["services/it-consulting.svg", "consult", ["#121820", "#18345c", "#9ec4ff"], "PLAN"],
  ["projects/northline-control-tower.svg", "cloud", ["#10161d", "#163456", "#4aa3ff"], "CLOUD"],
  ["projects/helio-ledger.svg", "finance", ["#121a26", "#1a3d68", "#7ec0ff"], "LEDGER"],
  ["projects/fieldline-assist.svg", "agri", ["#101820", "#123e58", "#5ec8e8"], "FIELD"],
  ["projects/vivid-storefront.svg", "retail", ["#121624", "#1c3470", "#8eb0ff"], "STORE"],
  ["projects/pulse-ward-insights.svg", "health", ["#121624", "#1a2e58", "#6aa6ff"], "PULSE"],
  ["projects/orbit-field.svg", "mobile", ["#101820", "#143a5c", "#49d0ff"], "ORBIT"],
  ["industries/healthcare.svg", "health", ["#121624", "#1a2e58", "#6aa6ff"], "CARE"],
  ["industries/fintech.svg", "finance", ["#121a26", "#1a3d68", "#7ec0ff"], "FIN"],
  ["industries/agritech.svg", "agri", ["#101820", "#123e58", "#5ec8e8"], "AGRI"],
  ["industries/education.svg", "web", ["#121a26", "#1a3d68", "#7ec0ff"], "LEARN"],
  ["industries/logistics.svg", "cloud", ["#10161d", "#163456", "#4aa3ff"], "ROUTE"],
  ["industries/retail.svg", "retail", ["#121624", "#1c3470", "#8eb0ff"], "RETAIL"],
  ["industries/enterprise.svg", "consult", ["#121820", "#18345c", "#9ec4ff"], "ENT"],
  ["industries/startups.svg", "ai", ["#101820", "#123e58", "#5ec8e8"], "BUILD"],
  ["insights/releases.svg", "cloud", ["#10161d", "#163456", "#4aa3ff"], "SHIP"],
  ["insights/dashboards.svg", "data", ["#101820", "#143a5c", "#49d0ff"], "METRIC"],
  ["insights/automation.svg", "ai", ["#101820", "#123e58", "#5ec8e8"], "FLOW"],
  ["team/cloud.svg", "cloud", ["#10161d", "#163456", "#4aa3ff"], "CLD"],
  ["team/product.svg", "web", ["#121a26", "#1a3d68", "#7ec0ff"], "PRD"],
  ["team/data.svg", "data", ["#101820", "#143a5c", "#49d0ff"], "DATA"],
  ["team/delivery.svg", "consult", ["#121820", "#18345c", "#9ec4ff"], "DLV"],
  ["hero/platform.svg", "hero", ["#10161d", "#163456", "#4aa3ff"], "KAIRO"]
];

function bg(c0, c1) {
  return `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c0}"/>
        <stop offset="1" stop-color="${c1}"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset="1" stop-color="${c1}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="520" fill="url(#bg)"/>
    <g opacity="0.18" stroke="#ffffff" stroke-width="1">
      ${Array.from({ length: 9 }, (_, i) => `<line x1="${80 + i * 80}" y1="0" x2="${80 + i * 80}" y2="520"/>`).join("")}
      ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${40 + i * 80}" x2="800" y2="${40 + i * 80}"/>`).join("")}
    </g>`;
}

function windowFrame(inner, accent) {
  return `
    <rect x="70" y="54" width="660" height="410" rx="8" fill="#07111c" stroke="rgba(74,163,255,.4)"/>
    <circle cx="98" cy="82" r="6" fill="#ff6b6b"/>
    <circle cx="118" cy="82" r="6" fill="#ffd166"/>
    <circle cx="138" cy="82" r="6" fill="#6ee7b7"/>
    <rect x="168" y="72" width="180" height="20" rx="10" fill="rgba(255,255,255,.06)"/>
    <rect x="90" y="108" width="150" height="328" rx="14" fill="rgba(255,255,255,.04)"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="108" y="${130 + i * 42}" width="${i === 0 ? 100 : 78}" height="12" rx="6" fill="${i === 0 ? accent : "rgba(255,255,255,.16)"}"/>`).join("")}
    ${inner}`;
}

const bodies = {
  cloud: (a) => `
    ${[0, 1, 2].map((i) => `
      <rect x="${280 + i * 130}" y="160" width="100" height="220" rx="16" fill="rgba(255,255,255,.04)" stroke="${a}" stroke-opacity=".7"/>
      <rect x="${296 + i * 130}" y="184" width="68" height="10" rx="5" fill="${a}"/>
      <rect x="${296 + i * 130}" y="210" width="68" height="8" rx="4" fill="rgba(255,255,255,.25)"/>
      <rect x="${296 + i * 130}" y="230" width="48" height="8" rx="4" fill="rgba(255,255,255,.18)"/>
      <circle cx="${330 + i * 130}" cy="340" r="10" fill="${a}"/>
    `).join("")}`,
  web: (a) => `
    <rect x="270" y="140" width="400" height="250" rx="16" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)"/>
    <rect x="290" y="164" width="160" height="18" rx="8" fill="${a}"/>
    <rect x="290" y="200" width="240" height="10" rx="5" fill="rgba(255,255,255,.2)"/>
    <rect x="290" y="222" width="190" height="10" rx="5" fill="rgba(255,255,255,.12)"/>
    ${[0, 1, 2].map((i) => `<rect x="${290 + i * 120}" y="260" width="104" height="100" rx="12" fill="rgba(255,255,255,.05)" stroke="${a}" stroke-opacity=".45"/>`).join("")}`,
  ai: (a) => `
    ${[[360, 200], [500, 250], [330, 320], [520, 360], [410, 280]].map(([x, y], i) => `
      <circle cx="${x}" cy="${y}" r="${i === 4 ? 28 : 16}" fill="${i === 4 ? a : "rgba(255,255,255,.08)"}" stroke="${a}"/>
    `).join("")}
    <path d="M360 200 L410 280 L500 250 M330 320 L410 280 L520 360" fill="none" stroke="${a}" stroke-width="2"/>`,
  mobile: (a) => `
    <rect x="340" y="130" width="180" height="320" rx="28" fill="#070b10" stroke="${a}"/>
    <rect x="358" y="160" width="144" height="90" rx="12" fill="${a}" fill-opacity=".25"/>
    <rect x="358" y="266" width="144" height="12" rx="6" fill="rgba(255,255,255,.2)"/>
    <rect x="358" y="290" width="100" height="12" rx="6" fill="rgba(255,255,255,.12)"/>
    <rect x="358" y="330" width="144" height="36" rx="12" fill="${a}"/>`,
  security: (a) => `
    <path d="M470 150 L580 190 V300 C580 360 470 400 470 400 C470 400 360 360 360 300 V190 Z" fill="rgba(255,255,255,.04)" stroke="${a}" stroke-width="3"/>
    <rect x="446" y="250" width="48" height="60" rx="10" fill="${a}"/>
    <circle cx="470" cy="230" r="18" fill="none" stroke="${a}" stroke-width="6"/>`,
  data: (a) => `
    ${[80, 140, 110, 190, 150].map((h, i) => `<rect x="${300 + i * 70}" y="${390 - h}" width="42" height="${h}" rx="8" fill="${i === 3 ? a : "rgba(255,255,255,.16)"}"/>`).join("")}
    <path d="M300 220 C380 180 430 250 500 190 C560 150 600 170 650 140" fill="none" stroke="${a}" stroke-width="4"/>`,
  consult: (a) => `
    ${[0, 1, 2].map((i) => `
      <rect x="280" y="${150 + i * 90}" width="390" height="70" rx="14" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.1)"/>
      <circle cx="316" cy="${185 + i * 90}" r="14" fill="${a}"/>
      <rect x="348" y="${172 + i * 90}" width="${180 - i * 30}" height="12" rx="6" fill="rgba(255,255,255,.3)"/>
    `).join("")}`,
  finance: (a) => `
    <rect x="280" y="160" width="360" height="210" rx="18" fill="rgba(255,255,255,.05)" stroke="${a}"/>
    <rect x="300" y="184" width="140" height="16" rx="8" fill="${a}"/>
    <text x="300" y="250" fill="#fff" font-family="Segoe UI, sans-serif" font-size="28">24,480</text>
    <rect x="300" y="280" width="200" height="10" rx="5" fill="rgba(255,255,255,.2)"/>
    <rect x="300" y="304" width="120" height="10" rx="5" fill="rgba(255,255,255,.12)"/>`,
  agri: (a) => `
    <path d="M260 360 C340 250 420 250 470 300 C530 250 620 250 690 360" fill="none" stroke="${a}" stroke-width="8"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${290 + i * 80}" y="${300 + (i % 2) * 20}" width="18" height="90" rx="9" fill="${a}" fill-opacity=".8"/>`).join("")}
    <circle cx="470" cy="180" r="36" fill="${a}" fill-opacity=".35" stroke="${a}"/>`,
  health: (a) => `
    <path d="M270 270 H360 L390 210 L440 340 L480 240 L520 270 H680" fill="none" stroke="${a}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="300" y="150" width="360" height="240" rx="20" fill="none" stroke="rgba(255,255,255,.16)"/>`,
  retail: (a) => `
    <rect x="300" y="150" width="340" height="250" rx="8" fill="rgba(255,255,255,.04)" stroke="${a}"/>
    <path d="M300 210 H640" stroke="${a}" stroke-opacity=".5"/>
    ${[0, 1, 2].map((i) => `<rect x="${330 + i * 90}" y="240" width="70" height="90" rx="8" fill="${a}" fill-opacity="${0.25 + i * 0.2}"/>`).join("")}`,
  hero: (a) => `
    <rect x="270" y="140" width="250" height="150" rx="16" fill="rgba(255,255,255,.05)" stroke="${a}"/>
    <rect x="430" y="210" width="250" height="170" rx="16" fill="rgba(80,229,255,.08)" stroke="${a}"/>
    <rect x="290" y="320" width="180" height="110" rx="16" fill="rgba(140,92,255,.15)" stroke="#b9a6ff"/>
    <rect x="292" y="164" width="120" height="12" rx="6" fill="${a}"/>
    <rect x="292" y="190" width="80" height="8" rx="4" fill="rgba(255,255,255,.25)"/>
    <text x="452" y="300" fill="#e8fbff" font-family="Segoe UI, sans-serif" font-size="32" font-weight="700">99.9%</text>`
};

function svg([file, kind, colors, label]) {
  const [c0, c1, accent] = colors;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520" role="img" aria-label="${label}">
  ${bg(c0, c1)}
  ${windowFrame(bodies[kind](accent), accent)}
  <text x="70" y="40" fill="${accent}" font-family="Segoe UI, sans-serif" font-size="14" letter-spacing="3">${label}</text>
</svg>`;
}

for (const scene of scenes) {
  const file = path.join(out, scene[0]);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, svg(scene));
}

console.log(`Wrote ${scenes.length} illustrations`);
