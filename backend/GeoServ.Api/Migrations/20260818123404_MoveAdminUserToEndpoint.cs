using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GeoServ.Api.Migrations
{
    /// <inheritdoc />
    public partial class MoveAdminUserToEndpoint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "FixedCostCategories",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { new Guid("c1111111-1111-1111-1111-111111111111"), "Pagos de alquiler de oficina o locales", "Alquileres" },
                    { new Guid("c2222222-2222-2222-2222-222222222222"), "Nómina de empleados fijos", "Sueldos y Cargas Sociales" },
                    { new Guid("c3333333-3333-3333-3333-333333333333"), "Luz, agua, internet, telefonía", "Servicios Básicos" },
                    { new Guid("c4444444-4444-4444-4444-444444444444"), "Suscripciones, licencias, hosting", "Software e IT" },
                    { new Guid("c5555555-5555-5555-5555-555555555555"), "Tasas municipales, seguros de responsabilidad, etc.", "Impuestos y Seguros" },
                    { new Guid("c6666666-6666-6666-6666-666666666666"), "Contadores, abogados (fijos)", "Honorarios Profesionales" }
                });

            migrationBuilder.InsertData(
                table: "ServiceOrderStatuses",
                columns: new[] { "Id", "Description", "Name", "OrderIndex" },
                values: new object[,]
                {
                    { new Guid("a1111111-1111-1111-1111-111111111111"), "Orden recién registrada", "Alta", 1 },
                    { new Guid("a2222222-2222-2222-2222-222222222222"), "Presupuesto enviado al cliente", "Presupuestada", 2 },
                    { new Guid("a3333333-3333-3333-3333-333333333333"), "Presupuesto aprobado por el cliente", "Aprobada", 3 },
                    { new Guid("a4444444-4444-4444-4444-444444444444"), "Trabajo en ejecución", "Iniciada", 4 },
                    { new Guid("a5555555-5555-5555-5555-555555555555"), "Trabajo entregado al cliente", "Entregada", 5 },
                    { new Guid("a6666666-6666-6666-6666-666666666666"), "Orden pagada en su totalidad", "Cobrada", 6 },
                    { new Guid("a7777777-7777-7777-7777-777777777777"), "Orden anulada o cancelada", "Cancelada", 7 }
                });

            migrationBuilder.InsertData(
                table: "ServiceTypes",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { new Guid("b1111111-1111-1111-1111-111111111111"), "Medición y representación gráfica del terreno", "Levantamiento Topográfico" },
                    { new Guid("b2222222-2222-2222-2222-222222222222"), "Determinación de límites de propiedad", "Mensura" },
                    { new Guid("b3333333-3333-3333-3333-333333333333"), "Posicionamiento de alta precisión", "Estudio Geodésico" },
                    { new Guid("b4444444-4444-4444-4444-444444444444"), "Levantamiento mediante drones o imágenes satelitales", "Fotogrametría" },
                    { new Guid("b5555555-5555-5555-5555-555555555555"), "Asesoramiento en proyectos de ingeniería", "Consultoría Técnica" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "FixedCostCategories",
                keyColumn: "Id",
                keyValue: new Guid("c1111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "FixedCostCategories",
                keyColumn: "Id",
                keyValue: new Guid("c2222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "FixedCostCategories",
                keyColumn: "Id",
                keyValue: new Guid("c3333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "FixedCostCategories",
                keyColumn: "Id",
                keyValue: new Guid("c4444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "FixedCostCategories",
                keyColumn: "Id",
                keyValue: new Guid("c5555555-5555-5555-5555-555555555555"));

            migrationBuilder.DeleteData(
                table: "FixedCostCategories",
                keyColumn: "Id",
                keyValue: new Guid("c6666666-6666-6666-6666-666666666666"));

            migrationBuilder.DeleteData(
                table: "ServiceOrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("a1111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "ServiceOrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("a2222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "ServiceOrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("a3333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "ServiceOrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("a4444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "ServiceOrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("a5555555-5555-5555-5555-555555555555"));

            migrationBuilder.DeleteData(
                table: "ServiceOrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("a6666666-6666-6666-6666-666666666666"));

            migrationBuilder.DeleteData(
                table: "ServiceOrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("a7777777-7777-7777-7777-777777777777"));

            migrationBuilder.DeleteData(
                table: "ServiceTypes",
                keyColumn: "Id",
                keyValue: new Guid("b1111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "ServiceTypes",
                keyColumn: "Id",
                keyValue: new Guid("b2222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "ServiceTypes",
                keyColumn: "Id",
                keyValue: new Guid("b3333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "ServiceTypes",
                keyColumn: "Id",
                keyValue: new Guid("b4444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "ServiceTypes",
                keyColumn: "Id",
                keyValue: new Guid("b5555555-5555-5555-5555-555555555555"));
        }
    }
}
