using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Endpoints;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GeoServ.Api.Tests;

public class OperationalDashboardKpisTests
{
    private GeoServDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<GeoServDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new GeoServDbContext(options);
    }

    [Fact]
    public async Task UncollectedOrders_ShouldExclude_OrdersInIniciadaStatus_EvenWithActualEndDate()
    {
        // Arrange
        using var context = CreateInMemoryContext();

        var statusIniciada = new ServiceOrderStatus
        {
            Id = Guid.NewGuid(),
            Name = "Iniciada",
            Description = "En curso"
        };

        var statusEntregada = new ServiceOrderStatus
        {
            Id = Guid.NewGuid(),
            Name = "Entregada",
            Description = "Entregada"
        };

        var statusCobrada = new ServiceOrderStatus
        {
            Id = Guid.NewGuid(),
            Name = "Cobrada",
            Description = "Cobrada"
        };

        context.ServiceOrderStatuses.AddRange(statusIniciada, statusEntregada, statusCobrada);

        // Orden 1: Iniciada pero con ActualEndDate y saldo pendiente -> NO debe contarse como entregada sin cobrar
        var orderIniciadaConFecha = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-101",
            Description = "Orden Iniciada con fecha fin",
            StatusId = statusIniciada.Id,
            Status = statusIniciada,
            ActualEndDate = DateTime.UtcNow,
            TotalAmount = 1000m,
            CollectedAmount = 0m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Orden 2: Entregada con saldo pendiente -> DEBE contarse
        var orderEntregadaPendiente = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-102",
            Description = "Orden Entregada Pendiente",
            StatusId = statusEntregada.Id,
            Status = statusEntregada,
            ActualEndDate = DateTime.UtcNow,
            TotalAmount = 2000m,
            CollectedAmount = 500m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Orden 3: Entregada pero ya cobrada totalmente -> NO debe contarse
        var orderEntregadaCobrada = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-103",
            Description = "Orden Entregada Cobrada",
            StatusId = statusEntregada.Id,
            Status = statusEntregada,
            ActualEndDate = DateTime.UtcNow,
            TotalAmount = 1500m,
            CollectedAmount = 1500m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.ServiceOrders.AddRange(orderIniciadaConFecha, orderEntregadaPendiente, orderEntregadaCobrada);
        await context.SaveChangesAsync();

        // Act: invocamos la consulta de entregadas sin cobrar del dashboard operativo
        var uncollectedOrders = await OperationalDashboardEndpoints
            .GetUncollectedDeliveredOrdersQuery(context)
            .ToListAsync();

        // Assert
        Assert.Single(uncollectedOrders);
        Assert.Equal("OS-102", uncollectedOrders[0].OrderNumber);
        Assert.Equal("Entregada", uncollectedOrders[0].Status.Name);
        Assert.DoesNotContain(uncollectedOrders, o => o.Status.Name == "Iniciada");
    }
}
