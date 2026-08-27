## Why

La aplicación actualmente carece de una paleta de colores globalmente estandarizada, lo que provoca inconsistencias visuales, duplicación de código (valores HEX repetidos) y dificulta el mantenimiento del diseño. Estandarizar los colores y componentes principales (botones, estados semánticos, formularios y acordeones) mejorará la experiencia de usuario (UX), la coherencia de la interfaz de usuario (UI) y garantizará el cumplimiento de pautas de accesibilidad.

## What Changes

- Definición de variables CSS/SCSS globales en `:root` para los colores primarios, secundarios, semánticos, de fondo y texto.
- Limpieza de valores HEX duplicados a lo largo de los estilos globales y componentes.
- Configuración del tema principal integrando Angular Material con los colores especificados (Amber 600 como primario, Slate 800 para estructura y fondos neutros).
- Estandarización de badges y estados semánticos (Success, Warning, Error, Info) asociados a los flujos de la plataforma.
- Mejora de los estilos en formularios extensos y acordeones, añadiendo feedback visual en bordes para validaciones y contadores de campos pendientes.
- Aseguramiento de niveles de contraste accesibles en todos los componentes y evitar la comunicación de estado únicamente mediante color.

## Capabilities

### New Capabilities
- `ui/color-palette`: Define el sistema de diseño estándar y estandarización visual de la aplicación.

### Modified Capabilities

## Impact

- **Estilos globales y de Angular Material**: Se verán fuertemente impactados, unificando la configuración de la paleta.
- **Componentes UI (Botones, Badges, Formularios, Acordeones)**: Modificaciones a nivel de SCSS/HTML para incorporar las nuevas variables y lógicas de estado.
- **Accesibilidad**: Impacto positivo al garantizar contrastes adecuados y mejores indicadores visuales de validación.
