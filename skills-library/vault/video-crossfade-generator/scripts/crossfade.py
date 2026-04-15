import os
import sys
import glob

try:
    from moviepy.editor import ImageClip, CompositeVideoClip
except ImportError:
    print("Error: moviepy no esta instalado. Instala con: pip install moviepy==1.0.3")
    sys.exit(1)

def main():
    if len(sys.argv) < 3:
        print("Uso: python crossfade.py <carpeta_imagenes> <nombre_salida.mp4> [duracion_segundos_total]")
        sys.exit(1)

    folder = sys.argv[1]
    output = sys.argv[2]
    total_duration = 25.0
    if len(sys.argv) > 3:
        total_duration = float(sys.argv[3])

    if not os.path.exists(folder):
        print(f"La carpeta '{folder}' no existe.")
        sys.exit(1)

    # Buscar imágenes ordenadas de forma humana si es posible
    import re
    def natural_sort_key(s):
        return [int(text) if text.isdigit() else text.lower() for text in re.split('([0-9]+)', s)]

    extensions = ('*.png', '*.jpg', '*.jpeg')
    images = []
    for ext in extensions:
        images.extend(glob.glob(os.path.join(folder, ext)))

    images.sort(key=natural_sort_key)

    if not images:
        print(f"No se encontraron imagenes en {folder}")
        sys.exit(1)

    num_images = len(images)
    print(f"Preparando video desde {num_images} imagenes para durar {total_duration}s totales...")

    crossfade_dur = 0.5 # Medio segundo de fundido
    
    # Calcular duración óptima de cada clip para clavar la duración total
    # Total_Duration = (Clip_Dur - Crossfade) * (N - 1) + Clip_Dur
    # Total_Duration = Clip_Dur * N - Crossfade * (N - 1)
    # Clip_Dur = (Total_Duration + Crossfade * (N - 1)) / N
    clip_dur = (total_duration + crossfade_dur * (num_images - 1)) / num_images
    
    print(f"Exposicion por imagen: {clip_dur:.2f}s | Transition Crossfade: {crossfade_dur}s")

    clips = []
    current_start = 0.0

    for i, img_path in enumerate(images):
        print(f"Procesando frame {i+1}...")
        clip = ImageClip(img_path).set_duration(clip_dur)
        
        # El primer clip no necesita crossfadein
        if i > 0:
            current_start += (clip_dur - crossfade_dur)
            clip = clip.set_start(current_start).crossfadein(crossfade_dur)
        else:
            clip = clip.set_start(0)

        clips.append(clip)

    print("Componiendo linea de tiempo...")
    video = CompositeVideoClip(clips)
    
    # Exportar (usar threads para acelerar)
    print("Renderizando mp4...")
    video.write_videofile(output, fps=25, codec='libx264', threads=4, preset='fast')
    print(f"Video exportado con exito a: {output}")

if __name__ == '__main__':
    main()
