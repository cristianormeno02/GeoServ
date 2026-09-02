using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoServ.Api.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedConfigGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE \"EmpresaConfiguraciones\" SET \"Group\" = 'Ordenes de Servicio' WHERE \"Key\" = 'os_number_format';");
            // Update any existing SMTP configurations just in case
            migrationBuilder.Sql("UPDATE \"EmpresaConfiguraciones\" SET \"Group\" = 'Correo Avisos' WHERE \"Key\" IN ('smtp_host', 'smtp_port', 'smtp_user', 'smtp_password', 'smtp_from');");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revertir a General
            migrationBuilder.Sql("UPDATE \"EmpresaConfiguraciones\" SET \"Group\" = 'General';");
        }
    }
}
