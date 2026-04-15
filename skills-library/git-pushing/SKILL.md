---
name: git-pushing
description: Usa las etapas, los commit y las empujes de cambios Git utilizando mensajes de commite convencionales. Utiliza esto cuando el usuario desea hacer un commit y empujar los cambios o guardar su trabajo en un repositorio remoto.
category: "🛠️ Metodología"
---

# Git Pushing Skill

## Propósito
Gestionar las operaciones de control de versiones de manera segura y estructurada, garantizando historiales limpios con mensajes de commit profesionales.

## Instrucciones
1. **Evaluar estado:** Ejecuta los comandos pertinentes (ej. `git status`, `git diff`) para visualizar los archivos modificados y asegurarte de qué código se enviará.
2. **Staging (Preparación):** Agrega los archivos lógicamente relacionados con los últimos cambios usando `git add`.
3. **Redacción del Commit:** Escribe un mensaje siguiendo la convención de *Conventional Commits* (usa prefijos como `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
4. **Push (Sincronización):** Ejecuta `git push` para mandar la rama al repositorio remoto actual.

## Mejores Prácticas y Restricciones
- **Precaución:** Nunca hagas `git add .` a ciegas. Evita añadir archivos basura, carpetas locales como `node_modules` o archivos de secretos.
- Usa el modo imperativo en las descripciones de los commits (ej. `feat: add user authentication` en lugar de `added`).
- Si encuentras un conflicto con la rama remota, detente e informa inmediatamente al usuario para su resolución manual antes de forzar una subida.
