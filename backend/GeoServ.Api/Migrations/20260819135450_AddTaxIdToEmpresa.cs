using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoServ.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTaxIdToEmpresa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TaxId",
                table: "Empresas",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TaxId",
                table: "Empresas");
        }
    }
}
