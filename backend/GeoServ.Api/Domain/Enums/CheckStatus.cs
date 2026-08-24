namespace GeoServ.Api.Domain.Enums;

public enum CheckStatus
{
    InPortfolio = 1, // En Cartera (Físicamente en la oficina)
    Deposited = 2,   // Depositado en el banco (esperando acreditación)
    Accredited = 3,  // Acreditado (Plata disponible)
    Rejected = 4     // Rechazado (Fondos insuficientes, defectos)
}
