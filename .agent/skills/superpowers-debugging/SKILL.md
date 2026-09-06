---
name: superpowers-debugging
description: Metodología de depuración sistemática para diagnosticar y aislar la causa raíz antes de proponer cambios en el código.
metadata:
  author: superpowers
  version: "1.0"
---

# Superpowers: Depuración Sistemática (Systematic Debugging)

Esta habilidad rige el proceso de resolución de errores, bugs y comportamientos anómalos en GeoServ.

## Principio Fundamental

> **Regla de Oro:** Queda estrictamente prohibido parchar a ciegas o probar soluciones al azar. Primero se demuestra y comprueba la causa raíz (Root Cause Analysis), luego se diseña la solución mínima.

---

## Proceso de 4 Fases

### Fase 1: Reproducir y Aislar
1. **Identificar los síntomas exactos:**
   - Stack trace, código de estado HTTP, excepciones .NET, errores en consola del navegador Angular.
2. **Crear un caso de reproducción mínimo:**
   - Si es un error de backend: crear una prueba unitaria o de integración que reproduzca el fallo exactamente con los mismos parámetros.
   - Si es un error de frontend: aislar la función, componente o servicio involucrado.

### Fase 2: Formular Hipótesis Basadas en Evidencia
1. Rastrear el flujo de datos desde la entrada hasta el punto de falla.
2. Formular hipótesis claras: *"El error ocurre porque la entidad X llega con estado nulo cuando la transacción Y no se ha confirmado"*.
3. Verificar la hipótesis inspeccionando código, logs o agregando assertions temporales.
4. Descartar hipótesis con evidencia antes de cambiar código de producción.

### Fase 3: Diseñar e Implementar el Fix Mínimo
1. La prueba que reproduce el fallo debe fallar con el error identificado.
2. Aplicar la corrección precisa en la capa adecuada (Domain, Infrastructure o Endpoint en .NET; Componente o Servicio en Angular).
3. Nunca añadir parches defensivos que solo oculten el síntoma (ej. silenciar excepciones o usar `any` sin control).

### Fase 4: Verificación y Prevención de Regresiones
1. Ejecutar la prueba de reproducción $\rightarrow$ Debe pasar en verde.
2. Ejecutar toda la suite de pruebas del módulo para garantizar que no hay efectos secundarios.
3. Documentar brevemente la causa raíz y la solución adoptada.
