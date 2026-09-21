using System.Security.Claims;
using GeoServ.Api.Infrastructure.Services;

namespace GeoServ.Api.Endpoints;

public static class AlertCenterEndpoints
{
    public static void MapAlertCenterEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/alert-center").RequireAuthorization();

        group.MapGet("/", async (
            string? type,
            string? priority,
            string? state,
            string? search,
            int? page,
            int? pageSize,
            ClaimsPrincipal user,
            IAlertCenterService service,
            CancellationToken cancellationToken) =>
        {
            var result = await service.GetAlertsAsync(
                new AlertCenterQuery(type, priority, state, search, page ?? 1, pageSize ?? 25),
                GetUserId(user),
                cancellationToken);

            return Results.Ok(result);
        }).WithName("GetAlertCenter").WithOpenApi();

        group.MapGet("/summary", async (
            ClaimsPrincipal user,
            IAlertCenterService service,
            CancellationToken cancellationToken) =>
        {
            var result = await service.GetSummaryAsync(GetUserId(user), cancellationToken);
            return Results.Ok(result);
        }).WithName("GetAlertCenterSummary").WithOpenApi();

        group.MapPatch("/{alertKey}", async (
            string alertKey,
            UpdateAlertStateRequest request,
            ClaimsPrincipal user,
            IAlertCenterService service,
            CancellationToken cancellationToken) =>
        {
            var result = await service.UpdateStateAsync(alertKey, request, GetUserId(user), cancellationToken);
            return result == null
                ? Results.BadRequest(new { message = "Estado de alerta invalido." })
                : Results.Ok(result);
        }).WithName("UpdateAlertState").WithOpenApi();
    }

    private static Guid? GetUserId(ClaimsPrincipal user)
    {
        var value = user.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(value, out var userId) ? userId : null;
    }
}
