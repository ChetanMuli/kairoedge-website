import mysql from "mysql2/promise";
import {
  architecture,
  industries,
  insights,
  jobs,
  principles,
  processSteps,
  projects,
  services,
  stats,
  team,
  technologies,
  testimonials
} from "../../shared/siteContent.js";
import {
  ensureAdmins,
  ensureApplications,
  ensureColleges,
  ensureCopy,
  ensureInquiries,
  ensureRecycleBin,
  seedColleges
} from "./admin.js";
import { dbConfig } from "./db.js";

const json = (value) => JSON.stringify(value);

const schema = `
CREATE TABLE IF NOT EXISTS stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  value VARCHAR(32) NOT NULL,
  label VARCHAR(80) NOT NULL,
  sort_order INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  number CHAR(2) NOT NULL,
  title VARCHAR(120) NOT NULL,
  summary VARCHAR(400) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NOT NULL,
  tags JSON NOT NULL,
  outcomes JSON NOT NULL,
  footer VARCHAR(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  category VARCHAR(80) NOT NULL,
  title VARCHAR(160) NOT NULL,
  summary VARCHAR(400) NOT NULL,
  description TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  result TEXT NOT NULL,
  image VARCHAR(255) NOT NULL,
  label VARCHAR(20) NOT NULL,
  industry VARCHAR(80) NOT NULL,
  services JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS industries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  summary VARCHAR(400) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NOT NULL,
  focus JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS technologies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  category VARCHAR(40) NOT NULL,
  sort_order INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS architecture (
  id INT AUTO_INCREMENT PRIMARY KEY,
  number CHAR(2) NOT NULL,
  title VARCHAR(80) NOT NULL,
  text VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS process_steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  number CHAR(2) NOT NULL,
  title VARCHAR(80) NOT NULL,
  summary VARCHAR(400) NOT NULL,
  details TEXT NOT NULL,
  sort_order INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS principles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  text VARCHAR(400) NOT NULL,
  sort_order INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS team (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role VARCHAR(120) NOT NULL,
  focus VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote TEXT NOT NULL,
  attribution VARCHAR(180) NOT NULL,
  sort_order INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS insights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(180) NOT NULL,
  excerpt VARCHAR(400) NOT NULL,
  category VARCHAR(40) NOT NULL,
  published_on DATE NOT NULL,
  image VARCHAR(255) NOT NULL,
  body TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(160) NOT NULL,
  location VARCHAR(80) NOT NULL,
  type VARCHAR(40) NOT NULL,
  summary VARCHAR(400) NOT NULL,
  description TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(160) NOT NULL,
  company VARCHAR(120) NULL,
  phone VARCHAR(40) NULL,
  service VARCHAR(120) NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

const contentTables = [
  "stats",
  "services",
  "projects",
  "industries",
  "technologies",
  "architecture",
  "process_steps",
  "principles",
  "team",
  "testimonials",
  "insights",
  "jobs"
];

async function main() {
  const { database, ...serverConfig } = dbConfig;
  let connection;
  try {
    connection = await mysql.createConnection(serverConfig);
  } catch (err) {
    if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("\n❌ MySQL Access Denied for user '" + (serverConfig.user || "root") + "'.");
      console.error("👉 To allow MySQL connection on Ubuntu in 5 seconds, run:");
      console.error("   sudo mysql -e \"ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''; FLUSH PRIVILEGES;\"");
      console.error("   OR if you have set a MySQL root password, create/update server/.env with:");
      console.error("   DB_PASSWORD=your_mysql_password\n");
    }
    throw err;
  }
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.query(`USE \`${database}\``);

  for (const table of [...contentTables].reverse()) {
    await connection.query(`DROP TABLE IF EXISTS \`${table}\``);
  }
  for (const statement of schema.split(";").map((part) => part.trim()).filter(Boolean)) {
    await connection.query(statement);
  }

  for (const [index, item] of stats.entries()) {
    await connection.execute("INSERT INTO stats (value, label, sort_order) VALUES (?, ?, ?)", [
      item.value,
      item.label,
      index
    ]);
  }
  for (const item of services) {
    await connection.execute(
      `INSERT INTO services (slug, number, title, summary, description, image, tags, outcomes, footer)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.slug, item.number, item.title, item.summary, item.description, item.image, json(item.tags), json(item.outcomes), item.footer]
    );
  }
  for (const item of projects) {
    await connection.execute(
      `INSERT INTO projects (slug, category, title, summary, description, challenge, solution, result, image, label, industry, services)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.slug, item.category, item.title, item.summary, item.description, item.challenge, item.solution, item.result, item.image, item.label, item.industry, json(item.services)]
    );
  }
  for (const item of industries) {
    await connection.execute(
      `INSERT INTO industries (slug, name, summary, description, image, focus) VALUES (?, ?, ?, ?, ?, ?)`,
      [item.slug, item.name, item.summary, item.description, item.image, json(item.focus)]
    );
  }
  for (const [index, item] of technologies.entries()) {
    await connection.execute(
      "INSERT INTO technologies (name, category, sort_order) VALUES (?, ?, ?)",
      [item.name, item.category, index]
    );
  }
  for (const [index, item] of architecture.entries()) {
    await connection.execute(
      "INSERT INTO architecture (number, title, text, sort_order) VALUES (?, ?, ?, ?)",
      [item.number, item.title, item.text, index]
    );
  }
  for (const [index, item] of processSteps.entries()) {
    await connection.execute(
      "INSERT INTO process_steps (number, title, summary, details, sort_order) VALUES (?, ?, ?, ?, ?)",
      [item.number, item.title, item.summary, item.details, index]
    );
  }
  for (const [index, item] of principles.entries()) {
    await connection.execute(
      "INSERT INTO principles (title, text, sort_order) VALUES (?, ?, ?)",
      [item.title, item.text, index]
    );
  }
  for (const [index, item] of team.entries()) {
    await connection.execute(
      "INSERT INTO team (role, focus, image, sort_order) VALUES (?, ?, ?, ?)",
      [item.role, item.focus, item.image, index]
    );
  }
  for (const [index, item] of testimonials.entries()) {
    await connection.execute(
      "INSERT INTO testimonials (quote, attribution, sort_order) VALUES (?, ?, ?)",
      [item.quote, item.attribution, index]
    );
  }
  for (const item of insights) {
    await connection.execute(
      `INSERT INTO insights (slug, title, excerpt, category, published_on, image, body) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [item.slug, item.title, item.excerpt, item.category, item.publishedOn, item.image, item.body]
    );
  }
  for (const item of jobs) {
    await connection.execute(
      `INSERT INTO jobs (slug, title, location, type, summary, description) VALUES (?, ?, ?, ?, ?, ?)`,
      [item.slug, item.title, item.location, item.type, item.summary, item.description]
    );
  }

  await connection.end();

  console.log("Initializing and verifying admin tables and college data...");
  try {
    await ensureAdmins();
    await ensureCopy();
    await ensureColleges();
    await ensureApplications();
    await ensureInquiries();
    await ensureRecycleBin();
    await seedColleges();
    console.log("Admin tables & 50+ Maharashtra colleges initialized.");
  } catch (err) {
    console.warn("Notice initializing admin tables:", err.message);
  }
  console.log(`Database "${database}" is ready on ${serverConfig.host}:${serverConfig.port}.`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Database setup failed.");
  console.error(error.message);
  process.exit(1);
});
