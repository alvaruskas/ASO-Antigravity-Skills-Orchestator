# SOP: Servidor MCP para WordPress (Arquitectura y Plan de Acción)

Este documento define la estructura, herramientas y protocolos de seguridad para el servidor Model Context Protocol (MCP) que conectará agentes de IA con sitios WordPress.

## 1. Visión General
El objetivo es crear un puente determinista entre LLMs y la WordPress REST API para permitir la gestión autónoma de contenidos, auditorías SEO y mantenimiento técnico.

## 2. Arquitectura Técnica
- **Lenguaje:** Python 3.10+
- **Framework:** [FastMCP](https://github.com/modelcontextprotocol/python-sdk)
- **Comunicación:** WordPress REST API (JSON)
- **Seguridad:** Application Passwords (Basic Auth) sobre HTTPS.

## 3. Registro de Herramientas (Tools de la IA)

### Gestión de Contenidos
| Tool | Función | Parámetros |
| :--- | :--- | :--- |
| `wp_get_posts` | Lista entradas/páginas con filtros. | `status`, `per_page`, `categories` |
| `wp_create_post` | Crea nuevos borradores. | `title`, `content`, `excerpt` |
| `wp_update_post` | Modifica entradas existentes. | `id`, `content`, `status` |

### Contexto y Sistema
| Tool | Función | Descripción |
| :--- | :--- | :--- |
| `wp_get_system_info` | Auditoría de plugins y temas. | Permite a la IA saber si hay plugins de SEO o E-commerce activos. |
| `wp_get_media` | Lista la biblioteca de medios. | Útil para auditorías de Alt Text. |

## 4. Requisitos de Seguridad (Lineas Rojas)
- **HTTPS:** No se permiten credenciales en texto plano sobre HTTP.
- **Draft por Defecto:** Toda creación de contenido debe ser en estado `draft` (borrador) a menos que se indique lo contrario explícitamente.
- **Logs:** Los errores de la API deben volcarse a `stderr` para no corromper el transporte JSON-RPC del MCP.

## 5. Próximos Pasos (Pendiente de Ejecución)
1.  **Script Base:** Crear `scripts/wp_mcp_server.py` con el boilerplate de FastMCP.
2.  **Configuración:** Implementar carga de `.env` para `WP_URL`, `WP_USER` y `WP_APP_PASS`.
3.  **Hito 1:** Implementar `wp_get_system_info` como prueba de conexión.
4.  **Hito 2:** Implementar herramientas de escritura con confirmación humana (HITL).

---
> [!NOTE]
> Este SOP debe ser actualizado si se añaden capacidades de la **Abilities API** (WP 6.9+).
