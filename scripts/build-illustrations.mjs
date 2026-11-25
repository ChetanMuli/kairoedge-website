import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../public/images/", import.meta.url));

function write(relative, label, inner) {
  const file = join(root, relative);
  mkdirSync(dirname(file), { recursive: true });
  const id = relative.replace(/[^a-z0-9]/gi, "");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0c1522"/>
      <stop offset="1" stop-color="#163a66"/>
    </linearGradient>
  </defs>
  <rect width="960" height="600" fill="url(#bg${id})"/>
  <g stroke="#7eb6ff" stroke-opacity="0.12">${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 80}" y1="0" x2="${i * 80}" y2="600"/>`).join("")}</g>
  <rect x="48" y="36" width="864" height="528" rx="18" fill="#0b121c" stroke="#4aa3ff" stroke-opacity="0.45"/>
  <circle cx="78" cy="66" r="6" fill="#ff6b6b"/><circle cx="98" cy="66" r="6" fill="#ffd166"/><circle cx="118" cy="66" r="6" fill="#6ee7b7"/>
  <text x="148" y="72" fill="#9ec4ff" font-family="Segoe UI, sans-serif" font-size="14" letter-spacing="2">${label}</text>
  ${inner}
</svg>`;
  writeFileSync(file, svg);
}

const panel = (x, y, w, h, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#121c2b" stroke="#4aa3ff" stroke-opacity="0.55" ${extra}/>`;

write("hero/platform.svg", "PLATFORM", `
  ${panel(78, 110, 250, 400)}
  <rect x="100" y="140" width="140" height="12" rx="6" fill="#4aa3ff"/>
  <rect x="100" y="176" width="180" height="10" rx="5" fill="#d7e8ff" fill-opacity="0.35"/>
  <rect x="100" y="204" width="150" height="10" rx="5" fill="#d7e8ff" fill-opacity="0.2"/>
  <rect x="100" y="250" width="200" height="70" rx="10" fill="#1d6fe0"/>
  <text x="124" y="292" fill="#fff" font-family="Segoe UI, sans-serif" font-size="16">Release ready</text>
  ${panel(360, 110, 500, 180)}
  <rect x="390" y="150" width="180" height="14" rx="7" fill="#4aa3ff"/>
  <text x="390" y="230" fill="#fff" font-family="Segoe UI, sans-serif" font-size="42" font-weight="700">99.9%</text>
  ${panel(360, 314, 230, 196)}
  <rect x="388" y="348" width="80" height="120" rx="8" fill="#1d6fe0"/>
  <rect x="482" y="388" width="80" height="80" rx="8" fill="#7eb6ff"/>
  ${panel(612, 314, 248, 196)}
  <circle cx="736" cy="400" r="36" fill="none" stroke="#4aa3ff" stroke-width="8"/>
  <text x="700" y="470" fill="#d7e8ff" font-family="Segoe UI, sans-serif" font-size="14">Online</text>
`);

write("services/cloud-devops.svg", "CLOUD", `
  ${panel(90, 130, 180, 360)}
  ${panel(300, 130, 180, 360)}
  ${panel(510, 130, 180, 360)}
  ${panel(720, 180, 160, 260)}
  <rect x="118" y="170" width="120" height="14" rx="7" fill="#4aa3ff"/>
  <rect x="328" y="170" width="120" height="14" rx="7" fill="#7eb6ff"/>
  <rect x="538" y="170" width="120" height="14" rx="7" fill="#d7e8ff"/>
  <rect x="118" y="220" width="90" height="180" rx="8" fill="#1d6fe0"/>
  <rect x="328" y="260" width="90" height="140" rx="8" fill="#4aa3ff"/>
  <rect x="538" y="300" width="90" height="100" rx="8" fill="#7eb6ff"/>
  <path d="M180 120 H760" stroke="#4aa3ff" stroke-width="3" fill="none"/>
  <circle cx="180" cy="120" r="7" fill="#6ee7b7"/><circle cx="390" cy="120" r="7" fill="#6ee7b7"/><circle cx="600" cy="120" r="7" fill="#6ee7b7"/>
`);

write("services/web-engineering.svg", "WEB", `
  ${panel(80, 120, 800, 400)}
  <rect x="110" y="150" width="740" height="46" rx="8" fill="#18283c"/>
  <rect x="130" y="164" width="90" height="18" rx="9" fill="#4aa3ff"/>
  <rect x="250" y="168" width="70" height="10" rx="5" fill="#d7e8ff" fill-opacity=".4"/>
  <rect x="340" y="168" width="70" height="10" rx="5" fill="#d7e8ff" fill-opacity=".4"/>
  <rect x="430" y="168" width="70" height="10" rx="5" fill="#d7e8ff" fill-opacity=".4"/>
  <rect x="110" y="220" width="430" height="250" rx="12" fill="#1d6fe0"/>
  <text x="140" y="300" fill="#fff" font-family="Segoe UI, sans-serif" font-size="28">Staff portal</text>
  <rect x="140" y="330" width="180" height="12" rx="6" fill="#d7e8ff"/>
  ${panel(570, 220, 270, 250)}
  <rect x="598" y="260" width="210" height="12" rx="6" fill="#4aa3ff"/>
  <rect x="598" y="292" width="170" height="10" rx="5" fill="#d7e8ff" fill-opacity=".35"/>
  <rect x="598" y="322" width="190" height="10" rx="5" fill="#d7e8ff" fill-opacity=".2"/>
  <rect x="598" y="380" width="120" height="36" rx="8" fill="#1d6fe0"/>
`);

write("services/ai-automation.svg", "AI", `
  ${panel(80, 130, 360, 380)}
  <rect x="110" y="170" width="280" height="14" rx="7" fill="#d7e8ff" fill-opacity=".7"/>
  <rect x="110" y="204" width="250" height="10" rx="5" fill="#d7e8ff" fill-opacity=".3"/>
  <rect x="110" y="230" width="280" height="10" rx="5" fill="#d7e8ff" fill-opacity=".3"/>
  <rect x="110" y="256" width="200" height="10" rx="5" fill="#d7e8ff" fill-opacity=".3"/>
  <rect x="110" y="320" width="140" height="36" rx="8" fill="#1d6fe0"/>
  <text x="132" y="344" fill="#fff" font-family="Segoe UI, sans-serif" font-size="14">Review</text>
  ${panel(480, 130, 390, 380)}
  <circle cx="620" cy="280" r="54" fill="none" stroke="#4aa3ff" stroke-width="8"/>
  <circle cx="760" cy="220" r="28" fill="#1d6fe0"/>
  <circle cx="760" cy="360" r="28" fill="#7eb6ff"/>
  <path d="M670 270 H732 M670 300 H732" stroke="#4aa3ff" stroke-width="3"/>
  <text x="560" y="450" fill="#d7e8ff" font-family="Segoe UI, sans-serif" font-size="16">Draft, then confirm</text>
`);

write("services/mobile-products.svg", "MOBILE", `
  ${panel(300, 90, 280, 450)}
  <rect x="390" y="120" width="100" height="10" rx="5" fill="#d7e8ff" fill-opacity=".4"/>
  <rect x="330" y="160" width="220" height="54" rx="10" fill="#1d6fe0"/>
  <rect x="330" y="230" width="220" height="54" rx="10" fill="#18283c" stroke="#4aa3ff"/>
  <rect x="330" y="300" width="220" height="54" rx="10" fill="#18283c" stroke="#4aa3ff"/>
  <circle cx="360" cy="187" r="8" fill="#6ee7b7"/>
  <circle cx="360" cy="257" r="8" fill="#ffd166"/>
  <rect x="330" y="390" width="220" height="90" rx="12" fill="#121c2b" stroke="#7eb6ff"/>
  <text x="360" y="442" fill="#fff" font-family="Segoe UI, sans-serif" font-size="16">Sync later</text>
`);

write("services/cybersecurity.svg", "SECURITY", `
  <path d="M480 120 L680 190 V330 C680 430 480 500 480 500 C480 500 280 430 280 330 V190 Z" fill="#121c2b" stroke="#4aa3ff" stroke-width="3"/>
  <rect x="430" y="250" width="100" height="80" rx="10" fill="#1d6fe0"/>
  <circle cx="480" cy="278" r="14" fill="none" stroke="#fff" stroke-width="4"/>
  <rect x="472" y="290" width="16" height="22" fill="#fff"/>
  ${panel(90, 160, 160, 280)}
  <rect x="112" y="200" width="110" height="12" rx="6" fill="#6ee7b7"/>
  <rect x="112" y="232" width="110" height="12" rx="6" fill="#6ee7b7"/>
  <rect x="112" y="264" width="110" height="12" rx="6" fill="#ffd166"/>
  ${panel(710, 160, 160, 280)}
  <rect x="732" y="200" width="110" height="12" rx="6" fill="#4aa3ff"/>
  <rect x="732" y="232" width="90" height="12" rx="6" fill="#4aa3ff"/>
  <rect x="732" y="264" width="100" height="12" rx="6" fill="#4aa3ff"/>
`);

write("services/data-analytics.svg", "DATA", `
  ${panel(80, 120, 800, 400)}
  <rect x="130" y="360" width="70" height="90" fill="#1d6fe0"/>
  <rect x="230" y="300" width="70" height="150" fill="#4aa3ff"/>
  <rect x="330" y="250" width="70" height="200" fill="#7eb6ff"/>
  <rect x="430" y="210" width="70" height="240" fill="#d7e8ff"/>
  <path d="M150 240 C250 180 360 280 500 160" fill="none" stroke="#6ee7b7" stroke-width="4"/>
  ${panel(620, 170, 220, 280)}
  <rect x="648" y="210" width="160" height="12" rx="6" fill="#4aa3ff"/>
  <rect x="648" y="246" width="120" height="10" rx="5" fill="#d7e8ff" fill-opacity=".35"/>
  <rect x="648" y="276" width="140" height="10" rx="5" fill="#d7e8ff" fill-opacity=".35"/>
  <rect x="648" y="306" width="100" height="10" rx="5" fill="#d7e8ff" fill-opacity=".35"/>
  <text x="648" y="390" fill="#fff" font-family="Segoe UI, sans-serif" font-size="18">Agreed</text>
`);

write("services/it-consulting.svg", "PLAN", `
  ${panel(90, 140, 240, 340)}
  <text x="120" y="200" fill="#9ec4ff" font-family="Segoe UI, sans-serif" font-size="16">Now</text>
  <rect x="120" y="230" width="180" height="12" rx="6" fill="#ffd166"/>
  <rect x="120" y="260" width="140" height="12" rx="6" fill="#ff6b6b"/>
  <rect x="120" y="290" width="160" height="12" rx="6" fill="#d7e8ff" fill-opacity=".4"/>
  ${panel(370, 140, 240, 340)}
  <text x="400" y="200" fill="#9ec4ff" font-family="Segoe UI, sans-serif" font-size="16">First release</text>
  <rect x="400" y="240" width="180" height="70" rx="10" fill="#1d6fe0"/>
  <rect x="400" y="330" width="150" height="12" rx="6" fill="#4aa3ff"/>
  ${panel(650, 140, 220, 340)}
  <text x="678" y="200" fill="#9ec4ff" font-family="Segoe UI, sans-serif" font-size="16">Later</text>
  <rect x="678" y="240" width="160" height="12" rx="6" fill="#d7e8ff" fill-opacity=".25"/>
  <rect x="678" y="270" width="140" height="12" rx="6" fill="#d7e8ff" fill-opacity=".25"/>
  <rect x="678" y="300" width="120" height="12" rx="6" fill="#d7e8ff" fill-opacity=".25"/>
`);

const industry = {
  "industries/healthcare.svg": ["CARE", `${panel(80, 140, 500, 360)}<rect x="120" y="190" width="200" height="16" rx="8" fill="#4aa3ff"/><rect x="120" y="240" width="400" height="18" rx="9" fill="#1d6fe0"/><rect x="120" y="280" width="320" height="18" rx="9" fill="#7eb6ff"/><text x="120" y="360" fill="#fff" font-family="Segoe UI, sans-serif" font-size="22">Ward 04 · 86%</text>${panel(620, 140, 250, 360)}<circle cx="745" cy="280" r="60" fill="none" stroke="#6ee7b7" stroke-width="12"/><text x="710" y="400" fill="#d7e8ff" font-family="Segoe UI, sans-serif" font-size="16">Same numbers</text>`],
  "industries/fintech.svg": ["LEDGER", `${panel(80, 150, 800, 90)}<text x="110" y="205" fill="#fff" font-family="Segoe UI, sans-serif" font-size="22">Case 1842 · Pending approval</text>${panel(80, 270, 240, 200)}<text x="110" y="360" fill="#6ee7b7" font-family="Segoe UI, sans-serif" font-size="18">Submitted</text>${panel(360, 270, 240, 200)}<text x="400" y="360" fill="#ffd166" font-family="Segoe UI, sans-serif" font-size="18">Review</text>${panel(640, 270, 240, 200)}<text x="690" y="360" fill="#4aa3ff" font-family="Segoe UI, sans-serif" font-size="18">Approved</text>`],
  "industries/agritech.svg": ["FIELD", `${panel(80, 130, 520, 380)}<circle cx="220" cy="280" r="16" fill="#6ee7b7"/><circle cx="340" cy="220" r="16" fill="#ffd166"/><circle cx="430" cy="340" r="16" fill="#4aa3ff"/><path d="M220 280 L340 220 L430 340" fill="none" stroke="#7eb6ff" stroke-width="3"/>${panel(640, 130, 240, 380)}<rect x="670" y="180" width="180" height="110" rx="10" fill="#1d6fe0"/><rect x="670" y="310" width="160" height="12" rx="6" fill="#d7e8ff"/><rect x="670" y="340" width="120" height="12" rx="6" fill="#d7e8ff" fill-opacity=".4"/>`],
  "industries/education.svg": ["CAMPUS", `${panel(80, 140, 360, 360)}<rect x="110" y="190" width="280" height="40" rx="8" fill="#18283c"/><rect x="110" y="246" width="280" height="40" rx="8" fill="#1d6fe0"/><rect x="110" y="302" width="280" height="40" rx="8" fill="#18283c"/><rect x="110" y="358" width="280" height="40" rx="8" fill="#18283c"/>${panel(480, 140, 390, 360)}<text x="520" y="230" fill="#fff" font-family="Segoe UI, sans-serif" font-size="26">Admissions</text><rect x="520" y="270" width="280" height="14" rx="7" fill="#4aa3ff"/><rect x="520" y="310" width="220" height="14" rx="7" fill="#7eb6ff"/>`],
  "industries/logistics.svg": ["ROUTE", `<path d="M120 420 C240 180 420 180 520 300 S760 200 860 160" fill="none" stroke="#4aa3ff" stroke-width="6"/>${panel(100, 300, 180, 120)}<text x="130" y="370" fill="#fff" font-family="Segoe UI, sans-serif" font-size="16">Hub</text>${panel(400, 220, 180, 120)}<text x="430" y="290" fill="#fff" font-family="Segoe UI, sans-serif" font-size="16">Delay</text>${panel(700, 120, 180, 120)}<text x="730" y="190" fill="#fff" font-family="Segoe UI, sans-serif" font-size="16">Dock</text>`],
  "industries/retail.svg": ["STORE", `${panel(80, 140, 250, 250)}${panel(360, 140, 250, 250)}${panel(640, 140, 250, 250)}<rect x="120" y="180" width="170" height="120" rx="8" fill="#1d6fe0"/><rect x="400" y="180" width="170" height="120" rx="8" fill="#4aa3ff"/><rect x="680" y="180" width="170" height="120" rx="8" fill="#7eb6ff"/>${panel(80, 420, 810, 90)}<text x="110" y="474" fill="#fff" font-family="Segoe UI, sans-serif" font-size="20">Paid · Packed · Ready</text>`],
  "industries/enterprise.svg": ["SYSTEMS", `${panel(360, 200, 240, 160)}<text x="410" y="290" fill="#fff" font-family="Segoe UI, sans-serif" font-size="20">Core</text>${panel(80, 120, 200, 120)}<text x="120" y="190" fill="#d7e8ff" font-family="Segoe UI, sans-serif" font-size="16">HR</text>${panel(680, 120, 200, 120)}<text x="720" y="190" fill="#d7e8ff" font-family="Segoe UI, sans-serif" font-size="16">Finance</text>${panel(80, 380, 200, 120)}<text x="110" y="450" fill="#d7e8ff" font-family="Segoe UI, sans-serif" font-size="16">Field</text>${panel(680, 380, 200, 120)}<text x="720" y="450" fill="#d7e8ff" font-family="Segoe UI, sans-serif" font-size="16">Store</text><path d="M280 180 H360 M600 280 H680 M280 440 H360 M600 360 H680" stroke="#4aa3ff" stroke-width="3"/>`],
  "industries/startups.svg": ["LAUNCH", `${panel(100, 140, 760, 360)}<path d="M160 430 L300 360 L430 380 L560 250 L760 180" fill="none" stroke="#4aa3ff" stroke-width="6"/><circle cx="300" cy="360" r="8" fill="#7eb6ff"/><circle cx="560" cy="250" r="8" fill="#6ee7b7"/><circle cx="760" cy="180" r="10" fill="#fff"/><text x="160" y="220" fill="#fff" font-family="Segoe UI, sans-serif" font-size="28">First release</text>`]
};

for (const [file, [label, inner]] of Object.entries(industry)) write(file, label, inner);

const projects = {
  "projects/northline-control-tower.svg": ["CONTROL", `${panel(80, 130, 520, 380)}<rect x="110" y="180" width="460" height="16" rx="8" fill="#ff6b6b"/><rect x="110" y="220" width="460" height="16" rx="8" fill="#ffd166"/><rect x="110" y="260" width="460" height="16" rx="8" fill="#6ee7b7"/><text x="110" y="360" fill="#fff" font-family="Segoe UI, sans-serif" font-size="22">3 exceptions live</text>${panel(630, 130, 250, 380)}<text x="660" y="250" fill="#4aa3ff" font-family="Segoe UI, sans-serif" font-size="18">Fleet</text><text x="660" y="320" fill="#fff" font-family="Segoe UI, sans-serif" font-size="36">128</text>`],
  "projects/helio-ledger.svg": ["CASES", `${panel(80, 140, 800, 80)}<text x="110" y="190" fill="#fff" font-family="Segoe UI, sans-serif" font-size="20">Owner · Status · History</text>${panel(80, 250, 800, 250)}<rect x="110" y="290" width="180" height="14" rx="7" fill="#4aa3ff"/><rect x="320" y="290" width="120" height="14" rx="7" fill="#ffd166"/><rect x="470" y="290" width="300" height="14" rx="7" fill="#d7e8ff" fill-opacity=".35"/><rect x="110" y="340" width="180" height="14" rx="7" fill="#4aa3ff"/><rect x="320" y="340" width="120" height="14" rx="7" fill="#6ee7b7"/><rect x="470" y="340" width="260" height="14" rx="7" fill="#d7e8ff" fill-opacity=".35"/>`],
  "projects/fieldline-assist.svg": ["VISIT", `${panel(220, 90, 280, 440)}<rect x="250" y="140" width="220" height="70" rx="10" fill="#1d6fe0"/><rect x="250" y="230" width="220" height="50" rx="10" fill="#18283c" stroke="#4aa3ff"/><rect x="250" y="300" width="220" height="50" rx="10" fill="#18283c" stroke="#4aa3ff"/><rect x="250" y="380" width="220" height="90" rx="12" fill="#6ee7b7"/><text x="300" y="432" fill="#0c1522" font-family="Segoe UI, sans-serif" font-size="16">Saved</text>${panel(540, 160, 300, 300)}<text x="570" y="230" fill="#fff" font-family="Segoe UI, sans-serif" font-size="20">Next task</text><rect x="570" y="260" width="220" height="14" rx="7" fill="#4aa3ff"/>`],
  "projects/vivid-storefront.svg": ["SHOP", `${panel(80, 130, 480, 380)}<rect x="110" y="170" width="180" height="140" rx="10" fill="#1d6fe0"/><rect x="310" y="170" width="210" height="20" rx="8" fill="#d7e8ff"/><rect x="310" y="210" width="160" height="14" rx="7" fill="#4aa3ff"/><rect x="310" y="270" width="140" height="40" rx="8" fill="#1d6fe0"/>${panel(590, 130, 280, 380)}<text x="620" y="200" fill="#9ec4ff" font-family="Segoe UI, sans-serif" font-size="16">Order</text><text x="620" y="270" fill="#fff" font-family="Segoe UI, sans-serif" font-size="28">Packed</text><rect x="620" y="320" width="200" height="12" rx="6" fill="#6ee7b7"/>`],
  "projects/pulse-ward-insights.svg": ["WARDS", `${panel(80, 130, 800, 380)}<text x="120" y="190" fill="#9ec4ff" font-family="Segoe UI, sans-serif" font-size="16">Nightly refresh</text><rect x="120" y="240" width="520" height="22" rx="8" fill="#1d6fe0"/><rect x="120" y="290" width="420" height="22" rx="8" fill="#4aa3ff"/><rect x="120" y="340" width="300" height="22" rx="8" fill="#7eb6ff"/><rect x="120" y="400" width="180" height="22" rx="8" fill="#ffd166"/>`],
  "projects/orbit-field.svg": ["JOB", `${panel(140, 100, 300, 430)}<text x="170" y="170" fill="#fff" font-family="Segoe UI, sans-serif" font-size="22">Job 22</text><rect x="170" y="210" width="230" height="16" rx="8" fill="#6ee7b7"/><rect x="170" y="250" width="230" height="16" rx="8" fill="#6ee7b7"/><rect x="170" y="290" width="230" height="16" rx="8" fill="#ffd166"/><rect x="170" y="380" width="230" height="80" rx="12" fill="#1d6fe0"/><text x="210" y="428" fill="#fff" font-family="Segoe UI, sans-serif" font-size="18">Sign-off</text>${panel(500, 160, 320, 300)}<text x="530" y="240" fill="#d7e8ff" font-family="Segoe UI, sans-serif" font-size="18">Parts used</text><text x="530" y="320" fill="#fff" font-family="Segoe UI, sans-serif" font-size="40">4</text>`]
};
for (const [file, [label, inner]] of Object.entries(projects)) write(file, label, inner);

write("team/cloud.svg", "CLOUD", `${panel(160, 140, 640, 340)}<rect x="220" y="220" width="80" height="180" rx="8" fill="#1d6fe0"/><rect x="340" y="260" width="80" height="140" rx="8" fill="#4aa3ff"/><rect x="460" y="200" width="80" height="200" rx="8" fill="#7eb6ff"/><rect x="580" y="300" width="80" height="100" rx="8" fill="#d7e8ff"/>`);
write("team/product.svg", "PRODUCT", `${panel(120, 140, 720, 340)}<rect x="160" y="190" width="300" height="220" rx="12" fill="#1d6fe0"/><rect x="500" y="190" width="280" height="40" rx="8" fill="#18283c"/><rect x="500" y="250" width="240" height="16" rx="8" fill="#4aa3ff"/><rect x="500" y="290" width="200" height="16" rx="8" fill="#7eb6ff"/>`);
write("team/data.svg", "DATA", `${panel(120, 140, 720, 340)}<rect x="180" y="340" width="70" height="80" fill="#1d6fe0"/><rect x="280" y="280" width="70" height="140" fill="#4aa3ff"/><rect x="380" y="230" width="70" height="190" fill="#7eb6ff"/><rect x="480" y="200" width="70" height="220" fill="#d7e8ff"/><path d="M200 250 C320 180 500 260 680 170" fill="none" stroke="#6ee7b7" stroke-width="4"/>`);
write("team/delivery.svg", "PLAN", `${panel(140, 150, 680, 320)}<circle cx="240" cy="310" r="18" fill="#4aa3ff"/><circle cx="400" cy="310" r="18" fill="#4aa3ff"/><circle cx="560" cy="310" r="18" fill="#1d6fe0"/><circle cx="720" cy="310" r="18" fill="#18283c" stroke="#4aa3ff"/><path d="M240 310 H720" stroke="#7eb6ff" stroke-width="4"/><text x="210" y="240" fill="#d7e8ff" font-family="Segoe UI, sans-serif" font-size="16">Scope</text><text x="520" y="240" fill="#fff" font-family="Segoe UI, sans-serif" font-size="16">Review</text>`);

write("insights/releases.svg", "RELEASE", `${panel(100, 160, 760, 300)}<rect x="150" y="250" width="140" height="50" rx="8" fill="#18283c" stroke="#4aa3ff"/><rect x="340" y="250" width="140" height="50" rx="8" fill="#1d6fe0"/><rect x="530" y="250" width="140" height="50" rx="8" fill="#4aa3ff"/><path d="M290 275 H340 M480 275 H530" stroke="#7eb6ff" stroke-width="3"/><text x="160" y="360" fill="#d7e8ff" font-family="Segoe UI, sans-serif" font-size="16">Build</text><text x="360" y="360" fill="#fff" font-family="Segoe UI, sans-serif" font-size="16">Check</text><text x="540" y="360" fill="#d7e8ff" font-family="Segoe UI, sans-serif" font-size="16">Promote</text>`);
write("insights/dashboards.svg", "METRICS", `${panel(80, 130, 800, 380)}<text x="120" y="200" fill="#9ec4ff" font-family="Segoe UI, sans-serif" font-size="16">One definition</text><rect x="120" y="250" width="500" height="20" rx="8" fill="#1d6fe0"/><rect x="120" y="300" width="380" height="20" rx="8" fill="#4aa3ff"/><rect x="120" y="350" width="260" height="20" rx="8" fill="#7eb6ff"/>`);
write("insights/automation.svg", "ASSIST", `${panel(80, 150, 380, 320)}<rect x="110" y="200" width="300" height="14" rx="7" fill="#d7e8ff" fill-opacity=".5"/><rect x="110" y="236" width="260" height="12" rx="6" fill="#d7e8ff" fill-opacity=".3"/><rect x="110" y="270" width="280" height="12" rx="6" fill="#d7e8ff" fill-opacity=".3"/>${panel(500, 150, 380, 320)}<rect x="540" y="230" width="180" height="44" rx="8" fill="#1d6fe0"/><text x="570" y="258" fill="#fff" font-family="Segoe UI, sans-serif" font-size="16">Confirm</text><text x="540" y="340" fill="#d7e8ff" font-family="Segoe UI, sans-serif" font-size="16">Person still decides</text>`);

console.log("illustrations written");
