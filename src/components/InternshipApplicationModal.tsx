import React, { useState, useEffect, useRef, useMemo } from "react";
import { X, Upload, FileText, CheckCircle2, GraduationCap, Building2, MapPin } from "lucide-react";
import SearchableSelect from "./SearchableSelect";
import { MAHARASHTRA_DISTRICTS } from "../data/districts";

interface InternshipApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrack?: string;
}

const FALLBACK_COLLEGES = [
  { name: "College of Engineering, Pune (COEP Tech)", code: "COEP", district: "Pune" },
  { name: "Pune Institute of Computer Technology (PICT)", code: "PICT", district: "Pune" },
  { name: "Vishwakarma Institute of Technology (VIT Pune)", code: "VIT", district: "Pune" },
  { name: "MIT World Peace University (MIT-WPU)", code: "MIT-WPU", district: "Pune" },
  { name: "Cummins College of Engineering for Women (CCOEW)", code: "CCOEW", district: "Pune" },
  { name: "Bharati Vidyapeeth Deemed University College of Engineering", code: "BVDUCOE", district: "Pune" },
  { name: "Symbiosis Institute of Technology (SIT Pune)", code: "SIT", district: "Pune" },
  { name: "Army Institute of Technology (AIT Pune)", code: "AIT", district: "Pune" },
  { name: "Pimpri Chinchwad College of Engineering (PCCOE)", code: "PCCOE", district: "Pune" },
  { name: "Sinhgad College of Engineering (SCOE Vadgaon)", code: "SCOE", district: "Pune" },
  { name: "D.Y. Patil College of Engineering, Akurdi", code: "DYPCOE", district: "Pune" },
  { name: "Amrutvahini College of Engineering (AVCOE)", code: "AVCOE", district: "Ahilyanagar" },
  { name: "Pravara Rural Engineering College (PREC)", code: "PREC", district: "Ahilyanagar" },
  { name: "Sanjivani College of Engineering, Kopargaon", code: "SCOE-KOP", district: "Ahilyanagar" },
  { name: "Dr. Vithalrao Vikhe Patil College of Engineering", code: "DVVPCOE", district: "Ahilyanagar" },
  { name: "Government College of Engineering, Aurangabad (GECA)", code: "GECA", district: "Chhatrapati Sambhaji Nagar" },
  { name: "Jawaharlal Nehru Engineering College (JNEC)", code: "JNEC", district: "Chhatrapati Sambhaji Nagar" },
  { name: "Veermata Jijabai Technological Institute (VJTI)", code: "VJTI", district: "Mumbai City" },
  { name: "Sardar Patel Institute of Technology (SPIT)", code: "SPIT", district: "Mumbai Suburban" },
  { name: "K. K. Wagh Institute of Engineering Education & Research (KKWIEER)", code: "KKWIEER", district: "Nashik" }
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

const BRANCHES = [
  "Computer Science & Engineering (CSE)",
  "Information Technology (IT)",
  "Artificial Intelligence & Machine Learning (AI / ML)",
  "Data Science & Big Data",
  "Cloud Computing & DevOps",
  "Cyber Security & Digital Forensics",
  "Software Engineering",
  "Electronics & Telecommunication (E&TC)",
  "Computer Applications & Web Development",
  "UI/UX Design / Interaction Design",
  "Other Technical Branch"
];

const STUDY_YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Graduated",
  "Post-Graduated"
];

const ALL_TRACKS = [
  "Cloud & DevOps",
  "Full-stack web",
  "Mobile apps",
  "UI/UX design"
];

const CANDIDATE_STORAGE_KEY = "kairo_intern_candidate_profile";

