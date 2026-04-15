---
description: "Automatización integral del flujo de trabajo en GitHub. Genera automáticamente PRs, gestiona ramas y mantiene el historial limpio."
category: "🛠️ Metodología"
---

# GitHub Pro - Automatización Completa de GitHub

## Purpose
Orquestar todo el flujo de trabajo de desarrollo en GitHub: desde la creación de commits con mensajes en español y versionado semántico automático, hasta la generación de READMEs, gestión de Pull Requests, Issues y GitHub Actions.

## Instructions

### 1. Commits en Español con Versionado Automático

#### Formato de Commits (Conventional Commits en Español)
Todos los commits deben seguir este formato:
```
<tipo>(<ámbito>): <descripción corta>

[Cuerpo opcional]

[Pie opcional con versión]
```

**Tipos válidos** (siempre en español):
- **feat**: Nueva funcionalidad → Incrementa versión MINOR (0.X.0)
- **fix**: Corrección de bug → Incrementa versión PATCH (0.0.X)
- **docs**: Solo documentación
- **refactor**: Refactorización de código
- **test**: Añadir o corregir tests
- **chore**: Mantenimiento (deps, build)
- **BREAKING CHANGE**: Cambio incompatible → Incrementa versión MAJOR (X.0.0)

#### Proceso de Commit
1. **Analizar cambios**: Ejecutar `git diff --staged` para entender qué cambió
2. **Determinar tipo**: Clasificar el cambio según la lista anterior
3. **Calcular nueva versión**: 
   - Leer versión actual de `package.json`, `pyproject.toml` o archivo de versión
   - Incrementar según el tipo de commit
4. **Generar mensaje**: Formato imperativo en español (ej. "añade login con Google")
5. **Ejecutar commit**: `git commit -m "<mensaje>"`
6. **Actualizar versión**: Modificar archivo de versión con el nuevo número

**Ejemplo de flujo completo**:
```bash
# Versión actual: 1.2.3
# Cambios: Se añadió nueva funcionalidad de autenticación

# Mensaje generado:
feat(auth): añade autenticación con Google OAuth

# Nueva versión: 1.3.0 (MINOR incrementado)
```

### 2. Generación de README
Cuando el usuario pida "crear README" o "documentar proyecto":
1. **Delegar a `github-readme-expert`**: Invocar la skill especializada
2. **Personalizar secciones**: Añadir badge de versión usando el número calculado
3. **Incluir changelog**: Opcionalmente generar sección de cambios recientes

### 3. Gestión de Pull Requests

#### Crear PR
Comando: "crear PR", "create pull request"
1. **Crear rama**: Si no existe, crear rama siguiendo patrón `feature/<nombre>` o `fix/<nombre>`
2. **Push cambios**: `git push -u origin <rama>`
3. **Usar GitHub CLI**: `gh pr create --title "<título>" --body "<descripción>"`
4. **Título en español**: Usar el formato de commit (ej. "feat(auth): añade OAuth")

#### Iterar sobre PR
Cuando CI falla o hay comentarios de revisión:
1. **Leer feedback**: `gh pr view --comments`
2. **Aplicar correcciones**: Hacer cambios en código
3. **Commit y push**: Seguir proceso de commit estándar
4. **Esperar CI**: Verificar estado con `gh pr checks`

#### Comandos útiles
- `gh pr list`: Listar PRs abiertas
- `gh pr merge`: Fusionar PR (requiere aprobación)
- `gh pr close`: Cerrar PR sin fusionar

### 4. Gestión de Issues

#### Crear Issue
Comando: "crear issue", "reportar bug"
```bash
gh issue create --title "fix: error en login" --body "Descripción detallada"
```

#### Triaje y asignación
- `gh issue list --label "bug"`: Filtrar por etiqueta
- `gh issue edit <número> --add-assignee @me`: Asignar a ti mismo

### 5. GitHub Actions y Workflows

#### Generar workflow básico
Cuando se pida "crear workflow" o "configurar CI":
1. Crear `.github/workflows/<nombre>.yml`
2. Plantilla estándar:
```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup
        run: <comando de setup>
      - name: Test
        run: <comando de test>
```

#### Automatización de versiones
Integrar **semantic-release** o similar para publicar versiones automáticamente basadas en commits.

## Constraints
- **Commits siempre en español**: No usar inglés en mensajes de commit
- **Versionado estricto**: Siempre actualizar número de versión en el archivo correspondiente
- **No hacer push sin tests**: Verificar que `npm test` o equivalente pase antes de push
- **README obligatorio**: Todo proyecto debe tener README.md actualizado

## Resources
- GitHub CLI: `gh` debe estar instalado y autenticado
- Archivos de versión soportados: `package.json`, `pyproject.toml`, `version.txt`, `VERSION`
