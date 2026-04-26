---
name: wp-phpstan
description: "Usa esta skill al configurar, ejecutar o corregir el análisis estático de PHPStan en proyectos de WordPress (plugins/temas/sitios): configuración de `phpstan.neon`, archivos baseline, tipado específico de WordPress y manejo de clases de plugins de terceros."
compatibility: "Dirigido a WordPress 6.9+ (PHP 7.2.24+). Requiere PHPStan basado en Composer."
category: ["WP MCP", "wordpress"]
---

# WP PHPStan

## Cuándo usar

Usa esta skill cuando trabajes con PHPStan en una base de código de WordPress, por ejemplo:

- Configurar o actualizar `phpstan.neon` / `phpstan.neon.dist`.
- Generar o actualizar `phpstan-baseline.neon`.
- Corregir errores de PHPStan mediante PHPDoc compatible con WordPress (peticiones REST, hooks, resultados de consultas).
- Manejar de forma segura clases de plugins/temas de terceros (stubs/autoload/ignorar errores específicos).

## Entradas requeridas

- Salida de `wp-project-triage` (ejecútalo primero si no lo has hecho).
- Confirmación de si se permite añadir/actualizar dependencias dev de Composer (stubs).
- Confirmación de si se permite cambiar el baseline para esta tarea.

## Procedimiento

### 0) Descubrir puntos de entrada de PHPStan (determinista)
1. Inspecciona la configuración de PHPStan (config, baseline, scripts):
   - `node skills/wp-phpstan/scripts/phpstan_inspect.mjs`

Prefiere el script de `composer` existente en el repositorio (ej. `composer run phpstan`) cuando esté presente.

### 1) Asegurar que los stubs del núcleo de WordPress estén cargados

`szepeviktor/phpstan-wordpress` o `php-stubs/wordpress-stubs` son prácticamente obligatorios para la mayoría de repositorios de plugins/temas de WordPress. Sin ellos, espera un gran volumen de errores sobre funciones desconocidas del núcleo.

- Confirma que el paquete está instalado (mira `composer.dependencies` en el informe de inspección).
- Asegúrate de que la configuración de PHPStan referencia los stubs (ver `references/third-party-classes.md`).

### 2) Asegurar un `phpstan.neon` coherente para proyectos WordPress

- Mantén `paths` enfocado en el código propio (directorios de plugins/temas).
- Excluye código generado o de terceros (`vendor/`, `node_modules/`, archivos de build, tests a menos que se analicen explícitamente).
- Mantén las entradas de `ignoreErrors` lo más específicas posible y documentadas.

Ver:
- `references/configuration.md`

### 3) Corregir errores con tipado específico de WordPress (preferido)

Prefiere corregir los tipos antes que ignorar los errores. Patrones comunes de WP que necesitan ayuda:

- Endpoints REST: tipar parámetros de la petición usando `WP_REST_Request<...>`
- Callbacks de Hook: añadir tipos `@param` precisos para los argumentos del callback.
- Resultados de DB e iterables: usar array shapes u object shapes para los resultados de consultas.
- Action Scheduler: tipar array shapes de `$args` para los callbacks de tareas.

Ver:
- `references/wordpress-annotations.md`

### 4) Manejar clases de plugins/temas de terceros (solo cuando sea necesario)

Al integrar con plugins/temas que no están presentes en el entorno de análisis:

- Primero, confirma que la dependencia es real (instalada/requerida).
- Prefiere stubs específicos de plugins ya usados en el repo (ejemplos comunes: `php-stubs/woocommerce-stubs`, `php-stubs/acf-pro-stubs`).
- Si PHPStan aún no puede resolver las clases, añade patrones de `ignoreErrors` dirigidos al prefijo específico del desarrollador.

Ver:
- `references/third-party-classes.md`

### 5) Gestión del baseline (usar como herramienta de migración, no como papelera)

- Genera un baseline una vez para el código antiguo (legacy) y redúcelo con el tiempo.
- No añadidas errores nuevos al baseline.

Ver:
- `references/configuration.md`

## Verificación

- Ejecuta PHPStan usando el comando descubierto (`composer run ...` o `vendor/bin/phpstan analyse`).
- Confirma que el archivo baseline (si se usa) está incluido y no ha crecido inesperadamente.
- Vuelve a ejecutar tras cambiar `ignoreErrors` para asegurar que los patrones no están ocultando problemas no relacionados.

## Modos de fallo / depuración

- "Class not found":
  - Confirma autoloading/stubs, o añade un patrón de ignore específico.
- Recuento de errores enorme tras activar PHPStan:
  - Reduce `paths`, añade `excludePaths`, empieza en un nivel más bajo y ve subiendo.
- Tipos inconsistentes en hooks / parámetros REST:
  - Añade PHPDoc explícito (ver referencias) en lugar de comprobaciones en tiempo de ejecución.

## Escalado

- Si un tipo depende de una API de un plugin de terceros que no puedes confirmar, pide la versión de la dependencia o la fuente antes de inventar tipos.
- Si la corrección requiere añadir nuevas dependencias de Composer (stubs/extensiones), confírmalo con el usuario primero.
