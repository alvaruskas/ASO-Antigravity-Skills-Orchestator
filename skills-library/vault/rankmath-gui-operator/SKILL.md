---
name: rankmath-gui-operator
description: Automatizaciones de Navegador con la capacidad de modificar títulos, descripciones y esquemas directamente desde el panel de WordPress y Rank Math mediante un proceso automatizado.
category: "⚡ WordPress"
---

# Rank Math GUI Operator
**Descripción:** Esta habilidad encapsula el conocimiento y las rutinas para operar visualmente Rank Math SEO directamente a través del panel de administración (`/wp-admin`), siendo útil para entornos donde el acceso a BBDD, API REST, u otros scripts (WP-CLI / inyecciones de PHP) están bloqueados por niveles de caché agresivos (ej. LiteSpeed de OVH).

## Tareas Clave Soportadas:
1. Navegación e inicio de sesión visual en WP-Admin.
2. Identificación de metaboxes de Rank Math en el editor de páginas/posts.
3. Actualización de Snippets (Títulos / Metadescripciones).
4. Asignación de tipos de Schema (ej. Article, SoftwareApplication) en el modal avanzado.

## Flujo de Trabajo (Para Sub-agentes de Navegador):
1. Abrir `https://[dominio]/wp-login.php`
2. Hacer login con credenciales válidas provistas por herramientas pasivas o el usuario.
3. Navegar a Páginas (`/wp-admin/edit.php?post_type=page`).
4. Para cada página que necesite optimización:
   - Click en Editar.
   - En el panel derecho de configuración de bloques / barra lateral superior, hacer clic en la puntuación SEO para abrir el panel lateral de Rank Math.
   - Click en "Edit Snippet".
   - Rellenar/Sobreescribir los campos "Title" y "Description".
   - Aplicar y pulsar el botón azul "Actualizar" de la página.
5. Cerrar sesión al terminar.

## Trampas / Fallos Comunes:
- En la interfaz del editor de bloques (Gutenberg), Gutenberg a veces oculta el panel lateral. Se debe pulsar específicamente sobre el botón de Rank Math (icono de porcentaje y semáforo).
- Ocasionalmente se mostrarán notificaciones "modales" de bienvenida de Elementor o Rank Math, ciérralas antes de continuar.
