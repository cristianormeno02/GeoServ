namespace GeoServ.Api.Domain.Enums;

public enum MovementCategory
{
    ServiceOrderCollection = 1, // Cobro de Orden de Servicio
    FixedCostPayment = 2,       // Pago de Gasto Fijo (Luz, Alquiler)
    DirectCostPayment = 3,      // Pago de Costo Directo / Insumo
    AssetPurchase = 4,          // Compra de Activo / Equipamiento
    FeePayment = 5,             // Pago de Honorarios a Socios/Responsables
    CheckDeposit = 6,           // Depósito de un Cheque
    CheckAccreditation = 7,     // Acreditación (Clearance) de Cheque
    CheckRejection = 8,         // Rechazo de Cheque
    InternalTransfer = 9        // Transferencia entre cuentas propias
}
