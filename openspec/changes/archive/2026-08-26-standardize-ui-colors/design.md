## Context

La aplicación Angular requiere una unificación de estilos. Actualmente, los colores están definidos (y en muchos casos hardcodeados o repetidos) en múltiples archivos de estilos de componentes y estilos globales. Esta propuesta busca centralizar toda la definición de la paleta a través de CSS Custom Properties (`:root`) y aplicarlas mediante el sistema de theming de Angular Material y estilos globales SCSS. Ver `proposal.md` para más motivación sobre el problema.

## Goals / Non-Goals

**Goals:**
- Centralizar la definición de colores usando variables CSS en un archivo base (ej. `styles.scss` o `variables.scss`).
- Integrar la nueva paleta de colores nativamente en Angular Material para que componentes como mat-button y mat-badge consuman estos colores.
- Proveer clases utilitarias o directivas para aplicar fácilmente estados semánticos y estados de error en componentes personalizados (como acordeones).

**Non-Goals:**
- Refactorización lógica del estado de la aplicación o flujos de Angular (solo abordaremos estilos).
- Cambios drásticos en el layout general de la plataforma, nos limitaremos a los colores, fondos y bordes de los elementos descritos.

## Decisions

### 1. Uso de CSS Custom Properties vs SCSS Variables
- **Decisión:** Definir los colores primarios utilizando CSS Custom Properties (`--color-primary`, `--color-error`, etc.) en la pseudo-clase `:root`, y mapearlos a la configuración del tema de Angular Material si es posible.
- **Alternativa Considerada:** Usar exclusivamente variables `$scss`.
- **Razón:** Las CSS Custom Properties permiten cambiar temas en tiempo de ejecución (si fuese necesario a futuro) y son accesibles tanto desde archivos de estilo de componentes encapsulados (Emulated View Encapsulation) como desde el DOM global sin requerir importación del archivo de variables SCSS en cada componente.

### 2. Integración con Angular Material
- **Decisión:** Mantener el uso de prebuilt themes de Angular Material y aplicar overrides utilizando MDC variables y clases globales (ej. `--mdc-theme-primary`, `.mat-mdc-raised-button`, etc.) inyectando los valores de nuestras custom properties (Amber 600 y Slate 800).
- **Razón:** La versión actual del proyecto (`@angular/material@22.1.2`) ha modificado su API de theming en SASS (eliminando o cambiando `mat.define-palette`). Utilizar CSS Custom Properties de forma nativa mantiene la compatibilidad, resulta menos propenso a romperse con futuras actualizaciones de Material y ya se encuentra parcialmente estructurado en el código actual.

### 3. Indicadores de Estado en Acordeones
- **Decisión:** Implementar clases CSS específicas (ej. `.accordion-error`, `.accordion-success`) y combinarlas con bindings dinámicos (`[ngClass]`) en las plantillas de los componentes. Se apoyará con íconos o texto para cumplir el requerimiento de accesibilidad de no depender exclusivamente del color.
- **Razón:** Es la forma más declarativa e idiomática en Angular para aplicar estilos basados en el estado (como la validación de un `FormGroup`).

## Risks / Trade-offs

- **[Riesgo de Regresión Visual]** → Al eliminar colores hardcodeados de componentes individuales e implementar los globales, podrían romperse componentes que dependían de la especificidad del estilo local.
  - **Mitigación:** Hacer un barrido general del proyecto para remover `color: #HEX` o `background-color: #HEX` mediante búsqueda global (ej. grep) y verificar las pantallas principales.
- **[Riesgo de Accesibilidad por Contraste]** → Cambiar los fondos a Slate 800 puede ocultar texto que estaba por defecto en negro.
  - **Mitigación:** Asegurar que los selectores que apliquen el color Slate 800 (Navbar, Sidebar) definan explícitamente `color: white;` y `--text-primary` apropiadamente.
