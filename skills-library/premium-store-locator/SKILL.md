---
name: premium-store-locator
description: Diseño e implementación de contenedores web de alta gama basados en brutalismo arquitectónico, asimetría y tipografía premium.
category: "🎨 Diseño & UI"
---

# Skill: Premium Store Locator ("The Digital Sommelier")

## 1. Creative North Star & Optimal Formula
Esta skill sirve para construir la experiencia completa de **"Dónde encontrarnos"**. No se trata solo de un contenedor, sino de la fórmula óptima de:
**[Formulario de Búsqueda] + [Listado Dinámico] + [Mapa Interactivo]**.

## 2. Design Tokens (Estrictos)

### Paleta Dual
- **Modo Oscuro (Signature):**
  - Surface: `#121416` (Negro Absoluto)
  - Container: `#242E35` (Deep Sea)
  - Gold Accent: `#CFC6AB` (Oro Muted)
- **Modo Claro (Silk):**
  - Surface: `#FFFFFF`
  - Typography: `#242E35`
  - Accent: `#C4BBA0`

### Tipografía (El Dúo Editorial)
- **Newsreader / Serif:** Exclusivamente para nombres de locales, títulos regionales y grandes pantallas (min. `3.5rem` en desktop). Letreado negativo `-0.02em`.
- **Manrope / Sans-Serif:** Para toda la data técnica (direcciones, horarios, distancias). Prioriza la legibilidad absoluta.

## 3. Reglas de Construcción (Rigurosas)

### La Regla "No-Line"
> [!IMPORTANT]
> Queda estrictamente prohibido el uso de bordes de `1px` sólidos o reglas horizontales (`<hr>`) para separar secciones.
- La separación debe lograrse mediante la **Jerarquía de Superficies** (apilamiento de tonos de gris/fondo) y el uso de espacios en blanco intencionales.

### Arquitectura Asimétrica
- Evita rejillas perfectamente simétricas.
- Ratio Maestro: **35% Sidebar / 65% Main Content**. Esto crea un peso visual moderno y balanceado.

### Profundidad sin Sombras (Layering)
- No uses `drop-shadows` estándar. Crea profundidad mediante:
  - `surface-container-lowest` (Nivel 0 - Mapa o Fondo Base)
  - `surface-container-low` (Nivel 1 - Sidebars)
  - `surface-container-high` (Nivel 2 - Tarjetas Activas)
- **Ghost Border:** Para definir inputs, usa el borde al 15% de opacidad. Debe "sentirse, no verse".

## 4. Componentes y Estados

### Store Cards / List Items
- **Padding:** `1.5rem` vertical para separar ítems sin líneas.
- **Estado Activo:** Cambiar fondo a `surface-container-highest` y añadir un **accent bar lateral izquierdo** de `2px` en color Oro.

### HUD & Overlays
- Usa **Glassmorphism**: Fondo con 70% de opacidad y `24px` de backdrop-blur.

### Animaciones
- **Curva:** `200ms` Cubic-Bezier (0.4, 0, 0.2, 1).
- **Estilo:** Instantáneo pero suave. Sin rebotes.

## 5. Lógica Óptima de Funcionalidad
Para que el localizador sea funcionalmente "Premium", debe seguir este flujo:
1.  **Geolocalización Pasiva:** Intentar detectar la ubicación del usuario al cargar para ordenar la lista por proximidad automáticamente.
2.  **Filtrado en Tiempo Real:** El input de búsqueda debe filtrar por Nombre, Ciudad o Código Postal sin refrescar la página.
3.  **Paginación Progresiva:** Mostrar de 10 en 10 para no saturar el DOM y mantener el rendimiento.
4.  **Sincronización Bidireccional:** Al hacer clic en la lista, el mapa debe "volar" (flyTo) al marcador. Al hacer clic en el marcador, la lista debe resaltar el ítem correspondiente.

## 6. Instrucciones para el Agente
Al activar esta skill, debes:
1.  Insertar los Google Fonts necesarios (`Newsreader`, `Manrope`).
2.  Configurar Tailwind o CSS con los tokens `ds-primary`, `ds-secondary`, etc.
3.  Implementar el layout 35/65 mediante Flexbox o Grid.
4.  Revisar el código final para eliminar cualquier `border` o `hr` residual, aplicando la jerarquía de superficies en su lugar.
