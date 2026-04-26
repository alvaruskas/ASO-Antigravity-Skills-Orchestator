---
name: video-subtitler
description: Skill de hardware nativo y gratuito para extraer audio de un video, transcribirlo en Mac de forma offline (0 APIs, 0 costes) e incrustar los subtítulos con FFmpeg.
---

# Skill: Subtitulador Offline (video-subtitler)

## Propósito
Transcribir con Whisper Local y luego quemar SRT con FFmpeg. Cero claves, privacidad total de archivos de vídeo.

## Instrucciones para el AGENTE
Cuando se te requiera ejecutar el subtitulado de vídeos:
1. Identifica claramente la RUTA del vídeo que el USER te entrega (`VIDEO_PATH`).
2. Identifica el IDIOMA del target que el USER exige (`LANG`, ejemplo 'es').
3. Si el script no tiene permisos, añadelos primero (`chmod +x scripts/video_subtitler_free.sh`).
4. Ejecuta utilizando terminal:
   ```bash
   bash scripts/video_subtitler_free.sh "{VIDEO_PATH}" "{LANG}"
   ```
5. Si falla el binario de whisper, ejecuta `pip install openai-whisper` e inténtalo de nuevo. 
6. Si falla ffmpeg, pide al USER el acceso o revisa Homebrew (`brew install ffmpeg`).
7. El archivo de salida terminara en `_subtitulado.mp4` en el mismo path origen. Confírmale al cliente cuando haya terminado.
