import { randomBytes, timingSafeEqual } from "crypto";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { query } from "./db.js";
import { pageCopy } from "../../shared/pageCopy.js";

const uploadDir = path.join(process.cwd(), "uploads");

const sessions = new Map();
const DAY = 12 * 60 * 60 * 1000;

export const tables = {
  stats: ["value", "label", "sort_order"],
  services: ["slug", "number", "title", "summary", "description", "image", "tags", "outcomes", "footer"],
  projects: ["slug", "category", "title", "summary", "description", "challenge", "solution", "result", "image", "label", "industry", "services"],
  industries: ["slug", "name", "summary", "description", "image", "focus"],
  technologies: ["name", "category", "sort_order"],
  architecture: ["number", "title", "text", "sort_order"],
  process_steps: ["number", "title", "summary", "details", "sort_order"],
  principles: ["title", "text", "sort_order"],
  team: ["role", "focus", "image", "sort_order"],
  testimonials: ["quote", "attribution", "sort_order"],
  insights: ["slug", "title", "excerpt", "category", "published_on", "image", "body"],
  jobs: ["slug", "title", "location", "type", "summary", "description"],
  colleges: ["name", "code", "district", "city", "state", "is_active", "sort_order"]
};

const jsonFields = {
  services: ["tags", "outcomes"],
  projects: ["services"],
  industries: ["focus"]
};

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function tokenFrom(req) {
  const header = req.get("authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

export function requireAdmin(req, res, next) {
  const token = tokenFrom(req);
  const session = sessions.get(token);
  if (!session || session.expires < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ error: "Sign in to the admin panel." });
  }
  session.expires = Date.now() + DAY;
  next();
}

