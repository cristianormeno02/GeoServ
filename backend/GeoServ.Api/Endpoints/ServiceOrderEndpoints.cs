using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GeoServ.Api.Endpoints;

public static class ServiceOrderEndpoints
{
    public static void MapServiceOrderEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/service-orders").RequireAuthorization();

        // 1. Obtener todas las órdenes de servicio
        group.MapGet("/", async (GeoServDbContext context) =>
        {
            var orders = await context.ServiceOrders
                .Include(o => o.Client)
                .Include(o => o.Project)
                .Include(o => o.Status)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    o.OrderNumber,
                    ClientName = o.Client.CompanyName,
                    ProjectName = o.Project != null ? o.Project.Name : null,
                    StatusName = o.Status.Name,
                    o.Priority,
                    o.CreatedAt,
                    o.EstimatedEndDate,
                    o.BudgetedAmount,
                    o.CollectedAmount
                })
                .ToListAsync();

            return Results.Ok(orders);
        })
        .WithName("GetServiceOrders")
        .WithOpenApi();

        // Catálogos auxiliares
        group.MapGet("/catalogs/statuses", async (GeoServDbContext context) =>
        {
            return Results.Ok(await context.ServiceOrderStatuses.OrderBy(s => s.OrderIndex).ToListAsync());
        }).WithName("GetServiceOrderStatuses");

        group.MapGet("/catalogs/projects", async (GeoServDbContext context) =>
        {
            return Results.Ok(await context.Projects.OrderBy(p => p.Name).ToListAsync());
        }).WithName("GetProjects");

        group.MapGet("/catalogs/distribution-concepts", async (GeoServDbContext context) =>
        {
            return Results.Ok(await context.DistributionConcepts.Where(c => c.IsActive).OrderBy(c => c.Name).ToListAsync());
        }).WithName("GetDistributionConcepts");

        group.MapGet("/catalogs/currencies", async (GeoServDbContext context) =>
        {
            return Results.Ok(await context.Currencies.Where(c => c.IsActive).OrderBy(c => c.Name).ToListAsync());
        }).WithName("GetCurrencies");

        // 2. Obtener orden por ID (con todos los detalles)
        group.MapGet("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            try
            {
                var order = await context.ServiceOrders
                    .Include(o => o.Client)
                    .Include(o => o.Project)
                    .Include(o => o.Status)
                    .Include(o => o.ServiceType)
                    .Include(o => o.Currency)
                    .Include(o => o.Responsibles).ThenInclude(r => r.Responsible).ThenInclude(r => r.User)
                    .Include(o => o.Activities)
                    .Include(o => o.Distributions).ThenInclude(d => d.DistributionConcept)
                    .Include(o => o.Documents)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null) return Results.NotFound();

                return Results.Ok(new
                {
                    order.Id,
                    order.OrderNumber,
                    order.ClientId,
                    ClientName = order.Client.CompanyName,
                    order.ProjectId,
                    ProjectName = order.Project?.Name,
                    order.ServiceTypeId,
                    ServiceTypeName = order.ServiceType.Name,
                    order.StatusId,
                    StatusName = order.Status.Name,
                    Priority = order.Priority.ToString(),
                    PriorityValue = (int)order.Priority,
                    order.Description,
                    order.CurrencyId,
                    CurrencyCode = order.Currency?.Code,
                    CurrencySymbol = order.Currency?.Symbol,
                    order.ForeignAmount,
                    order.ExchangeRateAtBudget,
                    order.ExchangeRateAtCollection,
                    order.BudgetedAmount,
                    order.Discount,
                    order.TotalAmount,
                    order.CollectedAmount,
                    order.RequestDate,
                    order.CreatedAt,
                    order.EstimatedStartDate,
                    order.EstimatedEndDate,
                    order.ActualStartDate,
                    order.ActualEndDate,
                    order.CollectionDate,
                    order.CanceledAt,
                    Responsibles = order.Responsibles.Select(r => new { 
                        r.Responsible.Id, 
                        r.Responsible.Name, 
                        r.Responsible.Position, 
                        r.Responsible.Title, 
                        r.Responsible.Specialties, 
                        r.Responsible.UserId, 
                        UserName = r.Responsible.User?.Name 
                    }),
                    Activities = order.Activities.Select(a => new { a.Id, a.ShortDetail, a.LongDetail, State = a.State.ToString(), StateValue = (int)a.State, a.ProgressPercentage }),
                    Distributions = order.Distributions.Select(d => new { d.Id, d.DistributionConceptId, ConceptName = d.DistributionConcept.Name, d.Percentage, d.ExpectedAmount, d.ActualAmount }),
                    Documents = order.Documents.Select(d => new { d.Id, d.FileName, d.ContentType, d.IsVisibleToClient, d.UploadedAt, d.UploadedById })
                });
            }
            catch (Exception ex)
            {
                return Results.Problem(detail: ex.InnerException?.Message ?? ex.Message, title: "Error Interno en GET", statusCode: 500);
            }
        })
        .WithName("GetServiceOrderById")
        .WithOpenApi();

        // 3. Crear Orden de Servicio
        group.MapPost("/", async (CreateServiceOrderRequest request, GeoServDbContext context) =>
        {
            try 
            {
                // Validar unicidad de número de orden
                if (await context.ServiceOrders.AnyAsync(o => o.OrderNumber == request.OrderNumber))
                    return Results.BadRequest(new { message = "El número de orden ya existe." });

                // Validar distribuciones al 100%
                if (request.Distributions != null && request.Distributions.Any())
                {
                    var sum = request.Distributions.Sum(d => d.Percentage);
                    if (sum != 100)
                        return Results.BadRequest(new { message = "La sumatoria de los porcentajes de distribución debe ser 100%." });
                    
                    var duplicateConcepts = request.Distributions.GroupBy(d => d.DistributionConceptId).Any(g => g.Count() > 1);
                    if (duplicateConcepts)
                        return Results.BadRequest(new { message = "No se puede repetir el mismo concepto de distribución en una orden." });
                }

                var order = new ServiceOrder
                {
                    Id = Guid.NewGuid(),
                    OrderNumber = request.OrderNumber,
                    ClientId = request.ClientId,
                    ProjectId = request.ProjectId,
                    ServiceTypeId = request.ServiceTypeId,
                    StatusId = request.StatusId,
                    Priority = (ServiceOrderPriority)request.Priority,
                    Description = request.Description,
                    CurrencyId = request.CurrencyId,
                    ForeignAmount = request.ForeignAmount,
                    ExchangeRateAtBudget = request.ExchangeRateAtBudget,
                    BudgetedAmount = request.BudgetedAmount,
                    Discount = request.Discount,
                    TotalAmount = request.TotalAmount,
                    RequestDate = request.RequestDate,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    EstimatedStartDate = request.EstimatedStartDate,
                    EstimatedEndDate = request.EstimatedEndDate
                };

                // Añadir distribuciones
                if (request.Distributions != null)
                {
                    foreach (var dist in request.Distributions)
                    {
                        order.Distributions.Add(new ServiceOrderDistribution
                        {
                            Id = Guid.NewGuid(),
                            DistributionConceptId = dist.DistributionConceptId,
                            Percentage = dist.Percentage,
                            ExpectedAmount = dist.ExpectedAmount,
                            ActualAmount = dist.ActualAmount
                        });
                    }
                }

                // Añadir actividades
                if (request.Activities != null)
                {
                    foreach (var act in request.Activities)
                    {
                        order.Activities.Add(new ServiceOrderActivity
                        {
                            Id = Guid.NewGuid(),
                            ShortDetail = act.ShortDetail,
                            LongDetail = act.LongDetail,
                            State = Enum.Parse<GeoServ.Api.Domain.Enums.ActivityState>(act.State.Replace(" ", ""), true),
                            ProgressPercentage = act.ProgressPercentage
                        });
                    }
                }

                // Añadir responsables
                if (request.ResponsibleIds != null && request.ResponsibleIds.Any())
                {
                    var uniqueIds = request.ResponsibleIds.Distinct().ToList();
                    foreach (var rId in uniqueIds)
                    {
                        order.Responsibles.Add(new ServiceOrderResponsible
                        {
                            ResponsibleId = rId
                        });
                    }
                }

                context.ServiceOrders.Add(order);
                await context.SaveChangesAsync();

                return Results.Created($"/api/service-orders/{order.Id}", order.Id);
            }
            catch (Exception ex)
            {
                return Results.Problem(detail: ex.InnerException?.Message ?? ex.Message, title: "Error Interno", statusCode: 500);
            }
        })
        .WithName("CreateServiceOrder")
        .WithOpenApi();

        // 4. Endpoint de Documentos (Subida)
        group.MapPost("/{id:guid}/documents", async (Guid id, [FromForm] IFormFile file, [FromForm] bool isVisibleToClient, HttpContext httpContext, GeoServDbContext context) =>
        {
            var userIdStr = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Results.Unauthorized();

            // Verificación de si es administrador (se asume obteniendo el rol de base de datos)
            var user = await context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Role?.Name != "Administrador")
            {
                return Results.Forbid(); // Solo administradores pueden subir documentos
            }

            var order = await context.ServiceOrders.FindAsync(id);
            if (order == null) return Results.NotFound("Orden de servicio no encontrada.");

            if (file == null || file.Length == 0) return Results.BadRequest("Archivo inválido.");

            // Crear directorio local
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "service-orders", id.ToString());
            if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativePath = $"/uploads/service-orders/{id}/{fileName}";

            var document = new ServiceOrderDocument
            {
                Id = Guid.NewGuid(),
                ServiceOrderId = id,
                FileName = file.FileName,
                FilePath = relativePath,
                ContentType = file.ContentType,
                IsVisibleToClient = isVisibleToClient,
                UploadedAt = DateTime.UtcNow,
                UploadedById = userId
            };

            context.ServiceOrderDocuments.Add(document);
            await context.SaveChangesAsync();

            return Results.Ok(new { document.Id, document.FileName, document.FilePath });
        })
        .WithName("UploadServiceOrderDocument")
        .DisableAntiforgery() // Requerido para Minimal APIs con IFormFile sin anti-forgery configurado
        .WithOpenApi();

        // 5. Descargar Documento
        group.MapGet("/{id:guid}/documents/{docId:guid}/download", async Task<IResult> (Guid id, Guid docId, HttpContext httpContext, GeoServDbContext context) =>
        {
            var userIdStr = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid.TryParse(userIdStr, out var userId);
            var user = await context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == userId);

            var document = await context.ServiceOrderDocuments.FirstOrDefaultAsync(d => d.Id == docId && d.ServiceOrderId == id);
            if (document == null) return Results.NotFound();

            // Validación de acceso (Si es cliente, solo puede ver los marcados como visibles)
            if (user?.Role?.Name == "Cliente" && !document.IsVisibleToClient)
            {
                return Results.Forbid();
            }

            var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", document.FilePath.TrimStart('/'));
            if (!File.Exists(physicalPath)) return Results.NotFound("El archivo físico no se encontró en el servidor.");

            var stream = new FileStream(physicalPath, FileMode.Open, FileAccess.Read, FileShare.Read);
            return Results.File(stream, document.ContentType ?? "application/octet-stream", document.FileName);
        })
        .WithName("DownloadServiceOrderDocument")
        .WithOpenApi();

        // 6. Eliminar Documento
        group.MapDelete("/{id:guid}/documents/{docId:guid}", async (Guid id, Guid docId, HttpContext httpContext, GeoServDbContext context) =>
        {
            var userIdStr = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Results.Unauthorized();

            var user = await context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Role?.Name != "Administrador") return Results.Forbid();

            var document = await context.ServiceOrderDocuments.FirstOrDefaultAsync(d => d.Id == docId && d.ServiceOrderId == id);
            if (document == null) return Results.NotFound();

            var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", document.FilePath.TrimStart('/'));
            if (File.Exists(physicalPath))
            {
                File.Delete(physicalPath);
            }

            context.ServiceOrderDocuments.Remove(document);
            await context.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("DeleteServiceOrderDocument")
        .WithOpenApi();

        // 7. Actualizar Orden de Servicio (PUT)
        group.MapPut("/{id:guid}", async (Guid id, UpdateServiceOrderRequest request, GeoServDbContext context) =>
        {
            try
            {
                var order = await context.ServiceOrders
                    .Include(o => o.Distributions)
                    .Include(o => o.Responsibles)
                    .Include(o => o.Activities)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null) return Results.NotFound();

                // Validar unicidad de número de orden (excluyendo la actual)
                if (await context.ServiceOrders.AnyAsync(o => o.OrderNumber == request.OrderNumber && o.Id != id))
                    return Results.BadRequest(new { message = "El número de orden ya está en uso por otra orden." });

                // Validar distribuciones al 100%
                if (request.Distributions != null && request.Distributions.Any())
                {
                    var sum = request.Distributions.Sum(d => d.Percentage);
                    if (sum != 100m)
                        return Results.BadRequest(new { message = "La suma de los porcentajes de distribución debe ser exactamente 100." });
                    
                    var duplicates = request.Distributions.GroupBy(d => d.DistributionConceptId).Any(g => g.Count() > 1);
                    if (duplicates)
                        return Results.BadRequest(new { message = "No se puede repetir el mismo concepto de distribución." });
                }

                // Actualizar campos básicos
                order.OrderNumber = request.OrderNumber;
                order.ClientId = request.ClientId;
                order.ProjectId = request.ProjectId;
                order.ServiceTypeId = request.ServiceTypeId;
                order.StatusId = request.StatusId;
                order.Priority = (ServiceOrderPriority)request.Priority;
                order.Description = request.Description;
                order.CurrencyId = request.CurrencyId;
                order.ForeignAmount = request.ForeignAmount;
                order.ExchangeRateAtBudget = request.ExchangeRateAtBudget;
                order.ExchangeRateAtCollection = request.ExchangeRateAtCollection;
                order.BudgetedAmount = request.BudgetedAmount;
                order.Discount = request.Discount;
                order.TotalAmount = request.TotalAmount;
                order.UpdatedAt = DateTime.UtcNow;
                order.RequestDate = request.RequestDate;
                order.EstimatedStartDate = request.EstimatedStartDate;
                order.EstimatedEndDate = request.EstimatedEndDate;
                order.ActualStartDate = request.ActualStartDate;
                order.ActualEndDate = request.ActualEndDate;
                order.CollectionDate = request.CollectionDate;

                // Sincronizar Distribuciones: DELETE directo con SQL para evitar doble-tracking de EF Core
                await context.ServiceOrderDistributions
                    .Where(d => d.ServiceOrderId == id)
                    .ExecuteDeleteAsync();

                if (request.Distributions != null)
                {
                    foreach (var dist in request.Distributions)
                    {
                        context.ServiceOrderDistributions.Add(new ServiceOrderDistribution
                        {
                            Id = Guid.NewGuid(),
                            ServiceOrderId = id,
                            DistributionConceptId = dist.DistributionConceptId,
                            Percentage = dist.Percentage,
                            ExpectedAmount = dist.ExpectedAmount,
                            ActualAmount = dist.ActualAmount
                        });
                    }
                }

                // Sincronizar Actividades: DELETE directo con SQL para evitar doble-tracking de EF Core
                await context.ServiceOrderActivities
                    .Where(a => a.ServiceOrderId == id)
                    .ExecuteDeleteAsync();

                if (request.Activities != null)
                {
                    foreach (var act in request.Activities)
                    {
                        context.ServiceOrderActivities.Add(new ServiceOrderActivity
                        {
                            Id = Guid.NewGuid(),
                            ServiceOrderId = id,
                            ShortDetail = act.ShortDetail,
                            LongDetail = act.LongDetail,
                            State = Enum.Parse<GeoServ.Api.Domain.Enums.ActivityState>(act.State?.Replace(" ", "") ?? "EnProceso", true),
                            ProgressPercentage = act.ProgressPercentage
                        });
                    }
                }

                // Sincronizar Responsables: DELETE directo con SQL para evitar doble-tracking de EF Core
                await context.ServiceOrderResponsibles
                    .Where(r => r.ServiceOrderId == id)
                    .ExecuteDeleteAsync();

                if (request.ResponsibleIds != null)
                {
                    foreach (var rId in request.ResponsibleIds.Distinct())
                    {
                        context.ServiceOrderResponsibles.Add(new ServiceOrderResponsible
                        {
                            ServiceOrderId = id,
                            ResponsibleId = rId
                        });
                    }
                }

                await context.SaveChangesAsync();
                return Results.NoContent();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                var entry = ex.Entries.FirstOrDefault();
                var entityName = entry?.Entity.GetType().Name ?? "Desconocida";
                return Results.Problem(detail: $"Error de concurrencia al actualizar la entidad: {entityName}.", title: "Error de Concurrencia", statusCode: 409);
            }
            catch (Exception ex)
            {
                return Results.Problem(detail: ex.InnerException?.Message ?? ex.Message, title: "Error Interno en MapPut", statusCode: 500);
            }
        })
        .WithName("UpdateServiceOrder")
        .WithOpenApi();

        // 8. Eliminar Orden de Servicio (DELETE)
        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var order = await context.ServiceOrders
                .Include(o => o.Documents)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return Results.NotFound();

            // Eliminar archivos físicos asociados
            foreach (var document in order.Documents)
            {
                var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", document.FilePath.TrimStart('/'));
                if (File.Exists(physicalPath))
                {
                    File.Delete(physicalPath);
                }
            }

            // Eliminar el directorio de la orden si quedó vacío (opcional, pero buena práctica)
            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "service-orders", id.ToString());
            if (Directory.Exists(uploadsDir))
            {
                Directory.Delete(uploadsDir, true);
            }

            // La eliminación en cascada borrará registros de documentos, actividades, responsables, etc.
            context.ServiceOrders.Remove(order);
            await context.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("DeleteServiceOrder")
        .WithOpenApi();
    }
}

