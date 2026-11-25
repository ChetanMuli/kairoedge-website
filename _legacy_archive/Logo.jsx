import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link className="brand" to="/" aria-label="KairoEdge Technologies home">
      <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id="kairo-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#087fc1" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill="url(#kairo-logo-grad)" />
        <path d="M20 7.5 32.5 20 20 32.5 7.5 20Z" fill="none" stroke="#d7e8ff" strokeWidth="2" />
        <path d="M20 14 26 20 20 26 14 20Z" fill="#ffffff" />
      </svg>
      <span>
        <strong>KairoEdge</strong>
        <small>Technologies</small>
      </span>
    </Link>
  );
}
