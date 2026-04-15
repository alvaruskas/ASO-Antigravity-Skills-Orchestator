---
name: wordpress-pages
description: Creación y actualización de páginas informativas y legales en WordPress via REST API.
category: "⚡ WordPress"
---

# wordpress-pages

Skill para publicar y modificar páginas en un entorno WordPress a través de la API REST nativa (`/wp/v2/pages`). Especialmente diseñada para gestionar textos legales, términos condicionados y políticas.

## 1. Requisitos e Integración

*   **Autenticación**: Se utiliza "Application Passwords" de WordPress vinculadas a un usuario administrador, pasadas en las cabeceras `Authorization: Basic`.
*   **Variables (en `.env`)**:
    *   `WORDPRESS_AUTH_USER`: Nombre o email del usuario administrador.
    *   `WORDPRESS_AUTH_PASS`: Contraseña de aplicación generada en WP (sin espacios).
    *   `NEXT_PUBLIC_WORDPRESS_API_URL`: URL base de la API REST (ej. `https://dominio.com/wp-json`). Para páginas estándar de WordPress se usa el endpoint`/wp/v2/pages`.

## 2. Endpoints Clave

*   **Crear Página (`POST /wp/v2/pages`)**:
    *   Requiere al menos `title` y `content`.
    *   `status`: Se envía como `publish` para publicar inmediatamente, o `draft`.
*   **Actualizar Página (`POST /wp/v2/pages/{id}`)**:
    *   Actualiza el contenido o el título. Útil para versiones posteriores de un texto legal.
*   **Buscar Página (`GET /wp/v2/pages?search={terminus}`)**:
    *   Ayuda a verificar si una página "Aviso Legal" ya existe antes de crear un duplicado.

## 3. Protocolo de Auto-Corrección (Errores Conocidos)

| Error Común | Solución |
| :--- | :--- |
| **HTTP 401 Unauthorized** | Asegurarse de que el Application Password está correcto y el servidor soporta el *Basic Auth* (algunos hostings lo bloquean y requieren plugins o editar `.htaccess`). |
| **Código HTML se corrompe / escaping problems** | Siempre inyectar el contenido en WordPress usando literales o archivos `.html`. No mezclar comillas simples y dobles en el renderizado final de Python. |
| **HTTP 404 No Route** | Confirmar que el endpoint utilizado es `/wp/v2/pages` y no los endpoints de WooCommerce (`/wc/v3/...`). |

## 4. Flujo Algorítmico (SOP)

1.  **Validar Estado:** Buscar si la página con el slug o título deseado ya existe mediante un request `GET`.
2.  **Operación Condicional:**
    *   Si **no existe**, hacer un `POST` a `/wp/v2/pages` para crearla con estado `publish`.
    *   Si **ya existe**, hacer un `POST` (o `PUT`) al ID de esa página (`/wp/v2/pages/{id}`) con el texto actualizado.
3.  **Registro:** Capturar el enlace permalink devuelto y confirmarlo.
