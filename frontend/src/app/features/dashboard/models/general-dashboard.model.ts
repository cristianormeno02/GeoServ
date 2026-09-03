export interface UserProfileResponse {
  hasResponsible: boolean;
  userName: string;
  responsibleName?: string;
  position?: string;
  title?: string;
  specialties?: string;
}

export interface StatusCount {
  statusName: string;
  count: number;
}

export interface PriorityCount {
  priority: string;
  count: number;
}

export interface GeneralKpisResponse {
  hasResponsible: boolean;
  ordenesActivas?: number;
  ordenesEntregadas?: number;
  ordenesCobradas?: number;
  ordenesCanceladas?: number;
  totalOrdenes?: number;
  progresoPromedio?: number;
  byStatus?: StatusCount[];
  byPriority?: PriorityCount[];
  stagnantOrders?: { value: number; series: number[] };
  deadlineCompliance?: { value: number; series: number[] };
}

export type AlertLevel = 'ok' | 'warning' | 'overdue';

export interface ActiveOrderItem {
  id: string;
  orderNumber: string;
  clientName: string;
  serviceTypeName: string;
  statusName: string;
  priority: string;
  estimatedEndDate?: string;
  progressPercentage: number;
  alertLevel: AlertLevel;
}

export interface PendingActivityItem {
  id: string;
  orderNumber: string;
  shortDetail: string;
  state: string;
  progressPercentage: number;
}

export interface RecentObservationItem {
  id: string;
  orderNumber: string;
  text: string;
  observationType: string;
  createdAt: string;
  authorName: string;
  isOwnObservation: boolean;
}
