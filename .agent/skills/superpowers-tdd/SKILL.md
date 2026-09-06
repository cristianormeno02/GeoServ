---
name: superpowers-tdd
description: Ejecución estricta de Test-Driven Development (TDD) siguiendo el ciclo Red-Green-Refactor para backend .NET y frontend Angular.
metadata:
  author: superpowers
  version: "1.0"
---

# Superpowers: Test-Driven Development (TDD)

Esta habilidad rige la disciplina de desarrollo guiado por pruebas para el proyecto GeoServ (.NET + Angular).

## Principio Fundamental

> **Regla de Oro:** Ninguna línea de código de producción debe escribirse o modificarse sin una prueba automatizada previa que falle y demuestre la necesidad del cambio.

---

## Ciclo Red - Green - Refactor

### 1. FASE ROJA (Red) - Escribir la prueba que falla
1. Identifica el requisito exacto o criterio de aceptación de la tarea (proveniente de `tasks.md` y `spec.md`).
2. Escribe una prueba unitaria o de integración que describa con precisión el comportamiento esperado.
   - **Backend (.NET / C#):**
     - Proyecto de pruebas xUnit / NUnit.
     - Nomenclatura clara: `Unidad_Condicion_ResultadoEsperado` (ej. `CrearOrdenServicio_ConDatosValidos_RetornaIdExitoso`).
     - Estructura Arrange-Act-Assert (AAA).
   - **Frontend (Angular / TypeScript):**
     - Archivos `*.spec.ts` para componentes y servicios.
     - Usar Jasmine / Karma o Jest según la configuración del proyecto.
     - Probar comportamiento observable, llamadas a servicios y manejo de estados.
3. **Ejecutar la prueba y verificar que falle:**
   - Backend: `dotnet test`
   - Frontend: `npm test -- --watch=false` (o comando de test configurado)
   - *Verificar que la falla sea exactamente por la funcionalidad que aún no existe, no por un error de sintaxis no relacionado.*

### 2. FASE VERDE (Green) - Implementación mínima
1. Escribe **únicamente el código mínimo necesario** para que la prueba pase.
2. Evita sobreingeniería, optimizaciones prematuras o agregar funcionalidades no cubiertas por la prueba.
3. Vuelve a ejecutar la prueba y confirma que pase en verde.

### 3. FASE REFACTORIZACIÓN (Refactor) - Limpieza y diseño
1. Con la red de seguridad de la prueba en verde, limpia el código:
   - Eliminar duplicación de código.
   - Mejorar nombres de variables y métodos.
   - Garantizar el cumplimiento de estándares arquitectónicos (Domain, Infrastructure, Endpoints en .NET; buenas prácticas en Angular).
2. Ejecuta **toda la suite de pruebas** para asegurar que no se hayan introducido regresiones.

---

## Checklist antes de completar una tarea
- [ ] ¿Existe una prueba que cubra este cambio?
- [ ] ¿Se verificó que la prueba fallaba antes de la implementación?
- [ ] ¿Pasan todas las pruebas del módulo?
- [ ] ¿Se preservaron los tipos estrictos y el manejo de errores?
