using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class CheckEndpoints
{
    public static void MapCheckEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/checks").RequireAuthorization();

        group.MapGet("/", async (GeoServDbContext context) =>
        {
            var checks = await context.Checks
                .Include(c => c.ReceivedFromClient)
                .OrderByDescending(c => c.DueDate)
                .Select(c => new
                {
                    c.Id,
                    c.CheckNumber,
                    c.BankName,
                    c.IssuerName,
                    c.Amount,
                    c.IssueDate,
                    c.DueDate,
                    c.Status,
                    c.ReceivedFromClientId,
                    ClientName = c.ReceivedFromClient != null ? c.ReceivedFromClient.CompanyName : null,
                    c.Observations
                })
                .ToListAsync();
            return Results.Ok(checks);
        }).WithName("GetChecks").WithOpenApi();

        group.MapPost("/", async (CreateCheckRequest request, GeoServDbContext context) =>
        {
            var check = new Check
            {
                Id = Guid.NewGuid(),
                CheckNumber = request.CheckNumber,
                BankName = request.BankName,
                IssuerName = request.IssuerName,
                Amount = request.Amount,
                IssueDate = request.IssueDate.ToUniversalTime(),
                DueDate = request.DueDate.ToUniversalTime(),
                Status = request.Status,
                ReceivedFromClientId = request.ReceivedFromClientId,
                Observations = request.Observations
            };
            context.Checks.Add(check);
            await context.SaveChangesAsync();
            return Results.Created($"/api/checks/{check.Id}", check);
        }).WithName("CreateCheck").WithOpenApi();

        group.MapPut("/{id:guid}", async (Guid id, UpdateCheckRequest request, GeoServDbContext context) =>
        {
            var check = await context.Checks.FindAsync(id);
            if (check is null) return Results.NotFound();

            check.CheckNumber = request.CheckNumber;
            check.BankName = request.BankName;
            check.IssuerName = request.IssuerName;
            check.Amount = request.Amount;
            check.IssueDate = request.IssueDate.ToUniversalTime();
            check.DueDate = request.DueDate.ToUniversalTime();
            check.Status = request.Status;
            check.ReceivedFromClientId = request.ReceivedFromClientId;
            check.Observations = request.Observations;

            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("UpdateCheck").WithOpenApi();

        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var check = await context.Checks.FindAsync(id);
            if (check is null) return Results.NotFound();
            context.Checks.Remove(check);
            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("DeleteCheck").WithOpenApi();
    }
}

public class CreateCheckRequest
{
    public string CheckNumber { get; set; } = string.Empty;
    public string BankName { get; set; } = string.Empty;
    public string IssuerName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime DueDate { get; set; }
    public CheckStatus Status { get; set; } = CheckStatus.InPortfolio;
    public Guid? ReceivedFromClientId { get; set; }
    public string? Observations { get; set; }
}

public class UpdateCheckRequest
{
    public string CheckNumber { get; set; } = string.Empty;
    public string BankName { get; set; } = string.Empty;
    public string IssuerName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime DueDate { get; set; }
    public CheckStatus Status { get; set; }
    public Guid? ReceivedFromClientId { get; set; }
    public string? Observations { get; set; }
}
