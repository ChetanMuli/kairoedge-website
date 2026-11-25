const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, '..', 'public', 'images', 'logos', 'official_kairoedge_exact.jpg');
const base64Data = fs.readFileSync(imgPath).toString('base64');
const dataUri = `data:image/jpeg;base64,${base64Data}`;

// 1. Light Circular Avatar (Instagram & LinkedIn) - perfectly centered 1:1 circle
const svgLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
  <!-- Circular white container with subtle cyan rim -->
  <circle cx="150" cy="150" r="148" fill="#FFFFFF" stroke="#00D2FF" stroke-width="4" />
  <clipPath id="circleMask">
    <circle cx="150" cy="150" r="146" />
  </clipPath>
  <g clip-path="url(#circleMask)">
    <!-- Exact user-uploaded image positioned so only the iconic emblem is centered -->
    <image href="${dataUri}" x="-10" y="3" width="848" height="300" preserveAspectRatio="xMinYMid meet" />
  </g>
</svg>`;

// 2. Dark-Border Circular Avatar (for Website Navbar & Favicon)
const svgDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
  <!-- Deep Navy circular container with glowing cyan border -->
  <circle cx="150" cy="150" r="148" fill="#060F1E" stroke="#00D2FF" stroke-width="4" />
  <clipPath id="darkCircleMask">
    <circle cx="150" cy="150" r="140" />
  </clipPath>
  <!-- White circular pill behind emblem so the exact original 3D colors shine with 100% fidelity -->
  <circle cx="150" cy="150" r="140" fill="#FFFFFF" />
  <g clip-path="url(#darkCircleMask)">
    <image href="${dataUri}" x="-10" y="3" width="848" height="300" preserveAspectRatio="xMinYMid meet" />
  </g>
</svg>`;

const outDir = path.join(__dirname, '..', 'public', 'images', 'logos');
fs.writeFileSync(path.join(outDir, 'kairoedge_exact_circle_light.svg'), svgLight);
fs.writeFileSync(path.join(outDir, 'kairoedge_exact_circle_dark.svg'), svgDark);

// Update favicon and logo.svg
fs.writeFileSync(path.join(__dirname, '..', 'public', 'assets', 'favicon.svg'), svgLight);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'logo.svg'), svgLight);

console.log('Successfully generated circle avatars directly from exact user image!');
