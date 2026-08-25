using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GeoServ.Api.Migrations
{
    /// <inheritdoc />
    public partial class MoveCategoryToEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "AccountingMovements");

            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "AccountingMovements",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "MovementCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    IsIncome = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovementCategories", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "MovementCategories",
                columns: new[] { "Id", "Description", "IsActive", "IsIncome", "Name" },
                values: new object[,]
                {
                    { new Guid("a1111111-1111-1111-1111-111111111111"), "Ingreso por trabajos realizados", true, true, "Cobro de Orden de Servicio" },
                    { new Guid("a2222222-2222-2222-2222-222222222222"), "Ingreso de fondos por cheque", true, true, "Acreditación de Cheque" },
                    { new Guid("a3333333-3333-3333-3333-333333333333"), "Entrada de fondos desde otra cuenta propia", true, true, "Transferencia Interna (Ingreso)" },
                    { new Guid("a4444444-4444-4444-4444-444444444444"), "Ingreso por aportes de capital", true, true, "Aporte de Socios / Capital" },
                    { new Guid("a5555555-5555-5555-5555-555555555555"), "Ingreso por subsidios", true, true, "Subsidio / Aporte Estatal" },
                    { new Guid("a6666666-6666-6666-6666-666666666666"), "Luz, internet, alquiler", true, false, "Pago de Gasto Fijo" },
                    { new Guid("a7777777-7777-7777-7777-777777777777"), "Insumos para obras", true, false, "Pago de Costo Directo" },
                    { new Guid("a8888888-8888-8888-8888-888888888888"), "Equipamiento, rodados", true, false, "Compra de Activo" },
                    { new Guid("a9999999-9999-9999-9999-999999999999"), "Honorarios de socios o terceros", true, false, "Pago de Honorarios" },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "Salida de fondos hacia otra cuenta propia", true, false, "Transferencia Interna (Egreso)" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AccountingMovements_CategoryId",
                table: "AccountingMovements",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_AccountingMovements_MovementCategories_CategoryId",
                table: "AccountingMovements",
                column: "CategoryId",
                principalTable: "MovementCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AccountingMovements_MovementCategories_CategoryId",
                table: "AccountingMovements");

            migrationBuilder.DropTable(
                name: "MovementCategories");

            migrationBuilder.DropIndex(
                name: "IX_AccountingMovements_CategoryId",
                table: "AccountingMovements");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "AccountingMovements");

            migrationBuilder.AddColumn<int>(
                name: "Category",
                table: "AccountingMovements",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
