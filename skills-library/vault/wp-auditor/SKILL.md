---
name: wp-auditor
description: Auditor global de seguridad, rendimiento y arquitectura técnica para ecosistemas completos de WordPress.
category: "⚡ WordPress"
---

# WordPress Auditor Skill (Pro)

Esta skill define los pasos, reglas y metodologías estrictas para auditar instalaciones de WordPress y WooCommerce a nivel empresarial. Combina el "Discovery-First Approach" con métricas de rendimiento (WPO), seguridad (Zero Trust), SEO Técnico y evaluación UX/Legal.

## ALGORITMO DE EJECUCIÓN DEL AGENTE (Metodología de 6 Pasos)

**RESTRICCIÓN ABSOLUTA:** El Agente opera en **MODO SOLO LECTURA**. Está estrictamente prohibido realizar cualquier cambio, actualización, instalación o borrado en la web, base de datos o servidor durante esta auditoría. Tu rol es exclusivo de inspección y reporte.

Cuando te pidan auditar una web de WordPress, DEBES seguir rigurosamente este flujo:

### Paso 1: Preparación, Credenciales y Entorno Temporal
1. **Validación de Accesos:** Lee `credenciales.md`. Si solo tienes credenciales de Administrador de WP (sin FTP/BD), notifica al usuario indicando qué herramientas precisas (Ej: *WP File Manager* o exploradores de BD como *WP Data Access*) para hacer la auditoría.
2. **Instalación de Sondas (Permiso Requerido):** Si el usuario te proporciona una API Key o autorización, instala temporalmente esos plugins de inspección. ÚSALOS SIEMPRE EN MODO LECTURA.
3. **Limpieza Obligatoria:** Anota en una variable temporal los plugins que has instalado. DEBES borrarlos al terminar el Paso 5.
4. **Verificar Backups:** Exige o verifica la existencia de una copia de seguridad funcional antes de proceder.
5. **Definir KPIs Iniciales:** Mide las métricas clave actuales (TTFB, LCP, INP, CLS).

### Paso 2: Auditoría de Rendimiento (WPO) y Arquitectura
1. **Infraestructura:** Evalúa el servidor (resolución DNS, latencia, CDN, PHP 8.1+, HTTP/2, Gzip/Brotli).
2. **Base de Datos:** Inspecciona `wp_options` donde `autoload=yes` (Alerta CRÍTICA si el tamaño > 1MB). Busca revisiones acumuladas, borradores y transients caducados.
3. **Front-end y Código:** Usa Query Monitor o herramientas de profiling para identificar plugins pesados. Revisa uso de Heartbeat API.
4. **Recursos:** Verifica tamaño/formato de imágenes (WebP/AVIF), *Lazy Loading*, y scripts que bloquean el renderizado.
5. **Caché:** Audita la estrategia de caché en tres niveles (Navegador, Página y Objeto vía Redis/Memcached).

### Paso 3: Auditoría de Seguridad Integral (Nivel Enterprise)
1. **Verificación de Integridad Profunda:** Usa WP-CLI (`wp core verify-checksums` y `wp plugin verify-checksums`) en modo solo lectura para documentar archivos core o plugins alterados.
2. **Escaneo de Vulnerabilidades (CVE):** Cruza la lista de plugins activos e inactivos (`wp plugin list`) con bases de datos de vulnerabilidades conocidas (CVEs), documentando aquellas que requieran parcheo inmediato.
3. **Hardening y Exposición de Datos:** Revisa directivas en `wp-config.php` y `.htaccess`. Documenta la exposición de archivos de backup (`.sql`, `.tar`, `.bak`) o logs de errores expuestos públicamente.
4. **Protección Perimetral:** Verifica si está habilitado `xmlrpc.php`, si hay restricciones en `/wp-content/uploads/` y evalúa las cabeceras HTTP de seguridad para proponer bloqueos estructurados.
5. **Ecosistema (Limpieza):** Lista en el informe todo software inactivo, abandonware o software "nulled" para presupuestar su reemplazo o eliminación.

### Paso 4: Auditoría de SEO Técnico y Rastreo
1. **Crawl Budget:** Revisa `robots.txt` y mapa XML para proponer optimizaciones del presupuesto de rastreo de Google (documenta URLs parametrizadas y bucles).
2. **Salubridad de URL:** Identifica y registra páginas con Errores 404, soft 404 y cadenas de redirección 301 innecesarias para presupuestar su corrección.
3. **Estructura Semántica:** Revisa el uso de H1 único, jerarquía, y atributos `alt` faltantes. Documenta las páginas huérfanas sin enlazado interno.
4. **Datos Estructurados:** Comprueba si existe y es válido el JSON-LD (Product Schema, FAQ Schema, etc.).

### Paso 5: Auditoría de Experiencia de Usuario (UX) y Legal
1. **Mobile-First:** Evalúa la usabilidad móvil (elementos táctiles, renderizado responsivo).
2. **Analítica:** Comprueba que Google Analytics 4 (GA4) o el píxel correspondiente estén inyectados y midiendo correctamente.
3. **Compliance:** Audita políticas de privacidad (RGPD/CCPA), banners de cookies operativos y accesibilidad básica WCAG 2.2 AA (contraste 4.5:1, enfoque).

### Paso 6: Documentación y Plan de Acción (Entregables)
Al finalizar, debes generar obligatoriamente un **Informe Profesional y Comercial** listo para presentación y presupuestación. Este informe debe cruzar la auditoría técnica con el *Estudio de Marca* proporcionado, e incluir:
*   **Resumen Ejecutivo:** Conexión entre los fallos técnicos encontrados y su impacto en el negocio (marca/ventas).
*   **Matriz de Hallazgos Clasificados:** Crítico (Rojo), Advertencia/Medio (Amarillo), Éxito/Bajo (Verde).
*   **Hoja de Ruta de Escalabilidad:** Plan por fases para mejoras de código, infraestructura y DB, diseñado para no romper el sitio en el proceso.
*   **Victorias Rápidas (Quick Wins):** Mejoras de alto impacto y bajo esfuerzo.
*   **Comparativa Inicial:** Las métricas base para asegurar que en el futuro se podrá evaluar el éxito.

## FLUJO DE TRABAJO (WORKFLOW DE AUDITORÍAS EN LOTE)
Para ejecutar múltiples auditorías, el usuario preparará una carpeta por cada web (ej. `auditorias/nombre_web/`) que contendrá las bases. El Agente DEBE buscar y leer estos 3 archivos antes de comenzar:
1.  **estructura.md**: Mapa del sitio, plugins detectados y arquitectura de la web.
2.  **credenciales.md**: Accesos a WordPress, Panel Hosting o Base de Datos.
3.  **estudio_marca.md**: Contexto de negocio, objetivos empresariales, tono y público objetivo.

**Instrucción Dinámica:** Consolidar toda la información de estos 3 archivos para que el **Informe Final Comercial** enlace directamente los problemas técnicos con la pérdida de rentabilidad o impacto en la marca descrita en el estudio.

**NOTA CRÍTICA:** Al generar scripts para conectarse a la Base de Datos o escanear archivos, estos deben ser puros, deterministas y guardar resultados en un directorio `.tmp/`.
