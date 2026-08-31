using System;

namespace GeoServ.Api.Domain.Entities;

public class MonthlyCoverageReport
{
    public string Periodo { get; set; } = string.Empty; // Formato YYYY-MM
    public decimal Ingresos { get; set; }
    public decimal GastosFijos { get; set; }
    public decimal GastosDirectos { get; set; }
    public decimal Honorarios { get; set; }
    public decimal ResultadoMes { get; set; }
    public decimal SaldoAcumulado { get; set; }
}
