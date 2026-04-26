#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
echo "Iniciando Antigravity Skill Orchestrator (ASO)..."

# 1. Matar procesos anteriores
echo "Limpiando instancias anteriores..."
pkill -f "node server.js" || true
pkill -f "vite" || true

# Capturar la ruta del proyecto desde donde se invocó el comando o por argumento
export ASO_PROJECT_PATH="${1:-$PWD}"
echo "Directorio de Trabajo: $ASO_PROJECT_PATH"

# 2. Levantar el Backend (Puerto 4000)
echo "Levantando el Vault Backend (Puerto 4000)..."
cd /Users/uskas/.gemini/antigravity/aso-app/backend
nohup npm start > /dev/null 2>&1 &
sleep 2

# 3. Levantar el Frontend (Vite)
echo "Levantando el Midnight Terminal (Frontend Vite)..."
cd /Users/uskas/.gemini/antigravity/aso-app/frontend
nohup npm run dev -- --port 5174 --strictPort > /dev/null 2>&1 &
sleep 2

# 4. Abrir en el navegador predeterminado (macOS)
echo "ASO está listo. Abriendo en el navegador..."
open http://localhost:5174
