using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoServ.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDirectCostsUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Amount",
                table: "DirectCosts",
                newName: "UnitPrice");

            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "DirectCosts",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "Observations",
                table: "DirectCosts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PaidById",
                table: "DirectCosts",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PaymentMethodId",
                table: "DirectCosts",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ProviderId",
                table: "DirectCosts",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Quantity",
                table: "DirectCosts",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "DirectCosts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "TotalAmount",
                table: "DirectCosts",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "UnitId",
                table: "DirectCosts",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DirectCostCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DirectCostCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PaymentMethods",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentMethods", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Providers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Providers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Units",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Units", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrderObservations_UserId",
                table: "ServiceOrderObservations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DirectCosts_CategoryId",
                table: "DirectCosts",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_DirectCosts_PaidById",
                table: "DirectCosts",
                column: "PaidById");

            migrationBuilder.CreateIndex(
                name: "IX_DirectCosts_PaymentMethodId",
                table: "DirectCosts",
                column: "PaymentMethodId");

            migrationBuilder.CreateIndex(
                name: "IX_DirectCosts_ProviderId",
                table: "DirectCosts",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_DirectCosts_UnitId",
                table: "DirectCosts",
                column: "UnitId");

            migrationBuilder.AddForeignKey(
                name: "FK_DirectCosts_DirectCostCategories_CategoryId",
                table: "DirectCosts",
                column: "CategoryId",
                principalTable: "DirectCostCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DirectCosts_PaymentMethods_PaymentMethodId",
                table: "DirectCosts",
                column: "PaymentMethodId",
                principalTable: "PaymentMethods",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DirectCosts_Providers_ProviderId",
                table: "DirectCosts",
                column: "ProviderId",
                principalTable: "Providers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DirectCosts_Responsibles_PaidById",
                table: "DirectCosts",
                column: "PaidById",
                principalTable: "Responsibles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DirectCosts_Units_UnitId",
                table: "DirectCosts",
                column: "UnitId",
                principalTable: "Units",
                principalColumn: "Id");

            migrationBuilder.Sql("DELETE FROM \"ServiceOrderObservations\" WHERE \"UserId\" NOT IN (SELECT \"Id\" FROM \"Users\");");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceOrderObservations_Users_UserId",
                table: "ServiceOrderObservations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DirectCosts_DirectCostCategories_CategoryId",
                table: "DirectCosts");

            migrationBuilder.DropForeignKey(
                name: "FK_DirectCosts_PaymentMethods_PaymentMethodId",
                table: "DirectCosts");

            migrationBuilder.DropForeignKey(
                name: "FK_DirectCosts_Providers_ProviderId",
                table: "DirectCosts");

            migrationBuilder.DropForeignKey(
                name: "FK_DirectCosts_Responsibles_PaidById",
                table: "DirectCosts");

            migrationBuilder.DropForeignKey(
                name: "FK_DirectCosts_Units_UnitId",
                table: "DirectCosts");

            migrationBuilder.DropForeignKey(
                name: "FK_ServiceOrderObservations_Users_UserId",
                table: "ServiceOrderObservations");

            migrationBuilder.DropTable(
                name: "DirectCostCategories");

            migrationBuilder.DropTable(
                name: "PaymentMethods");

            migrationBuilder.DropTable(
                name: "Providers");

            migrationBuilder.DropTable(
                name: "Units");

            migrationBuilder.DropIndex(
                name: "IX_ServiceOrderObservations_UserId",
                table: "ServiceOrderObservations");

            migrationBuilder.DropIndex(
                name: "IX_DirectCosts_CategoryId",
                table: "DirectCosts");

            migrationBuilder.DropIndex(
                name: "IX_DirectCosts_PaidById",
                table: "DirectCosts");

            migrationBuilder.DropIndex(
                name: "IX_DirectCosts_PaymentMethodId",
                table: "DirectCosts");

            migrationBuilder.DropIndex(
                name: "IX_DirectCosts_ProviderId",
                table: "DirectCosts");

            migrationBuilder.DropIndex(
                name: "IX_DirectCosts_UnitId",
                table: "DirectCosts");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "DirectCosts");

            migrationBuilder.DropColumn(
                name: "Observations",
                table: "DirectCosts");

            migrationBuilder.DropColumn(
                name: "PaidById",
                table: "DirectCosts");

            migrationBuilder.DropColumn(
                name: "PaymentMethodId",
                table: "DirectCosts");

            migrationBuilder.DropColumn(
                name: "ProviderId",
                table: "DirectCosts");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "DirectCosts");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "DirectCosts");

            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "DirectCosts");

            migrationBuilder.DropColumn(
                name: "UnitId",
                table: "DirectCosts");

            migrationBuilder.RenameColumn(
                name: "UnitPrice",
                table: "DirectCosts",
                newName: "Amount");
        }
    }
}
