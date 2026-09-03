## 1. Backend: Control de Acceso y Datos

- [x] 1.1 Actualizar endpoints del Dashboard General: Modificar los servicios subyacentes de `/api/dashboard/general/*` para retornar explícitamente HTTP 403 Forbidden (y lanzar excepción acorde, si aplica) cuando el `userId` no tenga un `Responsible` vinculado. Verificar con pruebas de integración o manuales llamando a la API con un usuario sin responsable asignado y validando que retorna HTTP 403.
- [x] 1.2 Extender DTO y lógica de KPIs: En `/api/dashboard/general/kpis`, calcular y retornar los datos y series temporales (sparklines) requeridos por las nuevas tarjetas de información (ej. Órdenes Estancadas, Cumplimiento de Plazos), aplicando siempre el filtro por `Responsible`. Verificar llamando al endpoint con un usuario válido y comprobando que el payload incluye las nuevas estructuras de datos temporales.

## 2. Frontend: UI y Manejo de Errores

- [x] 2.1 Manejo de HTTP 403 en Dashboard General: Actualizar el componente layout/contenedor del Dashboard General para capturar de forma segura el error 403 y renderizar un componente de estado vacío con el mensaje "Tu perfil no está vinculado a ningún responsable. Contactá al administrador.", evitando renderizar la página en blanco o entrar en ciclos de redirección. Verificar accediendo con un usuario sin perfil asignado.
- [x] 2.2 Reutilizar componentes KPI (Sparklines): Reemplazar o complementar los indicadores numéricos del Dashboard General con los componentes visuales (tarjetas con íconos e información) que fueron creados para el Dashboard Operativo, bindeando sus props con los nuevos datos recibidos del endpoint `kpis`. Verificar visualmente que las tarjetas cargan correctamente y muestran gráficos coherentes para el usuario actual.
