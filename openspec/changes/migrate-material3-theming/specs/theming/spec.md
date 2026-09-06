## Purpose

Establece la especificación técnica del sistema de theming oficial de Angular Material 3 (M3) en la plataforma web, soportando esquemas claro y oscuro a partir de la paleta de marca, la preservación y adaptación de tokens de estado semánticos y la eliminación de overrides manuales con alta especificidad.

## ADDED Requirements

### Requirement: Definición del theme M3
El sistema MUST definir un theme de Angular Material 3 mediante la API `mat.theme()` en `styles.scss`, generado a partir de una paleta primaria basada en `#D97706` (copper) y una paleta neutra/superficie basada en `#1E293B` (slate), sin requerir overrides directos sobre clases internas `.mat-mdc-*` ni `.mdc-*`.

#### Scenario: Carga del theme oficial en la aplicación
- **GIVEN** la aplicación web en inicialización
- **WHEN** se compilan y aplican los estilos globales en `styles.scss`
- **THEN** los componentes de Angular Material DEBEN recibir sus variables de color, tipografía y densidad a través del contrato oficial de tokens de Material 3 generado con `mat.theme()`.

#### Scenario: Ausencia de acoplamiento a clases internas en theming base
- **WHEN** se inspecciona la definición del theme M3 en `styles.scss`
- **THEN** la configuración de colores primarios y de superficie NO DEBE apoyarse en selectores de clases internas como `.mat-mdc-*` o `.mdc-*`.

### Requirement: Preservación de tokens semánticos de estado
El sistema MUST mantener variables y tokens accesibles para los estados de negocio `success`, `warning`, `error` e `info` preservando sus valores hexadecimales actuales (`#059669`, `#F59E0B`, `#DC2626`, `#2563EB`), y las clases de utilidad globales (`.text-success`, `.bg-error`, `.border-warning`, etc.) DEBEN permanecer operativas sin modificaciones en sus nombres ni en su comportamiento.

#### Scenario: Consumo de clases utilitarias de estado semántico
- **GIVEN** un elemento de la interfaz con clase utilitaria de estado (por ejemplo `.text-success` o `.bg-error`)
- **WHEN** el componente es renderizado en pantalla
- **THEN** el elemento DEBE reflejar el color correspondiente (`#059669` para éxito, `#DC2626` para error) sin verse alterado por la adopción del theme M3.

#### Scenario: Disponibilidad de tokens semánticos como variables CSS
- **WHEN** un componente o vista consume tokens CSS `--color-success`, `--color-warning`, `--color-error` o `--color-info`
- **THEN** las variables DEBEN resolver a sus valores hexadecimales estandarizados y mantenerse integradas con el esquema visual de la aplicación.

### Requirement: Eliminación de overrides obsoletos
El sistema MUST eliminar del archivo `styles.scss` las reglas de sobreescritura manual sobre botones, campos de formulario (`mat-form-field`), pestañas (`mat-tab-group`), casillas de verificación (`mat-checkbox`), botones de radio (`mat-radio-button`), indicadores de progreso (`mat-spinner` / `mat-progress-spinner`) y barras de notificación (`mat-snack-bar`) que fuercen colores mediante `!important` sobre clases `.mat-mdc-*` o `.mdc-*`, una vez que el theme M3 cubra dichos casos de forma nativa.

#### Scenario: Reducción de especificidad forzada en componentes base
- **WHEN** se evalúa el CSS compilado de botones y campos de formulario
- **THEN** los estilos de color primario, interacción (hover, focus) y estado no DEBEN contener reglas con `!important` atacando selectores `.mat-mdc-*`.

#### Scenario: Limpieza de variables intermedias no estándar
- **WHEN** se audita `styles.scss` tras la migración
- **THEN** las redefiniciones manuales de variables intermedias obsoletas (como `--mdc-theme-primary`, `--mdc-circular-progress-active-indicator-color`) DEBEN eliminarse en favor de los tokens emitidos por `mat.theme()`.

### Requirement: Verificación visual sin regresiones
El sistema MUST mantener la fidelidad visual actual basada en la paleta copper (`#D97706`) y slate (`#1E293B`) en todos los componentes en uso en la aplicación: botones (raised, outlined, text, fab), form fields (outlined y filled, estado focus y error), tabs, checkboxes, radios, spinners y snackbars (success, error, warning), validado mediante inspección visual comparativa contra el estado previo.

