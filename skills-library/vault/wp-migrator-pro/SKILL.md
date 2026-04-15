---
name: wp-migrator-pro
description: Gestión avanzada de migraciones técnicas de WordPress. Manejo experto de datos serializados y cambios de entorno entre localhost, servidor de pruebas y servidor de producción.
category: "⚡ WordPress"
---

# WP Migrator Pro Skill

## Propósito
Garantizar migraciones de WordPress fluidas y seguras, abordando especialmente el problema de los datos serializados en la base de datos y la consistencia de archivos entre servidores.

## Instrucciones
1. **Sincronización de Base de Datos**: Actualiza URLs y rutas en las tablas `wp_options` y `wp_posts`.
2. **Serialización Segura**: Utiliza herramientas o scripts que respeten la longitud de las cadenas en arrays serializados de PHP.
3. **Configuración de Entorno**: Ajusta el archivo `wp-config.php` (DB_HOST, claves de sal, etc.) según el nuevo host.
4. **Validación Visual**: Verifica enlaces permanentes y regenera el archivo `.htaccess` tras la migración.

## Mejores Prácticas
- Realiza siempre un backup completo antes de cualquier cambio en la base de datos.
- Desactiva plugins de caché antes de iniciar la migración.
- Verifica la integridad de las rutas de la biblioteca de medios.
