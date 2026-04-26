# Directiva: Búsqueda y Adaptación de Skill para Elementor HTML

## Objetivo
Encontrar o crear una skill que permita generar código HTML/CSS/JS optimizado para ser insertado en widgets de Elementor (WordPress), asegurando compatibilidad con el editor y estética premium.

## Entradas
- Palabras clave: `elementor`, `html widget`, `wordpress design`, `ui components`.

## Salidas
- Skill instalada en el Vault: `~/.gemini/antigravity/skills/elementor-html-master/`.
- Memoria de sesión actualizada.

## Lógica de Ejecución (SOP)
1. **Scouting (Fase 1 de autonomous-skill-hunter):**
   - Ejecutar `npx skills find elementor` (Investigación manual vía API realizada debido a fallo de node).
   - Buscar en repositorios de referencia (msrbuilds/elementor-mcp).
2. **Auditoría (Fase 2):**
   - Verificar que la skill incluya reglas para:
     - No usar etiquetas globales (`<html>`, `<body>`).
     - Scoping de CSS.
     - Micro-interacciones (Bento, 3D Tilt).
3. **Instalación (Fase 3):**
   - Instalada en `~/.gemini/antigravity/skills/elementor-html-master/`.
4. **Activación Visual (Fase 4):**
   - ASO iniciado.

## Casos Borde / Restricciones
- Priorizar Vanilla JS/CSS.
- Manejar `z-index` para no interferir con el Admin Bar de WP.

## Hitos
- [X] Búsqueda inicial realizada (Investigación de repositorios MCP y Awesome Skills).
- [X] Skill seleccionada/adaptada (Creación de `elementor-html-master`).
- [X] Instalación en Vault completada.
- [X] ASO iniciado para revisión final.
