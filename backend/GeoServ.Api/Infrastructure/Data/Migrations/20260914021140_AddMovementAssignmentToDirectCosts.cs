using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoServ.Api.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMovementAssignmentToDirectCosts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFromMovement",
                table: "DirectCosts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsAssignableViaMovement",
                table: "DirectCostCategories",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFromMovement",
                table: "DirectCosts");

            migrationBuilder.DropColumn(
                name: "IsAssignableViaMovement",
                table: "DirectCostCategories");
        }
    }
}
