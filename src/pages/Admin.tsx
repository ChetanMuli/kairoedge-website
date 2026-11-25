import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Mail,
  Building2,
  FileText,
  Layers,
  Cpu,
  FolderGit2,
  Users,
  MessageSquareQuote,
  TrendingUp,
  Sliders,
  Settings,
  Trash2,
  Search,
  Filter,
  Download,
  Plus,
  Edit3,
  Trash,
  ExternalLink,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Shield,
  Upload,
  CheckCircle2,
  AlertCircle,
  Menu,
  FileCheck,
  Globe,
  Inbox,
  Printer,
  Copy,
  Check,
  Calendar,
  DollarSign,
  Star,
  MessageCircle,
  Flame,
  ShieldCheck,
  Lock
} from "lucide-react";
import { pageCopy, mergeCopy } from "../../shared/pageCopy.js";
import { useSite } from "../context/SiteData";
import { MAHARASHTRA_DISTRICTS } from "../data/districts";
import "../admin.css";

// Storage keys
const TOKEN_KEY = "kairo-admin-token";
const USER_KEY = "kairo-admin-user";
const ROLE_KEY = "kairo-admin-role";
const PERMS_KEY = "kairo-admin-perms";

// API Base URL (defaults to relative /api, or custom VITE_API_URL if configured)
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

/** Safely parse response JSON, throwing clear diagnostics if server returns HTML error pages */
async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    if (text.trim().startsWith("<")) {
      throw new Error(
        "Server API is unreachable or returned HTML. Please ensure backend Node.js (port 4001) is running on your server and Nginx/Apache reverse proxies /api requests to http://127.0.0.1:4001."
      );
    }
    throw new Error(text || `Request failed with HTTP status ${res.status}`);
  }
}

// Export helpers
function exportToCsv(filename: string, columns: { header: string; accessor: (row: any) => any }[], rows: any[]) {
  const escapeCsv = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };
  const headerRow = columns.map((col) => escapeCsv(col.header)).join(",");
  const dataRows = rows.map((row) => columns.map((col) => escapeCsv(col.accessor(row))).join(","));
  const csvContent = "\uFEFF" + [headerRow, ...dataRows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function openWhatsApp(phone: string, text: string) {
  if (!phone) return;
  const cleaned = phone.replace(/[^\d]/g, "");
  const num = cleaned.length === 10 ? `91${cleaned}` : cleaned;
  window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, "_blank");
}

