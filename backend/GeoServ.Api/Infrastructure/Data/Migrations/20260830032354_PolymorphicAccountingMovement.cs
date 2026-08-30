using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoServ.Api.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class PolymorphicAccountingMovement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SourceId",
                table: "AccountingMovements",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SourceType",
                table: "AccountingMovements",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_AccountingMovements_SourceType_SourceId",
                table: "AccountingMovements",
                columns: new[] { "SourceType", "SourceId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AccountingMovements_SourceType_SourceId",
                table: "AccountingMovements");

            migrationBuilder.DropColumn(
                name: "SourceId",
                table: "AccountingMovements");

            migrationBuilder.DropColumn(
                name: "SourceType",
                table: "AccountingMovements");
        }
    }
}

