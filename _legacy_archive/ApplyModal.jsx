import React, { useEffect, useState } from "react";
import CustomSelect from "./CustomSelect";
import { useSite } from "../context/SiteData";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  // Internship-specific academic fields
  college: "",
  otherCollege: "",
  degree: "",
  otherDegree: "",
  branch: "",
  otherBranch: "",
  graduation_year: "",
  otherYear: "",
  // Full-time Job-specific professional fields
  experience: "",
  otherExperience: "",
  current_company: "",
  current_designation: "",
  notice_period: "",
  otherNotice: "",
  expected_ctc: "",
  portfolio_url: "",
  message: ""
};

// --- Internship Academic Options ---
const degreeOptions = [
  { value: "B.Tech / B.E.", label: "B.Tech / B.E. (Engineering)" },
  { value: "BCA", label: "BCA (Computer Applications)" },
  { value: "MCA", label: "MCA (Master of Computer Applications)" },
  { value: "M.Tech", label: "M.Tech / M.E." },
  { value: "B.Sc (Comp Sci / IT)", label: "B.Sc (Computer Science / IT)" },
  { value: "Diploma in Engineering", label: "Diploma in Engineering" },
  { value: "Other", label: "Other Degree", subtext: "Type manually below" }
];

const branchOptions = [
  { value: "Computer Science & Engineering (CSE)", label: "Computer Science & Engineering (CSE)" },
  { value: "Information Technology (IT)", label: "Information Technology (IT)" },
  { value: "AI & Data Science", label: "Artificial Intelligence & Data Science" },
  { value: "Electronics & Communication (ECE)", label: "Electronics & Communication (ECE)" },
  { value: "Electrical & Electronics (EEE)", label: "Electrical & Electronics (EEE)" },
  { value: "Cyber Security / IoT", label: "Cyber Security / IoT" },
  { value: "Mechanical / Civil / Other", label: "Mechanical / Civil" },
  { value: "Other", label: "Other Branch", subtext: "Type manually below" }
];

const yearOptions = [
  { value: "1st Year", label: "1st Year Student" },
  { value: "2nd Year", label: "2nd Year Student" },
  { value: "3rd Year", label: "3rd Year Student" },
  { value: "4th Year (Final Year)", label: "4th Year (Final Year)" },
  { value: "Graduated", label: "Already Graduated / Passed Out" },
  { value: "Postgraduate", label: "Postgraduate (Pursuing / Completed)" },
  { value: "Other", label: "Other Status", subtext: "Type manually below" }
];

// --- Full-time Job Professional Options ---
const experienceOptions = [
  { value: "Fresher / Entry (< 1 yr)", label: "Fresher / Entry Level (< 1 yr)" },
  { value: "1 - 2 Years", label: "1 - 2 Years (Junior / Associate)" },
  { value: "3 - 5 Years", label: "3 - 5 Years (Mid-level Engineer)" },
  { value: "5 - 8 Years", label: "5 - 8 Years (Senior / Lead)" },
  { value: "8+ Years", label: "8+ Years (Principal / Architect / Manager)" },
  { value: "Other", label: "Other Experience", subtext: "Type manually below" }
];

const noticePeriodOptions = [
  { value: "Immediate Joiner", label: "Immediate Joiner / Serving Notice" },
  { value: "15 Days", label: "15 Days or less" },
  { value: "30 Days", label: "30 Days (Standard 1 Month)" },
  { value: "60 Days", label: "60 Days (2 Months)" },
  { value: "90 Days", label: "90 Days (3 Months)" },
  { value: "Other", label: "Other Notice Period", subtext: "Type manually below" }
];

