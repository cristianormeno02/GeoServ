using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoServ.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserMenuFavorites : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserMenuFavorites",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    MenuPath = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserMenuFavorites", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserMenuFavorites_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserMenuFavorites_UserId_MenuPath",
                table: "UserMenuFavorites",
                columns: new[] { "UserId", "MenuPath" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserMenuFavorites");
        }
    }
}
