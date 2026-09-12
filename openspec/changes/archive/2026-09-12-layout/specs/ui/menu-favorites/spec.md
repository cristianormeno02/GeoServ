## Purpose

Permite a los usuarios marcar ítems del menú lateral como favoritos para acceder rápidamente a ellos desde el header de la aplicación, sin necesidad de navegar por todos los grupos del menú.

## ADDED Requirements

### Requirement: Marcar y desmarcar ítem como favorito
El sistema SHALL permitir al usuario marcar o desmarcar cualquier ítem del menú lateral como favorito mediante una opción visible en el propio ítem (ícono o botón de toggle).

#### Scenario: Marcar un ítem como favorito
- **WHEN** el usuario hace clic en la opción "Marcar como favorito" de un ítem del menú lateral
- **THEN** el ítem queda registrado como favorito del usuario y el indicador visual del ítem refleja el estado activo de favorito

#### Scenario: Desmarcar un ítem favorito desde el menú lateral
- **WHEN** el usuario hace clic en la opción "Quitar de favoritos" de un ítem del menú que ya es favorito
- **THEN** el ítem se elimina de la lista de favoritos del usuario y el indicador visual vuelve al estado inactivo

### Requirement: Acceso al panel de favoritos desde el header
El sistema SHALL mostrar en el header de la aplicación un acceso directo "Favoritos" que, al hacer clic, despliega un panel con los ítems favoritos del usuario en un formato visual similar al menú lateral.

#### Scenario: Apertura del panel de favoritos
- **WHEN** el usuario hace clic en el acceso "Favoritos" del header
- **THEN** se despliega un panel que lista únicamente los ítems marcados como favoritos por el usuario, con la misma presentación visual (ícono + nombre) que en el menú lateral

#### Scenario: Panel vacío sin favoritos
- **WHEN** el usuario hace clic en "Favoritos" y no tiene ningún ítem marcado como favorito
- **THEN** el panel muestra un mensaje informativo indicando que aún no hay favoritos seleccionados

### Requirement: Desmarcar favorito desde el panel del header
El sistema SHALL permitir al usuario desmarcar un ítem como favorito directamente desde el panel de favoritos del header.

#### Scenario: Quitar favorito desde el panel del header
- **WHEN** el usuario activa la opción de quitar un ítem del panel de favoritos en el header
- **THEN** el ítem desaparece del panel de favoritos y el indicador de favorito en el menú lateral refleja el estado inactivo

### Requirement: Persistencia de favoritos por usuario
El sistema SHALL persistir la lista de favoritos de forma individual por usuario, de manera que al recargar la sesión o iniciar sesión nuevamente los favoritos se mantengan.

#### Scenario: Restauración de favoritos al recargar
- **WHEN** el usuario recarga la aplicación o inicia sesión nuevamente
- **THEN** los ítems previamente marcados como favoritos aparecen correctamente en el panel de favoritos del header y con el indicador activo en el menú lateral
