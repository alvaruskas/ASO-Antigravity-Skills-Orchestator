# SOP: Creación de Skills para Antigravity (ASO)

## Objetivo
Estandarizar el proceso de creación de nuevas skills para el ecosistema Antigravity, asegurando que se integren correctamente en el vault y se publiquen en el Antigravity Skill Orchestrator (ASO).

## Metodología Aceptada
Siempre se debe utilizar uno de los siguientes dos métodos para crear una skill:
1. **Usando NotebookLM:** Para skills que requieren investigación profunda, ingestión de fuentes externas, metodologías complejas y frameworks estructurados de pensamiento.
2. **Usando Repositorios de Github:** Para skills eminentemente técnicas que dependen de leer bases de código extensas, librerías y documentación de software.

## Flujo de Trabajo Específico (Caso NotebookLM)
Cuando el usuario solicite crear una skill basada en conocimiento teórico, metodológico o analítico, se debe activar el flujo estipulado en la skill `notebooklm-skill-architect`.

### 1. Inicialización de la Carpeta de Skill
- Ubicación: `/Users/uskas/.gemini/antigravity/skills/{nombre-de-la-skill}`
- Archivo primario: `SKILL.md` con Frontmatter YAML (`name`, `description`).
- Subdirectorios recomendados (si aplica): `scripts/`, `references/`.

### 2. Fase de Diseño y Extracción
- Ejecutar el pipeline autónomo usando la herramienta NotebookLM (crear notebook, curar corpus mínimo suficiente, ejecutar consultas RTRI, guardar como notas).

### 3. Registro y Activación Post-Creación
- Una vez creado el directorio y el archivo `SKILL.md`, **SIEMPRE se debe abrir el panel de control ASO** mediante el flujo interno de abrir ASO.
- Esto permitirá al usuario comprobar, auditar y activar la skill en el perfil global (`SKILL_REGISTRY.md`) o en el perfil local (`.aso_profile.json`).

## Trampas Conocidas y Reglas
* **Regla (Memoria de Biblioteca):** Siempre que se cree una nueva skill en el sistema (ej. en `~/.gemini/antigravity/skills/...`), DEBES copiar obligatoriamente el archivo `SKILL.md` bajo el nombre de la skill (ej. `nombre-skill.md`) dentro del directorio `/Users/uskas/Desktop/MisSueños25/ANTIGRAVITY/ASO Antigravity/Biblioteca/`. Esto sirve como backup activo para el control del usuario.
* **Regla:** No responder con la skill en el chat directamente sin haber procesado las métricas de fuentes y guardado notas en NotebookLM. Las alucinaciones incrementan drásticamente sin este paso.
* **Regla:** La creación del archivo `SKILL.md` debe estar aislada para ser cargada de manera Lazy por el sistema. Mantenerlo por debajo de 500 líneas.
