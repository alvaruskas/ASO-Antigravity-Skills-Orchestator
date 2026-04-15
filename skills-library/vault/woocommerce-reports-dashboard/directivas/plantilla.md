# Directiva: Construcción Dashboard de Informes WooCommerce

## 1. Alcance
- **Proyecto Destino:** [Nombre/Ruta del Proyecto, e.g. App Gestión BCBiocon]
- **Objetivo:** Construir una vista (página o modal) que consuma la API REST de WooCommerce para mostrar analíticas financieras aplicando las normativas de la skill `woocommerce-reports-dashboard`.

## 2. Requerimientos UI
El componente debe incluir:
1.  **Heredar Sistema de Diseño:** Es **CRÍTICO** que la vista use exactamente los mismos tokens, variables CSS (Colores, Tipografía), y componentes base (Botones, inputs) del Dashboard general de la App. No inventar estilos nuevos desconectados del proyecto host.
2.  **Filtros de Tiempo:** Componente de selección interactivo (Date Picker).
3.  **Top Cards (KPIs):** Ventas Netas, Brutas, Devoluciones y Total Pedidos.
4.  **Gráfico Principal:** Evolución de ventas en el tiempo (usa librerías como Recharts, Chart.js o similar basada en el stack del proyecto).
5.  **Acción Global:** Botón de exportación a PDF visible en cabecera.

## 3. Reglas Técnicas
- **Autenticación:** Leer Credenciales de `.env` configurado. Peticiones Server-side (si es Next.js) o Commands (si Tauri en Rust) para evitar exponer las claves `ck_` y `cs_` de WooCommerce al cliente.
- **Endpoint Core:** `GET /wp-json/wc/v3/reports/sales`.
- **Manejo de Estados:** Implementar siempre Skeletons durante las transiciones `isLoading`. 

## 4. Edge Cases Comunes (Control de Fugas)
- **Caché:** Las peticiones a WooCommerce reports son pesadas. Prohibido hacer pooling brutal; la vista debe cargar y ofrecer un botón de "Refrescar" manual o usar SWR / React Query con tiempos de revalidación amplios (ej. 5 minutos).
- **Timezones:** Obligatorio tratar el TZ offset al enviar parámetros `date_min` y `date_max` a WooCommerce (espera formato YYYY-MM-DD en UTC/Local dependiento del WP config).
