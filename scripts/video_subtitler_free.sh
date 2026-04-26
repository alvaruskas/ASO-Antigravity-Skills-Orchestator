#!/bin/bash
# Subtitulador Libre Offshore D-ASO
# Argumentos: 1 Video_Path, 2 Language Target (e.g. es, en), 3 Action Task (transcribe, translate)
VIDEO_PATH="$1"
LANG="${2:-es}"
TASK="${3:-transcribe}"

if [ -z "$VIDEO_PATH" ]; then
    echo "Error: Debes proporcionar la ruta a un vídeo."
    exit 1
fi

if ! python3 -m whisper --help &> /dev/null; then
    echo "Falta openai-whisper. Ejecuta: pip3 install openai-whisper"
    exit 1
fi
if ! command -v ffmpeg &> /dev/null; then
    echo "Falta ffmpeg. Ejecuta: brew install ffmpeg"
    exit 1
fi

TMP_DIR=".tmp"
mkdir -p "$TMP_DIR"
cd "$TMP_DIR" || exit 1

# Whisper a veces se vuelve loco con espacios, mejor linkar absolute
ABS_VIDEO=$(cd "$(dirname "$VIDEO_PATH")" && pwd)/$(basename "$VIDEO_PATH")
BASENAME=$(basename "$ABS_VIDEO")
BASENAME_NO_EXT="${BASENAME%.*}"

echo "== [1/2] Iniciando Whisper Local Mode (modelo small) en $LANG con tarea $TASK == "
python3 -m whisper "$ABS_VIDEO" --model small --language "$LANG" --task "$TASK" --output_format srt

# El archivo srt deberia de estar con el mismo nombre
SRT_FILE="${BASENAME_NO_EXT}.srt"

if [ ! -f "$SRT_FILE" ]; then
    echo "Error general. No se pudo transcribir o encontrar el script."
    exit 1
fi

# Volvemos a base
cd ..

OUT_VIDEO="$(dirname "$VIDEO_PATH")/${BASENAME_NO_EXT}_${LANG}_subtitulado.mp4"

# FFmpeg parsing es muy puntilloso con la ruta
# Truco confiable: entrar directo al tmp dir y luego referir out
cd "$TMP_DIR" || exit 1
echo "== [2/2] Quemando los subtítulos SRT procesador por FFmpeg =="

# Forzamos hard subtitles (quemados en video) porque el usuario no veía los soft-subs
# Hacemos una copia simple `subs.srt` para evitar errores del AVFilter de rutas
cp "$SRT_FILE" subs.srt
FFMPEG_CMD="/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg"

if ! command -v "$FFMPEG_CMD" &> /dev/null; then
    FFMPEG_CMD="ffmpeg" # fallback
fi

if "$FFMPEG_CMD" -y -i "$ABS_VIDEO" -vf "subtitles=subs.srt:force_style='FontSize=16,MarginV=30'" -c:a copy "$OUT_VIDEO"; then
    echo "¡Éxito Libre! El vídeo final se ha exportado a:"
    echo "$OUT_VIDEO"
else
    echo "Error: Ocurrió un fallo en FFmpeg"
    exit 1
fi

cd ..
