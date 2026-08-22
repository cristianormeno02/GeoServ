# Tareas de Implementación: Estandarización de Paleta de Colores

Esta lista de tareas detalla los pasos necesarios para implementar la nueva semántica visual de colores sin alterar la lógica de negocio ni el comportamiento funcional.

## 1. Definición de Variables Globales (CSS/SCSS)
- [x] Localizar el archivo principal de estilos (ej. `styles.scss` o `variables.scss`).
- [x] Definir las variables CSS oficiales en `:root` (Primary, Accent, Success, Error, Warning, Info, Background, Surface, Text, Border).
- [x] Eliminar valores HEX hardcodeados duplicados en la hoja de estilos global que correspondan a estas nuevas variables.

## 2. Configuración de Angular Material
- [x] Revisar el archivo de configuración del tema de Angular Material.
- [x] Confirmar que el color primario de Material siga siendo `#D97706` (Amber 600) para las acciones y botones.
- [x] Asegurar que el fondo general de la aplicación (`#F8FAFC`) y las superficies (`#FFFFFF`) se apliquen correctamente a nivel global.

## 3. Actualización de Estructura e Identidad (Slate 800)
- [x] Modificar el Navbar / Header principal para utilizar `--color-primary` (`#1E293B`) y `--text-primary` (`#FFFFFF`).
- [x] Modificar el Sidebar (si existe) para utilizar la misma estructura visual.
- [x] Ajustar los títulos principales para que utilicen el color adecuado dependiendo del fondo (ej. `--text-secondary` sobre superficies claras).

## 4. Aplicación de Colores Semánticos (Estados y Badges)
- [x] Identificar componentes de "Badges", "Chips" o indicadores de estado (ej. listas de órdenes, tablas de finanzas).
- [x] Aplicar `--color-success` (`#059669`) para estados: Cobrado, Pagado, Aprobado, Completado, Procesado, Activo.
- [x] Aplicar `--color-warning` (`#F59E0B`) para estados: Pendiente, En revisión.
- [x] Aplicar `--color-error` (`#DC2626`) para estados: Rechazado, Error.
- [x] Aplicar `--color-info` (`#2563EB`) para estados: Información, Ayudas.

## 5. Mejora visual en Formularios Extensos
- [x] Identificar los componentes de formularios grandes (ej. Acordeones / Expansion Panels de Angular Material).
- [x] Implementar la lógica visual en los encabezados de sección para mostrar:
  - **Indicador Rojo:** Conteo de campos obligatorios pendientes si la sección ya fue visitada o se intentó guardar.
  - **Indicador Verde (✓):** Si la sección está completamente validada.
- [x] Verificar que los inputs utilicen `--border-color` (`#E2E8F0`) por defecto, y `--color-error` (`#DC2626`) para validaciones fallidas.

## 6. Revisión de Botones y Acciones
- [x] Verificar que los botones de acción principal (Guardar, Crear, Confirmar) utilicen `--color-accent` (`#D97706`).
- [x] Asegurar que los botones secundarios tengan estilos neutros (basados en Slate 800 y bordes).
- [x] Asegurar que los botones destructivos (Eliminar, Cancelar, Rechazar) utilicen `--color-error` (`#DC2626`).

## 7. Control de Calidad y Accesibilidad
- [x] Navegar por la aplicación para garantizar que los fondos oscuros tengan texto blanco y fondos claros tengan texto Slate 800.
- [x] Validar que no se comuniquen estados *únicamente* por color (asegurar el uso de íconos o texto complementario como "✓ Aprobado").
- [x] Confirmar que los cambios no hayan afectado contratos de API, lógicas de guardado, ni modelos de datos.
