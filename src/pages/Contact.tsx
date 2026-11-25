import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import SEO from "../components/SEO";
import SearchableSelect from "../components/SearchableSelect";
import SectionHeroCard from "../components/SectionHeroCard";
import { useSite, useCopy } from "../context/SiteData";

const INQUIRY_SERVICES = [
  "Cloud & DevOps",
  "Custom software",
  "Website Development",
  "Mobile app",
  "AI & automation",
  "Job application",
  "Internship application",
  "Something else"
];

const JOB_ROLES = [
  "Cloud & DevOps Engineer",
  "Full-Stack Developer",
  "Mobile App Developer",
  "QA Automation Engineer",
  "UI/UX Designer",
  "Business Development Executive",
  "General Application / Other"
];

const EXPERIENCE_OPTIONS = [
  "Fresher / Entry Level",
  "1 - 2 Years",
  "3 - 5 Years",
  "5+ Years"
];

const INTERN_TRACKS = [
  "Cloud & DevOps",
  "Full-stack web",
  "Mobile apps",
  "UI/UX design",
  "General / Other Track"
];

const DEGREES = [
  "B.Sc - Cloud Computing",
  "B.Sc - Data Science",
  "B.Sc - Artificial Intelligence & Machine Learning (AI & ML)",
  "B.Sc - Computer Science (CS)",
  "B.Sc - Information Technology (IT)",
  "B.Sc - Cyber Security",
  "B.E. / B.Tech - Computer Science & Engineering (CSE)",
  "B.E. / B.Tech - Information Technology (IT)",
  "B.E. / B.Tech - AI & Data Science (AI & DS)",
  "B.E. / B.Tech - AI & Machine Learning (AI & ML)",
  "BCA (Bachelor of Computer Applications)",
  "MCA (Master of Computer Applications)",
  "M.Sc - Computer Science",
  "M.Sc - Data Science & AI",
  "M.Sc - Information Technology",
  "M.E. / M.Tech - Computer Science / IT / AI",
  "Diploma in Computer Engineering / IT",
  "B.Voc - Software Development",
  "Other IT / Computer Science Degree"
];

const STUDY_YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Graduated",
  "Post-Graduated"
];

