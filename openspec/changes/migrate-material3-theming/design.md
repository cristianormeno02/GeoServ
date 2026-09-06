## Context

El proyecto `geoserv-web` se basa en Angular 22 (`@angular/material: ^22.1.2`, `sass: ^1.102.0`). Actualmente, el archivo `frontend/src/styles.scss` define variables CSS custom en `:root` e intenta adaptar Angular Material mediante overrides manuales con `!important` sobre clases internas de MDC (`.mat-mdc-raised-button`, `.mdc-notched-outline__leading`, etc.).

La migración a Angular Material 3 brinda la oportunidad óptima de definir de raíz la arquitectura de soporte dual (**Light** y **Dark Mode**) a partir de una única paleta de marca, evitando una reestructuración futura de las hojas de estilo globales.

Para la motivación completa y justificación de negocio, ver `proposal.md`. Para los requerimientos normativos del sistema de theming, ver `specs/theming/spec.md`.

## Goals / Non-Goals

**Goals:**
- Configurar el sistema oficial de theming Material 3 (M3) en `styles.scss` utilizando `@use '@angular/material' as mat;` y la API `mat.theme()`.
- Generar esquemas de color duales (**Light** y **Dark**) a partir de la identidad de marca (color primario `#D97706` y superficie/slate `#1E293B`).
- Implementar la infraestructura técnica de conmutación de esquemas basada en selectores raíz (`html.dark-theme` / `[data-theme="dark"]`) y soporte de preferencia del sistema.
- Mantener y calibrar los tokens semánticos de estado (`success`, `warning`, `error`, `info`) con variantes legibles y de alto contraste en fondos oscuros.
- Eliminar de manera progresiva y segura los selectores de clase interna `.mat-mdc-*` y `.mdc-*` con `!important`.
- Preservar las personalizaciones funcionales y de posicionamiento que caen fuera del theming estándar (centrado de snackbars, estilo contextual de `.custom-help-tooltip`).

**Non-Goals:**
- Desarrollar el componente interactivo de UI (botón/switch en la barra de navegación) para el usuario final en esta fase; el alcance cubre la infraestructura de estilos, tokens y preparación técnica completa.
- Actualizar dependencias o modificar versiones de Angular o librerías externas.
- Alterar la lógica funcional o componentes de TypeScript.

## Decisions

### 1. Definición dual de temas con `mat.theme()` en Angular Material 22
- **Decisión**: Declarar dos temas independientes (claro y oscuro) a partir de los mismos mapas de paleta base:
  ```scss
  @use '@angular/material' as mat;

  $theme-light: mat.theme((
    color: (
      theme-type: light,
      primary: mat.$amber-palette, // Paleta de marca base #D97706
      tertiary: mat.$slate-palette,
    ),
    typography: (
      plain-family: Roboto,
      brand-family: Roboto,
    ),
    density: 0,
  ));

  $theme-dark: mat.theme((
    color: (
      theme-type: dark,
      primary: mat.$amber-palette,
      tertiary: mat.$slate-palette,
    ),
    typography: (
      plain-family: Roboto,
      brand-family: Roboto,
    ),
    density: 0,
  ));

  // Aplicación del tema claro por defecto en :root
  :root {
    @include mat.all-component-themes($theme-light);
    @include mat.system-level-colors($theme-light);
    @include mat.system-level-typography($theme-light);
  }

  // Aplicación del tema oscuro mediante selector
  html.dark-theme,
  [data-theme="dark"] {
    @include mat.all-component-colors($theme-dark);
    @include mat.system-level-colors($theme-dark);
  }
  ```
- **Rationale**: `mat.theme()` calcula automáticamente las tonalidades oscuras, elevaciones de superficie y contrastes adecuados según la especificación de Material 3, garantizando coherencia sin tener que diseñar manualmente cada componente para modo oscuro.

### 2. Mecanismo de conmutación de esquema
- **Decisión**: Implementar la conmutación basada en la clase `html.dark-theme` (y el atributo `[data-theme="dark"]`), complementada opcionalmente con `@media (prefers-color-scheme: dark)`.
- **Rationale**:
  - En una plataforma empresarial con autenticación de usuarios y perfiles, el modo oscuro habitualmente se almacena como preferencia del usuario (`localStorage` o base de datos) o se conmuta con un toggle.
  - La activación vía clase en la raíz del documento permite alternar dinámicamente el tema sin recargar la página y facilita enormemente las pruebas automáticas y visuales en desarrollo.
  - Cuando se implemente el control visual en una iteración posterior, solo requerirá añadir o quitar la clase `dark-theme` en el elemento raíz.

