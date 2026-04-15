---
name: email-signature-generator
description: Se crea una herramienta que permite al usuario crear firmas de correo electrónico personalizadas. La herramienta es compatible con varias plataformas como Outlook, Apple Mail y Gmail. Se garantiza el uso de tecnologías como tablas para la estructura de la firma, CSS en línea para estilos visuales y URLs absolutas para los enlaces.
triggers: firma de mail, firma de email, firma html, creador de firmas, email signature, diseño de firma
category: "📦 Utilidades"
---

# Email Signature Generator (Firmas HTML)

## Propósito
Esta skill permite al Agente Antigravity actuar como un traductor visual experto de diseños de Firmas de Correo (ej. imágenes de Figma o mockups) a código HTML hiper-robusto y compatible con todos los clientes de correo, priorizando Microsoft Outlook mediante el uso estricto de tablas y anuladores MSO.

## Instrucciones del Flujo de Trabajo

Cuando el usuario invoque esta skill o pida crear una firma a partir de un diseño:

### 1. Lectura del SOP y Configuración
El Agente DEBE revisar silenciosamente la directiva maestra en:
`/Users/uskas/Desktop/MisSueños25/ANTIGRAVITY/Global SKILLs 4 Antigrabity /directivas/firmas_email_SOP.md`
Si el usuario aún no ha proporcionado un diseño (imagen) o los datos de la firma (nombre, cargo, teléfonos, enlaces), solicítalos educadamente antes de proceder.

### 2. Generación del Esqueleto (Paso Inteligente)
Una vez recibido el diseño, analiza los colores, tipografías y estructura.
Crea el archivo temporal HTML usando la herramienta `write_to_file` en la ruta:
`.tmp/firma_base_temporal.html` (relativo al workspace).

**Reglas de Oro Inquebrantables:**
- Usa **solamente** `<table>`, `<tr>` y `<td>` para la estructura visual. **PROHIBIDO USAR `<div>` o `display: flex`.**
- Fija el atributo `font-family` (y `color`, `font-size`) en **CADA** etiqueta. No uses clases de CSS. **Todo el CSS debe ser inline.**
- Para las imágenes (iconos, logos, foto), el `src` DEBE ser un enlace **absoluto**. Y DEBEN llevar siempre los atributos `width` (ej: `width="16"`) y `height` de forma declarativa, junto a `style="display:block; border:none;"`.

### 3. Ejecución del Compilador Creado
Una vez tengas el `.tmp/firma_base_temporal.html` listo, ejecuta el script de empaquetado y chequeo determinista.
```bash
python3 "/Users/uskas/Desktop/MisSueños25/ANTIGRAVITY/Global SKILLs 4 Antigrabity /scripts/generador_firmas_email.py" --input ".tmp/firma_base_temporal.html" --output "output/firmas/firma_final_preparada.html"
```
*(Ajusta la ruta si estás en un proyecto distinto, buscando el script en la ruta global de Antigravity).*

### 4. Verificación Visual (Obligatorio)
Inmediatamente después de generar el HTML, el Agente DEBE usar la herramienta `browser_subagent` (o su equivalente) para abrir la ruta absoluta del archivo `firma_final_preparada.html` en el navegador local.
- **Tu Objetivo Visual:** Confirmar que no hay elementos rotos, que la tabla respeta los anchos y los iconos cargan correctamente.
- Si ves algo raro, corrígelo en el HTML base y vuelve a ejecutar el paso 3.

### 5. Entrega e Instrucciones al Usuario
Tras confirmar visualmente que es perfecta, notifica al usuario: "He renderizado el diseño y lo he verificado en el navegador; ha quedado perfecto. Por favor, revísalo tú mismo."
Dile claramente qué archivos se han generado (`firma_final_preparada.html` y `_instrucciones.txt`).
Explícale que el método correcto de instalación es abrir el HTML en el navegador (Chrome/Safari), seleccionarlo todo (`Cmd/Ctrl+a`), copiarlo, y pegarlo en el editor de correos de Outlook, Apple Mail o Gmail.

## Restricciones y Casos Borde Notables
- Si la imagen contiene fuentes personalizadas (ej. Montserrat) usa Arial/Helvetica como caída fuerte en el `font-family` ya que los clientes de escritorio ignorarán el `@font-face`.
- Si Outlook engorda las imágenes es porque en tu HTML omitiste el atributo explícito `width="X"` de la etiqueta `<img>`.
