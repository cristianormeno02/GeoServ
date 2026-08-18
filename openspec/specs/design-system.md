# Diseño y Frontend - GeoServ

Este documento define los lineamientos de UI/UX, el sistema de diseño responsivo y el soporte para branding multi-empresa (SaaS) aplicados en GeoServ.

## 1. Paleta de Colores ("Geo Modern")
El sistema utiliza una paleta moderna, profesional y orientada al negocio minero e industrial.

- **Color Primario (Slate 800 / Azul Pizarra):** `#1E293B`
  - *Uso:* Barras de navegación, textos principales, headers y elementos estructurales clave.
- **Color Secundario / Acento (Cobre / Amber 600):** `#D97706`
  - *Uso:* Llamadas a la acción (CTAs), botones principales, y destaques relacionados al entorno minero/industrial.
- **Color de Éxito (Emerald 600):** `#059669`
  - *Uso:* Estados de cobro, finanzas, confirmaciones y notificaciones de éxito.
- **Fondos (Slate 50):** `#F8FAFC`
  - *Uso:* Fondos generales de la aplicación, garantizando un aspecto limpio y claro que permite respirar al contenido.

## 2. Diseño Responsive Obligatorio
Todos los componentes de la aplicación deben ser construidos pensando en Mobile-First o asegurando una adaptabilidad completa (Fluid/Responsive).

- **Grid y Flexbox:** Uso intensivo de CSS Grid y Flexbox para organizar el contenido dinámicamente.
- **Angular Material:** Emplear y personalizar los componentes adaptativos de Angular Material para que se ajusten al ancho de pantalla.
- **Vistas Clave:** 
  - Login (Estructura adaptable o de columnas divididas en Desktop, apiladas en Mobile).
  - Dashboard.
  - Tablas de Órdenes de Servicio (Scroll horizontal o vistas tipo tarjeta en dispositivos pequeños).
  - Formularios de Finanzas.

## 3. Branding Dinámico (SaaS / Multi-empresa)
Dado que GeoServ es un sistema SaaS, la interfaz debe poder adaptarse a la marca de cada cliente.

- **Componentes Clave Preparados:**
  - *Pantalla de Login*
  - *Barra Superior / Header (Navigation)*
- **Capacidades Dinámicas:**
  - **Logo SVG:** Inyección de logo vectorial o URL dinámica provista por el backend.
  - **Nombre de la Empresa:** El nombre del cliente debe renderizarse en el encabezado del login y en la barra superior.
- **Implementación Técnica:**
  - El branding debe estar disponible a través del estado global de la aplicación o un `ConfigService` / `TenantService` que se alimente al iniciar la sesión o mediante un subdominio/identificador de inquilino.