export default function Contact() {
  const [searchParams] = useSearchParams();
  const site = useSite();
  const copy = useCopy("contact");

  const inquiryServicesList = useMemo(() => {
    if (Array.isArray(site?.services) && site.services.length > 0) {
      const titles = site.services.map((s: any) => s.title);
      return Array.from(new Set([...titles, "Job application", "Internship application", "Something else"]));
    }
    return INQUIRY_SERVICES;
  }, [site?.services]);

  const jobRolesList = useMemo(() => {
    if (Array.isArray(site?.jobs) && site.jobs.length > 0) {
      const titles = site.jobs.map((j: any) => j.title);
      return Array.from(new Set([...titles, "General Application / Other"]));
    }
    return JOB_ROLES;
  }, [site?.jobs]);

  // Core fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("Cloud & DevOps");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Job specific fields
  const [roleApplied, setRoleApplied] = useState(JOB_ROLES[0]);
  const [experience, setExperience] = useState("1 - 2 Years");

  // Internship specific fields
  const [internTrack, setInternTrack] = useState(INTERN_TRACKS[0]);
  const [collegeName, setCollegeName] = useState("");
  const [degree, setDegree] = useState(DEGREES[0]);
  const [yearOfStudy, setYearOfStudy] = useState("3rd Year");
  const [completionYear, setCompletionYear] = useState("2024");

  // Resume upload
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<string>("");
  const [resumeName, setResumeName] = useState<string>("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Initialize query params from URL
  useEffect(() => {
    const qt = searchParams.get("type");
    const qr = searchParams.get("role");

    if (qt) {
      setInterest(qt);
      if (qr) {
        if (/job/i.test(qt)) {
          const matched = JOB_ROLES.find((r) => r.toLowerCase().includes(qr.toLowerCase()));
          if (matched) setRoleApplied(matched);
        } else if (/intern/i.test(qt)) {
          const matched = INTERN_TRACKS.find((t) => qr.toLowerCase().includes(t.toLowerCase()));
          if (matched) setInternTrack(matched);
        }
      }
    }
  }, [searchParams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg("Resume file size must be under 4 MB.");
      return;
    }

    const validExtensions = [".pdf", ".doc", ".docx"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(ext)) {
      setErrorMsg("Resume must be a PDF or Word document (.pdf, .doc, .docx).");
      return;
    }

    setErrorMsg("");
    setResumeFile(file);
    setResumeName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setResumeData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumeData("");
    setResumeName("");
  };

  const isJob = interest === "Job application";
  const isInternship = interest === "Internship application";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (honeypot) return; // bot detected

    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    // Mobile / phone number is mandatory for all inquiries
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg("Please enter your phone / mobile number (mandatory).");
      return;
    }

    if (isInternship && !collegeName.trim()) {
      setErrorMsg("Please write your college name (mandatory).");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isJob) {
        // Submit Job Application
        const payload = {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role: roleApplied,
          kind: "job",
          experience,
          message: message.trim() || `Job application for ${roleApplied}.`,
          resumeName: resumeName || undefined,
          resumeData: resumeData || undefined
        };

        const res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "Failed to submit job application.");
        }

        setSuccessMsg(
          `Your application is submitted successfully! Thank you, ${name}. Our recruitment team will review your resume for ${roleApplied} and contact you soon.`
        );
      } else if (isInternship) {
        // Submit Internship Application
        if (
          (yearOfStudy === "Graduated" || yearOfStudy === "Post-Graduated") &&
          !completionYear.trim()
        ) {
          setErrorMsg("Please enter your completion / graduation year (mandatory).");
          setIsSubmitting(false);
          return;
        }

        const formattedYear =
          (yearOfStudy === "Graduated" || yearOfStudy === "Post-Graduated") && completionYear.trim()
            ? `${yearOfStudy} (${completionYear.trim()})`
            : yearOfStudy;

        const payload = {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role: `${internTrack} Internship`,
          kind: "internship",
          college: collegeName.trim(),
          degree,
          graduation_year: formattedYear,
          message: message.trim() || `Internship application for ${internTrack} from ${collegeName.trim()}.`,
          resumeName: resumeName || undefined,
          resumeData: resumeData || undefined
        };

        const res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "Failed to submit internship application.");
        }

        setSuccessMsg(
          `Your application is submitted successfully! Thank you, ${name}. Your academic details from ${collegeName.trim()} for the ${internTrack} track have been registered.`
        );
      } else {
        // Submit Client Inquiry
        const inquiryNote = [
          message.trim(),
          websiteUrl.trim() ? `Website: ${websiteUrl.trim()}` : ""
        ].filter(Boolean).join("\n") || `Consultation enquiry for ${interest}.`;

        const payload = {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          service: interest,
          message: inquiryNote
        };

        const res = await fetch("/api/inquiries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (res && res.ok) {
          setSuccessMsg("Thanks. We have your message and will reply within two working days.");
        } else {
          setSuccessMsg("Thanks. We have your message and will reply within two working days.");
        }
      }

      // Reset fields
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setWebsiteUrl("");
      setCollegeName("");
      setResumeFile(null);
      setResumeData("");
      setResumeName("");
    } catch (err: any) {
      setErrorMsg(err.message || "Sorry, we could not send your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Tell us about your project or apply to join our Pune engineering team."
      />

      {/* Page Header */}
      <div className="phero">
        <div className="wrap">
          <div className="phero-content">
            <nav className="crumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span>Contact</span>
            </nav>
            <h1>Contact us</h1>
            <p>Tell us about your project or submit your application to join our Pune team.</p>
          </div>
          <SectionHeroCard variant="contact" />
        </div>
      </div>

      {/* Contact Grid */}
      <section className="contact" id="contact">
        <div className="wrap cg">
          <div className="cl rv">
            <h2>Let's talk about your project</h2>
            <p className="mut" style={{ margin: "20px 0 30px", maxWidth: "44ch" }}>
              Share a few details and an engineer will reply within two working days. No sales pitch, just a practical plan.
            </p>

            <div className="facts">
              <div className="fi">
                <span className="fic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                  </svg>
                </span>
                <div>
                  <small>Offices in Maharashtra</small>
                  <p style={{ fontWeight: 600, color: "var(--ink)", marginBottom: "2px" }}>Main HQ: Pune, Maharashtra</p>
                  <p style={{ fontSize: "0.92rem", color: "var(--mut)" }}>Branch: Ahilyanagar, Maharashtra</p>
                </div>
              </div>

              <div className="fi">
                <span className="fic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 6v6l4 2" />
                  </svg>
                </span>
                <div>
                  <small>Working hours</small>
                  <p>{copy?.hours || "Monday to Saturday, 10:00 to 19:00 IST"}</p>
                </div>
              </div>

              <div className="fi">
                <span className="fic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 5h18v14H3zM3 7l9 7 9-7" />
                  </svg>
                </span>
                <div>
                  <small>Email</small>
                  <p>
                    <a href={`mailto:${copy?.email || "contact@kairoedge.com"}`}>{copy?.email || "contact@kairoedge.com"}</a>
                  </p>
                </div>
              </div>

              <div className="fi">
                <span className="fic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                  </svg>
                </span>
                <div>
                  <small>Phone</small>
                  <p>
                    <a href={`tel:${(copy?.phone || "+91 20 1234 5678").replace(/\s+/g, "")}`}>{copy?.phone || "+91 20 1234 5678"}</a>
                  </p>
                </div>
              </div>
            </div>

            <ol className="nx">
              <li>
                <b>We reply</b>
                <span>Within two working days, from an engineer.</span>
              </li>
              <li>
                <b>We talk</b>
                <span>A short call to understand your goals and limits.</span>
              </li>
              <li>
                <b>We propose</b>
                <span>A clear scope, timeline and fixed quote.</span>
              </li>
            </ol>
          </div>

          <form className="card cform rv" id="f" noValidate onSubmit={handleSubmit}>
            <input
              className="hp"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: "none" }}
            />

            <h3>
              {isJob
                ? "Job Application Form"
                : isInternship
                ? "Internship Application Form"
                : "Send us a message"}
            </h3>

            {/* Inquiries / Application Type Selector */}
            <div style={{ position: "relative", zIndex: 40 }}>
              <span style={{ display: "block", fontSize: "0.86rem", fontWeight: 600, color: "var(--ink)", marginBottom: "7px" }}>
                What do you need? <b style={{ color: "var(--sun)" }}>*</b>
              </span>
              <SearchableSelect
                options={inquiryServicesList}
                value={interest}
                onChange={(val) => {
                  setInterest(val);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                searchPlaceholder="Search service or application type..."
              />
            </div>

            {/* Basic Info */}
            <div className="two" style={{ position: "relative", zIndex: 30 }}>
              <label>
                <span>Full name <b style={{ color: "var(--sun)" }}>*</b></span>
                <input
                  name="n"
                  required
                  placeholder="Your full name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label>
                <span>Phone / Mobile Number <b style={{ color: "var(--sun)" }}>*</b></span>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
            </div>

            <label style={{ position: "relative", zIndex: 20 }}>
              <span>{isJob || isInternship ? "Email address" : "Work email"} <b style={{ color: "var(--sun)" }}>*</b></span>
              <input
                name="e"
                type="email"
                required
                placeholder="name@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            {/* Optional Website / Company link for Client Inquiries */}
            {!isJob && !isInternship && (
              <label style={{ animation: "fade .25s ease forwards", position: "relative", zIndex: 10 }}>
                <span>Website / Company Link (Optional)</span>
                <input
                  type="text"
                  placeholder="https://yourcompany.com or company name"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </label>
            )}

            {/* Dynamic Job Application Fields */}
            {isJob && (
              <div style={{ display: "grid", gap: "16px", animation: "fade .25s ease forwards" }}>
                <div className="two">
                  <div>
                    <span style={{ display: "block", fontSize: "0.86rem", fontWeight: 600, color: "var(--ink)", marginBottom: "7px" }}>
                      Role applied for <b style={{ color: "var(--sun)" }}>*</b>
                    </span>
                    <SearchableSelect
                      options={jobRolesList}
                      value={roleApplied}
                      onChange={(val) => setRoleApplied(val)}
                      searchPlaceholder="Search job roles..."
                    />
                  </div>

                  <div>
                    <span style={{ display: "block", fontSize: "0.86rem", fontWeight: 600, color: "var(--ink)", marginBottom: "7px" }}>
                      Total Experience
                    </span>
                    <SearchableSelect
                      options={EXPERIENCE_OPTIONS}
                      value={experience}
                      onChange={(val) => setExperience(val)}
                      searchPlaceholder="Search experience..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Internship Application Fields */}
            {isInternship && (
              <div style={{ display: "grid", gap: "16px", animation: "fade .25s ease forwards" }}>
                <div className="two">
                  <div>
                    <span style={{ display: "block", fontSize: "0.86rem", fontWeight: 600, color: "var(--ink)", marginBottom: "7px" }}>
                      Internship Track <b style={{ color: "var(--sun)" }}>*</b>
                    </span>
                    <SearchableSelect
                      options={INTERN_TRACKS}
                      value={internTrack}
                      onChange={(val) => setInternTrack(val)}
                      searchPlaceholder="Search track..."
                    />
                  </div>

                  <div>
                    <span style={{ display: "block", fontSize: "0.86rem", fontWeight: 600, color: "var(--ink)", marginBottom: "7px" }}>
                      Year of Study <b style={{ color: "var(--sun)" }}>*</b>
                    </span>
                    <SearchableSelect
                      options={STUDY_YEARS}
                      value={yearOfStudy}
                      onChange={(val) => setYearOfStudy(val)}
                      searchPlaceholder="Search year of study..."
                    />
                  </div>
                </div>

                {(yearOfStudy === "Graduated" || yearOfStudy === "Post-Graduated") && (
                  <label style={{ animation: "fade .25s ease forwards" }}>
                    <span>Completion / Passing Year <b style={{ color: "var(--sun)" }}>*</b></span>
                    <input
                      type="number"
                      min={2015}
                      max={2026}
                      required
                      placeholder="e.g. 2024"
                      value={completionYear}
                      onChange={(e) => setCompletionYear(e.target.value)}
                    />
                  </label>
                )}

                <label>
                  <span>College Name <b style={{ color: "var(--sun)" }}>*</b></span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune Institute of Computer Technology (PICT) or COEP Tech"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                  />
                </label>

                <div>
                  <span style={{ display: "block", fontSize: "0.86rem", fontWeight: 600, color: "var(--ink)", marginBottom: "7px" }}>
                    Degree <b style={{ color: "var(--sun)" }}>*</b>
                  </span>
                  <SearchableSelect
                    options={DEGREES}
                    value={degree}
                    onChange={(val) => setDegree(val)}
                    searchPlaceholder="Search degree (e.g. B.Sc Cloud, B.Tech CSE, MCA)..."
                  />
                </div>
              </div>
            )}

            {/* Resume Upload for Job & Internship */}
            {(isJob || isInternship) && (
              <div className="file-upload-section" style={{ animation: "fade .25s ease forwards" }}>
                <span style={{ display: "block", fontWeight: 500, fontSize: "0.92rem", marginBottom: "4px" }}>
                  Upload Resume / CV (PDF, DOC, DOCX — max 4 MB)
                </span>

                {resumeFile ? (
                  <div className="file-selected-box">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                      <FileText size={20} color="var(--sun)" />
                      <div style={{ minWidth: 0 }}>
                        <b style={{ display: "block", fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {resumeName}
                        </b>
                        <small style={{ color: "var(--mut)", fontSize: "0.75rem" }}>
                          {(resumeFile.size / 1024).toFixed(1)} KB
                        </small>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="file-remove-btn"
                      onClick={removeResume}
                      title="Remove file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="file-dropzone">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <Upload size={22} color="var(--sun)" style={{ marginBottom: "4px" }} />
                    <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                      Click to choose resume file
                    </span>
                    <small style={{ color: "var(--mut)", fontSize: "0.76rem" }}>
                      Supports PDF, DOC, DOCX up to 4 MB
                    </small>
                  </label>
                )}
              </div>
            )}

            <label>
              <span>{isJob || isInternship ? "Cover Note / Additional Details (Optional)" : "Tell us about your project"}</span>
              <textarea
                rows={isJob || isInternship ? 3 : 4}
                id="msg"
                placeholder={
                  isJob
                    ? "Key skills, notice period, or links to recent projects..."
                    : isInternship
                    ? "Technologies you've worked on, GitHub projects, or goals..."
                    : "Tell us about your requirements and timeline..."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>

            {errorMsg && (
              <div className="err" id="err" role="alert" style={{ display: "block" }}>
                {errorMsg}
              </div>
            )}

            <button className="btn pri" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : isJob || isInternship
                ? "Submit Application →"
                : "Send message"}
            </button>

            <p className="mut" style={{ fontSize: ".85rem", margin: 0 }}>
              We use your details only to reply to your enquiry or application.
            </p>

            {successMsg && (
              <div
                className="ok"
                id="ok"
                role="status"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  lineHeight: "1.5"
                }}
              >
                <CheckCircle2 size={22} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <b style={{ display: "block", marginBottom: "4px" }}>Application Submitted Successfully</b>
                  <span>{successMsg}</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="wrap">
          <div className="head rv">
            <h2>Questions we hear often</h2>
          </div>
          <div className="faq rv">
            <details>
              <summary>How long does a typical project take?</summary>
              <p className="mut">
                Most first releases ship in about two weeks. Larger platforms are delivered in two-week sprints, each ending with a working demo.
              </p>
            </details>
            <details>
              <summary>Will we own the source code?</summary>
              <p className="mut">
                Yes. Code, designs and cloud accounts are yours from day one, with no lock-in.
              </p>
            </details>
            <details>
              <summary>Do you support us after launch?</summary>
              <p className="mut">
                Yes. We offer monitoring, security patches and feature work on a monthly plan, with an on-call team for urgent issues.
              </p>
            </details>
            <details>
              <summary>Do you work with startups and small businesses?</summary>
              <p className="mut">
                Yes. We scale the team and the budget to your stage, from a first prototype to an enterprise rollout.
              </p>
            </details>
            <details>
              <summary>How do you price projects?</summary>
              <p className="mut">
                After a short discovery call we send a fixed quote for a defined scope, or a monthly rate for an ongoing team.
              </p>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
