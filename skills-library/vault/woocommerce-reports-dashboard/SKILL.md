---
name: woocommerce-reports-dashboard
description: Especialista UX/UI y Backend para crear Dashboards de Informes Financieros extraídos de la API REST de WooCommerce. Define arquitecturas visuales, KPIs clave y conexión de datos.
category: "⚡ WordPress"
---

# Skill: WooCommerce Reports Dashboard

Esta skill proporciona las directrices y arquitecturas necesarias para construir paneles de analíticas ("Dashboards") de grado empresarial conectados a WooCommerce, priorizando la precisión contable (beneficios, devoluciones, Redsys), el rendimiento (React/Tauri/Next) y el diseño Premium (UX/UI).

## 1. Casos de Uso (¿Cuándo usar esta skill?)
- Cuando el usuario solicite "Añadir una sección de Informes a la App".
- Al diseñar paneles de control financieros.
- Cuando se deban conciliar ventas brutas vs netas, IVA, reembolsos y cancelaciones de WooCommerce en una Interfaz de Usuario.

## 2. KPIs y Estructura Visual Fundamental

Todo Dashboard creado bajo esta skill DEBE seguir la siguiente estructura jerárquica obligatoria (basada en mejores prácticas UX):

**A. Filtro Global (Cabecera):**
- Selector de fecha (Hoy, 7D, 30D, YTD, Personalizado).
- Botón principal de "Exportar a PDF".

**B. "Top Cards" (KPIs Principales y Financieros):**
1. **Total Ingresos (Bruto y Neto):** Debe quedar claro cuánto fue el bruto y cuánto el neto tras impuestos y comisiones.
2. **Ticket Medio (AOV) e Ingresos por Visitante (RPV):** Ingresos Brutos / Total Pedidos. Agregando el RPV multiplicando por Conversión.
3. **Tasa de Conversión (CR) y Abandono:** Porcentaje de visitantes que compran, y cuántos abandonan carrito.
4. **Devoluciones y Cancelaciones (Crítico):** Monitorización de `refunded` y `cancelled`.

**C. Sección Gráficos de Tendencias y Heatmaps:**
- **Gráfico de Líneas/Áreas:** Evolución de Ingresos vs Pedidos a lo largo del periodo seleccionado. Ayuda a ver picos de demanda.
- **Mapas de Calor de Ventas:** Visualización para detectar qué horas de la semana concentran las compras.

**D. Sección Analítica de Negocio (Catálogo y Clientes):**
- **Ranking de Productos (Top Sellers):** Tabla/Gráfico de Barras Horizontales con los Top 5 productos más vendidos, ordenados por volumen (€) y unidades, cruzando alertas de devoluciones por producto.
- **Ventas por Ciudad / Ubicación:** Tabla y/o Mapa listando el volumen de pedidos por código postal, ciudad o región.
- **Rendimiento por Categorías y Cupones:** Gráfico mostrando ingresos por categoría y volumen de descuentos (identificando dependencia de ofertas).
- **Inteligencia de Cliente (RFM y LTV):** Desglose de ingresos de "Nuevos vs Recurrentes", segmentación de clientes por Valor Monetario y Frecuencia, y Valor de Vida del Cliente (CLV).

## 3. Arquitectura de Datos (WooCommerce API)

Para alimentar la vista, delega las llamadas a la API REST de WooCommerce.

*   **Endpoint Principal (Snapshot):** `GET /wp-json/wc/v3/reports/sales` (pasando `date_min` y `date_max`). Entrega el `total_sales`, `net_sales`, `total_tax`, `total_refunds`. Ideal para las *Top Cards* y la línea temporal.
*   **Métricas de Fugas (Importante):** `GET /wp-json/wc/v3/reports/orders/totals`. Para contar el número específico de transacciones en estado de fraude, fallidas o devueltas.

> [!WARNING]
> Nunca dependas solo del `total_sales` si la tienda usa Redsys y permite reembolsos parciales desde el TPV no sincronizados inicialmente (ver skill `redsys-refund-manager`). El Dashboard debe avisar siempre si Detecta Descuadres Fiscales.

## 4. UI/UX: Reglas de Diseño Premium
- **Clean UI:** Evita colores estridentes (rojos/verdes básicos). Usa variables de color HSL semánticas (ej. Green-500, Red-500) pero en tonos apagados o pasteles para fondos de tarjetas, reservando el color intenso solo para la cifra o el icono.
- **Carga Cognitiva Cero:** Solo muestra lo que importa basado en contexto. Las tablas deben tener paginación.
- **Loading Skeletons:** Al conectar a la API de Woo (que suele ser lenta), MUESTRA SIEMPRE SKELETONS animados en lugar de "Cargando...".

## 5. Instrucciones para el Creador (Agente Antigravity)
Cuando el usuario pida aplicar esta skill:
1. Revisa o crea la directiva `directivas/informes_dashboard_app.md` en el proyecto destino para asentar requerimientos.
2. Construye el esqueleto UI del componente `Dashboard` (en React/Next.js/Tauri).
3. Escribe el servicio de fetching para consultar `/reports/sales`.
4. Integra funciones de exportación (ej. usando `html2pdf.js` o librerías server-side si procediera).
