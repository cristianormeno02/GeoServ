## ADDED Requirements

### Requirement: Renderizado visual y proporciones del Gráfico de Cobertura Mensual
El componente visual de Informe de Cobertura Mensual (`combo-chart`) DEBE renderizarse con una altura y relación de aspecto que evite el achatamiento, compresión o distorsión de las barras y la línea de saldo acumulado en pantallas de escritorio completas. La altura del contenedor DEBE ajustarse a un valor óptimo (entre 320px y 360px), asegurando legibilidad de los textos del eje Y y de los períodos sin solapamientos.

#### Scenario: Visualización del gráfico en pantalla de ancho completo
- **WHEN** el usuario accede al Dashboard Financiero en un monitor de escritorio estándar (1280px de ancho o superior)
- **THEN** el gráfico de Informe de Cobertura Mensual mantiene una proporción equilibrada entre altura y anchura con barras verticales nítidas y etiquetas claramente legibles
