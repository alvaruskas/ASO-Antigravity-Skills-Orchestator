---
name: pdf-manager
description: Administra, manipula y genera documentos PDF. Utiliza esta habilidad cuando el usuario desee crear, unir (concatenar), dividir, comprimir, extraer texto o analizar archivos PDF.
category: "📦 Utilidades"
---

# Skill PDF Manager

Esta skill proporciona capacidades avanzadas de manipulación de PDF utilizando un script de Python optimizado (`scripts/pdf_manager.py`).

## Propósito
Permitir al usuario realizar operaciones complejas con archivos PDF de manera sencilla y robusta, siguiendo las mejores prácticas de 2025.

## Capacidades
El agente puede realizar las siguientes acciones:
1.  **Crear**: Generar PDFs simples desde texto.
2.  **Unir (Merge)**: Combinar múltiples PDFs en uno solo.
3.  **Dividir (Split)**: Extraer rangos de páginas específicos.
4.  **Comprimir**: Reducir el tamaño del archivo optimizando imágenes y streams (garbage collection).
5.  **Exportar/Extraer**: Extraer texto e información de metadatos.

## Instrucciones
1.  **Analizar la Solicitud**: Determina qué operación desea realizar el usuario (crear, merge, split, compress, info).
2.  **Consultar Directiva**: Lee `directivas/pdf_manager.md` para entender los argumentos exactos requeridos por el script.
3.  **Ejecutar Script**: Usa la herramienta de ejecución de terminal para correr el script de Python.
    *   Sintaxis base: `python scripts/pdf_manager.py [accion] [argumentos]`
4.  **Validar**: Si la operación genera un archivo, verifica su existencia antes de confirmar al usuario.

## Restricciones
*   Nunca sobrescribas el archivo de entrada a menos que el usuario lo pida explícitamente (usa prefijos como `_compressed` o `_merged`).
*   Para la compresión, asume un nivel de optimización balanceado a menos que se especifique "máxima compresión".
