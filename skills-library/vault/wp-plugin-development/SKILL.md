---
name: wp-plugin-development
description: "Usa esta skill al desarrollar plugins de WordPress: arquitectura y hooks, activación/desactivación/desinstalación, interfaz de administración y Settings API, almacenamiento de datos, cron/tareas, seguridad (nonces/capacidades/sanitización/escape) y empaquetado de versiones."
compatibility: "Dirigido a WordPress 6.9+ (PHP 7.2.24+). Agente basado en sistema de archivos con bash + node. Algunos flujos requieren WP-CLI."
category: "⚡ WordPress"
---

# Desarrollo de Plugins WP

## Cuándo usar

Usa esta skill para trabajos de desarrollo de plugins como:

- Crear o refactorizar la estructura de un plugin (bootstrap, includes, namespaces/clases).
- Añadir hooks/acciones/filtros.
- Comportamiento de activación/desactivación/desinstalación y migraciones.
- Añadir páginas de ajustes / opciones / interfaz de administración (Settings API).
- Correcciones de seguridad (nonces, capacidades, sanitización/escape, seguridad SQL).
- Empaquetar una versión (archivos de build, readme, activos).

## Entradas requeridas

- Raíz del repositorio + plugin(s) objetivo (ruta al archivo principal del plugin si se conoce).
- Dónde se ejecuta el plugin: sitio único vs multisitio; convenciones de WP.com si aplica.
- Versiones objetivo de WordPress + PHP (afecta a las APIs disponibles y al soporte de marcadores de posición en `$wpdb->prepare()`).

## Procedimiento

### 0) Triaje y localización de puntos de entrada del plugin

1. Ejecuta el triaje:
   - `node skills/wp-project-triage/scripts/detect_wp_project.mjs`
2. Detecta las cabeceras de los plugins (escaneo determinista):
   - `node skills/wp-plugin-development/scripts/detect_plugins.mjs`

Si se trata de un repositorio de un sitio completo, elige el plugin específico bajo `wp-content/plugins/` o `mu-plugins/` antes de cambiar el código.

### 1) Seguir una arquitectura predecible

Guías:

- Mantén un único bootstrap (archivo principal del plugin con la cabecera).
- Evita efectos secundarios pesados en el momento de carga del archivo; carga mediante hooks.
- Prefiere un cargador o clase dedicada para registrar los hooks.
- Mantén el código solo para administración tras `is_admin()` (o hooks de administración) para reducir la sobrecarga en el frontend.

Ver:
- `references/structure.md`

### 2) Hooks y ciclo de vida (activación/desactivación/desinstalación)

Los hooks de activación son frágiles; sigue estas pautas:

- Registra los hooks de activación/desactivación en el nivel superior, no dentro de otros hooks.
- Limpia las reglas de reescritura (flush rewrite rules) solo cuando sea necesario y tras registrar CPTs/reglas.
- La desinstalación debe ser explícita y segura (`uninstall.php` o `register_uninstall_hook`).

Ver:
- `references/lifecycle.md`

### 3) Ajustes e interfaz de administración (Settings API)

Prefiere la Settings API para las opciones:

- `register_setting()`, `add_settings_section()`, `add_settings_field()`.
- Sanitiza mediante `sanitize_callback`.

Ver:
- `references/settings-api.md`

### 4) Base de seguridad (siempre)

Antes de publicar:

- Valida/sanitiza la entrada pronto; escapa la salida tarde.
- Usa nonces para prevenir CSRF *y* comprobaciones de capacidad para autorización.
- Evita confiar directamente en `$_POST` / `$_GET`; usa `wp_unslash()` y claves específicas.
- Usa `$wpdb->prepare()` para SQL; evita construir SQL con concatenación de cadenas.

Ver:
- `references/security.md`

### 5) Almacenamiento de datos, cron, migraciones (si es necesario)

- Prefiere opciones para configuraciones pequeñas; tablas personalizadas solo si es necesario.
- Para tareas cron, asegura la idempotencia y proporciona rutas de ejecución manual (WP-CLI o administración).
- Para cambios de esquema, escribe rutinas de actualización y guarda la versión del esquema.

Ver:
- `references/data-and-cron.md`

## Verificación

- El plugin se activa sin errores fatales ni avisos (notices).
- Los ajustes se guardan y leen correctamente (se aplican capacidad + nonce).
- La desinstalación elimina los datos previstos (y nada más).
- Ejecuta lint/tests del repositorio (PHPUnit/PHPCS si existen) y cualquier paso de build de JS si el plugin incluye activos.

## Modos de fallo / depuración

- El hook de activación no se dispara:
  - El hook se registró incorrectamente (fuera del alcance del archivo principal), ruta del archivo principal errónea o el plugin está activado para la red.
- Los ajustes no se guardan:
  - Ajustes no registrados, grupo de opciones erróneo, falta capacidad, fallo de nonce.
- Regresiones de seguridad:
  - Nonce presente pero faltan comprobaciones de capacidad; o entrada sanitizada pero no escapada en la salida.

Ver:
- `references/debugging.md`

## Escalado

Para detalles canónicos, consulta el Handbook de Plugins y las guías de seguridad antes de inventar patrones.
