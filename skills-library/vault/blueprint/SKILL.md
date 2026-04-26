---
name: blueprint
description: Úsalo al crear, editar o revisar archivos JSON de Blueprints de WordPress Playground. Se activa al mencionar blueprints, configuración de playground o solicitudes para configurar un entorno de demostración de WordPress.
compatibility: "WordPress 6.9+, PHP 7.2.24+. Opcionalmente Playground CLI o un navegador"
category: ["WP MCP", "wordpress"]
---

# Blueprints de WordPress Playground

## Visión General

Un Blueprint es un archivo JSON que configura de manera declarativa una instancia de WordPress Playground: instalando plugins/temas, configurando opciones, ejecutando PHP/SQL, manipulando archivos y más.

**Principio fundamental:** Los Blueprints son declaraciones confiables solo en formato JSON. No permiten JavaScript arbitrario. Funcionan en la web, Node.js y CLI.

## Quick Start Template

```json
{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "landingPage": "/wp-admin/",
  "preferredVersions": { "php": "8.3", "wp": "latest" },
  "steps": [{ "step": "login" }]
}
```

## Propiedades de Nivel Superior

Todas son opcionales. Solo se permiten las claves documentadas; el esquema rechaza propiedades desconocidas.

| Propiedad | Tipo | Notas |
|----------|------|-------|
| `$schema` | string | Siempre `"https://playground.wordpress.net/blueprint-schema.json"` |
| `landingPage` | string | Ruta relativa, ej. `/wp-admin/` |
| `meta` | objeto | `{ title, author, description?, categories? }` — título y autor obligatorios |
| `preferredVersions` | objeto | `{ php, wp }` — ambos obligatorios cuando están presentes |
| `features` | objeto | `{ networking?: boolean, intl?: boolean }` — **solo** estas dos claves. Networking por defecto es `true` |
| `extraLibraries` | array | `["wp-cli"]` — se incluye automáticamente si hay algún paso de `wp-cli` |
| `constants` | objeto | Atajo para `defineWpConfigConsts`. Valores: string/boolean/number |
| `plugins` | array | Atajo para pasos `installPlugin`. Strings = slugs de wp.org |
| `siteOptions` | objeto | Atajo para `setSiteOptions` |
| `login` | boolean u objeto | `true` = login como admin. Objeto = `{ username?, password? }` (ambos por defecto `"admin"`/`"password"`) |
| `steps` | array | Canal de ejecución principal. Se ejecuta después de los atajos |

### Valores de preferredVersions

- **php:** Solo Major.minor (ej. `"8.3"`, `"7.4"`), o `"latest"`. Versiones de parche como `"7.4.1"` son inválidas.
- **wp:** Versiones mayores recientes (ej. `"6.7"`, `"6.8"`), `"latest"`, `"nightly"`, `"beta"`, o una URL a un zip personalizado.

### Atajos vs Pasos

Los atajos (`login`, `plugins`, `siteOptions`, `constants`) se expanden y se añaden al inicio de `steps` en un **orden no especificado**. Usa pasos explícitos cuando el orden de ejecución importe.

## Referencias a Recursos

Los recursos indican a Playground dónde encontrar archivos. Se usan en `installPlugin`, `installTheme`, `writeFile`, `writeFiles`, `importWxr`, etc.

| Tipo de Recurso | Campos Requeridos | Ejemplo |
|--------------|----------------|---------|
| `wordpress.org/plugins` | `slug` | `{ "resource": "wordpress.org/plugins", "slug": "woocommerce" }` |
| `wordpress.org/themes` | `slug` | `{ "resource": "wordpress.org/themes", "slug": "astra" }` |
| `url` | `url` | `{ "resource": "url", "url": "https://example.com/plugin.zip" }` |
| `git:directory` | `url`, `ref` | Ver abajo |
| `literal` | `name`, `contents` | `{ "resource": "literal", "name": "archivo.txt", "contents": "hola" }` |
| `literal:directory` | `name`, `files` | Ver abajo |
| `bundled` | `path` | Referencia un archivo dentro de un bundle (ej. `{ "resource": "bundled", "path": "/plugin.zip" }`) |
| `zip` | `inner` | Envuelve otro recurso en un ZIP — úsalo cuando un paso espera un zip pero tu fuente no lo es |

### git:directory — Instalando desde GitHub

```json
{
  "resource": "git:directory",
  "url": "https://github.com/WordPress/gutenberg",
  "ref": "trunk",
  "refType": "branch",
  "path": "/"
}
```

