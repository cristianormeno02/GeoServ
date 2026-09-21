# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.1.1](https://github.com/cristianormeno02/GeoServ/compare/v1.1.0...v1.1.1) (2026-09-21)

### Correcciones

* **about:** mostrar novedades del changelog generado por release (vinetas con asterisco y enlaces) ([4133d11](https://github.com/cristianormeno02/GeoServ/commit/4133d11d0190436e79ccb7a9ef058205d8ac10fa))
* **version:** subir la version automaticamente con un hook post-commit segun el prefijo ([dd7a0ca](https://github.com/cristianormeno02/GeoServ/commit/dd7a0ca3a957750ec449c783edd3253edb813649))

## [1.1.0](https://github.com/cristianormeno02/GeoServ/compare/v1.0.0...v1.1.0) (2026-09-21)

### Nuevas funcionalidades

* **alertas:** implementar modulo del centro de alertas y tareas ([ec6109e](https://github.com/cristianormeno02/GeoServ/commit/ec6109e0101ac3b5b1a60e90c1e98b5604621c85))
* **auth:** enviar correos de recuperación por la API HTTP de Brevo cuando el SMTP está bloqueado ([fa7a321](https://github.com/cristianormeno02/GeoServ/commit/fa7a321141434c9c54b1c36877e4cb3e0d29b7be))
* **auth:** enviar el correo de recuperación en segundo plano mediante una cola ([f847b4c](https://github.com/cristianormeno02/GeoServ/commit/f847b4cfa74bbfdfe45f5d461fcbc9c5199c8458))
* **auth:** implementar recuperación de contraseña real con token de un solo uso y rediseñar sus páginas ([9cc520f](https://github.com/cristianormeno02/GeoServ/commit/9cc520f41438359f27c5ddb47eeb92cd8af6e5b2))
* **auth:** registrar en el log cada paso de la recuperación de contraseña ([aede654](https://github.com/cristianormeno02/GeoServ/commit/aede65461244d327d91cd34cc6f6046277f887c9))

### Correcciones

* **about:** ajustar titulo, version y descripcion de la pagina Acerca de ([301336e](https://github.com/cristianormeno02/GeoServ/commit/301336e0a4e7e09017acbef64cbeb53082a34b16))
* **alertas:** aplicar estilos de error correctos en alertas y remover spinner duplicado ([8d1c8f7](https://github.com/cristianormeno02/GeoServ/commit/8d1c8f729c7fbf5a90780012a7dd1e83151e510d))
* **alertas:** corregir error de sintaxis en el template de angular para las fechas y arrow functions ([0dd7647](https://github.com/cristianormeno02/GeoServ/commit/0dd76478335ff47850362b2828433c9cd30d7e39))
* **alertas:** corregir ruta duplicada api/api en el servicio del centro de alertas ([791ee73](https://github.com/cristianormeno02/GeoServ/commit/791ee7322272dbd420400bb46ab05bc117ba9b1a))
* **auth:** refrescar la vista tras la respuesta en recuperar contraseña y corregir el dominio del enlace del correo ([525e7ed](https://github.com/cristianormeno02/GeoServ/commit/525e7edf5e0c06b929709ff19eb22d34e0e50f2e))
* **backend:** ignorar advertencia de pending model changes para permitir migracion de inicializacion ([a33e3bd](https://github.com/cristianormeno02/GeoServ/commit/a33e3bdbc24aa3a00888ccea9d6aca4bac346828))
* **dashboard-financiero:** corregir tooltip del grafico de cobertura mensual ([2caf72a](https://github.com/cristianormeno02/GeoServ/commit/2caf72adc811feb489bf4daa196a22507bb1b9ad))
* **financiero:** corregir cobertura de 12 meses, rentabilidad por orden y bloqueo de fechas futuras ([98b9c0a](https://github.com/cristianormeno02/GeoServ/commit/98b9c0aa012a621ce65d3d397036b32f0ec8f14d))
* **ordenes-servicio:** resolver presupuesto no editable en os y suprimir doble spinner ([8d0e762](https://github.com/cristianormeno02/GeoServ/commit/8d0e762931bf92569bd9f5b21a3a18c5d1445173))

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
