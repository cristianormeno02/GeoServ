using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoServ.Api.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class CreateMonthlyCoverageReportView : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
CREATE OR REPLACE VIEW ""vw_MonthlyCoverageReport"" AS
WITH MonthlyIncome AS (
    SELECT 
        TO_CHAR(""Date"", 'YYYY-MM') AS ""Periodo"",
        COALESCE(SUM(""Amount""), 0) AS ""Ingresos""
    FROM ""AccountingMovements""
    WHERE ""SourceType"" = 'ServiceOrderIncome'
    GROUP BY TO_CHAR(""Date"", 'YYYY-MM')
),
MonthlyFixedCosts AS (
    SELECT 
        TO_CHAR(""Date"", 'YYYY-MM') AS ""Periodo"",
        COALESCE(SUM(""Amount""), 0) AS ""GastosFijos""
    FROM ""AccountingMovements""
    WHERE ""SourceType"" = 'FixedCostPayment'
    GROUP BY TO_CHAR(""Date"", 'YYYY-MM')
),
MonthlyDirectCosts AS (
    SELECT 
        TO_CHAR(""Date"", 'YYYY-MM') AS ""Periodo"",
        COALESCE(SUM(""Amount""), 0) AS ""GastosDirectos""
    FROM ""AccountingMovements""
    WHERE ""SourceType"" = 'DirectCost'
    GROUP BY TO_CHAR(""Date"", 'YYYY-MM')
),
MonthlyHonorarios AS (
    SELECT 
        TO_CHAR(am.""Date"", 'YYYY-MM') AS ""Periodo"",
        COALESCE(SUM(sod.""ExpectedAmount""), 0) AS ""Honorarios""
    FROM ""AccountingMovements"" am
    JOIN ""ServiceOrders"" so ON (am.""SourceType"" = 'ServiceOrderIncome' AND (am.""ServiceOrderId"" = so.""Id"" OR am.""SourceId"" = so.""Id""::text))
    JOIN ""ServiceOrderDistributions"" sod ON so.""Id"" = sod.""ServiceOrderId""
    JOIN ""DistributionConcepts"" dc ON sod.""DistributionConceptId"" = dc.""Id""
    WHERE am.""SourceType"" = 'ServiceOrderIncome'
      AND (dc.""Name"" ILIKE '%Honorario%')
    GROUP BY TO_CHAR(am.""Date"", 'YYYY-MM')
),
AllPeriods AS (
    SELECT ""Periodo"" FROM MonthlyIncome
    UNION
    SELECT ""Periodo"" FROM MonthlyFixedCosts
    UNION
    SELECT ""Periodo"" FROM MonthlyDirectCosts
    UNION
    SELECT ""Periodo"" FROM MonthlyHonorarios
),
MonthlyTotals AS (
    SELECT 
        p.""Periodo"",
        COALESCE(inc.""Ingresos"", 0) AS ""Ingresos"",
        COALESCE(fc.""GastosFijos"", 0) AS ""GastosFijos"",
        COALESCE(dc.""GastosDirectos"", 0) AS ""GastosDirectos"",
        COALESCE(hon.""Honorarios"", 0) AS ""Honorarios"",
        (COALESCE(inc.""Ingresos"", 0) - (COALESCE(fc.""GastosFijos"", 0) + COALESCE(dc.""GastosDirectos"", 0) + COALESCE(hon.""Honorarios"", 0))) AS ""ResultadoMes""
    FROM AllPeriods p
    LEFT JOIN MonthlyIncome inc ON p.""Periodo"" = inc.""Periodo""
    LEFT JOIN MonthlyFixedCosts fc ON p.""Periodo"" = fc.""Periodo""
    LEFT JOIN MonthlyDirectCosts dc ON p.""Periodo"" = dc.""Periodo""
    LEFT JOIN MonthlyHonorarios hon ON p.""Periodo"" = hon.""Periodo""
)
SELECT 
    ""Periodo"",
    ""Ingresos"",
    ""GastosFijos"",
    ""GastosDirectos"",
    ""Honorarios"",
    ""ResultadoMes"",
    SUM(""ResultadoMes"") OVER (ORDER BY ""Periodo"" ROWS UNBOUNDED PRECEDING) AS ""SaldoAcumulado""
FROM MonthlyTotals
ORDER BY ""Periodo"";
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP VIEW IF EXISTS ""vw_MonthlyCoverageReport"";");
        }
    }
}
