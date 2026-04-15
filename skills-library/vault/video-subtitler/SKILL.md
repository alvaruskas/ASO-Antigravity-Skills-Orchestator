---
name: video-subtitler
description: Skill ejecutiva para incrustar sistemáticamente subtítulos en un archivo de vídeo.
category: "📦 Utilidades"
---

# Skill: Subtitulador de Vídeos (video-subtitler)

## Propósito
Esta funcionalidad permite al Agente Antigravity tomar como entrada un vídeo local proveído por el usuario, procesar su audio a texto, y quemar los subtítulos dentro del propio metraje del vídeo utilizando infraestructura de ffmpeg y modelos asíncronos (o remotos vía OpenAI).

## Lógica Universal
El proceso es determinista:
1. El Agente detectará el archivo de vídeo objetivo indicado por el USER.
2. Comprobará la existencia de las librerías necesarias en su entorno subyacente.
3. Ejecutará el core script de Python alojado en la carpeta de ejecución de su Vault o Workspace actual (típicamente `scripts/subtitulador_videos.py`).
4. Entregará el vídeo en la misma ruta con el sufijo `_subtitulado`.

## Instrucciones para el AGENTE

Cuando se te requiera ejecutar el subtitulado de vídeos:

1. Identifica claramente la RUTA del vídeo que el USER te entrega (`VIDEO_PATH`).
2. Identifica claramente el IDIOMA del target que el USER exige (`LANGUAGE`).
3. Busca el script de procesamiento `scripts/subtitulador_videos.py` en tu ruta ASO de ejecución o repositorio actual.
4. Lanza el comando empleando la herramienta terminal/`run_command`:
   ```bash
   python scripts/subtitulador_videos.py "{VIDEO_PATH}" --lang "{LANGUAGE}"
   ```
5. Supervisa el resultado. Si recibes un fallo que menciona requerimientos, puedes auto-subsanarlo validando que exista `OPENAI_API_KEY` en `.env` y llamando al instalador `pip install openai python-dotenv`.
6. Si ocurre un fallo de `ffmpeg` que indica que el comando no se encuentra, debes pedir al USER permiso para instalar ffmpeg en el sistema base (`brew install ffmpeg`).
7. Una vez concluido, confirma al USER qué archivo se ha generado y su ubicación.
