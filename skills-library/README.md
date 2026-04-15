# 📚 Skills Library — Antigravity Agent

Colección completa de skills del ecosistema Antigravity.  
Cada skill es una carpeta con un `SKILL.md` que define el comportamiento del agente para una tarea específica.

## Estructura

```
skills-library/
├── [skills activas por defecto]   ← Estas se cargan al arrancar ASO
│   ├── concise-planning/
│   ├── kaizen/
│   ├── git-pushing/
│   └── ...
└── vault/                         ← Bóveda: disponibles, inactivas por defecto
    ├── wordpress-pro/
    ├── n8n-workflow-patterns/
    ├── notebooklm-expert/
    └── ...
```

## Categorías disponibles

| Emoji | Categoría | Descripción |
|---|---|---|
| 🛠️ | **Metodología** | Git, planificación, debugging, CI/CD |
| ⚡ | **WordPress** | WP core, WooCommerce, SEO, seguridad |
| 🎨 | **Diseño & UI** | Stitch, animaciones, UX/UI premium |
| 🤖 | **IA & Agentes** | NotebookLM, skill management, agentes autónomos |
| 🔄 | **Automatización** | n8n (7 skills), Meta Pixel, Instagram API |
| 🖥️ | **Desarrollo Web** | Next.js, Angular, .NET, Tauri |
| 📦 | **Utilidades** | PDF, fuentes, vídeo, email signatures |

## Cómo usar una skill

### Con ASO (recomendado)
1. Abre ASO y ve a la **Bóveda (Vault)**
2. Encuentra la skill y activa el toggle
3. El agente la incorpora al contexto automáticamente

### Manualmente (con Gemini CLI u otro agente)
Copia la carpeta de la skill que quieras a tu directorio de skills activas del agente:

```bash
# Ejemplo: activar wordpress-pro
cp -r skills-library/vault/wordpress-pro ~/.gemini/antigravity/skills/
```

## Crear una nueva skill

Copia la estructura básica:

```yaml
---
name: mi-nueva-skill
description: "Descripción de qué hace esta skill."
category: "🛠️ Metodología"
---

# Mi Nueva Skill

## Propósito
...

## Instrucciones
1. ...

## Casos Borde
- Nota: ...
```

Guárdala en `skills-library/vault/mi-nueva-skill/SKILL.md` y desde ASO podrás activarla.
