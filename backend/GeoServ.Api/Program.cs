using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<GeoServDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Endpoint para inicializar el sistema
app.MapPost("/api/system/init", async (GeoServDbContext context) =>
{
    try
    {
        // 1. Crear tablas / aplicar migraciones pendientes (incluye catálogos de OnModelCreating)
        await context.Database.MigrateAsync();

        // 2. Crear roles si no existen
        var adminRoleId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        if (!await context.Roles.AnyAsync(r => r.Id == adminRoleId))
        {
            context.Roles.AddRange(
                new GeoServ.Api.Domain.Entities.Role { Id = adminRoleId, Name = "Administrador", Description = "Acceso total al sistema" },
                new GeoServ.Api.Domain.Entities.Role { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Operador", Description = "Acceso operativo a órdenes de servicio" },
                new GeoServ.Api.Domain.Entities.Role { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Cliente", Description = "Acceso de lectura a órdenes propias" }
            );
            await context.SaveChangesAsync();
        }

        // 3. Crear usuario administrador por defecto si no existe
        if (!await context.Users.AnyAsync(u => u.Email == "admin@geoserv.com"))
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword("GeoServAdmin.");
            var adminUser = new GeoServ.Api.Domain.Entities.User
            {
                Id = Guid.Parse("99999999-9999-9999-9999-999999999999"),
                RoleId = adminRoleId,
                Name = "Administrador",
                Email = "admin@geoserv.com",
                PasswordHash = hashedPassword,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };
            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
        }

        return Results.Ok(new { message = "Sistema inicializado correctamente. Tablas y usuario administrador creados." });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al inicializar el sistema: {ex.Message}");
    }
})
.WithName("InitSystem")
.WithOpenApi();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
