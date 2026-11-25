import React, { useEffect } from "react";
import PageHero from "../components/PageHero";
import ContactForm from "../components/ContactForm";
import { useCopy } from "../context/SiteData";

export default function Contact() {
  const copy = useCopy("contact");
  useEffect(() => {
    document.title = "Contact · KairoEdge Technologies";
  }, []);

  return (
    <>
      <PageHero
        kicker={copy.kicker}
        title={copy.title}
        text={copy.text}
      />
      <section className="section" id="contact-form">
        <div className="container contact-layout">
          <ContactForm />
          <aside className="contact-aside">
            <h2>{copy.asideTitle}</h2>
            <a href={`mailto:${copy.email}`}>{copy.email}</a>
            <p>{copy.place}</p>
            <p>{copy.company}</p>
            <p>{copy.note}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
