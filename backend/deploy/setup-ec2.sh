#!/bin/bash
# ==============================================================================
# Saathi Backend - AWS EC2 (Ubuntu 22.04 / 24.04 LTS) Automated Setup Script
# ==============================================================================

set -e

echo "🚀 Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

echo "📦 Installing Node.js 20 LTS, Git, and build tools..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx

echo "🛠️ Installing PM2 globally..."
sudo npm install -g pm2

echo "✅ Node version: $(node -v)"
echo "✅ NPM version: $(npm -v)"
echo "✅ PM2 version: $(pm2 -v)"

# Configure firewall (UFW)
echo "🛡️ Configuring UFW firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "🎉 Base environment setup complete! Next steps:"
echo "1. Clone your repository into /home/ubuntu/saathi"
echo "2. Copy backend/.env file with your production secrets"
echo "3. Run 'npm ci --production' inside backend/"
echo "4. Start with PM2: 'pm2 start ecosystem.config.js --env production'"
echo "5. Configure Nginx with backend/deploy/nginx-saathi.conf"
