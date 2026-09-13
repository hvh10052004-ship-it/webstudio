# Chay WebStudio production tren may Windows (de mo 24/7 neu may khong tat).
$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

if (-not (Test-Path ".\.next")) {
  npm run build
}

$env:NODE_ENV = "production"
$env:HOSTNAME = "0.0.0.0"
$env:PORT = "3000"
npm run start:prod
