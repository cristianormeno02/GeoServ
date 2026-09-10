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

    [Fact]
    public async Task UpcomingDeliveries_ShouldClassifyOrders_InSemanticBuckets_AndExcludeFinalizedOrCanceled()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var today = DateTime.UtcNow.Date;

        var statusIniciada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Iniciada", Description = "En curso" };
        var statusAprobada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Aprobada", Description = "Aprobada" };
        var statusEntregada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Entregada", Description = "Entregada" };
        var statusCancelada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Cancelada", Description = "Cancelada" };

        context.ServiceOrderStatuses.AddRange(statusIniciada, statusAprobada, statusEntregada, statusCancelada);

        // 1. Vencida (-2 días) -> Bucket <= 7 días (Rojo)
        var orderOverdue = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-VENCIDA",
            StatusId = statusIniciada.Id,
            Status = statusIniciada,
            EstimatedEndDate = today.AddDays(-2),
            TotalAmount = 1000m,
            CreatedAt = today,
            UpdatedAt = today
        };

        // 2. A 5 días -> Bucket <= 7 días (Rojo)
        var order7Days = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-7D",
            StatusId = statusAprobada.Id,
            Status = statusAprobada,
            EstimatedEndDate = today.AddDays(5),
            TotalAmount = 2000m,
            CreatedAt = today,
            UpdatedAt = today
        };

        // 3. A 10 días -> Bucket 8-14 días (Amarillo)
        var order14Days = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-14D",
            StatusId = statusIniciada.Id,
            Status = statusIniciada,
            EstimatedEndDate = today.AddDays(10),
            TotalAmount = 3000m,
            CreatedAt = today,
            UpdatedAt = today
        };

        // 4. A 20 días -> Bucket 15-30 días (Verde)
        var order30Days = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-30D",
            StatusId = statusIniciada.Id,
            Status = statusIniciada,
            EstimatedEndDate = today.AddDays(20),
            TotalAmount = 4000m,
            CreatedAt = today,
            UpdatedAt = today
        };

        // 5. A 45 días -> Bucket > 30 días (Neutro)
        var order45Days = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-45D",
            StatusId = statusIniciada.Id,
            Status = statusIniciada,
            EstimatedEndDate = today.AddDays(45),
            TotalAmount = 5000m,
            CreatedAt = today,
            UpdatedAt = today
        };

        // 6. Entregada dentro de 3 días -> Debe excluirse
        var orderEntregada = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-ENTREGADA",
            StatusId = statusEntregada.Id,
            Status = statusEntregada,
            EstimatedEndDate = today.AddDays(3),
            TotalAmount = 6000m,
            CreatedAt = today,
            UpdatedAt = today
        };

        // 7. Cancelada dentro de 3 días -> Debe excluirse
        var orderCancelada = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-CANCELADA",
            StatusId = statusCancelada.Id,
            Status = statusCancelada,
            EstimatedEndDate = today.AddDays(3),
            TotalAmount = 7000m,
            CreatedAt = today,
            UpdatedAt = today
        };

        // 8. Sin EstimatedEndDate -> Debe excluirse del cálculo de vencimientos
        var orderSinFecha = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-SIN-FECHA",
            StatusId = statusIniciada.Id,
            Status = statusIniciada,
            EstimatedEndDate = null,
            TotalAmount = 8000m,
            CreatedAt = today,
            UpdatedAt = today
        };

        context.ServiceOrders.AddRange(orderOverdue, order7Days, order14Days, order30Days, order45Days, orderEntregada, orderCancelada, orderSinFecha);
        await context.SaveChangesAsync();

        // Act
        var result = await OperationalDashboardEndpoints.GetUpcomingDeliveriesBuckets(context, today);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(4, result.Buckets.Count);

        var b7 = result.Buckets.FirstOrDefault(b => b.Range == "≤ 7 días");
        Assert.NotNull(b7);
        Assert.Equal(2, b7.Count); // OS-VENCIDA + OS-7D
        Assert.Equal("#ef4444", b7.Color);

        var b14 = result.Buckets.FirstOrDefault(b => b.Range == "8-14 días");
        Assert.NotNull(b14);
        Assert.Equal(1, b14.Count); // OS-14D
        Assert.Equal("#f59e0b", b14.Color);

        var b30 = result.Buckets.FirstOrDefault(b => b.Range == "15-30 días");
        Assert.NotNull(b30);
        Assert.Equal(1, b30.Count); // OS-30D
        Assert.Equal("#10b981", b30.Color);

        var bOver30 = result.Buckets.FirstOrDefault(b => b.Range == "> 30 días");
        Assert.NotNull(bOver30);
        Assert.Equal(1, bOver30.Count); // OS-45D
        Assert.Equal("#64748b", bOver30.Color);

        Assert.Equal(5, result.TotalCount);
    }

    [Fact]
    public async Task UpcomingDeliveries_Details_ShouldFilterByRange_AndPaginate()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var today = DateTime.UtcNow.Date;

        var statusIniciada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Iniciada", Description = "En curso" };
        var client = new Client { Id = Guid.NewGuid(), CompanyName = "Acme Corp" };
        var serviceType = new ServiceType { Id = Guid.NewGuid(), Name = "Topografía" };

        context.ServiceOrderStatuses.Add(statusIniciada);
        context.Clients.Add(client);
        context.ServiceTypes.Add(serviceType);

        var orderOverdue = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-001",
            ClientId = client.Id,
            Client = client,
            ServiceTypeId = serviceType.Id,
            ServiceType = serviceType,
            StatusId = statusIniciada.Id,
            Status = statusIniciada,
            EstimatedEndDate = today.AddDays(-1),
            TotalAmount = 1500m,
            CreatedAt = today,
            UpdatedAt = today
        };

        var order7D = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-002",
            ClientId = client.Id,
            Client = client,
            ServiceTypeId = serviceType.Id,
            ServiceType = serviceType,
            StatusId = statusIniciada.Id,
            Status = statusIniciada,
            EstimatedEndDate = today.AddDays(4),
            TotalAmount = 2500m,
            CreatedAt = today,
            UpdatedAt = today
        };

        var order14D = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-003",
            ClientId = client.Id,
            Client = client,
            ServiceTypeId = serviceType.Id,
            ServiceType = serviceType,
            StatusId = statusIniciada.Id,
            Status = statusIniciada,
            EstimatedEndDate = today.AddDays(12),
            TotalAmount = 3500m,
            CreatedAt = today,
            UpdatedAt = today
        };

        context.ServiceOrders.AddRange(orderOverdue, order7D, order14D);
        await context.SaveChangesAsync();

        // Act: Filtro para bucket <= 7 días
        var details7D = await OperationalDashboardEndpoints.GetUpcomingDeliveriesDetails(context, "0_7", page: 1, pageSize: 10, referenceDate: today);

        // Assert
        Assert.NotNull(details7D);
        Assert.Equal(2, details7D.TotalCount);
        Assert.Equal(2, details7D.Items.Count);
        Assert.Equal("OS-001", details7D.Items[0].OrderNumber);
        Assert.Equal("Acme Corp", details7D.Items[0].ClientName);
        Assert.Equal("Topografía", details7D.Items[0].ServiceTypeName);
        Assert.Equal(-1, details7D.Items[0].DaysRemaining);
        Assert.Equal("OS-002", details7D.Items[1].OrderNumber);
        Assert.Equal(4, details7D.Items[1].DaysRemaining);

        // Act: Filtro para bucket 8-14 días
        var details14D = await OperationalDashboardEndpoints.GetUpcomingDeliveriesDetails(context, "8_14", page: 1, pageSize: 10, referenceDate: today);
        Assert.Single(details14D.Items);
        Assert.Equal("OS-003", details14D.Items[0].OrderNumber);
        Assert.Equal(12, details14D.Items[0].DaysRemaining);
    }
}

