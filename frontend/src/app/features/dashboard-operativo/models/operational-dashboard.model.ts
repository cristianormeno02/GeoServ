export interface KpiMetric {
  value: number;
  trend: number[];
}

export interface OperationalKpisResponse {
  activeOrders: KpiMetric;
  stagnantOrders: KpiMetric;
  uncollectedOrders: KpiMetric;
  lowStockItems: KpiMetric;
}

export interface TeamCapacityResponse {
  activeOrders: number;
  maxCapacity: number;
  capacityPercentage: number;
  semanticStatus: string;
}

export interface DeadlineComplianceResponse {
  compliancePercentage: number;
  totalActive: number;
  onTimeCount: number;
  delayedCount: number;
}

export interface OrderByServiceType {
  serviceTypeId: string;
  serviceTypeName: string;
  count: number;
  percentage: number;
}

export interface WorkloadByResponsible {
  responsibleId?: string;
  responsibleName: string;
  activeOrdersCount: number;
}

export interface StagnantOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  serviceTypeName: string;
  statusName: string;
  daysInStatus: number;
  lastUpdate: string;
}

export interface StagnantOrdersResponse {
  items: StagnantOrder[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface AgingBucketItem {
  range: string;
  count: number;
  totalPendingAmount: number;
}

export interface UncollectedOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  serviceTypeName: string;
  deliveryDate: string;
  daysSinceDelivery: number;
  totalAmount: number;
  collectedAmount: number;
  pendingAmount: number;
}

export interface AgingUncollectedOrdersResponse {
  buckets: AgingBucketItem[];
  totalPendingAmount: number;
  totalCount: number;
  items: UncollectedOrder[];
  page: number;
  pageSize: number;
}

export interface CriticalConsumable {
  consumableId: string;
  description: string;
  unitName: string;
  minimumStock: number;
  currentStock: number;
  deficit: number;
}

export interface NegativeAdjustment {
  reason: string;
  quantity: number;
  count: number;
}

export interface InventoryAlertsResponse {
  criticalConsumables: CriticalConsumable[];
  negativeAdjustmentsByReason: NegativeAdjustment[];
}

export interface UpcomingFixedCost {
  id: string;
  fixedCostItemId: string;
  itemName: string;
  categoryName: string;
  amount: number;
  dueDate: string;
  daysRemaining: number;
}
