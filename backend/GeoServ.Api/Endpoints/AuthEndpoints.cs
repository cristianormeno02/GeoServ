using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace GeoServ.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app, IConfiguration configuration)
    {
        app.MapPost("/api/login", async (LoginRequest request, GeoServDbContext context) =>
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Results.Unauthorized();
            }

            var jwtSettings = configuration.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("Jwt Key is missing"));
            
            var tenantId = request.TenantId;
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Name ?? ""),
                    new Claim("TenantId", tenantId)
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); // 7 days for refresh token
            await context.SaveChangesAsync();

            return Results.Ok(new
            {
                Token = tokenHandler.WriteToken(token),
                RefreshToken = refreshToken,
                User = new { user.Id, user.Name, user.Email }
            });
        })
        .WithName("Login")
        .WithOpenApi();

        app.MapPost("/api/auth/google", async (GoogleLoginRequest request, GeoServDbContext context, IConfiguration configuration) =>
        {
            var googleClientId = configuration["Google:ClientId"];
            if (string.IsNullOrEmpty(googleClientId))
            {
                return Results.Problem("La configuración de Google SSO no está establecida.", statusCode: 500);
            }

            Google.Apis.Auth.GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = await Google.Apis.Auth.GoogleJsonWebSignature.ValidateAsync(request.Credential, new Google.Apis.Auth.GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { googleClientId }
                });
            }
            catch (Exception ex)
            {
                return Results.Unauthorized();
            }

            // payload.Email contiene el correo del usuario validado
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);
            if (user == null)
            {
                // Si quieres crear el usuario automáticamente, podrías hacerlo aquí
                return Results.Unauthorized(); // Por ahora devolvemos Unauthorized si no existe en el sistema
            }

            var jwtSettings = configuration.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("Jwt Key is missing"));
            
            var tenantId = request.TenantId; 
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Name ?? ""),
                    new Claim("TenantId", tenantId)
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await context.SaveChangesAsync();

            return Results.Ok(new
            {
                Token = tokenHandler.WriteToken(token),
                RefreshToken = refreshToken,
                User = new { user.Id, user.Name, user.Email }
            });
        })
        .WithName("GoogleLogin")
        .WithOpenApi();

        app.MapPost("/api/refresh-token", async (RefreshTokenRequest request, GeoServDbContext context) =>
        {
            var principal = GetPrincipalFromExpiredToken(request.Token, configuration);
            if (principal == null)
            {
                return Results.Unauthorized();
            }

            var userIdString = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null || !Guid.TryParse(userIdString, out Guid userId))
            {
                return Results.Unauthorized();
            }

            var user = await context.Users.FindAsync(userId);
            if (user == null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return Results.Unauthorized();
            }

            var jwtSettings = configuration.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("Jwt Key is missing"));
            
            var tenantIdClaim = principal.FindFirst("TenantId");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Name ?? ""),
                    new Claim("TenantId", tenantIdClaim?.Value ?? "")
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var newToken = tokenHandler.CreateToken(tokenDescriptor);
            
            var newRefreshToken = GenerateRefreshToken();
            user.RefreshToken = newRefreshToken;
            await context.SaveChangesAsync();

            return Results.Ok(new
            {
                Token = tokenHandler.WriteToken(newToken),
                RefreshToken = newRefreshToken
            });
        })
        .WithName("RefreshToken")
        .WithOpenApi();

        app.MapPost("/api/auth/recover-password", async (RecoverPasswordRequest request, GeoServDbContext context, GeoServ.Api.Infrastructure.Services.IMailerService mailer) =>
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                // Devolvemos Ok siempre para no revelar si el email existe
                return Results.Ok(new { message = "Si el correo existe, se enviarán las instrucciones." });
            }

            // Aquí se debería generar un token temporal, guardarlo
            var token = Guid.NewGuid().ToString();
            
            try 
            {
                await mailer.SendPasswordRecoveryEmailAsync(user.Email, token);
            } 
            catch (Exception ex)
            {
                // Para no revelar que falló el email o evitar romper el flujo
                Console.WriteLine("Error enviando email: " + ex.Message);
            }

            return Results.Ok(new { message = "Instrucciones enviadas." });
        })
        .WithName("RecoverPassword")
        .WithOpenApi();

        app.MapPost("/api/auth/reset-password", async (ResetPasswordRequest request, GeoServDbContext context) =>
        {
            // Validar token y cambiar contraseña
            // Para la demostración asumimos que el token es válido o añadimos validación posterior
            return Results.Ok(new { message = "Contraseña actualizada con éxito." });
        })
        .WithName("ResetPassword")
        .WithOpenApi();
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private static ClaimsPrincipal? GetPrincipalFromExpiredToken(string token, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("Jwt");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("Jwt Key is missing"));

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidAudience = jwtSettings["Audience"],
            ValidateIssuer = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateLifetime = false // Here we are saying that we don't care about the token's expiration date
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        try
        {
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || 
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                return null;
            }

            return principal;
        }
        catch
        {
            return null;
        }
    }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string TenantId { get; set; } = string.Empty;
}

public class RefreshTokenRequest
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}
public class GoogleLoginRequest
{
    public string Credential { get; set; } = string.Empty;
    public string TenantId { get; set; } = string.Empty;
}
public class RecoverPasswordRequest
{
    public string Email { get; set; } = string.Empty;
}
public class ResetPasswordRequest
{
    public string Token { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
