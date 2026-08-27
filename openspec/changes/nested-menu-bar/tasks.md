## 1. Modificación de Datos de Menú

- [x] 1.1 Transformar `menuItems` en `main-layout.component.ts` a una estructura agrupada con `children`. Verificar mediante compilación (`ng build` o `ng serve`) que no existan errores de tipado.

## 2. Actualización de Interfaz

- [x] 2.1 Actualizar dependencias en `main-layout.component.ts`: importar `MatExpansionModule` y `MatListModule`. Verificar que compila sin errores.
- [x] 2.2 Modificar el template de la barra lateral (`main-layout.component.html` o `sidebar.component.html`) para implementar el `mat-accordion` y los `mat-expansion-panel` iterando sobre las nuevas agrupaciones. Verificar que la vista cargue correctamente y se muestren las categorías colapsadas.
- [x] 2.3 Ajustar los estilos del menú para que el diseño (iconos y texto) luzca integrado y funcional en modo expansión. Verificar mediante pruebas visuales.
