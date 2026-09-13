using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoServ.Api.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddLinkedSourceTypeAndFixedCostPayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LinkedSourceType",
                table: "MovementCategories",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FixedCostPaymentId",
                table: "AccountingMovements",
                type: "uuid",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a1111111-1111-1111-1111-111111111111"),
                column: "LinkedSourceType",
                value: "ServiceOrderIncome");

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a2222222-2222-2222-2222-222222222222"),
                column: "LinkedSourceType",
                value: null);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a3333333-3333-3333-3333-333333333333"),
                column: "LinkedSourceType",
                value: null);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a4444444-4444-4444-4444-444444444444"),
                column: "LinkedSourceType",
                value: null);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a5555555-5555-5555-5555-555555555555"),
                column: "LinkedSourceType",
                value: null);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a6666666-6666-6666-6666-666666666666"),
                column: "LinkedSourceType",
                value: "FixedCostPayment");

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a7777777-7777-7777-7777-777777777777"),
                column: "LinkedSourceType",
                value: "DirectCost");

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a8888888-8888-8888-8888-888888888888"),
                column: "LinkedSourceType",
                value: "AssetPurchase");

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a9999999-9999-9999-9999-999999999999"),
                column: "LinkedSourceType",
                value: null);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                column: "LinkedSourceType",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_AccountingMovements_FixedCostPaymentId",
                table: "AccountingMovements",
                column: "FixedCostPaymentId");

            migrationBuilder.AddForeignKey(
                name: "FK_AccountingMovements_FixedCostPayments_FixedCostPaymentId",
                table: "AccountingMovements",
                column: "FixedCostPaymentId",
                principalTable: "FixedCostPayments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AccountingMovements_FixedCostPayments_FixedCostPaymentId",
                table: "AccountingMovements");

            migrationBuilder.DropIndex(
                name: "IX_AccountingMovements_FixedCostPaymentId",
                table: "AccountingMovements");

            migrationBuilder.DropColumn(
                name: "LinkedSourceType",
                table: "MovementCategories");

            migrationBuilder.DropColumn(
                name: "FixedCostPaymentId",
                table: "AccountingMovements");
        }
    }
}
