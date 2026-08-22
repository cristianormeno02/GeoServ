# Estandarización y extensión de la paleta de colores del sistema

## 1. Objetivo

Estandarizar la utilización de colores en la aplicación para que exista una única semántica visual para:
* Identidad visual del sistema.
* Navegación.
* Acciones principales.
* Estados de éxito, error, advertencias, e información.
* Fondos, superficies, y textos.
* Validaciones de formularios.

La implementación debe mantener la identidad visual actual basada en **Slate 800** y **Amber 600 (cobre)**, incorporando colores semánticos adicionales para representar estados de la aplicación.
El objetivo no es simplemente agregar colores, sino evitar que un mismo color tenga diferentes significados dentro de la aplicación.

---

# 2. Paleta de colores oficial

La aplicación deberá utilizar como referencia central la siguiente paleta.

## 2.1 Colores principales

### Color primario — Slate 800
`HEX: #1E293B`
`Variable: --color-primary: #1E293B;`

### Color de acento — Amber 600 / Cobre
`HEX: #D97706`
`Variable: --color-accent: #D97706;`

---

# 3. Colores semánticos

## 3.1 Éxito — Emerald 600
`HEX: #059669`
`Variable: --color-success: #059669;`

## 3.2 Error — Red 600
`HEX: #DC2626`
`Variable: --color-error: #DC2626;`

## 3.3 Advertencia — Amber 500
`HEX: #F59E0B`
`Variable: --color-warning: #F59E0B;`

## 3.4 Información — Blue 600
`HEX: #2563EB`
`Variable: --color-info: #2563EB;`

---

# 4. Fondos y superficies

## 4.1 Fondo general
`HEX: #F8FAFC`
`Variable: --color-background: #F8FAFC;`

## 4.2 Superficie
`HEX: #FFFFFF`
`Variable: --color-surface: #FFFFFF;`

---

# 5. Colores de texto

## 5.1 Texto sobre fondos oscuros
`HEX: #FFFFFF`
`Variable: --text-primary: #FFFFFF;`

## 5.2 Texto sobre superficies claras
`HEX: #1E293B`
`Variable: --text-secondary: #1E293B;`

---

# 6. Bordes y divisores
`HEX: #E2E8F0`
`Variable: --border-color: #E2E8F0;`

---

# 7. Variables CSS oficiales

```css
:root {
  /* Identidad */
  --color-primary: #1E293B;
  --color-accent: #D97706;

  /* Estados */
  --color-success: #059669;
  --color-error: #DC2626;
  --color-warning: #F59E0B;
  --color-info: #2563EB;

  /* Superficies */
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;

  /* Texto */
  --text-primary: #FFFFFF;
  --text-secondary: #1E293B;

  /* Bordes */
  --border-color: #E2E8F0;
}
```

---

# 8. Reglas de uso de la paleta
| Color     | Significado            | Uso                                  |
| --------- | ---------------------- | ------------------------------------ |
| `#1E293B` | Estructura / identidad | Navbar, sidebar, títulos             |
| `#D97706` | Acción / negocio       | CTA, botones principales, destacados |
| `#059669` | Éxito                  | Pagado, cobrado, aprobado, completo  |
| `#DC2626` | Error / pendiente      | Errores, obligatorios pendientes     |
| `#F59E0B` | Advertencia            | Atención requerida                   |
| `#2563EB` | Información            | Ayudas, información contextual       |
| `#F8FAFC` | Fondo                  | Fondo general                        |
| `#FFFFFF` | Superficie             | Cards, formularios, paneles          |
| `#E2E8F0` | Borde                  | Inputs, cards, divisores             |

---

# 9. Integración con Angular Material
Mantener `#D97706` como primary visual de acciones Material, pero `#1E293B` como identidad estructural de la app.

---

# 10. Uso del color Emerald 600 en la interfaz
Cobrado, Pagado, Aprobado, Completado, Procesado → Emerald 600.
Indicador de secciones completas en formularios.

---

# 11. Aplicación en formularios extensos
Secciones colapsables con estados:
- Campos pendientes: Indicador rojo (`#DC2626`)
- Sección completa: Indicador verde (`#059669`)

---

# 12. Botones
- Principal: `#D97706`
- Secundaria: `#1E293B` o `#FFFFFF`
- Destructiva: `#DC2626`

---

# 13. Badges y estados
Usar colores semánticos.

---

# 14. Accesibilidad y contraste
Mantener alto contraste, especialmente `Slate 800 + White` y `Amber 600 + White`.

---

# 15. Restricciones de implementación
No modificar la lógica de negocio, no modificar APIs, no alterar procesos funcionales. Enfoque exclusivo en estilos.

---

# 16. Criterios de aceptación
- [ ] Slate 800 como estructural, Amber 600 como acento.
- [ ] Emerald 600 para éxito, Red 600 para error, Amber 500 para warning, Blue 600 para info.
- [ ] Background `#F8FAFC`, Surface `#FFFFFF`, Border `#E2E8F0`.
- [ ] Variables CSS globalizadas.
- [ ] Formularios extensos con indicadores visuales semánticos (verde/rojo).
- [ ] No alterar comportamiento funcional.

---

# 17. Resumen de diseño
**Slate estructura, Cobre acciona, Verde confirma, Rojo alerta, Amarillo advierte y Azul informa.**