// DTOs
public record CreateServiceOrderRequest(
    string OrderNumber,
    Guid ClientId,
    Guid? ProjectId,
    Guid ServiceTypeId,
    Guid StatusId,
    int Priority,
    string? Description,
    Guid CurrencyId,
    decimal? ForeignAmount,
    decimal? ExchangeRateAtBudget,
    decimal BudgetedAmount,
    decimal Discount,
    decimal TotalAmount,
    DateTime? RequestDate,
    DateTime? EstimatedStartDate,
    DateTime? EstimatedEndDate,
    List<DistributionDto>? Distributions,
    List<ActivityDto>? Activities,
    List<Guid>? ResponsibleIds
);

public record UpdateServiceOrderRequest(
    string OrderNumber,
    Guid ClientId,
    Guid? ProjectId,
    Guid ServiceTypeId,
    Guid StatusId,
    int Priority,
    string? Description,
    Guid CurrencyId,
    decimal? ForeignAmount,
    decimal? ExchangeRateAtBudget,
    decimal? ExchangeRateAtCollection,
    decimal BudgetedAmount,
    decimal Discount,
    decimal TotalAmount,
    DateTime? RequestDate,
    DateTime? EstimatedStartDate,
    DateTime? EstimatedEndDate,
    DateTime? ActualStartDate,
    DateTime? ActualEndDate,
    DateTime? CollectionDate,
    List<DistributionDto>? Distributions,
    List<ActivityDto>? Activities,
    List<Guid>? ResponsibleIds
);

public record DistributionDto(Guid DistributionConceptId, decimal Percentage, decimal ExpectedAmount, decimal ActualAmount);
public record ActivityDto(string ShortDetail, string? LongDetail, string State, int ProgressPercentage);
