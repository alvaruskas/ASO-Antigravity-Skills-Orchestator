---
name: systematic-debugging
description: Implementa un proceso de análisis de causa raíz en 4 fases. Úsalo ante cualquier bug, fallo de test o comportamiento inesperado.
category: "🛠️ Metodología"
---

# Systematic Debugging Skill

## Propósito
Depurar errores como un ingeniero senior mediante un proceso metódico de análisis de causa raíz, desaconsejando la realización de arreglos impulsivos basados en "prueba y error".

## Instrucciones
Ante cualquier comportamiento inesperado o fallo, sigue exactamente estas 4 fases:
1. **Reproducción y Contexto:** Analiza el mensaje de error o logs para entender exactamente en qué punto falla. 
2. **Análisis de Causa Raíz (Root Cause):** Rastrea el origen del problema leyendo los archivos correspondientes. Considera el estado de la aplicación, el flujo de datos y dependencias.
3. **Plan de Solución:** Define una corrección lógica y estructurada que elimine la causa raíz del error, no solo el síntoma visible.
4. **Verificación:** Propón o implementa el cambio y asegúrate de verificar que el error haya desaparecido (ej. ejecutando los tests correspondientes).

## Mejores Prácticas y Restricciones
- **No adivines:** Evita iteraciones en las que intentes arreglar el error modificando líneas aleatorias.
- Exige evidencia: Si el contexto proporcionado por el usuario no es suficiente, pide ver los logs de error o ejecutar un test de diagnóstico antes de modificar archivos.
