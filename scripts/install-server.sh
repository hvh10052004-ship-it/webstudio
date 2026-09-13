#!/usr/bin/env bash
set -euo pipefail

# Cai WebStudio chay 24/7 tren Ubuntu (VPS hoac may Linux).
# Chay bang root, trong thu muc du an:
#   sudo bash scripts/install-server.sh

APP_DIR="${APP_DIR:-/opt/webstudio}"
SRC_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NODE_MAJOR="${NODE_MAJOR:-22}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Can chay bang root: sudo bash scripts/install-server.sh"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y ca-certificates curl build-essential python3

if ! command -v node >/dev/null 2>&1 || [[ "$(node -p "process.versions.node.split('.')[0]")" -lt "$NODE_MAJOR" ]]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi

id -u webstudio >/dev/null 2>&1 || useradd --system --home "$APP_DIR" --shell /usr/sbin/nologin webstudio

mkdir -p "$APP_DIR"
if [[ "$SRC_DIR" != "$APP_DIR" ]]; then
  rsync -a --delete \
    --exclude node_modules \
    --exclude .next \
    --exclude .git \
    "$SRC_DIR/" "$APP_DIR/"
fi

mkdir -p "$APP_DIR/data" "$APP_DIR/public/avatars" "$APP_DIR/public/chat"
if [[ ! -f "$APP_DIR/.env" ]]; then
  cp "$APP_DIR/.env.example" "$APP_DIR/.env"
  SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
  sed -i "s/doi-chuoi-nay-khi-chay-that/${SECRET}/" "$APP_DIR/.env"
fi

chown -R webstudio:webstudio "$APP_DIR"
cd "$APP_DIR"
sudo -u webstudio npm install
sudo -u webstudio npm run build

install -m 644 "$APP_DIR/deploy/webstudio.service" /etc/systemd/system/webstudio.service
systemctl daemon-reload
systemctl enable --now webstudio

ufw allow 3000/tcp || true

IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
echo
echo "WebStudio dang chay 24/7."
echo "Mo tren dien thoai: http://${IP:-IP-MAY-CHU}:3000"
echo "App khach:          http://${IP:-IP-MAY-CHU}:3000/app-khach"
echo "Admin:              http://${IP:-IP-MAY-CHU}:3000/admin"
echo "Tai APK moi tu:     http://${IP:-IP-MAY-CHU}:3000/tai-ung-dung"
