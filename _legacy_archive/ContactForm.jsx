import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSite } from "../context/SiteData";

const empty = { name: "", email: "", company: "", phone: "", service: "", message: "" };

export default function ContactForm() {
  const { services } = useSite();
  const [params] = useSearchParams();
  const [form, setForm] = useState(empty);
  const [otherService, setOtherService] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const role = params.get("role");
    if (!role) return;
    setForm((current) => ({
      ...current,
      service: "Job application",
      message: current.message || `I want to apply for the ${role} role.`
    }));
  }, [params]);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const finalService =
      form.service === "Something else"
        ? otherService.trim() || "Custom project inquiry"
        : form.service;

    const payload = {
      ...form,
      service: finalService
    };

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We could not send your message. Please email us instead.");
      setStatus("sent");
      setForm(empty);
      setOtherService("");
    } catch (err) {
      setStatus("idle");
      setError(err.message);
    }
  };

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        Your name
        <input
          name="name"
          value={form.name}
          onChange={update}
          required
          minLength={2}
          maxLength={80}
          placeholder="e.g. Rahul Sharma"
        />
      </label>
      <label>
        Work Email
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={update}
          required
          maxLength={160}
          placeholder="name@company.com"
        />
      </label>
      <label>
        Company / Organization
        <input
          name="company"
          value={form.company}
          onChange={update}
          maxLength={120}
          placeholder="e.g. Acme Tech"
        />
      </label>
      <label>
        Phone Number
        <input
          name="phone"
          value={form.phone}
          onChange={update}
          maxLength={40}
          placeholder="+91 98765 43210"
        />
      </label>
      <label className="full">
        Service or Practice Required
        <select name="service" value={form.service} onChange={update}>
          <option value="">Choose a practice</option>
          {services.map((service) => (
            <option key={service.slug} value={service.title}>{service.title}</option>
          ))}
          <option value="Enterprise Architecture & Consulting">Enterprise Architecture & Consulting</option>
          <option value="Cloud Migration & DevOps">Cloud Migration & DevOps</option>
          <option value="Job application">Job application</option>
          <option value="Something else">Something else</option>
        </select>
      </label>

      {form.service === "Something else" && (
        <label className="full">
          Please specify what you need
          <input
            className="apply-input manual-input"
            value={otherService}
            onChange={(e) => setOtherService(e.target.value)}
            placeholder="Type your custom requirements or project scope…"
            autoFocus
          />
        </label>
      )}

      <label className="full">
        Project Scope &amp; Details
        <textarea
          name="message"
          value={form.message}
          onChange={update}
          required
          minLength={12}
          maxLength={2000}
          rows={5}
          placeholder="Please describe what the software should do, key technical goals, and target timeline…"
        />
      </label>

      {error ? <p className="form-error full">{error}</p> : null}
      {status === "sent" ? (
        <p className="form-success full">
          Thank you. Your message has been routed to our Pune engineering team. We will respond within 24 business hours.
        </p>
      ) : null}

      <button className="button button-solid" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