export default function ApplyModal({ job, isOpen, onClose }) {
  const { colleges: siteColleges = [] } = useSite();
  const [form, setForm] = useState(emptyForm);
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [submittedId, setSubmittedId] = useState(null);
  const [activeColleges, setActiveColleges] = useState(siteColleges);

  // Load active colleges from API
  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/colleges")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length) setActiveColleges(data);
      })
      .catch(() => {});
  }, [isOpen]);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset status on open/close
  useEffect(() => {
    if (isOpen) {
      setError("");
      setStatus("idle");
      setSubmittedId(null);
    }
  }, [isOpen, job?.slug]);

  if (!isOpen || !job) return null;

  const isInternship =
    job.type.includes("Internship") || job.type.includes("Training");

  // Format colleges options with Other
  const collegeOptions = [
    ...activeColleges.map((col) => ({
      value: col.name,
      label: col.name,
      subtext: col.code ? `${col.code} · ${col.city || "Pune"}` : (col.city || "Pune")
    })),
    {
      value: "Other",
      label: "Other / College not listed above",
      subtext: "Type manually below"
    }
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const finalCollege =
      form.college === "Other"
        ? form.otherCollege.trim() || "Other College"
        : form.college;

    const finalDegree =
      form.degree === "Other"
        ? form.otherDegree.trim() || "Other Degree"
        : form.degree;

    const finalBranch =
      form.branch === "Other"
        ? form.otherBranch.trim() || "Other Branch"
        : form.branch;

    const finalYear =
      form.graduation_year === "Other"
        ? form.otherYear.trim() || "Other"
        : form.graduation_year;

    const finalExperience =
      form.experience === "Other"
        ? form.otherExperience.trim() || "Other"
        : form.experience;

    const finalNotice =
      form.notice_period === "Other"
        ? form.otherNotice.trim() || "Other"
        : form.notice_period;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: job.title,
      kind: isInternship ? "internship" : "job",
      message: form.message.trim(),
      resumeName: resume?.name || "",
      resumeData: resume?.data || ""
    };

    if (isInternship) {
      payload.college = finalCollege || null;
      payload.degree = finalDegree || null;
      payload.branch = finalBranch || null;
      payload.graduation_year = finalYear || null;
    } else {
      payload.experience = finalExperience || null;
      payload.current_company = form.current_company.trim() || null;
      payload.current_designation = form.current_designation.trim() || null;
      payload.notice_period = finalNotice || null;
      payload.expected_ctc = form.expected_ctc.trim() || null;
      payload.portfolio_url = form.portfolio_url.trim() || null;
    }

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "We could not submit your application.");
      }

      setSubmittedId(data.id);
      setStatus("sent");
      setForm(emptyForm);
      setResume(null);
    } catch (err) {
      setStatus("idle");
      setError(err.message);
    }
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="apply-popup-backdrop" onClick={handleBackdropClick}>
      <div className="apply-popup-card" role="dialog" aria-modal="true">
        {/* Close Button */}
        <button
          type="button"
          className="apply-popup-close-btn"
          onClick={onClose}
          aria-label="Close application form"
        >
          ✕
        </button>

        {status === "sent" ? (
          <div className="apply-success-box" style={{ padding: "40px 20px" }}>
            <h2 style={{ fontSize: "24px", color: "#34d399", margin: "0 0 12px" }}>
              Application Submitted Successfully
            </h2>
            <p style={{ color: "#e2e8f0", maxWidth: "520px", lineHeight: 1.6, textAlign: "center" }}>
              Thank you for applying for <strong>{job.title}</strong>
              {submittedId ? ` (Ref #${submittedId})` : ""}. Our talent acquisition team will review your application and contact you directly.
            </p>
            <button
              type="button"
              className="btn-job-apply"
              style={{ width: "auto", minWidth: "160px", marginTop: "12px" }}
              onClick={onClose}
            >
              Done & Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="apply-popup-header">
              <span className={`job-kind-badge ${isInternship ? "internship" : "job"}`} style={{ width: "fit-content" }}>
                {isInternship ? "Internship Application" : "Full-Time Professional Role"}
              </span>
              <h2 id="apply-popup-title" style={{ fontSize: "24px", color: "#ffffff", margin: "6px 0 2px" }}>
                Apply for {job.title}
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                {job.location} · Pune Delivery Center
              </p>

              <div className="apply-requirement-notice">
                <span>
                  Please complete the candidate profile below. Asterisk (<strong style={{ color: "#f43f5e" }}>*</strong>) marks required fields.
                </span>
              </div>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="apply-popup-form">
              {/* SECTION 1: CANDIDATE CONTACT (Shared) */}
              <div className="apply-field-group">
                <div className="apply-group-title">
                  Candidate Contact Details
                </div>
                <div className="apply-grid-3">
                  <label className="apply-label">
                    <span>
                      Full Name <span className="apply-req">*</span>
                    </span>
                    <input
                      className="apply-input"
                      name="name"
                      value={form.name}
                      required
                      minLength={2}
                      maxLength={80}
                      placeholder="e.g. Rahul Sharma"
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </label>

                  <label className="apply-label">
                    <span>
                      Email Address <span className="apply-req">*</span>
                    </span>
                    <input
                      className="apply-input"
                      name="email"
                      type="email"
                      value={form.email}
                      required
                      maxLength={160}
                      placeholder="rahul@example.com"
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </label>

                  <label className="apply-label">
                    <span>
                      Mobile Number <span className="apply-req">*</span>
                    </span>
                    <input
                      className="apply-input"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      required
                      maxLength={40}
                      placeholder="+91 98765 43210"
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </label>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* SECTION 2A: FOR INTERNSHIPS ONLY (Academic Info & Colleges) */}
              {/* ========================================================================= */}
              {isInternship && (
                <div className="apply-field-group">
                  <div className="apply-group-title">
                    Academic & College Information
                  </div>

                  <div className="apply-grid-2" style={{ marginBottom: "14px" }}>
                    {/* College Select + Manual input if Other */}
                    <div className="apply-label">
                      <span>College / University</span>
                      <CustomSelect
                        value={form.college}
                        onChange={(val) => setForm({ ...form, college: val })}
                        options={collegeOptions}
                        placeholder="Select College"
                        searchable={true}
                        searchPlaceholder="Search by college name, code, or city…"
                      />
                      {form.college === "Other" && (
                        <div style={{ marginTop: "8px" }}>
                          <input
                            className="apply-input manual-input"
                            placeholder="Type your college / university name…"
                            value={form.otherCollege}
                            maxLength={160}
                            onChange={(e) => setForm({ ...form, otherCollege: e.target.value })}
                            autoFocus
                          />
                        </div>
                      )}
                    </div>

                    {/* Degree Select + Manual input if Other */}
                    <div className="apply-label">
                      <span>Degree / Program</span>
                      <CustomSelect
                        value={form.degree}
                        onChange={(val) => setForm({ ...form, degree: val })}
                        options={degreeOptions}
                        placeholder="Select Degree"
                      />
                      {form.degree === "Other" && (
                        <div style={{ marginTop: "8px" }}>
                          <input
                            className="apply-input manual-input"
                            placeholder="Type your degree / program name…"
                            value={form.otherDegree}
                            maxLength={120}
                            onChange={(e) => setForm({ ...form, otherDegree: e.target.value })}
                            autoFocus
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="apply-grid-2">
                    {/* Branch Select + Manual input if Other */}
                    <div className="apply-label">
                      <span>Branch / Specialization</span>
                      <CustomSelect
                        value={form.branch}
                        onChange={(val) => setForm({ ...form, branch: val })}
                        options={branchOptions}
                        placeholder="Select Branch"
                      />
                      {form.branch === "Other" && (
                        <div style={{ marginTop: "8px" }}>
                          <input
                            className="apply-input manual-input"
                            placeholder="Type your branch / specialization…"
                            value={form.otherBranch}
                            maxLength={120}
                            onChange={(e) => setForm({ ...form, otherBranch: e.target.value })}
                            autoFocus
                          />
                        </div>
                      )}
                    </div>

                    {/* Academic Year / Education Status Select */}
                    <div className="apply-label">
                      <span>Academic Year / Education Status</span>
                      <CustomSelect
                        value={form.graduation_year}
                        onChange={(val) => setForm({ ...form, graduation_year: val })}
                        options={yearOptions}
                        placeholder="Select Academic Year / Status"
                      />
                      {form.graduation_year === "Other" && (
                        <div style={{ marginTop: "8px" }}>
                          <input
                            className="apply-input manual-input"
                            placeholder="Type your year / education status…"
                            value={form.otherYear}
                            maxLength={100}
                            onChange={(e) => setForm({ ...form, otherYear: e.target.value })}
                            autoFocus
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* SECTION 2B: FOR FULL-TIME ROLES ONLY (Experience & Employment Details) */}
              {/* ========================================================================= */}
              {!isInternship && (
                <div className="apply-field-group">
                  <div className="apply-group-title">
                    Professional Experience & Employment Details
                  </div>

                  <div className="apply-grid-2" style={{ marginBottom: "14px" }}>
                    {/* Total Experience */}
                    <div className="apply-label">
                      <span>Total Work Experience</span>
                      <CustomSelect
                        value={form.experience}
                        onChange={(val) => setForm({ ...form, experience: val })}
                        options={experienceOptions}
                        placeholder="Select Total Experience"
                      />
                      {form.experience === "Other" && (
                        <div style={{ marginTop: "8px" }}>
                          <input
                            className="apply-input manual-input"
                            placeholder="Type your experience (e.g. 4.5 Years in React/Node)…"
                            value={form.otherExperience}
                            maxLength={60}
                            onChange={(e) => setForm({ ...form, otherExperience: e.target.value })}
                            autoFocus
                          />
                        </div>
                      )}
                    </div>

                    {/* Notice Period */}
                    <div className="apply-label">
                      <span>Notice Period</span>
                      <CustomSelect
                        value={form.notice_period}
                        onChange={(val) => setForm({ ...form, notice_period: val })}
                        options={noticePeriodOptions}
                        placeholder="Select Notice Period"
                      />
                      {form.notice_period === "Other" && (
                        <div style={{ marginTop: "8px" }}>
                          <input
                            className="apply-input manual-input"
                            placeholder="Type your notice duration…"
                            value={form.otherNotice}
                            maxLength={60}
                            onChange={(e) => setForm({ ...form, otherNotice: e.target.value })}
                            autoFocus
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="apply-grid-2" style={{ marginBottom: "14px" }}>
                    {/* Current Employer / Company */}
                    <label className="apply-label">
                      <span>Current Employer / Company</span>
                      <input
                        className="apply-input"
                        name="current_company"
                        value={form.current_company}
                        maxLength={120}
                        placeholder="e.g. Infosys, TCS, Freelance, or Seeking first role"
                        onChange={(e) => setForm({ ...form, current_company: e.target.value })}
                      />
                    </label>

                    {/* Current Designation / Role */}
                    <label className="apply-label">
                      <span>Current Designation / Title</span>
                      <input
                        className="apply-input"
                        name="current_designation"
                        value={form.current_designation}
                        maxLength={100}
                        placeholder="e.g. Senior Software Engineer, React Developer"
                        onChange={(e) => setForm({ ...form, current_designation: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="apply-grid-2">
                    {/* Expected CTC / Salary */}
                    <label className="apply-label">
                      <span>Expected CTC / Compensation</span>
                      <input
                        className="apply-input"
                        name="expected_ctc"
                        value={form.expected_ctc}
                        maxLength={60}
                        placeholder="e.g. ₹8 - ₹12 LPA or As per company norms"
                        onChange={(e) => setForm({ ...form, expected_ctc: e.target.value })}
                      />
                    </label>

                    {/* Portfolio / LinkedIn URL */}
                    <label className="apply-label">
                      <span>Portfolio, GitHub, or LinkedIn Profile URL</span>
                      <input
                        className="apply-input"
                        name="portfolio_url"
                        type="url"
                        value={form.portfolio_url}
                        maxLength={200}
                        placeholder="https://linkedin.com/in/... or https://github.com/..."
                        onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* SECTION 3: RESUME & BACKGROUND / PITCH */}
              {/* ========================================================================= */}
              <div className="apply-field-group">
                <div className="apply-group-title">
                  {isInternship ? "Resume & Academic Background Note" : "Resume & Cover Highlights"}
                </div>

                <label className="apply-label" style={{ marginBottom: "14px" }}>
                  <span>Upload Resume / CV</span>
                  <div className="apply-file-drop">
                    {resume ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ color: "#38bdf8", fontWeight: 600 }}>{resume.name}</span>
                        <button
                          type="button"
                          style={{
                            background: "none",
                            border: "none",
                            color: "#f43f5e",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 600
                          }}
                          onClick={() => setResume(null)}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <span style={{ color: "#38bdf8", fontSize: "14px", fontWeight: 500 }}>
                          Click to browse or attach resume file
                        </span>
                        <span style={{ color: "#64748b", fontSize: "12px" }}>
                          PDF or Word format under 4 MB
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf"
                          style={{ display: "none" }}
                          id="modal-resume-file"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (!file) {
                              setResume(null);
                              return;
                            }
                            if (file.size > 4_000_000) {
                              setError("Resume must be under 4 MB.");
                              setResume(null);
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => setResume({ name: file.name, data: reader.result });
                            reader.readAsDataURL(file);
                          }}
                        />
                      </>
                    )}
                  </div>
                  {!resume && (
                    <label
                      htmlFor="modal-resume-file"
                      style={{
                        display: "inline-block",
                        marginTop: "4px",
                        color: "#38bdf8",
                        fontSize: "12px",
                        cursor: "pointer",
                        textDecoration: "underline"
                      }}
                    >
                      Choose file from device
                    </label>
                  )}
                </label>

                <label className="apply-label">
                  <span>{isInternship ? "About You / Aspirations Pitch" : "Technical Highlights / Work Pitch"}</span>
                  <textarea
                    className="apply-textarea"
                    name="message"
                    rows={3}
                    value={form.message}
                    maxLength={2000}
                    placeholder={
                      isInternship
                        ? "Tell us about your technical projects, coding interests, or aspirations…"
                        : "Highlight your key technical strengths, projects delivered, architecture experience, and notice flexibility…"
                    }
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </label>
              </div>

              {error && (
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    background: "rgba(244, 63, 94, 0.12)",
                    border: "1px solid rgba(244, 63, 94, 0.35)",
                    color: "#fb7185",
                    fontSize: "13px",
                    marginBottom: "16px"
                  }}
                >
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
                <button
                  type="button"
                  className="btn-job-details"
                  style={{ width: "auto", minWidth: "100px" }}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="btn-job-apply"
                  type="submit"
                  disabled={status === "sending"}
                  style={{ width: "auto", minWidth: "180px" }}
                >
                  {status === "sending" ? "Submitting Application…" : "Submit Application →"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
