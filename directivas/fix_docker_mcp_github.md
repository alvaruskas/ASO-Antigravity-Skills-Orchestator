# Directiva: Corrección de Error Docker en MCP GitHub

## Problema
El usuario reporta el error `exec: "docker": executable file not found in $PATH` al intentar usar el MCP de GitHub.
El diagnóstico revela que `/Users/uskas/.gemini/antigravity/mcp_config.json` tiene una entrada para `github-mcp-server` configurada para ejecutarse vía Docker, pero el sistema no tiene Docker instalado o accesible.

## Objetivo
Cambiar la configuración del MCP de GitHub para que utilice `npx` en lugar de `docker`, alineándose con la configuración que funciona en Claude Desktop y evitando la dependencia de un contenedor.

## Acciones
1. Modificar `/Users/uskas/.gemini/antigravity/mcp_config.json`.
2. Reemplazar la sección `github-mcp-server` que usa `docker` por una que use `npx` con el paquete `@modelcontextprotocol/server-github`.
3. Asegurar que el token `GITHUB_PERSONAL_ACCESS_TOKEN` se mantenga.

## Configuración Objetivo (JSON)
```json
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "VALOR_ACTUAL",
        "PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
      }
    }
```

## Verificación
- Tras el cambio, el agente debería ser capaz de cargar el servidor sin buscar el binario de `docker`.
- (Opcional) El usuario puede reiniciar su sesión o herramienta para aplicar los cambios.

## Casos Borde
- Si `npx` falla por red, el error será distinto (EAI_AGAIN), pero ya no será de Docker.
- Se debe mantener la estructura `$typeName` si es requerida por el cliente Cascade, pero normalmente `command` y `args` son suficientes para la mayoría de los clientes MCP. Sin embargo, para mayor seguridad, mantendremos un formato estándar compatible.
