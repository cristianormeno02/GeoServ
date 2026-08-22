export interface DirectCost {
  id: string;
  serviceOrderId: string;
  categoryId: string;
  categoryName?: string;
  providerId?: string;
  providerName?: string;
  description: string;
  quantity: number;
  unitId?: string;
  unitName?: string;
  unitPrice: number;
  totalAmount: number;
  date: string;
  paidById?: string;
  paidByName?: string;
  paymentMethodId?: string;
  paymentMethodName?: string;
  status: string;
  observations?: string;
}

export interface CreateDirectCostDto {
  serviceOrderId: string;
  categoryId: string;
  providerId?: string;
  description: string;
  quantity: number;
  unitId?: string;
  unitPrice: number;
  totalAmount: number;
  date: string;
  paidById?: string;
  paymentMethodId?: string;
  status: string;
  observations?: string;
}
