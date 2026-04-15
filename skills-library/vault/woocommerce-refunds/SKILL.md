---
name: woocommerce-refunds
description: "Especialista en la ejecución y gestión de reembolsos (totales/parciales) en WooCommerce. Incluye manejo de lógica para pasarelas de pago y Protocolo de Auto-Corrección para errores de gateway."
version: 1.0.0
tags: [woocommerce, refunds, api, payment-gateway]
category: "⚡ WordPress"
---

# WooCommerce Refunds Skill

## Objetivo
Automatizar y asegurar la integridad de las devoluciones en la tienda, interactuando con la API de WooCommerce y capturando errores de pasarela. Esta skill es **DETERMINISTA** y utiliza el cuaderno "Rembolsos Woocomecer xa Anti" como fuente de verdad absoluta.

## Directiva Principal (Refactorizada v4.1)
- [woocommerce_refunds_SOP.md](file:///Users/uskas/Desktop/MisSueños25/ANTIGRAVITY/Global SKILLs 4 Antigrabity /directivas/woocommerce_refunds_SOP.md)

## Reglas de Oro (NotebookLM)
1. **Pre-Flight Obligatorio:** Validar `order_item_id` mediante un GET previo.
2. **Fallo Progresivo:** Ante errores de pasarela (Stripe/Redsys), conmutar automáticamente a modo offline para conciliación manual.

## Triggers
`refund`, `devolución`, `reembolso`, `woocommerce-refund`

## Scripts de Referencia
- [woocommerce_refunds.py](file:///Users/uskas/Desktop/MisSueños25/ANTIGRAVITY/Global SKILLs 4 Antigrabity /scripts/woocommerce_refunds.py)
