export interface ConsumableType {
  id: string;
  name: string;
}

export interface ConsumableClass {
  id: string;
  name: string;
  consumableTypeId: string;
  consumableType?: ConsumableType;
}

export interface Consumable {
  id: string;
  purchaseDate: string;
  consumableClassId: string;
  consumableClass?: ConsumableClass;
  description: string;
  quantity: number;
  unitId: string;
  unit?: any; // Import Unit model if available
  unitCost: number;
  totalCost: number;
  providerId?: string;
  provider?: any; // Import Provider model if available
  observation?: string;
}

export interface CreateConsumableRequest {
  purchaseDate: string;
  consumableClassId: string;
  description: string;
  quantity: number;
  unitId: string;
  unitCost: number;
  totalCost: number;
  providerId?: string;
  observation?: string;
}
