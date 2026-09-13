#!/usr/bin/env bash
cd "$(dirname "$0")"
npm install
npm run setup
echo "Chay: npm run dev"
echo "App: http://localhost:3000/app-khach"
