import React from "react";
import { Helmet } from "react-helmet-async";
import { siteConfig } from "../config/site";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  isHome?: boolean;
}

export default function SEO({
  title,
  description = siteConfig.description,
  canonical = "https://kairoedge.com",
  isHome = false
}: SEOProps) {
  const fullTitle = title
    ? `${title} · ${siteConfig.legalName}`
    : `${siteConfig.legalName} | ${siteConfig.tagline}`;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.legalName,
    "alternateName": siteConfig.name,
    "url": "https://kairoedge.com",
    "logo": "https://kairoedge.com/logo.jpg",
    "description": siteConfig.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "department": [
      {
        "@type": "Organization",
        "name": "KairoEdge Technologies - Ahilyanagar Branch",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Ahilyanagar",
          "addressRegion": "Maharashtra",
          "addressCountry": "IN"
        }
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": siteConfig.phone,
      "contactType": "customer service",
      "email": siteConfig.email,
      "availableLanguage": ["English", "Hindi", "Marathi"]
    },
    "sameAs": [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.twitter
    ]
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteConfig.legalName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* JSON-LD Schema for Home */}
      {isHome && (
        <script type="application/ld+json">
          {JSON.stringify(organizationJsonLd)}
        </script>
      )}
    </Helmet>
  );
}
