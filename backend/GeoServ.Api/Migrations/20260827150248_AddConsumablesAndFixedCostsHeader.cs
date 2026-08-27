using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoServ.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddConsumablesAndFixedCostsHeader : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UsefulLifeMonths",
                table: "Assets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ConsumableTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConsumableTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FixedCostItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProviderId = table.Column<Guid>(type: "uuid", nullable: true),
                    InitialAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    IsRecurring = table.Column<bool>(type: "boolean", nullable: false),
                    Observation = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FixedCostItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FixedCostItems_FixedCostCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "FixedCostCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FixedCostItems_Providers_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "Providers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ConsumableClasses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ConsumableTypeId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConsumableClasses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConsumableClasses_ConsumableTypes_ConsumableTypeId",
                        column: x => x.ConsumableTypeId,
                        principalTable: "ConsumableTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FixedCostPayments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FixedCostItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    IsPaid = table.Column<bool>(type: "boolean", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PaymentMethodId = table.Column<Guid>(type: "uuid", nullable: true),
                    ReceiptNumber = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FixedCostPayments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FixedCostPayments_FixedCostItems_FixedCostItemId",
                        column: x => x.FixedCostItemId,
                        principalTable: "FixedCostItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FixedCostPayments_PaymentMethods_PaymentMethodId",
                        column: x => x.PaymentMethodId,
                        principalTable: "PaymentMethods",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Consumables",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PurchaseDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ConsumableClassId = table.Column<Guid>(type: "uuid", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Quantity = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    UnitId = table.Column<Guid>(type: "uuid", nullable: false),
                    UnitCost = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    TotalCost = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    ProviderId = table.Column<Guid>(type: "uuid", nullable: true),
                    Observation = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consumables", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Consumables_ConsumableClasses_ConsumableClassId",
                        column: x => x.ConsumableClassId,
                        principalTable: "ConsumableClasses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Consumables_Providers_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "Providers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Consumables_Units_UnitId",
                        column: x => x.UnitId,
                        principalTable: "Units",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConsumableClasses_ConsumableTypeId",
                table: "ConsumableClasses",
                column: "ConsumableTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Consumables_ConsumableClassId",
                table: "Consumables",
                column: "ConsumableClassId");

            migrationBuilder.CreateIndex(
                name: "IX_Consumables_ProviderId",
                table: "Consumables",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_Consumables_UnitId",
                table: "Consumables",
                column: "UnitId");

            migrationBuilder.CreateIndex(
                name: "IX_FixedCostItems_CategoryId",
                table: "FixedCostItems",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_FixedCostItems_ProviderId",
                table: "FixedCostItems",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_FixedCostPayments_FixedCostItemId",
                table: "FixedCostPayments",
                column: "FixedCostItemId");

            migrationBuilder.CreateIndex(
                name: "IX_FixedCostPayments_PaymentMethodId",
                table: "FixedCostPayments",
                column: "PaymentMethodId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Consumables");

            migrationBuilder.DropTable(
                name: "FixedCostPayments");

            migrationBuilder.DropTable(
                name: "ConsumableClasses");

            migrationBuilder.DropTable(
                name: "FixedCostItems");

            migrationBuilder.DropTable(
                name: "ConsumableTypes");

            migrationBuilder.DropColumn(
                name: "UsefulLifeMonths",
                table: "Assets");
        }
    }
}
