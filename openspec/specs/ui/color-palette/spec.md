## Purpose
Establece las directrices visuales, variables CSS y el comportamiento semántico de los colores para garantizar una interfaz de usuario coherente y accesible en toda la plataforma.

## Requirements

### Requirement: Aplicación de Paleta de Colores Principal
El sistema DEBE utilizar la paleta de colores principal estandarizada para estructurar la aplicación y resaltar acciones.

#### Scenario: Visualización de estructura principal (Navbar y Sidebar)
- **WHEN** un usuario navega por la aplicación
- **THEN** la barra de navegación (Navbar), encabezado (Header) y menú lateral (Sidebar) DEBEN mostrar un fondo de color Slate 800 (`#1E293B`) con texto en blanco.

#### Scenario: Fondo general de la plataforma
- **WHEN** se renderiza cualquier vista de la plataforma
- **THEN** el fondo base DEBE ser `#F8FAFC` y las superficies de contenido (tarjetas, contenedores) DEBEN ser `#FFFFFF`.

#### Scenario: Botones de acción principal
- **WHEN** se presenta un botón de acción principal o primaria (ej. Guardar, Confirmar)
- **THEN** el botón DEBE tener el color Accent (Amber 600 - `#D97706`).

#### Scenario: Botones de acción destructiva
- **WHEN** se presenta un botón de acción destructiva (ej. Eliminar, Cancelar, Rechazar)
- **THEN** el botón DEBE tener el color Error (`#DC2626`).

### Requirement: Representación Visual de Estados Semánticos
El sistema DEBE utilizar los colores semánticos definidos para comunicar claramente el estado de los elementos y procesos de negocio.

#### Scenario: Elementos en estado de éxito (Success)
- **WHEN** un elemento tiene un estado positivo (Cobrado, Pagado, Aprobado, Completado, Entregada, Procesado, Activo)
- **THEN** el sistema DEBE representarlo utilizando el color Success (`#059669`).

#### Scenario: Elementos en estado de advertencia (Warning)
- **WHEN** un elemento requiere atención sin ser crítico (Pendiente, En revisión)
- **THEN** el sistema DEBE representarlo utilizando el color Warning (`#F59E0B`).

#### Scenario: Elementos en estado de error o cancelación (Error)
- **WHEN** un elemento indica falla, cancelación o salida (Rechazado, Error, Egreso)
- **THEN** el sistema DEBE representarlo utilizando el color Error (`#DC2626`).

#### Scenario: Elementos de carácter informativo (Info)
- **WHEN** un elemento proporciona información adicional o contexto (Información, Ayudas)
- **THEN** el sistema DEBE representarlo utilizando el color Info (`#2563EB`).

### Requirement: Comportamiento Visual en Formularios y Acordeones
El sistema DEBE proporcionar retroalimentación visual clara durante el llenado y validación de formularios y acordeones.

#### Scenario: Bordes de inputs por defecto
- **WHEN** un campo de formulario está en estado normal o de reposo
- **THEN** su borde DEBE utilizar el color estándar `--border-color` (`#E2E8F0`).

#### Scenario: Validación fallida en formularios
- **WHEN** un campo de formulario falla su validación
- **THEN** el borde del input DEBE cambiar al color Error (`#DC2626`) y mostrar un mensaje de error claro debajo del campo.

#### Scenario: Indicador de estado en acordeones (Expansion Panels) pendientes
- **WHEN** un acordeón o sección de formulario contiene campos obligatorios sin completar
- **THEN** el encabezado del acordeón DEBE mostrar un indicador en color rojo con el conteo numérico de los campos faltantes.

#### Scenario: Indicador de estado en acordeones (Expansion Panels) válidos
- **WHEN** un acordeón o sección de formulario tiene todos sus campos válidos y completados
- **THEN** el encabezado del acordeón DEBE mostrar un indicador verde con un símbolo de verificación (✓).

### Requirement: Cumplimiento de Accesibilidad
El sistema DEBE asegurar que la presentación visual sea accesible para todos los usuarios.

#### Scenario: Contraste de texto y fondo
- **WHEN** se renderiza texto sobre un fondo de color
- **THEN** el contraste DEBE ser accesible (texto oscuro como Slate 800 sobre fondos claros, y texto blanco sobre fondos oscuros).

#### Scenario: Independencia del color para comunicar estado
- **WHEN** el sistema comunica información de estado (ej. errores, validaciones, éxito)
- **THEN** la información NO DEBE depender únicamente del color, apoyándose en iconos, texto explícito o indicadores adicionales.
