export interface AlertActionDto {
  key: string;
  label: string;
  icon: string;
  route?: string;
  requiresConfirmation: boolean;
  enabled: boolean;
}

export interface AlertItemDto {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  state: 'New' | 'Read' | 'Snoozed' | 'Resolved';
  sourceEntityType: string;
  sourceEntityId: string;
  sourceLabel: string;
  dueDate?: Date;
  amount?: number;
  createdAt: Date;
  snoozedUntil?: Date;
  actions: AlertActionDto[];
}

export interface AlertCenterSummaryDto {
  totalActive: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  newCount: number;
  readCount: number;
  snoozedCount: number;
  resolvedCount: number;
  actionableCount: number;
}

export interface AlertCenterResponse {
  items: AlertItemDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  summary: AlertCenterSummaryDto;
}

export interface AlertCenterQuery {
  type?: string;
  priority?: string;
  state?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface UpdateAlertStateRequest {
  state: string;
  snoozedUntil?: Date;
}
