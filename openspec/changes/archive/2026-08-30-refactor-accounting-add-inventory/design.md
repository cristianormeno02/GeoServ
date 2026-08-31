## Context
Actualmente, el sistema asume que todo movimiento contable está atado a una orden de servicio. Ver proposal.md para la justificación. Este diseño introduce la flexibilidad necesaria a través de orígenes polimórficos, delegando la integridad a la capa de aplicación y creando un libro de movimientos real para el inventario, al mismo tiempo que soporta migraciones en la arquitectura multi-tenant (un tenant = una base de datos).

## Goals / Non-Goals

**Goals:**
- Desacoplar AccountingMovement de ServiceOrder.
- Centralizar los cálculos de montos en AccountingMovement y el stock en InventoryMovement.
- Facilitar reportes financieros mediante vistas.

**Non-Goals:**
- No se migrarán módulos que no estén directamente afectados por el stock o contabilidad (ej. RRHH).
- No se unificarán las tablas base origen de movimientos; mantendrán su autonomía salvo por el monto (donde se duplique innecesariamente).

## Decisions

- **Asociación polimórfica vs múltiples FKs nullables**: Se utilizarán los campos SourceType y SourceId en lugar de múltiples llaves foráneas nulas (ej. DirectCostId, AssetId, etc.). Razón: Es más escalable a futuro y evita tablas anchas con su mayoría de campos nulos.
- **Vistas SQL mapeadas como entidades Keyless**: Para mantener el performance y la simplicidad en la generación de reportes financieros mediante LINQ, se usa una vista que centraliza los LEFT JOIN polimórficos de la base de datos hacia las distintas entidades de origen.

## Risks / Trade-offs

- [Risk] Falta de integridad referencial dura a nivel de BD para el origen polimórfico. → Mitigación: Validaciones estrictas en la capa de servicios o factories al momento de la creación de un AccountingMovement.
- [Risk] Migraciones distribuidas por tenant. → Mitigación: Estandarizar scripts de migración para aplicarlos en loop a cada base de datos tenant, documentando este proceso.
