using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GeoServ.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateServiceOrderAndResponsible2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Responsibles_ServiceOrders_ServiceOrderId",
                table: "Responsibles");

            migrationBuilder.DropIndex(
                name: "IX_Responsibles_ServiceOrderId",
                table: "Responsibles");

            migrationBuilder.DropIndex(
                name: "IX_Responsibles_UserId",
                table: "Responsibles");

            migrationBuilder.DropColumn(
                name: "ServiceOrderId",
                table: "Responsibles");

            migrationBuilder.AddColumn<Guid>(
                name: "CurrencyId",
                table: "ServiceOrders",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<decimal>(
                name: "ExchangeRateAtBudget",
                table: "ServiceOrders",
                type: "numeric(18,4)",
                precision: 18,
                scale: 4,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ExchangeRateAtCollection",
                table: "ServiceOrders",
                type: "numeric(18,4)",
                precision: 18,
                scale: 4,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ForeignAmount",
                table: "ServiceOrders",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RequestDate",
                table: "ServiceOrders",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Currencies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Symbol = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Currencies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServiceOrderResponsibles",
                columns: table => new
                {
                    ServiceOrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    ResponsibleId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceOrderResponsibles", x => new { x.ServiceOrderId, x.ResponsibleId });
                    table.ForeignKey(
                        name: "FK_ServiceOrderResponsibles_Responsibles_ResponsibleId",
                        column: x => x.ResponsibleId,
                        principalTable: "Responsibles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ServiceOrderResponsibles_ServiceOrders_ServiceOrderId",
                        column: x => x.ServiceOrderId,
                        principalTable: "ServiceOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Currencies",
                columns: new[] { "Id", "Code", "IsActive", "Name", "Symbol" },
                values: new object[,]
                {
                    { new Guid("f1111111-1111-1111-1111-111111111111"), "ARS", true, "Peso Argentino", "$" },
                    { new Guid("f2222222-2222-2222-2222-222222222222"), "USD", true, "Dólar Estadounidense", "U$D" },
                    { new Guid("f3333333-3333-3333-3333-333333333333"), "CLP", true, "Peso Chileno", "$" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrders_CurrencyId",
                table: "ServiceOrders",
                column: "CurrencyId");

            migrationBuilder.CreateIndex(
                name: "IX_Responsibles_UserId",
                table: "Responsibles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrderResponsibles_ResponsibleId",
                table: "ServiceOrderResponsibles",
                column: "ResponsibleId");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceOrders_Currencies_CurrencyId",
                table: "ServiceOrders",
                column: "CurrencyId",
                principalTable: "Currencies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceOrders_Currencies_CurrencyId",
                table: "ServiceOrders");

            migrationBuilder.DropTable(
                name: "Currencies");

            migrationBuilder.DropTable(
                name: "ServiceOrderResponsibles");

            migrationBuilder.DropIndex(
                name: "IX_ServiceOrders_CurrencyId",
                table: "ServiceOrders");

            migrationBuilder.DropIndex(
                name: "IX_Responsibles_UserId",
                table: "Responsibles");

            migrationBuilder.DropColumn(
                name: "CurrencyId",
                table: "ServiceOrders");

            migrationBuilder.DropColumn(
                name: "ExchangeRateAtBudget",
                table: "ServiceOrders");

            migrationBuilder.DropColumn(
                name: "ExchangeRateAtCollection",
                table: "ServiceOrders");

            migrationBuilder.DropColumn(
                name: "ForeignAmount",
                table: "ServiceOrders");

            migrationBuilder.DropColumn(
                name: "RequestDate",
                table: "ServiceOrders");

            migrationBuilder.AddColumn<Guid>(
                name: "ServiceOrderId",
                table: "Responsibles",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Responsibles_ServiceOrderId",
                table: "Responsibles",
                column: "ServiceOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Responsibles_UserId",
                table: "Responsibles",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Responsibles_ServiceOrders_ServiceOrderId",
                table: "Responsibles",
                column: "ServiceOrderId",
                principalTable: "ServiceOrders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
