# KairoEdge Technologies Pvt Ltd — Enterprise React & TypeScript Platform

Production-ready, multi-page web platform for **KairoEdge Technologies Pvt Ltd**, an IT services and digital engineering company based in **Pune, Maharashtra, India**.

The company engineers custom web apps, mobile apps (Flutter), cloud platforms & DevOps on AWS, AI workflow automation, security compliance, and UI/UX design.

---

## 1. Technical Stack

- **Runtime & Build**: Vite 6, React 19, TypeScript (Strict Mode with zero `any`)
- **Routing**: React Router (`/`, `/about`, `/services`, `/careers`, `/internship`, `/contact`, `/admin`, `*`)
- **Styling**: Pure CSS with design tokens (`src/styles/tokens.css`), scoped component styles, and CSS variables. Zero UI kit dependencies (no Bootstrap, no Material UI).
- **Icons**: `lucide-react` for UI icons; `react-icons` (Simple Icons + `FaAws`) for technology logos. Strictly AWS-focused (zero Azure or Google Cloud branding).
- **SEO & Meta**: `react-helmet-async` with per-page canonical tags, Open Graph meta tags, meta descriptions, XML sitemap (`/sitemap.xml`), and robots directive (`/robots.txt`).
- **Motion & Physics**: Native CSS animations, `IntersectionObserver` scroll reveals, `requestAnimationFrame` interactive particle canvas, cursor glow, and magnetic button physics. Full support for `prefers-reduced-motion`.

---

## 2. Directory Structure

```text
├── index.html                   # HTML entry point with anti-flash theme script & Google Fonts
├── package.json                 # Dependencies and build scripts
├── tsconfig.json                # Strict TypeScript configuration
├── vite.config.js               # Vite build configuration with chunk splitting & API proxy
├── public/
│   ├── robots.txt               # Search crawler directives
│   ├── sitemap.xml              # Search engine XML sitemap
│   └── images/                  # Static SVG assets & illustrations
└── src/
    ├── main.tsx                 # App mount with HelmetProvider, BrowserRouter & tokens
    ├── App.tsx                  # Root layout, marketing shell, and route mapping
    ├── vite-env.d.ts            # Vite client type definitions
    ├── config/
    │   └── site.ts              # Office address, contact details, social links & env config
    ├── data/
    │   ├── services.ts          # 6 core practices + 3 engagement models
    │   ├── roles.ts             # Open positions, why join us, and 4 hiring steps
    │   ├── tracks.ts            # 4 internship tracks + 6 intern benefits
    │   ├── faqs.ts              # 5 client & project FAQs
    │   ├── stats.ts             # 4 key metrics for counter animations
    │   ├── industries.ts        # 8 industries + 4 value cards
    │   ├── process.ts           # 4-stage delivery process
    │   └── tech.ts              # 17 production technologies (AWS, K8s, React, Flutter, Claude)
    ├── hooks/
    │   ├── useTheme.ts          # Dark/Light toggle with localStorage ('ke-theme') persistence
    │   ├── useReducedMotion.ts  # OS accessibility prefers-reduced-motion detection
    │   ├── useCardEffects.ts    # 3D perspective tilt & radial spotlight cursor tracking
    │   └── useReveal.ts         # IntersectionObserver staggered rise-and-fade reveal
    ├── components/
    │   ├── Header.tsx           # Fixed 68px header with SVG logo, underline nav, theme toggle
    │   ├── Footer.tsx           # 4-column footer with address, links & inquiry CTA
    │   ├── Card.tsx             # 22px card with mask-composite gradient border & tilt
    │   ├── IconTile.tsx         # Accent-tinted icon badge with -6deg hover rotation
    │   ├── PageHero.tsx         # Standard inner page hero with breadcrumb & glow
    │   ├── HeroCard.tsx         # Terminal console with 5 auto-cycling services
    │   ├── NetworkCanvas.tsx    # Interactive particle network hero background
    │   ├── Counter.tsx          # 1.4s ease-out cubic count-up animation
    │   ├── Accordion.tsx        # Accessible details/summary with rotating + to × indicator
    │   ├── DrawnLineSteps.tsx   # Process roadmap with connecting line dividers
    │   ├── Marquee.tsx          # Smooth horizontal technology & capability ticker
    │   ├── ScrollProgress.tsx   # 3px top fixed gradient progress bar
    │   ├── CursorGlow.tsx       # 360px pointer radial follower
    │   ├── ScrollToTop.tsx      # Instant scroll-to-top with hash anchor support
    │   └── SEO.tsx              # React Helmet Async metadata wrapper
    ├── pages/
    │   ├── Home.tsx             # Hero canvas, marquee, teaser, services, stats, tech
    │   ├── About.tsx            # Foundation story, values, metrics, industries
    │   ├── Services.tsx         # 6 practice cards with watermarks, 4-step delivery, models
    │   ├── Careers.tsx          # Culture cards, hiring steps, department filtering, roles
    │   ├── Internship.tsx       # 4 specialized tracks, benefits, direct apply flow
    │   ├── Contact.tsx          # 2-col contact form with prefill, Pune office, FAQs
    │   ├── NotFound.tsx         # Branded 404 error page with quick links
    │   └── Admin.jsx            # Enterprise talent control room & content manager
    └── styles/
        └── tokens.css           # Global design tokens, CSS variables, resets & utilities
```

---

## 3. Design System & Tokens

The platform implements high-contrast light and dark modes controlled via `data-theme="dark|light"` on the root `<html>` element:

