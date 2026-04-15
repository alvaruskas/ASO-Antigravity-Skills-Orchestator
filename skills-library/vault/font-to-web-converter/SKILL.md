---
name: font-to-web-converter
description: Convierte fuentes de forma estrictamente local desde formatos OTF/TTF a estándares de fuente optimizados WOFF/WOFF2, manteniendo la seguridad y privacidad de las tipografías comerciales al evitar su exposición en la nube.
category: "📦 Utilidades"
---

# Font to Web Converter

Esta habilidad ejecuta de forma completamente segura y "Local-First" la conversión programática de activos tipográficos pesados o de escritorio para uso moderno en proyectos Web y maquetación UI avanzada, valiéndose exclusivamente de librerías Python certificadas como `fonttools` y `brotli`.

## Prerrequisitos de Arquitectura
El entorno virtual o Python global debe tener las dependencias inyectadas para la manipulación de fuentes. El agente debe ejecutar si no están presentes:
`pip install fonttools brotli`

## El Bucle de Ejecución

1. **Lectura de Directiva (Previa):** Conoce las trampas del script consultando `directivas/font_to_web_SOP.md` en el sistema global.
2. **Entrada Aislada (Input):** Asegúrate de poseer la Ruta Absoluta correcta suministrada por el usuario de la localización del activo local `.otf` o `.ttf`. Las fuentes relativas están prohibidas.
3. **Ejecución del Motor (Command):**
   Inicia la secuencia llamando a Python mediante la línea de comandos contra el script global de Antigravity:
   `python "/Users/uskas/Desktop/MisSueños25/ANTIGRAVITY/Global SKILLs 4 Antigrabity /scripts/font_to_web.py" "/Ruta/Absoluta/A/La/Fuente/Tipografia.otf"`
4. **Verificación Estática:** Analiza la terminal esperando el código 0 y `[✓] Optimización tipográfica completada`. Los archivos `.woff` y `.woff2` aparecerán transparentemente junto a tu archivo original.
5. **Entrega de Artefacto:** Informa inmediatamente al usuario de que los archivos han sido procesados y están listos para inyectar su CSS en `@font-face`.

## Casuística de Fallos
Si una fuente marca error desde `fonttools` al procesarla en WOFF2, asegúrate a primera impresión de que el entorno posee el codec brotli y arranca el *Ciclo de Aprendizaje* (Protocolo de Autocorrección).
