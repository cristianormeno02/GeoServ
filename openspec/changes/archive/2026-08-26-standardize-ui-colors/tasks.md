## 1. Definición Global de Variables de Color

- [x] 1.1 Crear o actualizar el archivo de estilos base (ej. `variables.scss` o `styles.scss`) inyectando las CSS Custom Properties en `:root` (primario, error, success, warning, info, background, surface, text-primary, text-secondary, border-color). Verificar visualizando en el navegador las variables CSS cargadas en el elemento html/body en las DevTools.
- [x] 1.2 Limpiar valores hexadecimales (`#HEX`) duplicados o hardcodeados en los estilos globales y reemplazarlos con las nuevas variables `--color-xyz`. Verificar que la aplicación compile sin errores de SCSS y mantenga su estilo en vistas base.

## 2. Configuración del Tema de Angular Material

- [x] 2.1 Actualizar las variables `--mdc-theme-primary` y los overrides CSS de componentes Material (botones, tabs, campos de texto) para inyectar directamente la variable `--color-accent` (Amber 600 - `#D97706`). Verificar comprobando que botones primarios de Material (`mat-raised-button color="primary"`) se vean color Amber.
- [x] 2.2 Aplicar el color de fondo general (`#F8FAFC`) al body/mat-app-background y `#FFFFFF` a las superficies (tarjetas, modales). Verificar comprobando el layout visual general.
- [x] 2.3 Aplicar estilos en Navbar y Sidebar para que utilicen el fondo Slate 800 y texto en blanco (asegurando el contraste adecuado). Verificar comprobando la barra lateral y superior.

## 3. Implementación de Estados Semánticos

- [x] 3.1 Crear clases utilitarias CSS/SCSS para los 4 estados (Success, Warning, Error, Info) vinculadas a sus respectivas variables. Verificar inspeccionando que las clases apliquen el color correcto.
- [x] 3.2 Refactorizar componentes existentes (badges de estado de la Orden de Servicio, etiquetas) para consumir estas nuevas clases utilitarias o directivas en lugar de estilos quemados en sus plantillas. Verificar viendo los diferentes estados de una OS (Pendiente, Aprobado, Rechazado) en la plataforma para comprobar su renderización visual.
- [x] 3.3 Revisar contraste de accesibilidad en los badges (ej. texto blanco sobre fondos oscuros o viceversa) agregando iconos complementarios para distinguir estados sin depender solo del color. Verificar con herramientas de contraste en DevTools.

## 4. Estilos de Formularios y Acordeones

- [x] 4.1 Estilizar inputs (`mat-form-field` / `input`) para usar `--border-color` en su estado normal. Verificar inspeccionando que el color del borde sea `#E2E8F0`.
- [x] 4.2 Asegurar que el focus state en inputs se vea en Amber 600 y los errores usen `--color-error` (rojo). Verificar visualmente un formulario activo y uno con error.
- [x] 4.3 Implementar lógica de indicador visual en encabezados de `mat-expansion-panel` / `mat-tab` (Acordeón o Tab): agregar span/clase que muestre contador rojo si hay campos inválidos pendientes. Verificar dejando campos vacíos dentro de un acordeón y cerrándolo.
- [x] 4.4 Añadir icono verde de éxito (✓) en el encabezado del acordeón / tab cuando todos los campos del panel estén válidos. Verificar completando todos los datos del acordeón y observando el encabezado.
