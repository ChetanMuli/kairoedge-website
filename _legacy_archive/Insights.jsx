import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useCopy, useSite } from "../context/SiteData";

export default function Insights() {
  const { insights } = useSite();
  const copy = useCopy("insights");

  useEffect(() => {
    document.title = "Insights · KairoEdge Technologies";
  }, []);

  return (
    <>
      <PageHero
        kicker={copy.kicker}
        title={copy.title}
        text={copy.text}
      />
      <section className="section">
        <div className="container card-grid three">
          {insights.map((post) => (
            <Link className="media-card" to={`/insights/${post.slug}`} key={post.slug}>
              <div className="media-visual">
                <img src={post.image} alt="" />
              </div>
              <div className="media-body">
                <small>{post.category} · {post.publishedOn}</small>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
