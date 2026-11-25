import React from "react";
import { Link } from "react-router-dom";
import { useCopy } from "../context/SiteData";

export default function Footer() {
  const footerCopy = useCopy("footer");
  const contactCopy = useCopy("contact");

  const place = footerCopy?.place || contactCopy?.place || "Offices: Pune (HQ) & Ahilyanagar, Maharashtra, India";
  const hours = footerCopy?.hours || contactCopy?.hours || "Mon to Sat, 10:00 to 19:00 IST";
  const email = footerCopy?.email || contactCopy?.email || "contact@kairoedge.com";
  const company = footerCopy?.company || "KairoEdge Technologies Pvt Ltd";
  const blurb = footerCopy?.blurb || footerCopy?.tagline || "Enterprise IT solutions, cloud platforms, custom software, and AI automation. Headquartered in Pune with a regional branch in Ahilyanagar, Maharashtra.";

  return (
    <footer>
      <div className="wrap fg">
        <div>
          <Link to="/" className="logo">
            <img
              src="/logo.svg"
              alt="KairoEdge Technologies"
              className="logo-mark"
              width="40"
              height="40"
            />
            <div>
              KairoEdge
              <small>{company.includes("Pvt") ? "Technologies Pvt Ltd" : company}</small>
            </div>
          </Link>
          <p style={{ marginTop: "14px", maxWidth: "30ch" }}>
            {blurb}
          </p>
        </div>

        <div>
          <b>Company</b>
          <Link to="/about">About us</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/internship">Internship</Link>
          <Link to="/contact#faq">FAQ</Link>
        </div>

        <div>
          <b>Services</b>
          <Link to="/services">Cloud &amp; DevOps</Link>
          <Link to="/services">Custom software</Link>
          <Link to="/services">Mobile apps</Link>
          <Link to="/services">AI &amp; automation</Link>
        </div>

        <div>
          <b>Offices &amp; Contact</b>
          <span>Pune, MH (Headquarters)</span>
          <span>Ahilyanagar, MH (Branch Office)</span>
          <span>{hours}</span>
          <a href={`mailto:${email}`} style={{ color: "var(--adm-text-muted, #94a3b8)", textDecoration: "none" }}>{email}</a>
          <Link to="/contact" style={{ marginTop: "4px" }}>Send an enquiry →</Link>
        </div>
      </div>

      <div className="wrap fb">
        <span>&copy; {new Date().getFullYear()} {company}. All rights reserved.</span>
      </div>
    </footer>
  );
}
