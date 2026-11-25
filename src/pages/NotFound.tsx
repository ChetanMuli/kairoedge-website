import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you are looking for does not exist or has moved." />
      <section className="nf">
        <div className="wrap">
          <h1>404</h1>
          <p className="mut">The page you are looking for does not exist or has moved.</p>
          <Link className="btn pri" to="/">
            Back to home
          </Link>
        </div>
      </section>
    </>
  );
}
