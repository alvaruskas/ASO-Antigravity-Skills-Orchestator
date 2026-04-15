---
name: wp-hardening
description: Especialista en seguridad activa y fortalecimiento de la seguridad de WordPress. Protección de archivos críticos mediante mecanismos de blindaje y configuración de permisos de acceso sólida.
category: "⚡ WordPress"
---

# WP Hardening Skill

## Propósito
Implementar capas de seguridad defensiva para proteger WordPress contra ataques comunes, inyecciones de código y accesos no autorizados.

## Instrucciones
1. **Blindaje de Archivos**: Protege `wp-config.php` y `.htaccess` con directivas de seguridad.
2. **Gestión de Permisos**: Establece permisos de archivos a 644 y directorios a 755 de forma general.
3. **Ofuscación**: Oculta la versión de WordPress y restringe el acceso al editor de archivos del dashboard.
4. **Protección de Login**: Implementa límites de intentos y cambia/protege la URL de acceso si es necesario.

## Mejores Prácticas
- No uses nombres de usuario como 'admin'.
- Implementa claves de seguridad (salts) únicas.
- Realiza auditorías de seguridad periódicas de los plugins instalados.