export async function ensureAdmins() {
  await query(`CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    email VARCHAR(160) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'sub_admin',
    permissions JSON NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}

export async function login(req, res) {
  const name = String(req.body.username || "").trim();
  const secret = String(req.body.password || "");
  if (!name || !secret) {
    return res.status(400).json({ error: "Please enter both username and password." });
  }

  // 1. Check in admins table first
  try {
    const rows = await query(
      "SELECT id, username, email, password, role, permissions, is_active FROM admins WHERE LOWER(username) = LOWER(?)",
      [name]
    );
    if (rows[0]) {
      const admin = rows[0];
      if (!admin.is_active) {
        return res.status(403).json({ error: "This administrator account has been deactivated. Contact Super Admin." });
      }
      if (admin.password !== secret) {
        return res.status(401).json({ error: "The username or password is incorrect." });
      }
      const token = randomBytes(24).toString("hex");
      const permissions = typeof admin.permissions === "string" ? JSON.parse(admin.permissions || "[]") : (admin.permissions || []);
      sessions.set(token, { expires: Date.now() + DAY, user: admin.username, role: admin.role, permissions });
      return res.json({ token, user: admin.username, role: admin.role, permissions });
    }
  } catch (err) {
    console.error("Admins lookup error:", err.message);
  }

  // 2. Fallback to server/.env default admin
  const user = process.env.ADMIN_USER || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin@12";
  if (!safeEqual(name, user) || !safeEqual(secret, password)) {
    return res.status(401).json({ error: "Those details do not match." });
  }
  const token = randomBytes(24).toString("hex");
  sessions.set(token, { expires: Date.now() + DAY, user: name, role: "superadmin", permissions: ["all"] });
  res.json({ token, user: name, role: "superadmin", permissions: ["all"] });
}

export async function ensureApplications() {
  await query(`CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    email VARCHAR(160) NOT NULL,
    phone VARCHAR(40) NULL,
    role_title VARCHAR(160) NOT NULL,
    kind VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    resume VARCHAR(255) NULL,
    status VARCHAR(30) DEFAULT 'new',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  const resumeCols = await query("SHOW COLUMNS FROM applications LIKE 'resume'");
  if (!resumeCols.length) await query("ALTER TABLE applications ADD COLUMN resume VARCHAR(255) NULL");

  const statusCols = await query("SHOW COLUMNS FROM applications LIKE 'status'");
  if (!statusCols.length) await query("ALTER TABLE applications ADD COLUMN status VARCHAR(30) DEFAULT 'new'");

  const notesCols = await query("SHOW COLUMNS FROM applications LIKE 'notes'");
  if (!notesCols.length) await query("ALTER TABLE applications ADD COLUMN notes TEXT NULL");

  const collegeCols = await query("SHOW COLUMNS FROM applications LIKE 'college'");
  if (!collegeCols.length) await query("ALTER TABLE applications ADD COLUMN college VARCHAR(200) NULL");

  const districtCols = await query("SHOW COLUMNS FROM applications LIKE 'district'");
  if (!districtCols.length) await query("ALTER TABLE applications ADD COLUMN district VARCHAR(100) NULL AFTER college");

  const degreeCols = await query("SHOW COLUMNS FROM applications LIKE 'degree'");
  if (!degreeCols.length) await query("ALTER TABLE applications ADD COLUMN degree VARCHAR(100) NULL");

  const branchCols = await query("SHOW COLUMNS FROM applications LIKE 'branch'");
  if (!branchCols.length) await query("ALTER TABLE applications ADD COLUMN branch VARCHAR(100) NULL");

  const gradCols = await query("SHOW COLUMNS FROM applications LIKE 'graduation_year'");
  if (!gradCols.length) await query("ALTER TABLE applications ADD COLUMN graduation_year VARCHAR(50) NULL");

  const expCols = await query("SHOW COLUMNS FROM applications LIKE 'experience'");
  if (!expCols.length) await query("ALTER TABLE applications ADD COLUMN experience VARCHAR(60) NULL");

  const compCols = await query("SHOW COLUMNS FROM applications LIKE 'current_company'");
  if (!compCols.length) await query("ALTER TABLE applications ADD COLUMN current_company VARCHAR(120) NULL");

  const desigCols = await query("SHOW COLUMNS FROM applications LIKE 'current_designation'");
  if (!desigCols.length) await query("ALTER TABLE applications ADD COLUMN current_designation VARCHAR(100) NULL");

  const noticeCols = await query("SHOW COLUMNS FROM applications LIKE 'notice_period'");
  if (!noticeCols.length) await query("ALTER TABLE applications ADD COLUMN notice_period VARCHAR(60) NULL");

  const portCols = await query("SHOW COLUMNS FROM applications LIKE 'portfolio_url'");
  if (!portCols.length) await query("ALTER TABLE applications ADD COLUMN portfolio_url VARCHAR(255) NULL");

  const ctcCols = await query("SHOW COLUMNS FROM applications LIKE 'expected_ctc'");
  if (!ctcCols.length) await query("ALTER TABLE applications ADD COLUMN expected_ctc VARCHAR(60) NULL");

  const interviewDateCols = await query("SHOW COLUMNS FROM applications LIKE 'interview_date'");
  if (!interviewDateCols.length) await query("ALTER TABLE applications ADD COLUMN interview_date VARCHAR(60) NULL");

  const interviewModeCols = await query("SHOW COLUMNS FROM applications LIKE 'interview_mode'");
  if (!interviewModeCols.length) await query("ALTER TABLE applications ADD COLUMN interview_mode VARCHAR(60) NULL");

  const ratingCols = await query("SHOW COLUMNS FROM applications LIKE 'rating'");
  if (!ratingCols.length) await query("ALTER TABLE applications ADD COLUMN rating INT DEFAULT 0");

  const salaryCols = await query("SHOW COLUMNS FROM applications LIKE 'salary_offered'");
  if (!salaryCols.length) await query("ALTER TABLE applications ADD COLUMN salary_offered VARCHAR(60) NULL");

  const count = await query("SELECT COUNT(*) AS total FROM applications");
  if (!Number(count[0].total)) {
    const samples = [
      ["Meera Iyer", "meera.iyer@example.com", "+91 98450 11021", "Senior Full-Stack Engineer", "job", "Six years with React and Node.js. I have shipped staff portals and can join the Pune office three days a week."],
      ["Arjun Deshmukh", "arjun.d@example.com", "+91 98220 44118", "Cloud Engineer", "job", "I run AWS accounts and CI pipelines. Looking for a hybrid cloud role in Pune with production ownership."],
      ["Sana Qureshi", "sana.qureshi@example.com", "+91 90040 22881", "Product Designer", "job", "I design operational tools for dispatch and admin teams. Portfolio is available on request."],
      ["Nikhil Rao", "nikhil.rao@example.com", "+91 98860 33442", "Senior Full-Stack Engineer", "job", "Full-stack engineer with MySQL and API work. I can start after a two-week notice."],
      ["Ananya Shah", "ananya.shah@example.com", "+91 97650 77821", "Software Engineering Internship", "internship", "Final-year student at COEP. I have built a React project and can attend the Pune office three days a week."],
      ["Rahul Patil", "rahul.patil@example.com", "+91 90110 66230", "Software Engineering Internship", "internship", "Recent graduate from PICT with HTML, CSS, and JavaScript projects. I want a six-month internship in Pune on a live product."]
    ];
    for (const row of samples) {
      await query(
        "INSERT INTO applications (name, email, phone, role_title, kind, message, status) VALUES (?, ?, ?, ?, ?, ?, 'new')",
        row
      );
    }
  }
}

export async function seedColleges() {
  const sampleColleges = [
    // 1. Pune District
    ["COEP Technological University", "COEP", "Pune", "Pune", "Maharashtra", 1, 1],
    ["Pune Institute of Computer Technology (PICT)", "PICT", "Pune", "Pune", "Maharashtra", 1, 2],
    ["Vishwakarma Institute of Technology (VIT)", "VIT", "Pune", "Pune", "Maharashtra", 1, 3],
    ["MIT World Peace University (MIT-WPU)", "MIT-WPU", "Pune", "Pune", "Maharashtra", 1, 4],
    ["Pimpri Chinchwad College of Engineering (PCCOE)", "PCCOE", "Pune", "Pune", "Maharashtra", 1, 5],
    ["Cummins College of Engineering for Women", "CCOEW", "Pune", "Pune", "Maharashtra", 1, 6],
    ["Bharati Vidyapeeth Deemed University College of Engineering", "BVDU-COE", "Pune", "Pune", "Maharashtra", 1, 7],
    ["Army Institute of Technology (AIT)", "AIT", "Pune", "Pune", "Maharashtra", 1, 8],
    ["D. Y. Patil College of Engineering, Akurdi", "DYPCOE", "Pune", "Pune", "Maharashtra", 1, 9],
    ["Vishwakarma Institute of Information Technology (VIIT)", "VIIT", "Pune", "Pune", "Maharashtra", 1, 10],
    ["Sinhgad College of Engineering, Vadgaon", "SCOE", "Pune", "Pune", "Maharashtra", 1, 11],
    ["Modern Education Society's College of Engineering", "MESCOE", "Pune", "Pune", "Maharashtra", 1, 12],
    ["JSPM Rajarshi Shahu College of Engineering", "RSCOE", "Pune", "Pune", "Maharashtra", 1, 13],
    ["Indira College of Engineering and Management", "ICEM", "Pune", "Pune", "Maharashtra", 1, 14],
    ["AISSMS College of Engineering", "AISSMS-COE", "Pune", "Pune", "Maharashtra", 1, 15],
    ["Symbiosis Institute of Technology (SIT)", "SIT", "Pune", "Pune", "Maharashtra", 1, 16],

    // 2. Ahilyanagar (Ahmednagar) District
    ["Amrutvahini College of Engineering, Sangamner", "AVCOE", "Ahilyanagar", "Sangamner", "Maharashtra", 1, 20],
    ["Sanjivani College of Engineering, Kopargaon", "SCOE-KPG", "Ahilyanagar", "Kopargaon", "Maharashtra", 1, 21],
    ["Pravara Rural Engineering College, Loni", "PREC-LONI", "Ahilyanagar", "Loni", "Maharashtra", 1, 22],
    ["Dr. Vithalrao Vikhe Patil College of Engineering", "DVVP-COE", "Ahilyanagar", "Ahilyanagar", "Maharashtra", 1, 23],
    ["Government Polytechnic, Ahilyanagar", "GP-ANR", "Ahilyanagar", "Ahilyanagar", "Maharashtra", 1, 24],
    ["Ahmednagar College (BPHE Society)", "ACA", "Ahilyanagar", "Ahilyanagar", "Maharashtra", 1, 25],
    ["New Arts, Commerce & Science College", "NACSC", "Ahilyanagar", "Ahilyanagar", "Maharashtra", 1, 26],
    ["Hon. Shri. Babanrao Pachpute Vichardhara Trust Faculty of Engineering", "HSBPVT", "Ahilyanagar", "Kashti", "Maharashtra", 1, 27],

    // 3. Chhatrapati Sambhajinagar (Aurangabad) District
    ["Government College of Engineering, Chhatrapati Sambhajinagar", "GECA", "Chhatrapati Sambhajinagar", "Chhatrapati Sambhajinagar", "Maharashtra", 1, 30],
    ["Jawaharlal Nehru Engineering College (JNEC - MGM University)", "JNEC", "Chhatrapati Sambhajinagar", "Chhatrapati Sambhajinagar", "Maharashtra", 1, 31],
    ["Maharashtra Institute of Technology (MIT Aurangabad)", "MIT-CSN", "Chhatrapati Sambhajinagar", "Chhatrapati Sambhajinagar", "Maharashtra", 1, 32],
    ["Deogiri Institute of Engineering and Management Studies", "DIEMS", "Chhatrapati Sambhajinagar", "Chhatrapati Sambhajinagar", "Maharashtra", 1, 33],
    ["PES College of Engineering", "PES-COE", "Chhatrapati Sambhajinagar", "Chhatrapati Sambhajinagar", "Maharashtra", 1, 34],

    // 4. Nashik District
    ["K. K. Wagh Institute of Engineering Education & Research", "KKWIEER", "Nashik", "Nashik", "Maharashtra", 1, 40],
    ["Sandip University / Sandip Foundation", "SANDIP", "Nashik", "Nashik", "Maharashtra", 1, 41],
    ["MET Bhujbal Knowledge City", "MET-BKC", "Nashik", "Nashik", "Maharashtra", 1, 42],
    ["Matoshri College of Engineering & Research Centre", "MCOERC", "Nashik", "Nashik", "Maharashtra", 1, 43],
    ["MVP Samaj's K.B.T. College of Engineering", "KBTCOE", "Nashik", "Nashik", "Maharashtra", 1, 44],
    ["Guru Gobind Singh College of Engineering and Research Centre", "GCOERC", "Nashik", "Nashik", "Maharashtra", 1, 45],

    // 5. Mumbai & Navi Mumbai District
    ["Veermata Jijabai Technological Institute (VJTI)", "VJTI", "Mumbai", "Mumbai", "Maharashtra", 1, 50],
    ["Sardar Patel Institute of Technology (SPIT)", "SPIT", "Mumbai", "Mumbai", "Maharashtra", 1, 51],
    ["D. J. Sanghvi College of Engineering", "DJSCE", "Mumbai", "Mumbai", "Maharashtra", 1, 52],
    ["Thadomal Shahani Engineering College (TSEC)", "TSEC", "Mumbai", "Mumbai", "Maharashtra", 1, 53],
    ["Fr. Conceicao Rodrigues College of Engineering", "CRCE", "Mumbai", "Mumbai", "Maharashtra", 1, 54],
    ["K. J. Somaiya College of Engineering", "KJSCE", "Mumbai", "Mumbai", "Maharashtra", 1, 55],
    ["SIES Graduate School of Technology", "SIES-GST", "Mumbai", "Navi Mumbai", "Maharashtra", 1, 56],
    ["Pillai College of Engineering", "PCE", "Mumbai", "Navi Mumbai", "Maharashtra", 1, 57],
    ["Ramrao Adik Institute of Technology (RAIT)", "RAIT", "Mumbai", "Navi Mumbai", "Maharashtra", 1, 58],

    // 6. Thane District
    ["Vidyavardhini's College of Engineering & Technology", "VCET", "Thane", "Vasai", "Maharashtra", 1, 60],
    ["A. P. Shah Institute of Technology", "APSIT", "Thane", "Thane", "Maharashtra", 1, 61],
    ["K. C. College of Engineering & Management Studies", "KC-COE", "Thane", "Thane", "Maharashtra", 1, 62],

    // 7. Kolhapur & Sangli District
    ["Walchand College of Engineering, Sangli", "WCE", "Sangli", "Sangli", "Maharashtra", 1, 70],
    ["DKTE Society's Textile and Engineering Institute", "DKTE", "Kolhapur", "Ichalkaranji", "Maharashtra", 1, 71],
    ["Kolhapur Institute of Technology's College of Engineering (KIT)", "KIT", "Kolhapur", "Kolhapur", "Maharashtra", 1, 72],
    ["D. Y. Patil College of Engineering and Technology", "DYPCET", "Kolhapur", "Kolhapur", "Maharashtra", 1, 73],

    // 8. Solapur District
    ["Walchand Institute of Technology (WIT Solapur)", "WIT", "Solapur", "Solapur", "Maharashtra", 1, 80],
    ["N. B. Navale Sinhgad College of Engineering", "NBNSCOE", "Solapur", "Solapur", "Maharashtra", 1, 81],

    // 9. Nagpur District
    ["Visvesvaraya National Institute of Technology (VNIT)", "VNIT", "Nagpur", "Nagpur", "Maharashtra", 1, 90],
    ["Shri Ramdeobaba College of Engineering and Management (RCOEM)", "RCOEM", "Nagpur", "Nagpur", "Maharashtra", 1, 91],
    ["G. H. Raisoni College of Engineering", "GHRECO", "Nagpur", "Nagpur", "Maharashtra", 1, 92]
  ];

  for (const row of sampleColleges) {
    const existing = await query("SELECT id FROM colleges WHERE name = ? OR (code = ? AND code IS NOT NULL)", [row[0], row[1]]);
    if (!existing.length) {
      await query(
        "INSERT INTO colleges (name, code, district, city, state, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
        row
      ).catch(() => {});
    } else {
      await query(
        "UPDATE colleges SET district = ?, city = ?, state = ?, is_active = ? WHERE id = ?",
        [row[2], row[3], row[4], row[5], existing[0].id]
      ).catch(() => {});
    }
  }

  return await query("SELECT * FROM colleges ORDER BY sort_order, name");
}

export async function ensureColleges() {
  await query(`CREATE TABLE IF NOT EXISTS colleges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NULL,
    district VARCHAR(100) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  const districtCols = await query("SHOW COLUMNS FROM colleges LIKE 'district'");
  if (!districtCols.length) {
    await query("ALTER TABLE colleges ADD COLUMN district VARCHAR(100) NULL AFTER code").catch(() => {});
  }
  await query("UPDATE colleges SET district = city WHERE (district IS NULL OR district = '') AND city IS NOT NULL").catch(() => {});

  const count = await query("SELECT COUNT(*) AS total FROM colleges");
  if (!Number(count[0]?.total) || Number(count[0]?.total) < 20) {
    await seedColleges().catch(() => {});
  }
}

export async function ensureInquiries() {
  await query(`CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    email VARCHAR(160) NOT NULL,
    company VARCHAR(120) NULL,
    phone VARCHAR(40) NULL,
    service VARCHAR(120) NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'new',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  const statusCols = await query("SHOW COLUMNS FROM inquiries LIKE 'status'");
  if (!statusCols.length) await query("ALTER TABLE inquiries ADD COLUMN status VARCHAR(30) DEFAULT 'new'");

  const notesCols = await query("SHOW COLUMNS FROM inquiries LIKE 'notes'");
  if (!notesCols.length) await query("ALTER TABLE inquiries ADD COLUMN notes TEXT NULL");

  const sourceCols = await query("SHOW COLUMNS FROM inquiries LIKE 'source'");
  if (!sourceCols.length) await query("ALTER TABLE inquiries ADD COLUMN source VARCHAR(60) DEFAULT 'Website'");

  const priorityCols = await query("SHOW COLUMNS FROM inquiries LIKE 'priority'");
  if (!priorityCols.length) await query("ALTER TABLE inquiries ADD COLUMN priority VARCHAR(20) DEFAULT 'medium'");

  const budgetCols = await query("SHOW COLUMNS FROM inquiries LIKE 'budget'");
  if (!budgetCols.length) await query("ALTER TABLE inquiries ADD COLUMN budget VARCHAR(80) NULL");

  const followCols = await query("SHOW COLUMNS FROM inquiries LIKE 'follow_up_date'");
  if (!followCols.length) await query("ALTER TABLE inquiries ADD COLUMN follow_up_date VARCHAR(40) NULL");
}

export async function ensureRecycleBin() {
  await query(`CREATE TABLE IF NOT EXISTS recycle_bin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_table VARCHAR(50) NOT NULL,
    item_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    data LONGTEXT NOT NULL,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}

export async function saveApplication(req, res) {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const phone = String(req.body.phone || "").trim();
  const role = String(req.body.role || "").trim();
  const kind = req.body.kind === "internship" ? "internship" : "job";
  const college = String(req.body.college || "").trim();
  const district = String(req.body.district || "").trim();
  const degree = String(req.body.degree || "").trim();
  const branch = String(req.body.branch || "").trim();
  const graduation_year = String(req.body.graduation_year || "").trim();
  const message = String(req.body.message || "").trim();

  // ONLY name, email, and mobile phone are strictly required
  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ error: "Please enter your name." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (!phone || phone.length < 5 || phone.length > 40) {
    return res.status(400).json({ error: "Please enter your mobile number." });
  }
  if (role.length < 2 || role.length > 160) {
    return res.status(400).json({ error: "Choose a role before you apply." });
  }

  const resumeName = String(req.body.resumeName || "");
  const resumeData = String(req.body.resumeData || "");
  let resume = null;
  if (resumeData) {
    const payload = resumeData.includes(",") ? resumeData.split(",").pop() : resumeData;
    const file = Buffer.from(payload, "base64");
    if (!file.length || file.length > 4_000_000) {
      return res.status(400).json({ error: "Resume must be a PDF or Word file under 4 MB." });
    }
    mkdirSync(uploadDir, { recursive: true });
    const clean = resumeName.replace(/[^a-z0-9.]+/gi, "-").replace(/^-|-$/g, "") || "resume.pdf";
    const stored = `${Date.now()}-${clean}`;
    writeFileSync(path.join(uploadDir, stored), file);
    resume = `/uploads/${stored}`;
  }

  const experience = String(req.body.experience || "").trim();
  const current_company = String(req.body.current_company || "").trim();
  const current_designation = String(req.body.current_designation || "").trim();
  const notice_period = String(req.body.notice_period || "").trim();
  const portfolio_url = String(req.body.portfolio_url || "").trim();
  const expected_ctc = String(req.body.expected_ctc || "").trim();

  const result = await query(
    `INSERT INTO applications (name, email, phone, role_title, kind, message, resume, status, college, district, degree, branch, graduation_year, experience, current_company, current_designation, notice_period, portfolio_url, expected_ctc) VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      email,
      phone,
      role,
      kind,
      message || "Candidate applied through the online portal.",
      resume,
      college || null,
      district || null,
      degree || null,
      branch || null,
      graduation_year || null,
      experience || null,
      current_company || null,
      current_designation || null,
      notice_period || null,
      portfolio_url || null,
      expected_ctc || null
    ]
  );
  res.status(201).json({ ok: true, id: result.insertId });
}

export async function listSubAdmins(_req, res) {
  const rows = await query(
    "SELECT id, username, email, role, permissions, is_active, created_at FROM admins ORDER BY id ASC"
  );
  const parsed = rows.map((r) => ({
    ...r,
    permissions: typeof r.permissions === "string" ? JSON.parse(r.permissions || "[]") : (r.permissions || [])
  }));
  res.json(parsed);
}

export async function createSubAdmin(req, res) {
  const username = String(req.body.username || "").trim();
  const email = String(req.body.email || "").trim();
  const password = String(req.body.password || "").trim();
  const role = String(req.body.role || "Talent HR / Recruiter").trim();
  const permissions = Array.isArray(req.body.permissions) ? req.body.permissions : ["job_apps", "intern_apps"];

  if (username.length < 3 || username.length > 50) {
    return res.status(400).json({ error: "Username must be between 3 and 50 characters." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }
  if (password.length < 4) {
    return res.status(400).json({ error: "Password must be at least 4 characters long." });
  }

  const existing = await query("SELECT id FROM admins WHERE LOWER(username) = LOWER(?)", [username]);
  if (existing[0]) {
    return res.status(400).json({ error: `Username "${username}" is already taken.` });
  }

  const result = await query(
    "INSERT INTO admins (username, email, password, role, permissions, is_active) VALUES (?, ?, ?, ?, ?, 1)",
    [username, email, password, role, JSON.stringify(permissions)]
  );
  res.status(201).json({ ok: true, id: result.insertId, username, role });
}

export async function updateSubAdmin(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid ID." });
  const rows = await query("SELECT id, username, email, role, permissions, is_active FROM admins WHERE id = ?", [id]);
  if (!rows[0]) return res.status(404).json({ error: "Sub-admin not found." });
  const cur = rows[0];

  const username = req.body.username !== undefined ? String(req.body.username).trim() : cur.username;
  const email = req.body.email !== undefined ? String(req.body.email).trim() : cur.email;
  let role = req.body.role !== undefined ? String(req.body.role).trim() : cur.role;
  const permissions = Array.isArray(req.body.permissions)
    ? req.body.permissions
    : (typeof cur.permissions === "string" ? JSON.parse(cur.permissions || "[]") : (cur.permissions || []));
  const password = req.body.password ? String(req.body.password).trim() : "";

  if (cur.username === "admin" && role !== "superadmin") {
    role = "superadmin"; // protect superadmin role
  }

  if (username.length < 3 || username.length > 50) {
    return res.status(400).json({ error: "Username must be between 3 and 50 characters." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }
  if (password && password.length < 4) {
    return res.status(400).json({ error: "Password must be at least 4 characters long." });
  }

  if (username.toLowerCase() !== cur.username.toLowerCase()) {
    const existing = await query("SELECT id FROM admins WHERE LOWER(username) = LOWER(?) AND id != ?", [username, id]);
    if (existing[0]) {
      return res.status(400).json({ error: `Username "${username}" is already taken.` });
    }
  }

  if (password) {
    await query(
      "UPDATE admins SET username = ?, email = ?, role = ?, permissions = ?, password = ? WHERE id = ?",
      [username, email, role, JSON.stringify(permissions), password, id]
    );
  } else {
    await query(
      "UPDATE admins SET username = ?, email = ?, role = ?, permissions = ? WHERE id = ?",
      [username, email, role, JSON.stringify(permissions), id]
    );
  }

  res.json({ ok: true, id, username, email, role, permissions });
}

export async function toggleSubAdmin(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid ID." });
  const rows = await query("SELECT id, username, is_active, role FROM admins WHERE id = ?", [id]);
  if (!rows[0]) return res.status(404).json({ error: "Sub-admin not found." });
  if (rows[0].role === "superadmin" || rows[0].username === "admin") {
    return res.status(400).json({ error: "Cannot deactivate the primary Super Administrator account." });
  }
  const nextStatus = rows[0].is_active ? 0 : 1;
  await query("UPDATE admins SET is_active = ? WHERE id = ?", [nextStatus, id]);
  res.json({ ok: true, is_active: nextStatus });
}

export async function deleteSubAdmin(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid ID." });
  const rows = await query("SELECT id, username, role FROM admins WHERE id = ?", [id]);
  if (!rows[0]) return res.status(404).json({ error: "Sub-admin not found." });
  if (rows[0].role === "superadmin" || rows[0].username === "admin") {
    return res.status(400).json({ error: "Cannot delete the primary Super Administrator account." });
  }
  await query("DELETE FROM admins WHERE id = ?", [id]);
  res.json({ ok: true, deletedId: id });
}

export async function resetSubAdminPassword(req, res) {
  const id = Number(req.params.id);
  const newPassword = String(req.body.password || "").trim();
  if (!id || newPassword.length < 4) {
    return res.status(400).json({ error: "New password must be at least 4 characters long." });
  }
  await query("UPDATE admins SET password = ? WHERE id = ?", [newPassword, id]);
  res.json({ ok: true });
}

export async function toggleCollege(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid college ID." });
  const rows = await query("SELECT is_active FROM colleges WHERE id = ?", [id]);
  if (!rows[0]) return res.status(404).json({ error: "College not found." });
  const nextStatus = rows[0].is_active ? 0 : 1;
  await query("UPDATE colleges SET is_active = ? WHERE id = ?", [nextStatus, id]);
  res.json({ ok: true, is_active: nextStatus });
}

export async function uploadMedia(req, res) {
  const filename = String(req.body.filename || "image.png");
  const data = String(req.body.data || "");
  if (!data) return res.status(400).json({ error: "No image file provided." });
  const payload = data.includes(",") ? data.split(",").pop() : data;
  const buffer = Buffer.from(payload, "base64");
  if (!buffer.length || buffer.length > 6_000_000) {
    return res.status(400).json({ error: "Uploaded file must be under 6 MB." });
  }
  mkdirSync(uploadDir, { recursive: true });
  const clean = filename.replace(/[^a-z0-9._-]+/gi, "-").replace(/^-|-$/g, "") || "upload.png";
  const stored = `${Date.now()}-${clean}`;
  writeFileSync(path.join(uploadDir, stored), buffer);
  res.json({ ok: true, url: `/uploads/${stored}` });
}

export async function ensureCopy() {
  await query(`CREATE TABLE IF NOT EXISTS site_copy (
    id TINYINT PRIMARY KEY,
    body LONGTEXT NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  const rows = await query("SELECT id FROM site_copy WHERE id = 1");
  if (!rows[0]) {
    await query("INSERT INTO site_copy (id, body) VALUES (1, ?)", [JSON.stringify(pageCopy)]);
  }
}

export async function readCopy() {
  const rows = await query("SELECT body FROM site_copy WHERE id = 1");
  if (!rows[0]) return pageCopy;
  try {
    const parsed = JSON.parse(rows[0].body);
    return parsed && typeof parsed === "object" ? parsed : pageCopy;
  } catch {
    return pageCopy;
  }
}

export async function saveCopy(req, res) {
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Page copy must be an object." });
  }
  await ensureCopy();
  const rows = await query("SELECT id FROM site_copy WHERE id = 1");
  if (!rows[0]) {
    await query("INSERT INTO site_copy (id, body) VALUES (1, ?)", [JSON.stringify(body)]);
  } else {
    await query("UPDATE site_copy SET body = ? WHERE id = 1", [JSON.stringify(body)]);
  }
  res.json({ ok: true });
}

function pack(table, body) {
  const columns = tables[table];
  const values = {};
  for (const column of columns) {
    let value = body[column];
    if ((jsonFields[table] || []).includes(column)) {
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.startsWith("[")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) value = parsed;
          } catch {
            value = trimmed;
          }
        }
        if (typeof value === "string") {
          value = value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
        }
      }
      value = JSON.stringify(Array.isArray(value) ? value : []);
    } else if (column === "sort_order") {
      value = Number(value || 0);
    } else if (column === "is_active") {
      value = Number(value) ? 1 : 0;
    } else if (column === "published_on") {
      value = String(value || "").slice(0, 10) || null;
    } else {
      value = value == null ? "" : String(value);
    }
    values[column] = value;
  }
  return values;
}

export async function getDashboard(_req, res) {
  const [
    inquiriesTotal,
    inquiriesNew,
    applicationsTotal,
    applicationsNew,
    jobApps,
    internApps,
    servicesCount,
    projectsCount,
    industriesCount,
    insightsCount,
    jobsCount,
    techCount,
    teamCount,
    testimonialsCount,
    collegesTotal,
    collegesActive,
    recycleBinCount,
    subadminsCount,
    recentInquiries,
    recentApplications,
    inquiriesByService,
    applicationsByRole
  ] = await Promise.all([
    query("SELECT COUNT(*) AS count FROM inquiries"),
    query("SELECT COUNT(*) AS count FROM inquiries WHERE status = 'new' OR status IS NULL"),
    query("SELECT COUNT(*) AS count FROM applications"),
    query("SELECT COUNT(*) AS count FROM applications WHERE status = 'new' OR status IS NULL"),
    query("SELECT COUNT(*) AS count FROM applications WHERE kind = 'job'"),
    query("SELECT COUNT(*) AS count FROM applications WHERE kind = 'internship'"),
    query("SELECT COUNT(*) AS count FROM services"),
    query("SELECT COUNT(*) AS count FROM projects"),
    query("SELECT COUNT(*) AS count FROM industries"),
    query("SELECT COUNT(*) AS count FROM insights"),
    query("SELECT COUNT(*) AS count FROM jobs"),
    query("SELECT COUNT(*) AS count FROM technologies"),
    query("SELECT COUNT(*) AS count FROM team"),
    query("SELECT COUNT(*) AS count FROM testimonials"),
    query("SELECT COUNT(*) AS count FROM colleges"),
    query("SELECT COUNT(*) AS count FROM colleges WHERE is_active = 1"),
    query("SELECT COUNT(*) AS count FROM recycle_bin"),
    query("SELECT COUNT(*) AS count FROM admins"),
    query("SELECT id, name, email, company, phone, service, message, status, notes, created_at FROM inquiries ORDER BY id DESC LIMIT 6"),
    query("SELECT id, name, email, phone, role_title, kind, message, resume, status, notes, college, degree, branch, graduation_year, experience, current_company, current_designation, notice_period, portfolio_url, expected_ctc, created_at FROM applications ORDER BY id DESC LIMIT 6"),
    query("SELECT COALESCE(NULLIF(service, ''), 'General') AS label, COUNT(*) AS count FROM inquiries GROUP BY label ORDER BY count DESC LIMIT 6"),
    query("SELECT role_title AS label, COUNT(*) AS count FROM applications GROUP BY role_title ORDER BY count DESC LIMIT 6")
  ]);

  res.json({
    counts: {
      inquiries: Number(inquiriesTotal[0]?.count || 0),
      newInquiries: Number(inquiriesNew[0]?.count || 0),
      applications: Number(applicationsTotal[0]?.count || 0),
      newApplications: Number(applicationsNew[0]?.count || 0),
      jobApplications: Number(jobApps[0]?.count || 0),
      internApplications: Number(internApps[0]?.count || 0),
      services: Number(servicesCount[0]?.count || 0),
      projects: Number(projectsCount[0]?.count || 0),
      industries: Number(industriesCount[0]?.count || 0),
      insights: Number(insightsCount[0]?.count || 0),
      jobs: Number(jobsCount[0]?.count || 0),
      technologies: Number(techCount[0]?.count || 0),
      team: Number(teamCount[0]?.count || 0),
      testimonials: Number(testimonialsCount[0]?.count || 0),
      colleges: Number(collegesTotal[0]?.count || 0),
      activeColleges: Number(collegesActive[0]?.count || 0),
      recycleBin: Number(recycleBinCount[0]?.count || 0),
      subadmins: Number(subadminsCount[0]?.count || 0)
    },
    recentInquiries,
    recentApplications,
    inquiriesByService,
    applicationsByRole,
    system: {
      database: process.env.DB_NAME || "kairoedge",
      port: Number(process.env.PORT || 4001),
      status: "online",
      uptime: Math.floor(process.uptime())
    }
  });
}

export async function listContent(_req, res) {
  const content = {};
  for (const table of Object.keys(tables)) {
    content[table] = await query(`SELECT * FROM \`${table}\` ORDER BY id`);
  }
  if (!content.colleges || content.colleges.length === 0) {
    content.colleges = await seedColleges().catch(() => []);
  }
  content.copy = await readCopy();
  content.applications = await query(
    "SELECT * FROM applications ORDER BY id DESC LIMIT 500"
  );
  content.inquiries = await query(
    "SELECT * FROM inquiries ORDER BY id DESC LIMIT 500"
  );
  content.recycleBin = await query(
    "SELECT id, original_table, item_id, title, data, deleted_at FROM recycle_bin ORDER BY id DESC LIMIT 250"
  );
  const adminsRows = await query(
    "SELECT id, username, email, role, permissions, is_active, created_at FROM admins ORDER BY id ASC"
  );
  content.subadmins = adminsRows.map((r) => ({
    ...r,
    permissions: typeof r.permissions === "string" ? JSON.parse(r.permissions || "[]") : (r.permissions || [])
  }));
  res.json(content);
}

export async function createItem(req, res) {
  const table = req.params.table;
  if (!tables[table]) return res.status(404).json({ error: "Unknown section." });
  const values = pack(table, req.body || {});
  if (tables[table].includes("sort_order") && !values.sort_order) {
    const rows = await query(`SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM \`${table}\``);
    values.sort_order = rows[0].next;
  }
  const columns = Object.keys(values);
  try {
    const result = await query(
      `INSERT INTO \`${table}\` (${columns.map((column) => `\`${column}\``).join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
      columns.map((column) => values[column])
    );
    res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(400).json({ error: "That slug is already used." });
    throw error;
  }
}

export async function updateItem(req, res) {
  const table = req.params.table;
  const id = Number(req.params.id);
  if (!tables[table] || !id) return res.status(404).json({ error: "Unknown item." });
  const values = pack(table, req.body || {});
  const columns = Object.keys(values);
  try {
    await query(
      `UPDATE \`${table}\` SET ${columns.map((column) => `\`${column}\` = ?`).join(", ")} WHERE id = ?`,
      [...columns.map((column) => values[column]), id]
    );
    res.json({ ok: true });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(400).json({ error: "That slug is already used." });
    throw error;
  }
}

export async function createAdminInquiry(req, res) {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const phone = String(req.body.phone || "").trim();
  const company = String(req.body.company || "").trim();
  const service = String(req.body.service || "Custom software").trim();
  const message = String(req.body.message || "Direct lead created in admin panel.").trim();
  const status = String(req.body.status || "new").trim();
  const notes = req.body.notes !== undefined ? String(req.body.notes || "") : null;
  const source = String(req.body.source || "Direct Call").trim();
  const priority = String(req.body.priority || "medium").trim();
  const budget = String(req.body.budget || "").trim();
  const follow_up_date = String(req.body.follow_up_date || "").trim();

  if (!name) return res.status(400).json({ error: "Please enter client / lead name." });

  const result = await query(
    `INSERT INTO inquiries (name, email, phone, company, service, message, status, notes, source, priority, budget, follow_up_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email || null, phone || null, company || null, service || null, message, status, notes, source, priority, budget || null, follow_up_date || null]
  );
  res.status(201).json({ ok: true, id: result.insertId });
}

export async function updateInquiry(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid inquiry ID." });
  const rows = await query("SELECT * FROM inquiries WHERE id = ?", [id]);
  if (!rows[0]) return res.status(404).json({ error: "Inquiry not found." });
  const cur = rows[0];

  const name = req.body.name !== undefined ? String(req.body.name).trim() : cur.name;
  const email = req.body.email !== undefined ? String(req.body.email).trim() : cur.email;
  const phone = req.body.phone !== undefined ? String(req.body.phone).trim() : cur.phone;
  const company = req.body.company !== undefined ? String(req.body.company).trim() : cur.company;
  const service = req.body.service !== undefined ? String(req.body.service).trim() : cur.service;
  const message = req.body.message !== undefined ? String(req.body.message).trim() : cur.message;
  const status = req.body.status !== undefined ? String(req.body.status).trim() : cur.status;
  const notes = req.body.notes !== undefined ? String(req.body.notes).trim() : cur.notes;
  const source = req.body.source !== undefined ? String(req.body.source).trim() : (cur.source || "Website");
  const priority = req.body.priority !== undefined ? String(req.body.priority).trim() : (cur.priority || "medium");
  const budget = req.body.budget !== undefined ? String(req.body.budget).trim() : cur.budget;
  const follow_up_date = req.body.follow_up_date !== undefined ? String(req.body.follow_up_date).trim() : cur.follow_up_date;

  await query(
    `UPDATE inquiries SET name = ?, email = ?, phone = ?, company = ?, service = ?, message = ?, status = ?, notes = ?, source = ?, priority = ?, budget = ?, follow_up_date = ? WHERE id = ?`,
    [name, email || null, phone || null, company || null, service || null, message, status, notes, source, priority, budget || null, follow_up_date || null, id]
  );
  res.json({ ok: true });
}

export async function deleteInquiry(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid inquiry ID." });
  const rows = await query("SELECT * FROM inquiries WHERE id = ?", [id]);
  if (rows[0]) {
    const item = rows[0];
    const title = item.name ? `${item.name} (${item.service || "Inquiry"})` : `Inquiry #${id}`;
    await query(
      "INSERT INTO recycle_bin (original_table, item_id, title, data) VALUES (?, ?, ?, ?)",
      ["inquiries", id, String(title).slice(0, 255), JSON.stringify(item)]
    );
  }
  await query("DELETE FROM inquiries WHERE id = ?", [id]);
  res.json({ ok: true, recycled: true });
}

export async function createAdminApplication(req, res) {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const phone = String(req.body.phone || "").trim();
  const role = String(req.body.role || req.body.role_title || "").trim();
  const kind = req.body.kind === "internship" ? "internship" : "job";
  const college = String(req.body.college || "").trim();
  const district = String(req.body.district || "").trim();
  const degree = String(req.body.degree || "").trim();
  const branch = String(req.body.branch || "").trim();
  const graduation_year = String(req.body.graduation_year || "").trim();
  const message = String(req.body.message || "Candidate record added by administrator.").trim();
  const experience = String(req.body.experience || "").trim();
  const current_company = String(req.body.current_company || "").trim();
  const current_designation = String(req.body.current_designation || "").trim();
  const notice_period = String(req.body.notice_period || "").trim();
  const portfolio_url = String(req.body.portfolio_url || "").trim();
  const expected_ctc = String(req.body.expected_ctc || "").trim();
  const status = String(req.body.status || "new").trim();
  const notes = req.body.notes !== undefined ? String(req.body.notes || "") : null;
  const interview_date = String(req.body.interview_date || "").trim();
  const interview_mode = String(req.body.interview_mode || "Google Meet").trim();
  const rating = req.body.rating ? Number(req.body.rating) : 0;
  const salary_offered = String(req.body.salary_offered || "").trim();

  if (!name) return res.status(400).json({ error: "Please enter candidate name." });
  if (!role) return res.status(400).json({ error: "Please specify the role or internship track." });

  const result = await query(
    `INSERT INTO applications (name, email, phone, role_title, kind, message, resume, status, notes, college, district, degree, branch, graduation_year, experience, current_company, current_designation, notice_period, portfolio_url, expected_ctc, interview_date, interview_mode, rating, salary_offered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name, email || null, phone || null, role, kind, message, null, status, notes,
      college || null, district || null, degree || null, branch || null, graduation_year || null,
      experience || null, current_company || null, current_designation || null, notice_period || null,
      portfolio_url || null, expected_ctc || null, interview_date || null, interview_mode || null, rating, salary_offered || null
    ]
  );
  res.status(201).json({ ok: true, id: result.insertId });
}

export async function updateApplication(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid application ID." });
  const rows = await query("SELECT * FROM applications WHERE id = ?", [id]);
  if (!rows[0]) return res.status(404).json({ error: "Application not found." });
  const cur = rows[0];

  const name = req.body.name !== undefined ? String(req.body.name).trim() : cur.name;
  const email = req.body.email !== undefined ? String(req.body.email).trim() : cur.email;
  const phone = req.body.phone !== undefined ? String(req.body.phone).trim() : cur.phone;
  const role_title = req.body.role_title !== undefined ? String(req.body.role_title).trim() : (req.body.role !== undefined ? String(req.body.role).trim() : cur.role_title);
  const kind = req.body.kind !== undefined ? String(req.body.kind).trim() : cur.kind;
  const message = req.body.message !== undefined ? String(req.body.message).trim() : cur.message;
  const status = req.body.status !== undefined ? String(req.body.status).trim() : cur.status;
  const notes = req.body.notes !== undefined ? String(req.body.notes).trim() : cur.notes;

  const college = req.body.college !== undefined ? String(req.body.college).trim() : cur.college;
  const district = req.body.district !== undefined ? String(req.body.district).trim() : cur.district;
  const degree = req.body.degree !== undefined ? String(req.body.degree).trim() : cur.degree;
  const branch = req.body.branch !== undefined ? String(req.body.branch).trim() : cur.branch;
  const graduation_year = req.body.graduation_year !== undefined ? String(req.body.graduation_year).trim() : cur.graduation_year;

  const experience = req.body.experience !== undefined ? String(req.body.experience).trim() : cur.experience;
  const current_company = req.body.current_company !== undefined ? String(req.body.current_company).trim() : cur.current_company;
  const current_designation = req.body.current_designation !== undefined ? String(req.body.current_designation).trim() : cur.current_designation;
  const notice_period = req.body.notice_period !== undefined ? String(req.body.notice_period).trim() : cur.notice_period;
  const expected_ctc = req.body.expected_ctc !== undefined ? String(req.body.expected_ctc).trim() : cur.expected_ctc;
  const portfolio_url = req.body.portfolio_url !== undefined ? String(req.body.portfolio_url).trim() : cur.portfolio_url;

  const interview_date = req.body.interview_date !== undefined ? String(req.body.interview_date).trim() : cur.interview_date;
  const interview_mode = req.body.interview_mode !== undefined ? String(req.body.interview_mode).trim() : cur.interview_mode;
  const rating = req.body.rating !== undefined ? Number(req.body.rating) : (cur.rating || 0);
  const salary_offered = req.body.salary_offered !== undefined ? String(req.body.salary_offered).trim() : cur.salary_offered;

  await query(
    `UPDATE applications SET name = ?, email = ?, phone = ?, role_title = ?, kind = ?, message = ?, status = ?, notes = ?, college = ?, district = ?, degree = ?, branch = ?, graduation_year = ?, experience = ?, current_company = ?, current_designation = ?, notice_period = ?, expected_ctc = ?, portfolio_url = ?, interview_date = ?, interview_mode = ?, rating = ?, salary_offered = ? WHERE id = ?`,
    [
      name, email, phone || null, role_title, kind, message, status, notes,
      college || null, district || null, degree || null, branch || null, graduation_year || null,
      experience || null, current_company || null, current_designation || null, notice_period || null,
      expected_ctc || null, portfolio_url || null, interview_date || null, interview_mode || null,
      rating, salary_offered || null, id
    ]
  );
  res.json({ ok: true });
}

export async function deleteApplication(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid application ID." });
  const rows = await query("SELECT * FROM applications WHERE id = ?", [id]);
  if (rows[0]) {
    const item = rows[0];
    const title = item.name ? `${item.name} (${item.role_title || "Candidate"})` : `Application #${id}`;
    await query(
      "INSERT INTO recycle_bin (original_table, item_id, title, data) VALUES (?, ?, ?, ?)",
      ["applications", id, String(title).slice(0, 255), JSON.stringify(item)]
    );
  }
  await query("DELETE FROM applications WHERE id = ?", [id]);
  res.json({ ok: true, recycled: true });
}

export async function deleteItem(req, res) {
  const table = req.params.table;
  const id = Number(req.params.id);
  if (table === "inquiries") {
    return deleteInquiry(req, res);
  }
  if (table === "applications") {
    return deleteApplication(req, res);
  }
  if (!tables[table] || !id) return res.status(404).json({ error: "Unknown item." });
  const rows = await query(`SELECT * FROM \`${table}\` WHERE id = ?`, [id]);
  if (rows[0]) {
    const item = rows[0];
    const title = item.title || item.name || item.role || item.value || item.quote || `${table} #${id}`;
    await query(
      "INSERT INTO recycle_bin (original_table, item_id, title, data) VALUES (?, ?, ?, ?)",
      [table, id, String(title).slice(0, 255), JSON.stringify(item)]
    );
  }
  await query(`DELETE FROM \`${table}\` WHERE id = ?`, [id]);
  res.json({ ok: true, recycled: true });
}

export async function listRecycleBin(_req, res) {
  const rows = await query("SELECT id, original_table, item_id, title, data, deleted_at FROM recycle_bin ORDER BY id DESC");
  res.json(rows);
}

export async function restoreRecycleItem(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid recycle ID." });
  const rows = await query("SELECT * FROM recycle_bin WHERE id = ?", [id]);
  if (!rows[0]) return res.status(404).json({ error: "Item not found in Recycle Bin." });
  const { original_table, data } = rows[0];
  const item = typeof data === "string" ? JSON.parse(data) : data;

  if (original_table === "inquiries") {
    await query(
      "INSERT INTO inquiries (name, email, company, phone, service, message, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [item.name, item.email, item.company || null, item.phone || null, item.service || null, item.message, item.status || "new", item.notes || null]
    );
  } else if (original_table === "applications") {
    await query(
      "INSERT INTO applications (name, email, phone, role_title, kind, message, resume, status, notes, college, degree, branch, graduation_year, experience, current_company, current_designation, notice_period, portfolio_url, expected_ctc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        item.name,
        item.email,
        item.phone || null,
        item.role_title,
        item.kind || "job",
        item.message,
        item.resume || null,
        item.status || "new",
        item.notes || null,
        item.college || null,
        item.degree || null,
        item.branch || null,
        item.graduation_year || null,
        item.experience || null,
        item.current_company || null,
        item.current_designation || null,
        item.notice_period || null,
        item.portfolio_url || null,
        item.expected_ctc || null
      ]
    );
  } else if (tables[original_table]) {
    const columns = tables[original_table];
    const values = columns.map((col) => {
      let val = item[col];
      if ((jsonFields[original_table] || []).includes(col)) {
        if (typeof val !== "string") val = JSON.stringify(Array.isArray(val) ? val : []);
      } else if (col === "sort_order") {
        val = Number(val || 0);
      } else if (col === "published_on") {
        val = String(val || "").slice(0, 10) || null;
      } else {
        val = val == null ? "" : String(val);
      }
      return val;
    });
    await query(
      `INSERT INTO \`${original_table}\` (${columns.map((c) => `\`${c}\``).join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
      values
    );
  } else {
    return res.status(400).json({ error: "Cannot restore this item type." });
  }

  await query("DELETE FROM recycle_bin WHERE id = ?", [id]);
  res.json({ ok: true, restored: true });
}

