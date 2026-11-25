import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useSite } from "../context/SiteData";

export default function InsightDetail() {
  const { slug } = useParams();
  const { insights } = useSite();
  const post = insights.find((item) => item.slug === slug);

  useEffect(() => {
    document.title = post ? `${post.title} · KairoEdge` : "Insights · KairoEdge";
  }, [post]);

  if (!post) {
    return (
      <PageHero kicker="Insights" title="That note is not published.">
        <Link className="text-link" to="/insights">All insights</Link>
      </PageHero>
    );
  }

  return (
    <>
      <PageHero kicker={`${post.category} · ${post.publishedOn}`} title={post.title} text={post.excerpt} />
      <section className="section">
        <div className="container article">
          <figure className="detail-visual wide">
            <img src={post.image} alt="" />
          </figure>
          {post.body.split("\n\n").map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
          <Link className="text-link" to="/insights">More insights</Link>
        </div>
      </section>
    </>
  );
}
