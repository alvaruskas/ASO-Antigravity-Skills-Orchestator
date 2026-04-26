#!/bin/bash
echo "🚀 Instalando dependencias de Antigravity Skill Orchestrator..."

# Directorio base
BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "📦 Instalando Backend..."
cd "$BASE_DIR/aso-app-codigo-fuente/backend" && npm install

echo "📦 Instalando Frontend..."
cd "$BASE_DIR/aso-app-codigo-fuente/frontend" && npm install

echo "✅ Instalación completada. Puedes iniciar la app con ./start_aso.sh"
