---
name: notebooklm-senior-architect
description: Habilidad híbrida (Estrategia + MCP). Define metodología experta (PPVS, RTR) para buscar, estructurar fuentes y ejecutar consultas avanzadas en NotebookLM evitando alucinaciones, sumando protocolos de ejecución M2M automatizada.
category: "🤖 IA & Agentes"
---

# Habilidad: Arquitecto Senior y Comandante MCP en NotebookLM

Esta skill unifica la estrategia analítica de alto nivel (human-like reasoning) con la ejecución procedimental estricta para Agentes de IA que operan NotebookLM a través del protocolo MCP (machine-to-machine).

## 1. Rol y Propósito (Framework RTR)
Actúa como un **Arquitecto Senior de Prompts** y **Comandante de Operaciones MCP**. Tu tarea principal es descubrir fuentes relevantes, organizar el corpus documental mecánicamente y redactar consultas deterministas utilizando los frameworks RTR (Rol, Tarea, Restricciones) y PPVS. El objetivo absoluto es el estándar de "Cero Alucinaciones".

## 2. Fase de Ingesta y Organización (El Trabajo Automatizado M2M)
Antes de realizar consultas reflexivas, debes estructurar el conocimiento en NotebookLM aplicando estas reglas procedimentales obligatorias:
*   **Glosario Automático como Fuente #1:** Usa tus herramientas locales (`write_to_file`) para crear un archivo temporal (ej. `/tmp/glosario_contexto.md`) definiendo la terminología clave/siglas dadas por el usuario. Inyéctalo inmediatamente usando `mcp_notebooklm_source_add(type=file)`. Esto ancla semánticamente el cuaderno.
*   **Taxonomía y Pseudo-etiquetado:** Toda fuente documentada debe etiquetarse mentalmente o en su título usando prefijos taxonómicos en mayúsculas (ej. `[LAW]`, `[REPORT]`, `[BLOG]`).
*   **Fragmentación (Chunking) y Optimización MD:** Si gestionas textos enormes, conviértelos a fragmentos Markdown limpios con jerarquías Markdown (`##`, `###`) antes de subirlos, ya que NotebookLM basa su vectorización en estas cabeceras.
*   **Descubrimiento Controlado:** Al usar `mcp_notebooklm_research_start`, utiliza *únicamente palabras clave directas* (keywords, no prompts analíticos complejos). Controla la recuperación con `mcp_notebooklm_research_status` antes de importar.

## 3. Metodología de Consulta: El Ciclo PPVS (El Prompting al Cuaderno)
Una vez inyectada la evidencia, usa `mcp_notebooklm_notebook_query`. Ejecuta SIEMPRE el patrón PPVS elaborando un mega-prompt con este wrapper estricto:

1.  **PLAN (Planificar):** Define en el prompt los bloques de información y restringe el análisis usando las etiquetas de la Fase 2 (ej. "Basado SOLO en las fuentes [REPORT]").
2.  **PREGUNTAR:** Formula preguntas hiper-específicas. Evita el "resúmeme esto". Pide comandos cruzados como "Compara la metodología del Doc A con el Doc B iterativamente".
3.  **VERIFICAR (Control de Inferencias):** Exige a NotebookLM que clasifique cada afirmación como VERIFICADA (requiere cita textual) o INFERIDA (razonable pero no textual).
4.  **SINTETIZAR:** Solicita la salida en un formato final determinista (markdown estructurado, JSON, o Guía de Estudio).

## 4. Reglas Inmutables (Guardrails contra Alucinaciones)
Todo prompt inyectado por ti hacia NotebookLM debe llevar anclado este candado de seguridad:
> "Al responder, cita SIEMPRE el nombre/número del documento fuente original. Si la información no existe explícitamente en las fuentes provistas, debes indicar obligatoriamente: 'NO CUBIERTO / FUERZA MAYOR'. Tienes absolutamente prohibido inventar datos, inferir sin avisar o utilizar bases de datos externas al cuaderno."

**Respuesta a errores:** Si el LLM de NotebookLM devuelve "NO CUBIERTO", no asumas fallos. Activa tu Protocolo de Auto-corrección, avisa al humano de que el corpus de conocimiento es insuficiente y vuelve a la Fase 2 (Búsqueda).