### 3. Calibración de tokens de estado semánticos para Light y Dark Mode
- **Decisión**: Definir variables CSS específicas por esquema para los estados de negocio:
  - **Light Mode (`:root`)**:
    - `--color-success`: `#059669`
    - `--color-warning`: `#F59E0B`
    - `--color-error`: `#DC2626`
    - `--color-info`: `#2563EB`
  - **Dark Mode (`html.dark-theme`, `[data-theme="dark"]`)**:
    - `--color-success`: `#10B981` (esmeralda más luminoso para legibilidad sobre slate oscuro)
    - `--color-warning`: `#FBBF24` (ámbar ajustado para fondo oscuro)
    - `--color-error`: `#F87171` (rojo claro con contraste accesible)
    - `--color-info`: `#60A5FA` (azul celeste accesible)
  - Las clases utilitarias (`.text-success`, `.bg-error`, etc.) seguirán apuntando a `var(--color-*)`, conmutando su valor de manera transparente.
- **Rationale**: Los colores con luminosidad óptima para fondo blanco (como `#059669` o `#DC2626`) suelen perder contraste y legibilidad sobre superficies oscuras (#1E293B o #0F172A). Ajustar la luminosidad preservando la familia cromática asegura el cumplimiento de WCAG AA.

### 4. Depuración quirúrgica de overrides con `!important`
- **Decisión**: Organizar la remoción de overrides por componentes específicos (botones, form fields, tabs, checkboxes/radios, spinner) comprobando que cada uno herede adecuadamente el color primario y estados nativos en **ambos** esquemas antes de borrar sus reglas correspondientes.
- **Rationale**: Evita regresiones visuales masivas simultáneas y permite aislar cualquier comportamiento de estilo anómalo en uno u otro modo.

### 5. Aislamiento de estilos custom fuera del theming
- **Decisión**: Mantener intactas las reglas de layout y estructura de snackbars (posicionamiento centrado `fixed`, `transform: translate(-50%, -50%)`, iconos pseudo-elemento `::before`) y el tooltip `.custom-help-tooltip`. En modo oscuro, asegurar que los fondos de snackbar y tooltip armonicen con las superficies del tema.
- **Rationale**: El motor de theming de Angular Material gestiona colores y densidades, pero no comportamientos geométricos particulares solicitados por el diseño de la plataforma.

## Risks / Trade-offs

- **[Riesgo] Leves diferencias en el tono exacto derivado por la paleta tonal de M3** → *Mitigación*: Probar y ajustar las opciones de paleta (`mat.$amber-palette` o paleta generada con color semilla exacto `#D97706`) evaluando los tokens generados para `--mat-sys-primary` contra capturas de la UI actual.
- **[Riesgo] Contraste deficiente de iconos o bordes en Dark Mode** → *Mitigación*: Inspeccionar selectores de form fields y tabs en modo oscuro para verificar que los bordes inactivos y textos secundarios mantengan ratio accesible.
- **[Riesgo] Estilos de componentes que asuman variables intermedias `--mdc-theme-*`** → *Mitigación*: Auditar el codebase para asegurar que ningún componente hijo consuma `--mdc-theme-primary` directamente; si existen, reemplazar por `var(--color-accent)` o tokens del theme.

## Migration Plan

1. **Respaldar el archivo original** `frontend/src/styles.scss` y registrar capturas base.
2. **Implementar `@use '@angular/material' as mat;`** y configurar `$theme-light` y `$theme-dark`.
3. **Configurar el mecanismo de conmutación** por clase `html.dark-theme` / `[data-theme="dark"]` en `styles.scss`.
4. **Calibrar variables semánticas** para ambos modos (`:root` y `html.dark-theme`).
5. **Validar visualmente** componente por componente en modo claro y modo oscuro.
6. **Remover progresivamente los bloques de overrides** con `!important`.
7. **Ejecutar suite de pruebas y build de producción** (`npm test` y `npm run build`) para confirmar ausencia de advertencias de compilación Sass o regresiones en CSS.
