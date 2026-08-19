using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GeoServ.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CompanyTypeId",
                table: "Clients",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CompanyTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyTypes", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "CompanyTypes",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { new Guid("d1111111-1111-1111-1111-111111111111"), null, "Proyecto Minero" },
                    { new Guid("d2222222-2222-2222-2222-222222222222"), null, "Consultora Minera" },
                    { new Guid("d3333333-3333-3333-3333-333333333333"), null, "Contratista Minero" },
                    { new Guid("d4444444-4444-4444-4444-444444444444"), null, "Establecimiento Gubernamental" },
                    { new Guid("d5555555-5555-5555-5555-555555555555"), null, "Académico / Universitario" },
                    { new Guid("d6666666-6666-6666-6666-666666666666"), null, "Particular / Inversionista" },
                    { new Guid("d7777777-7777-7777-7777-777777777777"), null, "Otro" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clients_CompanyTypeId",
                table: "Clients",
                column: "CompanyTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_CompanyTypes_CompanyTypeId",
                table: "Clients",
                column: "CompanyTypeId",
                principalTable: "CompanyTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_CompanyTypes_CompanyTypeId",
                table: "Clients");

            migrationBuilder.DropTable(
                name: "CompanyTypes");

            migrationBuilder.DropIndex(
                name: "IX_Clients_CompanyTypeId",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "CompanyTypeId",
                table: "Clients");
        }
    }
}
