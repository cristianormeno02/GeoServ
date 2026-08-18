## Purpose

Define las capacidades principales para crear, gestionar y realizar el seguimiento de las Órdenes de Servicio (OS) dentro del sistema de consultoría geológica.

## ADDED Requirements

### Requirement: Crear Orden de Servicio
El sistema DEBE permitir a los usuarios crear una nueva Orden de Servicio, vinculándola a un Cliente y a un Tipo de Servicio específico.
La Orden de Servicio DEBE incluir campos para el importe presupuestado, descuento y monto total final.
La Orden de Servicio DEBE incluir campos de porcentaje para la regla de distribución (Gastos, Capitalización y Honorarios), con un valor por defecto de 33.33% cada uno.

#### Scenario: Creación exitosa de una Orden de Servicio
- **WHEN** el usuario proporciona detalles válidos de la Orden de Servicio, incluyendo los importes y porcentajes de distribución
- **THEN** el sistema crea la Orden de Servicio en estado de 'Alta' y le asigna un identificador único

### Requirement: Ver detalles de la Orden de Servicio
El sistema DEBE permitir a los usuarios obtener los detalles completos de una Orden de Servicio existente.

#### Scenario: Obtener una Orden de Servicio existente
- **WHEN** el usuario solicita una Orden de Servicio mediante su identificador único válido
- **THEN** el sistema devuelve los detalles de la Orden de Servicio, incluyendo la información financiera y porcentajes de distribución

### Requirement: Gestionar Estado y Fechas de Control
El sistema DEBE gestionar el flujo de estados de una Orden de Servicio de forma normalizada, con los siguientes estados posibles e implicancias financieras:
1. **Alta:** Se recibe y registra la orden inicialmente.
2. **Presupuestada:** Se emite el presupuesto al cliente. *(Hito clave de seguimiento)*.
3. **Aprobada:** El cliente aprueba el presupuesto.
4. **Iniciada:** Se comienza con el trabajo de campo o laboratorio.
5. **Entregada:** Se entregan los resultados/informe al cliente.
6. **Cobrada:** El cliente efectúa el pago. *(Hito crítico: solo en este estado se dispara la absorción de costos fijos y la distribución de los tercios de ingresos).*
7. **Cancelada:** El cliente decide no avanzar o la consultora rechaza el servicio. *(Hito crítico: las órdenes canceladas no suman ni restan para el balance ni absorben costos fijos).*

#### Scenario: Actualización de estado a Cobrada
- **WHEN** el usuario actualiza el estado de una Orden de Servicio a 'Cobrada'
- **THEN** el sistema registra la fecha actual como fecha de cobro y calcula automáticamente la tabla de Ingresos Distribuidos (Gastos, Capitalización y Honorarios) según los porcentajes definidos.
