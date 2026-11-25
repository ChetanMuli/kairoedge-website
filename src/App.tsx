import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ScrollProgress from "./components/ScrollProgress";
import CursorGlow from "./components/CursorGlow";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SiteProvider } from "./context/SiteData";

// Marketing Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Careers from "./pages/Careers";
import Internship from "./pages/Internship";
import Contact from "./pages/Contact";
import LogoShowcase from "./pages/LogoShowcase";
import NotFound from "./pages/NotFound";

const Admin = React.lazy(() => import("./pages/Admin"));

import { useReferenceEffects } from "./hooks/useReferenceEffects";

/**
 * MarketingLayout encapsulates global chrome for public pages:
 * - Skip to content accessibility link
 * - 3px Scroll progress gradient bar
 * - 360px Cursor glow follower
 * - Scroll to top with hash link handling
 * - Fixed 68px Header
 * - Main content container
 * - 4-column Footer
 */
function MarketingLayout() {
  useReferenceEffects();

  return (
    <>
      <a href="#top" className="skip">
        Skip to content
      </a>
      <ScrollProgress />
      <CursorGlow />
      <ScrollToTop />
      <Header />
      <main id="top" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <Routes>
        {/* Standalone Control Room / Admin Route without marketing header/footer */}
        <Route
          path="/admin"
          element={
            <React.Suspense
              fallback={
                <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", backgroundColor: "#0b1026", color: "#eef1ff" }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "18px", letterSpacing: "0.05em" }}>
                    Loading Control Room…
                  </div>
                </div>
              }
            >
              <Admin />
            </React.Suspense>
          }
        />

        {/* Public Marketing Routes */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/internship" element={<Internship />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/logos" element={<LogoShowcase />} />

          {/* Legacy navigation aliases redirected to relevant canonical pages */}
          <Route path="/work" element={<Navigate to="/services" replace />} />
          <Route path="/work/*" element={<Navigate to="/services" replace />} />
          <Route path="/industries" element={<Navigate to="/services" replace />} />
          <Route path="/industries/*" element={<Navigate to="/services" replace />} />
          <Route path="/technology" element={<Navigate to="/services" replace />} />
          <Route path="/process" element={<Navigate to="/services#process" replace />} />
          <Route path="/insights" element={<Navigate to="/about" replace />} />
          <Route path="/insights/*" element={<Navigate to="/about" replace />} />
          <Route path="/internshipportal" element={<Navigate to="/internship" replace />} />
          <Route path="/internshipportal/*" element={<Navigate to="/internship" replace />} />

          {/* Catch-all 404 handler */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </SiteProvider>
  );
}
