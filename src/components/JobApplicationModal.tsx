import React, { useState, useEffect, useRef, useMemo } from "react";
import { X, Upload, FileText, CheckCircle2, Briefcase, Phone, Mail, User } from "lucide-react";
import SearchableSelect from "./SearchableSelect";
import { useSite } from "../context/SiteData";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: string;
}

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

const NOTICE_OPTIONS = [
  "Immediate Joiner",
  "15 Days",
  "30 Days",
  "60 Days",
  "90 Days"
];

const CANDIDATE_JOB_STORAGE_KEY = "kairo_job_candidate_profile";

export default function JobApplicationModal({
  isOpen,
  onClose,
  initialRole = "Cloud & DevOps Engineer"
}: JobApplicationModalProps) {
  const site = useSite();

  const availableRoles = useMemo(() => {
    if (Array.isArray(site?.jobs) && site.jobs.length > 0) {
      const titles = site.jobs.map((j: any) => j.title);
      return Array.from(new Set([...titles, "General Application / Other"]));
    }
    return JOB_ROLES;
  }, [site?.jobs]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(initialRole);
  const [experience, setExperience] = useState("1 - 2 Years");
  const [currentCompany, setCurrentCompany] = useState("");
  const [currentDesignation, setCurrentDesignation] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("Immediate Joiner");
  const [expectedCtc, setExpectedCtc] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [message, setMessage] = useState("");

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<string>("");
  const [resumeName, setResumeName] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const modalCardRef = useRef<HTMLDivElement>(null);

  // Always start with clean, empty fields whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setPhone("");
      setCurrentCompany("");
      setCurrentDesignation("");
      setExpectedCtc("");
      setPortfolioUrl("");
      setMessage("");
      setResumeFile(null);
      setResumeData("");
      setResumeName("");
      setErrorMsg("");
      setIsSuccess(false);
      try {
        localStorage.removeItem(CANDIDATE_JOB_STORAGE_KEY);
      } catch {}
    }
  }, [isOpen]);

  useEffect(() => {
    if (isSuccess && modalCardRef.current) {
      modalCardRef.current.scrollTop = 0;
    }
  }, [isSuccess]);

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate mandatory fields
    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg("Please enter a valid mobile number (mandatory).");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setErrorMsg("Please enter a valid email address (mandatory).");
      return;
    }
    if (!role.trim()) {
      setErrorMsg("Please select the role you are applying for.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: role.trim(),
        kind: "job",
        experience,
        current_company: currentCompany.trim() || undefined,
        current_designation: currentDesignation.trim() || undefined,
        notice_period: noticePeriod,
        expected_ctc: expectedCtc.trim() || undefined,
        portfolio_url: portfolioUrl.trim() || undefined,
        message: message.trim() || `Job application for ${role}.`,
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
        throw new Error(data.error || "Failed to submit application. Please try again.");
      }

      try {
        localStorage.setItem(
          CANDIDATE_JOB_STORAGE_KEY,
          JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            experience,
            currentCompany: currentCompany.trim(),
            currentDesignation: currentDesignation.trim(),
            noticePeriod,
            expectedCtc: expectedCtc.trim(),
            portfolioUrl: portfolioUrl.trim()
          })
        );
      } catch {}

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchRole = (newRole: string) => {
    setRole(newRole);
    setIsSuccess(false);
    setErrorMsg("");
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMsg("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal-wrap">
        <div
          ref={modalCardRef}
          className={`modal-card ${isSuccess ? "modal-card-success" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success Screen */}
          {isSuccess ? (
            <div className="success-dialog-wrapper">
              <div className="success-top-bar">
                <div className="success-badge-status">
                  <span className="status-pulse-dot" />
                  <span>Application Submitted &bull; Received</span>
                </div>
                <button
                  type="button"
                  className="modal-close"
                  onClick={handleClose}
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="success-hero">
                <div className="success-icon-ring">
                  <CheckCircle2 size={28} color="var(--sun)" />
                </div>
                <h2 className="success-hero-title">Your Application is Submitted!</h2>
                <p className="success-hero-sub">
                  Thank you, <strong style={{ color: "var(--ink)" }}>{name}</strong>! Your application for{" "}
                  <strong style={{ color: "var(--sun)" }}>{role}</strong> has been received.
                </p>
              </div>

              <div className="success-summary-card">
                <div className="success-summary-grid">
                  <div className="summary-item">
                    <span className="summary-item-label">Candidate</span>
                    <span className="summary-item-value">{name}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-item-label">Mobile</span>
                    <span className="summary-item-value">{phone}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-item-label">Email</span>
                    <span className="summary-item-value">{email}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-item-label">Position</span>
                    <span className="summary-item-value highlight">{role}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-item-label">Experience</span>
                    <span className="summary-item-value">{experience}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-item-label">Notice Period</span>
                    <span className="summary-item-value">{noticePeriod}</span>
                  </div>
                  {currentCompany && (
                    <div className="summary-item">
                      <span className="summary-item-label">Current Company</span>
                      <span className="summary-item-value">{currentCompany}</span>
                    </div>
                  )}
                  {resumeName && (
                    <div className="summary-item-full">
                      <span className="summary-item-label">Attached Resume</span>
                      <span className="summary-item-value" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <FileText size={14} color="var(--sun)" />
                        {resumeName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="multi-apply-card">
                <div className="multi-apply-title-row">
                  <span className="multi-apply-title">
                    <CheckCircle2 size={14} color="var(--sun)" />
                    Apply for another position with saved details:
                  </span>
                </div>
                <div className="multi-apply-chips">
                  {availableRoles.filter((r) => r !== role).slice(0, 4).map((otherRole) => (
                    <button
                      key={otherRole}
                      type="button"
                      className="multi-apply-chip"
                      onClick={() => handleSwitchRole(otherRole)}
                      title={`Apply for ${otherRole} now`}
                    >
                      + {otherRole}
                    </button>
                  ))}
                </div>
              </div>

              <div className="success-btn-row">
                <button
                  type="button"
                  className="btn pri"
                  onClick={handleClose}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div className="fic" style={{ width: "38px", height: "38px", borderRadius: "10px" }}>
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
                      Apply: {role}
                    </h3>
                    <small style={{ color: "var(--mut)", fontSize: "0.82rem" }}>
                      Join the KairoEdge engineering team in Pune (HQ)
                    </small>
                  </div>
                </div>
                <button
                  type="button"
                  className="modal-close"
                  onClick={handleClose}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Application Form */}
              <form onSubmit={handleSubmit} className="modal-form" noValidate>
                <div className="form-grid-2">
                <label>
                  <span>Full Name <b style={{ color: "var(--sun)" }}>*</b></span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>

                <label>
                  <span>Mobile Number <b style={{ color: "var(--sun)" }}>*</b></span>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-grid-2">
                <label>
                  <span>Email Address <b style={{ color: "var(--sun)" }}>*</b></span>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                <div>
                  <span style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#1E293B", marginBottom: "5px" }}>
                    Position Applied For
                  </span>
                  <div className="track-display-box">
                    <span className="track-display-dot" />
                    <span className="track-display-title">{role}</span>
                  </div>
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <span style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#1E293B", marginBottom: "5px" }}>
                    Total Experience
                  </span>
                  <SearchableSelect
                    options={EXPERIENCE_OPTIONS}
                    value={experience}
                    onChange={(val) => setExperience(val)}
                    searchPlaceholder="Search experience..."
                  />
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#1E293B", marginBottom: "5px" }}>
                    Notice Period
                  </span>
                  <SearchableSelect
                    options={NOTICE_OPTIONS}
                    value={noticePeriod}
                    onChange={(val) => setNoticePeriod(val)}
                    searchPlaceholder="Search notice period..."
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <label>
                  <span>Current Company (Optional)</span>
                  <input
                    type="text"
                    placeholder="e.g. Current employer"
                    value={currentCompany}
                    onChange={(e) => setCurrentCompany(e.target.value)}
                  />
                </label>

                <label>
                  <span>Current / Recent Designation</span>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer"
                    value={currentDesignation}
                    onChange={(e) => setCurrentDesignation(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-grid-2">
                <label>
                  <span>Expected CTC (Optional)</span>
                  <input
                    type="text"
                    placeholder="e.g. ₹8 - 12 LPA"
                    value={expectedCtc}
                    onChange={(e) => setExpectedCtc(e.target.value)}
                  />
                </label>

                <label>
                  <span>Portfolio / GitHub / LinkedIn</span>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                  />
                </label>
              </div>

              {/* Resume File Upload */}
              <div className="file-upload-section">
                <span style={{ display: "flex", justifyContent: "space-between", fontSize: "0.83rem", fontWeight: 600, color: "#1E293B", marginBottom: "5px" }}>
                  <span>Resume / CV <small style={{ fontWeight: 400, color: "#64748B" }}>(Optional)</small></span>
                  <small style={{ fontWeight: 500, color: "#0284C7" }}>PDF, DOC, DOCX · Max 4 MB</small>
                </span>

                {resumeFile ? (
                  <div className="file-selected-box">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                      <FileText size={20} color="#0070F3" />
                      <div style={{ minWidth: 0 }}>
                        <b style={{ display: "block", fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#0F172A" }}>
                          {resumeName}
                        </b>
                        <small style={{ color: "#64748B", fontSize: "0.75rem" }}>
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
                    <Upload size={22} color="#0070F3" style={{ marginBottom: "4px" }} />
                    <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0F172A" }}>
                      Click to choose your resume file
                    </span>
                    <small style={{ color: "#64748B", fontSize: "0.76rem" }}>
                      Supports PDF, DOC, DOCX up to 4 MB
                    </small>
                  </label>
                )}
              </div>

              <label>
                <span>Message / Cover Note (Optional)</span>
                <textarea
                  rows={3}
                  placeholder="Share a brief overview of your projects, key tech stack, or why you want to work with us..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </label>

              {errorMsg && (
                <div className="err" role="alert" style={{ fontSize: "0.9rem" }}>
                  {errorMsg}
                </div>
              )}

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn pri"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting Application..." : "Submit Application →"}
                </button>
              </div>

              <p className="mut" style={{ fontSize: "0.8rem", textAlign: "center", margin: "4px 0 0" }}>
                We respect your privacy. Your details are used strictly for recruitment purposes.
              </p>
            </form>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
