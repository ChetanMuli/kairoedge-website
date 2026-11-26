#!/usr/bin/env bash
set -e

echo "=== Configuring KairoEdge Database & Server ==="

# 1. Configure MySQL users for %, localhost, and 127.0.0.1
sudo mysql << 'SQL_EOF'
CREATE DATABASE IF NOT EXISTS kairoedge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'kairoedge'@'%' IDENTIFIED BY 'KairoEdge@2026';
ALTER USER 'kairoedge'@'%' IDENTIFIED BY 'KairoEdge@2026';
GRANT ALL PRIVILEGES ON kairoedge.* TO 'kairoedge'@'%';

CREATE USER IF NOT EXISTS 'kairoedge'@'localhost' IDENTIFIED BY 'KairoEdge@2026';
ALTER USER 'kairoedge'@'localhost' IDENTIFIED BY 'KairoEdge@2026';
GRANT ALL PRIVILEGES ON kairoedge.* TO 'kairoedge'@'localhost';

CREATE USER IF NOT EXISTS 'kairoedge'@'127.0.0.1' IDENTIFIED BY 'KairoEdge@2026';
ALTER USER 'kairoedge'@'127.0.0.1' IDENTIFIED BY 'KairoEdge@2026';
GRANT ALL PRIVILEGES ON kairoedge.* TO 'kairoedge'@'127.0.0.1';

FLUSH PRIVILEGES;
SQL_EOF

echo "✓ MySQL database 'kairoedge' and user 'kairoedge' granted full permissions."

# 2. Write server/.env
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

echo "✓ server/.env file configured."

# 3. Ensure uploads folder exists with full write permissions
mkdir -p uploads
chmod -R 777 uploads 2>/dev/null || true
echo "✓ uploads directory ready with full permissions."

# 4. Run database setup and auto-seed tables
node server/src/setup.js

# 5. Restart PM2 processes
if command -v pm2 &> /dev/null; then
  pm2 restart all || true
  echo "✓ PM2 services restarted."
fi

echo "================================================="
echo "🎉 SUCCESS: KairoEdge database & server are LIVE!"
echo "================================================="
