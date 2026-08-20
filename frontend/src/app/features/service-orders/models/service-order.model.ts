export interface ServiceOrderListItem {
  id: string;
  orderNumber: string;
  clientName: string;
  projectName?: string;
  statusName: string;
  priority: number;
  createdAt: string;
  estimatedEndDate?: string;
  budgetedAmount: number;
  collectedAmount: number;
}

export interface Currency {
  id: string;
  code: string;
  symbol: string;
  name: string;
}

export interface Responsible {
  id: string;
  name: string;
  position?: string;
  title?: string;
  specialties?: string;
  userId?: string;
  userName?: string;
}

export interface ServiceOrder {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName?: string;
  projectId?: string;
  projectName?: string;
  serviceTypeId: string;
  serviceTypeName?: string;
  statusId: string;
  statusName?: string;
  priorityValue: number;
  priority: string;
  description?: string;
  currencyId: string;
  currencyCode?: string;
  currencySymbol?: string;
  foreignAmount?: number;
  exchangeRateAtBudget?: number;
  exchangeRateAtCollection?: number;
  budgetedAmount: number;
  discount: number;
  totalAmount: number;
  collectedAmount: number;
  requestDate?: string;
  createdAt: string;
  estimatedStartDate?: string;
  estimatedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  collectionDate?: string;
  canceledAt?: string;
  responsibles: Responsible[];
  activities: ServiceOrderActivity[];
  distributions: ServiceOrderDistribution[];
  documents: ServiceOrderDocument[];
}

export interface ServiceOrderActivity {
  id: string;
  shortDetail: string;
  longDetail?: string;
  state: string;
  stateValue: number;
  progressPercentage: number;
}

export interface ServiceOrderDistribution {
  id: string;
  distributionConceptId: string;
  conceptName?: string;
  percentage: number;
  expectedAmount: number;
  actualAmount: number;
}

export interface ServiceOrderDocument {
  id: string;
  fileName: string;
  contentType?: string;
  isVisibleToClient: boolean;
  uploadedAt: string;
  uploadedById?: string;
}

// DTOs for Create/Update
export interface CreateServiceOrderRequest {
  orderNumber: string;
  clientId: string;
  projectId?: string;
  serviceTypeId: string;
  statusId: string;
  priority: number;
  description?: string;
  currencyId: string;
  foreignAmount?: number;
  exchangeRateAtBudget?: number;
  budgetedAmount: number;
  discount: number;
  totalAmount: number;
  requestDate?: string;
  estimatedStartDate?: string;
  estimatedEndDate?: string;
  distributions: { distributionConceptId: string; percentage: number; expectedAmount: number; actualAmount: number }[];
  responsibleIds: string[];
}

export interface UpdateServiceOrderRequest extends CreateServiceOrderRequest {
  exchangeRateAtCollection?: number;
  actualStartDate?: string;
  actualEndDate?: string;
  collectionDate?: string;
}

export interface DistributionDto {
  distributionConceptId: string;
  percentage: number;
  expectedAmount: number;
  actualAmount: number;
}

export interface ResponsibleDto {
  name: string;
  position?: string;
  title?: string;
  specialties?: string;
  userId?: string;
}

export interface DocumentUploadResponse {
  id: string;
  fileName: string;
  filePath: string;
}
