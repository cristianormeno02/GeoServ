# Changelog

Todos los cambios relevantes de GeoServ se documentan en este archivo.

El formato sigue [Conventional Commits](https://www.conventionalcommits.org/) y el
versionado sigue [SemVer](https://semver.org/lang/es/): `MAJOR.MINOR.PATCH`.
Este archivo se actualiza automáticamente con `npm run release` (ver `scripts/`).

## [1.0.0] - 2026-09-15

Primera versión estable etiquetada del sistema. Consolida el trabajo previo a la
introducción de versionado formal.

### Nuevas funcionalidades

- Rediseño del detalle de Orden de Servicio con más información y jerarquía visual.
- Favoritos de menú persistentes por usuario.
- Vinculación de movimientos financieros con cobros y costos directos de órdenes de servicio.
- Transferencias internas entre cuentas financieras.
- Buscador compacto y descripciones en tooltip para el menú lateral.
- Vista satelital con etiquetas por defecto en el dashboard operativo y el CRUD de proyectos.

### Correcciones

- Ajustes de contraste y alineación en el menú lateral y la barra superior.
- Consistencia de fechas reales/presupuestadas en órdenes de servicio.
