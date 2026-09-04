using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoServ.Api.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderIndexToServiceOrderCollections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrderIndex",
                table: "ServiceOrderDistributions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OrderIndex",
                table: "ServiceOrderActivities",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OrderIndex",
                table: "DirectCosts",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderIndex",
                table: "ServiceOrderDistributions");

            migrationBuilder.DropColumn(
                name: "OrderIndex",
                table: "ServiceOrderActivities");

            migrationBuilder.DropColumn(
                name: "OrderIndex",
                table: "DirectCosts");
        }
    }
}