#### Scenario: Apariencia de controles de acción y botones
- **WHEN** se visualizan botones primarios y de advertencia en sus variantes raised, flat, outlined y fab
- **THEN** el color de fondo y texto DEBE preservar el contraste y tono visual original (#D97706 para primario y #DC2626 para warn/error).

#### Scenario: Apariencia y estados de campos de formulario
- **WHEN** un campo de formulario recibe foco o entra en estado de error
- **THEN** el contorno, etiqueta flotante e indicadores DEBEN mostrar respectivamente el color primario (#D97706) en foco y el color de error (#DC2626) en validación fallida sin inconsistencias visuales.

### Requirement: Personalización de snackbars y tooltip
El sistema MUST conservar el comportamiento personalizado de posicionamiento centrado en pantalla y estilo diferenciado de los snackbars por estado semántico, así como el estilo específico del tooltip de ayuda contextual (`.custom-help-tooltip`), asegurando que las personalizaciones que exceden el theming nativo de Material 3 no sean eliminadas ni degradadas.

#### Scenario: Presentación de notificaciones snackbar centradas
- **WHEN** se dispara un snackbar de éxito, error o advertencia en la plataforma
- **THEN** el contenedor DEBE posicionarse en el centro de la pantalla (`top: 50%`, `left: 50%`, `transform: translate(-50%, -50%)`), con su color de fondo distintivo y el icono prefijo correspondiente.

#### Scenario: Renderizado del tooltip contextual
- **WHEN** un usuario interactúa con un elemento que activa un tooltip con clase `.custom-help-tooltip`
- **THEN** el tooltip DEBE mostrarse con fondo slate (`#1E293B`), texto blanco, esquinas redondeadas y tipografía configurada según su diseño custom.

### Requirement: Definición de esquema oscuro nativo M3
El sistema MUST definir, junto al esquema claro, un esquema de color oscuro generado por `mat.theme()` a partir de la misma paleta base (`#D97706` / `#1E293B`), sin duplicar manualmente valores hexadecimales para el modo oscuro.

#### Scenario: Generación nativa del theme dark
- **WHEN** se genera el tema para modo oscuro utilizando `mat.theme((color: (theme-type: dark, ...)))`
- **THEN** Angular Material DEBE calcular automáticamente las tonalidades oscuras, elevaciones de superficie y contrastes adecuados sin requerir mapas de color duplicados ni redefiniciones manuales.

#### Scenario: Coherencia de paleta entre esquemas
- **WHEN** se examinan los tokens generados para el tema oscuro
- **THEN** la identidad de color primario y neutro DEBE derivarse coherentemente de las mismas semillas (#D97706 y #1E293B) empleadas en el tema claro.

### Requirement: Contraste de tokens semánticos en modo oscuro
El sistema MUST garantizar que los colores de estado (`success` `#059669`, `warning` `#F59E0B`, `error` `#DC2626`, `info` `#2563EB`) mantengan un contraste legible sobre fondo oscuro, ajustando su luminosidad si es necesario, preservando la asociación de color por estado (verde=success, rojo=error, ámbar=warning, azul=info).

#### Scenario: Legibilidad de utilidades de estado en fondo oscuro
- **GIVEN** la aplicación renderizada bajo el esquema de color oscuro
- **WHEN** se muestran elementos con clases utilitarias de estado (`.text-success`, `.text-warning`, `.text-error`, `.text-info` o sus variantes de borde/badge)
- **THEN** los colores de texto e indicadores DEBEN proporcionar un contraste mínimo conforme a accesibilidad (WCAG AA) sobre las superficies oscuras de Material 3.

#### Scenario: Preservación de asociación semántica de colores
- **WHEN** se alternan los esquemas claro y oscuro
- **THEN** el significado funcional y tonal básico de cada estado (verde para éxito, ámbar para advertencia, rojo para error y azul para información) DEBE mantenerse inalterado.

### Requirement: Mecanismo de conmutación de esquema
El sistema MUST exponer un mecanismo técnico para alternar entre esquema claro y oscuro (por clase en el elemento raíz, atributo, o preferencia de sistema vía `prefers-color-scheme`), documentado en `design.md`, aunque el control visual de usuario final para cambiarlo pueda quedar fuera del alcance de esta propuesta.

#### Scenario: Aplicación del esquema oscuro mediante selector raíz
- **WHEN** se aplica la clase `.dark-theme` o el atributo correspondiente en el elemento `<html>` o `<body>`
- **THEN** el sistema DEBE activar los tokens y colores correspondientes al tema oscuro en todos los componentes de Angular Material y variables de estado asociadas.

#### Scenario: Integración o fallback con preferencia del sistema
- **WHEN** el usuario no ha forzado un esquema manual y el sistema operativo reporta preferencia oscura mediante `prefers-color-scheme: dark`
- **THEN** el diseño técnico DEBE permitir resolver dicha preferencia de manera predecible según lo estipulado en `design.md`.

### Requirement: Sin regresión visual en modo claro
El sistema MUST mantener el aspecto visual actual (paleta copper/slate en modo claro) sin cambios perceptibles como resultado de agregar soporte de modo oscuro.

#### Scenario: Estabilidad visual del esquema por defecto
- **WHEN** un usuario navega por la plataforma con el tema claro activo por defecto
- **THEN** los colores, fondos, bordes y tipografía de los componentes DEBEN coincidir exactamente con el diseño actual de la aplicación.
