import type { ServiceOrderListItem } from '../../models/service-order.model';

export interface OrderDateInfo {
  date: string;
  tooltip: string;
  icon: string;
  cssClass: string;
  type: 'actual' | 'estimated' | 'created';
}

/**
 * Resuelve dinámicamente la fecha a mostrar para una orden de servicio según la precedencia:
 * 1. Fecha de entrega real (actualEndDate)
 * 2. Fecha presupuestada de entrega (estimatedEndDate)
 * 3. Fecha de alta (createdAt)
 */
export function getOrderDateInfo(row: Partial<ServiceOrderListItem>): OrderDateInfo {
  if (row.actualEndDate && typeof row.actualEndDate === 'string' && row.actualEndDate.trim() !== '') {
    return {
      date: row.actualEndDate,
      tooltip: 'Fecha de entrega real',
      icon: 'check_circle',
      cssClass: 'date-icon-actual',
      type: 'actual'
    };
  }

  if (row.estimatedEndDate && typeof row.estimatedEndDate === 'string' && row.estimatedEndDate.trim() !== '') {
    return {
      date: row.estimatedEndDate,
      tooltip: 'Fecha presupuestada de entrega',
      icon: 'schedule',
      cssClass: 'date-icon-estimated',
      type: 'estimated'
    };
  }

  return {
    date: row.createdAt || '',
    tooltip: 'Fecha de alta',
    icon: 'calendar_today',
    cssClass: 'date-icon-created',
    type: 'created'
  };
}

/**
 * Retorna el valor en milisegundos de la fecha resuelta dinámicamente para ordenamiento (sort).
 */
export function getOrderDateTimestamp(row: Partial<ServiceOrderListItem>): number {
  const dateInfo = getOrderDateInfo(row);
  if (!dateInfo.date) return 0;
  const time = new Date(dateInfo.date).getTime();
  return isNaN(time) ? 0 : time;
}
