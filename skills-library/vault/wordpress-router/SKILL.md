---
name: wordpress-router
description: "Úsalo cuando el usuario pregunte sobre bases de código de WordPress (plugins, temas, temas de bloques, bloques de Gutenberg, checkouts del núcleo de WP) y necesites clasificar rápidamente el repositorio y enrutar al flujo de trabajo/skill correcto (bloques, theme.json, API REST, WP-CLI, rendimiento, seguridad, pruebas, empaquetado de lanzamiento)."
compatibility: "Objetivo WordPress 6.9+ (PHP 7.2.24+). Agente basado en sistema de archivos con bash + node. Algunos flujos de trabajo requieren WP-CLI."
category: ["WP MCP", "wordpress"]
---

# Enrutador de WordPress

## Cuándo usar

Usa esta skill al comienzo de la mayoría de las tareas de WordPress para:

- identificar qué tipo de base de código de WordPress es esta (plugin vs tema vs tema de bloques vs checkout del núcleo de WP vs sitio completo),
- elegir el flujo de trabajo y medidas de seguridad correctas,
- delegar a la(s) skill(s) de dominio más relevante(s).

## Entradas requeridas

- Raíz del repositorio (directorio de trabajo actual).
- La intención del usuario (qué quieren cambiar) y cualquier restricción (versiones objetivo de WP, detalles de WP.com, requisitos de lanzamiento).

## Procedimiento

1. Ejecuta el script de clasificación del proyecto:
   - `node skills/wp-project-triage/scripts/detect_wp_project.mjs`
2. Lee la salida de la clasificación y clasifica:
   - tipo(s) de proyecto principal(es),
   - herramientas disponibles (PHP/Composer, Node, @wordpress/scripts),
   - pruebas presentes (PHPUnit, Playwright, wp-env),
   - cualquier pista sobre la versión.
3. Enruta a flujos de trabajo de dominio basados en la intención del usuario + tipo de repositorio:
   - Para el árbol de decisión, lee: `skills/wordpress-router/references/decision-tree.md`.
4. Aplica las medidas de seguridad antes de realizar cambios:
   - Confirma cualquier restricción de versión si no está clara.
   - Prefiere las herramientas y convenciones existentes del repositorio para compilaciones/pruebas.

## Verificación

- Vuelve a ejecutar el script de clasificación si creas o reestructuras archivos significativos.
- Ejecuta los comandos lint/test/build del repositorio que recomiende la salida de la clasificación (si están disponibles).

## Modos de fallo / depuración

- Si la clasificación reporta `kind: unknown`, inspecciona:
  - `composer.json`, `package.json`, `style.css`, `block.json`, `theme.json`, `wp-content/` en la raíz.
- Si el repositorio es enorme, considera reducir el alcance del escaneo o añadir reglas de ignorado al script de clasificación.

## Escalada

- Si el enrutamiento es ambiguo, haz una pregunta:
  - "¿Está destinado esto a ser un plugin de WordPress, un tema (clásico/bloques), o un repositorio de sitio completo?"
