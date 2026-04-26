---
name: wp-performance
description: "Usa esta skill para investigar o mejorar el rendimiento de WordPress (agente solo backend): perfilado y medición (WP-CLI profile/doctor, Server-Timing, Query Monitor vía REST headers), optimización de base de datos/consultas, opciones de carga automática (autoload), caché de objetos, cron, llamadas a la API HTTP y verificación segura."
compatibility: "Dirigido a WordPress 6.9+ (PHP 7.2.24+). Agente solo para backend; prefiere WP-CLI (doctor/profile) cuando esté disponible."
category: "⚡ WordPress"
---

# Rendimiento de WP (solo backend)

## Cuándo usar

Usa esta skill cuando:

- Un sitio/página/endpoint de WordPress va lento (TTFB del frontend, administración, REST, WP-Cron).
- Necesitas un plan de perfilado y recomendaciones de herramientas (WP-CLI profile/doctor, Query Monitor, Xdebug/XHProf, APMs).
- Estás optimizando consultas de base de datos, opciones de carga automática (autoload), caché de objetos, tareas cron o llamadas HTTP remotas.

Esta skill asume que el agente no puede usar una interfaz de navegador. Prefiere WP-CLI, logs y peticiones HTTP.

## Entradas requeridas

- Entorno y seguridad: dev/staging/prod, cualquier restricción (sin escritura, sin instalación de plugins).
- Cómo identificar la instalación:
  - Ruta raíz de WP `--path=<ruta>`
  - (Targeting multisitio/sitio) `--url=<url>`
- Síntoma de rendimiento y alcance:
  - Qué URL/ruta REST/pantalla de administración.
  - Cuándo sucede (siempre vs esporádico; usuario identificado vs visitante).

## Procedimiento

### 0) Medidas de seguridad: medir primero, evitar operaciones arriesgadas

1. Confirma si puedes ejecutar operaciones de escritura (instalación de plugins, cambios de configuración, limpieza de caché).
2. Elige un objetivo reproducible (URL o ruta REST) y captura una línea base (baseline):
   - TTFB/tiempo con `curl` si es posible.
   - Perfilado con WP-CLI si está disponible.

Leer:
- `references/measurement.md`

### 1) Generar un informe de rendimiento solo para backend (determinista)

Ejecuta:

- `node skills/wp-performance/scripts/perf_inspect.mjs --path=<ruta> [--url=<url>]`

Esto detecta:

- Disponibilidad de WP-CLI y versión del núcleo.
- Si `wp doctor` / `wp profile` están disponibles.
- Tamaño de las opciones de carga automática (autoload) si es posible.
- Presencia del drop-in de object-cache.

### 2) Victorias rápidas: ejecutar diagnósticos antes del perfilado profundo

Si tienes acceso a WP-CLI, prefiere:

- `wp doctor check`

Detecta errores comunes en producción (exceso de autoload, SAVEQUERIES/WP_DEBUG, exceso de plugins, actualizaciones).

Leer:
- `references/wp-cli-doctor.md`

### 3) Perfilado profundo (sin necesidad de navegador)

Orden preferido:

1. `wp profile stage` para ver dónde se va el tiempo (bootstrap/main_query/template).
2. `wp profile hook` (opcionalmente con `--url=`) para encontrar hooks/callbacks lentos.
3. `wp profile eval` para rutas de código específicas.

Leer:
- `references/wp-cli-profile.md`

### 4) Query Monitor (uso solo en backend)

Query Monitor suele ser visual, pero puede usarse de forma "headless" mediante las cabeceras de respuesta de la API REST y las respuestas `_envelope`:

- Autentícate (nonce o Application Password).
- Solicita respuestas REST e inspecciona las cabeceras (`x-qm-*`) y/o la propiedad `qm` al usar `?_envelope`.

Leer:
- `references/query-monitor-headless.md`

### 5) Corregir por categoría (elegir el cuello de botella dominante)

Usa la salida del perfilado para elegir *una* categoría principal de cuello de botella:

- **Consultas de BD** → reducir número de consultas, corregir patrones N+1, mejorar índices, evitar consultas de meta costosas.
  - `references/database.md`
- **Opciones de carga automática (Autoload)** → identificar las opciones más grandes y desactivar el autoload para blobs grandes.
  - `references/autoload-options.md`
- **Fallos en caché de objetos** → introducir caché o corregir el uso de claves/grupos; añadir caché de objetos persistente donde sea apropiado.
  - `references/object-cache.md`
- **Llamadas HTTP remotas** → añadir timeouts, caché, procesamiento por lotes; evitar llamar a APIs remotas en cada petición.
  - `references/http-api.md`
- **Cron** → reducir picos de ejecución, eliminar eventos duplicados, mover tareas pesadas fuera de la ruta de la petición.
  - `references/cron.md`

### 6) Verificar (repetir la misma medición)

- Vuelve a ejecutar el mismo `wp profile` / `wp doctor` / petición REST.
- Confirma la diferencia de rendimiento y que el comportamiento no ha cambiado.
- Si el arreglo es arriesgado, despliega tras un feature flag o de forma escalonada si es posible.

## Mejoras de rendimiento en WordPress 6.9

Ten en cuenta estos cambios de la versión 6.9 al perfilar:

**CSS bajo demanda para temas clásicos:**
- Los temas clásicos ahora cargan CSS bajo demanda (antes solo disponible en temas de bloques).
- Reduce el peso del CSS entre un 30-65% al cargar solo los estilos de los bloques usados en la página.

**Temas de bloques sin recursos que bloqueen el renderizado:**
- Los temas de bloques que no definen hojas de estilo personalizadas pueden cargar con cero CSS bloqueante.
- Los estilos vienen de estilos globales (theme.json) y estilos de bloques separados, todos integrados (inlined).
- Esto mejora significativamente el LCP (Largest Contentful Paint).

Referencia: https://make.wordpress.org/core/2025/11/18/wordpress-6-9-frontend-performance-field-guide/

## Verificación

- Se capturan números antes y después (mismo entorno, misma URL/ruta).
- `wp doctor check` está limpio (o ha mejorado).
- No hay nuevos errores o avisos de PHP en los logs.
- No se requiere limpieza de caché para el funcionamiento correcto (la limpieza de caché debe ser el último recurso).

## Modos de fallo / depuración

- "Sin cambios" tras modificar el código:
  - Mediste una URL/sitio diferente (error en `--url`), las cachés ocultaron los resultados o la caché de opcode está obsoleta.
- Datos de perfilado inestables:
  - Elimina tareas en segundo plano, prueba con cachés calientes, ejecuta varias muestras.
- `SAVEQUERIES`/Query Monitor causa sobrecarga:
  - No ejecutar en producción a menos que esté aprobado explícitamente.

## Escalado

- Si es producción y no tienes aprobación explícita, no:
  - Instales plugins, actives `SAVEQUERIES`, ejecutes pruebas de carga o limpies cachés durante el tráfico.
- Si necesitas perfilado a nivel de sistema (APM, extensiones de perfilado PHP), coordina con operaciones/hosting.
ate with ops/hosting.
