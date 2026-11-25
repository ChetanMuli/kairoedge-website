import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open to prevent jitter and accidental closing
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLetsTalkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();
    if (location.pathname === "/contact") {
      const formEl = document.getElementById("f") || document.getElementById("contact");
      formEl?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/contact#f");
      setTimeout(() => {
        const formEl = document.getElementById("f") || document.getElementById("contact");
        formEl?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  return (
    <>
      <header className={scrolled ? "sc" : ""}>
        <div className="wrap">
          <nav>
            <Link to="/" className="logo" aria-label="KairoEdge home" onClick={closeMenu}>
              <img
                src="/logo.svg"
                alt="KairoEdge Technologies"
                className="logo-mark"
                width="40"
                height="40"
              />
              <div>
                KairoEdge
                <small>Technologies Pvt Ltd</small>
              </div>
            </Link>

            <div className={`links ${menuOpen ? "open" : ""}`} id="nav-links">
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? "active" : "")}
                aria-current={location.pathname === "/" ? "page" : undefined}
                onClick={closeMenu}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "active" : "")}
                aria-current={location.pathname === "/about" ? "page" : undefined}
                onClick={closeMenu}
              >
                About
              </NavLink>
              <NavLink
                to="/services"
                className={({ isActive }) => (isActive ? "active" : "")}
                aria-current={location.pathname === "/services" ? "page" : undefined}
                onClick={closeMenu}
              >
                Services
              </NavLink>
              <NavLink
                to="/careers"
                className={({ isActive }) => (isActive ? "active" : "")}
                aria-current={location.pathname === "/careers" ? "page" : undefined}
                onClick={closeMenu}
              >
                Careers
              </NavLink>
              <NavLink
                to="/internship"
                className={({ isActive }) => (isActive ? "active" : "")}
                aria-current={location.pathname === "/internship" ? "page" : undefined}
                onClick={closeMenu}
              >
                Internship
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? "active" : "")}
                aria-current={location.pathname === "/contact" ? "page" : undefined}
                onClick={closeMenu}
              >
                Contact
              </NavLink>

              <div className="menu-cta">
                <Link className="btn pri" to="/contact" onClick={handleLetsTalkClick}>
                  Let's talk &rarr;
                </Link>
              </div>
            </div>

            <button
              className={`btn tg mb ${menuOpen ? "open" : ""}`}
              id="mb"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="nav-links"
            >
              {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>

            <Link className="btn pri nc" to="/contact" onClick={handleLetsTalkClick}>
              Let's talk
            </Link>
          </nav>
        </div>
      </header>

      {/* Backdrop for mobile menu */}
      {menuOpen && (
        <div
          className="menu-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
