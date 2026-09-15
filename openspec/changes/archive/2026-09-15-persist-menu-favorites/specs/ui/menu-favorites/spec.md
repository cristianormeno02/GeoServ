## MODIFIED Requirements

### Requirement: Persistencia de favoritos por usuario
El sistema SHALL persistir la lista de favoritos de cada usuario en la base de datos, asociada a su identidad de usuario autenticado, de manera que los favoritos se mantengan al recargar la sesión, al iniciar sesión nuevamente y al iniciar sesión desde un navegador o dispositivo distinto.

#### Scenario: Restauración de favoritos al recargar
- **WHEN** el usuario recarga la aplicación o inicia sesión nuevamente
- **THEN** los ítems previamente marcados como favoritos aparecen correctamente en el panel de favoritos del header y con el indicador activo en el menú lateral

#### Scenario: Restauración de favoritos desde otro navegador o dispositivo
- **WHEN** el usuario inicia sesión con sus credenciales en un navegador o dispositivo distinto al que usó para marcar favoritos
- **THEN** el sistema muestra los mismos ítems favoritos que marcó previamente, obtenidos desde la base de datos

#### Scenario: Marcar un favorito persiste inmediatamente en el servidor
- **WHEN** el usuario marca un ítem del menú como favorito
- **THEN** el sistema guarda el favorito en la base de datos antes de considerarlo confirmado, de forma que sobreviva al cierre de la sesión del navegador

#### Scenario: Error al guardar un favorito
- **WHEN** el usuario marca o desmarca un ítem como favorito y la petición al servidor falla (por ejemplo, por pérdida de conectividad)
- **THEN** el sistema revierte el cambio visual del ítem a su estado anterior y notifica al usuario que no fue posible guardar el cambio

#### Scenario: Error al cargar los favoritos
- **WHEN** el sistema no puede obtener la lista de favoritos del usuario desde el servidor al iniciar sesión o recargar
- **THEN** el panel de favoritos del header y los indicadores del menú lateral se muestran sin favoritos activos, sin bloquear el resto de la navegación

#### Scenario: Un usuario no ve los favoritos de otro usuario
- **WHEN** dos usuarios distintos inician sesión en el mismo navegador de forma consecutiva
- **THEN** cada uno ve únicamente los ítems que él mismo marcó como favorito, sin mezclar los favoritos entre cuentas

#### Scenario: Migración automática de favoritos guardados previamente en el navegador
- **WHEN** el usuario inicia sesión y el sistema no tiene ningún favorito guardado para él en la base de datos, pero el navegador conserva favoritos de una versión anterior de la aplicación (guardados localmente en ese navegador)
- **THEN** el sistema guarda esos favoritos en la base de datos automáticamente, sin que el usuario tenga que volver a marcarlos, y a partir de ese momento los ve igual que cualquier otro favorito persistido
