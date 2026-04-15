---
name: video-reverser
description: Herramienta de automatización para invertir y rebobinar clips de vídeo mediante procesamiento directo.
category: "📦 Utilidades"
---

# Video Reverser Skill

Skill determinista implementada sobre scripts en Python para ejecutar manipulaciones perfectas de vídeo "marcha atrás" (reverse) sin deterioro apreciable en la calidad visual original. 

Se adhiere al flujo estricto de Arquitectura: Directiva -> Ejecución -> Observación y Aprendizaje.

## Requisitos
El sistema macOS del usuario debe tener instalado el motor global \`ffmpeg\` (accesible por línea de comandos).
- **Resolver**: \`brew install ffmpeg\`

## Capacidades Principales
- **Reverse de Alta Integridad**: Usa \`ffmpeg\` en modo Lossless Visual con \`-crf 17\` para asegurar que no existan daños estéticos indeseados al recodificar el metraje al revés.
- **Autosilenciado (Recomendado)**: Remueve la pista de audio para garantizar que no se arruine el resultado visual sonando de forma "marciana" - un estándar adoptado basándose en las notas de edición de Antigravity extraídas de NotebookLM.
- **Override de Audio**: Permite de forma manual que el audio persista e intervenga en la inversión.

## Modo de Uso (Terminal / Agente)

### Silenciando Audio (Modo Recomendado)
\`\`\`bash
python "/Users/uskas/Desktop/MisSueños25/ANTIGRAVITY/Global SKILLs 4 Antigrabity /scripts/video_reverse.py" -i "ruta/al/original.mp4" -o "ruta/al/invertido.mp4"
\`\`\`

### Manteniendo e Invirtiendo Audio
\`\`\`bash
python "/Users/uskas/Desktop/MisSueños25/ANTIGRAVITY/Global SKILLs 4 Antigrabity /scripts/video_reverse.py" -i "ruta/al/original.mp4" -o "ruta/al/invertido.mp4" --keep-audio
\`\`\`

## Ubicación de Archivos de la Tríada
- **Directiva**: \`/Users/uskas/Desktop/MisSueños25/ANTIGRAVITY/Global SKILLs 4 Antigrabity /directivas/video_reverse_SOP.md\`
- **Script (Ejecutable)**: \`/Users/uskas/Desktop/MisSueños25/ANTIGRAVITY/Global SKILLs 4 Antigrabity /scripts/video_reverse.py\`
