# Memoria de Sesión (Traspaso)

**Fecha/Hora Última Actualización:** 2026-04-15 (Categorización masiva de Skills ASO)

## 1. Estado Actual (Resumen Técnico)
*   **Tarea completada:** Categorización y traducción masiva de todas las Skills del ecosistema Antigravity (activas + vault).
*   **Skills procesadas:** 72 skills (13 activas + 59 en vault). Solo 1 skip (`wp-rest-api-security-workflow` sin SKILL.md).
*   **Script creado:** `~/.gemini/antigravity/scripts/categorize_skills.py` — reutilizable para futuras skills nuevas.
*   **UI actualizada:** `App.jsx` del ASO ahora tiene pills de filtro por categoría encima del grid. Se resetean al cambiar de tab.
*   **Taxonomía de categorías definitiva:**
    - `🛠️ Metodología` — planning, kaizen, debugging, git, github-*
    - `⚡ WordPress` — wp-*, woocommerce-*, rankmath-*, wordpress-*
    - `🎨 Diseño & UI` — stitch, ui-ux-pro-max, web-animations, premium-store-locator
    - `🤖 IA & Agentes` — notebooklm-*, skill-*, find-skills, agent-browser, autonomous-skill-hunter
    - `🔄 Automatización` — n8n-*, meta-instagram-api, experto-pixel-meta
    - `🖥️ Desarrollo Web` — nextjs, angular, dotnet, tauri
    - `📦 Utilidades` — pdf, font-converter, video-*, email-signature

## 2. Gotchas (Trampas Evadidas)
*   *Nota Crítica:* Los archivos SKILL.md en formato "link" (simples archivos de texto con ruta, no carpetas) NO son procesados por el parseador del backend. Ej: `agent-browser`, `find-skills`, `wordpress-pro` son ficheros planos — el backend los ignora y no los muestra en el vault. Solución: convertirlos en carpetas con SKILL.md dentro cuando haga falta activarlos.
*   El script Python funciona con `re.MULTILINE` para editar el frontmatter YAML — no usar pyYAML dump porque destruye el orden y los emojis.
*   Los emojis en las categorías deben ir entre comillas dobles en el YAML para evitar errores de parsing.

## 3. Siguientes Pasos (Handoff)
1. El documento sobre "MCP y Agentes de IA en WordPress" que Álvaro compartió al inicio de la sesión aún **no se ha procesado**. Álvaro quiso hacer primero la categorización. Cuando retome, preguntar qué hacer con ese documento (A=NotebookLM, B=Directiva, C=Skill, D=Plan implementación, E=Archivar).
2. La skill `wp-rest-api-security-workflow` no tiene SKILL.md — decidir si crearla o borrarla.
3. Los servidores ASO están corriendo en `:4000` (backend) y `:5173` (frontend Vite).

