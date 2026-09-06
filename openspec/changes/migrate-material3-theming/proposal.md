## Why

El proyecto utiliza Angular Material 22 pero sin aprovechar el sistema oficial de theming M3 (Material 3). El archivo `styles.scss` actual define la paleta con variables CSS custom (`--color-primary`, `--color-accent`, etc.) y fuerza los colores de los componentes pisando clases internas de MDC (`.mat-mdc-raised-button`, `.mdc-notched-outline__leading`, etc.) con reglas que contienen `!important`.

Esta situación genera:
- Alto riesgo de breaking changes en cada actualización de Angular Material, debido a la dependencia de nombres de clases internas no públicas de MDC.
- Especificidad CSS descontrolada por el uso extendido de `!important`.
- Mezcla de variables MDC intermedias semiobsoletas (`--mdc-theme-primary`) con variables custom del proyecto sin integración nativa con el motor de estilos.
- Imposibilidad de aprovechar las capacidades nativas de M3 (roles de color, contraste automático, tokens de superficie y color-scheme dinámico).
- Falta de soporte estructurado para Dark Mode, requiriendo definirlo ahora desde los cimientos de M3 para evitar una costosa segunda migración a futuro.

## What Changes

- Reemplazo del esquema de overrides manuales por un sistema oficial de theming M3 configurado mediante `@use '@angular/material' as mat;` y la API `mat.theme()`.
- Soporte nativo para esquemas de color duales (**Light** y **Dark**) generados a partir de la misma paleta de marca base:
  - Color primario / acento: `#D97706` (copper / amber)
  - Color base / superficie oscura: `#1E293B` (slate)
  - Uso de la capacidad nativa de `mat.theme()` para generar tokens específicos de `theme-type: light` y `theme-type: dark` automáticamente.
- Preservación y unificación de los colores de estado semánticos (`success`, `warning`, `error`, `info`), incluyendo variantes calibradas para contraste óptimo tanto en modo claro como en modo oscuro, manteniendo intactas las clases utilitarias existentes (`.text-*`, `.bg-*`, `.border-*`).
- Incorporación de un mecanismo técnico de conmutación de esquemas (vía clase/atributo en el elemento raíz `html.dark-theme` / `[data-theme="dark"]` y compatibilidad con `prefers-color-scheme`). La implementación del toggle visual de UI para el usuario final queda desacoplada para una iteración posterior, dejando la infraestructura de estilos 100% lista y funcional.
- **BREAKING**: Eliminación de todas las reglas CSS de override que fuerzan colores con `!important` sobre selectores internos `.mat-mdc-*` y `.mdc-*` (botones, campos de texto, tabs, checkboxes, radios, spinners y snackbars) una vez cubiertos de forma nativa por M3.
- Mantenimiento de estilos custom no cubiertos por theming nativo (posicionamiento centrado y badges de snackbars, estilo personalizado de `.custom-help-tooltip`).

## Capabilities

### New Capabilities
- `theming`: Definición y configuración del theme nativo Material 3 con `mat.theme()` (esquemas light y dark), mapeo de roles de color, mecanismo técnico de conmutación de tema, preservación y adaptación de tokens semánticos, y eliminación de overrides de clases internas.

### Modified Capabilities
<!-- No se modifican requerimientos existentes de comportamiento de negocio. -->

## Impact

- **Código afectado**: Archivo global `frontend/src/styles.scss` y cualquier estilo de componente que dependa de variables `--color-*` o variables intermedias `--mdc-theme-*`.
- **Mecanismo de selección de esquema**: Se establece la base técnica para alternar entre claro y oscuro (mediante clase `.dark-theme` o selector de atributo en el elemento raíz). El control visual interactivo (toggle/botón en la interfaz de usuario) queda expresamente fuera del alcance de esta propuesta y se implementará en una fase posterior.
- **Tokens de estado en Dark Mode**: Los tokens de estado semántico contarán con definición adaptada para garantizar ratio de contraste accesible sobre fondos oscuros sin perder su significado de negocio (verde, ámbar, rojo, azul).
- **Breaking changes**: Los selectores CSS que actualmente sobreescriben clases internas `.mat-mdc-*` dejan de ser necesarios y se eliminarán para evitar reglas muertas o colisiones de especificidad.
- **Sistemas y dependencias**: No altera la lógica de negocio, servicios ni componentes funcionales de Angular ni el backend de .NET; el impacto está estrictamente acotado a la capa visual y de theming.
