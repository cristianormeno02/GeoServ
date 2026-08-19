using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GeoServ.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateServiceOrderDomain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RevenueDistributions");

            migrationBuilder.DropColumn(
                name: "CapitalizationPercentage",
                table: "ServiceOrders");

            migrationBuilder.DropColumn(
                name: "ExpensePercentage",
                table: "ServiceOrders");

            migrationBuilder.DropColumn(
                name: "FeePercentage",
                table: "ServiceOrders");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "ServiceOrders",
                newName: "EstimatedStartDate");

            migrationBuilder.RenameColumn(
                name: "PaidAt",
                table: "ServiceOrders",
                newName: "EstimatedEndDate");

            migrationBuilder.RenameColumn(
                name: "EstimatedDeliveryDate",
                table: "ServiceOrders",
                newName: "CollectionDate");

            migrationBuilder.AddColumn<DateTime>(
                name: "ActualEndDate",
                table: "ServiceOrders",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ActualStartDate",
                table: "ServiceOrders",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CollectedAmount",
                table: "ServiceOrders",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "OrderNumber",
                table: "ServiceOrders",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "ServiceOrders",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "ProjectId",
                table: "ServiceOrders",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DistributionConcepts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DistributionConcepts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Responsibles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceOrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Position = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Specialties = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Responsibles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Responsibles_ServiceOrders_ServiceOrderId",
                        column: x => x.ServiceOrderId,
                        principalTable: "ServiceOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Responsibles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ServiceOrderActivities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceOrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    ShortDetail = table.Column<string>(type: "text", nullable: false),
                    LongDetail = table.Column<string>(type: "text", nullable: true),
                    State = table.Column<int>(type: "integer", nullable: false),
                    ProgressPercentage = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceOrderActivities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceOrderActivities_ServiceOrders_ServiceOrderId",
                        column: x => x.ServiceOrderId,
                        principalTable: "ServiceOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ServiceOrderDocuments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceOrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: false),
                    FilePath = table.Column<string>(type: "text", nullable: false),
                    ContentType = table.Column<string>(type: "text", nullable: true),
                    IsVisibleToClient = table.Column<bool>(type: "boolean", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UploadedById = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceOrderDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceOrderDocuments_ServiceOrders_ServiceOrderId",
                        column: x => x.ServiceOrderId,
                        principalTable: "ServiceOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ServiceOrderDocuments_Users_UploadedById",
                        column: x => x.UploadedById,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ServiceOrderDistributions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceOrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    DistributionConceptId = table.Column<Guid>(type: "uuid", nullable: false),
                    Percentage = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    ExpectedAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    ActualAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceOrderDistributions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceOrderDistributions_DistributionConcepts_Distribution~",
                        column: x => x.DistributionConceptId,
                        principalTable: "DistributionConcepts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ServiceOrderDistributions_ServiceOrders_ServiceOrderId",
                        column: x => x.ServiceOrderId,
                        principalTable: "ServiceOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "DistributionConcepts",
                columns: new[] { "Id", "IsActive", "Name" },
                values: new object[,]
                {
                    { new Guid("e1111111-1111-1111-1111-111111111111"), true, "Amortización Gastos" },
                    { new Guid("e2222222-2222-2222-2222-222222222222"), true, "Capitalización" },
                    { new Guid("e3333333-3333-3333-3333-333333333333"), true, "Honorarios" },
                    { new Guid("e4444444-4444-4444-4444-444444444444"), true, "Utilidad" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrders_OrderNumber",
                table: "ServiceOrders",
                column: "OrderNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrders_ProjectId",
                table: "ServiceOrders",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Responsibles_ServiceOrderId",
                table: "Responsibles",
                column: "ServiceOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Responsibles_UserId",
                table: "Responsibles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrderActivities_ServiceOrderId",
                table: "ServiceOrderActivities",
                column: "ServiceOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrderDistributions_DistributionConceptId",
                table: "ServiceOrderDistributions",
                column: "DistributionConceptId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrderDistributions_ServiceOrderId",
                table: "ServiceOrderDistributions",
                column: "ServiceOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrderDocuments_ServiceOrderId",
                table: "ServiceOrderDocuments",
                column: "ServiceOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrderDocuments_UploadedById",
                table: "ServiceOrderDocuments",
                column: "UploadedById");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceOrders_Projects_ProjectId",
                table: "ServiceOrders",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceOrders_Projects_ProjectId",
                table: "ServiceOrders");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "Responsibles");

            migrationBuilder.DropTable(
                name: "ServiceOrderActivities");

            migrationBuilder.DropTable(
                name: "ServiceOrderDistributions");

            migrationBuilder.DropTable(
                name: "ServiceOrderDocuments");

            migrationBuilder.DropTable(
                name: "DistributionConcepts");

            migrationBuilder.DropIndex(
                name: "IX_ServiceOrders_OrderNumber",
                table: "ServiceOrders");

            migrationBuilder.DropIndex(
                name: "IX_ServiceOrders_ProjectId",
                table: "ServiceOrders");

            migrationBuilder.DropColumn(
                name: "ActualEndDate",
                table: "ServiceOrders");

            migrationBuilder.DropColumn(
                name: "ActualStartDate",
                table: "ServiceOrders");

            migrationBuilder.DropColumn(
                name: "CollectedAmount",
                table: "ServiceOrders");

            migrationBuilder.DropColumn(
                name: "OrderNumber",
                table: "ServiceOrders");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "ServiceOrders");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "ServiceOrders");

            migrationBuilder.RenameColumn(
                name: "EstimatedStartDate",
                table: "ServiceOrders",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "EstimatedEndDate",
                table: "ServiceOrders",
                newName: "PaidAt");

            migrationBuilder.RenameColumn(
                name: "CollectionDate",
                table: "ServiceOrders",
                newName: "EstimatedDeliveryDate");

            migrationBuilder.AddColumn<decimal>(
                name: "CapitalizationPercentage",
                table: "ServiceOrders",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ExpensePercentage",
                table: "ServiceOrders",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "FeePercentage",
                table: "ServiceOrders",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "RevenueDistributions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceOrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    ActualCapitalizationAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    ActualFeePaidAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    CalculatedCapitalizationAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    CalculatedExpenseAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    CalculatedFeeAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    DistributionDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RevenueDistributions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RevenueDistributions_ServiceOrders_ServiceOrderId",
                        column: x => x.ServiceOrderId,
                        principalTable: "ServiceOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RevenueDistributions_ServiceOrderId",
                table: "RevenueDistributions",
                column: "ServiceOrderId",
                unique: true);
        }
    }
}
