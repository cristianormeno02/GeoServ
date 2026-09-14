## Purpose

Establece los estándares de rendimiento reactivo para la carga concurrente de catálogos HTTP y la gestión determinística del ciclo de vida de suscripciones para evitar fugas de memoria en el frontend.

## Requirements

### Requirement: Carga Paralela de Catálogos y Dependencias HTTP
Los formularios y vistas que requieran consultar múltiples catálogos independientes DEBEN ejecutar dichas peticiones en paralelo mediante operadores reactivos combinados (`forkJoin`), evitando descargas secuenciales o múltiples `.subscribe()` no coordinados.

#### Scenario: Carga inicial de formulario de órdenes de servicio
- **WHEN** el usuario ingresa al formulario de creación o edición de una orden de servicio (`service-order-form`)
- **THEN** el sistema DEBE disparar las peticiones de catálogos (clientes, tipos de servicio, usuarios responsables, proyectos, etc.) concurrentemente con `forkJoin`, procesar las respuestas en un único bloque de asignación y desactivar el estado de carga global del formulario al completar todas las peticiones.

#### Scenario: Manejo de fallos en catálogos individuales
- **WHEN** una de las peticiones concurrentes de catálogos falla
- **THEN** el sistema DEBE capturar el error con `catchError`, notificar al usuario con un mensaje comprensible y evitar que la vista quede bloqueada indefinidamente en estado de carga.

### Requirement: Prevención de Memory Leaks y Gestión de Ciclo de Vida
Todas las suscripciones manuales a observables de larga vida (tales como `valueChanges` de formularios reactivos o eventos de enrutamiento) DEBEN gestionar explícitamente su destrucción vinculándose al ciclo de vida del componente mediante `takeUntilDestroyed` o `DestroyRef`.

#### Scenario: Navegación y destrucción de componentes con formularios
- **WHEN** el usuario navega fuera de un formulario complejo tras interactuar con campos que emiten `valueChanges`
- **THEN** todas las suscripciones activas asociadas a dicho componente DEBEN cancelarse de forma automática e inmediata liberando memoria y evitando ejecuciones en segundo plano.

#### Scenario: Ausencia de logs de depuración en consola
- **WHEN** un usuario interactúa con la aplicación en modo desarrollo o producción
- **THEN** la consola del navegador NO DEBE registrar mensajes o trazas de depuración informales (`console.log`) residuales de desarrollos previos.