export default function InternshipApplicationModal({
  isOpen,
  onClose,
  initialTrack = "Cloud & DevOps"
}: InternshipApplicationModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [track, setTrack] = useState(initialTrack);

  // District & College States
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [customDistrict, setCustomDistrict] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [customCollege, setCustomCollege] = useState("");
  const [collegesList, setCollegesList] = useState<any[]>(FALLBACK_COLLEGES);

  const [collegeName, setCollegeName] = useState("");
  const [degree, setDegree] = useState(DEGREES[0]);
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [yearOfStudy, setYearOfStudy] = useState("3rd Year");
  const [completionYear, setCompletionYear] = useState("2024");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [message, setMessage] = useState("");

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<string>("");
  const [resumeName, setResumeName] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const modalCardRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow || "";
      };
    }
  }, [isOpen]);

  // Fetch active campus colleges from backend API
  useEffect(() => {
    fetch("/api/colleges")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCollegesList(data);
        }
      })
      .catch(() => {});
  }, []);

  // District Dropdown Options (with "Other" support)
  const districtOptions = useMemo(() => {
    return MAHARASHTRA_DISTRICTS.map((d) => ({
      value: d,
      label: d === "Other" ? "Other District / Outside Maharashtra" : `${d} District`
    }));
  }, []);

  // College Dropdown Options filtered by chosen district
  const collegeOptions = useMemo(() => {
    if (!selectedDistrict) return [];
    if (selectedDistrict === "Other") {
      return [{ value: "OTHER", label: "Other / Specify College Name Manually" }];
    }
    const filtered = collegesList.filter(
      (c: any) =>
        (c.district || c.city || "").toLowerCase() === selectedDistrict.toLowerCase() &&
        c.is_active !== 0
    );
    const mapped = filtered.map((c: any) => ({
      value: c.name,
      label: c.code ? `${c.name} (${c.code})` : c.name
    }));
    return [...mapped, { value: "OTHER", label: "Other / My College is not listed" }];
  }, [selectedDistrict, collegesList]);

  const handleDistrictChange = (d: string) => {
    setSelectedDistrict(d);
    setSelectedCollege(d === "Other" ? "OTHER" : "");
    setCustomCollege("");
    if (d !== "Other") {
      setCustomDistrict("");
    }
  };

  // Always start with clean, empty fields whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setPhone("");
      setSelectedDistrict("");
      setCustomDistrict("");
      setSelectedCollege("");
      setCustomCollege("");
      setCollegeName("");
      setPortfolioUrl("");
      setMessage("");
      setResumeFile(null);
      setResumeData("");
      setResumeName("");
      setErrorMsg("");
      setIsSuccess(false);
      try {
        localStorage.removeItem(CANDIDATE_STORAGE_KEY);
      } catch {}
    }
  }, [isOpen]);

  useEffect(() => {
    if (isSuccess && modalCardRef.current) {
      modalCardRef.current.scrollTop = 0;
    }
  }, [isSuccess]);

  useEffect(() => {
    if (initialTrack) {
      setTrack(initialTrack);
    }
  }, [initialTrack]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
      setErrorMsg("Please enter your full name (mandatory).");
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg("Please enter your mobile number (mandatory).");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setErrorMsg("Please enter a valid email address (mandatory).");
      return;
    }
    if (!selectedDistrict.trim()) {
      setErrorMsg("Please select your district (mandatory).");
      return;
    }
    if (selectedDistrict === "Other" && !customDistrict.trim()) {
      setErrorMsg("Please specify your district or state name (mandatory).");
      return;
    }
    const finalDistrict = selectedDistrict === "Other" ? customDistrict.trim() : selectedDistrict;

    if (!selectedCollege.trim()) {
      setErrorMsg("Please select your college from the dropdown or choose 'Other' (mandatory).");
      return;
    }
    if ((selectedCollege === "OTHER" || selectedDistrict === "Other") && !customCollege.trim()) {
      setErrorMsg("Please enter your college name (mandatory).");
      return;
    }
    const finalCollege = (selectedCollege === "OTHER" || selectedDistrict === "Other") ? customCollege.trim() : selectedCollege;
    setCollegeName(finalCollege);

    if (!degree.trim()) {
      setErrorMsg("Please select your degree (mandatory).");
      return;
    }
    if (!yearOfStudy.trim()) {
      setErrorMsg("Please select your year of study (mandatory).");
      return;
    }
    if (
      (yearOfStudy === "Graduated" || yearOfStudy === "Post-Graduated") &&
      !completionYear.trim()
    ) {
      setErrorMsg("Please enter your completion / graduation year (mandatory).");
      return;
    }

    setIsSubmitting(true);

    const formattedYear =
      (yearOfStudy === "Graduated" || yearOfStudy === "Post-Graduated") && completionYear.trim()
        ? `${yearOfStudy} (${completionYear.trim()})`
        : yearOfStudy;

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: `${track} Internship`,
        kind: "internship",
        college: finalCollege,
        district: finalDistrict,
        degree,
        branch,
        graduation_year: formattedYear,
        portfolio_url: portfolioUrl.trim() || undefined,
        message: message.trim() || `Internship application for ${track} track from ${finalCollege} (${finalDistrict}).`,
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
        throw new Error(data.error || "Failed to submit internship application. Please try again.");
      }

      try {
        localStorage.setItem(
          CANDIDATE_STORAGE_KEY,
          JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            collegeName: collegeName.trim(),
            degree,
            branch,
            yearOfStudy,
            completionYear,
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

  const handleSwitchTrack = (newTrack: string) => {
    setTrack(newTrack);
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
                  Thank you, <strong style={{ color: "var(--ink)" }}>{name}</strong>! Your application for the{" "}
                  <strong style={{ color: "var(--sun)" }}>{track}</strong> track has been received.
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
                    <span className="summary-item-label">Track</span>
                    <span className="summary-item-value highlight">{track}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-item-label">College & District</span>
                    <span className="summary-item-value">
                      {collegeName} {selectedDistrict ? `(${selectedDistrict === "Other" ? customDistrict : selectedDistrict})` : ""}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-item-label">Education</span>
                    <span className="summary-item-value">
                      {degree} &bull; {yearOfStudy}
                      {completionYear && (yearOfStudy === "Graduated" || yearOfStudy === "Post-Graduated")
                        ? ` (${completionYear})`
                        : ""}
                    </span>
                  </div>
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
                    Apply for another track with saved details:
                  </span>
                </div>
                <div className="multi-apply-chips">
                  {ALL_TRACKS.filter((t) => t !== track).map((otherTrack) => (
                    <button
                      key={otherTrack}
                      type="button"
                      className="multi-apply-chip"
                      onClick={() => handleSwitchTrack(otherTrack)}
                      title={`Apply for ${otherTrack} track now`}
                    >
                      + {otherTrack}
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
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
                      Internship Application
                    </h3>
                    <small style={{ color: "var(--mut)", fontSize: "0.82rem" }}>
                      Hands-on live product development at KairoEdge Pune (HQ)
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
                  <span>Candidate Name <b style={{ color: "var(--sun)" }}>*</b></span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Kulkarni"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>

                <label>
                  <span>Mobile Number <b style={{ color: "var(--sun)" }}>*</b></span>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98220 12345"
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
                    placeholder="priya@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                <div>
                  <span style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#1E293B", marginBottom: "5px" }}>
                    Internship Track
                  </span>
                  <div className="track-display-box">
                    <span className="track-display-dot" />
                    <span className="track-display-title">{track}</span>
                  </div>
                </div>
              </div>

              {/* District & College Selection */}
              <div className="form-grid-2">
                <div>
                  <span style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#1E293B", marginBottom: "5px" }}>
                    District <b style={{ color: "var(--sun)" }}>*</b>
                  </span>
                  <SearchableSelect
                    options={districtOptions}
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    placeholder="Select Maharashtra District..."
                    searchPlaceholder="Search district (e.g. Pune, Ahilyanagar)..."
                  />
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#1E293B", marginBottom: "5px" }}>
                    College / Institute <b style={{ color: "var(--sun)" }}>*</b>
                  </span>
                  <SearchableSelect
                    options={collegeOptions}
                    value={selectedCollege}
                    onChange={(val) => {
                      setSelectedCollege(val);
                      if (val !== "OTHER") setCustomCollege("");
                    }}
                    disabled={!selectedDistrict}
                    placeholder={
                      !selectedDistrict
                        ? "Select district first..."
                        : `Select college in ${selectedDistrict}...`
                    }
                    searchPlaceholder={`Search college in ${selectedDistrict || "district"}...`}
                  />
                </div>
              </div>

              {/* If "Other" district chosen -> show specify district input */}
              {selectedDistrict === "Other" && (
                <label style={{ marginTop: "2px" }}>
                  <span>Specify District / State <b style={{ color: "var(--sun)" }}>*</b></span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kolhapur, Solapur, or other state..."
                    value={customDistrict}
                    onChange={(e) => setCustomDistrict(e.target.value)}
                  />
                </label>
              )}

              {/* If "Other" college selected OR "Other" district -> show custom college input */}
              {(selectedCollege === "OTHER" || selectedDistrict === "Other") && (
                <label style={{ marginTop: "2px" }}>
                  <span>Enter College / Institute Full Name <b style={{ color: "var(--sun)" }}>*</b></span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Government College of Engineering, Karad"
                    value={customCollege}
                    onChange={(e) => setCustomCollege(e.target.value)}
                  />
                </label>
              )}

              <div className="form-grid-2">
                <div>
                  <span style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#1E293B", marginBottom: "5px" }}>
                    Degree <b style={{ color: "var(--sun)" }}>*</b>
                  </span>
                  <SearchableSelect
                    options={DEGREES}
                    value={degree}
                    onChange={(val) => setDegree(val)}
                    searchPlaceholder="Search degree (e.g. B.Sc Cloud, B.Tech CSE, MCA)..."
                  />
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#1E293B", marginBottom: "5px" }}>
                    Branch / Stream <b style={{ color: "var(--sun)" }}>*</b>
                  </span>
                  <SearchableSelect
                    options={BRANCHES}
                    value={branch}
                    onChange={(val) => setBranch(val)}
                    searchPlaceholder="Search branch / stream..."
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <span style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#1E293B", marginBottom: "5px" }}>
                    Year of Study <b style={{ color: "var(--sun)" }}>*</b>
                  </span>
                  <SearchableSelect
                    options={STUDY_YEARS}
                    value={yearOfStudy}
                    onChange={(val) => setYearOfStudy(val)}
                    searchPlaceholder="Search year..."
                  />
                </div>

                {(yearOfStudy === "Graduated" || yearOfStudy === "Post-Graduated") ? (
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
                ) : (
                  <label>
                    <span>GitHub Profile / Portfolio (Optional)</span>
                    <input
                      type="url"
                      placeholder="https://github.com/your-username"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                    />
                  </label>
                )}
              </div>

              {(yearOfStudy === "Graduated" || yearOfStudy === "Post-Graduated") && (
                <label style={{ animation: "fade .25s ease forwards" }}>
                  <span>GitHub Profile / Portfolio / Project Link (Optional)</span>
                  <input
                    type="url"
                    placeholder="https://github.com/your-username"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                  />
                </label>
              )}

              {/* Resume File Upload */}
              <div className="file-upload-section">
                <span style={{ display: "flex", justifyContent: "space-between", fontSize: "0.83rem", fontWeight: 600, color: "#1E293B", marginBottom: "5px" }}>
                  <span>Resume / CV / Marksheet <small style={{ fontWeight: 400, color: "#64748B" }}>(Optional)</small></span>
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
                      Click to choose resume / marksheet file
                    </span>
                    <small style={{ color: "#64748B", fontSize: "0.76rem" }}>
                      Supports PDF, DOC, DOCX up to 4 MB
                    </small>
                  </label>
                )}
              </div>

              <label>
                <span>Why do you want to join this internship? (Optional)</span>
                <textarea
                  rows={3}
                  placeholder="Tell us about technologies you've learned, projects built, or goals for this internship..."
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
                Open to students and recent graduates across Pune universities and colleges.
              </p>
            </form>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