- Al usar un nombre de rama o etiqueta para `ref`, **debes** establecer `refType` (`"branch"` | `"tag"` | `"commit"` | `"refname"`). Sin esto, solo `"HEAD"` resuelve de forma fiable.
- `path` selecciona un subdirectorio (por defecto la raíz del repositorio).

### literal:directory — Árboles de Archivos en Línea

```json
{
  "resource": "literal:directory",
  "name": "mi-plugin",
  "files": {
    "plugin.php": "<?php /* Plugin Name: Mi Plugin */ ?>",
    "includes": {
      "helper.php": "<?php // código helper ?>"
    }
  }
}
```

- `files` usa objetos anidados para subdirectorios — las claves son nombres de archivo o directorio, los valores son **strings simples** (contenido del archivo) u **objetos** (subdirectorios). Nunca uses referencias a recursos como valores.
- **NO uses separadores de ruta en las claves** (ej. `"includes/helper.php"` es incorrecto — usa un objeto anidado `"includes": { "helper.php": "..." }`).

## Referencia de Pasos

Cada paso requiere `"step": "<nombre>"`. Cualquier paso puede incluir opcionalmente `"progress": { "weight": 1, "caption": "Instalando..." }` para feedback en la IU.

### Instalación de Plugins y Temas

```json
{
  "step": "installPlugin",
  "pluginData": { "resource": "wordpress.org/plugins", "slug": "gutenberg" },
  "options": { "activate": true, "targetFolderName": "gutenberg" },
  "ifAlreadyInstalled": "overwrite"
}
```

```json
{
  "step": "installTheme",
  "themeData": { "resource": "wordpress.org/themes", "slug": "twentytwentyfour" },
  "options": { "activate": true, "importStarterContent": true },
  "ifAlreadyInstalled": "overwrite"
}
```

- Usa `pluginData` / `themeData` — **NO** los obsoletos `pluginZipFile` / `themeZipFile`.
- `pluginData` / `themeData` aceptan cualquier FileReference o DirectoryReference — un zip URL, un slug de `wordpress.org/plugins`, un `git:directory`, o un `literal:directory`.
- `options.activate` controla la activación. No es necesario un paso separado de `activatePlugin`/`activateTheme`.
- `ifAlreadyInstalled`: `"overwrite"` | `"skip"` | `"error"`

### Activación (independiente)

Solo es necesario para plugins/temas que ya están en el disco (ej. después de `writeFile`/`writeFiles`):

```json
{ "step": "activatePlugin", "pluginPath": "mi-plugin/mi-plugin.php" }
```
```json
{ "step": "activateTheme", "themeFolderName": "twentytwentyfour" }
```

### Operaciones de Archivo

```json
{ "step": "writeFile", "path": "/wordpress/wp-content/mu-plugins/custom.php", "data": "<?php // código" }
```

`data` acepta un string plano (como se muestra arriba) o una referencia a un recurso (ej. `{ "resource": "url", "url": "https://..." }`).

```json
{
  "step": "writeFiles",
  "writeToPath": "/wordpress/wp-content/plugins/",
  "filesTree": {
    "resource": "literal:directory",
    "name": "mi-plugin",
    "files": {
      "plugin.php": "<?php\n/*\nPlugin Name: Mi Plugin\n*/",
      "includes": {
        "helpers.php": "<?php // helpers"
      }
    }
  }
}
```

**`writeFiles` requiere un DirectoryReference** (`literal:directory` o `git:directory`) como `filesTree` — no un objeto plano.

Otras operaciones de archivo: `mkdir`, `cp`, `mv`, `rm`, `rmdir`, `unzip`.

### Ejecución de Código

**runPHP:**
```json
{ "step": "runPHP", "code": "<?php require '/wordpress/wp-load.php'; update_option('key', 'value');" }
```
**OJO:** Debes incluir `require '/wordpress/wp-load.php';` para usar cualquier función de WordPress.

**wp-cli:**
```json
{ "step": "wp-cli", "command": "wp post create --post_type=page --post_title='Hola' --post_status=publish" }
```
El nombre del paso es `wp-cli` (con guion), NO `cli` ni `wpcli`.

**runSql:**
```json
{ "step": "runSql", "sql": { "resource": "literal", "name": "q.sql", "contents": "UPDATE wp_options SET option_value='val' WHERE option_name='key';" } }
```

### Configuración del Sitio

