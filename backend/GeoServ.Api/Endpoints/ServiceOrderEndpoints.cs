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
            var rawOrders = await context.ServiceOrders
                .Include(o => o.Client)
                .Include(o => o.Project)
                .Include(o => o.Status)
                .Include(o => o.Responsibles)
                .OrderBy(o => o.OrderNumber)
                .Select(o => new
                {
                    o.Id,
                    o.OrderNumber,
                    o.ClientId,
                    ClientName = o.Client != null ? o.Client.CompanyName : "",
                    o.ProjectId,
                    ProjectName = o.Project != null ? o.Project.Name : null,
                    o.StatusId,
                    StatusName = o.Status != null ? o.Status.Name : "",
                    o.Priority,
                    o.CreatedAt,
                    o.RequestDate,
                    o.EstimatedStartDate,
                    o.EstimatedEndDate,
                    o.ActualStartDate,
                    o.ActualEndDate,
                    o.BudgetedAmount,
                    o.TotalAmount,
                    o.CollectedAmount,
                    ResponsiblesCount = o.Responsibles.Count
                })
                .ToListAsync();

            var orders = rawOrders.Select(o =>
            {
                var issues = new List<string>();

                if (o.EstimatedStartDate.HasValue && o.EstimatedEndDate.HasValue && o.EstimatedEndDate.Value.Date < o.EstimatedStartDate.Value.Date)
                {
                    issues.Add("Fin presupuestado anterior a inicio presupuestado.");
                }

                if (o.ActualStartDate.HasValue && o.ActualEndDate.HasValue && o.ActualEndDate.Value.Date < o.ActualStartDate.Value.Date)
                {
                    issues.Add("Fin real anterior a inicio real.");
                }

                if (o.ActualEndDate.HasValue && o.ActualEndDate.Value.Date > DateTime.UtcNow.Date)
                {
                    issues.Add("Fin real posterior a la fecha actual.");
                }

                var isEntregada = string.Equals(o.StatusName, "Entregada", StringComparison.OrdinalIgnoreCase);
                var isCobrada = string.Equals(o.StatusName, "Cobrada", StringComparison.OrdinalIgnoreCase);

                if (o.ActualEndDate.HasValue && !isEntregada && !isCobrada)
                {
                    issues.Add("Posee fecha de entrega pero el estado no es 'Entregada' ni 'Cobrada'.");
                }

                if (isEntregada || isCobrada)
                {
                    var statusLabel = isCobrada ? "Cobrada" : "Entregada";
                    if (!o.ProjectId.HasValue || o.ProjectId == Guid.Empty)
                        issues.Add($"Orden en estado {statusLabel} sin proyecto asignado.");
                    if (o.ClientId == Guid.Empty)
                        issues.Add($"Orden en estado {statusLabel} sin cliente asignado.");
                    if (!o.RequestDate.HasValue || !o.EstimatedStartDate.HasValue || !o.EstimatedEndDate.HasValue || !o.ActualStartDate.HasValue || !o.ActualEndDate.HasValue)
                        issues.Add($"Orden en estado {statusLabel} con fechas obligatorias incompletas.");
                    if (o.BudgetedAmount <= 0 || o.TotalAmount <= 0)
                        issues.Add($"Orden en estado {statusLabel} sin montos presupuestado/total.");
                    if (o.ResponsiblesCount == 0)
                        issues.Add($"Orden en estado {statusLabel} sin equipo de trabajo.");
                }

                return new
                {
                    o.Id,
                    o.OrderNumber,
                    o.ClientId,
                    o.ClientName,
                    o.ProjectId,
                    o.ProjectName,
                    o.StatusId,
                    o.StatusName,
                    o.Priority,
                    o.CreatedAt,
                    o.EstimatedStartDate,
                    o.EstimatedEndDate,
                    o.ActualStartDate,
                    o.ActualEndDate,
                    o.BudgetedAmount,
                    o.TotalAmount,
                    o.CollectedAmount,
                    HasInconsistencies = issues.Count > 0,
                    InconsistencyReasons = issues
                };
            }).ToList();

            return Results.Ok(orders);
        })
        .WithName("GetServiceOrders")
        .WithOpenApi();

        // Búsqueda de órdenes para autocompletar (retorna BudgetedTasksDetail)
        group.MapGet("/search", async (string? q, GeoServDbContext context) =>
        {
            var query = context.ServiceOrders
                .Include(o => o.Client)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
            {
                var lowerQ = q.ToLower();
                query = query.Where(o => o.OrderNumber.ToLower().Contains(lowerQ) || 
                                         (o.Client != null && o.Client.CompanyName.ToLower().Contains(lowerQ)));
            }

            var results = await query
                .OrderByDescending(o => o.CreatedAt)
                .Take(20) // Limitar a 20 resultados
                .Select(o => new
                {
                    o.Id,
                    o.OrderNumber,
                    ClientName = o.Client != null ? o.Client.CompanyName : "",
                    o.BudgetedTasksDetail
                })
                .ToListAsync();

            return Results.Ok(results);
        })
        .WithName("SearchServiceOrders")
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
                    .Include(o => o.Observations).ThenInclude(obs => obs.User)
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
                    order.BudgetedTasksDetail,
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
                    Activities = order.Activities.OrderBy(a => a.OrderIndex).Select(a => new { a.Id, a.ShortDetail, a.LongDetail, State = a.State.ToString(), StateValue = (int)a.State, a.ProgressPercentage, a.OrderIndex }),
                    Distributions = order.Distributions.OrderBy(d => d.OrderIndex).Select(d => new { d.Id, d.DistributionConceptId, ConceptName = d.DistributionConcept.Name, d.Percentage, d.ExpectedAmount, d.ActualAmount, d.OrderIndex }),
                    Documents = order.Documents.Select(d => new { d.Id, d.FileName, d.ContentType, d.IsVisibleToClient, d.UploadedAt, d.UploadedById }),
                    Observations = order.Observations.OrderByDescending(o => o.CreatedAt).Select(o => new { o.Id, o.Text, o.ObservationType, UserName = o.User != null ? o.User.Name : o.UserId.ToString(), o.CreatedAt })
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
        group.MapPost("/", async (CreateServiceOrderRequest request, GeoServDbContext context, GeoServ.Api.Infrastructure.Services.IEmpresaConfiguracionService configService) =>
        {
            try 
            {
                var osNumberFormat = await configService.GetValueAsync("os_number_format");
                string finalOrderNumber = request.OrderNumber;

                if (osNumberFormat == "auto")
                {
                    // Obtener el máximo y sumar 1. (En concurrencia, puede fallar si no hay lock, 
                    // EF lanzará excepción de unicidad que se podría reintentar).
                    var maxNumberStr = await context.ServiceOrders
                        .OrderByDescending(o => o.OrderNumber)
                        .Select(o => o.OrderNumber)
                        .FirstOrDefaultAsync();

                    int nextNumber = 1;
                    if (maxNumberStr != null && int.TryParse(maxNumberStr, out int maxNumber))
                    {
                        nextNumber = maxNumber + 1;
                    }
                    finalOrderNumber = nextNumber.ToString("D8");
                }
                else
                {
                    if (string.IsNullOrWhiteSpace(finalOrderNumber))
                    {
                        return Results.BadRequest(new { message = "El número de orden es requerido." });
                    }
                }

                // Validar unicidad de número de orden
                if (await context.ServiceOrders.AnyAsync(o => o.OrderNumber == finalOrderNumber))
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

                // Validar existencia de estado y reglas de negocio
                var status = await context.ServiceOrderStatuses.FirstOrDefaultAsync(s => s.Id == request.StatusId);
                if (status == null)
                    return Results.BadRequest(new { message = "El estado seleccionado no es válido." });

                var isEntregada = string.Equals(status.Name, "Entregada", StringComparison.OrdinalIgnoreCase);
                var isCobrada = string.Equals(status.Name, "Cobrada", StringComparison.OrdinalIgnoreCase);
                DateTime? finalActualEndDate = (isEntregada || isCobrada) ? request.ActualEndDate : null;

                var validationError = ValidateServiceOrderRules(
                    status.Name,
                    request.ClientId,
                    request.ProjectId,
                    request.RequestDate,
                    request.EstimatedStartDate,
                    request.EstimatedEndDate,
                    request.ActualStartDate,
                    finalActualEndDate,
                    request.BudgetedAmount,
                    request.TotalAmount,
                    request.ResponsibleIds
                );
                if (validationError != null)
                {
                    return Results.BadRequest(new { message = validationError });
                }

                var order = new ServiceOrder
                {
                    Id = Guid.NewGuid(),
                    OrderNumber = finalOrderNumber,
                    ClientId = request.ClientId,
                    ProjectId = request.ProjectId,
                    ServiceTypeId = request.ServiceTypeId,
                    StatusId = request.StatusId,
                    Priority = (ServiceOrderPriority)request.Priority,
                    Description = request.Description,
                    BudgetedTasksDetail = request.BudgetedTasksDetail,
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
                    EstimatedEndDate = request.EstimatedEndDate,
                    ActualStartDate = request.ActualStartDate,
                    ActualEndDate = finalActualEndDate,
                    CollectionDate = request.CollectionDate
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
                            ActualAmount = dist.ActualAmount,
                            OrderIndex = dist.OrderIndex
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
                            ProgressPercentage = act.ProgressPercentage,
                            OrderIndex = act.OrderIndex
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

                // Validar existencia de estado y reglas de negocio
                var status = await context.ServiceOrderStatuses.FirstOrDefaultAsync(s => s.Id == request.StatusId);
                if (status == null)
                    return Results.BadRequest(new { message = "El estado seleccionado no es válido." });

                var isEntregada = string.Equals(status.Name, "Entregada", StringComparison.OrdinalIgnoreCase);
                var isCobrada = string.Equals(status.Name, "Cobrada", StringComparison.OrdinalIgnoreCase);
                DateTime? finalActualEndDate = (isEntregada || isCobrada) ? request.ActualEndDate : null;

                var validationError = ValidateServiceOrderRules(
                    status.Name,
                    request.ClientId,
                    request.ProjectId,
                    request.RequestDate,
                    request.EstimatedStartDate,
                    request.EstimatedEndDate,
                    request.ActualStartDate,
                    finalActualEndDate,
                    request.BudgetedAmount,
                    request.TotalAmount,
                    request.ResponsibleIds
                );
                if (validationError != null)
                {
                    return Results.BadRequest(new { message = validationError });
                }

                // Actualizar campos básicos
                order.OrderNumber = request.OrderNumber;
                order.ClientId = request.ClientId;
                order.ProjectId = request.ProjectId;
                order.ServiceTypeId = request.ServiceTypeId;
                order.StatusId = request.StatusId;
                order.Priority = (ServiceOrderPriority)request.Priority;
                order.Description = request.Description;
                order.BudgetedTasksDetail = request.BudgetedTasksDetail;
                order.CurrencyId = request.CurrencyId;
                order.ForeignAmount = request.ForeignAmount;
                order.ExchangeRateAtBudget = request.ExchangeRateAtBudget;
                order.ExchangeRateAtCollection = request.ExchangeRateAtCollection;
                order.BudgetedAmount = request.BudgetedAmount;
                order.Discount = request.Discount;
                order.TotalAmount = request.TotalAmount;
                order.CollectedAmount = request.CollectedAmount;
                order.UpdatedAt = DateTime.UtcNow;
                order.RequestDate = request.RequestDate;
                order.EstimatedStartDate = request.EstimatedStartDate;
                order.EstimatedEndDate = request.EstimatedEndDate;
                order.ActualStartDate = request.ActualStartDate;
                order.ActualEndDate = finalActualEndDate;
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
                            ActualAmount = dist.ActualAmount,
                            OrderIndex = dist.OrderIndex
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
                            ProgressPercentage = act.ProgressPercentage,
                            OrderIndex = act.OrderIndex
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

        // 7.1 Marcar Orden de Servicio como Entregada (POST)
        group.MapPost("/{id:guid}/deliver", async (Guid id, HttpContext httpContext, GeoServDbContext context) =>
        {
            var userIdStr = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? userId = Guid.TryParse(userIdStr, out var uid) ? uid : null;
            return await DeliverServiceOrderAsync(id, userId, context);
        })
        .WithName("DeliverServiceOrder")
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

        // 6. Agregar Observación
        group.MapPost("/{id:guid}/observations", async (Guid id, [FromBody] AddObservationRequest request, HttpContext httpContext, GeoServDbContext context) =>
        {
            try
            {
                var userIdStr = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!Guid.TryParse(userIdStr, out var userId)) return Results.Unauthorized();

                var order = await context.ServiceOrders.FindAsync(id);
                if (order == null) return Results.NotFound();

                var observation = new ServiceOrderObservation
                {
                    Id = Guid.NewGuid(),
                    ServiceOrderId = id,
                    Text = request.Text,
                    ObservationType = request.ObservationType ?? "General",
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow
                };

                context.ServiceOrderObservations.Add(observation);
                await context.SaveChangesAsync();
                
                var user = await context.Users.FindAsync(userId);
                var userName = user?.Name ?? userId.ToString();

                return Results.Ok(new { observation.Id, observation.Text, observation.ObservationType, UserName = userName, observation.CreatedAt });
            }
            catch (Exception ex)
            {
                return Results.Problem(detail: ex.InnerException?.Message ?? ex.Message, title: "Error al agregar observación", statusCode: 500);
            }
        })
        .WithName("AddServiceOrderObservation")
        .WithOpenApi();

        group.MapDelete("/{id:guid}/observations/{obsId:guid}", async (Guid id, Guid obsId, HttpContext httpContext, GeoServDbContext context) =>
        {
            var userIdStr = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Results.Unauthorized();

            var observation = await context.ServiceOrderObservations.FirstOrDefaultAsync(o => o.Id == obsId && o.ServiceOrderId == id);
            if (observation == null) return Results.NotFound();

            // Check if user is admin or the owner of the observation
            var user = await context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Role?.Name != "Administrador" && observation.UserId != userId)
            {
                return Results.Forbid();
            }

            context.ServiceOrderObservations.Remove(observation);
            await context.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("DeleteServiceOrderObservation")
        .WithOpenApi();
    }

    public static async Task<IResult> DeliverServiceOrderAsync(Guid id, Guid? userId, GeoServDbContext context)
    {
        try
        {
            var order = await context.ServiceOrders
                .Include(o => o.Status)
                .Include(o => o.Responsibles)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return Results.NotFound();
            }

            if (!string.Equals(order.Status?.Name, "Iniciada", StringComparison.OrdinalIgnoreCase))
            {
                return Results.BadRequest(new { message = "Solo se pueden marcar como entregadas las órdenes en estado 'Iniciada'." });
            }

            var entregadaStatus = await context.ServiceOrderStatuses
                .FirstOrDefaultAsync(s => s.Name.ToLower() == "entregada");

            if (entregadaStatus == null)
            {
                return Results.Problem("El estado 'Entregada' no está configurado en el sistema.", statusCode: 500);
            }

            // Asignación automática de fechas reales
            var resolvedActualEndDate = order.ActualEndDate ?? DateTime.UtcNow.Date;
            var resolvedActualStartDate = order.ActualStartDate ?? order.EstimatedStartDate ?? resolvedActualEndDate;

            var responsibleIds = order.Responsibles.Select(r => r.ResponsibleId).ToList();

            var validationError = ValidateServiceOrderRules(
                entregadaStatus.Name,
                order.ClientId,
                order.ProjectId,
                order.RequestDate,
                order.EstimatedStartDate,
                order.EstimatedEndDate,
                resolvedActualStartDate,
                resolvedActualEndDate,
                order.BudgetedAmount,
                order.TotalAmount,
                responsibleIds
            );

            if (validationError != null)
            {
                return Results.BadRequest(new { message = validationError });
            }

            order.StatusId = entregadaStatus.Id;
            order.Status = entregadaStatus;
            order.ActualStartDate = resolvedActualStartDate;
            order.ActualEndDate = resolvedActualEndDate;
            order.UpdatedAt = DateTime.UtcNow;

            // Registrar observación tipo Hito Clave
            Guid finalUserId;
            if (userId.HasValue && userId.Value != Guid.Empty)
            {
                finalUserId = userId.Value;
            }
            else
            {
                var fallbackUser = await context.Users.FirstOrDefaultAsync();
                finalUserId = fallbackUser?.Id ?? Guid.NewGuid();
            }

            var observation = new ServiceOrderObservation
            {
                Id = Guid.NewGuid(),
                ServiceOrderId = order.Id,
                Text = $"Orden marcada como entregada. Fecha inicio real: {resolvedActualStartDate:dd/MM/yyyy}, Fecha fin real: {resolvedActualEndDate:dd/MM/yyyy}.",
                ObservationType = "Hito Clave",
                UserId = finalUserId,
                CreatedAt = DateTime.UtcNow
            };

            context.ServiceOrderObservations.Add(observation);
            await context.SaveChangesAsync();

            return Results.Ok(new
            {
                message = "Orden de servicio marcada como entregada exitosamente.",
                order.Id,
                order.OrderNumber,
                StatusId = entregadaStatus.Id,
                StatusName = entregadaStatus.Name,
                ActualStartDate = order.ActualStartDate,
                ActualEndDate = order.ActualEndDate
            });
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.InnerException?.Message ?? ex.Message, title: "Error al marcar orden como entregada", statusCode: 500);
        }
    }

    public static string? ValidateServiceOrderRules(
        string? statusName,
        Guid clientId,
        Guid? projectId,
        DateTime? requestDate,
        DateTime? estimatedStartDate,
        DateTime? estimatedEndDate,
        DateTime? actualStartDate,
        DateTime? actualEndDate,
        decimal budgetedAmount,
        decimal totalAmount,
        List<Guid>? responsibleIds)
    {
        var isEntregada = string.Equals(statusName, "Entregada", StringComparison.OrdinalIgnoreCase);
        var isCobrada = string.Equals(statusName, "Cobrada", StringComparison.OrdinalIgnoreCase);

        // a- Si se coloca una fecha de entrega, el estado debe ser "Entregada" o "Cobrada"
        if (actualEndDate.HasValue && !isEntregada && !isCobrada)
        {
            return "Si se define una fecha de entrega / fin real, el estado de la orden debe ser 'Entregada' o 'Cobrada'.";
        }

        // b- fin presupuestado, no puede ser anterior a inicio presupuestado.
        if (estimatedStartDate.HasValue && estimatedEndDate.HasValue && estimatedEndDate.Value.Date < estimatedStartDate.Value.Date)
        {
            return "La fecha de fin presupuestado no puede ser anterior a la de inicio presupuestado.";
        }

        // c- fin real (cuando se carga), no debe ser anterior a inicio real
        if (actualStartDate.HasValue && actualEndDate.HasValue && actualEndDate.Value.Date < actualStartDate.Value.Date)
        {
            return "La fecha de fin real no puede ser anterior a la de inicio real.";
        }

        // fin real (cuando se carga), no debe ser posterior a la fecha actual
        if (actualEndDate.HasValue && actualEndDate.Value.Date > DateTime.UtcNow.Date)
        {
            return "La fecha de fin real no puede ser posterior a la fecha actual.";
        }

        // d- Si una orden se cambia el estado a entregada o cobrada, debe validar que tenga cargado el proyecto, cliente, todas las fechas excepto fecha de cobro, todos los montos excepto monto cobrado y descuento, equipo de trabajo.
        if (isEntregada || isCobrada)
        {
            var statusLabel = isCobrada ? "Cobrada" : "Entregada";
            if (!projectId.HasValue || projectId == Guid.Empty)
            {
                return $"Para guardar la orden en estado {statusLabel}, debe asignar un proyecto.";
            }
            if (clientId == Guid.Empty)
            {
                return $"Para guardar la orden en estado {statusLabel}, debe asignar un cliente.";
            }
            if (!requestDate.HasValue || !estimatedStartDate.HasValue || !estimatedEndDate.HasValue || !actualStartDate.HasValue || !actualEndDate.HasValue)
            {
                return $"Para guardar la orden en estado {statusLabel}, deben cargarse todas las fechas (Fecha de Solicitud, Inicio Presupuestado, Fin Presupuestado, Inicio Real y Fin Real).";
            }
            if (budgetedAmount <= 0 || totalAmount <= 0)
            {
                return $"Para guardar la orden en estado {statusLabel}, los montos presupuestado y total deben ser mayores a 0.";
            }
            if (responsibleIds == null || !responsibleIds.Any())
            {
                return $"Para guardar la orden en estado {statusLabel}, debe asignar al menos un responsable al equipo de trabajo.";
            }
        }

        return null;
    }
}

