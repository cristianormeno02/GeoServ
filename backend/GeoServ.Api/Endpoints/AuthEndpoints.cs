using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GeoServ.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app, IConfiguration configuration)
    {
        app.MapPost("/api/login", async (LoginRequest request, GeoServDbContext context) =>
        {
            // Nota: Aquí estamos usando el context que YA está configurado 
            // apuntando a la base de datos correcta porque el ITenantService 
            // leyó el header "X-Tenant-Id" (que el front debe enviar en esta petición)
            
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Results.Unauthorized();
            }

            // Generar Token
            var jwtSettings = configuration.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("Jwt Key is missing"));
            
            // Para poder propagar el tenant en las futuras peticiones, agregamos el claim.
            // El TenantId viene en el request (o a través del ITenantService que lo sacó del Header)
            var tenantId = request.TenantId;
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Name ?? ""),
                    new Claim("TenantId", tenantId) // Inyectamos el tenant en el token
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Results.Ok(new
            {
                Token = tokenHandler.WriteToken(token),
                User = new { user.Id, user.Name, user.Email }
            });
        })
        .WithName("Login")
        .WithOpenApi();
    }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string TenantId { get; set; } = string.Empty; // Ej. "geocobre"
}
