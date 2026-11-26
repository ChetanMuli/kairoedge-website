#!/usr/bin/env bash
set -e

echo "=== Configuring KairoEdge Database & Server ==="

# 1. Cleanly recreate MySQL user 'kairoedge' and database 'kairoedge'
echo "Configuring MySQL permissions..."
configure_mysql() {
  sudo mysql << 'SQL_EOF' 2>/dev/null || sudo mysql
CREATE DATABASE IF NOT EXISTS kairoedge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DROP USER IF EXISTS 'kairoedge'@'localhost';
DROP USER IF EXISTS 'kairoedge'@'127.0.0.1';
DROP USER IF EXISTS 'kairoedge'@'%';
CREATE USER 'kairoedge'@'localhost' IDENTIFIED BY 'KairoEdge@2026';
CREATE USER 'kairoedge'@'127.0.0.1' IDENTIFIED BY 'KairoEdge@2026';
CREATE USER 'kairoedge'@'%' IDENTIFIED BY 'KairoEdge@2026';
GRANT ALL PRIVILEGES ON *.* TO 'kairoedge'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'kairoedge'@'127.0.0.1' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'kairoedge'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SQL_EOF

  # Support older MySQL 8.0 instances that use mysql_native_password
  sudo mysql -e "ALTER USER 'kairoedge'@'localhost' IDENTIFIED WITH mysql_native_password BY 'KairoEdge@2026'; ALTER USER 'kairoedge'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'KairoEdge@2026'; FLUSH PRIVILEGES;" 2>/dev/null || true
  sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''; FLUSH PRIVILEGES;" 2>/dev/null || true
}

configure_mysql
echo "✓ MySQL database 'kairoedge' and user 'kairoedge' granted full permissions."

# 2. Write both server/.env and root .env so configurations are 100% in sync
cat << 'ENV_EOF' > server/.env
PORT=4001
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=kairoedge
DB_PASSWORD=KairoEdge@2026
DB_NAME=kairoedge
ADMIN_USER=admin
ADMIN_PASSWORD=admin@12
ENV_EOF

cp -f server/.env .env
echo "✓ server/.env and root .env configured."

# 3. Ensure uploads folders exist with full write permissions
mkdir -p uploads
chmod -R 777 uploads 2>/dev/null || true
mkdir -p server/uploads
chmod -R 777 server/uploads 2>/dev/null || true
echo "✓ uploads directories ready with full permissions."

# 4. Run database setup and auto-seed tables
echo "Seeding database tables and Maharashtra colleges..."
node server/src/setup.js
if [ -f server/src/seed_colleges_districtwise.sql ]; then
  sudo mysql kairoedge < server/src/seed_colleges_districtwise.sql 2>/dev/null || true
  echo "✓ District-wise Maharashtra colleges loaded into database."
fi

# 5. Clean up any duplicate colleges from previous runs
echo "Deduplicating colleges in MySQL..."
sudo mysql kairoedge << 'DEDUP_EOF' 2>/dev/null || true
DELETE c1 FROM colleges c1
INNER JOIN colleges c2 
WHERE c1.id > c2.id 
  AND LOWER(TRIM(c1.name)) = LOWER(TRIM(c2.name));

DELETE c1 FROM colleges c1
INNER JOIN colleges c2 
WHERE c1.id > c2.id 
  AND c1.code IS NOT NULL 
  AND c1.code != '' 
  AND LOWER(TRIM(c1.code)) = LOWER(TRIM(c2.code));

UPDATE colleges SET district = city WHERE (district IS NULL OR district = '') AND city IS NOT NULL;
DEDUP_EOF
echo "✓ Colleges deduplicated cleanly."

# 6. Build frontend production bundle
echo "Building frontend production bundle..."
npm run build || true

# 6. Restart PM2 processes
if command -v pm2 &> /dev/null; then
  echo "Restarting backend services with PM2..."
  pm2 restart all || true
  if ! pm2 list | grep -q "kairoedge"; then
    pm2 start server/src/index.js --name "kairoedge-api" || true
  fi
  pm2 save || true
  echo "✓ PM2 services restarted."
fi

echo "================================================="
echo "🎉 SUCCESS: KairoEdge database & server are LIVE!"
echo "================================================="
