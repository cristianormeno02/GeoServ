## 1. Preparación y Respaldo

- [x] 1.1 Crear backup del archivo `styles.scss` actual y registrar capturas de referencia visual de los componentes clave en la aplicación
- [x] 1.2 Auditar el codebase para identificar dependencias residuales de variables intermedias `--mdc-theme-*` en hojas de estilo de componentes

## 2. Definición de Temas M3 (Light y Dark) y Mecanismo de Conmutación

- [x] 2.1 Configurar `@use '@angular/material' as mat;` y definir el tema claro ($theme-light) y tema oscuro ($theme-dark) mediante `mat.theme()` a partir de la paleta base (#D97706 y #1E293B), verificando compilación limpia con `npm run build`
- [x] 2.2 Aplicar `$theme-light` en `:root` y `$theme-dark` bajo el selector `html.dark-theme` / `[data-theme="dark"]`, verificando en el inspector del navegador la emisión de variables nativas de sistema en ambos modos
- [x] 2.3 Documentar formalmente en `design.md` la decisión de conmutación por clase raíz (`.dark-theme`) como preparación para un futuro toggle de usuario frente a solo `prefers-color-scheme`

## 3. Preservación y Calibración de Tokens Semánticos

- [x] 3.1 Consolidar los 4 tokens semánticos de estado para modo claro (`--color-success`, `--color-warning`, `--color-error`, `--color-info`) y calibrar sus variantes de luminosidad y alto contraste para modo oscuro bajo `html.dark-theme`
- [x] 3.2 Verificar que las clases utilitarias (`.text-*`, `.bg-*`, `.border-*`) resuelvan correctamente sus colores y conserven ratio accesible en fondos claros y oscuros

## 4. Remoción Progresiva de Overrides Manuales con !important

- [x] 4.1 Remover overrides manuales sobre botones (`.mat-mdc-raised-button`, `.mat-mdc-outlined-button`, `.mat-mdc-fab`, etc.) y verificar visualmente que adopten los colores primary (#D97706) y warn (#DC2626) mediante M3 nativo en ambos esquemas
- [x] 4.2 Remover overrides manuales sobre campos de formulario (`.mdc-notched-outline`, bordes en focus y label flotante), verificando los estados normal, focus y error de `mat-form-field` tanto en modo claro como en modo oscuro
- [x] 4.3 Remover overrides manuales sobre pestañas (`mat-tab-group`), casillas de verificación (`mat-checkbox`) y botones de radio (`mat-radio-button`), verificando su renderizado activo en ambos temas
- [x] 4.4 Remover overrides manuales sobre spinners (`mat-progress-spinner`) y eliminar la redefinición manual de variables intermedias obsoletas (`--mdc-theme-primary`, `--mdc-circular-progress-*`)
- [x] 4.5 Limpiar overrides de superficies manteniendo expresamente las reglas funcionales de snackbars centrados y el tooltip personalizado `.custom-help-tooltip`

## 5. Verificación Visual y Validación de Calidad

- [x] 5.1 Ejecutar el checklist de verificación visual comparativa para todos los componentes (botones, form fields, tabs, checkboxes, radios, spinner, snackbars) en esquema claro contra las capturas iniciales para garantizar cero regresiones
- [x] 5.2 Ejecutar la verificación visual de todos los componentes listados bajo el esquema oscuro (`html.dark-theme`) confirmando contraste adecuado, legibilidad y consistencia de superficies
- [x] 5.3 Ejecutar la suite de pruebas y build de producción (`npm test` y `npm run build`) verificando cero errores o advertencias de compilación
- [x] 5.4 Validar el cambio completo ejecutando `openspec validate migrate-material3-theming --strict` y confirmar que no existan discrepancias
