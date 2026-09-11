using System;
using System.Collections.Generic;
using GeoServ.Api.Endpoints;
using Xunit;

namespace GeoServ.Api.Tests;

public class ServiceOrderValidationTests
{
    [Fact]
    public void ValidateServiceOrderRules_ConEstadoCobradaYFechaEntrega_EsValido()
    {
        // Arrange
        var clientId = Guid.NewGuid();
        var projectId = Guid.NewGuid();
        var today = DateTime.UtcNow.Date;
        var responsibleIds = new List<Guid> { Guid.NewGuid() };

        // Act
        var error = ServiceOrderEndpoints.ValidateServiceOrderRules(
            statusName: "Cobrada",
            clientId: clientId,
            projectId: projectId,
            requestDate: today.AddDays(-10),
            estimatedStartDate: today.AddDays(-5),
            estimatedEndDate: today.AddDays(-1),
            actualStartDate: today.AddDays(-5),
            actualEndDate: today.AddDays(-1),
            budgetedAmount: 1000m,
            totalAmount: 1000m,
            responsibleIds: responsibleIds
        );

        // Assert
        Assert.Null(error);
    }

    [Fact]
    public void ValidateServiceOrderRules_ConEstadoIniciadaYFechaEntrega_RetornaError()
    {
        // Arrange
        var clientId = Guid.NewGuid();
        var projectId = Guid.NewGuid();
        var today = DateTime.UtcNow.Date;
        var responsibleIds = new List<Guid> { Guid.NewGuid() };

        // Act
        var error = ServiceOrderEndpoints.ValidateServiceOrderRules(
            statusName: "Iniciada",
            clientId: clientId,
            projectId: projectId,
            requestDate: today.AddDays(-10),
            estimatedStartDate: today.AddDays(-5),
            estimatedEndDate: today.AddDays(5),
            actualStartDate: today.AddDays(-5),
            actualEndDate: today.AddDays(-1),
            budgetedAmount: 1000m,
            totalAmount: 1000m,
            responsibleIds: responsibleIds
        );

        // Assert
        Assert.NotNull(error);
        Assert.Contains("Entregada", error);
        Assert.Contains("Cobrada", error);
    }
}
