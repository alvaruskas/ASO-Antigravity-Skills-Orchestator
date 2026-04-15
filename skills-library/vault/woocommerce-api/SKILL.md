---
name: woocommerce-api
description: "Gestión avanzada y determinista de interacciones con la API REST de WooCommerce. Uso exclusivo para construir integraciones robustas de E-commerce, sincronización de pedidos y gestión de datos estandarizada."
version: 1.0.0
tags: [woocommerce, api, ecommerce, integration]
category: "⚡ WordPress"
---

# WooCommerce API Skill (SOP)

El objetivo de esta Skill es proporcionar un marco estructurado y robusto (basado en el "Protocolo de Auto-Corrección" y de automatizaciones confiables) para trabajar con la API de WooCommerce.

## 1. Reglas Globales de Integración

*   **Seguridad:** Solo se permiten peticiones sobre **HTTPS**. La autenticación debe usar *Consumer Key* y *Consumer Secret* enviados mediante *Basic Auth* (o por Query String si el server falla al procesar las headers correspondientes).
*   **Gestión de APIs:** Los scripts deben leer siempre las variables desde `.env` (ej: `WC_CONSUMER_KEY`, `WC_CONSUMER_SECRET`, `WC_API_URL`).
*   **Permalinks (WordPress):** La API solo funcionará si los enlaces permanentes de WordPress NO están en modo "Simple".
*   **Respuestas y Tiempos de Espera (Timeouts):** Las API pueden colgarse. Todos los scripts deben implementar un mecanismo de timeout (ej: 10 a 15 segundos) y atrapar excepciones de red.

## 2. Endpoints Críticos

La ruta base para la API REST v3 es: `https://[DOMINIO]/wp-json/wc/v3/`

### A. Pedidos (Orders)
*   **Listado (`GET /wc/v3/orders`):**
    *   *Pelígro:* No intentes descargar todos los pedidos. Usa los parámetros `?after=[fecha]` o `?status=[estado]` para restringir los datos.
*   **Actualitzación (`PUT /wc/v3/orders/{id}`):**
    *   Cambiar estados es la automatización más general. Respeta los estados: `pending`, `processing`, `on-hold`, `completed`, `cancelled`, `refunded`, `failed`.
*   **Devoluciones (`POST /wc/v3/orders/{order_id}/refunds`):**
    *   La API solo registra el apunte contable en la plataforma e impacta inventario si se envía `api_refund` / `api_restock: true`. **NO devuelve fondos de la pasarela de pago** si la pasarela no lo soporta o no se configuró correctamente. Se debe especificar por cada `line_item` si es parcial.

### B. Clientes y Catálogo (Customers / Products)
*   **Campos de Metadatos (`meta_data`):**
    *   **ESTA ES LA VÍA CORRECTA** para guardar IDs de otros ERPs, CRM o números de seguimiento. Nunca sobreescribas campos core para guardar datos de otros sistemas. Ejemplo de payload para actualizar:
    ```json
    {
      "meta_data": [
        { "key": "mi_erp_id", "value": "12345" }
      ]
    }
    ```
*   **Batch Operations:**
    *   Para procesar múltiples actualizaciones (ej. sincronizar stocks), utilizar el endpoint `/wc/v3/products/batch`. Enviar un JSON que contenga las claves `create`, `update` o `delete`, para reducir la carga de peticiones HTTP.

## 3. Automatización Robusta vs Polling

Evitar scripts que realicen peticiones cada minuto (Polling) en busca de cambios.
*   **Webhooks:** La mejor forma de mantener el estado es crear webhooks en WooCommerce (`WooCommerce > Ajustes > Avanzado > Webhooks`) que manden carga útil a nuestro sistema a través de eventos (`order.created`, `order.updated`, etc).
*   *Nota Relevante:* Los webhooks de WC se pausan/deshabilitan si perciben errores de entrega consecutivos (5 fallos). Tu backend receptor debe responder siempre con status HTTP `2xx`.

## 4. Memoria de Errores Comunes (Auto-Corrección)

| Error Común | Solución / Prevención |
| :--- | :--- |
| **HTTP 401 Unauthorized** | Asegurarse que el server pasa cabeceras (Apache/Nginx) o inyectar las keys por Query Params como último recurso. |
| **HTTP 404 No Route** | Cambiar los permalinks de WP a Nombre de entrada (Post Name). |
| **HTTP 429 Too Many Requests** | Has superado el rate limit. Pausar la ejecución de los requests transaccionales iterativos y utilizar la api `/batch`. |
| **Timeout en Peticiones GET** | Hay demasiados pedidos en el sistema. Utilizar la paginación de la API limitando a `?per_page=100` e iterar, o definir fechas `?before=` / `?after=`. |

## 5. Implementación en tu Stack

Al aplicar esta Skill en la suite de `ANTIGRAVITY`, recuerda crear primero la directiva en la carpeta del proyecto actual invocando este SOP y generando los scripts python en `scripts/` basándote en la gestión idempotente de estos puntos de error.
