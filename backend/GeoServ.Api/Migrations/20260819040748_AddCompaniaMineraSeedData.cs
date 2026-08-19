using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoServ.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCompaniaMineraSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "CompanyTypes",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[] { new Guid("d8888888-8888-8888-8888-888888888888"), null, "Compañía Minera" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: new Guid("d8888888-8888-8888-8888-888888888888"));
        }
    }
}
