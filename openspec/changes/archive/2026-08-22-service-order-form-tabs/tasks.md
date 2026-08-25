# Tasks: Tabs for Service Order Form

- [x] Importar `MatTabsModule` y `MatChipsModule` (si se decide usar chips) en el componente o módulo que declara `ServiceOrderFormComponent`.
- [x] En `service-order-form.component.ts`, crear getters o métodos para extraer el `companyName` del cliente seleccionado y el `name` del proyecto seleccionado (a partir de las listas `clients` y `projects`).
- [x] En `service-order-form.component.html`, agregar en la parte superior (debajo del título o dentro del header) un área persistente que muestre: "N° Orden", "Cliente: [Nombre]" y "Proyecto: [Nombre]" cuando esos valores estén disponibles.
- [x] En `service-order-form.component.html`, refactorizar el formulario introduciendo `<mat-tab-group>` y envolviendo cada sub-sección del formulario en su respectivo `<mat-tab>`.
- [x] Asegurarse de que el formulario siga siendo válido y envíe correctamente los datos tras el cambio visual a pestañas.
- [x] Probar visualmente que la primera pestaña (Datos Principales) se muestre seleccionada por defecto al abrir o editar una orden.
