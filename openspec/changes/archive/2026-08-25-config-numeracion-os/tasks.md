# Tasks

## 1. Base de Datos (Data Model)
- [x] Crear migración para la tabla empresa_configuracion (campos: id, empresa_id, key, value, valueType, description).
- [x] Añadir restricciones únicas a nivel de base de datos para (empresa_id, key).

## 2. Backend (Modelos y Repositorios)
- [x] Crear el modelo EmpresaConfiguracion.
- [x] Configurar las relaciones en el modelo Empresa (una empresa tiene muchas configuraciones).
- [x] Crear el servicio/repositorio para gestionar la lectura y escritura de estas configuraciones por clave.

## 3. Backend (Lógica de Órdenes de Servicio)
- [x] Modificar el endpoint de creación de Orden de Servicio (POST /ordenes-servicio u homólogo).
- [x] En la creación, obtener la configuración os_number_format de la empresa.
- [x] Implementar lógica condicional:
    - Si es auto: consultar el máximo número actual, incrementarlo en 1, aplicar zero-padding (8 dígitos) y asignar. Usar un lock o secuencia para concurrencia.
    - Si es manual: validar que el número se haya proporcionado en el payload y que sea único para la empresa.
- [x] Añadir validación en el endpoint de actualización de configuración: Si la clave es os_number_format, verificar que no haya órdenes creadas para esa empresa antes de permitir la actualización. Lanzar error apropiado si hay OS.

## 4. Frontend (Configuración de Empresa)
- [x] Modificar la pantalla de configuración de empresa para añadir un panel/sección de "Configuraciones" genéricas.
- [x] Agregar un control específico para "Formato de numeración de OS" (Selector: Auto-incremental / Manual).
- [x] Consumir endpoint para guardar configuración. Mostrar mensaje de error amigable si falla por la restricción de OS existentes.
# Tasks

## 1. Base de Datos (Data Model)
- [x] Crear migración para la tabla empresa_configuracion (campos: id, empresa_id, key, value, valueType, description).
- [x] Añadir restricciones únicas a nivel de base de datos para (empresa_id, key).

## 2. Backend (Modelos y Repositorios)
- [x] Crear el modelo EmpresaConfiguracion.
- [x] Configurar las relaciones en el modelo Empresa (una empresa tiene muchas configuraciones).
- [x] Crear el servicio/repositorio para gestionar la lectura y escritura de estas configuraciones por clave.

## 3. Backend (Lógica de Órdenes de Servicio)
- [x] Modificar el endpoint de creación de Orden de Servicio (POST /ordenes-servicio u homólogo).
- [x] En la creación, obtener la configuración os_number_format de la empresa.
- [x] Implementar lógica condicional:
    - Si es auto: consultar el máximo número actual, incrementarlo en 1, aplicar zero-padding (8 dígitos) y asignar. Usar un lock o secuencia para concurrencia.
    - Si es manual: validar que el número se haya proporcionado en el payload y que sea único para la empresa.
- [x] Añadir validación en el endpoint de actualización de configuración: Si la clave es os_number_format, verificar que no haya órdenes creadas para esa empresa antes de permitir la actualización. Lanzar error apropiado si hay OS.

## 4. Frontend (Configuración de Empresa)
- [x] Modificar la pantalla de configuración de empresa para añadir un panel/sección de "Configuraciones" genéricas.
- [x] Agregar un control específico para "Formato de numeración de OS" (Selector: Auto-incremental / Manual).
- [x] Consumir endpoint para guardar configuración. Mostrar mensaje de error amigable si falla por la restricción de OS existentes.

## 5. Frontend (Creación de OS)
- [x] En el formulario de nueva OS, consultar la configuración de la empresa seleccionada al cargar o seleccionar la empresa.
- [x] Si os_number_format es auto, ocultar o deshabilitar el campo de número de orden.
- [x] Si os_number_format es manual (o no está configurado), asegurar que el campo es requerido y permitir entrada manual.

## 6. Testing y Validación
- [x] Escribir tests unitarios para la validación de cambio de configuración (falla si hay OS, éxito si no).
- [x] Escribir tests de integración para creación de OS bajo ambos modos de configuración.
- [x] Pruebas manuales end-to-end de configuración y creación de OS.
