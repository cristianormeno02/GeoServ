using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoServ.Api.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectGeolocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Latitud",
                table: "Projects",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Longitud",
                table: "Projects",
                type: "numeric",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitud",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Longitud",
                table: "Projects");
        }
    }
}
