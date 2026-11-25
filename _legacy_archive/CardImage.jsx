import React, { useState } from "react";

const fallbackMap = {
  "cloud-devops": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
  "web-engineering": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
  "ai-automation": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
  "mobile-products": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
  "cybersecurity": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
  "data-analytics": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
  "it-consulting": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
  "healthcare": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
  "fintech": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
  "logistics": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
  "retail": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80",
  "education": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80",
  "enterprise": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
  "agritech": "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=80",
  "startups": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
  "default": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80"
};

export default function CardImage({
  src,
  alt = "",
  className = "",
  slugHint = "",
  loading = "lazy"
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // If src is an old svg placeholder, upgrade it to realistic photo
  let targetSrc = src;
  if (!src || src.endsWith(".svg") || error) {
    if (slugHint && fallbackMap[slugHint]) {
      targetSrc = fallbackMap[slugHint];
    } else {
      // Find matching key in src string or fallback
      const foundKey = Object.keys(fallbackMap).find((k) => src && src.includes(k));
      targetSrc = foundKey ? fallbackMap[foundKey] : fallbackMap.default;
    }
  }

  return (
    <div className={`card-img-container ${loaded ? "is-loaded" : "is-loading"} ${className}`}>
      {!loaded && <div className="card-img-shimmer" aria-hidden="true" />}
      <img
        src={targetSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`card-img ${loaded ? "has-loaded" : "has-not-loaded"}`}
      />
    </div>
  );
}
