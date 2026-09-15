namespace GeoServ.Api.Domain.Entities;

public class UserMenuFavorite
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string MenuPath { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
