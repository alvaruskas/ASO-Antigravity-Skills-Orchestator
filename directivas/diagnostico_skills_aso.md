# Directiva: Diagnóstico y Reparación de Carga de Skills en ASO

El usuario reporta que las skills no aparecen en la interfaz de ASO cuando se ejecuta desde el proyecto BIOCON.

## Estado Actual
- ASO usa un sistema de perfiles por proyecto (`.aso_profile.json`).
- Al iniciar en un proyecto, mueve skills globales al "baúl" (`vault`) y activa solo las del perfil.
- Se han detectado archivos en lugar de directorios en las carpetas de skills, lo que podría confundir al servidor.

## Pasos de Diagnóstico
1. **Verificar Estado Físico:** Comprobar si las skills listadas en el perfil de BIOCON existen en `skills_vault` o en `skills`.
2. **Revisar Logs de Error:** Intentar capturar errores del backend (si es posible) o simular la carga en un script de prueba.
3. **Validar Estructura:** Asegurar que todas las skills sean directorios con un `SKILL.md` válido.
4. **Corregir Lógica de Inicialización:** Robustecer el proceso de `initProfile` para manejar casos borde (archivos inesperados, errores de permisos).

## Propuesta de Solución
- Crear un script de reparación que:
    - Convierta skills "archivo" en directorios (si contienen la lógica) o las elimine si son basura.
    - Asegure que el perfil del proyecto esté sincronizado con la realidad del disco.
- Modificar `server.js` para:
    - Ser más tolerante a errores durante el movimiento de carpetas.
    - No fallar completamente si una skill tiene metadatos corruptos.

## Verificación
- Ejecutar el servidor con `ASO_PROJECT_PATH` apuntando a BIOCON y comprobar la respuesta del API `/api/skills`.
