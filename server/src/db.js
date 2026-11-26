import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure .env is loaded regardless of process.cwd() (server/ or repo root)
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const socketPath = "/var/run/mysqld/mysqld.sock";
const hasSocket = fs.existsSync(socketPath);

export const dbConfig = {
  host: process.env.DB_HOST || (hasSocket ? undefined : "127.0.0.1"),
  socketPath: process.env.DB_SOCKET || (hasSocket && !process.env.DB_HOST ? socketPath : undefined),
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "kairoedge",
  waitForConnections: true,
  connectionLimit: 10
};

export const pool = mysql.createPool(dbConfig);

export async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}
