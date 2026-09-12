/**
 * Representa un ítem de navegación del menú lateral.
 * Un ítem puede ser un enlace de navegación o un separador visual.
 */
export interface NavItem {
  /** Nombre visible del ítem en el menú */
  name?: string;
  /** Ruta de navegación del ítem */
  path?: string;
  /** Nombre del ícono de Material Icons */
  icon?: string;
  /** Roles que tienen acceso a este ítem */
  roles?: string[];
  /**
   * Descripción breve del ítem (máximo 100 caracteres).
   * Se muestra como tooltip al pasar el mouse sobre el ítem.
   */
  description?: string;
  /** Si es true, este ítem se renderiza como un separador visual (mat-divider) */
  isSeparator?: boolean;
}

/**
 * Representa un grupo del menú lateral, que contiene varios NavItem como hijos.
 */
export interface NavGroup {
  /** Nombre visible del grupo */
  name: string;
  /** Ícono del grupo */
  icon: string;
  /** Ítems hijos del grupo */
  children: NavItem[];
}
