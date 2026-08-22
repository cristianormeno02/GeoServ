# Carga de Costos Directos Imputables a Órdenes de Servicio

## Problem & Context
Actualmente se requiere poder imputar costos directos a cada orden de servicio, permitiendo registrar el detalle de los gastos generados en la ejecución de la orden, para así tener un control financiero claro.

## Goals
- Permitir la carga de costos directos dentro del CRUD de Órdenes de Servicio, funcionando como una pestaña o sección dependiente de la orden.
- Mantener catálogos independientes (mantenedores) para Categorías de Costos, Proveedores, Unidades y Medios de Pago.

## Non-Goals
- Este cambio no contempla la liquidación o generación de facturas desde los costos directos, únicamente su registro.
- No se aborda la modificación del flujo principal de creación de Órdenes de Servicio (solo la adición de la sección de costos).
