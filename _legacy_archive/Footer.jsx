import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useCopy } from "../context/SiteData";

export default function Footer() {
  const copy = useCopy("footer");
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>{copy.blurb}</p>
        </div>
        <div>
          <strong>Company</strong>
          <Link to="/about">About</Link>
          <Link to="/process">Process</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/internship">Internship</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <strong>Services</strong>
          <Link to="/services">Services</Link>
          <Link to="/industries">Industries</Link>
          <Link to="/technology">Technology</Link>
        </div>
        <div>
          <strong>Start</strong>
          <a href={`mailto:${copy.email}`}>{copy.email}</a>
          <span>{copy.place}</span>
          <span>{copy.company}</span>
        </div>
      </div>
      <div className="container footer-base">
        <span>© 2026 KairoEdge Technologies Pvt. Ltd.</span>
        <span>{copy.tagline}</span>
      </div>
    </footer>
  );
}
