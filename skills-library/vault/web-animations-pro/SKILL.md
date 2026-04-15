---
name: web-animations-pro
description: Especialista en animaciones web de alto nivel. Con experiencia en herramientas como GSAP, Framer Motion y Three.js, crea experiencias inmersivas con un enfoque en el rendimiento optimizado.
triggers: animation, gsap, framer-motion, threejs, ui-premium, luxury-web
category: "🎨 Diseño & UI"
---

# Web Animations Pro (v4.x)

## Propósito
Esta skill está diseñada para elevar la calidad visual de las interfaces web mediante el uso de micro-interacciones, transiciones de layout complejas y efectos cinemáticos. Se enfoca en el realismo físico y la suavidad de 120fps.

## 1. El Core del Movimiento
- **GSAP (Imperativo)**: Úsalo para orquestación compleja de líneas de tiempo, manipulación de SVG y efectos de texto (`SplitText`, `ScrambleText`).
- **Framer Motion (Declarativo)**: Preferido en React para transiciones de estado, animaciones de entrada/salida y persistencia de componentes.

## 2. Marcadores de Calidad "Premium"
- **Spring Physics**: Evita los easings lineales tradicionales. Usa `type: "spring"` con parámetros de `stiffness` y `damping` para un feeling orgánico.
- **Stagger Effects**: Nunca animes elementos en bloque. Aplica pequeños retardos (staggers) de `0.05s` o `0.1s` para crear cascadas visuales.
- **FLIP Optimization**: Al animar cambios de tamaño o posición en el DOM, usa la técnica FLIP para evitar saltos. Framer Motion lo hace automático con la prop `layout`.

## 3. Técnicas Avanzadas
### Scroll Dynamics
- **Scroll-Triggered**: Elementos que aparecen al entrar al viewport. Usa `whileInView` o `ScrollTrigger.create()`.
- **Scroll-Linked**: Paralaje y barras de progreso sincronizadas con el scroll. Usa `useScroll` de Framer Motion.

### Cinematic 3D (Three.js)
Para sitios de impacto extremo, utiliza post-procesamiento:
- **Bloom**: Para brillos y luces de neón.
- **SSAO**: Para sombras ambientales que dan profundidad.
- **Bokeh**: Efecto de desenfoque de cámara (Depth of Field).

## 4. Auditoría de Rendimiento
- **GPU Acceleration**: Solo anima `transform` (scale, translate, rotate) y `opacity`. Evita animar propiedades que disparen el Re-flow (top, left, width, height).
- **Will-Change**: Usa `will-change: transform` de forma selectiva para preparar al navegador.
- **Checklist**:
    1. ¿La animación es interrumpible?
    2. ¿El easing se siente natural o robótico?
    3. ¿Se mantiene el frame rate estable en móviles?

## Recursos Recomendados
- [GSAP Docs](https://gsap.com/docs/)
- [Motion for React](https://www.framer.com/motion/)
- [Awwwards Collection (Inspiración)](https://www.awwwards.com/websites/animation/)