| CSS Variable | Dark Theme (Default) | Light Theme | Usage |
| :--- | :--- | :--- | :--- |
| `--bg` | `#0B1026` (Deep Navy) | `#F7F8FC` (Soft Off-White) | Page background |
| `--bg2` | `#131B3F` (Midnight Blue) | `#ECEFF9` (Cool Grey) | Alternating section background |
| `--ink` | `#EEF1FF` (Ice White) | `#101636` (Deep Charcoal) | Primary headings & typography |
| `--mut` | `#9DA9D6` (Muted Slate) | `#525B7F` (Slate Grey) | Secondary text & paragraphs |
| `--line` | `rgba(160, 175, 255, 0.17)` | `rgba(16, 22, 54, 0.12)` | Hairline dividers & borders |
| `--blue` | `#5B7BFF` (Electric Blue) | `#3B5BFF` (Cobalt Blue) | Brand glow & link highlights |
| `--sun` | `#FFB547` (Vibrant Saffron) | `#FFB020` (Warm Amber) | Primary buttons & SVG logo |
| `--acc` | `#FFB547` (Saffron Accent) | `#B05A00` (Accessible Amber) | Accent labels & badges (WCAG AA) |
| `--card` | `rgba(255, 255, 255, 0.045)` | `#FFFFFF` | Card surface |
| `--sh` | `none` | `0 1px 2px ..., 0 14px 34px ...` | Light mode elevation shadow |

### Service Accents
- **Cloud & DevOps**: `#3B82F6` (AWS Blue)
- **Custom Software**: `#8B5CF6` (Violet)
- **Mobile Apps**: `#14B8A6` (Teal)
- **AI & Automation**: `#EC4899` (Magenta)
- **Security & Compliance**: `#22C55E` (Emerald Green)
- **UI/UX Design**: `#F59E0B` (Amber)

---

## 4. Environment Variables

Create a `.env` file in the project root:

```ini
# Base contact form submission API (optional: fallback to local /api/inquiries)
VITE_FORM_ENDPOINT=http://localhost:4001/api/inquiries

# Office contact details
VITE_CONTACT_EMAIL=contact@kairoedge.com
VITE_CONTACT_PHONE=+91 20 4123 4567

# Public website URL (for Open Graph canonical URLs)
VITE_SITE_URL=https://kairoedge.com
```

---

## 5. Development & Build

### Install dependencies
```bash
npm install
```

### Run local development server
```bash
npm run dev
```
Accessible at: `http://localhost:5173`

### Run backend mock API server (optional)
```bash
npm run server
```
Accessible at: `http://localhost:4001`

### Strict Typecheck and Production Build
```bash
npm run build
```
This runs `tsc --noEmit` followed by `vite build`. Output is bundled into the `/dist` directory.

### Preview production build locally
```bash
npm run preview
```

---

## 6. AWS Production Deployment Architecture

This single-page application is designed for zero-maintenance, high-availability hosting using Amazon Web Services (AWS):

```
[ User Browser ]
       │
       ▼ (HTTPS / HTTP3)
[ Amazon Route 53 ] ── DNS record for kairoedge.com
       │
       ▼
[ AWS Certificate Manager (ACM) ] ── SSL/TLS Wildcard Cert in us-east-1
       │
       ▼
[ Amazon CloudFront CDN ]
       ├── Edge Caching (Brotli / Gzip compression)
       ├── Origin Access Control (OAC)
       ├── Custom Error Response: HTTP 404 / 403 ➔ /index.html (HTTP 200) [SPA Routing]
       └── Security Headers Policy (HSTS, CSP, X-Frame-Options)
       │
       ▼
[ Amazon S3 Bucket ] ── Private Static Website Storage (dist/*)
```

### Step-by-Step Deployment Guide

1. **Build the production bundle**:
   ```bash
   npm run build
   ```

2. **Sync files to your Amazon S3 Bucket**:
   ```bash
   aws s3 sync dist/ s3://kairoedge-production-static/ --delete
   ```

3. **Configure S3 Cache Headers**:
   ```bash
   # Static assets (cache forever)
   aws s3 cp dist/assets/ s3://kairoedge-production-static/assets/ \
     --recursive --metadata-directive REPLACE \
     --cache-control "public, max-age=31536000, immutable"

   # HTML files (no-cache to ensure immediate updates)
   aws s3 cp dist/index.html s3://kairoedge-production-static/index.html \
     --metadata-directive REPLACE \
     --cache-control "public, max-age=0, must-revalidate"
   ```

4. **CloudFront SPA Custom Error Response (Critical for React Router)**:
   In the AWS CloudFront console under **Error Pages**:
   - **HTTP Error Code**: `403` and `404`
   - **Response Page Path**: `/index.html`
   - **HTTP Response Code**: `200`
   - **Error Caching Minimum TTL**: `0`

5. **Invalidate CloudFront Cache**:
   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
   ```

---

## 7. Content Management Guide

All copy and business information is centralized in clean, typed data modules in `src/data/`:
- **Services & Offerings**: Edit `src/data/services.ts`
- **Job Openings & Culture**: Edit `src/data/roles.ts`
- **Internship Tracks & Perks**: Edit `src/data/tracks.ts`
- **Client FAQs**: Edit `src/data/faqs.ts`
- **Company Stats & Counters**: Edit `src/data/stats.ts`
- **Technology Stack**: Edit `src/data/tech.ts` (Keep strictly AWS & modern open-source stacks)
- **Company Address & Phone**: Edit `src/config/site.ts`

---

## 8. License

© 2026 KairoEdge Technologies Pvt Ltd. All rights reserved.
Pune, Maharashtra, India.
