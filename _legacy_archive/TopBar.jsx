import React from "react";
import { Link } from "react-router-dom";

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="container top-bar-inner">
        <div className="top-info">
          <span className="top-info-item">
            <span className="top-dot" aria-hidden="true" />
            Pune, Maharashtra, India
          </span>
          <span className="top-info-item">
            <a href="mailto:info@kairoedge.com">info@kairoedge.com</a>
          </span>
          <span className="top-info-item top-badge">
            Engineering Operations Live
          </span>
        </div>
        <div className="top-actions">
          <Link to="/careers" className="top-action-link">
            Careers
          </Link>
          <span className="top-divider">|</span>
          <Link to="/internship" className="top-action-link">
            Internship
          </Link>
          <span className="top-divider">|</span>
          <Link to="/admin" className="top-action-link">
            Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
