---
name: rankmath-seo-pro
description: Experto en optimización SEO con Rank Math Pro, cubre configuración de esquemas y automatización estructurada.
category: "⚡ WordPress"
---

# Maestría SEO 2026: Skill Definitiva para Rank Math y Antigravity

**Contexto:**
Esta Skill encapsula la inteligencia de SEO de Antigravity para 2026. Prioriza la optimización para Búsqueda Generativa (SGE) y AEO (Answer Engine Optimization) más allá de meras palabras clave, enfocándose en la integración de Schema (JSON-LD), protocolos formales de `llms.txt` y rendimiento (Core Web Vitals) en entornos WordPress.

## 1. Implementación Básica del Entorno
Antes de ejecutar configuraciones granulares, verifica que el sitio esté preparado:
- El sitio carece de exposición a metadatos sensibles (ej. limpieza `.git`, volcados `.sql`).
- La memoria de servidor PHP `WP_MEMORY_LIMIT` es al menos de `512M` para evitar Errores 500 al compilar sitemaps y Schema complejos.

## 2. Configuración Núcleo Rank Math (Paso a Paso)
Al iniciar la configuración o revisar un entorno, aplica estos estándares globales:

### A. Módulos Esenciales a Activar
- Monitor 404
- Redirecciones
- Schema (Structured Data)
- Mapa del sitio (Sitemap XML)
- SEO para imágenes

### B. Indexación y Bloqueos
- Las páginas de valor utilitario (`/carrito`, `/mi-cuenta`, `/checkout`, `/politicas`) deben ser marcadas con **NOINDEX, FOLLOW**.
- Las categorías vacías, etiquetas (tags), paginaciones de archivos (`/page/2/`), y archives de autor deben ser **NOINDEX** para proteger el "Crawl Budget" y evitar contenido ligero ("thin content").
- Configurar "Enlaces" > "Quitar base de categoría" para limpiar las URLs.

## 3. Optimización AEO/SGE y Schema Múltiple

### Schema JSON-LD (Jerarquía Pura)
Para clasificar en la Inteligencia Artificial (AI Overviews), el Schema no debe estar disperso. Debe seguir el paradigma de "Grafo Anidado":
- `WebSite` > pertenece a > `Organization`
- `Article` (para post) > pertenece a > `WebPage`
- En páginas transaccionales o informativas, inyecta siempre Schema `FAQPage` (Correlación 0.71 para citaciones en IA) y asegúrate de añadir las credenciales y autoría reales en Rank Math para nutrir el E-E-A-T.

### Estructura On-Page SEO (Citable Blocks)
Cuando audites o generes contenido en Gutenberg/Elementor:
- Inserta al inicio de cada servicio un "Bloque Citable": 2-4 líneas de introducción pura y directa al formato que responde a la intención de búsqueda, idealmente mediante una lista viñeteada o numerada.

## 4. Protocolo llms.txt
Todo proyecto Antigravity configurado para 2026 debe llevar en su raíz un `llms.txt`.
Si se te pide configurar SEO integral para IA:
1. Crea/modifica `/llms.txt` en la raíz (accesible desde `dominio.com/llms.txt`).
2. Usa el formato Markdown, encabezado por un `# [Nombre de la Empresa]`.
3. Ofrece una descripción resumida y un listado hiper-filtrado de las URLs clave del sitio con un párrafo sintético de una línea describiendo el contenido real. ¡No vuelques el Sitemap entero!

## 5. Control de Core Web Vitals (Velocidad de Carga Pura)
Rank Math no optimiza performance, así que tu auditoría de SEO técnico lo debe prever:
- **LCP:** La primera imagen "hero" o banner no debe llevar *Lazy Loading* y debe tener el atributo `fetchpriority="high"`.
- **CLS:** Declarar los atributos genéricos de altura y anchura explícitos (`width` / `height`) en imágenes.

## Uso de esta Skill
*(Prompt del AI)*: Si se me invoca o se me pide "optimizar el sitio usando Rank Math", auditaré el WordPress con esta lista técnica paso a paso. No improvisaré metadatos aleatorios; usaré el enfoque Semántico/E-E-A-T especificado aquí.
