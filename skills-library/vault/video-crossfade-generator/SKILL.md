---
name: video-crossfade-generator
description: Generador de transiciones crossfade (fundidos cruzados) avanzados para edición de vídeo automatizada e integración fluida.
category: "📦 Utilidades"
---

# Video Crossfade Generator

## Propósito
Generar vídeos mp4 de alta resolución a partir de secuencias de imágenes, asegurando transiciones `crossfade` (fundidos suaves) muy elegantes entre ellas. Esto es ideal para diseños gráficos de presentaciones donde el fondo o los bordes se mantienen fijos y solo cambia el contenido interno.

## Capacidades
- **Transición Fluida**: Aplica crossfade entre clips usando `MoviePy`.
- **Ajuste de Duración Total**: Calcula el tiempo de exposición por frame de forma dinámica para encajar exactamente en una duración total del vídeo indicada por el usuario (ej: 25 segundos).
- **Rendimiento**: Renderiza usando multihilos (`threads=4`) con preset `fast` para H.264.

## Instrucciones y Directiva (*SOP*)
1.  **Requisitos**: `pip install moviepy==1.0.3` (Nota: Requiere FFmpeg en el sistema, preinstalado por ImageIO).
2.  **Preparación**: Asegúrate de tener una carpeta con imágenes secuenciales (usualmente `.png` o `.jpg` que mantienen un mismo layout/fondo).
3.  **Ejecución**: 
    - Sintaxis: `python ~/.gemini/antigravity/skills/video-crossfade-generator/scripts/crossfade.py <carpeta_imagenes> <salida.mp4> [duracion_total_segundos]`
    - Ejemplo: `python .../crossfade.py "RRPP" "resultado_rrpp.mp4" 25.0`

## Restricciones y Casos Borde
- Si la duración total es baja (<10 segundos) y las imágenes son muchas (ej: 40+), el vídeo puede parecer un parpadeo acelerado (timelapse) en vez de unas transiciones relajadas. Lo ideal es entre 0.8 y 2 segundos de exposición total en pantalla por cada *slide*.
- El orden natural de imágenes se respeta (ej. de `1.png` a `2.png`, no de `1.png` a `10.png`).
