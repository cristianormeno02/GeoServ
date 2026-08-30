export enum InventoryMovementType {
  Compra = 'Compra',
  UsoEnOS = 'UsoEnOS',
  AjustePositivo = 'AjustePositivo',
  AjusteNegativo = 'AjusteNegativo',
  ConsumoInterno = 'ConsumoInterno'
}

export interface InventoryMovement {
  id?: string;
  consumableId: string;
  cantidad: number;
  movementType: InventoryMovementType;
  serviceOrderId?: string;
  motivo?: string;
  fecha: string;
  userId?: string;
}
