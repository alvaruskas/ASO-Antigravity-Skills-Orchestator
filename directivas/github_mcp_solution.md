# Directiva: Resolución GitHub MCP y Skill de Reemplazo

## Contexto
El usuario reporta fallos en el servidor MCP de GitHub. La investigación revela que el token configurado en `claude_desktop_config.json` devuelve "Bad credentials" (401). El sistema `gh` CLI local tampoco está autenticado.

## Objetivos
1. **Diagnóstico**: Confirmar la invalidez del token actual (Hecho).
2. **Skill de Reemplazo**: Crear `github-manager` (evolución de `github-pro`) para que sea independiente de MCP externos si es necesario, operando mediante scripts deterministas.
3. **Automatización de Reparación**: Crear un script que valide tokens y actualice la configuración de Claude Desktop automáticamente.

## Arquitectura de la Solución (Skill: github-manager)
- **Script Principal**: `scripts/github_connector.py` (Usa `requests` para interactuar con la API).
- **Configuración**: Lee de `.env` (GITHUB_TOKEN).
- **Funcionalidades**:
  - Listar repositorios.
  - Crear/Cerrar PRs e Issues.
  - Sincronizar ramas.
  - **Auto-Fix**: Script para actualizar el JSON de configuración de Claude con un nuevo token.

## Hitos
- [X] Diagnosticar error 401 en MCP actual.
- [ ] Crear script `scripts/github_connector.py`.
- [ ] Crear nueva Skill `github-manager` siguiendo estándar Antigravity v4.x.
- [ ] Documentar proceso de "Recuperación de Conexión GitHub" en la Skill.
- [ ] Solicitar nuevo token al usuario y actualizar sistema.

## Casos Borde / Restricciones
- Si el usuario no tiene internet, el script debe fallar elegantemente.
- No exponer tokens en logs de consola.
- El servidor MCP oficial usa `npx`, lo cual puede ser lento. Nuestra Skill usará Python para mayor velocidad y control.
