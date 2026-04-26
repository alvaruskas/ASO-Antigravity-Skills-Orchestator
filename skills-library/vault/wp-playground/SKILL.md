---
name: wp-playground
description: "Usa esta skill para flujos de trabajo con WordPress Playground: instancias rápidas y desechables de WP en el navegador o localmente mediante @wp-playground/cli (servidor, ejecución de Blueprints, creación de snapshots), montaje automático de plugins/temas, cambio de versiones de WP/PHP, Blueprints y depuración (Xdebug)."
compatibility: "Dirigido a WordPress 6.9+ (PHP 7.2.24+). El CLI de Playground requiere Node.js 20.18+; ejecuta WP en WebAssembly con SQLite."
category: "⚡ WordPress"
---

# WordPress Playground

## Cuándo usar

- Levantar un WordPress desechable para probar un plugin/tema sin configurar todo el stack.
- Ejecutar o iterar sobre Blueprints de Playground (JSON) de forma local.
- Crear un snapshot (captura) reproducible de un sitio para compartirlo o usarlo en CI.
- Cambiar versiones de WP/PHP rápidamente para reproducir errores.
- Depurar código de plugins/temas con Xdebug en un entorno aislado de Playground.

## Entradas requeridas

- Preparación de la máquina: Node.js ≥ 20.18, disponibilidad de `npm`/`npx`.
- Ruta del proyecto a montar (`--auto-mount` o mapeo explícito).
- Versión deseada de WP/PHP (opcional; por defecto la última de WP y PHP 8.3).
- Ubicación/URL del Blueprint si se está ejecutando uno.
- Preferencia de puerto si el 9400 está en uso.
- Confirmación de si se necesita Xdebug.

## Procedimiento

### 0) Medidas de seguridad

- Las instancias de Playground son efímeras y usan SQLite; **nunca** las conectes a datos de producción.
- Confirma Node ≥ 20.18 (`node -v`) antes de ejecutar el CLI.
- Si montas código local, asegúrate de que no contenga secretos; Playground copia los archivos a un sistema de archivos en memoria.

### 1) Inicio rápido local (auto-mount)

```bash
cd <raiz-del-plugin-o-tema>
npx @wp-playground/cli@latest server --auto-mount
```
- Se abre en http://localhost:9400 por defecto. Detecta automáticamente el plugin/tema y lo instala.
- Añade `--wp=<version>` / `--php=<version>` según sea necesario.
- Para instalaciones clásicas completas ya existentes, añade `--skip-wordpress-setup` y monta el árbol completo.

### 2) Montajes manuales o múltiples

- Usa `--mount=/ruta/host:/ruta/vfs` (repetible) cuando el auto-montaje no sea suficiente (varios plugins, mu-plugins, contenido personalizado).
- Monta antes de la instalación con `--mount-before-install` para flujos de instaladores de arranque.
- Referencia: `references/cli-commands.md`

### 3) Ejecutar un Blueprint (sin necesidad de servidor)

```bash
npx @wp-playground/cli@latest run-blueprint --blueprint=<archivo-o-url>
```
- Úsalo para validaciones en CI o configuraciones mediante scripts. Soporta URLs remotas y archivos locales.
- Permite que los Blueprints locales lean archivos adyacentes con `--blueprint-may-read-adjacent-files` cuando sea necesario.
- Ver `references/blueprints.md` para la estructura y flags comunes.

### 4) Crear un snapshot para compartir

```bash
npx @wp-playground/cli@latest build-snapshot --blueprint=<archivo> --outfile=./sitio.zip
```
- Genera un ZIP que puedes cargar en Playground o adjuntar a informes de errores.

### 5) Depuración con Xdebug

- Inicia con `--xdebug` (o `--enable-xdebug` según la versión del CLI) para exponer una clave de IDE, luego conecta VS Code/PhpStorm al host/puerto mostrado.
- Combínalo con `--auto-mount` para depurar plugins/temas.
- Checklist: `references/debugging.md`

### 6) Cambio de versiones

- Usa `--wp=` para fijar la versión de WP (ej. 6.9.0) y `--php=` para probar compatibilidad.
- Si una funcionalidad depende del trunk de Gutenberg, prefiere la última versión de WP más el plugin si está disponible.

### 7) Flujos solo en navegador (sin CLI)

- Lanza previsualizaciones rápidas con fragmentos de URL o parámetros:
  - Fragmento: `https://playground.wordpress.net/#<blueprint-en-base64-o-json>`
  - Consulta: `https://playground.wordpress.net/?blueprint-url=<url-publica-o-zip>`
- Usa el Editor de Blueprints en vivo (playground.wordpress.net) para crear Blueprints con ayuda de esquema; pega el JSON y copia el enlace para compartir.

## Verificación

- Verifica que el código montado esté activo (plugin listado/activo; tema seleccionado).
- Para Blueprints/snapshots, vuelve a ejecutar con `--verbosity=debug` para confirmar los pasos ejecutados.
- Ejecuta pruebas básicas (ej. `wp plugin list` dentro de la terminal de Playground en el navegador si está expuesta).

## Modos de fallo / depuración

- **El CLI sale quejándose de Node**: actualiza a ≥ 20.18.
- **Montaje no aplicado**: comprueba la ruta, usa rutas absolutas, añade `--verbosity=debug`.
- **El Blueprint no puede leer activos locales**: añade `--blueprint-may-read-adjacent-files`.
- **Puerto ya en uso**: usa `--port=<puerto-libre>`.

## Escalado

- Si se requieren extensiones de PHP o acceso nativo a BD, Playground puede no ser adecuado; recurre a un stack completo de WP o wp-env/Docker.
- Para integración solo en navegador o detalles específicos de la extensión de VS Code, consulta la documentación oficial: https://wordpress.github.io/wordpress-playground/
