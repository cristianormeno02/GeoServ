## MODIFIED Requirements

### Requirement: Aplicación de Paleta de Colores Principal
El sistema DEBE utilizar la paleta de colores principal estandarizada para estructurar la aplicación y resaltar acciones, garantizando una semántica inequívoca entre colores de fondo y texto.

#### Scenario: Visualización de estructura principal (Navbar y Sidebar)
- **WHEN** un usuario navega por la aplicación
- **THEN** la barra de navegación (Navbar), encabezado (Header) y menú lateral (Sidebar) DEBEN mostrar un fondo de color Slate 800 (`#1E293B`) con texto claro de contraste bajo el token `--on-dark-surface` (`#FFFFFF`).

#### Scenario: Fondo general de la plataforma
- **WHEN** se renderiza cualquier vista de la plataforma
- **THEN** el fondo base DEBE ser `#FAF8F5`, las superficies de contenido (tarjetas, contenedores) DEBEN ser `#FFFFFF`, y el texto principal DEBE utilizar el token `--text-primary` con color Slate 800 (`#1E293B` en modo claro) asegurando un contraste legible sin requerir sobreescrituras `!important`.

#### Scenario: Botones de acción principal
- **WHEN** se presenta un botón de acción principal o primaria (ej. Guardar, Confirmar)
- **THEN** el botón DEBE tener el color Accent (Amber 600 - `#D97706`).

#### Scenario: Botones de acción destructiva
- **WHEN** se presenta un botón de acción destructiva (ej. Eliminar, Cancelar, Rechazar)
- **THEN** el botón DEBE tener el color Error (`#DC2626`).

### Requirement: Cumplimiento de Accesibilidad
El sistema DEBE asegurar que la presentación visual sea accesible para todos los usuarios y cumpla con ratios de contraste WCAG AA en todas las vistas y componentes.

#### Scenario: Contraste de texto y fondo
- **WHEN** se renderiza texto sobre cualquier fondo o superficie
- **THEN** el contraste DEBE ser accesible (texto oscuro `#1E293B` sobre fondos claros mediante `--text-primary`, y texto claro `#FFFFFF` sobre fondos oscuros mediante `--on-dark-surface`).

#### Scenario: Independencia del color para comunicar estado
- **WHEN** el sistema comunica información de estado (ej. errores, validaciones, éxito)
- **THEN** la información NO DEBE depender únicamente del color, apoyándose en iconos, texto explícito o indicadores adicionales.
