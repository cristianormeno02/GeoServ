using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Endpoints;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GeoServ.Api.Tests;

public class ServiceOrderDeliverTests
{
    private GeoServDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<GeoServDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new GeoServDbContext(options);
    }

    private (ServiceOrderStatus statusIniciada, ServiceOrderStatus statusEntregada, ServiceOrderStatus statusCobrada) SeedStatuses(GeoServDbContext context)
    {
        var iniciada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Iniciada", OrderIndex = 4 };
        var entregada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Entregada", OrderIndex = 5 };
        var cobrada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Cobrada", OrderIndex = 6 };
        var presupuestada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Presupuestada", OrderIndex = 2 };

        context.ServiceOrderStatuses.AddRange(iniciada, entregada, cobrada, presupuestada);
        context.SaveChanges();
        return (iniciada, entregada, cobrada);
    }

    [Fact]
    public async Task DeliverServiceOrderAsync_OrdenNoExiste_RetornaNotFound()
    {
        using var context = CreateInMemoryContext();
        SeedStatuses(context);

        var result = await ServiceOrderEndpoints.DeliverServiceOrderAsync(Guid.NewGuid(), null, context);

        Assert.IsType<NotFound>(result);
    }

    [Fact]
    public async Task DeliverServiceOrderAsync_OrdenNoIniciada_RetornaBadRequest()
    {
        using var context = CreateInMemoryContext();
        var (iniciada, entregada, cobrada) = SeedStatuses(context);
        var presupuestada = await context.ServiceOrderStatuses.FirstAsync(s => s.Name == "Presupuestada");

        var order = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-001",
            StatusId = presupuestada.Id,
            Status = presupuestada,
            CreatedAt = DateTime.UtcNow
        };
        context.ServiceOrders.Add(order);
        await context.SaveChangesAsync();

        var result = await ServiceOrderEndpoints.DeliverServiceOrderAsync(order.Id, null, context);

        var badRequest = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, badRequest.StatusCode);
    }

    [Fact]
    public async Task DeliverServiceOrderAsync_OrdenIncompletaSinProyecto_RetornaBadRequestConMensaje()
    {
        using var context = CreateInMemoryContext();
        var (iniciada, entregada, cobrada) = SeedStatuses(context);

        var order = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-002",
            StatusId = iniciada.Id,
            Status = iniciada,
            ClientId = Guid.NewGuid(),
            ProjectId = null, // Incompleto: sin proyecto
            EstimatedStartDate = DateTime.UtcNow.Date.AddDays(-5),
            EstimatedEndDate = DateTime.UtcNow.Date.AddDays(-1),
            RequestDate = DateTime.UtcNow.Date.AddDays(-10),
            BudgetedAmount = 5000m,
            TotalAmount = 5000m,
            CreatedAt = DateTime.UtcNow
        };
        order.Responsibles.Add(new ServiceOrderResponsible { ResponsibleId = Guid.NewGuid() });
        context.ServiceOrders.Add(order);
        await context.SaveChangesAsync();

        var result = await ServiceOrderEndpoints.DeliverServiceOrderAsync(order.Id, null, context);

        var badRequest = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, badRequest.StatusCode);
    }

    [Fact]
    public async Task DeliverServiceOrderAsync_OrdenValidaSinFechasReales_AsignaFechasCambiaEstadoYRegistraObservacion()
    {
        using var context = CreateInMemoryContext();
        var (iniciada, entregada, cobrada) = SeedStatuses(context);

        var estimatedStart = DateTime.UtcNow.Date.AddDays(-7);
        var estimatedEnd = DateTime.UtcNow.Date.AddDays(-1);
        var testUserId = Guid.NewGuid();

        var order = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-003",
            StatusId = iniciada.Id,
            Status = iniciada,
            ClientId = Guid.NewGuid(),
            ProjectId = Guid.NewGuid(),
            RequestDate = DateTime.UtcNow.Date.AddDays(-10),
            EstimatedStartDate = estimatedStart,
            EstimatedEndDate = estimatedEnd,
            ActualStartDate = null,
            ActualEndDate = null,
            BudgetedAmount = 10000m,
            TotalAmount = 10000m,
            CreatedAt = DateTime.UtcNow
        };
        order.Responsibles.Add(new ServiceOrderResponsible { ResponsibleId = Guid.NewGuid() });
        context.ServiceOrders.Add(order);
        await context.SaveChangesAsync();

        var result = await ServiceOrderEndpoints.DeliverServiceOrderAsync(order.Id, testUserId, context);

        var okResult = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(200, okResult.StatusCode);

        var updatedOrder = await context.ServiceOrders
            .Include(o => o.Status)
            .Include(o => o.Observations)
            .FirstAsync(o => o.Id == order.Id);

        Assert.Equal(entregada.Id, updatedOrder.StatusId);
        Assert.Equal("Entregada", updatedOrder.Status.Name);
        Assert.Equal(estimatedStart, updatedOrder.ActualStartDate);
        Assert.Equal(DateTime.UtcNow.Date, updatedOrder.ActualEndDate?.Date);

        var obs = Assert.Single(updatedOrder.Observations);
        Assert.Equal("Hito Clave", obs.ObservationType);
        Assert.Equal(testUserId, obs.UserId);
        Assert.Contains("Orden marcada como entregada", obs.Text);
    }

    [Fact]
    public async Task DeliverServiceOrderAsync_OrdenValidaConFechasRealesPrevias_ConservaFechasRealesYActualizaEstado()
    {
        using var context = CreateInMemoryContext();
        var (iniciada, entregada, cobrada) = SeedStatuses(context);

        var actualStart = DateTime.UtcNow.Date.AddDays(-4);
        var actualEnd = DateTime.UtcNow.Date.AddDays(-1);

        var order = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-004",
            StatusId = iniciada.Id,
            Status = iniciada,
            ClientId = Guid.NewGuid(),
            ProjectId = Guid.NewGuid(),
            RequestDate = DateTime.UtcNow.Date.AddDays(-10),
            EstimatedStartDate = DateTime.UtcNow.Date.AddDays(-6),
            EstimatedEndDate = DateTime.UtcNow.Date.AddDays(-2),
            ActualStartDate = actualStart,
            ActualEndDate = actualEnd,
            BudgetedAmount = 7500m,
            TotalAmount = 7500m,
            CreatedAt = DateTime.UtcNow
        };
        order.Responsibles.Add(new ServiceOrderResponsible { ResponsibleId = Guid.NewGuid() });
        context.ServiceOrders.Add(order);
        await context.SaveChangesAsync();

        var result = await ServiceOrderEndpoints.DeliverServiceOrderAsync(order.Id, null, context);

        var okResult = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(200, okResult.StatusCode);

        var updatedOrder = await context.ServiceOrders.FirstAsync(o => o.Id == order.Id);
        Assert.Equal(entregada.Id, updatedOrder.StatusId);
        Assert.Equal(actualStart, updatedOrder.ActualStartDate);
        Assert.Equal(actualEnd, updatedOrder.ActualEndDate);
    }
}
