using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoServ.Api.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTransferGroupToAccountingMovement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TransferGroupId",
                table: "AccountingMovements",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AccountingMovements_TransferGroupId",
                table: "AccountingMovements",
                column: "TransferGroupId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AccountingMovements_TransferGroupId",
                table: "AccountingMovements");

            migrationBuilder.DropColumn(
                name: "TransferGroupId",
                table: "AccountingMovements");
        }
    }
}