```json
{ "step": "setSiteOptions", "options": { "blogname": "Mi Sitio", "blogdescription": "Un eslogan" } }
```
```json
{ "step": "defineWpConfigConsts", "consts": { "WP_DEBUG": true } }
```
```json
{ "step": "setSiteLanguage", "language": "es_ES" }
```
```json
{ "step": "defineSiteUrl", "siteUrl": "https://ejemplo.com" }
```

### Otros Pasos

| Paso | Propiedades Clave |
|------|---------------|
| `login` | `username?`, `password?` (omisión `"admin"` / `"password"`) |
| `enableMultisite` | (sin propiedades requeridas) |
| `importWxr` | `file` (FileReference) |
| `importThemeStarterContent` | `themeSlug?` |
| `importWordPressFiles` | `wordPressFilesZip`, `pathInZip?` — importa un directorio completo de WP desde un zip |
| `request` | `request: { url, method?, headers?, body? }` |
| `updateUserMeta` | `userId`, `meta` |
| `runWpInstallationWizard` | `options?` — ejecuta el asistente de instalación de WP |
| `resetData` | (sin propiedades) |

## Patrones Comunes

### mu-plugin en línea (código personalizado rápido)

```json
{
  "step": "writeFile",
  "path": "/wordpress/wp-content/mu-plugins/custom.php",
  "data": "<?php\n// mu-plugins se cargan automáticamente — no requieren activación ni require wp-load.php\nadd_filter('show_admin_bar', '__return_false');"
}
```

### Plugin en línea con múltiples archivos

```json
{
  "step": "writeFiles",
  "writeToPath": "/wordpress/wp-content/plugins/",
  "filesTree": {
    "resource": "literal:directory",
    "name": "mi-plugin",
    "files": {
      "mi-plugin.php": "<?php\n/*\nPlugin Name: Mi Plugin\n*/\nrequire __DIR__ . '/includes/main.php';",
      "includes": {
        "main.php": "<?php // lógica principal"
      }
    }
  }
}
```

Luego actívalo con un paso separado:

```json
{ "step": "activatePlugin", "pluginPath": "mi-plugin/mi-plugin.php" }
```

### Plugin desde una rama de GitHub

```json
{
  "step": "installPlugin",
  "pluginData": {
    "resource": "git:directory",
    "url": "https://github.com/usuario/repo",
    "ref": "nombre-rama",
    "refType": "branch",
    "path": "/"
  }
}
```

## Errores Comunes

| Error | Correcto |
|---------|---------|
| `pluginZipFile` / `themeZipFile` | `pluginData` / `themeData` |
| `"step": "cli"` | `"step": "wp-cli"` |
| Objeto plano en `writeFiles.filesTree` | Debe ser un recurso `literal:directory` o `git:directory` |
| Separadores de ruta en claves de `files` | Usa objetos anidados para subdirectorios |
| `runPHP` sin `wp-load.php` | Siempre usa `require '/wordpress/wp-load.php';` para funciones de WP |
| Claves de nivel superior inventadas | Solo funcionan las claves documentadas |
| Inventar URLs de proxy para GitHub | Usa el tipo de recurso `git:directory` |
| Omitir `refType` con ramas/etiquetas | Es obligatorio — solo `"HEAD"` funciona sin él |
| Referencias a recursos en `literal:directory` | Los valores deben ser strings (contenido) u objetos (subcarpetas) |
| `features.debug` u otras claves de feature | `features` solo soporta `networking` e `intl` — usa `constants: { "WP_DEBUG": true }` |
| `require wp-load.php` en mu-plugin | Solo necesario en pasos `runPHP` — los mu-plugins ya corren dentro de WP |
| URL del esquema con dominio `.org` | Debe ser `playground.wordpress.net`, no `playground.wordpress.org` |

## Referencia Completa

Esta skill cubre los pasos y patrones más comunes. Para la API completa, consulta:

- **Documentación de Blueprints:** https://wordpress.github.io/wordpress-playground/blueprints
- **Esquema JSON:** https://playground.wordpress.net/blueprint-schema.json

Pasos adicionales no cubiertos arriba: `runPHPWithOptions` (ejecutar PHP con ajustes `ini` personalizados), `runWpInstallationWizard`, y tipos de recursos `vfs` y `bundled` (para escenarios de embebido avanzados).

## Bundles de Blueprints

Los bundles son paquetes autónomos que incluyen un `blueprint.json` junto con todos los recursos que referencia (plugins, temas, archivos WXR, etc.). En lugar de alojar activos externamente, agrúpalos junto al blueprint.

### Estructura de un Bundle

