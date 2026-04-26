---
description: "Gestión robusta de GitHub: reemplaza MCPs fallidos, gestiona tokens y automatiza el flujo de trabajo."
category: "🛠️ Metodología"
---

# GitHub Manager

## Purpose
Esta skill proporciona una interfaz determinista para interactuar con GitHub, superando las limitaciones de los servidores MCP externos. Permite validar tokens, reparar configuraciones de agentes (Claude Desktop) y automatizar tareas de repositorio mediante scripts locales.

## Instructions

### 1. Diagnóstico y Reparación de Conexión
Si el usuario reporta que "GitHub no funciona" o el MCP da error:
1.  **Ejecutar Validación**:
    ```bash
    python3 scripts/github_connector.py --validate
    ```
2.  **Si falla (401 Bad Credentials)**:
    - Solicitar al usuario un nuevo **Personal Access Token (Classic)** con alcances `repo`, `workflow`, `gist`.
    - Una vez recibido, guardarlo en el `.env` del proyecto como `GITHUB_TOKEN`.
3.  **Reparar Claude Desktop**:
    ```bash
    python3 scripts/github_connector.py --token "NUEVO_TOKEN" --update-claude
    ```
    *Nota: Esto actualizará automáticamente el archivo `claude_desktop_config.json`.*

### 2. Operaciones de Repositorio
Usa el conector para obtener información sin depender de herramientas externas:
- **Listar Repositorios**: `python3 scripts/github_connector.py --list-repos`
- **Gestión de PRs/Issues**: (Próximamente disponible en el conector, mientras tanto usar `gh` CLI si está disponible).

### 3. Sincronización con ASO
- Asegurar que todos los commits sigan el estándar de la skill `github-pro` (Conventional Commits en Español).
- Usar esta skill para verificar que el repositorio remoto esté actualizado antes de finalizar la sesión.

## Constraints
- **Seguridad**: Nunca imprimir el token completo en la consola.
- **Transparencia**: Informar siempre si se va a modificar el archivo de configuración de Claude Desktop.
- **Idioma**: Toda la interacción y mensajes generados para GitHub deben ser en **Español**.

## Resources
- **Script Conector**: `scripts/github_connector.py`
- **Configuración Claude**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Token**: Requiere un GitHub PAT (Personal Access Token).
