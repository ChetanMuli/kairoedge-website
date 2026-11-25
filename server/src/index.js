import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { query } from "./db.js";
import {
  createAdminApplication,
  createAdminInquiry,
  createItem,
  createSubAdmin,
  deleteApplication,
  deleteInquiry,
  deleteItem,
  deleteRecycleItem,
  deleteSubAdmin,
  emptyRecycleBin,
  ensureAdmins,
  ensureApplications,
  ensureColleges,
  ensureCopy,
  ensureInquiries,
  ensureRecycleBin,
  getDashboard,
  listContent,
  listRecycleBin,
  listSubAdmins,
  login,
  readCopy,
  requireAdmin,
  resetSubAdminPassword,
  restoreRecycleItem,
  saveApplication,
  saveCopy,
  seedColleges,
  toggleCollege,
  toggleSubAdmin,
  trackApplication,
  updateApplication,
  updateInquiry,
  updateItem,
  updateSubAdmin,
  uploadMedia
} from "./admin.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4001);

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const asJson = (value) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object" && !Buffer.isBuffer(value)) return value;
  const text = Buffer.isBuffer(value) ? value.toString() : String(value || "[]");
  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
};

const asDate = (value) => {
  if (!value) return "";
  if (value instanceof Date) {
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${value.getFullYear()}-${month}-${day}`;
  }
  return String(value).slice(0, 10);
};

const parseRow = (row, fields) => {
  const next = { ...row };
  for (const field of fields) next[field] = asJson(next[field]);
  if (next.published_on) {
    next.publishedOn = asDate(next.published_on);
    delete next.published_on;
  }
  return next;
};

app.get("/api/health", async (_req, res, next) => {
  try {
    await query("SELECT 1 AS ok");
    res.json({ ok: true, database: process.env.DB_NAME || "kairoedge" });
  } catch (error) {
    next(error);
  }
});

app.get("/api/site", async (_req, res, next) => {
  try {
    const [stats, services, projects, industries, technologies, architecture, process, principles, team, testimonials, insights, jobs, colleges] =
      await Promise.all([
        query("SELECT value, label FROM stats ORDER BY sort_order"),
        query("SELECT slug, number, title, summary, description, image, tags, outcomes, footer FROM services ORDER BY number"),
        query("SELECT slug, category, title, summary, description, challenge, solution, result, image, label, industry, services FROM projects ORDER BY id"),
        query("SELECT slug, name, summary, description, image, focus FROM industries ORDER BY id"),
        query("SELECT name, category FROM technologies ORDER BY sort_order"),
        query("SELECT number, title, text FROM architecture ORDER BY sort_order"),
        query("SELECT number, title, summary, details FROM process_steps ORDER BY sort_order"),
        query("SELECT title, text FROM principles ORDER BY sort_order"),
        query("SELECT role, focus, image FROM team ORDER BY sort_order"),
        query("SELECT quote, attribution FROM testimonials ORDER BY sort_order"),
        query("SELECT slug, title, excerpt, category, published_on, image, body FROM insights ORDER BY published_on DESC"),
        query("SELECT slug, title, location, type, summary, description FROM jobs ORDER BY id"),
        query("SELECT id, name, code, COALESCE(district, city) AS district, city, state, is_active FROM colleges WHERE is_active = 1 ORDER BY sort_order, name")
      ]);

    const copy = await readCopy();
    res.json({
      copy,
      stats,
      services: services.map((row) => parseRow(row, ["tags", "outcomes"])),
      projects: projects.map((row) => parseRow(row, ["services"])),
      industries: industries.map((row) => parseRow(row, ["focus"])),
      technologies,
      architecture,
      process,
      principles,
      team,
      testimonials,
      insights: insights.map((row) => parseRow(row, [])),
      jobs,
      colleges
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/colleges", async (_req, res, next) => {
  try {
    const rows = await query(
      "SELECT id, name, code, COALESCE(district, city) AS district, city, state, is_active FROM colleges WHERE is_active = 1 ORDER BY sort_order, name"
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get("/api/services/:slug", async (req, res, next) => {
  try {
    const rows = await query(
      "SELECT slug, number, title, summary, description, image, tags, outcomes, footer FROM services WHERE LOWER(slug) = LOWER(?)",
      [req.params.slug]
    );
    if (!rows[0]) return res.status(404).json({ error: "Service not found." });
    res.json(parseRow(rows[0], ["tags", "outcomes"]));
  } catch (error) {
    next(error);
  }
});

app.get("/api/projects/:slug", async (req, res, next) => {
  try {
    const rows = await query(
      "SELECT slug, category, title, summary, description, challenge, solution, result, image, label, industry, services FROM projects WHERE LOWER(slug) = LOWER(?)",
      [req.params.slug]
    );
    if (!rows[0]) return res.status(404).json({ error: "Project not found." });
    res.json(parseRow(rows[0], ["services"]));
  } catch (error) {
    next(error);
  }
});

app.post("/api/applications", (req, res, next) => saveApplication(req, res).catch(next));
app.get("/api/applications/track", (req, res, next) => trackApplication(req, res).catch(next));

// Admin routes
app.post("/api/admin/login", login);
app.get("/api/admin/dashboard", requireAdmin, (req, res, next) => getDashboard(req, res).catch(next));
app.get("/api/admin/content", requireAdmin, (req, res, next) => listContent(req, res).catch(next));
app.put("/api/admin/copy", requireAdmin, (req, res, next) => saveCopy(req, res).catch(next));
app.post("/api/admin/upload", requireAdmin, (req, res, next) => uploadMedia(req, res).catch(next));
app.post("/api/admin/items/:table", requireAdmin, (req, res, next) => createItem(req, res).catch(next));
app.put("/api/admin/items/:table/:id", requireAdmin, (req, res, next) => updateItem(req, res).catch(next));
app.delete("/api/admin/items/:table/:id", requireAdmin, (req, res, next) => deleteItem(req, res).catch(next));
app.post("/api/admin/inquiries", requireAdmin, (req, res, next) => createAdminInquiry(req, res).catch(next));
app.patch("/api/admin/inquiries/:id", requireAdmin, (req, res, next) => updateInquiry(req, res).catch(next));
app.delete("/api/admin/inquiries/:id", requireAdmin, (req, res, next) => deleteInquiry(req, res).catch(next));
app.post("/api/admin/applications", requireAdmin, (req, res, next) => createAdminApplication(req, res).catch(next));
app.patch("/api/admin/applications/:id", requireAdmin, (req, res, next) => updateApplication(req, res).catch(next));
app.delete("/api/admin/applications/:id", requireAdmin, (req, res, next) => deleteApplication(req, res).catch(next));
app.patch("/api/admin/colleges/:id/toggle", requireAdmin, (req, res, next) => toggleCollege(req, res).catch(next));
app.post("/api/admin/colleges/seed", requireAdmin, async (_req, res, next) => {
  try {
    const colleges = await seedColleges();
    res.json({ ok: true, count: colleges.length, colleges });
  } catch (error) {
    next(error);
  }
});
app.get("/api/admin/recycle-bin", requireAdmin, (req, res, next) => listRecycleBin(req, res).catch(next));
app.post("/api/admin/recycle-bin/restore/:id", requireAdmin, (req, res, next) => restoreRecycleItem(req, res).catch(next));
app.delete("/api/admin/recycle-bin/:id", requireAdmin, (req, res, next) => deleteRecycleItem(req, res).catch(next));
app.delete("/api/admin/recycle-bin", requireAdmin, (req, res, next) => emptyRecycleBin(req, res).catch(next));

// Sub-admin management routes
app.get("/api/admin/subadmins", requireAdmin, (req, res, next) => listSubAdmins(req, res).catch(next));
app.post("/api/admin/subadmins", requireAdmin, (req, res, next) => createSubAdmin(req, res).catch(next));
app.put("/api/admin/subadmins/:id", requireAdmin, (req, res, next) => updateSubAdmin(req, res).catch(next));
app.patch("/api/admin/subadmins/:id", requireAdmin, (req, res, next) => updateSubAdmin(req, res).catch(next));
app.patch("/api/admin/subadmins/:id/toggle", requireAdmin, (req, res, next) => toggleSubAdmin(req, res).catch(next));
app.patch("/api/admin/subadmins/:id/password", requireAdmin, (req, res, next) => resetSubAdminPassword(req, res).catch(next));
app.delete("/api/admin/subadmins/:id", requireAdmin, (req, res, next) => deleteSubAdmin(req, res).catch(next));

app.post("/api/inquiries", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim();
    const company = String(req.body.company || "").trim();
    const phone = String(req.body.phone || "").trim();
    const service = String(req.body.service || "").trim();
    const message = String(req.body.message || "").trim();

    if (name.length < 2 || name.length > 80) {
      return res.status(400).json({ error: "Please enter your name." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (message.length < 12 || message.length > 2000) {
      return res.status(400).json({ error: "Please describe the project in at least a sentence." });
    }
    if (company.length > 120 || phone.length > 40 || service.length > 120) {
      return res.status(400).json({ error: "One of the fields is too long." });
    }

    const result = await query(
      `INSERT INTO inquiries (name, email, company, phone, service, message, status) VALUES (?, ?, ?, ?, ?, ?, 'new')`,
      [name, email, company || null, phone || null, service || null, message]
    );
    res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    next(error);
  }
});

app.post("/api/set-logo", async (req, res, next) => {
  try {
    const conceptId = String(req.body.conceptId || "1").toLowerCase();
    const filenames = {
      "exact": "official_kairoedge_exact.jpg",
      "circle_light": "kairoedge_exact_circle_light.svg",
      "circle_dark": "kairoedge_exact_circle_dark.svg",
      "official": "official_kairoedge_exact.jpg",
      "final": "official_kairoedge_exact.jpg",
      "1": "official_kairoedge_exact.jpg"
    };

    const targetFile = filenames[conceptId];
    if (!targetFile) {
      return res.status(400).json({ error: `Invalid concept ID: ${conceptId}.` });
    }

    const rootDir = process.cwd().endsWith("server") ? path.join(process.cwd(), "..") : process.cwd();
    const sourcePath = path.join(rootDir, "public", "images", "logos", targetFile);
    const destPath = path.join(rootDir, "public", "logo.jpg");

    if (!fs.existsSync(sourcePath)) {
      return res.status(404).json({ error: `Image file ${targetFile} not found yet.` });
    }

    await fs.promises.copyFile(sourcePath, destPath);
    if (targetFile.endsWith(".svg")) {
      const destSvg = path.join(rootDir, "public", "logo.svg");
      await fs.promises.copyFile(sourcePath, destSvg);
      const destFavicon = path.join(rootDir, "public", "assets", "favicon.svg");
      await fs.promises.copyFile(sourcePath, destFavicon);
    }
    console.log(`[Logo] Active logo updated to Concept ${conceptId} (${targetFile})`);
    res.json({ ok: true, conceptId, file: targetFile });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  const unavailable = error.code === "ECONNREFUSED" || error.code === "ER_BAD_DB_ERROR";
  res.status(unavailable ? 503 : 500).json({
    error: unavailable
      ? "The KairoEdge database is not available. Start MySQL and run npm run setup in the server folder."
      : "The server could not complete that request."
  });
});

Promise.all([ensureCopy(), ensureApplications(), ensureColleges(), ensureInquiries(), ensureRecycleBin(), ensureAdmins()])
  .catch((error) => console.error("Could not prepare admin tables.", error.message))
  .finally(() => {
    app.listen(port, () => {
      console.log(`KairoEdge API listening on http://127.0.0.1:${port}`);
    });
  });