// DTOs
public record AddObservationRequest(string Text, string? ObservationType);
public record CreateServiceOrderRequest(
    string OrderNumber,
    Guid ClientId,
    Guid? ProjectId,
    Guid ServiceTypeId,
    Guid StatusId,
    int Priority,
    string? Description,
    string? BudgetedTasksDetail,
    Guid CurrencyId,
    decimal? ForeignAmount,
    decimal? ExchangeRateAtBudget,
    decimal BudgetedAmount,
    decimal Discount,
    decimal TotalAmount,
    DateTime? RequestDate,
    DateTime? EstimatedStartDate,
    DateTime? EstimatedEndDate,
    DateTime? ActualStartDate = null,
    DateTime? ActualEndDate = null,
    DateTime? CollectionDate = null,
    List<DistributionDto>? Distributions = null,
    List<ActivityDto>? Activities = null,
    List<Guid>? ResponsibleIds = null
);

public record UpdateServiceOrderRequest(
    string OrderNumber,
    Guid ClientId,
    Guid? ProjectId,
    Guid ServiceTypeId,
    Guid StatusId,
    int Priority,
    string? Description,
    string? BudgetedTasksDetail,
    Guid CurrencyId,
    decimal? ForeignAmount,
    decimal? ExchangeRateAtBudget,
    decimal? ExchangeRateAtCollection,
    decimal BudgetedAmount,
    decimal Discount,
    decimal TotalAmount,
    decimal CollectedAmount,
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

public record DistributionDto(Guid DistributionConceptId, decimal Percentage, decimal ExpectedAmount, decimal ActualAmount, int OrderIndex = 0);
public record ActivityDto(string ShortDetail, string? LongDetail, string State, int ProgressPercentage, int OrderIndex = 0);
