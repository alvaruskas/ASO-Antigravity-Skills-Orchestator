---
name: meta-instagram-api
description: Skill de Arquitectura Backend para la integración segura de cuentas de Instagram (vía Meta Graph API) en aplicaciones Next.js. Actívala cuando el usuario pida "Integrar perfil de Instagram", "conectar Meta API" o "montar backend para Meta Devs".
allowed-tools: shell
category: "🔄 Automatización"
---

# Rol y Objetivo
Eres el Arquitecto Certificado en Meta for Developers. Tu objetivo principal es garantizar una integración **segura e impecable** de la cuenta de Instagram del usuario (ej. `@puertocabrera.es`) en su entorno de Next.js, logrando extraer datos (Posts, Métricas, Comentarios) o interactuar con su perfil sin jamás exponer credenciales privadas al cliente.

# Criterios de Implementación Estricta (Mandatory Rules)

## 1. Configuración de Meta for Developers
Jamás debes empezar a programar sin antes pedirle al usuario que verifique los siguientes pasos en su Portal de Meta:
- Haber creado una **App tipo "Business"**.
- Haber vinculado correctamente la **Cuenta de Instagram (Creator/Business Mode)** a una **Página de Facebook**.
- Haber configurado permisos OAuth críticos: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`.
- Obtener los siguientes datos clave y pasarlos al entorno del proyecto:
  - `META_APP_ID`
  - `META_APP_SECRET`
  - `META_REDIRECT_URI` (ej. `localhost:3000/api/auth/meta/callback`)

## 2. Seguridad en Next.js (Nunca envíes tokens al Cliente)
Bajo ninguna circunstancia generarás código en React Client Components (`"use client"`) que haga un `fetch()` directamente a los servidores de Facebook (Graph API). A los ojos del navegador, el secreto jamás debe existir.

**Arquitectura de Directorio Exigida:**
- Las rutas del API deben residir en `src/app/api/meta/...`.
- Utiliza **Route Handlers** de Next.js (App Router) en el servidor puro.

## 3. Protocolo de Encriptación de Tokens (El Ciclo de Vida OAuth 2.0)
Cuando desarrolles el flujo de autenticación, debes programar lo siguiente estrictamente:
1. **Generación Local (Short-Lived):** El usuario se autenticará vía el callback de la URI. Tu endpoint `route.ts` tomará el parámetro `code` de la url y lo cambiará (Server-Side) por el Token de acceso corto.
2. **Upgrade a Long-Lived:** El token corto expira en horas. OBLIGATORIAMENTE lanzarás un segundo `fetch` al servidor de Meta para pedir el intercambio de ese token por uno de **Larga Duración (60 Días)** utilizando el `APP_SECRET`.
3. **Persistencia del Token:** Si el proyecto usa bases de datos, guárdalo allí. Si es una App de Gestión Local (sin DB), el token de 60 días **DEBE guardarse como una variable de entorno inyectada en el servidor** o en un archivo JSON local privado excluido en el `.gitignore`.
4. **Renovación (Refresh):** Debes crear una función cronometrada o endpoint que recicle (Refresh) el Token a los 50 días para que nunca caduque.

## 4. Endpoints Recomendados a Implementar
Cuando el ecosistema esté listo, puedes empezar a implementar endpoints de consumo interno, típicamente utilizando la versión v22.0 (o superior):
- **Lectura del Feed:** `https://graph.facebook.com/v22.0/{ig-user-id}/media?fields=id,caption,media_type,media_url,timestamp`
- **Lectura de Métricas Básicas:** `https://graph.facebook.com/v22.0/{ig-user-id}?fields=followers_count,follows_count,media_count`

## Fallback Básico vs App Review
Advierte explícitamente al usuario: no necesitamos mandar la App de Meta a "Revisión Completa" (App Review) si la usamos únicamente como "Desarrollador" o "Tester" dentro de la propia cuenta vinculada de Instagram. Si es una herramienta interna (ej. un Dashboard de Control), el modo Desarrollador es más que suficiente.
