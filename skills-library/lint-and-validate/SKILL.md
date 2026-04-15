---
name: lint-and-validate
description: Ejecuta procedimientos de control de calidad, linting y análisis estático. Úsala para asegurar que el código cumple los estándares.
category: "🛠️ Metodología"
---

# Lint and Validate Skill

## Propósito
Mantener el código limpio de forma automática ejecutando controles de calidad, comprobaciones de linting y validación de dependencias tras cada modificación, para garantizar que la compilación se mantenga estable.

## Instrucciones
1. **Identificar cambios:** Revisa qué archivos acaban de ser editados o creados.
2. **Ejecutar herramientas:** Utiliza los comandos apropiados del proyecto (ej. `npm run lint`, `ruff check`, `cargo clippy`, etc.) en los archivos modificados.
3. **Validar:** Comprueba que no haya errores de sintaxis, problemas de tipos o advertencias críticas.
4. **Corregir o reportar:** Si las herramientas arrojan errores, corrígelos automáticamente si es posible. Si requiere intervención humana, infórmalo al usuario.

## Mejores Prácticas y Restricciones
- Nunca asumas que el código generado funciona solo porque se ve correcto; siempre valida utilizando las herramientas configuradas en el entorno.
- Respeta las reglas de estilo (ESLint, Prettier, PEP8, etc.) ya definidas en el proyecto.
- No ejecutes validaciones destructivas sin consentimiento.
