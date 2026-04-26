---
name: wordpress-router
description: "Clasificador y enrutador de repositorios WordPress. Detecta el tipo de proyecto (plugin, tema, bloque) y aplica el flujo de trabajo correcto."
compatibility: "Dirigido a WordPress 6.9+ (PHP 7.2.24+). Agente basado en sistema de archivos con bash + node. Algunos flujos requieren WP-CLI."
category: "WP MCP, wordpress"
---

# Enrutador de WordPress (WordPress Router)

## Cuándo usarlo

Usa esta skill al inicio de la mayoría de las tareas de WordPress para:

- Identificar qué tipo de base de código de WordPress es esta (plugin vs tema vs tema de bloques vs instalación de núcleo de WP vs sitio completo).
- Seleccionar el flujo de trabajo y las salvaguardas adecuadas.
- Delegar a la(s) skill(s) de dominio más relevante(s).

## Entradas requeridas

- Raíz del repositorio (directorio de trabajo actual).
- La intención del usuario (qué desea cambiar) y cualquier restricción (versiones de WP objetivo, especificidades de WP.com, requisitos de lanzamiento).

## Procedimiento

1. Ejecuta el script de triaje del proyecto:
   - `node skills/wp-project-triage/scripts/detect_wp_project.mjs`
2. Lee la salida del triaje y clasifica:
   - Tipo(s) de proyecto principal(es).
   - Herramientas disponibles (PHP/Composer, Node, @wordpress/scripts).
   - Pruebas presentes (PHPUnit, Playwright, wp-env).
   - Cualquier pista sobre la versión.
3. Enruta a los flujos de trabajo de dominio basados en la intención del usuario + tipo de repositorio:
   - Para el árbol de decisión, consulta: `skills/wordpress-router/references/decision-tree.md`.
4. Aplica salvaguardas antes de realizar cambios:
   - Confirma cualquier restricción de versión si no está clara.
   - Prefiere las herramientas y convenciones existentes del repositorio para compilaciones/pruebas.

## Verificación

- Vuelve a ejecutar el script de triaje si creas o reestructuras archivos significativos.
- Ejecuta los comandos de lint/test/build del repositorio que recomiende la salida del triaje (si están disponibles).

## Modos de fallo / depuración

- Si el triaje informa `kind: unknown` (tipo: desconocido), inspecciona:
  - Archivos raíz: `composer.json`, `package.json`, `style.css`, `block.json`, `theme.json`, `wp-content/`.
- Si el repositorio es muy grande, considera reducir el alcance del escaneo o añadir reglas de ignorado al script de triaje.

## Escalación

- Si el enrutamiento es ambiguo, haz una pregunta:
  - "¿Este repositorio está destinado a ser un plugin de WordPress, un tema (clásico/de bloques) o un sitio completo?"
