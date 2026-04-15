# SOP: Generador de Subtítulos (Versión V2 - Local y Gratuita)

## Objetivo
Tomar un archivo de vídeo, transcribirlo en su idioma de manera totalmente gratuita y offline usando los recursos de Mac (con `openai-whisper` a través de terminal), generar un archivo SRT limpio temporalmente (`.tmp/`) y quemar los subtítulos en un vídeo exportado final con `ffmpeg`.

## Componentes y Arquitectura
- **Motor de Transcripción**: `openai-whisper` OS-Level Package. Totalmente autónomo y local. Ejecutado como un binario en Bash.
- **Motor de Edición de Vídeo**: `ffmpeg`. Para encapsular el metraje.
- **Entorno**: Cero APIs, sin dependencias de tokens de OpenAI ni claves en `.env`.

## Lógica y Pasos a Seguir
1. **Validar Herramientas**: Comprobar si `whisper` y `ffmpeg` responden en la consola.
2. **Generar SRT**: Moverse internamente a `.tmp/` y lanzar `whisper [VIDEO_PATH] --model small --language [LANG] --output_format srt`. Esta herramienta automáticamente crea un SRT con el nombre del vídeo en la ruta de trabajo.
3. **Escapar Rutas**: Identificar internamente al SRT y renombrarlo temporalmente (`subs.srt`) para evitar problemas con símbolos en el parseo.
4. **Quemado de Exportación (Hard Subs)**: Invocamos FFmpeg asumiendo su versión vitaminada (`ffmpeg-full` path directo). Usamos el comando de grabación forzosa de píxeles: `ffmpeg -i [VIDEO] -vf "subtitles=subs.srt" -c:a copy [OUTPUT]`. Esto incrusta los gráficos sobre los fotogramas asegurando un 100% de compatibilidad en reproductores móviles y redes sociales (Ej: WhatsApp sin botón CC).

## Restricciones y Notas Registradas
- **Restricción Histórica (Coste/Tokens)**: Se usaba Python en V1 solicitando `$OPENAI_API_KEY`. Esa ruta ha sido erradicada. La skill actual NUNCA DEBE solicitar una API KEY.
- **Restricción Hardware**: Modelos tipo `large-v3` pueden asfixiar una Mac promedio. Usa SIEMPRE `--model small` inicialmente o `--model base` para mayor rapidez.
- **Limpieza**: La CLI de whisper exporta archivos `json`, `tsv` y `txt` ademas del `srt` si no especificamos output. Obligatorio el uso de `--output_format srt` por limpieza.
- **Trampa FFmpeg (Espacios)**: Nota: No hacer llamadas a `ffmpeg -vf "subtitles=$SRT_FILE"` si el archivo original del SRT tiene espacios, porque FFmpeg provoca un error de `parsing` creyendo que son comandos distintos. En su lugar, hacer una copia local temporal, ej: `cp "$SRT_FILE" subs_temp.srt` e invocar a ese archivo en la ejecución de FFmpeg.
