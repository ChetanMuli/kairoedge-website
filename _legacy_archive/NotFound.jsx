import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page not found · KairoEdge";
  }, []);

  return (
    <PageHero kicker="404" title="This page is not part of the site.">
      <Link className="button button-light" to="/">Return home</Link>
    </PageHero>
  );
}
