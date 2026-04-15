# Documentación: Endpoints Útiles para Dashboards Financieros (WooCommerce V3)

Para construir la capa de datos del Dashboard en la skill `woocommerce-reports-dashboard`, usa siempre la API REST v3.

## 1. Totales de Ventas (Snapshot Rápido)
**Endpoint:** `GET /wp-json/wc/v3/reports/sales`

**Parámetros Clave:**
- `date_min` (string): Fecha inicio `YYYY-MM-DD`.
- `date_max` (string): Fecha fin `YYYY-MM-DD`.

**Respuesta Útil:**
```json
[
  {
    "total_sales": "1500.00",
    "net_sales": "1200.00",
    "total_tax": "300.00",
    "total_shipping": "50.00",
    "total_refunds": "0.00",
    "total_orders": 12,
    "total_items": 45
  }
]
```
*Uso:* Alimenta directo las "Top Cards" y los totales del periodo.

## 2. Totales de Pedidos (Por Estado)
**Endpoint:** `GET /wp-json/wc/v3/reports/orders/totals`

**Respuesta Útil:**
```json
[
  { "slug": "completed", "name": "Completado", "total": 450 },
  { "slug": "processing", "name": "Procesando", "total": 12 },
  { "slug": "cancelled", "name": "Cancelado", "total": 8 },
  { "slug": "refunded", "name": "Reembolsado", "total": 2 },
  { "slug": "failed", "name": "Fallido", "total": 5 }
]
```
*Uso:* Fundamental para calcular la tasa de éxito y mostrar visuales de "Embudo de conversión" o monitorizar fugas de Redsys.

## 3. Top Sellers (Productos más vendidos)
**Endpoint:** `GET /wp-json/wc/v3/reports/top_sellers`

**Parámetros:**
- `date_min` y `date_max`.

**Respuesta Útil:**
Un array ordenado de productos con su `product_id`, `name`, y `quantity` vendidas en ese rango.
*Uso:* Alimenta la tabla/gráfico de ranking de productos.

## 4. Obtención de Pedidos detallados (Cálculos Avanzados)
**Endpoint:** `GET /wp-json/wc/v3/orders`

Si el Dashboard necesita calcular beneficios netos descontando comisiones bancarias exactas (e.g. Redsys), o buscar descuadres, se debe usar este endpoint filtrando por estado (`status=completed`) y fecha (`after`, `before`).
*Nota:* Requiere paginación iterativa (`page=1`, `page=2`...) ya que el límite máximo es 100 pedidos por request. Evitar usarlo en el hilo principal del frontend sin caché.
