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
import { dbConfig } from "./db.js";

const json = (value) => JSON.stringify(value);

async function main() {
  const connection = await mysql.createConnection(dbConfig);

  await connection.execute("DELETE FROM stats");
  for (const [index, item] of stats.entries()) {
    await connection.execute("INSERT INTO stats (value, label, sort_order) VALUES (?, ?, ?)", [item.value, item.label, index]);
  }

  for (const item of services) {
    await connection.execute(
      `UPDATE services SET number=?, title=?, summary=?, description=?, image=?, tags=?, outcomes=?, footer=? WHERE slug=?`,
      [item.number, item.title, item.summary, item.description, item.image, json(item.tags), json(item.outcomes), item.footer, item.slug]
    );
  }
  for (const item of projects) {
    await connection.execute(
      `UPDATE projects SET category=?, title=?, summary=?, description=?, challenge=?, solution=?, result=?, image=?, label=?, industry=?, services=? WHERE slug=?`,
      [item.category, item.title, item.summary, item.description, item.challenge, item.solution, item.result, item.image, item.label, item.industry, json(item.services), item.slug]
    );
  }
  for (const item of industries) {
    await connection.execute(
      `UPDATE industries SET name=?, summary=?, description=?, image=?, focus=? WHERE slug=?`,
      [item.name, item.summary, item.description, item.image, json(item.focus), item.slug]
    );
  }

  await connection.execute("DELETE FROM technologies");
  for (const [index, item] of technologies.entries()) {
    await connection.execute("INSERT INTO technologies (name, category, sort_order) VALUES (?, ?, ?)", [item.name, item.category, index]);
  }
  await connection.execute("DELETE FROM architecture");
  for (const [index, item] of architecture.entries()) {
    await connection.execute("INSERT INTO architecture (number, title, text, sort_order) VALUES (?, ?, ?, ?)", [item.number, item.title, item.text, index]);
  }
  await connection.execute("DELETE FROM process_steps");
  for (const [index, item] of processSteps.entries()) {
    await connection.execute("INSERT INTO process_steps (number, title, summary, details, sort_order) VALUES (?, ?, ?, ?, ?)", [item.number, item.title, item.summary, item.details, index]);
  }
  await connection.execute("DELETE FROM principles");
  for (const [index, item] of principles.entries()) {
    await connection.execute("INSERT INTO principles (title, text, sort_order) VALUES (?, ?, ?)", [item.title, item.text, index]);
  }
  await connection.execute("DELETE FROM team");
  for (const [index, item] of team.entries()) {
    await connection.execute("INSERT INTO team (role, focus, image, sort_order) VALUES (?, ?, ?, ?)", [item.role, item.focus, item.image, index]);
  }
  await connection.execute("DELETE FROM testimonials");
  for (const [index, item] of testimonials.entries()) {
    await connection.execute("INSERT INTO testimonials (quote, attribution, sort_order) VALUES (?, ?, ?)", [item.quote, item.attribution, index]);
  }
  for (const item of insights) {
    await connection.execute(
      `UPDATE insights SET title=?, excerpt=?, category=?, published_on=?, image=?, body=? WHERE slug=?`,
      [item.title, item.excerpt, item.category, item.publishedOn, item.image, item.body, item.slug]
    );
  }
  for (const item of jobs) {
    await connection.execute(
      `UPDATE jobs SET title=?, location=?, type=?, summary=?, description=? WHERE slug=?`,
      [item.title, item.location, item.type, item.summary, item.description, item.slug]
    );
  }

  await connection.end();
  console.log("Content refreshed. Inquiries were left in place.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
