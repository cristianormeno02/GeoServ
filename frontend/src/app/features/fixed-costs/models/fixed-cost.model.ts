export interface FixedCostItem {
  id: string;
  name: string;
  categoryId: string;
  category?: any;
  providerId?: string;
  provider?: any;
  initialAmount: number;
  isRecurring: boolean;
  observation?: string;
  payments?: FixedCostPayment[];
}

export interface FixedCostPayment {
  id: string;
  fixedCostItemId: string;
  dueDate: string;
  amount: number;
  isPaid: boolean;
  paymentDate?: string;
  paymentMethodId?: string;
  paymentMethod?: any;
  receiptNumber?: string;
}

export interface CreateFixedCostItemRequest {
  name: string;
  categoryId: string;
  providerId?: string;
  initialAmount: number;
  isRecurring: boolean;
  observation?: string;
}

export interface CreateFixedCostPaymentRequest {
  fixedCostItemId: string;
  dueDate: string;
  amount: number;
  isPaid: boolean;
  paymentDate?: string;
  paymentMethodId?: string;
  receiptNumber?: string;
}
