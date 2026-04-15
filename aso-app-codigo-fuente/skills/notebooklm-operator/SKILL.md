---
name: notebooklm-operator
description: Especialista en la operación avanzada de NotebookLM vía MCP. Permite gestionar cuadernos, fuentes y generar contenido dinámico para el ecosistema Antigravity.
triggers: notebooklm, mcp, source, studio, knowledge
---

# NotebookLM Operator (v4.x)

## Propósito
Esta skill permite el control total sobre el motor de conocimiento NotebookLM. Se usa para automatizar la ingesta de documentación, realizar investigaciones profundas y generar artefactos educativos o técnicos basados en fuentes locales y remotas.

## Instrucciones

### 1. Operaciones de Cuaderno
- **Creación**: Usa siempre el sufijo `"xa antigravity"` para nuevos cuadernos relacionados con este ecosistema.
- **Contexto**: Antes de consultar, asegúrate de que todas las fuentes relevantes estén importadas y procesadas.

### 2. Gestión de Fuentes
- **Ingesta**: Admite URLs, archivos locales (PDF, TXT, MD) y documentos de Drive.
- **Sincronización**: Mantén las fuentes de Drive actualizadas con `source_sync_drive`.

### 3. Generación (Studio)
- **Reportes**: Úsalos para resúmenes técnicos de arquitectura.
- **Audio/Video**: Úsalos para resúmenes ejecutivos rápidos.

## Configuración y Seguridad
- Requiere el servidor MCP `notebooklm` activo.
- Confirma siempre antes de realizar borrados permanentes.