function printCandidateDossier(c: any) {
  const win = window.open("", "_blank");
  if (!win) {
    alert("Please allow popups to print the candidate dossier.");
    return;
  }
  const isIntern = c.kind === "internship";
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${c.name} - Candidate Dossier - KairoEdge</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 30px; line-height: 1.6; }
    .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    h1 { margin: 0 0 6px 0; color: #071522; font-size: 24px; }
    .badge { display: inline-block; padding: 4px 10px; background: #e0f2fe; color: #0284c7; border-radius: 999px; font-size: 12px; font-weight: bold; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .item { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 8px; }
    .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px; }
    .value { font-size: 14px; font-weight: 500; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-bottom: 20px; }
    .notes { border-left: 4px solid #0284c7; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>${c.name}</h1>
      <span class="badge">${isIntern ? "Internship Candidate" : "Full-Time Candidate"} · ${c.role_title}</span>
    </div>
    <div style="text-align: right; font-size: 12px; color: #64748b;">
      <div>Status: <b>${(c.status || "NEW").toUpperCase()}</b></div>
      <div>Applied: ${c.created_at ? new Date(c.created_at).toLocaleDateString() : "Recent"}</div>
      ${c.interview_date ? `<div>Scheduled Interview: <b>${c.interview_date}</b> (${c.interview_mode || "Online"})</div>` : ""}
      ${c.rating ? `<div>Recruiter Rating: <b>${"★".repeat(c.rating)}${"☆".repeat(5 - c.rating)}</b></div>` : ""}
    </div>
  </div>

  <div class="grid">
    <div class="item"><div class="label">Email</div><div class="value">${c.email}</div></div>
    <div class="item"><div class="label">Mobile Phone</div><div class="value">${c.phone || "—"}</div></div>
    ${
      isIntern
        ? `
    <div class="item"><div class="label">College / University</div><div class="value">${c.college || "—"}</div></div>
    <div class="item"><div class="label">Degree & Branch</div><div class="value">${c.degree || "—"} (${c.branch || "—"})</div></div>
    <div class="item"><div class="label">Year of Study</div><div class="value">${c.graduation_year || "—"}</div></div>
    `
        : `
    <div class="item"><div class="label">Experience</div><div class="value">${c.experience || "—"}</div></div>
    <div class="item"><div class="label">Current Company & Role</div><div class="value">${c.current_company || "—"} (${c.current_designation || "—"})</div></div>
    <div class="item"><div class="label">Notice Period & Expected CTC</div><div class="value">${c.notice_period || "—"} · ${c.expected_ctc || "—"}</div></div>
    `
    }
    <div class="item"><div class="label">Portfolio / GitHub</div><div class="value">${c.portfolio_url || "—"}</div></div>
    ${c.salary_offered ? `<div class="item"><div class="label">Salary / Stipend Offered</div><div class="value">${c.salary_offered}</div></div>` : ""}
  </div>

  <div class="box">
    <div class="label">Candidate Message / Motivation Pitch</div>
    <div style="font-size: 14px; white-space: pre-wrap; margin-top: 6px;">${c.message || "No cover message provided."}</div>
  </div>

  ${
    c.notes
      ? `
  <div class="box notes">
    <div class="label">Recruiter Remarks & Interview Evaluation Notes</div>
    <div style="font-size: 14px; white-space: pre-wrap; margin-top: 6px;">${c.notes}</div>
  </div>
  `
      : ""
  }

  <div class="no-print" style="margin-top: 30px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #0284c7; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Print Candidate Dossier</button>
  </div>
</body>
</html>`;
  win.document.write(html);
  win.document.close();
}

// Table schema specifications
const tableSchemas: Record<
  string,
  {
    label: string;
    icon: any;
    fields: {
      name: string;
      label: string;
      type: "text" | "number" | "textarea" | "tags" | "image" | "select";
      options?: string[];
      hint?: string;
    }[];
  }
> = {
  jobs: {
    label: "Open Roles",
    icon: Briefcase,
    fields: [
      { name: "title", label: "Job Title", type: "text" },
      { name: "slug", label: "URL Slug", type: "text" },
      { name: "location", label: "Location", type: "text", hint: "e.g., Pune (Hybrid) or Pune Office" },
      { name: "type", label: "Employment Type", type: "text", hint: "e.g., Full-time, Permanent, Internship" },
      { name: "summary", label: "Short Summary", type: "textarea" },
      { name: "description", label: "Full Scope & Requirements (JD)", type: "textarea" }
    ]
  },
  services: {
    label: "Services",
    icon: Layers,
    fields: [
      { name: "number", label: "Practice Number", type: "text", hint: "e.g., 01, 02" },
      { name: "title", label: "Service Title", type: "text" },
      { name: "slug", label: "URL Slug", type: "text" },
      { name: "summary", label: "Short Summary", type: "textarea" },
      { name: "description", label: "Full Practice Description", type: "textarea" },
      { name: "image", label: "Banner Image URL", type: "image" },
      { name: "outcomes", label: "Deliverables / Outcomes", type: "tags" },
      { name: "tags", label: "Technology Tags", type: "tags" },
      { name: "footer", label: "Delivery Note / Footer", type: "text" }
    ]
  },
  projects: {
    label: "Case Studies",
    icon: FolderGit2,
    fields: [
      { name: "title", label: "Project Title", type: "text" },
      { name: "slug", label: "URL Slug", type: "text" },
      { name: "category", label: "Category", type: "text" },
      { name: "industry", label: "Industry", type: "text" },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "challenge", label: "Challenge & Constraints", type: "textarea" },
      { name: "solution", label: "Engineered Solution", type: "textarea" },
      { name: "result", label: "Measurable Impact / Result", type: "textarea" },
      { name: "image", label: "Project Mockup Image", type: "image" },
      { name: "services", label: "Included Services", type: "tags" }
    ]
  },
  industries: {
    label: "Industries",
    icon: Building2,
    fields: [
      { name: "name", label: "Industry Name", type: "text" },
      { name: "slug", label: "URL Slug", type: "text" },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "description", label: "Full Scope", type: "textarea" },
      { name: "image", label: "Image URL", type: "image" },
      { name: "focus", label: "Key Focus Areas", type: "tags" }
    ]
  },
  technologies: {
    label: "Tech Stack",
    icon: Cpu,
    fields: [
      { name: "name", label: "Technology Name", type: "text" },
      { name: "category", label: "Category", type: "text", hint: "e.g., Languages, Cloud, Frameworks, AI, Databases" },
      { name: "sort_order", label: "Display Priority", type: "number" }
    ]
  },
  process_steps: {
    label: "Process Steps",
    icon: Sliders,
    fields: [
      { name: "number", label: "Step Number", type: "text", hint: "e.g., 01, 02" },
      { name: "title", label: "Step Title", type: "text" },
      { name: "summary", label: "Short Summary", type: "textarea" },
      { name: "details", label: "Detailed Scope", type: "textarea" },
      { name: "sort_order", label: "Sort Order", type: "number" }
    ]
  },
  architecture: {
    label: "Architecture",
    icon: Layers,
    fields: [
      { name: "number", label: "Number", type: "text" },
      { name: "title", label: "Principle Title", type: "text" },
      { name: "text", label: "Description", type: "textarea" },
      { name: "sort_order", label: "Sort Order", type: "number" }
    ]
  },
  principles: {
    label: "Core Principles",
    icon: Shield,
    fields: [
      { name: "title", label: "Principle Title", type: "text" },
      { name: "text", label: "Description", type: "textarea" },
      { name: "sort_order", label: "Sort Order", type: "number" }
    ]
  },
  testimonials: {
    label: "Client Reviews",
    icon: MessageSquareQuote,
    fields: [
      { name: "quote", label: "Client Testimonial", type: "textarea" },
      { name: "attribution", label: "Author / Company & Role", type: "text" },
      { name: "sort_order", label: "Display Order", type: "number" }
    ]
  },
  stats: {
    label: "Key Metrics",
    icon: TrendingUp,
    fields: [
      { name: "value", label: "Metric Value", type: "text", hint: "e.g., 99.9%, 50+, 24/7" },
      { name: "label", label: "Metric Label", type: "text", hint: "e.g., Uptime SLA, Projects Shipped" },
      { name: "sort_order", label: "Display Order", type: "number" }
    ]
  },
  colleges: {
    label: "Campus Colleges",
    icon: GraduationCap,
    fields: [
      {
        name: "name",
        label: "College / Institute Full Name",
        type: "text",
        hint: "Official full name of the engineering college or university campus"
      },
      {
        name: "district",
        label: "District",
        type: "select",
        options: MAHARASHTRA_DISTRICTS,
        hint: "Maharashtra district location (used for student filtering)"
      },
      {
        name: "city",
        label: "City / Campus Area",
        type: "text",
        hint: "Campus locality e.g., Sangamner, Pune, Shivajinagar"
      },
      {
        name: "code",
        label: "College Short Code (Optional)",
        type: "text",
        hint: "Short code or acronym e.g., AVCOE, PICT, COEP (Optional)"
      },
      {
        name: "state",
        label: "State",
        type: "text",
        hint: "Default: Maharashtra"
      }
    ]
  }
};

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalItems === 0) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const handlePageSelect = (p: number) => {
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector(".admin-main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="admin-pagination">
      <div className="admin-pagination-info">
        Showing <strong>{startItem}</strong> - <strong>{endItem}</strong> of <strong>{totalItems}</strong> records (Page {currentPage} of {totalPages})
      </div>
      <div className="admin-pagination-pages">
        <button
          type="button"
          className="admin-page-btn"
          disabled={currentPage <= 1}
          onClick={() => handlePageSelect(currentPage - 1)}
          title="Previous page"
        >
          <ChevronLeft size={14} /> <span>Prev</span>
        </button>

        {pages.map((p, idx) =>
          typeof p === "number" ? (
            <button
              key={idx}
              type="button"
              className={`admin-page-btn ${p === currentPage ? "active" : ""}`}
              onClick={() => handlePageSelect(p)}
            >
              {p}
            </button>
          ) : (
            <span key={idx} style={{ padding: "0 4px", color: "var(--adm-text-faint)", fontSize: "0.82rem" }}>
              ...
            </span>
          )
        )}

        <button
          type="button"
          className="admin-page-btn"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageSelect(currentPage + 1)}
          title="Next page"
        >
          <span>Next</span> <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default function Admin() {
  const { refreshSite } = useSite();

  // Auth State
  const [token, setToken] = useState<string>(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState<string>(() => localStorage.getItem(USER_KEY) || "");
  const [role, setRole] = useState<string>(() => localStorage.getItem(ROLE_KEY) || "");
  const [permissions, setPermissions] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(PERMS_KEY) || "[]");
    } catch {
      return [];
    }
  });

  // Login Form
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Layout & Navigation - Persistent across browser refresh
  const [activeSection, setActiveSection] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "").trim();
      if (hash) return hash;
      const saved = localStorage.getItem("kairoedge_admin_active_tab");
      if (saved) return saved;
    }
    return "dashboard";
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync active section to URL hash and localStorage on change
  useEffect(() => {
    if (activeSection) {
      try {
        localStorage.setItem("kairoedge_admin_active_tab", activeSection);
        if (window.location.hash !== `#${activeSection}`) {
          window.history.replaceState(null, "", `#${activeSection}`);
        }
      } catch {}
    }
  }, [activeSection]);

  // Live Data State
  const [dashboard, setDashboard] = useState<any>(null);
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [studyYearFilter, setStudyYearFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [leadServiceFilter, setLeadServiceFilter] = useState("all");
  const [jobExperienceFilter, setJobExperienceFilter] = useState("all");
  const [subadminRoleFilter, setSubadminRoleFilter] = useState("all");
  const [collegeCityFilter, setCollegeCityFilter] = useState("all");
  const [collegeStatusFilter, setCollegeStatusFilter] = useState("all");
  const [internCollegeFilter, setInternCollegeFilter] = useState("all");
  const [internDistrictFilter, setInternDistrictFilter] = useState("all");
  const [genericSearchQuery, setGenericSearchQuery] = useState("");
  const [subadminSearchQuery, setSubadminSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Sub-Admin Edit Modal
  const [editingSubAdmin, setEditingSubAdmin] = useState<any | null>(null);
  const [editSubAdminPassword, setEditSubAdminPassword] = useState("");
  const [subAdminSaving, setSubAdminSaving] = useState(false);

  // Reset section filters and scroll upon switching views
  useEffect(() => {
    setSearchQuery("");
    setGenericSearchQuery("");
    setSubadminSearchQuery("");
    setStatusFilter("all");
    setRoleFilter("all");
    setStudyYearFilter("all");
    setPriorityFilter("all");
    setLeadServiceFilter("all");
    setJobExperienceFilter("all");
    setSubadminRoleFilter("all");
    setCollegeCityFilter("all");
    setCollegeStatusFilter("all");
    setInternCollegeFilter("all");
    setInternDistrictFilter("all");
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "instant" });
    document.querySelector(".admin-main")?.scrollTo({ top: 0, behavior: "instant" });
    document.querySelector(".admin-view-body")?.scrollTo({ top: 0, behavior: "instant" });
  }, [activeSection]);

  // Reset page to 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    genericSearchQuery,
    subadminSearchQuery,
    statusFilter,
    roleFilter,
    studyYearFilter,
    priorityFilter,
    leadServiceFilter,
    jobExperienceFilter,
    subadminRoleFilter,
    collegeCityFilter,
    collegeStatusFilter,
    internCollegeFilter,
    internDistrictFilter
  ]);

  // Candidate Dossier Modal
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

  // Candidate Create / Edit Modal
  const [editingCandidate, setEditingCandidate] = useState<any | null>(null);
  const [isSavingCandidate, setIsSavingCandidate] = useState(false);

  // Lead Create / Edit Modal
  const [editingLead, setEditingLead] = useState<any | null>(null);
  const [isSavingLead, setIsSavingLead] = useState(false);

  // Universal Content Modal (CRUD)
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemFormData, setItemFormData] = useState<any>({});
  const [isSavingItem, setIsSavingItem] = useState(false);

  // Page Copy & Content Editor Tab State
  const [activeCopyTab, setActiveCopyTab] = useState<"home" | "about" | "services" | "careers" | "internship" | "contact" | "footer">("home");
  const [copyData, setCopyData] = useState<any>(pageCopy);
  const [isSavingCopy, setIsSavingCopy] = useState(false);

  // Contact Info & Company Settings Form
  const [contactForm, setContactForm] = useState({
    email: "contact@kairoedge.com",
    careersEmail: "careers@kairoedge.com",
    phone: "+91 20 1234 5678",
    altPhone: "+91 98450 11021",
    place: "Pune, Maharashtra, India",
    hours: "Monday to Saturday, 10:00 to 19:00 IST",
    company: "KairoEdge Technologies Pvt. Ltd.",
    tagline: "Software, cloud and AI for growing businesses, built in Pune.",
    note: "Custom software for web, mobile, cloud, data, and security. Delivered from Pune."
  });
  const [isSavingContact, setIsSavingContact] = useState(false);

  // Sub-Admin Management Modal
  const [showSubAdminModal, setShowSubAdminModal] = useState(false);
  const [subAdminForm, setSubAdminForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "Talent HR / Recruiter",
    permissions: ["job_apps", "intern_apps", "inquiries"]
  });
  const [isCreatingSubAdmin, setIsCreatingSubAdmin] = useState(false);

  // Lock body scroll when any modal is open
  const isAnyModalOpen = Boolean(
    editingLead ||
    editingCandidate ||
    selectedCandidate ||
    editingTable ||
    showSubAdminModal ||
    editingSubAdmin
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow || "";
      };
    }
  }, [isAnyModalOpen]);

  // Toast helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Auth Handlers
  const handleLogin = async (e?: React.FormEvent, overrideUser?: string, overridePass?: string) => {
    if (e) e.preventDefault();
    const u = overrideUser || loginUser;
    const p = overridePass || loginPass;
    if (!u || !p) {
      setLoginError("Please enter both username and password.");
      return;
    }
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p })
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data.error || "Login failed.");

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, data.user);
      localStorage.setItem(ROLE_KEY, data.role || "admin");
      localStorage.setItem(PERMS_KEY, JSON.stringify(data.permissions || []));

      setToken(data.token);
      setUser(data.user);
      setRole(data.role || "admin");
      setPermissions(data.permissions || []);
      showToast(`Welcome back, ${data.user}!`);
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(PERMS_KEY);
    setToken("");
    setUser("");
    setRole("");
    setPermissions([]);
    showToast("Signed out successfully.");
  };

  // Fetch Admin Data
  const fetchData = useCallback(async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [dashRes, contentRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/dashboard`, { headers }),
        fetch(`${API_BASE}/api/admin/content`, { headers })
      ]);

      if (dashRes.status === 401 || contentRes.status === 401) {
        handleLogout();
        return;
      }

      if (dashRes.ok) {
        const d = await safeJson(dashRes);
        setDashboard(d);
      }
      if (contentRes.ok) {
        const c = await safeJson(contentRes);
        setContent(c);
        if (c.copy) {
          setCopyData(mergeCopy(pageCopy, c.copy));
          const cp = c.copy;
          setContactForm({
            email: cp.contact?.email || cp.footer?.email || "contact@kairoedge.com",
            careersEmail: cp.careers?.email || "careers@kairoedge.com",
            phone: cp.contact?.phone || "+91 20 1234 5678",
            altPhone: cp.contact?.altPhone || "+91 98450 11021",
            place: cp.contact?.place || cp.footer?.place || "Pune, Maharashtra, India",
            hours: cp.contact?.hours || cp.footer?.hours || "Monday to Saturday, 10:00 to 19:00 IST",
            company: cp.contact?.company || cp.footer?.company || "KairoEdge Technologies Pvt. Ltd.",
            tagline: cp.footer?.tagline || cp.footer?.blurb || "Software, cloud and AI for growing businesses, built in Pune.",
            note: cp.contact?.note || "Custom software for web, mobile, cloud, data, and security. Delivered from Pune."
          });
        }
      }
    } catch (err: any) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  // Save Page Copy & Content Editor
  const handleSavePageCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCopy(true);
    try {
      const res = await fetch("/api/admin/copy", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(copyData)
      });
      if (!res.ok) throw new Error("Failed to save page copy.");

      setContent((prev: any) => ({ ...prev, copy: copyData }));
      await refreshSite();
      showToast("Page copy updated and live synchronized across the website!");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsSavingCopy(false);
    }
  };

  // Save Lead (Create or Update)
  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    setIsSavingLead(true);
    try {
      const isEdit = Boolean(editingLead.id);
      const url = isEdit ? `/api/admin/inquiries/${editingLead.id}` : "/api/admin/inquiries";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingLead)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save lead.");

      showToast(isEdit ? "Lead details updated successfully!" : "New lead recorded successfully!");
      setEditingLead(null);
      await fetchData();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsSavingLead(false);
    }
  };

  // Save Candidate (Create or Update)
  const handleSaveCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate) return;
    setIsSavingCandidate(true);
    try {
      const isEdit = Boolean(editingCandidate.id);
      const url = isEdit ? `/api/admin/applications/${editingCandidate.id}` : "/api/admin/applications";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingCandidate)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save candidate.");

      showToast(isEdit ? "Candidate record updated!" : "New candidate profile added!");
      setEditingCandidate(null);
      await fetchData();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsSavingCandidate(false);
    }
  };

  // Quick Update Application Status & Notes
  const handleUpdateApplicationStatus = async (id: number, status: string, notes?: string) => {
    try {
      const body: any = { status };
      if (notes !== undefined) body.notes = notes;
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error("Failed to update status");

      setContent((prev: any) => ({
        ...prev,
        applications: (prev.applications || []).map((app: any) =>
          app.id === id ? { ...app, status, ...(notes !== undefined ? { notes } : {}) } : app
        )
      }));
      if (selectedCandidate && selectedCandidate.id === id) {
        setSelectedCandidate((prev: any) => ({ ...prev, status, ...(notes !== undefined ? { notes } : {}) }));
      }
      showToast(`Status updated to ${status.toUpperCase()}`);
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Delete Application (Send to Recycle Bin)
  const handleDeleteApplication = async (id: number) => {
    if (!window.confirm("Move this candidate application to the Recycle Bin?")) return;
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete application");
      setContent((prev: any) => ({
        ...prev,
        applications: (prev.applications || []).filter((a: any) => a.id !== id)
      }));
      if (selectedCandidate?.id === id) setSelectedCandidate(null);
      showToast("Application moved to Recycle Bin.");
      fetchData();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Quick Update Inquiry Status & Notes
  const handleUpdateInquiryStatus = async (id: number, status: string, notes?: string) => {
    try {
      const body: any = { status };
      if (notes !== undefined) body.notes = notes;
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error("Failed to update inquiry");
      setContent((prev: any) => ({
        ...prev,
        inquiries: (prev.inquiries || []).map((inq: any) =>
          inq.id === id ? { ...inq, status, ...(notes !== undefined ? { notes } : {}) } : inq
        )
      }));
      showToast(`Inquiry status updated to ${status.toUpperCase()}`);
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id: number) => {
    if (!window.confirm("Move this inquiry to the Recycle Bin?")) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete inquiry");
      setContent((prev: any) => ({
        ...prev,
        inquiries: (prev.inquiries || []).filter((i: any) => i.id !== id)
      }));
      showToast("Inquiry moved to Recycle Bin.");
      fetchData();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Toggle College Active
  const handleToggleCollege = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/colleges/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to toggle college status");
      const data = await res.json();
      setContent((prev: any) => ({
        ...prev,
        colleges: (prev.colleges || []).map((col: any) =>
          col.id === id ? { ...col, is_active: data.is_active } : col
        )
      }));
      refreshSite();
      showToast(`College ${data.is_active ? "Activated" : "Deactivated"} successfully.`);
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Auto-Seed Maharashtra Colleges
  const [seedingColleges, setSeedingColleges] = useState(false);
  const handleSeedColleges = async () => {
    try {
      setSeedingColleges(true);
      const res = await fetch("/api/admin/colleges/seed", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to seed campus colleges.");
      }
      const data = await res.json();
      setContent((prev: any) => ({ ...prev, colleges: data.colleges || [] }));
      await refreshSite();
      showToast(`Successfully seeded ${data.count || 50}+ Maharashtra colleges across 9 districts!`);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setSeedingColleges(false);
    }
  };

  // Toggle Sub-Admin Active
  const handleToggleSubAdmin = async (id: number, username: string) => {
    try {
      const res = await fetch(`/api/admin/subadmins/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to toggle sub-admin");
      setContent((prev: any) => ({
        ...prev,
        subadmins: (prev.subadmins || []).map((sub: any) =>
          sub.id === id ? { ...sub, is_active: d.is_active } : sub
        )
      }));
      showToast(`Status updated for "${username}".`);
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Delete Sub-Admin
  const handleDeleteSubAdmin = async (id: number, username: string) => {
    if (!window.confirm(`Are you sure you want to delete sub-admin account "${username}"?`)) return;
    try {
      const res = await fetch(`/api/admin/subadmins/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to delete sub-admin");
      setContent((prev: any) => ({
        ...prev,
        subadmins: (prev.subadmins || []).filter((sub: any) => sub.id !== id)
      }));
      showToast(`Sub-admin "${username}" deleted.`);
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Update Sub-Admin
  const handleUpdateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubAdmin) return;
    setSubAdminSaving(true);
    try {
      const payload: any = {
        username: editingSubAdmin.username,
        email: editingSubAdmin.email,
        role: editingSubAdmin.role,
        permissions: editingSubAdmin.permissions || []
      };
      if (editSubAdminPassword.trim()) {
        payload.password = editSubAdminPassword.trim();
      }
      const res = await fetch(`/api/admin/subadmins/${editingSubAdmin.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to update sub-admin");
      showToast(`Sub-admin "${d.username}" updated successfully!`);
      setEditingSubAdmin(null);
      setEditSubAdminPassword("");
      fetchData();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setSubAdminSaving(false);
    }
  };

  // Save Contact & Company Settings (Direct Website Sync!)
  const handleSaveContactSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContact(true);
    try {
      const currentCopy = content.copy || pageCopy;
      const updatedCopy = {
        ...currentCopy,
        contact: {
          ...currentCopy.contact,
          email: contactForm.email,
          phone: contactForm.phone,
          altPhone: contactForm.altPhone,
          place: contactForm.place,
          hours: contactForm.hours,
          company: contactForm.company,
          note: contactForm.note
        },
        home: {
          ...currentCopy.home,
          asideEmail: contactForm.email,
          asidePlace: contactForm.place,
          asideCompany: contactForm.company,
          asideNote: contactForm.note
        },
        footer: {
          ...currentCopy.footer,
          email: contactForm.email,
          phone: contactForm.phone,
          place: contactForm.place,
          company: contactForm.company,
          tagline: contactForm.tagline,
          hours: contactForm.hours
        },
        careers: {
          ...currentCopy.careers,
          email: contactForm.careersEmail
        }
      };

      const res = await fetch("/api/admin/copy", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedCopy)
      });
      if (!res.ok) {
        if (res.status === 401) {
          setToken("");
          localStorage.removeItem(TOKEN_KEY);
          throw new Error("Your admin session expired. Please sign in again.");
        }
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Failed to save contact settings (Status ${res.status}).`);
      }

      setContent((prev: any) => ({ ...prev, copy: updatedCopy }));
      await refreshSite();
      showToast("Contact details saved and synced live to website!");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsSavingContact(false);
    }
  };

  // Universal CRUD: Open Edit / Create Modal
  const handleOpenItemModal = (table: string, item?: any) => {
    setEditingTable(table);
    setEditingItem(item || null);
    if (item) {
      setItemFormData({ ...item });
    } else {
      const initial: any = {};
      const fields = tableSchemas[table]?.fields || [];
      fields.forEach((f) => {
        initial[f.name] =
          f.type === "tags"
            ? []
            : f.type === "number"
            ? 0
            : f.type === "select"
            ? (f.options?.[0] || "")
            : "";
      });
      setItemFormData(initial);
    }
  };

  // Universal CRUD: Save Item
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable) return;
    setIsSavingItem(true);
    try {
      const isEdit = Boolean(editingItem?.id);
      const url = isEdit
        ? `/api/admin/items/${editingTable}/${editingItem.id}`
        : `/api/admin/items/${editingTable}`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(itemFormData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save item.");

      showToast(`${tableSchemas[editingTable]?.label || "Item"} saved successfully!`);
      setEditingTable(null);
      setEditingItem(null);
      await fetchData();
      await refreshSite();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsSavingItem(false);
    }
  };

  // Universal CRUD: Delete Item
  const handleDeleteItem = async (table: string, id: number, title?: string) => {
    if (!window.confirm(`Move "${title || "this item"}" to the Recycle Bin?`)) return;
    try {
      const res = await fetch(`/api/admin/items/${table}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete item.");
      showToast("Item moved to Recycle Bin.");
      await fetchData();
      await refreshSite();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Recycle Bin: Restore
  const handleRestoreRecycle = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/recycle-bin/restore/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to restore item.");
      showToast("Item restored to live database!");
      await fetchData();
      await refreshSite();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Recycle Bin: Purge
  const handlePurgeRecycle = async (id: number) => {
    if (!window.confirm("Permanently delete this item? This action CANNOT be undone.")) return;
    try {
      const res = await fetch(`/api/admin/recycle-bin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to purge item.");
      showToast("Item permanently deleted.");
      fetchData();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Image Upload helper for Modals
  const handleUploadImage = async (file: File, fieldName: string) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ filename: file.name, data: base64 })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setItemFormData((prev: any) => ({ ...prev, [fieldName]: data.url }));
        showToast("Image uploaded successfully!");
      } catch (err: any) {
        showToast(err.message, "error");
      }
    };
    reader.readAsDataURL(file);
  };

  // Filtered Job Applications
  const jobApplications = useMemo(() => {
    const all = (content.applications || []).filter((a: any) => a.kind === "job");
    return all.filter((app: any) => {
      const matchesSearch =
        !searchQuery ||
        app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.role_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.current_company?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || (app.status || "new") === statusFilter;
      const matchesRole = roleFilter === "all" || app.role_title === roleFilter;
      const matchesExp =
        jobExperienceFilter === "all" ||
        (app.experience || "").toLowerCase().includes(jobExperienceFilter.toLowerCase());
      return matchesSearch && matchesStatus && matchesRole && matchesExp;
    });
  }, [content.applications, searchQuery, statusFilter, roleFilter, jobExperienceFilter]);

  // Filtered Internship Applications
  const internApplications = useMemo(() => {
    const all = (content.applications || []).filter((a: any) => a.kind === "internship");
    return all.filter((app: any) => {
      const matchesSearch =
        !searchQuery ||
        app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.role_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.college?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.degree?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || (app.status || "new") === statusFilter;
      const matchesRole = roleFilter === "all" || app.role_title === roleFilter;
      const matchesYear =
        studyYearFilter === "all" ||
        (app.graduation_year || "").toLowerCase().includes(studyYearFilter.toLowerCase());
      const matchesCollege =
        internCollegeFilter === "all" ||
        (app.college || "").toLowerCase() === internCollegeFilter.toLowerCase();
      const matchesDistrict =
        internDistrictFilter === "all" ||
        (app.district || "").toLowerCase() === internDistrictFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesRole && matchesYear && matchesCollege && matchesDistrict;
    });
  }, [content.applications, searchQuery, statusFilter, roleFilter, studyYearFilter, internCollegeFilter, internDistrictFilter]);

  // Filtered Inquiries (Leads)
  const clientInquiries = useMemo(() => {
    const all = content.inquiries || [];
    return all.filter((inq: any) => {
      const matchesSearch =
        !searchQuery ||
        inq.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.service?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.message?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || (inq.status || "new") === statusFilter;
      const matchesPriority = priorityFilter === "all" || (inq.priority || "medium") === priorityFilter;
      const matchesService =
        leadServiceFilter === "all" ||
        (inq.service || "").toLowerCase() === leadServiceFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesPriority && matchesService;
    });
  }, [content.inquiries, searchQuery, statusFilter, priorityFilter, leadServiceFilter]);

  // Distinct roles for filter dropdowns
  const distinctJobRoles = useMemo<string[]>(() => {
    const roles: string[] = (content.applications || [])
      .filter((a: any) => a.kind === "job")
      .map((a: any) => a.role_title)
      .filter(Boolean);
    return Array.from(new Set(roles));
  }, [content.applications]);

  const distinctInternTracks = useMemo<string[]>(() => {
    const tracks: string[] = (content.applications || [])
      .filter((a: any) => a.kind === "internship")
      .map((a: any) => a.role_title)
      .filter(Boolean);
    return Array.from(new Set(tracks));
  }, [content.applications]);

  const distinctInternColleges = useMemo<string[]>(() => {
    const fromApps: string[] = (content.applications || [])
      .filter((a: any) => a.kind === "internship")
      .map((a: any) => a.college)
      .filter(Boolean);
    const fromCollegesTable: string[] = (content.colleges || [])
      .map((c: any) => c.name)
      .filter(Boolean);
    return Array.from(new Set([...fromCollegesTable, ...fromApps])).sort();
  }, [content.applications, content.colleges]);

  const distinctInternDistricts = useMemo<string[]>(() => {
    const set = new Set<string>(MAHARASHTRA_DISTRICTS);
    (content.applications || []).forEach((a: any) => {
      if (a.district) set.add(a.district);
    });
    (content.colleges || []).forEach((c: any) => {
      if (c.district) set.add(c.district);
      if (c.city) set.add(c.city);
    });
    return Array.from(set).filter(Boolean).sort();
  }, [content.applications, content.colleges]);

  const distinctLeadServices = useMemo<string[]>(() => {
    const services: string[] = (content.inquiries || [])
      .map((i: any) => i.service)
      .filter(Boolean);
    return Array.from(new Set(services));
  }, [content.inquiries]);

  // Distinct Districts from Colleges
  const distinctCollegeDistricts = useMemo<string[]>(() => {
    const list = content.colleges || [];
    const set = new Set<string>();
    list.forEach((c: any) => {
      const d = c.district || c.city;
      if (d) set.add(d);
    });
    set.add("Pune");
    set.add("Ahilyanagar");
    return Array.from(set).sort();
  }, [content.colleges]);

  // Filtered Campus Colleges
  const filteredColleges = useMemo(() => {
    let list = content.colleges || [];
    if (collegeCityFilter !== "all") {
      list = list.filter(
        (c: any) =>
          (c.district || c.city || "Pune").toLowerCase() === collegeCityFilter.toLowerCase()
      );
    }
    if (collegeStatusFilter !== "all") {
      const wantActive = collegeStatusFilter === "active";
      list = list.filter((c: any) => Boolean(c.is_active) === wantActive);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c: any) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.code || "").toLowerCase().includes(q) ||
        (c.district || "").toLowerCase().includes(q) ||
        (c.city || "").toLowerCase().includes(q) ||
        (c.state || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [content.colleges, collegeCityFilter, collegeStatusFilter, searchQuery]);

  // Filtered Generic Content Items (Jobs, Services, Projects, Tech, etc.)
  const filteredGenericItems = useMemo(() => {
    const list = content[activeSection] || [];
    if (!genericSearchQuery.trim()) return list;
    const q = genericSearchQuery.toLowerCase();
    return list.filter((item: any) => {
      return Object.values(item).some((val) => {
        if (typeof val === "string") return val.toLowerCase().includes(q);
        if (typeof val === "number") return val.toString().includes(q);
        if (Array.isArray(val)) return val.some((v) => typeof v === "string" && v.toLowerCase().includes(q));
        return false;
      });
    });
  }, [content, activeSection, genericSearchQuery]);

  // Filtered Sub-Admins
  const filteredSubadmins = useMemo(() => {
    let list = content.subadmins || [];
    if (subadminRoleFilter !== "all") {
      list = list.filter((s: any) => (s.role || "").toLowerCase() === subadminRoleFilter.toLowerCase());
    }
    if (subadminSearchQuery.trim()) {
      const q = subadminSearchQuery.toLowerCase();
      list = list.filter((s: any) =>
        (s.username || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q) ||
        (s.role || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [content.subadmins, subadminRoleFilter, subadminSearchQuery]);

  // Paginated Slices (PAGE_SIZE = 10)
  const paginatedInquiries = useMemo(() => {
    return clientInquiries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [clientInquiries, currentPage]);

  const paginatedJobApps = useMemo(() => {
    return jobApplications.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [jobApplications, currentPage]);

  const paginatedInternApps = useMemo(() => {
    return internApplications.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [internApplications, currentPage]);

  const paginatedColleges = useMemo(() => {
    return filteredColleges.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [filteredColleges, currentPage]);

  const paginatedGenericItems = useMemo(() => {
    return filteredGenericItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [filteredGenericItems, currentPage]);

  const paginatedSubadmins = useMemo(() => {
    return filteredSubadmins.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [filteredSubadmins, currentPage]);

  const paginatedRecycleBin = useMemo(() => {
    return (content.recycleBin || []).slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [content.recycleBin, currentPage]);

  // If not logged in, render the login screen
  if (!token) {
    return (
      <div className="admin-root">
        <div className="admin-login-screen">
          <div className="admin-login-card">
            {/* Top Security Clearance Badge */}
            <div className="admin-login-security-tag">
              <ShieldCheck size={14} />
              <span>AUTHORIZED ACCESS ONLY · PUNE HQ &amp; AHILYANAGAR</span>
            </div>

            <div className="admin-login-header">
              <div className="admin-login-brand">
                <div className="admin-login-logo-glow">
                  <img
                    src="/logo.svg"
                    alt="KairoEdge Technologies"
                    className="admin-login-logo-img"
                  />
                </div>
                <div className="admin-login-brand-text">
                  KairoEdge
                  <small>Enterprise Control Room</small>
                </div>
              </div>
              <h1 className="admin-login-title">Control Room Sign-In</h1>
              <p className="admin-login-subtitle">
                Unified administration for student internships, client leads, and website operations
              </p>
            </div>

            {loginError && (
              <div className="admin-login-error-box">
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>Access Restricted</div>
                  <div style={{ fontSize: "0.82rem", lineHeight: 1.45 }}>{loginError}</div>
                </div>
              </div>
            )}

            <form className="admin-login-form" onSubmit={(e) => handleLogin(e)}>
              <div className="admin-field-group">
                <label className="admin-field-label">Username</label>
                <div className="admin-input-wrap">
                  <span className="admin-input-icon"><Users size={16} /></span>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Enter admin username"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label">Password</label>
                <div className="admin-input-wrap">
                  <span className="admin-input-icon"><Shield size={16} /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="admin-input"
                    placeholder="••••••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="admin-input-reveal"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="admin-login-btn" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <RefreshCw size={16} className="admin-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Control Room</span>
                    <span aria-hidden="true">&rarr;</span>
                  </>
                )}
              </button>
            </form>

            <div className="admin-login-trust-footer">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "var(--adm-text-muted)", fontSize: "0.76rem" }}>
                <Lock size={12} style={{ color: "#10b981" }} />
                <span>256-Bit SSL Encrypted Session · Strict Role-Based RBAC</span>
              </div>
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <Link to="/" style={{ color: "#0284c7", fontSize: "0.82rem", textDecoration: "none", fontWeight: 600 }}>
                  ← Return to Public Website
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Badges
  const newJobCount = (content.applications || []).filter((a: any) => a.kind === "job" && (!a.status || a.status === "new")).length;
  const newInternCount = (content.applications || []).filter((a: any) => a.kind === "internship" && (!a.status || a.status === "new")).length;
  const newInquiriesCount = (content.inquiries || []).filter((i: any) => !i.status || i.status === "new").length;
  const activeCollegesCount = (content.colleges || []).filter((c: any) => c.is_active).length;
  const recycleBinCount = (content.recycleBin || []).length;

  return (
    <div className="admin-root">
      <div className="admin-layout">
        {/* SIDEBAR NAVIGATION */}
        <aside className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileMenuOpen ? "open" : ""}`}>
          <div className="admin-sidebar-header">
            <Link to="/" className="admin-sidebar-logo" target="_blank" title="View Public Website">
              <img
                src="/logo.svg"
                alt="KairoEdge"
                className="admin-sidebar-logo-img"
                style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 0 2px rgba(2, 132, 199, 0.35), 0 2px 10px rgba(0, 102, 255, 0.15)", flexShrink: 0 }}
              />
              {!sidebarCollapsed && (
                <div className="admin-sidebar-logo-text">
                  <span>Kairo<span style={{ color: "var(--adm-primary)" }}>Edge</span></span>
                  <small style={{ color: "var(--adm-text-muted)", fontSize: "0.68rem", letterSpacing: "0.04em" }}>Admin Control Room</small>
                </div>
              )}
            </Link>
            <button
              className="admin-sidebar-collapse-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronRight size={16} style={{ transform: sidebarCollapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.2s" }} />
            </button>
          </div>

          {!sidebarCollapsed && (
            <div style={{ padding: "10px 16px 2px", display: "flex", alignItems: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "999px", background: "rgba(2, 132, 199, 0.08)", border: "1px solid rgba(2, 132, 199, 0.2)", fontSize: "0.72rem", color: "var(--adm-primary)", fontWeight: 600 }}>
                <MapPin size={11} />
                <span>Pune (HQ) &amp; Ahilyanagar</span>
              </div>
            </div>
          )}

          <nav className="admin-sidebar-nav">
            {/* Group 1: Command Center */}
            <div className="admin-nav-group">
              {!sidebarCollapsed && <div className="admin-nav-group-title">Command Center</div>}
              <div className="admin-nav-items">
                <button
                  className={`admin-nav-item ${activeSection === "dashboard" ? "active" : ""}`}
                  onClick={() => { setActiveSection("dashboard"); setMobileMenuOpen(false); }}
                >
                  <LayoutDashboard className="admin-nav-item-icon" />
                  {!sidebarCollapsed && <span className="admin-nav-item-label">Dashboard</span>}
                </button>
              </div>
            </div>

            {/* Group 2: Leads & Clients */}
            <div className="admin-nav-group">
              {!sidebarCollapsed && <div className="admin-nav-group-title">Leads & Clients</div>}
              <div className="admin-nav-items">
                <button
                  className={`admin-nav-item ${activeSection === "inquiries" ? "active" : ""}`}
                  onClick={() => { setActiveSection("inquiries"); setMobileMenuOpen(false); }}
                >
                  <Mail className="admin-nav-item-icon" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="admin-nav-item-label">Client Inquiries (Leads)</span>
                      {newInquiriesCount > 0 && <span className="admin-nav-item-badge">{newInquiriesCount} new</span>}
                    </>
                  )}
                </button>
                <button
                  className={`admin-nav-item ${activeSection === "contact_info" ? "active" : ""}`}
                  onClick={() => { setActiveSection("contact_info"); setMobileMenuOpen(false); }}
                >
                  <Phone className="admin-nav-item-icon" />
                  {!sidebarCollapsed && <span className="admin-nav-item-label">Contact & Office Info</span>}
                </button>
              </div>
            </div>

            {/* Group 3: Talent & Career Pipelines */}
            <div className="admin-nav-group">
              {!sidebarCollapsed && <div className="admin-nav-group-title">Talent Management</div>}
              <div className="admin-nav-items">
                <button
                  className={`admin-nav-item ${activeSection === "job_apps" ? "active" : ""}`}
                  onClick={() => { setActiveSection("job_apps"); setMobileMenuOpen(false); }}
                >
                  <Briefcase className="admin-nav-item-icon" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="admin-nav-item-label">Job Applications</span>
                      {newJobCount > 0 && <span className="admin-nav-item-badge">{newJobCount} new</span>}
                    </>
                  )}
                </button>
                <button
                  className={`admin-nav-item ${activeSection === "intern_apps" ? "active" : ""}`}
                  onClick={() => { setActiveSection("intern_apps"); setMobileMenuOpen(false); }}
                >
                  <GraduationCap className="admin-nav-item-icon" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="admin-nav-item-label">Internships</span>
                      {newInternCount > 0 && <span className="admin-nav-item-badge">{newInternCount} new</span>}
                    </>
                  )}
                </button>
                <button
                  className={`admin-nav-item ${activeSection === "colleges" ? "active" : ""}`}
                  onClick={() => { setActiveSection("colleges"); setMobileMenuOpen(false); }}
                >
                  <Building2 className="admin-nav-item-icon" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="admin-nav-item-label">Campus Colleges</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--adm-text-muted)" }}>{activeCollegesCount} active</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Group 4: Website Content (Make All Editable) */}
            <div className="admin-nav-group">
              {!sidebarCollapsed && <div className="admin-nav-group-title">Website Content (All Editable)</div>}
              <div className="admin-nav-items">
                <button
                  className={`admin-nav-item ${activeSection === "copy" ? "active" : ""}`}
                  onClick={() => { setActiveSection("copy"); setMobileMenuOpen(false); }}
                >
                  <FileText className="admin-nav-item-icon" color="var(--adm-cyan)" />
                  {!sidebarCollapsed && <span className="admin-nav-item-label">Page Copy & Content</span>}
                </button>
                <button
                  className={`admin-nav-item ${activeSection === "jobs" ? "active" : ""}`}
                  onClick={() => { setActiveSection("jobs"); setMobileMenuOpen(false); }}
                >
                  <Briefcase className="admin-nav-item-icon" />
                  {!sidebarCollapsed && <span className="admin-nav-item-label">Open Roles / JDs</span>}
                </button>
                <button
                  className={`admin-nav-item ${activeSection === "services" ? "active" : ""}`}
                  onClick={() => { setActiveSection("services"); setMobileMenuOpen(false); }}
                >
                  <Layers className="admin-nav-item-icon" />
                  {!sidebarCollapsed && <span className="admin-nav-item-label">Services</span>}
                </button>
                <button
                  className={`admin-nav-item ${activeSection === "projects" ? "active" : ""}`}
                  onClick={() => { setActiveSection("projects"); setMobileMenuOpen(false); }}
                >
                  <FolderGit2 className="admin-nav-item-icon" />
                  {!sidebarCollapsed && <span className="admin-nav-item-label">Case Studies</span>}
                </button>
                <button
                  className={`admin-nav-item ${activeSection === "industries" ? "active" : ""}`}
                  onClick={() => { setActiveSection("industries"); setMobileMenuOpen(false); }}
                >
                  <Building2 className="admin-nav-item-icon" />
                  {!sidebarCollapsed && <span className="admin-nav-item-label">Industries</span>}
                </button>
                <button
                  className={`admin-nav-item ${activeSection === "technologies" ? "active" : ""}`}
                  onClick={() => { setActiveSection("technologies"); setMobileMenuOpen(false); }}
                >
                  <Cpu className="admin-nav-item-icon" />
                  {!sidebarCollapsed && <span className="admin-nav-item-label">Tech Stack</span>}
                </button>
                <button
                  className={`admin-nav-item ${activeSection === "process_steps" ? "active" : ""}`}
                  onClick={() => { setActiveSection("process_steps"); setMobileMenuOpen(false); }}
                >
                  <Sliders className="admin-nav-item-icon" />
                  {!sidebarCollapsed && <span className="admin-nav-item-label">Process Steps</span>}
                </button>
                <button
                  className={`admin-nav-item ${activeSection === "principles" ? "active" : ""}`}
                  onClick={() => { setActiveSection("principles"); setMobileMenuOpen(false); }}
                >
                  <Shield className="admin-nav-item-icon" />
                  {!sidebarCollapsed && <span className="admin-nav-item-label">Core Principles</span>}
                </button>
                <button
                  className={`admin-nav-item ${activeSection === "architecture" ? "active" : ""}`}
                  onClick={() => { setActiveSection("architecture"); setMobileMenuOpen(false); }}
                >
                  <Layers className="admin-nav-item-icon" />
                  {!sidebarCollapsed && <span className="admin-nav-item-label">Architecture</span>}
                </button>
                <button
                  className={`admin-nav-item ${activeSection === "testimonials" ? "active" : ""}`}
                  onClick={() => { setActiveSection("testimonials"); setMobileMenuOpen(false); }}
                >
                  <MessageSquareQuote className="admin-nav-item-icon" />
                  {!sidebarCollapsed && <span className="admin-nav-item-label">Client Reviews</span>}
                </button>
                <button
                  className={`admin-nav-item ${activeSection === "stats" ? "active" : ""}`}
                  onClick={() => { setActiveSection("stats"); setMobileMenuOpen(false); }}
                >
                  <TrendingUp className="admin-nav-item-icon" />
                  {!sidebarCollapsed && <span className="admin-nav-item-label">Key Metrics</span>}
                </button>
              </div>
            </div>

            {/* Group 5: Safety & Admin Control */}
            <div className="admin-nav-group">
              {!sidebarCollapsed && <div className="admin-nav-group-title">Safety & Access</div>}
              <div className="admin-nav-items">
                <button
                  className={`admin-nav-item ${activeSection === "subadmins" ? "active" : ""}`}
                  onClick={() => { setActiveSection("subadmins"); setMobileMenuOpen(false); }}
                >
                  <Users className="admin-nav-item-icon" />
                  {!sidebarCollapsed && <span className="admin-nav-item-label">Sub-Admins & Roles</span>}
                </button>
                <button
                  className={`admin-nav-item ${activeSection === "recycle_bin" ? "active" : ""}`}
                  onClick={() => { setActiveSection("recycle_bin"); setMobileMenuOpen(false); }}
                >
                  <Trash2 className="admin-nav-item-icon" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="admin-nav-item-label">Recycle Bin</span>
                      {recycleBinCount > 0 && <span style={{ fontSize: "0.72rem", color: "var(--adm-text-faint)" }}>{recycleBinCount}</span>}
                    </>
                  )}
                </button>
              </div>
            </div>
          </nav>

          <div className="admin-sidebar-footer">
            {!sidebarCollapsed ? (
              <>
                <div className="admin-user-profile">
                  <div className="admin-user-avatar">{user.charAt(0).toUpperCase()}</div>
                  <div className="admin-user-info">
                    <span className="admin-user-name">{user}</span>
                    <span className="admin-user-role">{role}</span>
                  </div>
                </div>
                <button className="admin-logout-btn" onClick={handleLogout} title="Sign Out">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <button className="admin-logout-btn" onClick={handleLogout} title="Sign Out">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </aside>

        {/* MAIN PANEL CONTENT */}
        <div className="admin-main">
          {/* TOPBAR */}
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <button className="admin-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu size={20} />
              </button>
              <div className="admin-breadcrumbs">
                <span className="admin-breadcrumb-root">Control Room</span>
                <span className="admin-breadcrumb-sep">/</span>
                <span className="admin-breadcrumb-active">
                  {activeSection === "dashboard" && "Command Dashboard"}
                  {activeSection === "inquiries" && "Client Leads & Inquiries"}
                  {activeSection === "contact_info" && "Contact & Company Settings"}
                  {activeSection === "job_apps" && "Job Applications Pipeline"}
                  {activeSection === "intern_apps" && "Internship Candidates"}
                  {activeSection === "colleges" && "Campus Colleges"}
                  {activeSection === "copy" && "Page Copy & Content Editor"}
                  {activeSection === "subadmins" && "Sub-Admins & Permissions"}
                  {activeSection === "recycle_bin" && "Recycle Bin & Safety"}
                  {tableSchemas[activeSection] && activeSection !== "colleges" && tableSchemas[activeSection].label}
                </span>
              </div>
            </div>

            <div className="admin-topbar-right">
              <button
                className="adm-btn adm-btn-sec adm-btn-sm"
                onClick={fetchData}
                disabled={refreshing}
                title="Refresh All Data"
              >
                <RefreshCw size={14} className={refreshing ? "spin" : ""} />
                <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
              </button>
            </div>
          </header>

          {/* VIEW BODY */}
          <main className="admin-view-body">
            {/* VIEW 1: DASHBOARD */}
            {activeSection === "dashboard" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Clean Professional Dashboard Header */}
                <div className="admin-view-header" style={{ marginBottom: "4px" }}>
                  <div className="admin-view-title-group">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <h1 style={{ fontSize: "1.55rem", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
                        Overview Dashboard
                      </h1>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", color: "#059669", fontSize: "0.74rem", fontWeight: 700, padding: "2px 10px", borderRadius: "999px" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }}></span>
                        Live Production
                      </span>
                    </div>
                    <p style={{ margin: "4px 0 0", color: "var(--adm-text-muted)", fontSize: "0.88rem" }}>
                      Welcome back, <b style={{ color: "var(--adm-text-bright)" }}>{user || "admin"}</b> ({role || "Super Administrator"}). Monitoring Pune (HQ) &amp; Ahilyanagar pipelines.
                    </p>
                  </div>

                  <div className="admin-view-actions">
                    <button
                      className="adm-btn adm-btn-pri"
                      onClick={() =>
                        setEditingLead({
                          name: "",
                          email: "",
                          phone: "",
                          company: "",
                          service: "Custom software",
                          message: "",
                          status: "new",
                          priority: "hot",
                          source: "Direct Call",
                          budget: "",
                          follow_up_date: new Date().toISOString().split("T")[0]
                        })
                      }
                    >
                      <Plus size={15} />
                      <span>+ Log Client Lead</span>
                    </button>
                    <button className="adm-btn adm-btn-sec" onClick={() => handleOpenItemModal("jobs")}>
                      <Plus size={15} />
                      <span>Post Open Role</span>
                    </button>
                    <button className="adm-btn adm-btn-sec" onClick={() => setActiveSection("contact_info")}>
                      <Phone size={15} />
                      <span>Branch Settings</span>
                    </button>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="admin-stats-grid">
                  <div className="admin-stat-card" onClick={() => setActiveSection("inquiries")} style={{ cursor: "pointer" }}>
                    <div className="admin-stat-top">
                      <span className="admin-stat-label">Client Inquiries (Leads)</span>
                      <div className="admin-stat-icon-wrap"><Mail size={20} /></div>
                    </div>
                    <div className="admin-stat-value">
                      {dashboard?.counts?.inquiries || content.inquiries?.length || 0}
                      {newInquiriesCount > 0 ? (
                        <span className="admin-stat-badge">{newInquiriesCount} new</span>
                      ) : (
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#10b981", background: "rgba(16, 185, 129, 0.1)", padding: "2px 8px", borderRadius: "9999px" }}>Ready</span>
                      )}
                    </div>
                  </div>

                  <div className="admin-stat-card" onClick={() => setActiveSection("job_apps")} style={{ cursor: "pointer" }}>
                    <div className="admin-stat-top">
                      <span className="admin-stat-label">Job Applicants</span>
                      <div className="admin-stat-icon-wrap"><Briefcase size={20} /></div>
                    </div>
                    <div className="admin-stat-value">
                      {dashboard?.counts?.jobApplications || 0}
                      {newJobCount > 0 ? (
                        <span className="admin-stat-badge">{newJobCount} new</span>
                      ) : (
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--adm-text-muted)" }}>0 active</span>
                      )}
                    </div>
                  </div>

                  <div className="admin-stat-card" onClick={() => setActiveSection("intern_apps")} style={{ cursor: "pointer" }}>
                    <div className="admin-stat-top">
                      <span className="admin-stat-label">Internship Candidates</span>
                      <div className="admin-stat-icon-wrap"><GraduationCap size={20} /></div>
                    </div>
                    <div className="admin-stat-value">
                      {dashboard?.counts?.internApplications || 0}
                      {newInternCount > 0 ? (
                        <span className="admin-stat-badge">{newInternCount} new</span>
                      ) : (
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--adm-text-muted)" }}>0 active</span>
                      )}
                    </div>
                  </div>

                  <div className="admin-stat-card" onClick={() => setActiveSection("colleges")} style={{ cursor: "pointer" }}>
                    <div className="admin-stat-top">
                      <span className="admin-stat-label">Campus Colleges</span>
                      <div className="admin-stat-icon-wrap"><Building2 size={20} /></div>
                    </div>
                    <div className="admin-stat-value">
                      {activeCollegesCount}
                      <span style={{ fontSize: "0.85rem", color: "var(--adm-text-muted)", marginLeft: "4px" }}>/ {content.colleges?.length || 0}</span>
                    </div>
                  </div>

                  <div className="admin-stat-card" onClick={() => setActiveSection("jobs")} style={{ cursor: "pointer" }}>
                    <div className="admin-stat-top">
                      <span className="admin-stat-label">Live Open Roles</span>
                      <div className="admin-stat-icon-wrap"><Layers size={20} /></div>
                    </div>
                    <div className="admin-stat-value">{content.jobs?.length || 0}</div>
                  </div>

                  <div className="admin-stat-card" onClick={() => setActiveSection("services")} style={{ cursor: "pointer" }}>
                    <div className="admin-stat-top">
                      <span className="admin-stat-label">Services</span>
                      <div className="admin-stat-icon-wrap"><Cpu size={20} /></div>
                    </div>
                    <div className="admin-stat-value">{content.services?.length || 0}</div>
                  </div>
                </div>

                {/* Recent Feeds Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "24px" }}>
                  {/* Recent Leads Feed */}
                  <div className="admin-table-container" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                      <h3 style={{ fontFamily: "Manrope", fontSize: "1.1rem", fontWeight: 700, color: "var(--adm-text-bright)", display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(2, 132, 199, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--adm-primary)" }}>
                          <Mail size={18} />
                        </div>
                        Recent Client Leads & Inquiries
                      </h3>
                      <button className="adm-btn adm-btn-sec adm-btn-sm" onClick={() => setActiveSection("inquiries")}>
                        View All →
                      </button>
                    </div>

                    {(content.inquiries || []).length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {(content.inquiries || []).slice(0, 5).map((inq: any) => (
                          <div
                            key={inq.id}
                            style={{
                              background: "var(--adm-card)",
                              border: "1px solid var(--adm-border)",
                              borderRadius: "10px",
                              padding: "14px 16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              cursor: "pointer",
                              transition: "all 0.15s ease"
                            }}
                            onClick={() => setEditingLead(inq)}
                          >
                            <div>
                              <div style={{ fontWeight: 600, color: "var(--adm-text-bright)", fontSize: "0.92rem" }}>
                                {inq.name} {inq.company && `(${inq.company})`}
                              </div>
                              <div style={{ fontSize: "0.78rem", color: "var(--adm-text-muted)", marginTop: "2px" }}>
                                {inq.service || "General Inquiry"} · {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : ""}
                                {inq.priority === "hot" && " · 🔥 Hot"}
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span className={`admin-status-dropdown ${inq.status || "new"}`} style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: "6px" }}>
                                {inq.status || "new"}
                              </span>
                              <ChevronRight size={16} color="var(--adm-text-muted)" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "36px 20px",
                          background: "rgba(248, 250, 252, 0.7)",
                          border: "1px dashed #cbd5e1",
                          borderRadius: "12px",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(2, 132, 199, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--adm-primary)", marginBottom: "12px" }}>
                          <Inbox size={24} />
                        </div>
                        <div style={{ fontWeight: 700, color: "var(--adm-text-bright)", fontSize: "0.98rem", marginBottom: "4px" }}>
                          Ready for Real Client Inquiries
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "var(--adm-text-muted)", maxWidth: "340px", marginBottom: "16px", lineHeight: "1.4" }}>
                          All demo data has been cleared. Inquiries submitted via the Contact page or quote forms will appear here instantly.
                        </div>
                        <button
                          className="adm-btn adm-btn-sec adm-btn-sm"
                          onClick={() =>
                            setEditingLead({
                              name: "",
                              email: "",
                              phone: "",
                              company: "",
                              service: "Custom software",
                              message: "",
                              status: "new",
                              priority: "hot",
                              source: "Direct Call",
                              budget: "",
                              follow_up_date: new Date().toISOString().split("T")[0]
                            })
                          }
                        >
                          <Plus size={14} />
                          <span>+ Log Manual Client Lead</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Recent Applications Feed */}
                  <div className="admin-table-container" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                      <h3 style={{ fontFamily: "Manrope", fontSize: "1.1rem", fontWeight: 700, color: "var(--adm-text-bright)", display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
                          <Users size={18} />
                        </div>
                        Recent Talent Applications
                      </h3>
                      <button className="adm-btn adm-btn-sec adm-btn-sm" onClick={() => setActiveSection("job_apps")}>
                        View All →
                      </button>
                    </div>

                    {(content.applications || []).length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {(content.applications || []).slice(0, 5).map((app: any) => (
                          <div
                            key={app.id}
                            style={{
                              background: "var(--adm-card)",
                              border: "1px solid var(--adm-border)",
                              borderRadius: "10px",
                              padding: "14px 16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              cursor: "pointer",
                              transition: "all 0.15s ease"
                            }}
                            onClick={() => setSelectedCandidate(app)}
                          >
                            <div>
                              <div style={{ fontWeight: 600, color: "var(--adm-text-bright)", fontSize: "0.92rem" }}>
                                {app.name}
                              </div>
                              <div style={{ fontSize: "0.78rem", color: "var(--adm-text-muted)", marginTop: "2px" }}>
                                {app.role_title} · {app.kind === "internship" ? (app.college || "Internship") : (app.experience || "Job")}
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span className={`admin-status-dropdown ${app.status || "new"}`} style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: "6px" }}>
                                {app.status || "new"}
                              </span>
                              <ChevronRight size={16} color="var(--adm-text-muted)" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "36px 20px",
                          background: "rgba(248, 250, 252, 0.7)",
                          border: "1px dashed #cbd5e1",
                          borderRadius: "12px",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669", marginBottom: "12px" }}>
                          <GraduationCap size={24} />
                        </div>
                        <div style={{ fontWeight: 700, color: "var(--adm-text-bright)", fontSize: "0.98rem", marginBottom: "4px" }}>
                          Ready for Talent Submissions
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "var(--adm-text-muted)", maxWidth: "340px", marginBottom: "16px", lineHeight: "1.4" }}>
                          Database is pristine for live hiring. Applications from candidates across Pune & Maharashtra will stream in here live.
                        </div>
                        <Link to="/careers" target="_blank" className="adm-btn adm-btn-sec adm-btn-sm" style={{ textDecoration: "none" }}>
                          <ExternalLink size={14} />
                          <span>View Live Careers Page</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Management Shortcuts */}
                <div style={{ background: "var(--adm-card)", border: "1px solid var(--adm-border)", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h3 style={{ fontFamily: "Manrope", fontSize: "1.05rem", fontWeight: 700, color: "var(--adm-text-bright)", margin: 0 }}>
                      Quick Management Shortcuts
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--adm-text-muted)" }}>Instant deep-links to control modules</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                    <div
                      className="admin-stat-card"
                      style={{ cursor: "pointer", background: "var(--adm-bg)", border: "1px solid var(--adm-border)", borderRadius: "12px", padding: "16px" }}
                      onClick={() => setActiveSection("inquiries")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(2, 132, 199, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--adm-primary)" }}>
                          <Mail size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--adm-text-bright)" }}>Client CRM & Leads</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>Follow-ups, WhatsApp, statuses</div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="admin-stat-card"
                      style={{ cursor: "pointer", background: "var(--adm-bg)", border: "1px solid var(--adm-border)", borderRadius: "12px", padding: "16px" }}
                      onClick={() => setActiveSection("site_copy")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
                          <Edit3 size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--adm-text-bright)" }}>Live Website Copy</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>Headlines, blurbs & branding</div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="admin-stat-card"
                      style={{ cursor: "pointer", background: "var(--adm-bg)", border: "1px solid var(--adm-border)", borderRadius: "12px", padding: "16px" }}
                      onClick={() => setActiveSection("contact_info")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4f46e5" }}>
                          <Phone size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--adm-text-bright)" }}>Dual-Branch Settings</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>Pune HQ & Ahilyanagar branch</div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="admin-stat-card"
                      style={{ cursor: "pointer", background: "var(--adm-bg)", border: "1px solid var(--adm-border)", borderRadius: "12px", padding: "16px" }}
                      onClick={() => setActiveSection("colleges")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706" }}>
                          <Building2 size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--adm-text-bright)" }}>Pune Campus Network</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>COEP, PICT, MIT & 30 colleges</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: CLIENT INQUIRIES & LEADS MANAGEMENT */}
            {activeSection === "inquiries" && (
              <div>
                <div className="admin-view-header">
                  <div className="admin-view-title-group">
                    <h1>Client Project Inquiries & Leads Management</h1>
                    <p>Track client leads, manage sales pipelines, assign priorities, record follow-ups, and chat via WhatsApp</p>
                  </div>
                  <div className="admin-view-actions">
                    <button
                      className="adm-btn adm-btn-pri"
                      onClick={() =>
                        setEditingLead({
                          name: "",
                          email: "",
                          phone: "",
                          company: "",
                          service: "Custom software",
                          message: "",
                          status: "new",
                          priority: "hot",
                          source: "Direct Call",
                          budget: "",
                          follow_up_date: new Date().toISOString().split("T")[0]
                        })
                      }
                    >
                      <Plus size={16} />
                      <span>+ Log New Lead</span>
                    </button>
                    <button
                      className="adm-btn adm-btn-sec"
                      onClick={() =>
                        exportToCsv(
                          "kairoedge-leads.csv",
                          [
                            { header: "ID", accessor: (r) => r.id },
                            { header: "Client Name", accessor: (r) => r.name },
                            { header: "Company", accessor: (r) => r.company },
                            { header: "Email", accessor: (r) => r.email },
                            { header: "Phone", accessor: (r) => r.phone },
                            { header: "Service Requested", accessor: (r) => r.service },
                            { header: "Status", accessor: (r) => r.status },
                            { header: "Priority", accessor: (r) => r.priority || "medium" },
                            { header: "Source", accessor: (r) => r.source || "Website" },
                            { header: "Estimated Budget", accessor: (r) => r.budget || "—" },
                            { header: "Follow-up Date", accessor: (r) => r.follow_up_date || "—" },
                            { header: "Project Message", accessor: (r) => r.message },
                            { header: "Notes", accessor: (r) => r.notes },
                            { header: "Created Date", accessor: (r) => r.created_at }
                          ],
                          clientInquiries
                        )
                      }
                    >
                      <Download size={15} />
                      <span>Export CSV ({clientInquiries.length})</span>
                    </button>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="admin-toolbar">
                  <div className="admin-toolbar-left">
                    <div className="admin-search-wrap">
                      <Search size={16} className="admin-search-icon" />
                      <input
                        type="text"
                        className="admin-search-input"
                        placeholder="Search lead, company, email, service..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <select
                      className="admin-filter-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Stages</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in_discussion">In Discussion</option>
                      <option value="proposal_sent">Proposal Sent</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="won">Won / Converted</option>
                      <option value="lost">Lost / Closed</option>
                    </select>

                    <select
                      className="admin-filter-select"
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                      <option value="all">All Priorities</option>
                      <option value="hot">🔥 Hot Priority</option>
                      <option value="medium">⚡ Medium Priority</option>
                      <option value="low">❄️ Low Priority</option>
                    </select>

                    {distinctLeadServices.length > 0 && (
                      <select
                        className="admin-filter-select"
                        value={leadServiceFilter}
                        onChange={(e) => setLeadServiceFilter(e.target.value)}
                      >
                        <option value="all">All Services ({distinctLeadServices.length})</option>
                        {distinctLeadServices.map((svc) => (
                          <option key={svc} value={svc}>{svc}</option>
                        ))}
                      </select>
                    )}

                    {(searchQuery || statusFilter !== "all" || priorityFilter !== "all" || leadServiceFilter !== "all") && (
                      <button
                        type="button"
                        className="admin-filter-reset-btn"
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                          setPriorityFilter("all");
                          setLeadServiceFilter("all");
                        }}
                        title="Clear all filters"
                      >
                        <X size={14} />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>

                  <div className="admin-toolbar-right">
                    <span style={{ fontSize: "0.85rem", color: "var(--adm-text-muted)" }}>
                      Showing <b>{clientInquiries.length}</b> of {(content.inquiries || []).length} leads
                    </span>
                  </div>
                </div>

                {/* Inquiries Cards */}
                {clientInquiries.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--adm-panel)", borderRadius: "12px", border: "1px dashed var(--adm-border)" }}>
                    <Mail size={40} color="var(--adm-text-faint)" style={{ margin: "0 auto 12px" }} />
                    <h3 style={{ color: "var(--adm-text-bright)", marginBottom: "4px" }}>No Client Leads Found</h3>
                    <p style={{ color: "var(--adm-text-muted)", fontSize: "0.88rem" }}>Try adjusting your search criteria or log a new lead manually</p>
                  </div>
                ) : (
                  <>
                    <div className="admin-candidate-list">
                      {paginatedInquiries.map((inq: any) => {
                        const leadRefId = `KE-LEAD-2026-${String(inq.id).padStart(4, "0")}`;
                        return (
                          <div key={inq.id} className={`admin-candidate-card status-${inq.status || "new"}`}>
                            <div className="admin-candidate-header">
                              <div className="admin-candidate-profile">
                                <div className="admin-candidate-avatar" style={{ background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)" }}>
                                  {inq.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="admin-candidate-main-info">
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                                    <span className="admin-candidate-name">{inq.name}</span>
                                    <span className="admin-ref-id-badge">{leadRefId}</span>
                                    {inq.company && <span style={{ color: "var(--adm-text-muted)", fontSize: "0.88rem", fontWeight: 600 }}>· {inq.company}</span>}
                                    {inq.service && <span className="admin-candidate-role-pill">{inq.service}</span>}
                                    <span className={`admin-badge-priority ${inq.priority || "medium"}`}>
                                      {inq.priority === "hot" && "🔥 Hot"}
                                      {inq.priority === "medium" && "⚡ Medium"}
                                      {inq.priority === "low" && "❄️ Low"}
                                      {!inq.priority && "⚡ Normal"}
                                    </span>
                                  </div>
                                  <div className="admin-candidate-meta">
                                    {inq.email && (
                                      <span className="admin-candidate-meta-item">
                                        <Mail size={13} />
                                        <a href={`mailto:${inq.email}?subject=Re: Your Project Inquiry with KairoEdge Technologies`}>{inq.email}</a>
                                      </span>
                                    )}
                                    {inq.phone && (
                                      <span className="admin-candidate-meta-item">
                                        <Phone size={13} />
                                        <a href={`tel:${inq.phone.replace(/\s+/g, "")}`}>{inq.phone}</a>
                                      </span>
                                    )}
                                    <span className="admin-candidate-meta-item">
                                      <Clock size={13} />
                                      <span>Received: {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : "Recent"}</span>
                                    </span>
                                    {inq.source && (
                                      <span className="admin-candidate-meta-item" style={{ color: "var(--adm-cyan)" }}>
                                        Source: {inq.source}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="admin-candidate-status-group">
                                <select
                                  className={`admin-status-dropdown ${inq.status || "new"}`}
                                  value={inq.status || "new"}
                                  onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                                >
                                  <option value="new">● New Lead</option>
                                  <option value="contacted">● Contacted</option>
                                  <option value="in_discussion">● In Discussion</option>
                                  <option value="proposal_sent">● Proposal Sent</option>
                                  <option value="negotiation">● Negotiation</option>
                                  <option value="won">● Won / Converted</option>
                                  <option value="lost">● Closed / Lost</option>
                                </select>
                              </div>
                            </div>

                            {/* Financial & Follow-up Strip */}
                            {(inq.budget || inq.follow_up_date) && (
                              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", padding: "8px 12px", background: "rgba(3, 14, 24, 0.4)", borderRadius: "6px", fontSize: "0.82rem" }}>
                                {inq.budget && (
                                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "var(--adm-text-bright)" }}>
                                    <DollarSign size={14} color="#10b981" />
                                    <b>Est. Budget:</b> {inq.budget}
                                  </span>
                                )}
                                {inq.follow_up_date && (
                                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#fbbf24" }}>
                                    <Calendar size={14} />
                                    <b>Next Follow-up:</b> {inq.follow_up_date}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Project Scope Message */}
                            <div className="admin-candidate-pitch" style={{ borderLeftColor: "var(--adm-primary)" }}>
                              <b style={{ color: "var(--adm-text-bright)", display: "block", marginBottom: "4px", fontSize: "0.82rem" }}>
                                Project Requirements & Scope:
                              </b>
                              <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{inq.message}</p>
                            </div>

                            {/* Compact Lead Notes */}
                            <div className="admin-compact-notes">
                              <span className="notes-label">Lead Notes:</span>
                              <input
                                type="text"
                                className="admin-compact-notes-input"
                                placeholder="Add follow-up notes, proposal terms, or client requirements..."
                                defaultValue={inq.notes || ""}
                                onBlur={(e) => {
                                  if (e.target.value !== (inq.notes || "")) {
                                    handleUpdateInquiryStatus(inq.id, inq.status || "new", e.target.value);
                                  }
                                }}
                              />
                            </div>

                            {/* Actions */}
                            <div className="admin-candidate-actions">
                              <div className="admin-candidate-action-links">
                                {inq.phone && (
                                  <button
                                    type="button"
                                    className="adm-btn adm-btn-whatsapp adm-btn-sm"
                                    onClick={() =>
                                      openWhatsApp(
                                        inq.phone,
                                        `Hello ${inq.name}, thank you for reaching out to KairoEdge Technologies regarding ${inq.service || "software engineering"}. How can we assist you today?`
                                      )
                                    }
                                  >
                                    <MessageCircle size={14} />
                                    <span>WhatsApp Chat</span>
                                  </button>
                                )}
                                {inq.email && (
                                  <a
                                    href={`mailto:${inq.email}?subject=Re: Your Project Inquiry with KairoEdge Technologies`}
                                    className="adm-btn adm-btn-sec adm-btn-sm"
                                  >
                                    <Mail size={14} />
                                    <span>Email Reply</span>
                                  </a>
                                )}
                                {inq.phone && (
                                  <a
                                    href={`tel:${inq.phone.replace(/\s+/g, "")}`}
                                    className="adm-btn adm-btn-sec adm-btn-sm"
                                  >
                                    <Phone size={14} />
                                    <span>Call</span>
                                  </a>
                                )}
                                <button
                                  type="button"
                                  className="adm-btn adm-btn-sec adm-btn-sm"
                                  onClick={() => setEditingLead(inq)}
                                >
                                  <Edit3 size={14} />
                                  <span>Edit Details</span>
                                </button>
                              </div>

                              <button
                                className="adm-btn adm-btn-danger adm-btn-sm"
                                onClick={() => handleDeleteInquiry(inq.id)}
                                title="Move to Recycle Bin"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <PaginationControls
                      currentPage={currentPage}
                      totalItems={clientInquiries.length}
                      pageSize={PAGE_SIZE}
                      onPageChange={setCurrentPage}
                    />
                  </>
                )}
              </div>
            )}

            {/* VIEW 3: JOB APPLICATIONS */}
            {activeSection === "job_apps" && (
              <div>
                <div className="admin-view-header">
                  <div className="admin-view-title-group">
                    <h1>Job Applications & Talent Pipeline</h1>
                    <p>Review engineering candidates, verify experience, inspect resumes, record ratings, and manage hiring stages</p>
                  </div>
                  <div className="admin-view-actions">
                    <button
                      className="adm-btn adm-btn-pri"
                      onClick={() =>
                        setEditingCandidate({
                          kind: "job",
                          name: "",
                          email: "",
                          phone: "",
                          role_title: distinctJobRoles[0] || "Full-Stack Developer",
                          experience: "1 - 2 Years",
                          current_company: "",
                          current_designation: "",
                          notice_period: "Immediate",
                          expected_ctc: "",
                          portfolio_url: "",
                          message: "Direct candidate profile added by admin.",
                          status: "new",
                          rating: 0
                        })
                      }
                    >
                      <Plus size={16} />
                      <span>+ Add Candidate Manually</span>
                    </button>
                    <button
                      className="adm-btn adm-btn-sec"
                      onClick={() =>
                        exportToCsv(
                          "kairoedge-job-applications.csv",
                          [
                            { header: "ID", accessor: (r) => r.id },
                            { header: "Candidate Name", accessor: (r) => r.name },
                            { header: "Email", accessor: (r) => r.email },
                            { header: "Phone", accessor: (r) => r.phone },
                            { header: "Role Applied", accessor: (r) => r.role_title },
                            { header: "Experience", accessor: (r) => r.experience },
                            { header: "Current Company", accessor: (r) => r.current_company },
                            { header: "Designation", accessor: (r) => r.current_designation },
                            { header: "Notice Period", accessor: (r) => r.notice_period },
                            { header: "Expected CTC", accessor: (r) => r.expected_ctc },
                            { header: "Rating", accessor: (r) => r.rating || 0 },
                            { header: "Interview Date", accessor: (r) => r.interview_date || "—" },
                            { header: "Status", accessor: (r) => r.status },
                            { header: "Applied Date", accessor: (r) => r.created_at }
                          ],
                          jobApplications
                        )
                      }
                    >
                      <Download size={15} />
                      <span>Export CSV ({jobApplications.length})</span>
                    </button>
                  </div>
                </div>

                {/* Filter Toolbar */}
                <div className="admin-toolbar">
                  <div className="admin-toolbar-left">
                    <div className="admin-search-wrap">
                      <Search size={16} className="admin-search-icon" />
                      <input
                        type="text"
                        className="admin-search-input"
                        placeholder="Search candidate name, email, role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <select
                      className="admin-filter-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Stages</option>
                      <option value="new">New</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="offer_made">Offer Made</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <select
                      className="admin-filter-select"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option value="all">All Roles ({distinctJobRoles.length})</option>
                      {distinctJobRoles.map((r: string) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>

                    <select
                      className="admin-filter-select"
                      value={jobExperienceFilter}
                      onChange={(e) => setJobExperienceFilter(e.target.value)}
                    >
                      <option value="all">All Experience</option>
                      <option value="fresher">Fresher</option>
                      <option value="1">1 - 2 Years</option>
                      <option value="3">3 - 5 Years</option>
                      <option value="5">5+ Years</option>
                    </select>

                    {(searchQuery || statusFilter !== "all" || roleFilter !== "all" || jobExperienceFilter !== "all") && (
                      <button
                        type="button"
                        className="admin-filter-reset-btn"
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                          setRoleFilter("all");
                          setJobExperienceFilter("all");
                        }}
                        title="Clear all filters"
                      >
                        <X size={14} />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>

                  <div className="admin-toolbar-right">
                    <span style={{ fontSize: "0.85rem", color: "var(--adm-text-muted)" }}>
                      Showing <b>{jobApplications.length}</b> candidates
                    </span>
                  </div>
                </div>

                {/* Candidate List Cards */}
                {jobApplications.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--adm-panel)", borderRadius: "12px", border: "1px dashed var(--adm-border)" }}>
                    <Briefcase size={40} color="var(--adm-text-faint)" style={{ margin: "0 auto 12px" }} />
                    <h3 style={{ color: "var(--adm-text-bright)", marginBottom: "4px" }}>No Job Applications Found</h3>
                    <p style={{ color: "var(--adm-text-muted)", fontSize: "0.88rem" }}>Try adjusting your search criteria or add a candidate</p>
                  </div>
                ) : (
                  <>
                    <div className="admin-candidate-list">
                      {paginatedJobApps.map((cand: any) => {
                        const refId = `KE-JOB-2026-${String(cand.id).padStart(4, "0")}`;
                        return (
                          <div key={cand.id} className={`admin-candidate-card status-${cand.status || "new"}`}>
                            <div className="admin-candidate-header">
                              <div className="admin-candidate-profile">
                                <div className="admin-candidate-avatar">
                                  {cand.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="admin-candidate-main-info">
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                                    <span className="admin-candidate-name">{cand.name}</span>
                                    <span className="admin-ref-id-badge">{refId}</span>
                                    <span className="admin-candidate-role-pill">
                                      <Briefcase size={12} style={{ display: "inline-block", marginRight: "4px" }} />
                                      {cand.role_title}
                                    </span>
                                    {cand.rating > 0 && (
                                      <span style={{ color: "#f59e0b", fontSize: "0.85rem", display: "inline-flex", alignItems: "center" }}>
                                        {"★".repeat(cand.rating)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="admin-candidate-meta">
                                    <span className="admin-candidate-meta-item">
                                      <Mail size={13} />
                                      <a href={`mailto:${cand.email}?subject=Regarding your application for ${encodeURIComponent(cand.role_title)} at KairoEdge Technologies`}>
                                        {cand.email}
                                      </a>
                                    </span>
                                    {cand.phone && (
                                      <span className="admin-candidate-meta-item">
                                        <Phone size={13} />
                                        <a href={`tel:${cand.phone.replace(/\s+/g, "")}`}>{cand.phone}</a>
                                      </span>
                                    )}
                                    <span className="admin-candidate-meta-item">
                                      <Clock size={13} />
                                      <span>Applied: {cand.created_at ? new Date(cand.created_at).toLocaleDateString() : "Recent"}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="admin-candidate-status-group">
                                <select
                                  className={`admin-status-dropdown ${cand.status || "new"}`}
                                  value={cand.status || "new"}
                                  onChange={(e) => handleUpdateApplicationStatus(cand.id, e.target.value)}
                                >
                                  <option value="new">● New Application</option>
                                  <option value="reviewing">● Reviewing</option>
                                  <option value="shortlisted">● Shortlisted</option>
                                  <option value="interviewed">● Interviewed</option>
                                  <option value="offer_made">● Offer Made</option>
                                  <option value="hired">● Hired</option>
                                  <option value="rejected">● Rejected</option>
                                </select>
                              </div>
                            </div>

                            {/* Experience & Professional Details Grid */}
                            <div className="admin-candidate-details-grid">
                              <div className="admin-detail-item">
                                <span className="admin-detail-label">Experience</span>
                                <span className="admin-detail-value" style={{ fontWeight: 700, color: "var(--adm-text-bright)" }}>
                                  {cand.experience || "Fresher"}
                                </span>
                              </div>
                              <div className="admin-detail-item">
                                <span className="admin-detail-label">Current Company</span>
                                <span className="admin-detail-value">{cand.current_company || "—"}</span>
                              </div>
                              <div className="admin-detail-item">
                                <span className="admin-detail-label">Designation</span>
                                <span className="admin-detail-value">{cand.current_designation || "—"}</span>
                              </div>
                              <div className="admin-detail-item">
                                <span className="admin-detail-label">Notice Period</span>
                                <span className="admin-detail-value">{cand.notice_period || "Immediate"}</span>
                              </div>
                              <div className="admin-detail-item">
                                <span className="admin-detail-label">Expected CTC</span>
                                <span className="admin-detail-value" style={{ color: "#0ea5e9", fontWeight: 700 }}>
                                  {cand.expected_ctc || "—"}
                                </span>
                              </div>
                            </div>

                            {/* Scheduled Interview Banner */}
                            {cand.interview_date && (
                              <div className="admin-interview-banner">
                                <Calendar size={15} color="var(--adm-cyan)" />
                                <span>Scheduled Interview: <b>{cand.interview_date}</b> ({cand.interview_mode || "Google Meet"})</span>
                                {cand.salary_offered && (
                                  <span style={{ marginLeft: "auto", color: "#10b981", fontWeight: 700 }}>Offer: {cand.salary_offered}</span>
                                )}
                              </div>
                            )}

                            {/* Candidate Pitch / Note */}
                            {cand.message && (
                              <div className="admin-candidate-pitch">
                                <b style={{ color: "var(--adm-text-bright)", display: "block", marginBottom: "3px", fontSize: "0.8rem" }}>
                                  Candidate Pitch / Note:
                                </b>
                                <span>{cand.message}</span>
                              </div>
                            )}

                            {/* Compact Recruiter Notes */}
                            <div className="admin-compact-notes">
                              <span className="notes-label">Recruiter Notes:</span>
                              <input
                                type="text"
                                className="admin-compact-notes-input"
                                placeholder="Click to add recruiter notes, interview feedback, or salary discussion..."
                                defaultValue={cand.notes || ""}
                                onBlur={(e) => {
                                  if (e.target.value !== (cand.notes || "")) {
                                    handleUpdateApplicationStatus(cand.id, cand.status || "new", e.target.value);
                                  }
                                }}
                              />
                            </div>

                        {/* Actions Footer */}
                        <div className="admin-candidate-actions">
                          <div className="admin-candidate-action-links">
                            {cand.phone && (
                              <button
                                type="button"
                                className="adm-btn adm-btn-whatsapp adm-btn-sm"
                                onClick={() =>
                                  openWhatsApp(
                                    cand.phone,
                                    `Hello ${cand.name}, this is from KairoEdge Technologies regarding your application for the ${cand.role_title} position. Would you be available for a brief discussion?`
                                  )
                                }
                              >
                                <MessageCircle size={14} />
                                <span>WhatsApp</span>
                              </button>
                            )}
                            {cand.resume ? (
                              <>
                                <a
                                  href={cand.resume}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="adm-btn adm-btn-sec adm-btn-sm"
                                  title="Open candidate resume PDF in new tab"
                                >
                                  <Eye size={14} color="var(--adm-cyan)" />
                                  <span>View Resume</span>
                                </a>
                                <a
                                  href={cand.resume}
                                  download
                                  className="adm-btn adm-btn-sec adm-btn-sm"
                                  title="Download candidate resume file"
                                >
                                  <Download size={14} />
                                  <span>Download</span>
                                </a>
                              </>
                            ) : (
                              <span
                                className="adm-btn adm-btn-sec adm-btn-sm"
                                style={{ opacity: 0.55, cursor: "not-allowed" }}
                                title="No resume uploaded by candidate"
                              >
                                <FileText size={14} />
                                <span>No Resume</span>
                              </span>
                            )}
                            {cand.portfolio_url && (
                              <a
                                href={cand.portfolio_url}
                                target="_blank"
                                rel="noreferrer"
                                className="adm-btn adm-btn-sec adm-btn-sm"
                              >
                                <ExternalLink size={14} />
                                <span>Portfolio</span>
                              </a>
                            )}
                            <a
                              href={`mailto:${cand.email}?subject=Regarding your application for ${encodeURIComponent(cand.role_title)} at KairoEdge Technologies`}
                              className="adm-btn adm-btn-sec adm-btn-sm"
                            >
                              <Mail size={14} />
                              <span>Email</span>
                            </a>
                            {cand.phone && (
                              <a
                                href={`tel:${cand.phone.replace(/\s+/g, "")}`}
                                className="adm-btn adm-btn-sec adm-btn-sm"
                              >
                                <Phone size={14} />
                                <span>Call</span>
                              </a>
                            )}
                            <button
                              type="button"
                              className="adm-btn adm-btn-sec adm-btn-sm"
                              onClick={() => setEditingCandidate({ ...cand })}
                            >
                              <Edit3 size={14} />
                              <span>Edit / Interview</span>
                            </button>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <button
                              className="adm-btn adm-btn-sec adm-btn-sm"
                              onClick={() => setSelectedCandidate(cand)}
                            >
                              <Eye size={14} />
                              <span>View Dossier</span>
                            </button>
                            <button
                              className="adm-btn adm-btn-danger adm-btn-sm"
                              onClick={() => handleDeleteApplication(cand.id)}
                              title="Move to Recycle Bin"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                    <PaginationControls
                      currentPage={currentPage}
                      totalItems={jobApplications.length}
                      pageSize={PAGE_SIZE}
                      onPageChange={setCurrentPage}
                    />
                  </>
                )}
              </div>
            )}

            {/* VIEW 4: INTERNSHIP APPLICATIONS */}
            {activeSection === "intern_apps" && (
              <div>
                <div className="admin-view-header">
                  <div className="admin-view-title-group">
                    <h1>Internship Candidates & Tracks</h1>
                    <p>Manage student applications across Cloud, Full-Stack, AI/ML, and Mobile tracks with college and year details</p>
                  </div>
                  <div className="admin-view-actions">
                    <button
                      className="adm-btn adm-btn-pri"
                      onClick={() =>
                        setEditingCandidate({
                          kind: "internship",
                          name: "",
                          email: "",
                          phone: "",
                          role_title: distinctInternTracks[0] || "Full-stack web Internship",
                          college: "",
                          degree: "B.E. / B.Tech - Computer Science & Engineering (CSE)",
                          branch: "Computer Science & Engineering (CSE)",
                          graduation_year: "3rd Year",
                          portfolio_url: "",
                          message: "Internship candidate profile added by administrator.",
                          status: "new",
                          rating: 0
                        })
                      }
                    >
                      <Plus size={16} />
                      <span>+ Add Intern Manually</span>
                    </button>
                    <button
                      className="adm-btn adm-btn-sec"
                      onClick={() =>
                        exportToCsv(
                          internCollegeFilter !== "all"
                            ? `kairoedge-${internCollegeFilter.slice(0, 24).replace(/[^a-z0-9]/gi, "-")}-interns.csv`
                            : "kairoedge-intern-applications.csv",
                          [
                            { header: "ID", accessor: (r) => r.id },
                            { header: "Student Name", accessor: (r) => r.name },
                            { header: "Email", accessor: (r) => r.email },
                            { header: "Phone", accessor: (r) => r.phone },
                            { header: "Track", accessor: (r) => r.role_title },
                            { header: "College", accessor: (r) => r.college },
                            { header: "District", accessor: (r) => r.district || "—" },
                            { header: "Degree", accessor: (r) => r.degree },
                            { header: "Branch", accessor: (r) => r.branch },
                            { header: "Study Year", accessor: (r) => r.graduation_year },
                            { header: "Rating", accessor: (r) => r.rating || 0 },
                            { header: "Interview Date", accessor: (r) => r.interview_date || "—" },
                            { header: "Status", accessor: (r) => r.status },
                            { header: "Applied Date", accessor: (r) => r.created_at }
                          ],
                          internApplications
                        )
                      }
                    >
                      <Download size={15} />
                      <span>
                        Export CSV ({internApplications.length}
                        {internCollegeFilter !== "all" ? ` for ${internCollegeFilter.slice(0, 15)}...` : ""})
                      </span>
                    </button>
                  </div>
                </div>

                {/* Filter Toolbar */}
                <div className="admin-toolbar">
                  <div className="admin-toolbar-left">
                    <div className="admin-search-wrap">
                      <Search size={16} className="admin-search-icon" />
                      <input
                        type="text"
                        className="admin-search-input"
                        placeholder="Search student, college, degree, track..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <select
                      className="admin-filter-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Stages</option>
                      <option value="new">New</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="hired">Selected / Joined</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <select
                      className="admin-filter-select"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option value="all">All Tracks ({distinctInternTracks.length})</option>
                      {distinctInternTracks.map((t: string) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>

                    {distinctInternColleges.length > 0 && (
                      <select
                        className="admin-filter-select"
                        value={internCollegeFilter}
                        onChange={(e) => setInternCollegeFilter(e.target.value)}
                        style={{ maxWidth: "230px" }}
                      >
                        <option value="all">All Colleges ({distinctInternColleges.length})</option>
                        {distinctInternColleges.map((col: string) => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    )}

                    {distinctInternDistricts.length > 0 && (
                      <select
                        className="admin-filter-select"
                        value={internDistrictFilter}
                        onChange={(e) => setInternDistrictFilter(e.target.value)}
                      >
                        <option value="all">All Districts ({distinctInternDistricts.length})</option>
                        {distinctInternDistricts.map((d: string) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    )}

                    <select
                      className="admin-filter-select"
                      value={studyYearFilter}
                      onChange={(e) => setStudyYearFilter(e.target.value)}
                    >
                      <option value="all">All Study Years</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Graduated">Graduated / Post-Grad</option>
                    </select>

                    {(searchQuery || statusFilter !== "all" || roleFilter !== "all" || studyYearFilter !== "all" || internCollegeFilter !== "all" || internDistrictFilter !== "all") && (
                      <button
                        type="button"
                        className="admin-filter-reset-btn"
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                          setRoleFilter("all");
                          setStudyYearFilter("all");
                          setInternCollegeFilter("all");
                          setInternDistrictFilter("all");
                        }}
                        title="Clear all filters"
                      >
                        <X size={14} />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>

                  <div className="admin-toolbar-right">
                    <span style={{ fontSize: "0.85rem", color: "var(--adm-text-muted)" }}>
                      Showing <b>{internApplications.length}</b> of {(content.applications || []).filter((a: any) => a.kind === "internship").length} interns
                    </span>
                  </div>
                </div>

                {/* Candidate List Cards */}
                {internApplications.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--adm-panel)", borderRadius: "12px", border: "1px dashed var(--adm-border)" }}>
                    <GraduationCap size={40} color="var(--adm-text-faint)" style={{ margin: "0 auto 12px" }} />
                    <h3 style={{ color: "var(--adm-text-bright)", marginBottom: "4px" }}>No Internship Applications Found</h3>
                    <p style={{ color: "var(--adm-text-muted)", fontSize: "0.88rem" }}>Try adjusting your search criteria or add an intern profile</p>
                  </div>
                ) : (
                  <>
                    <div className="admin-candidate-list">
                      {paginatedInternApps.map((cand: any) => {
                        const refId = `KE-INT-2026-${String(cand.id).padStart(4, "0")}`;
                        return (
                          <div key={cand.id} className={`admin-candidate-card status-${cand.status || "new"}`}>
                            <div className="admin-candidate-header">
                              <div className="admin-candidate-profile">
                                <div className="admin-candidate-avatar intern-avatar">
                                  {cand.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="admin-candidate-main-info">
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                                    <span className="admin-candidate-name">{cand.name}</span>
                                    <span className="admin-ref-id-badge">{refId}</span>
                                    <span className="admin-candidate-role-pill intern-pill">
                                      <GraduationCap size={13} />
                                      {cand.role_title}
                                    </span>
                                    {cand.rating > 0 && (
                                      <span style={{ color: "#f59e0b", fontSize: "0.85rem" }}>
                                        {"★".repeat(cand.rating)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="admin-candidate-meta">
                                    <span className="admin-candidate-meta-item">
                                      <Mail size={13} />
                                      <a href={`mailto:${cand.email}?subject=Regarding your application for ${encodeURIComponent(cand.role_title)} at KairoEdge Technologies`}>
                                        {cand.email}
                                      </a>
                                    </span>
                                    {cand.phone && (
                                      <span className="admin-candidate-meta-item">
                                        <Phone size={13} />
                                        <a href={`tel:${cand.phone.replace(/\s+/g, "")}`}>{cand.phone}</a>
                                      </span>
                                    )}
                                    <span className="admin-candidate-meta-item">
                                      <Clock size={13} />
                                      <span>Applied: {cand.created_at ? new Date(cand.created_at).toLocaleDateString() : "Recent"}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="admin-candidate-status-group">
                                <select
                                  className={`admin-status-dropdown ${cand.status || "new"}`}
                                  value={cand.status || "new"}
                                  onChange={(e) => handleUpdateApplicationStatus(cand.id, e.target.value)}
                                >
                                  <option value="new">● New Application</option>
                                  <option value="reviewing">● Reviewing</option>
                                  <option value="shortlisted">● Shortlisted</option>
                                  <option value="interviewed">● Interviewed</option>
                                  <option value="hired">● Selected / Joined</option>
                                  <option value="rejected">● Rejected</option>
                                </select>
                              </div>
                            </div>

                            {/* Distinct College & Academic Block */}
                            <div className="admin-candidate-info-blocks">
                              <div className="admin-info-block-college">
                                <div className="admin-info-block-icon">
                                  <Building2 size={18} color="var(--adm-cyan)" />
                                </div>
                                <div className="admin-info-block-content">
                                  <div className="admin-info-block-title">College & Campus Location</div>
                                  <div className="admin-info-block-main">
                                    <strong>{cand.college || "Direct Student Application"}</strong>
                                    {cand.district && (
                                      <span className="admin-district-chip">
                                        <MapPin size={11} /> {cand.district}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="admin-info-block-academics">
                                <div className="admin-academic-chip">
                                  <span className="chip-label">Degree:</span>
                                  <span className="chip-value">{cand.degree || "—"}</span>
                                </div>
                                <div className="admin-academic-chip">
                                  <span className="chip-label">Branch:</span>
                                  <span className="chip-value">{cand.branch || "—"}</span>
                                </div>
                                <div className="admin-academic-chip highlight">
                                  <span className="chip-label">Year of Study:</span>
                                  <span className="chip-value">{cand.graduation_year || "—"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Scheduled interview banner */}
                            {cand.interview_date && (
                              <div className="admin-interview-banner">
                                <Calendar size={15} color="var(--adm-cyan)" />
                                <span>Scheduled Review / Task: <b>{cand.interview_date}</b> ({cand.interview_mode || "Online"})</span>
                              </div>
                            )}

                            {/* Pitch / Cover Note */}
                            {cand.message && (
                              <div className="admin-candidate-pitch">
                                <b style={{ color: "var(--adm-text-bright)", display: "block", marginBottom: "3px", fontSize: "0.8rem" }}>
                                  Cover Note / Motivation:
                                </b>
                                <span>{cand.message}</span>
                              </div>
                            )}

                            {/* Compact Recruiter Notes */}
                            <div className="admin-compact-notes">
                              <span className="notes-label">Mentor Remarks:</span>
                              <input
                                type="text"
                                className="admin-compact-notes-input"
                                placeholder="Click to add mentor remarks, evaluation feedback, or batch status..."
                                defaultValue={cand.notes || ""}
                                onBlur={(e) => {
                                  if (e.target.value !== (cand.notes || "")) {
                                    handleUpdateApplicationStatus(cand.id, cand.status || "new", e.target.value);
                                  }
                                }}
                              />
                            </div>

                        {/* Actions */}
                        <div className="admin-candidate-actions">
                          <div className="admin-candidate-action-links">
                            {cand.phone && (
                              <button
                                type="button"
                                className="adm-btn adm-btn-whatsapp adm-btn-sm"
                                onClick={() =>
                                  openWhatsApp(
                                    cand.phone,
                                    `Hello ${cand.name}, this is from KairoEdge Technologies regarding your application for the ${cand.role_title}. Could you let us know your availability for an introductory review?`
                                  )
                                }
                              >
                                <MessageCircle size={14} />
                                <span>WhatsApp</span>
                              </button>
                            )}
                            {cand.resume ? (
                              <>
                                <a
                                  href={cand.resume}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="adm-btn adm-btn-sec adm-btn-sm"
                                  title="Open candidate resume PDF in new tab"
                                >
                                  <Eye size={14} color="var(--adm-cyan)" />
                                  <span>View Resume</span>
                                </a>
                                <a
                                  href={cand.resume}
                                  download
                                  className="adm-btn adm-btn-sec adm-btn-sm"
                                  title="Download candidate resume file"
                                >
                                  <Download size={14} />
                                  <span>Download</span>
                                </a>
                              </>
                            ) : (
                              <span
                                className="adm-btn adm-btn-sec adm-btn-sm"
                                style={{ opacity: 0.55, cursor: "not-allowed" }}
                                title="No resume attached by candidate"
                              >
                                <FileText size={14} />
                                <span>No Resume</span>
                              </span>
                            )}
                            {cand.portfolio_url && (
                              <a
                                href={cand.portfolio_url}
                                target="_blank"
                                rel="noreferrer"
                                className="adm-btn adm-btn-sec adm-btn-sm"
                              >
                                <ExternalLink size={14} />
                                <span>GitHub / Portfolio</span>
                              </a>
                            )}
                            <a
                              href={`mailto:${cand.email}?subject=Regarding your application for ${encodeURIComponent(cand.role_title)} at KairoEdge Technologies`}
                              className="adm-btn adm-btn-sec adm-btn-sm"
                            >
                              <Mail size={14} />
                              <span>Email</span>
                            </a>
                            {cand.phone && (
                              <a
                                href={`tel:${cand.phone.replace(/\s+/g, "")}`}
                                className="adm-btn adm-btn-sec adm-btn-sm"
                              >
                                <Phone size={14} />
                                <span>Call</span>
                              </a>
                            )}
                            <button
                              type="button"
                              className="adm-btn adm-btn-sec adm-btn-sm"
                              onClick={() => setEditingCandidate({ ...cand })}
                            >
                              <Edit3 size={14} />
                              <span>Edit / Mentor</span>
                            </button>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <button
                              className="adm-btn adm-btn-sec adm-btn-sm"
                              onClick={() => setSelectedCandidate(cand)}
                            >
                              <Eye size={14} />
                              <span>View Dossier</span>
                            </button>
                            <button
                              className="adm-btn adm-btn-danger adm-btn-sm"
                              onClick={() => handleDeleteApplication(cand.id)}
                              title="Move to Recycle Bin"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                    <PaginationControls
                      currentPage={currentPage}
                      totalItems={internApplications.length}
                      pageSize={PAGE_SIZE}
                      onPageChange={setCurrentPage}
                    />
                  </>
                )}
              </div>
            )}

            {/* VIEW 5: PAGE COPY & CONTENT EDITOR (100% CHANGEABLE EVERYTHING) */}
            {activeSection === "copy" && (
              <div>
                <div className="admin-view-header">
                  <div className="admin-view-title-group">
                    <h1>Page Copy & Content Editor</h1>
                    <p>Live edit titles, headers, subtitles, promises, benefits, and descriptions for all website pages with instant frontend updates</p>
                  </div>
                  <div className="admin-view-actions">
                    <Link to="/" target="_blank" className="adm-btn adm-btn-sec">
                      <ExternalLink size={15} />
                      <span>Open Website in New Tab</span>
                    </Link>
                  </div>
                </div>

                {/* Subtabs */}
                <div className="admin-subtabs">
                  <button
                    className={`admin-subtab-btn ${activeCopyTab === "home" ? "active" : ""}`}
                    onClick={() => setActiveCopyTab("home")}
                  >
                    <span>🏠 Home Page</span>
                  </button>
                  <button
                    className={`admin-subtab-btn ${activeCopyTab === "about" ? "active" : ""}`}
                    onClick={() => setActiveCopyTab("about")}
                  >
                    <span>ℹ️ About Us</span>
                  </button>
                  <button
                    className={`admin-subtab-btn ${activeCopyTab === "services" ? "active" : ""}`}
                    onClick={() => setActiveCopyTab("services")}
                  >
                    <span>🛠️ Services</span>
                  </button>
                  <button
                    className={`admin-subtab-btn ${activeCopyTab === "careers" ? "active" : ""}`}
                    onClick={() => setActiveCopyTab("careers")}
                  >
                    <span>💼 Careers</span>
                  </button>
                  <button
                    className={`admin-subtab-btn ${activeCopyTab === "internship" ? "active" : ""}`}
                    onClick={() => setActiveCopyTab("internship")}
                  >
                    <span>🎓 Internship</span>
                  </button>
                  <button
                    className={`admin-subtab-btn ${activeCopyTab === "contact" ? "active" : ""}`}
                    onClick={() => setActiveCopyTab("contact")}
                  >
                    <span>📞 Contact Us</span>
                  </button>
                  <button
                    className={`admin-subtab-btn ${activeCopyTab === "footer" ? "active" : ""}`}
                    onClick={() => setActiveCopyTab("footer")}
                  >
                    <span>📄 Footer & Global</span>
                  </button>
                </div>

                {/* Form Container */}
                <div className="admin-settings-card">
                  <form onSubmit={handleSavePageCopy} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* HOME SUBTAB */}
                    {activeCopyTab === "home" && (
                      <>
                        <div className="admin-form-grid-2">
                          <div className="admin-field-group">
                            <label className="admin-field-label">Home Hero Kicker / Subtitle</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.home?.kicker || ""}
                              onChange={(e) => setCopyData({ ...copyData, home: { ...copyData.home, kicker: e.target.value } })}
                            />
                          </div>
                          <div className="admin-field-group">
                            <label className="admin-field-label">Home Hero Main Headline</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.home?.title || ""}
                              onChange={(e) => setCopyData({ ...copyData, home: { ...copyData.home, title: e.target.value } })}
                            />
                          </div>
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">Hero Lead Description</label>
                          <textarea
                            className="admin-input no-icon"
                            style={{ minHeight: "85px" }}
                            value={copyData.home?.lead || ""}
                            onChange={(e) => setCopyData({ ...copyData, home: { ...copyData.home, lead: e.target.value } })}
                          />
                        </div>

                        <div className="admin-form-grid-2">
                          <div className="admin-field-group">
                            <label className="admin-field-label">Primary Button Text</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.home?.primaryButton || ""}
                              onChange={(e) => setCopyData({ ...copyData, home: { ...copyData.home, primaryButton: e.target.value } })}
                            />
                          </div>
                          <div className="admin-field-group">
                            <label className="admin-field-label">Secondary Button Text</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.home?.secondaryButton || ""}
                              onChange={(e) => setCopyData({ ...copyData, home: { ...copyData.home, secondaryButton: e.target.value } })}
                            />
                          </div>
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">About Teaser Section Title on Home</label>
                          <input
                            type="text"
                            className="admin-input no-icon"
                            value={copyData.home?.aboutTitle || ""}
                            onChange={(e) => setCopyData({ ...copyData, home: { ...copyData.home, aboutTitle: e.target.value } })}
                          />
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">About Teaser Description on Home</label>
                          <textarea
                            className="admin-input no-icon"
                            style={{ minHeight: "80px" }}
                            value={copyData.home?.aboutLead || ""}
                            onChange={(e) => setCopyData({ ...copyData, home: { ...copyData.home, aboutLead: e.target.value } })}
                          />
                        </div>
                      </>
                    )}

                    {/* ABOUT SUBTAB */}
                    {activeCopyTab === "about" && (
                      <>
                        <div className="admin-form-grid-2">
                          <div className="admin-field-group">
                            <label className="admin-field-label">About Page Kicker</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.about?.kicker || ""}
                              onChange={(e) => setCopyData({ ...copyData, about: { ...copyData.about, kicker: e.target.value } })}
                            />
                          </div>
                          <div className="admin-field-group">
                            <label className="admin-field-label">About Page Title</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.about?.title || ""}
                              onChange={(e) => setCopyData({ ...copyData, about: { ...copyData.about, title: e.target.value } })}
                            />
                          </div>
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">Main About Description</label>
                          <textarea
                            className="admin-input no-icon"
                            style={{ minHeight: "85px" }}
                            value={copyData.about?.text || ""}
                            onChange={(e) => setCopyData({ ...copyData, about: { ...copyData.about, text: e.target.value } })}
                          />
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">What An Engagement Includes (Heading)</label>
                          <input
                            type="text"
                            className="admin-input no-icon"
                            value={copyData.about?.heading || ""}
                            onChange={(e) => setCopyData({ ...copyData, about: { ...copyData.about, heading: e.target.value } })}
                          />
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">Paragraph 1</label>
                          <textarea
                            className="admin-input no-icon"
                            style={{ minHeight: "75px" }}
                            value={copyData.about?.paragraph1 || ""}
                            onChange={(e) => setCopyData({ ...copyData, about: { ...copyData.about, paragraph1: e.target.value } })}
                          />
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">Paragraph 2</label>
                          <textarea
                            className="admin-input no-icon"
                            style={{ minHeight: "75px" }}
                            value={copyData.about?.paragraph2 || ""}
                            onChange={(e) => setCopyData({ ...copyData, about: { ...copyData.about, paragraph2: e.target.value } })}
                          />
                        </div>
                      </>
                    )}

                    {/* SERVICES SUBTAB */}
                    {activeCopyTab === "services" && (
                      <>
                        <div className="admin-form-grid-2">
                          <div className="admin-field-group">
                            <label className="admin-field-label">Services Page Kicker</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.services?.kicker || ""}
                              onChange={(e) => setCopyData({ ...copyData, services: { ...copyData.services, kicker: e.target.value } })}
                            />
                          </div>
                          <div className="admin-field-group">
                            <label className="admin-field-label">Services Page Headline</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.services?.title || ""}
                              onChange={(e) => setCopyData({ ...copyData, services: { ...copyData.services, title: e.target.value } })}
                            />
                          </div>
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">Services Intro Text</label>
                          <textarea
                            className="admin-input no-icon"
                            style={{ minHeight: "85px" }}
                            value={copyData.services?.text || ""}
                            onChange={(e) => setCopyData({ ...copyData, services: { ...copyData.services, text: e.target.value } })}
                          />
                        </div>
                      </>
                    )}

                    {/* CAREERS SUBTAB */}
                    {activeCopyTab === "careers" && (
                      <>
                        <div className="admin-form-grid-2">
                          <div className="admin-field-group">
                            <label className="admin-field-label">Careers Page Kicker</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.careers?.kicker || ""}
                              onChange={(e) => setCopyData({ ...copyData, careers: { ...copyData.careers, kicker: e.target.value } })}
                            />
                          </div>
                          <div className="admin-field-group">
                            <label className="admin-field-label">Careers Headline</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.careers?.title || ""}
                              onChange={(e) => setCopyData({ ...copyData, careers: { ...copyData.careers, title: e.target.value } })}
                            />
                          </div>
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">Careers Subtitle / Intro Text</label>
                          <textarea
                            className="admin-input no-icon"
                            style={{ minHeight: "80px" }}
                            value={copyData.careers?.text || ""}
                            onChange={(e) => setCopyData({ ...copyData, careers: { ...copyData.careers, text: e.target.value } })}
                          />
                        </div>

                        <div className="admin-form-grid-2">
                          <div className="admin-field-group">
                            <label className="admin-field-label">Full-Time Jobs Label</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.careers?.jobsLabel || ""}
                              onChange={(e) => setCopyData({ ...copyData, careers: { ...copyData.careers, jobsLabel: e.target.value } })}
                            />
                          </div>
                          <div className="admin-field-group">
                            <label className="admin-field-label">Internship Label on Careers</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.careers?.internshipLabel || ""}
                              onChange={(e) => setCopyData({ ...copyData, careers: { ...copyData.careers, internshipLabel: e.target.value } })}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* INTERNSHIP SUBTAB */}
                    {activeCopyTab === "internship" && (
                      <>
                        <div className="admin-form-grid-2">
                          <div className="admin-field-group">
                            <label className="admin-field-label">Internship Page Title</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.internship?.title || "Internship program"}
                              onChange={(e) => setCopyData({ ...copyData, internship: { ...copyData.internship, title: e.target.value } })}
                            />
                          </div>
                          <div className="admin-field-group">
                            <label className="admin-field-label">Tracks Section Subheading</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.internship?.subheading || "Choose your track"}
                              onChange={(e) => setCopyData({ ...copyData, internship: { ...copyData.internship, subheading: e.target.value } })}
                            />
                          </div>
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">Internship Program Subtitle</label>
                          <textarea
                            className="admin-input no-icon"
                            style={{ minHeight: "75px" }}
                            value={copyData.internship?.text || ""}
                            onChange={(e) => setCopyData({ ...copyData, internship: { ...copyData.internship, text: e.target.value } })}
                          />
                        </div>

                        <div className="admin-form-grid-2">
                          <div className="admin-field-group">
                            <label className="admin-field-label">Program Duration</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.internship?.duration || "3 to 6 months"}
                              onChange={(e) => setCopyData({ ...copyData, internship: { ...copyData.internship, duration: e.target.value } })}
                            />
                          </div>
                          <div className="admin-field-group">
                            <label className="admin-field-label">Eligibility Criteria</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.internship?.eligibility || "Final-year or recent BE, BTech, BCA, MCA or BSc (IT/CS/Cloud/AI) students"}
                              onChange={(e) => setCopyData({ ...copyData, internship: { ...copyData.internship, eligibility: e.target.value } })}
                            />
                          </div>
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">What Every Intern Gets (Benefits Heading)</label>
                          <input
                            type="text"
                            className="admin-input no-icon"
                            value={copyData.internship?.benefitsTitle || "What every intern gets"}
                            onChange={(e) => setCopyData({ ...copyData, internship: { ...copyData.internship, benefitsTitle: e.target.value } })}
                          />
                        </div>
                      </>
                    )}

                    {/* CONTACT SUBTAB */}
                    {activeCopyTab === "contact" && (
                      <>
                        <div className="admin-form-grid-2">
                          <div className="admin-field-group">
                            <label className="admin-field-label">Contact Page Kicker</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.contact?.kicker || ""}
                              onChange={(e) => setCopyData({ ...copyData, contact: { ...copyData.contact, kicker: e.target.value } })}
                            />
                          </div>
                          <div className="admin-field-group">
                            <label className="admin-field-label">Contact Headline</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.contact?.title || ""}
                              onChange={(e) => setCopyData({ ...copyData, contact: { ...copyData.contact, title: e.target.value } })}
                            />
                          </div>
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">Contact Lead Text</label>
                          <textarea
                            className="admin-input no-icon"
                            style={{ minHeight: "80px" }}
                            value={copyData.contact?.text || ""}
                            onChange={(e) => setCopyData({ ...copyData, contact: { ...copyData.contact, text: e.target.value } })}
                          />
                        </div>

                        <div className="admin-form-grid-2">
                          <div className="admin-field-group">
                            <label className="admin-field-label">Primary Contact Email</label>
                            <input
                              type="email"
                              className="admin-input no-icon"
                              value={copyData.contact?.email || ""}
                              onChange={(e) => setCopyData({ ...copyData, contact: { ...copyData.contact, email: e.target.value } })}
                            />
                          </div>
                          <div className="admin-field-group">
                            <label className="admin-field-label">Phone Helpline</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.contact?.phone || ""}
                              onChange={(e) => setCopyData({ ...copyData, contact: { ...copyData.contact, phone: e.target.value } })}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* FOOTER & GLOBAL SUBTAB */}
                    {activeCopyTab === "footer" && (
                      <>
                        <div className="admin-form-grid-2">
                          <div className="admin-field-group">
                            <label className="admin-field-label">Company Legal Name</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.footer?.company || ""}
                              onChange={(e) => setCopyData({ ...copyData, footer: { ...copyData.footer, company: e.target.value } })}
                            />
                          </div>
                          <div className="admin-field-group">
                            <label className="admin-field-label">Company Brand Tagline</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.footer?.tagline || ""}
                              onChange={(e) => setCopyData({ ...copyData, footer: { ...copyData.footer, tagline: e.target.value } })}
                            />
                          </div>
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">Footer Overview Blurb</label>
                          <textarea
                            className="admin-input no-icon"
                            style={{ minHeight: "80px" }}
                            value={copyData.footer?.blurb || ""}
                            onChange={(e) => setCopyData({ ...copyData, footer: { ...copyData.footer, blurb: e.target.value } })}
                          />
                        </div>

                        <div className="admin-form-grid-2">
                          <div className="admin-field-group">
                            <label className="admin-field-label">Footer Email</label>
                            <input
                              type="email"
                              className="admin-input no-icon"
                              value={copyData.footer?.email || ""}
                              onChange={(e) => setCopyData({ ...copyData, footer: { ...copyData.footer, email: e.target.value } })}
                            />
                          </div>
                          <div className="admin-field-group">
                            <label className="admin-field-label">Footer Operating Hours</label>
                            <input
                              type="text"
                              className="admin-input no-icon"
                              value={copyData.footer?.hours || ""}
                              onChange={(e) => setCopyData({ ...copyData, footer: { ...copyData.footer, hours: e.target.value } })}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                      <button type="submit" className="adm-btn adm-btn-pri" disabled={isSavingCopy} style={{ padding: "12px 24px" }}>
                        <CheckCircle2 size={16} />
                        <span>{isSavingCopy ? "Saving & Syncing..." : "Save Page Copy Changes & Sync Live"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* VIEW 6: CONTACT INFO & COMPANY SETTINGS */}
            {activeSection === "contact_info" && (
              <div>
                <div className="admin-view-header">
                  <div className="admin-view-title-group">
                    <h1>Contact Info & Company Coordinates</h1>
                    <p>Live company coordinates, office location, helpline numbers, and emails synced in real-time across the entire website</p>
                  </div>
                  <div className="admin-view-actions">
                    <Link to="/contact" target="_blank" className="adm-btn adm-btn-sec">
                      <ExternalLink size={15} />
                      <span>Preview Live Contact Page</span>
                    </Link>
                  </div>
                </div>

                <div className="admin-contact-settings-grid">
                  {/* Left: Interactive Form */}
                  <div className="admin-settings-card">
                    <div className="admin-settings-card-header">
                      <h2>
                        <Phone size={18} color="var(--adm-cyan)" />
                        Company Coordinates
                      </h2>
                      <p>Changes saved here immediately update the Contact page, Footer, and Home section.</p>
                    </div>

                    <form onSubmit={handleSaveContactSettings} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="admin-field-group">
                          <label className="admin-field-label">Primary Inquiries Email</label>
                          <div className="admin-input-wrap">
                            <span className="admin-input-icon"><Mail size={16} /></span>
                            <input
                              type="email"
                              className="admin-input"
                              value={contactForm.email}
                              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">Careers & HR Email</label>
                          <div className="admin-input-wrap">
                            <span className="admin-input-icon"><Briefcase size={16} /></span>
                            <input
                              type="email"
                              className="admin-input"
                              value={contactForm.careersEmail}
                              onChange={(e) => setContactForm({ ...contactForm, careersEmail: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="admin-field-group">
                          <label className="admin-field-label">Primary Phone / Helpline</label>
                          <div className="admin-input-wrap">
                            <span className="admin-input-icon"><Phone size={16} /></span>
                            <input
                              type="text"
                              className="admin-input"
                              value={contactForm.phone}
                              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">Alternate Phone / WhatsApp</label>
                          <div className="admin-input-wrap">
                            <span className="admin-input-icon"><Phone size={16} /></span>
                            <input
                              type="text"
                              className="admin-input"
                              value={contactForm.altPhone}
                              onChange={(e) => setContactForm({ ...contactForm, altPhone: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Physical Office Address / Location</label>
                        <div className="admin-input-wrap">
                          <span className="admin-input-icon"><MapPin size={16} /></span>
                          <input
                            type="text"
                            className="admin-input"
                            value={contactForm.place}
                            onChange={(e) => setContactForm({ ...contactForm, place: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Working Hours & Availability</label>
                        <div className="admin-input-wrap">
                          <span className="admin-input-icon"><Clock size={16} /></span>
                          <input
                            type="text"
                            className="admin-input"
                            value={contactForm.hours}
                            onChange={(e) => setContactForm({ ...contactForm, hours: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Legal Company Entity Name</label>
                        <div className="admin-input-wrap">
                          <span className="admin-input-icon"><Building2 size={16} /></span>
                          <input
                            type="text"
                            className="admin-input"
                            value={contactForm.company}
                            onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Company Tagline / Overview Note</label>
                        <textarea
                          className="admin-input"
                          style={{ minHeight: "70px", resize: "vertical", paddingLeft: "14px" }}
                          value={contactForm.tagline}
                          onChange={(e) => setContactForm({ ...contactForm, tagline: e.target.value })}
                        />
                      </div>

                      <button type="submit" className="adm-btn adm-btn-pri" disabled={isSavingContact} style={{ padding: "12px", justifyContent: "center" }}>
                        <CheckCircle2 size={16} />
                        <span>{isSavingContact ? "Saving & Syncing..." : "Save & Sync to Live Website"}</span>
                      </button>
                    </form>
                  </div>

                  {/* Right: Real-time Live Preview Card */}
                  <div className="admin-preview-card">
                    <span className="admin-preview-badge">Live Website Preview Mockup</span>
                    <h3 style={{ fontFamily: "Manrope", fontSize: "1.25rem", color: "var(--adm-text-bright)", fontWeight: 800 }}>
                      {contactForm.company}
                    </h3>
                    <p style={{ color: "var(--adm-text-muted)", fontSize: "0.88rem", marginTop: "-10px" }}>
                      {contactForm.tagline}
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "10px" }}>
                      <div className="admin-preview-item">
                        <div className="admin-preview-icon"><MapPin size={16} /></div>
                        <div className="admin-preview-text">
                          <small>Office Location</small>
                          <b>{contactForm.place}</b>
                        </div>
                      </div>

                      <div className="admin-preview-item">
                        <div className="admin-preview-icon"><Clock size={16} /></div>
                        <div className="admin-preview-text">
                          <small>Working Hours</small>
                          <b>{contactForm.hours}</b>
                        </div>
                      </div>

                      <div className="admin-preview-item">
                        <div className="admin-preview-icon"><Mail size={16} /></div>
                        <div className="admin-preview-text">
                          <small>Inquiries Email</small>
                          <b>{contactForm.email}</b>
                        </div>
                      </div>

                      <div className="admin-preview-item">
                        <div className="admin-preview-icon"><Briefcase size={16} /></div>
                        <div className="admin-preview-text">
                          <small>Careers / Talent Email</small>
                          <b>{contactForm.careersEmail}</b>
                        </div>
                      </div>

                      <div className="admin-preview-item">
                        <div className="admin-preview-icon"><Phone size={16} /></div>
                        <div className="admin-preview-text">
                          <small>Helpline & Direct Line</small>
                          <b>{contactForm.phone} {contactForm.altPhone && `· ${contactForm.altPhone}`}</b>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: "14px", background: "rgba(3, 14, 24, 0.5)", borderRadius: "8px", border: "1px dashed var(--adm-border)", fontSize: "0.8rem", color: "var(--adm-text-muted)" }}>
                      💡 Notice: When you click <b>Save & Sync</b>, this configuration is updated in MySQL and immediately propagated to <code>/contact</code>, <code>/home</code>, and <code>Footer</code> without restarting the server!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 7: CAMPUS COLLEGES */}
            {activeSection === "colleges" && (
              <div>
                <div className="admin-view-header">
                  <div className="admin-view-title-group">
                    <h1>Campus Colleges Management</h1>
                    <p>Manage partnering engineering colleges and institutes in Pune and Maharashtra for campus placements</p>
                  </div>
                  <div className="admin-view-actions">
                    <button
                      className="adm-btn adm-btn-sec"
                      onClick={handleSeedColleges}
                      disabled={seedingColleges}
                      style={{ background: "rgba(14, 165, 233, 0.08)", borderColor: "rgba(14, 165, 233, 0.3)", color: "#0284c7", fontWeight: 700 }}
                      title="Automatically populate 50+ top colleges across Maharashtra districts (Pune, Ahilyanagar, Mumbai, Nashik, Sambhajinagar, etc.)"
                    >
                      <Sparkles size={15} />
                      <span>{seedingColleges ? "Seeding Colleges..." : "⚡ Auto-Seed Maharashtra Colleges"}</span>
                    </button>
                    <button className="adm-btn adm-btn-pri" onClick={() => handleOpenItemModal("colleges")}>
                      <Plus size={16} />
                      <span>Add Campus College</span>
                    </button>
                    <button
                      className="adm-btn adm-btn-sec"
                      onClick={() =>
                        exportToCsv(
                          "kairoedge-all-campus-colleges.csv",
                          [
                            { header: "ID", accessor: (r) => r.id },
                            { header: "College Name", accessor: (r) => r.name },
                            { header: "Code", accessor: (r) => r.code || "—" },
                            { header: "District", accessor: (r) => r.district || r.city || "Pune" },
                            { header: "City", accessor: (r) => r.city || "—" },
                            { header: "State", accessor: (r) => r.state || "Maharashtra" },
                            { header: "Active in Form", accessor: (r) => (r.is_active ? "Yes" : "No") },
                            {
                              header: "Applicants Count",
                              accessor: (r) =>
                                (content.applications || []).filter(
                                  (a: any) => a.kind === "internship" && a.college && a.college.toLowerCase() === r.name.toLowerCase()
                                ).length
                            }
                          ],
                          filteredColleges
                        )
                      }
                      title="Export all campus colleges list to CSV"
                    >
                      <Download size={15} />
                      <span>Export Colleges CSV ({filteredColleges.length})</span>
                    </button>
                  </div>
                </div>

                {/* Colleges Filter Toolbar */}
                <div className="admin-toolbar">
                  <div className="admin-toolbar-left">
                    <div className="admin-search-wrap">
                      <Search size={16} className="admin-search-icon" />
                      <input
                        type="text"
                        className="admin-search-input"
                        placeholder="Search college name, code, district, city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <select
                      className="admin-filter-select"
                      value={collegeCityFilter}
                      onChange={(e) => setCollegeCityFilter(e.target.value)}
                    >
                      <option value="all">All Districts ({distinctCollegeDistricts.length})</option>
                      {distinctCollegeDistricts.map((dist) => (
                        <option key={dist} value={dist}>{dist} District</option>
                      ))}
                    </select>

                    <select
                      className="admin-filter-select"
                      value={collegeStatusFilter}
                      onChange={(e) => setCollegeStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active in Form ({activeCollegesCount})</option>
                      <option value="inactive">Disabled in Form</option>
                    </select>

                    {(searchQuery || collegeCityFilter !== "all" || collegeStatusFilter !== "all") && (
                      <button
                        type="button"
                        className="admin-filter-reset-btn"
                        onClick={() => {
                          setSearchQuery("");
                          setCollegeCityFilter("all");
                          setCollegeStatusFilter("all");
                        }}
                        title="Clear all filters"
                      >
                        <X size={14} />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>

                  <div className="admin-toolbar-right">
                    <span style={{ fontSize: "0.85rem", color: "var(--adm-text-muted)" }}>
                      Showing <b>{filteredColleges.length}</b> of {content.colleges?.length || 0} colleges
                    </span>
                  </div>
                </div>

                <div className="admin-table-container">
                  <div className="admin-table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>College / Institute Name</th>
                          <th>Code</th>
                          <th>District</th>
                          <th>City</th>
                          <th>Student Applicants</th>
                          <th>Active in Form</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredColleges.length > 0 ? (
                          paginatedColleges.map((col: any) => {
                            const collegeApplicants = (content.applications || []).filter(
                              (app: any) =>
                                app.kind === "internship" &&
                                app.college &&
                                app.college.toLowerCase() === col.name.toLowerCase()
                            );
                            return (
                              <tr key={col.id}>
                                <td><span className="admin-ref-id-badge">#COL-{String(col.id).padStart(4, "0")}</span></td>
                                <td style={{ fontWeight: 600, color: "var(--adm-text-bright)" }}>{col.name}</td>
                                <td><span className="admin-table-badge cyan">{col.code || "—"}</span></td>
                                <td><span className="admin-table-badge slate">{col.district || col.city || "Pune"}</span></td>
                                <td>{col.city || "—"}</td>
                                <td>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span className={`admin-table-badge ${collegeApplicants.length > 0 ? "cyan" : "slate"}`}>
                                      {collegeApplicants.length}
                                    </span>
                                    {collegeApplicants.length > 0 && (
                                      <button
                                        type="button"
                                        className="adm-btn adm-btn-sec adm-btn-sm"
                                        style={{ padding: "2px 7px", fontSize: "0.72rem", height: "26px" }}
                                        onClick={() =>
                                          exportToCsv(
                                            `${(col.code || col.name).slice(0, 24).replace(/[^a-z0-9]/gi, "-")}-applicants.csv`,
                                            [
                                              { header: "ID", accessor: (r) => r.id },
                                              { header: "Student Name", accessor: (r) => r.name },
                                              { header: "Email", accessor: (r) => r.email },
                                              { header: "Phone", accessor: (r) => r.phone },
                                              { header: "Track", accessor: (r) => r.role_title },
                                              { header: "College", accessor: (r) => r.college },
                                              { header: "District", accessor: (r) => r.district || col.district || col.city },
                                              { header: "Degree", accessor: (r) => r.degree },
                                              { header: "Branch", accessor: (r) => r.branch },
                                              { header: "Study Year", accessor: (r) => r.graduation_year },
                                              { header: "Rating", accessor: (r) => r.rating || 0 },
                                              { header: "Status", accessor: (r) => r.status },
                                              { header: "Applied Date", accessor: (r) => r.created_at }
                                            ],
                                            collegeApplicants
                                          )
                                        }
                                        title={`Export ${collegeApplicants.length} applicants from ${col.name} to CSV`}
                                      >
                                        <Download size={11} />
                                        <span>Export</span>
                                      </button>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <label className="admin-toggle-switch" title={col.is_active ? "Click to deactivate" : "Click to activate"}>
                                    <input
                                      type="checkbox"
                                      checked={Boolean(col.is_active)}
                                      onChange={() => handleToggleCollege(col.id)}
                                    />
                                    <span className="admin-toggle-slider"></span>
                                  </label>
                                </td>
                                <td>
                                  <div className="admin-table-actions">
                                    <button
                                      className="admin-action-btn"
                                      onClick={() => handleOpenItemModal("colleges", col)}
                                      title="Edit College"
                                    >
                                      <Edit3 size={14} />
                                    </button>
                                    <button
                                      className="admin-action-btn delete"
                                      onClick={() => handleDeleteItem("colleges", col.id, col.name)}
                                      title="Delete"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={8} style={{ textAlign: "center", padding: "48px 20px" }}>
                              <div style={{ maxWidth: "460px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(14, 165, 233, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0ea5e9" }}>
                                  <GraduationCap size={28} />
                                </div>
                                <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--adm-text-bright)" }}>
                                  {(content.colleges || []).length === 0 ? "No campus colleges in database yet" : "No campus colleges match your filter"}
                                </div>
                                <p style={{ color: "var(--adm-text-muted)", fontSize: "0.88rem", margin: 0, lineHeight: 1.5 }}>
                                  {(content.colleges || []).length === 0
                                    ? "Populate 50+ top engineering colleges across Pune, Ahilyanagar, Mumbai, Nashik, Sambhajinagar, and Maharashtra with one click."
                                    : "Try clearing search keywords or district filters to view all colleges."}
                                </p>
                                {(content.colleges || []).length === 0 ? (
                                  <button
                                    type="button"
                                    className="adm-btn adm-btn-pri"
                                    onClick={handleSeedColleges}
                                    disabled={seedingColleges}
                                    style={{ marginTop: "6px" }}
                                  >
                                    <Sparkles size={16} />
                                    <span>{seedingColleges ? "Seeding Colleges..." : "⚡ Populate 50+ Maharashtra Colleges Now"}</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="adm-btn adm-btn-sec adm-btn-sm"
                                    onClick={() => { setSearchQuery(""); setCollegeCityFilter("all"); setCollegeStatusFilter("all"); }}
                                  >
                                    Clear Filters
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <PaginationControls
                    currentPage={currentPage}
                    totalItems={filteredColleges.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            )}

            {/* VIEW 8: GENERIC CONTENT TABLES (Jobs, Services, Projects, Tech, etc.) */}
            {tableSchemas[activeSection] && activeSection !== "colleges" && (
              <div>
                <div className="admin-view-header">
                  <div className="admin-view-title-group">
                    <h1>{tableSchemas[activeSection].label}</h1>
                    <p>Create, update, or remove live website records with instant frontend synchronization</p>
                  </div>
                  <div className="admin-view-actions">
                    <button className="adm-btn adm-btn-pri" onClick={() => handleOpenItemModal(activeSection)}>
                      <Plus size={16} />
                      <span>Add New {tableSchemas[activeSection].label.slice(0, -1) || "Item"}</span>
                    </button>
                  </div>
                </div>

                {/* Generic Table Filter Toolbar */}
                <div className="admin-toolbar">
                  <div className="admin-toolbar-left">
                    <div className="admin-search-wrap">
                      <Search size={16} className="admin-search-icon" />
                      <input
                        type="text"
                        className="admin-search-input"
                        placeholder={`Search in ${tableSchemas[activeSection].label}...`}
                        value={genericSearchQuery}
                        onChange={(e) => setGenericSearchQuery(e.target.value)}
                      />
                    </div>
                    {genericSearchQuery && (
                      <button
                        type="button"
                        className="admin-filter-reset-btn"
                        onClick={() => setGenericSearchQuery("")}
                        title="Clear search"
                      >
                        <X size={14} />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                  <div className="admin-toolbar-right">
                    <span style={{ fontSize: "0.85rem", color: "var(--adm-text-muted)" }}>
                      Total <b>{filteredGenericItems.length}</b> records
                    </span>
                  </div>
                </div>

                <div className="admin-table-container">
                  <div className="admin-table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          {tableSchemas[activeSection].fields.slice(0, 4).map((f) => (
                            <th key={f.name}>{f.label}</th>
                          ))}
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGenericItems.length > 0 ? (
                          paginatedGenericItems.map((item: any) => (
                            <tr key={item.id}>
                              <td><span className="admin-ref-id-badge">#{String(item.id).padStart(3, "0")}</span></td>
                              {tableSchemas[activeSection].fields.slice(0, 4).map((f) => {
                                const val = item[f.name];
                                if (f.type === "image") {
                                  return (
                                    <td key={f.name}>
                                      {val ? (
                                        <img src={val} alt="preview" style={{ width: "38px", height: "38px", objectFit: "cover", borderRadius: "6px" }} />
                                      ) : (
                                        "—"
                                      )}
                                    </td>
                                  );
                                }
                                if (f.type === "tags") {
                                  const arr = Array.isArray(val) ? val : [];
                                  return (
                                    <td key={f.name}>
                                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", maxWidth: "240px" }}>
                                        {arr.slice(0, 3).map((t: string, i: number) => (
                                          <span key={i} className="admin-table-badge cyan" style={{ fontSize: "0.7rem" }}>{t}</span>
                                        ))}
                                        {arr.length > 3 && <span style={{ fontSize: "0.7rem", color: "var(--adm-text-muted)" }}>+{arr.length - 3}</span>}
                                      </div>
                                    </td>
                                  );
                                }
                                return (
                                  <td key={f.name} style={{ maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {val ?? "—"}
                                  </td>
                                );
                              })}
                              <td>
                                <div className="admin-table-actions">
                                  <button
                                    className="admin-action-btn"
                                    onClick={() => handleOpenItemModal(activeSection, item)}
                                    title="Edit"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    className="admin-action-btn delete"
                                    onClick={() => handleDeleteItem(activeSection, item.id, item.title || item.name)}
                                    title="Delete"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={tableSchemas[activeSection].fields.slice(0, 4).length + 2} style={{ textAlign: "center", padding: "40px 20px", color: "var(--adm-text-muted)" }}>
                              No records match your search criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <PaginationControls
                    currentPage={currentPage}
                    totalItems={filteredGenericItems.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            )}

            {/* VIEW 9: RECYCLE BIN & SAFETY */}
            {activeSection === "recycle_bin" && (
              <div>
                <div className="admin-view-header">
                  <div className="admin-view-title-group">
                    <h1>Recycle Bin & Safety Vault</h1>
                    <p>Protected deleted records (candidates, inquiries, services, jobs). Restore anytime with 1-click!</p>
                  </div>
                  <div className="admin-view-actions">
                    <button
                      className="adm-btn adm-btn-danger adm-btn-sm"
                      onClick={async () => {
                        if (!window.confirm("Empty the entire Recycle Bin? All deleted items will be purged permanently.")) return;
                        await fetch("/api/admin/recycle-bin", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
                        showToast("Recycle bin emptied.");
                        fetchData();
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Empty Recycle Bin</span>
                    </button>
                  </div>
                </div>

                <div className="admin-table-container">
                  <div className="admin-table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Recycle ID</th>
                          <th>Original Section</th>
                          <th>Item Title / Candidate</th>
                          <th>Deleted On</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(content.recycleBin || []).length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--adm-text-muted)" }}>
                              Recycle Bin is empty. No deleted records.
                            </td>
                          </tr>
                        ) : (
                          paginatedRecycleBin.map((r: any) => (
                            <tr key={r.id}>
                              <td style={{ color: "var(--adm-text-faint)", fontFamily: "monospace" }}>#{r.id}</td>
                              <td><span className="admin-table-badge cyan">{r.original_table}</span></td>
                              <td style={{ fontWeight: 600, color: "var(--adm-text-bright)" }}>{r.title}</td>
                              <td>{r.deleted_at ? new Date(r.deleted_at).toLocaleString() : "—"}</td>
                              <td>
                                <div className="admin-table-actions">
                                  <button
                                    className="adm-btn adm-btn-sec adm-btn-sm"
                                    onClick={() => handleRestoreRecycle(r.id)}
                                    title="Restore back to live site"
                                  >
                                    <RefreshCw size={13} />
                                    <span>Restore</span>
                                  </button>
                                  <button
                                    className="admin-action-btn delete"
                                    onClick={() => handlePurgeRecycle(r.id)}
                                    title="Purge permanently"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <PaginationControls
                    currentPage={currentPage}
                    totalItems={(content.recycleBin || []).length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            )}

            {/* VIEW 10: SUB-ADMINS & ROLES */}
            {activeSection === "subadmins" && (
              <div>
                <div className="admin-view-header">
                  <div className="admin-view-title-group">
                    <h1>Sub-Admins & Role Control</h1>
                    <p>Delegate recruitment, leads management, and website updates to specialized team members</p>
                  </div>
                  <div className="admin-view-actions">
                    <button className="adm-btn adm-btn-pri" onClick={() => setShowSubAdminModal(true)}>
                      <Plus size={16} />
                      <span>Create Sub-Admin Account</span>
                    </button>
                  </div>
                </div>

                {/* Subadmins Filter Toolbar */}
                <div className="admin-toolbar">
                  <div className="admin-toolbar-left">
                    <div className="admin-search-wrap">
                      <Search size={16} className="admin-search-icon" />
                      <input
                        type="text"
                        className="admin-search-input"
                        placeholder="Search sub-admin by username, email, role..."
                        value={subadminSearchQuery}
                        onChange={(e) => setSubadminSearchQuery(e.target.value)}
                      />
                    </div>

                    <select
                      className="admin-filter-select"
                      value={subadminRoleFilter}
                      onChange={(e) => setSubadminRoleFilter(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      <option value="superadmin">Superadmin</option>
                      <option value="Talent HR / Recruiter">Talent HR / Recruiter</option>
                      <option value="Sales / Lead Manager">Sales / Lead Manager</option>
                      <option value="Content Editor">Content Editor</option>
                    </select>

                    {(subadminSearchQuery || subadminRoleFilter !== "all") && (
                      <button
                        type="button"
                        className="admin-filter-reset-btn"
                        onClick={() => {
                          setSubadminSearchQuery("");
                          setSubadminRoleFilter("all");
                        }}
                        title="Clear all filters"
                      >
                        <X size={14} />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>
                  <div className="admin-toolbar-right">
                    <span style={{ fontSize: "0.85rem", color: "var(--adm-text-muted)" }}>
                      Showing <b>{filteredSubadmins.length}</b> of {(content.subadmins || []).length} team accounts
                    </span>
                  </div>
                </div>

                <div className="admin-table-container">
                  <div className="admin-table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Assigned Role</th>
                          <th>Access Permissions</th>
                          <th>Status</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubadmins.length > 0 ? (
                          paginatedSubadmins.map((sub: any) => (
                            <tr key={sub.id}>
                              <td><span className="admin-ref-id-badge">#ADM-{String(sub.id).padStart(3, "0")}</span></td>
                              <td style={{ fontWeight: 600, color: "var(--adm-text-bright)" }}>{sub.username}</td>
                              <td>{sub.email}</td>
                              <td><span className="admin-table-badge cyan">{sub.role}</span></td>
                              <td>
                                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                  {(sub.permissions || []).map((p: string, i: number) => (
                                    <span key={i} className="admin-table-badge slate">{p}</span>
                                  ))}
                                </div>
                              </td>
                              <td>
                                <span className={`admin-table-badge ${sub.is_active ? "emerald" : "slate"}`}>
                                  {sub.is_active ? "Active" : "Disabled"}
                                </span>
                              </td>
                              <td>{sub.created_at ? new Date(sub.created_at).toLocaleDateString() : "—"}</td>
                              <td>
                                <div className="admin-table-actions">
                                  <button
                                    className="admin-action-btn"
                                    onClick={() => {
                                      setEditingSubAdmin({
                                        ...sub,
                                        permissions: Array.isArray(sub.permissions) ? [...sub.permissions] : []
                                      });
                                      setEditSubAdminPassword("");
                                    }}
                                    title="Edit sub-admin details, permissions & password"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  {sub.role !== "superadmin" && sub.username !== "admin" && (
                                    <>
                                      <button
                                        className="admin-action-btn"
                                        onClick={() => handleToggleSubAdmin(sub.id, sub.username)}
                                        title={sub.is_active ? "Deactivate account" : "Activate account"}
                                        style={{ color: sub.is_active ? "#10b981" : "#94a3b8" }}
                                      >
                                        <CheckCircle2 size={14} />
                                      </button>
                                      <button
                                        className="admin-action-btn delete"
                                        onClick={() => handleDeleteSubAdmin(sub.id, sub.username)}
                                        title="Delete sub-admin account"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "var(--adm-text-muted)" }}>
                              No sub-admin accounts match your search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <PaginationControls
                    currentPage={currentPage}
                    totalItems={filteredSubadmins.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ==========================================================================
          LEAD CREATE / EDIT MODAL
          ========================================================================== */}
      {editingLead && (
        <div className="admin-modal-backdrop" onClick={() => setEditingLead(null)}>
          <div className="admin-modal wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingLead.id ? `Edit Lead #${editingLead.id}` : "Log New Client Lead / Inquiry"}</h2>
              <button className="admin-modal-close-btn" onClick={() => setEditingLead(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLead}>
              <div className="admin-modal-body">
                <div className="admin-form-grid-2">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Client / Contact Name *</label>
                    <input
                      type="text"
                      className="admin-input no-icon"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={editingLead.name || ""}
                      onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">Company / Organization</label>
                    <input
                      type="text"
                      className="admin-input no-icon"
                      placeholder="e.g. Apex Health Logistics"
                      value={editingLead.company || ""}
                      onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Phone / WhatsApp Number</label>
                    <input
                      type="text"
                      className="admin-input no-icon"
                      placeholder="+91 98220 12345"
                      value={editingLead.phone || ""}
                      onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">Email Address</label>
                    <input
                      type="email"
                      className="admin-input no-icon"
                      placeholder="rahul@company.com"
                      value={editingLead.email || ""}
                      onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-grid-3">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Pipeline Status</label>
                    <select
                      className="admin-input no-icon"
                      value={editingLead.status || "new"}
                      onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value })}
                    >
                      <option value="new">● New Lead</option>
                      <option value="contacted">● Contacted</option>
                      <option value="in_discussion">● In Discussion</option>
                      <option value="proposal_sent">● Proposal Sent</option>
                      <option value="negotiation">● Negotiation</option>
                      <option value="won">● Won / Converted</option>
                      <option value="lost">● Closed / Lost</option>
                    </select>
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">Lead Priority</label>
                    <select
                      className="admin-input no-icon"
                      value={editingLead.priority || "medium"}
                      onChange={(e) => setEditingLead({ ...editingLead, priority: e.target.value })}
                    >
                      <option value="hot">🔥 Hot Priority</option>
                      <option value="medium">⚡ Medium Priority</option>
                      <option value="low">❄️ Low Priority</option>
                    </select>
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">Lead Source</label>
                    <select
                      className="admin-input no-icon"
                      value={editingLead.source || "Website"}
                      onChange={(e) => setEditingLead({ ...editingLead, source: e.target.value })}
                    >
                      <option value="Website">Website Form</option>
                      <option value="Direct Call">Direct Phone Call</option>
                      <option value="WhatsApp">WhatsApp Inquiry</option>
                      <option value="LinkedIn">LinkedIn Outreach</option>
                      <option value="Referral">Client Referral</option>
                      <option value="Meeting">In-Person Meeting</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Service Requested</label>
                    <input
                      type="text"
                      className="admin-input no-icon"
                      placeholder="e.g. Cloud & DevOps, Custom Software, AI"
                      value={editingLead.service || ""}
                      onChange={(e) => setEditingLead({ ...editingLead, service: e.target.value })}
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">Estimated Budget / Deal Value</label>
                    <input
                      type="text"
                      className="admin-input no-icon"
                      placeholder="e.g. ₹5 Lakhs - ₹15 Lakhs"
                      value={editingLead.budget || ""}
                      onChange={(e) => setEditingLead({ ...editingLead, budget: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">Next Scheduled Follow-up Date</label>
                  <input
                    type="date"
                    className="admin-input no-icon"
                    value={editingLead.follow_up_date || ""}
                    onChange={(e) => setEditingLead({ ...editingLead, follow_up_date: e.target.value })}
                  />
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">Project Requirements / Client Message</label>
                  <textarea
                    className="admin-input no-icon"
                    style={{ minHeight: "85px" }}
                    placeholder="Describe client requirements, objectives, scope..."
                    value={editingLead.message || ""}
                    onChange={(e) => setEditingLead({ ...editingLead, message: e.target.value })}
                  />
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">Internal Sales Notes & Conversation Log</label>
                  <textarea
                    className="admin-notes-textarea"
                    style={{ minHeight: "80px" }}
                    placeholder="Add meeting notes, agreed terms, proposal link..."
                    value={editingLead.notes || ""}
                    onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="adm-btn adm-btn-sec" onClick={() => setEditingLead(null)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn-pri" disabled={isSavingLead}>
                  <CheckCircle2 size={16} />
                  <span>{isSavingLead ? "Saving..." : "Save Lead"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================================
          CANDIDATE CREATE / EDIT MODAL
          ========================================================================== */}
      {editingCandidate && (
        <div className="admin-modal-backdrop" onClick={() => setEditingCandidate(null)}>
          <div className="admin-modal wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>
                {editingCandidate.id
                  ? `Edit Candidate #${editingCandidate.id} · ${editingCandidate.name}`
                  : `Add ${editingCandidate.kind === "internship" ? "Internship" : "Job"} Candidate`}
              </h2>
              <button className="admin-modal-close-btn" onClick={() => setEditingCandidate(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCandidate}>
              <div className="admin-modal-body">
                <div className="admin-form-grid-2">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Candidate Name *</label>
                    <input
                      type="text"
                      className="admin-input no-icon"
                      required
                      value={editingCandidate.name || ""}
                      onChange={(e) => setEditingCandidate({ ...editingCandidate, name: e.target.value })}
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">Role Title / Track *</label>
                    <input
                      type="text"
                      className="admin-input no-icon"
                      required
                      value={editingCandidate.role_title || ""}
                      onChange={(e) => setEditingCandidate({ ...editingCandidate, role_title: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Mobile Number</label>
                    <input
                      type="text"
                      className="admin-input no-icon"
                      value={editingCandidate.phone || ""}
                      onChange={(e) => setEditingCandidate({ ...editingCandidate, phone: e.target.value })}
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">Email Address</label>
                    <input
                      type="email"
                      className="admin-input no-icon"
                      value={editingCandidate.email || ""}
                      onChange={(e) => setEditingCandidate({ ...editingCandidate, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Application Status</label>
                    <select
                      className="admin-input no-icon"
                      value={editingCandidate.status || "new"}
                      onChange={(e) => setEditingCandidate({ ...editingCandidate, status: e.target.value })}
                    >
                      <option value="new">● New Application</option>
                      <option value="reviewing">● Reviewing</option>
                      <option value="shortlisted">● Shortlisted</option>
                      <option value="interviewed">● Interviewed</option>
                      <option value="offer_made">● Offer Made</option>
                      <option value="hired">● Selected / Hired</option>
                      <option value="rejected">● Rejected</option>
                    </select>
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">Evaluation Rating (1 to 5 Stars)</label>
                    <div className="admin-star-rating" style={{ padding: "8px 0" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`admin-star-btn ${star <= (editingCandidate.rating || 0) ? "filled" : ""}`}
                          onClick={() => setEditingCandidate({ ...editingCandidate, rating: star })}
                        >
                          ★
                        </button>
                      ))}
                      {(editingCandidate.rating || 0) > 0 && (
                        <button
                          type="button"
                          style={{ background: "none", border: "none", color: "var(--adm-text-faint)", fontSize: "0.75rem", cursor: "pointer", marginLeft: "6px" }}
                          onClick={() => setEditingCandidate({ ...editingCandidate, rating: 0 })}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Conditional Fields based on kind */}
                {editingCandidate.kind === "internship" ? (
                  <>
                    <div className="admin-field-group">
                      <label className="admin-field-label">College / University Name</label>
                      <input
                        type="text"
                        className="admin-input no-icon"
                        placeholder="e.g. COEP Technological University"
                        value={editingCandidate.college || ""}
                        onChange={(e) => setEditingCandidate({ ...editingCandidate, college: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-grid-3">
                      <div className="admin-field-group">
                        <label className="admin-field-label">Degree</label>
                        <input
                          type="text"
                          className="admin-input no-icon"
                          value={editingCandidate.degree || ""}
                          onChange={(e) => setEditingCandidate({ ...editingCandidate, degree: e.target.value })}
                        />
                      </div>
                      <div className="admin-field-group">
                        <label className="admin-field-label">Branch</label>
                        <input
                          type="text"
                          className="admin-input no-icon"
                          value={editingCandidate.branch || ""}
                          onChange={(e) => setEditingCandidate({ ...editingCandidate, branch: e.target.value })}
                        />
                      </div>
                      <div className="admin-field-group">
                        <label className="admin-field-label">Study Year</label>
                        <input
                          type="text"
                          className="admin-input no-icon"
                          value={editingCandidate.graduation_year || ""}
                          onChange={(e) => setEditingCandidate({ ...editingCandidate, graduation_year: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="admin-form-grid-3">
                      <div className="admin-field-group">
                        <label className="admin-field-label">Experience</label>
                        <input
                          type="text"
                          className="admin-input no-icon"
                          placeholder="e.g. 3 - 5 Years"
                          value={editingCandidate.experience || ""}
                          onChange={(e) => setEditingCandidate({ ...editingCandidate, experience: e.target.value })}
                        />
                      </div>
                      <div className="admin-field-group">
                        <label className="admin-field-label">Current Company</label>
                        <input
                          type="text"
                          className="admin-input no-icon"
                          value={editingCandidate.current_company || ""}
                          onChange={(e) => setEditingCandidate({ ...editingCandidate, current_company: e.target.value })}
                        />
                      </div>
                      <div className="admin-field-group">
                        <label className="admin-field-label">Designation</label>
                        <input
                          type="text"
                          className="admin-input no-icon"
                          value={editingCandidate.current_designation || ""}
                          onChange={(e) => setEditingCandidate({ ...editingCandidate, current_designation: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="admin-form-grid-2">
                      <div className="admin-field-group">
                        <label className="admin-field-label">Notice Period</label>
                        <input
                          type="text"
                          className="admin-input no-icon"
                          value={editingCandidate.notice_period || ""}
                          onChange={(e) => setEditingCandidate({ ...editingCandidate, notice_period: e.target.value })}
                        />
                      </div>
                      <div className="admin-field-group">
                        <label className="admin-field-label">Expected CTC</label>
                        <input
                          type="text"
                          className="admin-input no-icon"
                          value={editingCandidate.expected_ctc || ""}
                          onChange={(e) => setEditingCandidate({ ...editingCandidate, expected_ctc: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Interview Scheduling */}
                <div className="admin-form-grid-2">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Scheduled Interview (Date & Time)</label>
                    <input
                      type="text"
                      className="admin-input no-icon"
                      placeholder="e.g. 2026-11-15 14:30"
                      value={editingCandidate.interview_date || ""}
                      onChange={(e) => setEditingCandidate({ ...editingCandidate, interview_date: e.target.value })}
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">Interview Mode</label>
                    <select
                      className="admin-input no-icon"
                      value={editingCandidate.interview_mode || "Google Meet"}
                      onChange={(e) => setEditingCandidate({ ...editingCandidate, interview_mode: e.target.value })}
                    >
                      <option value="Google Meet">Google Meet</option>
                      <option value="Office (Pune)">Pune Office (In-Person)</option>
                      <option value="Phone Call">Phone Screening</option>
                    </select>
                  </div>
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">Offered CTC / Stipend</label>
                  <input
                    type="text"
                    className="admin-input no-icon"
                    placeholder="e.g. ₹12 LPA or ₹15,000/mo stipend"
                    value={editingCandidate.salary_offered || ""}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, salary_offered: e.target.value })}
                  />
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">Portfolio / GitHub Link</label>
                  <input
                    type="text"
                    className="admin-input no-icon"
                    value={editingCandidate.portfolio_url || ""}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, portfolio_url: e.target.value })}
                  />
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">Candidate Pitch / Note</label>
                  <textarea
                    className="admin-input no-icon"
                    style={{ minHeight: "75px" }}
                    value={editingCandidate.message || ""}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, message: e.target.value })}
                  />
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">Recruiter Remarks & Internal Evaluation Notes</label>
                  <textarea
                    className="admin-notes-textarea"
                    style={{ minHeight: "80px" }}
                    placeholder="Technical assessment remarks, strengths, weaknesses, cultural fit..."
                    value={editingCandidate.notes || ""}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="adm-btn adm-btn-sec" onClick={() => setEditingCandidate(null)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn-pri" disabled={isSavingCandidate}>
                  <CheckCircle2 size={16} />
                  <span>{isSavingCandidate ? "Saving..." : "Save Candidate Profile"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================================
          CANDIDATE DOSSIER MODAL
          ========================================================================== */}
      {selectedCandidate && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedCandidate(null)}>
          <div className="admin-modal wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="admin-candidate-avatar">
                  {selectedCandidate.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2>{selectedCandidate.name}</h2>
                  <div style={{ fontSize: "0.82rem", color: "var(--adm-text-muted)" }}>
                    {selectedCandidate.kind === "internship" ? "Internship Application" : "Job Application"} · {selectedCandidate.role_title}
                  </div>
                </div>
              </div>
              <button className="admin-modal-close-btn" onClick={() => setSelectedCandidate(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Quick Status Bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--adm-card)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--adm-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--adm-text-muted)" }}>Hiring Stage:</span>
                  <select
                    className={`admin-status-dropdown ${selectedCandidate.status || "new"}`}
                    value={selectedCandidate.status || "new"}
                    onChange={(e) => handleUpdateApplicationStatus(selectedCandidate.id, e.target.value)}
                  >
                    <option value="new">● New Application</option>
                    <option value="reviewing">● Reviewing</option>
                    <option value="shortlisted">● Shortlisted</option>
                    <option value="interviewed">● Interviewed</option>
                    <option value="offer_made">● Offer Made</option>
                    <option value="hired">● Hired / Selected</option>
                    <option value="rejected">● Rejected</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {selectedCandidate.phone && (
                    <button
                      className="adm-btn adm-btn-whatsapp adm-btn-sm"
                      onClick={() =>
                        openWhatsApp(
                          selectedCandidate.phone,
                          `Hello ${selectedCandidate.name}, this is from KairoEdge Technologies regarding your application for ${selectedCandidate.role_title}.`
                        )
                      }
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp</span>
                    </button>
                  )}
                  <button
                    className="adm-btn adm-btn-sec adm-btn-sm"
                    onClick={() => printCandidateDossier(selectedCandidate)}
                  >
                    <Printer size={14} />
                    <span>Print Dossier</span>
                  </button>
                </div>
              </div>

              {/* Contact Coordinates */}
              <div className="admin-candidate-details-grid">
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Email</span>
                  <span className="admin-detail-value">
                    <a href={`mailto:${selectedCandidate.email}`} style={{ color: "var(--adm-cyan)" }}>{selectedCandidate.email}</a>
                  </span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Phone</span>
                  <span className="admin-detail-value">
                    <a href={`tel:${selectedCandidate.phone || ""}`} style={{ color: "var(--adm-cyan)" }}>{selectedCandidate.phone || "—"}</a>
                  </span>
                </div>
                {selectedCandidate.kind === "internship" ? (
                  <>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">College & District</span>
                      <span className="admin-detail-value">
                        {selectedCandidate.college || "—"}
                        {selectedCandidate.district ? ` (${selectedCandidate.district} District)` : ""}
                      </span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Degree & Branch</span>
                      <span className="admin-detail-value">{selectedCandidate.degree || "—"} ({selectedCandidate.branch || "—"})</span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Study Year</span>
                      <span className="admin-detail-value" style={{ color: "var(--adm-cyan)" }}>{selectedCandidate.graduation_year || "—"}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Experience</span>
                      <span className="admin-detail-value">{selectedCandidate.experience || "Fresher"}</span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Company & Designation</span>
                      <span className="admin-detail-value">{selectedCandidate.current_company || "—"} ({selectedCandidate.current_designation || "—"})</span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Notice & CTC</span>
                      <span className="admin-detail-value">{selectedCandidate.notice_period || "—"} · {selectedCandidate.expected_ctc || "—"}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Interview schedule if set */}
              {selectedCandidate.interview_date && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "rgba(14, 165, 233, 0.12)", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "6px", fontSize: "0.85rem" }}>
                  <Calendar size={16} color="var(--adm-cyan)" />
                  <span>Scheduled Interview: <b>{selectedCandidate.interview_date}</b> via {selectedCandidate.interview_mode || "Google Meet"}</span>
                </div>
              )}

              {/* Pitch */}
              <div className="admin-candidate-pitch">
                <b style={{ color: "var(--adm-text-bright)", display: "block", marginBottom: "6px" }}>Candidate Pitch / Motivation:</b>
                <p style={{ whiteSpace: "pre-wrap" }}>{selectedCandidate.message || "No pitch message provided."}</p>
              </div>

              {/* Recruiter Remarks Box */}
              <div className="admin-notes-box">
                <div className="admin-notes-header">
                  <span>Recruiter Remarks & Internal Log</span>
                </div>
                <textarea
                  className="admin-notes-textarea"
                  style={{ minHeight: "85px" }}
                  placeholder="Record interview notes, technical screening feedback, or hiring decisions..."
                  defaultValue={selectedCandidate.notes || ""}
                  onBlur={(e) => handleUpdateApplicationStatus(selectedCandidate.id, selectedCandidate.status || "new", e.target.value)}
                />
              </div>

              {/* Attachments */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {selectedCandidate.resume ? (
                  <>
                    <a
                      href={selectedCandidate.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="adm-btn adm-btn-pri adm-btn-sm"
                    >
                      <Eye size={15} />
                      <span>View Resume</span>
                    </a>
                    <a
                      href={selectedCandidate.resume}
                      download
                      className="adm-btn adm-btn-sec adm-btn-sm"
                    >
                      <Download size={15} />
                      <span>Download Resume</span>
                    </a>
                  </>
                ) : (
                  <span
                    className="adm-btn adm-btn-sec adm-btn-sm"
                    style={{ opacity: 0.55, cursor: "not-allowed" }}
                  >
                    <FileText size={15} />
                    <span>No Resume Uploaded</span>
                  </span>
                )}
                {selectedCandidate.portfolio_url && (
                  <a
                    href={selectedCandidate.portfolio_url}
                    target="_blank"
                    rel="noreferrer"
                    className="adm-btn adm-btn-sec adm-btn-sm"
                  >
                    <ExternalLink size={16} />
                    <span>Open Portfolio / GitHub</span>
                  </a>
                )}
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                className="adm-btn adm-btn-sec"
                onClick={() => {
                  setEditingCandidate({ ...selectedCandidate });
                  setSelectedCandidate(null);
                }}
              >
                <Edit3 size={14} />
                <span>Edit All Details</span>
              </button>
              <button className="adm-btn adm-btn-sec" onClick={() => setSelectedCandidate(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          UNIVERSAL ITEM CRUD MODAL (Jobs, Services, Projects, Tech, etc.)
          ========================================================================== */}
      {editingTable && (
        <div className="admin-modal-backdrop" onClick={() => setEditingTable(null)}>
          <div className={`admin-modal ${editingTable === "colleges" ? "wide" : ""}`} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>
                {editingItem ? "Edit" : "Create"}{" "}
                {tableSchemas[editingTable]?.label.slice(0, -1) || editingTable}
              </h2>
              <button className="admin-modal-close-btn" onClick={() => setEditingTable(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveItem}>
              <div className="admin-modal-body">
                {editingTable === "colleges" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <span>College / Institute Full Name</span>
                        <small style={{ color: "var(--adm-text-faint)", fontWeight: 400 }}>Official full name of the engineering college or university campus</small>
                      </label>
                      <input
                        type="text"
                        className="admin-input no-icon"
                        placeholder="e.g., Amrutvahini College of Engineering, Sangamner"
                        value={itemFormData.name || ""}
                        onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="admin-form-grid-2">
                      <div className="admin-field-group">
                        <label className="admin-field-label">
                          <span>District</span>
                          <small style={{ color: "var(--adm-text-faint)", fontWeight: 400 }}>Maharashtra district</small>
                        </label>
                        <select
                          className="admin-input no-icon"
                          value={itemFormData.district || "Pune"}
                          onChange={(e) => setItemFormData({ ...itemFormData, district: e.target.value })}
                          required
                          style={{ height: "42px", cursor: "pointer" }}
                        >
                          {MAHARASHTRA_DISTRICTS.map((dist: string) => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">
                          <span>City / Campus Area</span>
                          <small style={{ color: "var(--adm-text-faint)", fontWeight: 400 }}>Locality e.g., Sangamner, Pune</small>
                        </label>
                        <input
                          type="text"
                          className="admin-input no-icon"
                          placeholder="e.g., Sangamner"
                          value={itemFormData.city || ""}
                          onChange={(e) => setItemFormData({ ...itemFormData, city: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="admin-form-grid-2">
                      <div className="admin-field-group">
                        <label className="admin-field-label">
                          <span>College Short Code <span style={{ fontWeight: 400, color: "var(--adm-text-muted)" }}>(Optional)</span></span>
                          <small style={{ color: "var(--adm-text-faint)", fontWeight: 400 }}>Acronym e.g. AVCOE, PICT, COEP</small>
                        </label>
                        <input
                          type="text"
                          className="admin-input no-icon"
                          placeholder="e.g., AVCOE (Optional)"
                          value={itemFormData.code || ""}
                          onChange={(e) => setItemFormData({ ...itemFormData, code: e.target.value })}
                        />
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">
                          <span>State</span>
                          <small style={{ color: "var(--adm-text-faint)", fontWeight: 400 }}>Default: Maharashtra</small>
                        </label>
                        <input
                          type="text"
                          className="admin-input no-icon"
                          value={itemFormData.state || "Maharashtra"}
                          onChange={(e) => setItemFormData({ ...itemFormData, state: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  (tableSchemas[editingTable]?.fields || []).map((field) => (
                    <div key={field.name} className="admin-field-group">
                      <label className="admin-field-label">
                        <span>{field.label}</span>
                        {field.hint && <small style={{ color: "var(--adm-text-faint)", fontWeight: 400 }}>{field.hint}</small>}
                      </label>

                      {/* Text Input */}
                      {field.type === "text" && (
                        <input
                          type="text"
                          className="admin-input no-icon"
                          value={itemFormData[field.name] || ""}
                          onChange={(e) => setItemFormData({ ...itemFormData, [field.name]: e.target.value })}
                          required={field.name === "title" || field.name === "name"}
                        />
                      )}

                      {/* Select Dropdown */}
                      {field.type === "select" && (
                        <select
                          className="admin-input no-icon"
                          value={itemFormData[field.name] || (field.options?.[0] || "")}
                          onChange={(e) => setItemFormData({ ...itemFormData, [field.name]: e.target.value })}
                          required={field.name === "district"}
                          style={{ height: "42px", cursor: "pointer" }}
                        >
                          {(field.options || []).map((opt: string) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* Number Input */}
                      {field.type === "number" && (
                        <input
                          type="number"
                          className="admin-input no-icon"
                          value={itemFormData[field.name] ?? 0}
                          onChange={(e) => setItemFormData({ ...itemFormData, [field.name]: Number(e.target.value) })}
                        />
                      )}

                      {/* Textarea */}
                      {field.type === "textarea" && (
                        <textarea
                          className="admin-input no-icon"
                          style={{ minHeight: "80px", resize: "vertical" }}
                          value={itemFormData[field.name] || ""}
                          onChange={(e) => setItemFormData({ ...itemFormData, [field.name]: e.target.value })}
                        />
                      )}

                      {/* Tag Editor */}
                      {field.type === "tags" && (
                        <div className="admin-tag-editor">
                          {(Array.isArray(itemFormData[field.name]) ? itemFormData[field.name] : []).map((t: string, idx: number) => (
                            <span key={idx} className="admin-tag-chip">
                              {t}
                              <button
                                type="button"
                                className="admin-tag-chip-del"
                                onClick={() => {
                                  const current = itemFormData[field.name] || [];
                                  setItemFormData({ ...itemFormData, [field.name]: current.filter((_: any, i: number) => i !== idx) });
                                }}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                          <input
                            type="text"
                            className="admin-tag-input"
                            placeholder="Type & press Enter to add tag..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                                e.preventDefault();
                                const val = e.currentTarget.value.trim();
                                const current = Array.isArray(itemFormData[field.name]) ? itemFormData[field.name] : [];
                                setItemFormData({ ...itemFormData, [field.name]: [...current, val] });
                                e.currentTarget.value = "";
                              }
                            }}
                          />
                        </div>
                      )}

                      {/* Image Upload Zone */}
                      {field.type === "image" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <input
                            type="text"
                            className="admin-input no-icon"
                            placeholder="Image URL (or select file below)"
                            value={itemFormData[field.name] || ""}
                            onChange={(e) => setItemFormData({ ...itemFormData, [field.name]: e.target.value })}
                          />
                          <label className="admin-upload-zone">
                            <Upload size={22} color="var(--adm-cyan)" />
                            <span style={{ fontSize: "0.85rem", color: "var(--adm-text)" }}>Click or drop image to upload</span>
                            <span style={{ fontSize: "0.72rem", color: "var(--adm-text-muted)" }}>Supports PNG, JPG, WebP under 6MB</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleUploadImage(f, field.name);
                              }}
                            />
                          </label>
                          {itemFormData[field.name] && (
                            <img src={itemFormData[field.name]} alt="preview" className="admin-upload-preview" />
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="adm-btn adm-btn-sec" onClick={() => setEditingTable(null)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn-pri" disabled={isSavingItem}>
                  {isSavingItem ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================================
          SUB-ADMIN CREATION MODAL
          ========================================================================== */}
      {showSubAdminModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowSubAdminModal(false)}>
          <div className="admin-modal wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Create Sub-Admin Account</h2>
              <button className="admin-modal-close-btn" onClick={() => setShowSubAdminModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsCreatingSubAdmin(true);
                try {
                  const res = await fetch("/api/admin/subadmins", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(subAdminForm)
                  });
                  const d = await res.json();
                  if (!res.ok) throw new Error(d.error || "Failed to create sub-admin");
                  showToast(`Sub-admin "${d.username}" created successfully!`);
                  setShowSubAdminModal(false);
                  fetchData();
                } catch (err: any) {
                  showToast(err.message, "error");
                } finally {
                  setIsCreatingSubAdmin(false);
                }
              }}
            >
              <div className="admin-modal-body">
                <div className="admin-form-grid-2">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Username</label>
                    <input
                      type="text"
                      className="admin-input no-icon"
                      required
                      placeholder="e.g. pune_coordinator"
                      value={subAdminForm.username}
                      onChange={(e) => setSubAdminForm({ ...subAdminForm, username: e.target.value })}
                    />
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label">Email Address</label>
                    <input
                      type="email"
                      className="admin-input no-icon"
                      required
                      placeholder="e.g. hr@kairoedge.com"
                      value={subAdminForm.email}
                      onChange={(e) => setSubAdminForm({ ...subAdminForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Temporary Password</label>
                    <input
                      type="password"
                      className="admin-input no-icon"
                      required
                      placeholder="Minimum 4 characters"
                      value={subAdminForm.password}
                      onChange={(e) => setSubAdminForm({ ...subAdminForm, password: e.target.value })}
                    />
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label">Role Title</label>
                    <select
                      className="admin-input no-icon"
                      value={subAdminForm.role}
                      onChange={(e) => setSubAdminForm({ ...subAdminForm, role: e.target.value })}
                      style={{ height: "42px" }}
                    >
                      <option value="Talent HR / Recruiter">Talent HR / Recruiter</option>
                      <option value="Leads & Sales Lead">Leads & Sales Lead</option>
                      <option value="Content Editor">Content Editor</option>
                      <option value="Placement Coordinator">Placement Coordinator</option>
                    </select>
                  </div>
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">
                    <span>Section Access Permissions</span>
                    <small style={{ color: "var(--adm-text-faint)", fontWeight: 400, display: "block" }}>
                      Select which modules this new sub-admin will be authorized to access
                    </small>
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", marginTop: "6px" }}>
                    {[
                      { id: "inquiries", label: "Client Inquiries (Leads)" },
                      { id: "job_apps", label: "Job Applications" },
                      { id: "intern_apps", label: "Internships Pipeline" },
                      { id: "colleges", label: "Campus Colleges" },
                      { id: "services", label: "Services Catalog" },
                      { id: "projects", label: "Case Studies / Projects" },
                      { id: "copy", label: "Website Copy & Content" },
                      { id: "dashboard", label: "Command Dashboard" }
                    ].map((perm) => {
                      const hasPerm = (subAdminForm.permissions || []).includes(perm.id);
                      return (
                        <label
                          key={perm.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            background: hasPerm ? "rgba(2, 132, 199, 0.08)" : "var(--adm-card)",
                            border: `1px solid ${hasPerm ? "var(--adm-primary)" : "var(--adm-border)"}`,
                            cursor: "pointer",
                            fontSize: "0.82rem"
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={hasPerm}
                            onChange={(e) => {
                              const current = Array.isArray(subAdminForm.permissions) ? [...subAdminForm.permissions] : [];
                              if (e.target.checked) {
                                setSubAdminForm({ ...subAdminForm, permissions: [...current, perm.id] });
                              } else {
                                setSubAdminForm({ ...subAdminForm, permissions: current.filter((p: string) => p !== perm.id) });
                              }
                            }}
                          />
                          <span style={{ color: hasPerm ? "var(--adm-primary)" : "var(--adm-text-bright)", fontWeight: hasPerm ? 600 : 400 }}>
                            {perm.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="adm-btn adm-btn-sec" onClick={() => setShowSubAdminModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn-pri" disabled={isCreatingSubAdmin}>
                  {isCreatingSubAdmin ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================================
          SUB-ADMIN EDIT MODAL
          ========================================================================== */}
      {editingSubAdmin && (
        <div className="admin-modal-backdrop" onClick={() => setEditingSubAdmin(null)}>
          <div className="admin-modal wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Edit Sub-Admin ({editingSubAdmin.username})</h2>
              <button className="admin-modal-close-btn" onClick={() => setEditingSubAdmin(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubAdmin}>
              <div className="admin-modal-body">
                <div className="admin-form-grid-2">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Username</label>
                    <input
                      type="text"
                      className="admin-input no-icon"
                      required
                      value={editingSubAdmin.username}
                      disabled={editingSubAdmin.role === "superadmin" || editingSubAdmin.username === "admin"}
                      onChange={(e) => setEditingSubAdmin({ ...editingSubAdmin, username: e.target.value })}
                    />
                    {(editingSubAdmin.role === "superadmin" || editingSubAdmin.username === "admin") && (
                      <small style={{ color: "var(--adm-text-faint)", marginTop: "4px", display: "block" }}>
                        Primary superadmin username is protected and cannot be modified.
                      </small>
                    )}
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label">Email Address</label>
                    <input
                      type="email"
                      className="admin-input no-icon"
                      required
                      value={editingSubAdmin.email}
                      onChange={(e) => setEditingSubAdmin({ ...editingSubAdmin, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Assigned Role</label>
                    <select
                      className="admin-input no-icon"
                      value={editingSubAdmin.role}
                      disabled={editingSubAdmin.role === "superadmin" || editingSubAdmin.username === "admin"}
                      onChange={(e) => setEditingSubAdmin({ ...editingSubAdmin, role: e.target.value })}
                      style={{ height: "42px" }}
                    >
                      {(editingSubAdmin.role === "superadmin" || editingSubAdmin.username === "admin") && (
                        <option value="superadmin">Superadmin</option>
                      )}
                      <option value="Talent HR / Recruiter">Talent HR / Recruiter</option>
                      <option value="Leads & Sales Lead">Leads & Sales Lead</option>
                      <option value="Content Editor">Content Editor</option>
                      <option value="Placement Coordinator">Placement Coordinator</option>
                    </select>
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label">
                      <span>Change Password</span>
                      <small style={{ color: "var(--adm-text-faint)", fontWeight: 400 }}>Leave empty to keep current</small>
                    </label>
                    <input
                      type="password"
                      className="admin-input no-icon"
                      placeholder="Enter new password (min 4 chars)..."
                      value={editSubAdminPassword}
                      onChange={(e) => setEditSubAdminPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">
                    <span>Section Access Permissions</span>
                    <small style={{ color: "var(--adm-text-faint)", fontWeight: 400, display: "block" }}>
                      Choose which modules this sub-admin can view &amp; manage
                    </small>
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", marginTop: "6px" }}>
                    {[
                      { id: "inquiries", label: "Client Inquiries (Leads)" },
                      { id: "job_apps", label: "Job Applications" },
                      { id: "intern_apps", label: "Internships Pipeline" },
                      { id: "colleges", label: "Campus Colleges" },
                      { id: "services", label: "Services Catalog" },
                      { id: "projects", label: "Case Studies / Projects" },
                      { id: "copy", label: "Website Copy & Content" },
                      { id: "dashboard", label: "Command Dashboard" }
                    ].map((perm) => {
                      const hasPerm = (editingSubAdmin.permissions || []).includes(perm.id);
                      return (
                        <label
                          key={perm.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            background: hasPerm ? "rgba(2, 132, 199, 0.08)" : "var(--adm-card)",
                            border: `1px solid ${hasPerm ? "var(--adm-primary)" : "var(--adm-border)"}`,
                            cursor: "pointer",
                            fontSize: "0.82rem"
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={hasPerm}
                            onChange={(e) => {
                              const current = Array.isArray(editingSubAdmin.permissions) ? [...editingSubAdmin.permissions] : [];
                              if (e.target.checked) {
                                setEditingSubAdmin({ ...editingSubAdmin, permissions: [...current, perm.id] });
                              } else {
                                setEditingSubAdmin({ ...editingSubAdmin, permissions: current.filter((p: string) => p !== perm.id) });
                              }
                            }}
                          />
                          <span style={{ color: hasPerm ? "var(--adm-primary)" : "var(--adm-text-bright)", fontWeight: hasPerm ? 600 : 400 }}>
                            {perm.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="adm-btn adm-btn-sec" onClick={() => setEditingSubAdmin(null)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn-pri" disabled={subAdminSaving}>
                  {subAdminSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
