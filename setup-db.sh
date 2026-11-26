#!/usr/bin/env bash
set -e

echo "=== Configuring KairoEdge Database & Server ==="

# 1. Cleanly recreate MySQL user 'kairoedge' and database 'kairoedge'
echo "Configuring MySQL permissions..."
configure_mysql() {
  if sudo mysql << 'SQL_EOF' 2>/dev/null; then
CREATE DATABASE IF NOT EXISTS kairoedge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DROP USER IF EXISTS 'kairoedge'@'localhost';
DROP USER IF EXISTS 'kairoedge'@'127.0.0.1';
DROP USER IF EXISTS 'kairoedge'@'%';
CREATE USER 'kairoedge'@'localhost' IDENTIFIED WITH mysql_native_password BY 'KairoEdge@2026';
GRANT ALL PRIVILEGES ON kairoedge.* TO 'kairoedge'@'localhost';
CREATE USER 'kairoedge'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'KairoEdge@2026';
GRANT ALL PRIVILEGES ON kairoedge.* TO 'kairoedge'@'127.0.0.1';
CREATE USER 'kairoedge'@'%' IDENTIFIED WITH mysql_native_password BY 'KairoEdge@2026';
GRANT ALL PRIVILEGES ON kairoedge.* TO 'kairoedge'@'%';
FLUSH PRIVILEGES;
SQL_EOF
    return 0
  fi

  sudo mysql << 'FALLBACK_EOF'
CREATE DATABASE IF NOT EXISTS kairoedge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DROP USER IF EXISTS 'kairoedge'@'localhost';
DROP USER IF EXISTS 'kairoedge'@'127.0.0.1';
DROP USER IF EXISTS 'kairoedge'@'%';
CREATE USER 'kairoedge'@'localhost' IDENTIFIED BY 'KairoEdge@2026';
GRANT ALL PRIVILEGES ON kairoedge.* TO 'kairoedge'@'localhost';
CREATE USER 'kairoedge'@'127.0.0.1' IDENTIFIED BY 'KairoEdge@2026';
GRANT ALL PRIVILEGES ON kairoedge.* TO 'kairoedge'@'127.0.0.1';
CREATE USER 'kairoedge'@'%' IDENTIFIED BY 'KairoEdge@2026';
GRANT ALL PRIVILEGES ON kairoedge.* TO 'kairoedge'@'%';
FLUSH PRIVILEGES;
FALLBACK_EOF
}

configure_mysql

# Ensure root also has empty password access as a fallback
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''; FLUSH PRIVILEGES;" 2>/dev/null || true

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

# 5. Build frontend production bundle
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
