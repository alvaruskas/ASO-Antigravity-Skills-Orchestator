import os
import requests
import json
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv
from fastmcp import FastMCP
from typing import Optional, List, Any

# Cargar variables de entorno
load_dotenv()

# Configuración desde .env
WP_URL = os.getenv("WP_URL", "").rstrip("/")
WP_USER = os.getenv("WP_USER")
WP_APP_PASS = os.getenv("WP_APP_PASS")
DEFAULT_STATUS = os.getenv("WP_DEFAULT_STATUS", "draft")

# Inicializar FastMCP
mcp = FastMCP("WordPress-Orchestrator")

def get_auth():
    """Retorna el objeto de autenticación básica para las peticiones."""
    return HTTPBasicAuth(WP_USER, WP_APP_PASS)

def validate_config():
    """Verifica que las credenciales básicas estén presentes."""
    if not all([WP_URL, WP_USER, WP_APP_PASS]):
        return False, "Faltan credenciales en el archivo .env (WP_URL, WP_USER, WP_APP_PASS)"
    return True, ""

@mcp.tool()
def wp_get_system_info() -> Any:
    """
    Retorna información técnica del sitio WordPress.
    Útil para auditorías iniciales de temas y plugins.
    """
    valid, error = validate_config()
    if not valid: return error

    try:
        response = requests.get(f"{WP_URL}/wp-json/", auth=get_auth(), timeout=10)
        response.raise_for_status()
        data = response.json()
        return {
            "site_name": data.get("name"),
            "description": data.get("description"),
            "base_url": data.get("url"),
            "namespaces": data.get("namespaces", []),
            "timezone": data.get("timezone_string")
        }
    except Exception as e:
        return f"Error al conectar con la API de WordPress: {str(e)}"

@mcp.tool()
def wp_get_posts(status: str = "publish", per_page: int = 10, page: int = 1) -> Any:
    """
    Lista las entradas (posts) del sitio con filtros.
    Parámetros:
    - status: 'publish', 'draft', 'private', 'future'
    - per_page: Número de resultados por página (max 100)
    - page: Número de página
    """
    valid, error = validate_config()
    if not valid: return error

    params = {
        "status": status,
        "per_page": per_page,
        "page": page,
        "_fields": "id,title,link,date,status,author"
    }

    try:
        response = requests.get(f"{WP_URL}/wp-json/wp/v2/posts", auth=get_auth(), params=params, timeout=15)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return f"Error al obtener entradas: {str(e)}"

@mcp.tool()
def wp_create_post(title: str, content: str, status: str = "draft", excerpt: str = "") -> Any:
    """
    Crea una nueva entrada en WordPress.
    Por defecto se crea como 'draft' por seguridad.
    """
    valid, error = validate_config()
    if not valid: return error

    payload = {
        "title": title,
        "content": content,
        "status": status or DEFAULT_STATUS,
        "excerpt": excerpt
    }

    try:
        response = requests.post(f"{WP_URL}/wp-json/wp/v2/posts", auth=get_auth(), json=payload, timeout=15)
        response.raise_for_status()
        res_data = response.json()
        return f"Post creado exitosamente. ID: {res_data.get('id')} - Link: {res_data.get('link')}"
    except Exception as e:
        return f"Error al crear el post: {str(e)}"

@mcp.tool()
def wp_update_post(post_id: int, content: Optional[str] = None, title: Optional[str] = None, status: Optional[str] = None) -> Any:
    """
    Actualiza una entrada existente mediante su ID.
    Solo envía los campos que se desean modificar.
    """
    valid, error = validate_config()
    if not valid: return error

    payload = {}
    if content: payload["content"] = content
    if title: payload["title"] = title
    if status: payload["status"] = status

    if not payload:
        return "No se proporcionaron cambios para actualizar."

    try:
        response = requests.post(f"{WP_URL}/wp-json/wp/v2/posts/{post_id}", auth=get_auth(), json=payload, timeout=15)
        response.raise_for_status()
        return f"Post {post_id} actualizado correctamente."
    except Exception as e:
        return f"Error al actualizar el post {post_id}: {str(e)}"

@mcp.tool()
def wp_get_media(per_page: int = 20) -> Any:
    """
    Lista los elementos de la biblioteca de medios.
    Útil para auditar textos alternativos (Alt Text) y optimización de imágenes.
    """
    valid, error = validate_config()
    if not valid: return error

    params = {
        "per_page": per_page,
        "_fields": "id,title,source_url,alt_text,media_details"
    }

    try:
        response = requests.get(f"{WP_URL}/wp-json/wp/v2/media", auth=get_auth(), params=params, timeout=15)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return f"Error al obtener medios: {str(e)}"

if __name__ == "__main__":
    # Iniciar el servidor (usa stdio por defecto)
    mcp.run()
