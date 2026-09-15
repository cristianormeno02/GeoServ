import { NavGroup, NavItem } from '../layout/nav-item.model';

export const MENU_GROUPS: NavGroup[] = [
  {
    name: 'Inicio', icon: 'home', children: [
      { name: 'Mi Dashboard', path: '/dashboard', icon: 'dashboard', roles: ['Administrador', 'Operador'], description: 'Vista general del estado de operaciones y métricas principales' },
      { name: 'Dashboard Operativo', path: '/dashboard/operativo', icon: 'insights', roles: ['Administrador'], description: 'Seguimiento en tiempo real de órdenes de servicio activas' },
      { name: 'Dashboard Financiero', path: '/dashboard/financiero', icon: 'query_stats', roles: ['Administrador'], description: 'Resumen financiero: ingresos, costos y resultados del período' },
      { name: 'Dashboard Cliente', path: '/dashboard/cliente', icon: 'person', roles: ['Administrador', 'Cliente'], description: 'Vista personalizada del estado de servicios para el cliente' }
    ]
  },
  {
    name: 'Operaciones', icon: 'work', children: [
      { name: 'Órdenes de Servicio', path: '/ordenes-servicio', icon: 'build', roles: ['Administrador'], description: 'Gestión completa de órdenes de servicio: creación, seguimiento y cierre' },
      { name: 'Tipos de Servicio', path: '/tipos-servicio', icon: 'miscellaneous_services', roles: ['Administrador'], description: 'Configuración de categorías y tipos de servicio disponibles' },
      { isSeparator: true },
      { name: 'Proyectos', path: '/proyectos', icon: 'folder', roles: ['Administrador'], description: 'Administración de proyectos y su geolocalización en el mapa' }
    ]
  },
  {
    name: 'Contactos', icon: 'contacts', children: [
      { name: 'Clientes', path: '/clientes', icon: 'people', roles: ['Administrador'], description: 'Registro y gestión de clientes de la empresa' },
      { name: 'Tipos de Compañía', path: '/tipos-compania', icon: 'category', roles: ['Administrador'], description: 'Clasificación de tipos de empresa y compañías asociadas' },
      { isSeparator: true },
      { name: 'Proveedores', path: '/proveedores', icon: 'local_shipping', roles: ['Administrador'], description: 'Gestión de proveedores de insumos y servicios externos' },
      { name: 'Responsables', path: '/responsibles', icon: 'badge', roles: ['Administrador'], description: 'Técnicos y responsables asignables a órdenes de servicio' }
    ]
  },
  {
    name: 'Recursos', icon: 'inventory_2', children: [
      { name: 'Inventario', path: '/inventario', icon: 'inventory', roles: ['Administrador'], description: 'Control de stock de materiales e insumos disponibles' },
      { name: 'Activos', path: '/activos', icon: 'precision_manufacturing', roles: ['Administrador'], description: 'Registro de activos físicos de la empresa (equipos, vehículos)' },
      { isSeparator: true },
      { name: 'Insumos', path: '/insumos', icon: 'shopping_cart', roles: ['Administrador'], description: 'Catálogo de insumos y materiales utilizados en los servicios' },
      { name: 'Tipos de Insumo', path: '/tipos-insumo', icon: 'category', roles: ['Administrador'], description: 'Clasificación de tipos de insumo para organizar el catálogo' },
      { name: 'Clases de Insumo', path: '/clases-insumo', icon: 'category', roles: ['Administrador'], description: 'Agrupación de insumos por clase para reportes y búsquedas' },
      { isSeparator: true },
      { name: 'Unidades', path: '/unidades', icon: 'square_foot', roles: ['Administrador'], description: 'Unidades de medida utilizadas en insumos y materiales' }
    ]
  },
  {
    name: 'Finanzas', icon: 'account_balance', children: [
      { name: 'Resumen', path: '/finanzas/resumen', icon: 'attach_money', roles: ['Administrador'], description: 'Resumen financiero consolidado del período seleccionado' },
      { isSeparator: true },
      { name: 'Movimientos', path: '/movimientos', icon: 'swap_horiz', roles: ['Administrador'], description: 'Registro de ingresos y egresos monetarios de la empresa' },
      { name: 'Categorías de Movimiento', path: '/categorias-movimiento', icon: 'category', roles: ['Administrador'], description: 'Clasificación de movimientos financieros por categoría' },
      { name: 'Cheques', path: '/cheques', icon: 'receipt_long', roles: ['Administrador'], description: 'Gestión y seguimiento de cheques emitidos y recibidos' },
      { name: 'Cuentas Bancarias', path: '/cuentas-financieras', icon: 'account_balance_wallet', roles: ['Administrador'], description: 'Administración de cuentas bancarias de la empresa' },
      { name: 'Medios de Pago', path: '/medios-pago', icon: 'payment', roles: ['Administrador'], description: 'Configuración de los medios de pago aceptados y disponibles' },
      { isSeparator: true },
      { name: 'Gastos Fijos', path: '/gastos-fijos', icon: 'event_repeat', roles: ['Administrador'], description: 'Registro y seguimiento de gastos fijos y recurrentes' },
      { name: 'Categorías Gastos Fijos', path: '/categorias-gastos-fijos', icon: 'category', roles: ['Administrador'], description: 'Clasificación de gastos fijos por categoría contable' },
      { isSeparator: true },
      { name: 'Categorías de Costos', path: '/categorias-costos', icon: 'monetization_on', roles: ['Administrador'], description: 'Tipos de costo directo aplicables en órdenes de servicio' }
    ]
  },
  {
    name: 'Administración', icon: 'admin_panel_settings', children: [
      { name: 'Configuración', path: '/configuracion', icon: 'settings', roles: ['Administrador'], description: 'Parámetros generales de la empresa y del sistema' },
      { name: 'Usuarios', path: '/usuarios', icon: 'manage_accounts', roles: ['Administrador'], description: 'Gestión de usuarios: roles, permisos y accesos al sistema' }
    ]
  }
];

/**
 * Busca un NavItem por su ruta (path) en toda la jerarquía de grupos del menú.
 */
export function findNavItemByPath(path: string, groups: NavGroup[] = MENU_GROUPS): NavItem | undefined {
  if (!path) return undefined;
  for (const group of groups) {
    const item = group.children.find(child => !child.isSeparator && child.path === path);
    if (item) return item;
  }
  return undefined;
}
