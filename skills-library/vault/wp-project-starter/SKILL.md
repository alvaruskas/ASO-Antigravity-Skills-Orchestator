---
name: wp-project-starter
description: Inicia sesión en el sitio utilizando WP-CLI, activa plugins esenciales gratuitos como Yoast SEO, Wordfence Security y Jetpack, y personaliza la capa UX/UI configurando el tema, la barra de herramientas y ajustes de seguridad con pausas para datos sensibles.
category: "⚡ WordPress"
---

# WP Project Starter

Esta skill permite a Antigravity arrancar un proyecto WordPress en un entorno vacío o recién instalado, ejecutando un conjunto de pasos deterministas para asegurar calidad, rendimiento y seguridad.

## Prerrequisitos
- El sitio debe tener un `wp-config.php` válido y conexión a BD.
- Acceso a `wp-cli` en el entorno de ejecución.

## Bucle de Ejecución

1. **Lectura de Directiva (Riguroso):** 
   Revisa SIEMPRE `directivas/wp_project_starter_SOP.md` para conocer las restricciones vigentes antes de arrancar.
2. **Consultar Inteligencia:** 
   Para referencia sobre configuraciones óptimas de código o UI, usa el cuaderno NotebookLM "WP Project Starter (Código & UI)" (ID: `5976da6e-f79a-43f9-82aa-e53f305e5164`).
3. **Pilar 1: Seguridad y SEO (Code/WP-CLI)**
   - `wp plugin install wordfence --activate`
   - `wp plugin install seo-by-rank-math --activate`
4. **Pilar 2: Utilidades y Rendimiento**
   - `wp plugin install wp-mail-smtp --activate`
5. **Pilar 3: Diseño UX/UI**
   - Instala constructores como: `wp plugin install elementor --activate` o `wp plugin install spectra-blocks --activate`
   - Obligatorio: `wp plugin update --all` para mantener UX/UI seguro.
6. **Intervención Humana (Obligatorio):**
   - Usa la herramienta `notify_user` para pedir el **Email de Alertas de Wordfence** (u otros si proceden) y aplícalo:
     `wp option update wordfence_email <email_proporcionado>`
   - NO inventes datos de contacto.

## Advertencia
Si un comando WP-CLI falla por límite de peticiones (timeout), reduce el lote e instala plugin por plugin.
