---
description: "Guía completa para usar el servidor MCP de Google NotebookLM. Úsala para gestionar cuadernos, fuentes, notas y artefactos de estudio vía agente."
category: "🤖 IA & Agentes"
---

# Experto en NotebookLM (MCP)

## Propósito
Desbloquear todo el potencial de Google NotebookLM a través del Protocolo de Contexto de Modelo (MCP). Esta skill proporciona las mejores prácticas para la interacción programática con NotebookLM, permitiendo la investigación automatizada, la generación de contenido y la gestión del conocimiento.

## Instrucciones

### 1. Gestión de Notebooks e Ingesta Inteligente (Smart Discovery)
- **Consulta antes de Etiquetar**: Si desconoces el contenido de un notebook existente o una fuente nueva, *interrógalo primero*.
    1. Añade la fuente/URL.
    2. Usa `notebook_query` con: *"¿Cuál es el contenido principal de este notebook? ¿Qué temas cubre? Dame un resumen y 3 etiquetas clave."*
    3. Usa esa respuesta para renombrar el notebook (`notebook_rename`) con un título preciso y descripciones ricas.
- **Nombres Claros**: Usa títulos descriptivos basados en el contenido real, no adivinanzas.

### 2. Gestión y Preparación de Fuentes
- **Todo es Texto**: Si NotebookLM no acepta un formato (ej. epub, código fuente complejo), conviértelo a Markdown o Texto Plano primero.
    - **YouTube/Web**: Usa las herramientas nativas de NotebookLM, son muy potentes.
    - **Formatos Exóticos**: Para archivos no soportados, extrae el texto y usa `source_add(source_type="text")`.
- **Entradas Diversas**: NotebookLM destaca con varias fuentes. Usa `source_add` para:
    - **URLs**: Páginas web, documentación técnica o videos de YouTube.
    - **Archivos**: PDFs locales, archivos de texto o audio (MP3/WAV).
    - **Drive**: Documentos de Google Drive (requiere autenticación).
    - **Texto**: Pegado directo de texto para inyección rápida de contexto.
- **Sincronización**: Para fuentes dinámicas de Drive, usa `source_sync_drive` para mantener el contenido actualizado.
- **Capacidad**: Ten en cuenta el límite de fuentes por notebook (actualmente 50).

### 3. Consultas e Investigación
- **Investigación Profunda (Deep Research)**: Usa `research_start` con `mode="deep"` para búsquedas web exhaustivas y encontrar *nuevas* fuentes. Haz seguimiento con `research_status` e importa con `research_import`.
- **Consultar Fuentes**: Usa `notebook_query` para hacer preguntas *específicamente* sobre las fuentes añadidas. Esto es RAG (Generación Aumentada por Recuperación) en su máxima expresión.
- **Citas**: NotebookLM proporciona citas. Se pueden pasar IDs de fuentes específicos a `notebook_query` para limitar el contexto.

### 4. Generación de Contenido (Studio)
- **Resúmenes de Audio (Podcasts)**: Genera podcasts usando `studio_create(artifact_type="audio")`. Personaliza con `audio_format` (deep_dive, brief, etc.).
- **Materiales de Estudio**: Crea `report` (Briefing Doc, Guía de Estudio) o `quiz` / `flashcards` para sintetizar información.
- **Visuales**: Usa `studio_create` para `mind_map` y visualizar conexiones.

## Mejores Prácticas
- **Autenticación**: Asegura que el servidor esté autenticado. Si `notebook_list` falla, indica al usuario que ejecute `nlm login` o use `refresh_auth`.
- **Sondeo (Polling)**: Operaciones largas como `research_start` o `studio_create` pueden requerir sondear `research_status` o `studio_status`.
- **Manejo de Errores**: Si una herramienta falla (ej. análisis de fuente), verifica el formato del archivo y la accesibilidad.

## Flujos de Trabajo Comunes
- **Flujo de Investigación**: `notebook_create` -> `research_start` -> `research_import` -> `studio_create (artifact_type="report", report_format="Briefing Doc")`.
- **Flujo de Aprendizaje**: `source_add (libro/docs)` -> `studio_create (artifact_type="audio")` -> `studio_create (artifact_type="quiz")`.
