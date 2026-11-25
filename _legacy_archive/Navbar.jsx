import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Work", "/work"],
  ["Industries", "/industries"],
  ["Technology", "/technology"],
  ["Process", "/process"],
  ["Careers", "/careers"],
  ["Internship", "/internship"],
  ["Contact", "/contact"]
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`nav${open ? " is-open" : ""}`}>
      <div className="nav-bar">
        <Logo />
        <nav className={open ? "nav-open" : ""} aria-label="Site pages">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
        </nav>
        {open ? <button className="nav-backdrop" type="button" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
        <div className="nav-end">
          <NavLink className="nav-cta" to="/contact">Start a project</NavLink>
          <button className={`menu-button${open ? " is-open" : ""}`} type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