```
mi-bundle/
├── blueprint.json          ← debe estar en la raíz
├── mi-plugin.zip           ← directorio del plugin comprimido
├── tema.zip
└── contenido/
    └── contenido-ejemplo.wxr
```

Los plugins y temas deben estar comprimidos en ZIP antes de incluirlos — `installPlugin` espera un zip, no un directorio sin procesar. Para crear el zip desde un directorio de plugin:

```bash
cd mi-bundle
zip -r mi-plugin.zip mi-plugin/
```

### Referenciando Recursos del Bundle

Usa el tipo de recurso `bundled` para referenciar archivos dentro del bundle:

```json
{
  "step": "installPlugin",
  "pluginData": {
    "resource": "bundled",
    "path": "/mi-plugin.zip"
  },
  "options": { "activate": true }
}
```

```json
{
  "step": "importWxr",
  "file": {
    "resource": "bundled",
    "path": "/contenido/contenido-ejemplo.wxr"
  }
}
```

### Creación de un Bundle Paso a Paso

1. Crea el directorio del bundle y añade `blueprint.json` en su raíz.
2. Escribe los archivos fuente de tu plugin/tema en un subdirectorio (ej. `mi-plugin/mi-plugin.php`).
3. Comprime el directorio del plugin: `zip -r mi-plugin.zip mi-plugin/`
4. Referéncialo en `blueprint.json` usando `{ "resource": "bundled", "path": "/mi-plugin.zip" }`.

Ejemplo completo — un bundle que instala un plugin personalizado:

```
dashboard-widget-bundle/
├── blueprint.json
├── dashboard-widget.zip        ← zip de dashboard-widget/
└── dashboard-widget/           ← fuente del plugin (guardado para edición)
    └── dashboard-widget.php
```

```json
{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "landingPage": "/wp-admin/",
  "preferredVersions": { "php": "8.3", "wp": "latest" },
  "steps": [
    { "step": "login" },
    {
      "step": "installPlugin",
      "pluginData": { "resource": "bundled", "path": "/dashboard-widget.zip" },
      "options": { "activate": true }
    }
  ]
}
```

### Formatos de Distribución

| Formato | Cómo usarlo |
|--------|-----------|
| Archivo ZIP (remoto) | Web: `https://playground.wordpress.net/?blueprint-url=https://ejemplo.com/bundle.zip` |
| Archivo ZIP (local) | CLI: `npx @wp-playground/cli server --blueprint=./bundle.zip` |
| Directorio Local | CLI: `npx @wp-playground/cli server --blueprint=./mi-bundle/ --blueprint-may-read-adjacent-files` |
| Repositorio Git | Apunta `blueprint-url` a un directorio del repo que contenga `blueprint.json` |

**OJO:** Los bundles en directorios locales siempre necesitan `--blueprint-may-read-adjacent-files` para que el CLI pueda leer los recursos del bundle. Sin esto, cualquier referencia `"resource": "bundled"` fallará. Los bundles en ZIP no necesitan este flag.

## Probando Blueprints

### Blueprints en Línea (prueba rápida, sin bundles)

Minifica el JSON del blueprint (sin espacios extra), antepón `https://playground.wordpress.net/#`, y abre la URL en un navegador:

```
https://playground.wordpress.net/#{"$schema":"https://playground.wordpress.net/blueprint-schema.json","preferredVersions":{"php":"8.3","wp":"latest"},"steps":[{"step":"login"}]}
```

Los blueprints muy grandes pueden exceder los límites de longitud de URL del navegador; usa el CLI en su lugar.

### Pruebas Locales vía CLI

**Servidor interactivo** (se mantiene en ejecución, se abre en el navegador):
```bash
# Bundle en directorio — requiere --blueprint-may-read-adjacent-files
npx @wp-playground/cli server --blueprint=./mi-bundle/ --blueprint-may-read-adjacent-files

# Bundle en ZIP — autónomo, no requiere flags extra
npx @wp-playground/cli server --blueprint=./bundle.zip
```

**Validación Headless** (ejecuta el blueprint y sale):
```bash
npx @wp-playground/cli run-blueprint --blueprint=./mi-bundle/ --blueprint-may-read-adjacent-files
```

### Pruebas con la skill wordpress-playground-server

Usa la skill `wordpress-playground-server` para iniciar una instancia local de Playground con `--blueprint /ruta/al/blueprint.json`, luego verifica el estado esperado con Playwright MCP. Para bundles en directorios, pasa `--blueprint-may-read-adjacent-files` como argumento adicional.