export async function deleteRecycleItem(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid recycle ID." });
  await query("DELETE FROM recycle_bin WHERE id = ?", [id]);
  res.json({ ok: true });
}

export async function emptyRecycleBin(_req, res) {
  await query("DELETE FROM recycle_bin");
  res.json({ ok: true });
}

export async function trackApplication(req, res) {
  const q = String(req.query.q || req.query.query || "").trim();
  if (!q) {
    return res.status(400).json({ error: "Please enter your Application Reference ID, registered email, or mobile number." });
  }

  let parsedId = null;
  const match = q.match(/(\d+)$/);
  if (match) {
    parsedId = Number(match[1]);
  } else if (/^\d+$/.test(q)) {
    parsedId = Number(q);
  }

  const rows = await query(
    `SELECT id, name, role_title, kind, status, college, degree, branch, graduation_year, created_at
     FROM applications
     WHERE (? IS NOT NULL AND id = ?)
        OR LOWER(email) = LOWER(?)
        OR phone = ?
     ORDER BY id DESC LIMIT 5`,
    [parsedId, parsedId, q, q]
  );

  if (!rows.length) {
    return res.status(404).json({ error: "No matching application found. Please check your reference ID, email, or mobile number." });
  }

  // Obfuscate full name partially for student privacy e.g. "Rahul S."
  const safeResults = rows.map((app) => {
    const parts = (app.name || "").split(" ");
    const safeName = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
    return {
      ...app,
      name: safeName,
      refId: `KE-INT-2026-${String(app.id).padStart(4, "0")}`
    };
  });

  res.json({ ok: true, applications: safeResults });
}

