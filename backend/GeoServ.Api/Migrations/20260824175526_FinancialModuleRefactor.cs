using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoServ.Api.Migrations
{
    /// <inheritdoc />
    public partial class FinancialModuleRefactor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AccountingMovements_ServiceOrders_ServiceOrderId",
                table: "AccountingMovements");

            migrationBuilder.AddColumn<Guid>(
                name: "AssetId",
                table: "AccountingMovements",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Category",
                table: "AccountingMovements",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "CheckId",
                table: "AccountingMovements",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DirectCostId",
                table: "AccountingMovements",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FinancialAccountId",
                table: "AccountingMovements",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "FixedCostId",
                table: "AccountingMovements",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PaymentMethodId",
                table: "AccountingMovements",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ResponsibleId",
                table: "AccountingMovements",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Assets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    PurchasePrice = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    PurchaseDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ProviderId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Assets_Providers_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "Providers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Checks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CheckNumber = table.Column<string>(type: "text", nullable: false),
                    BankName = table.Column<string>(type: "text", nullable: false),
                    IssuerName = table.Column<string>(type: "text", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    IssueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ReceivedFromClientId = table.Column<Guid>(type: "uuid", nullable: true),
                    Observations = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Checks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Checks_Clients_ReceivedFromClientId",
                        column: x => x.ReceivedFromClientId,
                        principalTable: "Clients",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FinancialAccounts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    AccountNumber = table.Column<string>(type: "text", nullable: false),
                    AccountType = table.Column<string>(type: "text", nullable: false),
                    CurrencyId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FinancialAccounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FinancialAccounts_Currencies_CurrencyId",
                        column: x => x.CurrencyId,
                        principalTable: "Currencies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AccountingMovements_AssetId",
                table: "AccountingMovements",
                column: "AssetId");

            migrationBuilder.CreateIndex(
                name: "IX_AccountingMovements_CheckId",
                table: "AccountingMovements",
                column: "CheckId");

            migrationBuilder.CreateIndex(
                name: "IX_AccountingMovements_DirectCostId",
                table: "AccountingMovements",
                column: "DirectCostId");

            migrationBuilder.CreateIndex(
                name: "IX_AccountingMovements_FinancialAccountId",
                table: "AccountingMovements",
                column: "FinancialAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_AccountingMovements_FixedCostId",
                table: "AccountingMovements",
                column: "FixedCostId");

            migrationBuilder.CreateIndex(
                name: "IX_AccountingMovements_PaymentMethodId",
                table: "AccountingMovements",
                column: "PaymentMethodId");

            migrationBuilder.CreateIndex(
                name: "IX_AccountingMovements_ResponsibleId",
                table: "AccountingMovements",
                column: "ResponsibleId");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_ProviderId",
                table: "Assets",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_Checks_ReceivedFromClientId",
                table: "Checks",
                column: "ReceivedFromClientId");

            migrationBuilder.CreateIndex(
                name: "IX_FinancialAccounts_CurrencyId",
                table: "FinancialAccounts",
                column: "CurrencyId");

            migrationBuilder.AddForeignKey(
                name: "FK_AccountingMovements_Assets_AssetId",
                table: "AccountingMovements",
                column: "AssetId",
                principalTable: "Assets",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AccountingMovements_Checks_CheckId",
                table: "AccountingMovements",
                column: "CheckId",
                principalTable: "Checks",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AccountingMovements_DirectCosts_DirectCostId",
                table: "AccountingMovements",
                column: "DirectCostId",
                principalTable: "DirectCosts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AccountingMovements_FinancialAccounts_FinancialAccountId",
                table: "AccountingMovements",
                column: "FinancialAccountId",
                principalTable: "FinancialAccounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AccountingMovements_FixedCosts_FixedCostId",
                table: "AccountingMovements",
                column: "FixedCostId",
                principalTable: "FixedCosts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AccountingMovements_PaymentMethods_PaymentMethodId",
                table: "AccountingMovements",
                column: "PaymentMethodId",
                principalTable: "PaymentMethods",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AccountingMovements_Responsibles_ResponsibleId",
                table: "AccountingMovements",
                column: "ResponsibleId",
                principalTable: "Responsibles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AccountingMovements_ServiceOrders_ServiceOrderId",
                table: "AccountingMovements",
                column: "ServiceOrderId",
                principalTable: "ServiceOrders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AccountingMovements_Assets_AssetId",
                table: "AccountingMovements");

            migrationBuilder.DropForeignKey(
                name: "FK_AccountingMovements_Checks_CheckId",
                table: "AccountingMovements");

            migrationBuilder.DropForeignKey(
                name: "FK_AccountingMovements_DirectCosts_DirectCostId",
                table: "AccountingMovements");

            migrationBuilder.DropForeignKey(
                name: "FK_AccountingMovements_FinancialAccounts_FinancialAccountId",
                table: "AccountingMovements");

            migrationBuilder.DropForeignKey(
                name: "FK_AccountingMovements_FixedCosts_FixedCostId",
                table: "AccountingMovements");

            migrationBuilder.DropForeignKey(
                name: "FK_AccountingMovements_PaymentMethods_PaymentMethodId",
                table: "AccountingMovements");

            migrationBuilder.DropForeignKey(
                name: "FK_AccountingMovements_Responsibles_ResponsibleId",
                table: "AccountingMovements");

            migrationBuilder.DropForeignKey(
                name: "FK_AccountingMovements_ServiceOrders_ServiceOrderId",
                table: "AccountingMovements");

            migrationBuilder.DropTable(
                name: "Assets");

            migrationBuilder.DropTable(
                name: "Checks");

            migrationBuilder.DropTable(
                name: "FinancialAccounts");

            migrationBuilder.DropIndex(
                name: "IX_AccountingMovements_AssetId",
                table: "AccountingMovements");

            migrationBuilder.DropIndex(
                name: "IX_AccountingMovements_CheckId",
                table: "AccountingMovements");

            migrationBuilder.DropIndex(
                name: "IX_AccountingMovements_DirectCostId",
                table: "AccountingMovements");

            migrationBuilder.DropIndex(
                name: "IX_AccountingMovements_FinancialAccountId",
                table: "AccountingMovements");

            migrationBuilder.DropIndex(
                name: "IX_AccountingMovements_FixedCostId",
                table: "AccountingMovements");

            migrationBuilder.DropIndex(
                name: "IX_AccountingMovements_PaymentMethodId",
                table: "AccountingMovements");

            migrationBuilder.DropIndex(
                name: "IX_AccountingMovements_ResponsibleId",
                table: "AccountingMovements");

            migrationBuilder.DropColumn(
                name: "AssetId",
                table: "AccountingMovements");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "AccountingMovements");

            migrationBuilder.DropColumn(
                name: "CheckId",
                table: "AccountingMovements");

            migrationBuilder.DropColumn(
                name: "DirectCostId",
                table: "AccountingMovements");

            migrationBuilder.DropColumn(
                name: "FinancialAccountId",
                table: "AccountingMovements");

            migrationBuilder.DropColumn(
                name: "FixedCostId",
                table: "AccountingMovements");

            migrationBuilder.DropColumn(
                name: "PaymentMethodId",
                table: "AccountingMovements");

            migrationBuilder.DropColumn(
                name: "ResponsibleId",
                table: "AccountingMovements");

            migrationBuilder.AddForeignKey(
                name: "FK_AccountingMovements_ServiceOrders_ServiceOrderId",
                table: "AccountingMovements",
                column: "ServiceOrderId",
                principalTable: "ServiceOrders",
                principalColumn: "Id");
        }
    }
}
