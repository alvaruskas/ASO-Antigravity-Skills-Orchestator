# Directiva: Actualización Global y Despliegue GitHub

## Objetivo
Sincronizar la versión más reciente de la aplicación ASO y el repositorio de skills desde el entorno global del sistema hacia este proyecto, mejorar la documentación (README) y asegurar que los cambios se reflejen en GitHub.

## Contexto
- **ASO Global**: `/Users/uskas/.gemini/antigravity/aso-app`
- **Skills Vault Global**: `/Users/uskas/.gemini/antigravity/skills_vault`
- **Proyecto Local**: `/Users/uskas/Desktop/MisSueños25/ANTIGRAVITY/ASO Antigravity`

## Hitos
- [X] **Sincronización de App**: Copiar contenido de `aso-app` global a `aso-app-codigo-fuente` local.
- [X] **Sincronización de Skills**: Actualizar `skills-library/vault` con el contenido de `skills_vault` global.
- [X] **Documentación Premium**: Crear un `README.md` que refleje la potencia del Antigravity Skill Orchestrator.
- [X] **Limpieza**: Asegurar que no se suban archivos temporales o innecesarios.
- [ ] **Despliegue GitHub**: Commit y Push de los cambios.

## Instrucciones Técnicas
1. Usar `rsync` o comandos `cp` recursivos para asegurar la integridad.
2. El README debe seguir los estándares de diseño premium (Estructura clara, badges, secciones de arquitectura).
3. Verificar `.gitignore` antes del push.

## Casos Borde
- Conflictos en archivos de configuración locales (`.env`, `.aso_profile.json`). Se deben respetar los locales si contienen credenciales específicas.
- Rutas absolutas en el README (evitarlas).

## Siguientes Pasos
- Notificar al usuario tras el despliegue.
- Actualizar `memoria_sesion.md`.
