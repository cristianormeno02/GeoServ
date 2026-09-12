using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoServ.Api.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddIsSystemDefaultToMovementCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSystemDefault",
                table: "MovementCategories",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a1111111-1111-1111-1111-111111111111"),
                column: "IsSystemDefault",
                value: false);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a2222222-2222-2222-2222-222222222222"),
                column: "IsSystemDefault",
                value: false);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a3333333-3333-3333-3333-333333333333"),
                column: "IsSystemDefault",
                value: true);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a4444444-4444-4444-4444-444444444444"),
                column: "IsSystemDefault",
                value: false);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a5555555-5555-5555-5555-555555555555"),
                column: "IsSystemDefault",
                value: false);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a6666666-6666-6666-6666-666666666666"),
                column: "IsSystemDefault",
                value: false);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a7777777-7777-7777-7777-777777777777"),
                column: "IsSystemDefault",
                value: false);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a8888888-8888-8888-8888-888888888888"),
                column: "IsSystemDefault",
                value: false);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("a9999999-9999-9999-9999-999999999999"),
                column: "IsSystemDefault",
                value: false);

            migrationBuilder.UpdateData(
                table: "MovementCategories",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                column: "IsSystemDefault",
                value: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSystemDefault",
                table: "MovementCategories");
        }
    }
}
